import webpush from 'web-push'
import { getStore } from '@netlify/blobs'

const HOUR = 60 * 60 * 1000
const MIN  = 60 * 1000

// Окно ±3 минуты (cron каждые 5 мин)
const inWindow = (ms, target) => ms > target - 3 * MIN && ms <= target + 3 * MIN

async function sendPush(subscription, payload) {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload))
    return true
  } catch (err) {
    if (err.statusCode === 410) return 'expired' // подписка устарела
    console.warn('[send-push] Push failed:', err.message)
    return false
  }
}

export default async () => {
  // ✅ Проверяем ключи ДО вызова setVapidDetails
  const { VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } = process.env

  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY || !VAPID_EMAIL) {
    console.error('[send-push] VAPID keys not configured — set VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY')
    return
  }

  // ✅ Настройка только если ключи есть
  webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

  let store
  try {
    store = getStore('push-subscriptions')
  } catch (err) {
    console.error('[send-push] Blobs unavailable:', err.message)
    return
  }

  const { blobs } = await store.list()
  const now = Date.now()

  for (const blob of blobs) {
    const data = await store.get(blob.key, { type: 'json' })
    if (!data) continue

    const timeUntil = new Date(data.deadline) - now
    let updated = false

    // Дедлайн прошёл — чистим запись
    if (timeUntil <= 0) {
      await store.delete(blob.key)
      continue
    }

    // Уведомление за 1 час
    if (!data.notified1h && inWindow(timeUntil, HOUR)) {
      const mins   = Math.round(timeUntil / MIN)
      const result = await sendPush(data.subscription, {
        title: '⏰ Self-Challenge',
        body:  `${mins} минут до дедлайна: «${data.title}»`,
      })
      if (result === 'expired') { await store.delete(blob.key); continue }
      if (result) { data.notified1h = true; updated = true }
    }

    // Уведомление за 15 минут
    if (!data.notified15m && inWindow(timeUntil, 15 * MIN)) {
      const result = await sendPush(data.subscription, {
        title: '🔥 Последний шанс!',
        body:  `15 минут до конца: «${data.title}»`,
      })
      if (result === 'expired') { await store.delete(blob.key); continue }
      if (result) { data.notified15m = true; updated = true }
    }

    if (updated) await store.setJSON(blob.key, data)
  }
}

export const config = { schedule: '*/5 * * * *' }
