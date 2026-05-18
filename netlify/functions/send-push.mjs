import webpush from 'web-push'
import { getStore } from '@netlify/blobs'

// Настраиваем web-push с VAPID ключами из переменных окружения
webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY,
)

const HOUR = 60 * 60 * 1000
const MIN  = 60 * 1000

// Окно проверки — ±3 минуты от целевого времени (с учётом cron каждые 5 мин)
const inWindow = (ms, target) => ms > target - 3 * MIN && ms <= target + 3 * MIN

async function sendPush(subscription, payload) {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload))
    return true
  } catch (err) {
    // 410 Gone = подписка устарела, можно удалить
    if (err.statusCode === 410) return 'expired'
    console.warn('[send-push] Push failed:', err.message)
    return false
  }
}

export default async () => {
  // Проверяем что VAPID настроен
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    console.error('[send-push] VAPID keys not configured')
    return
  }

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
    const raw = await store.get(blob.key, { type: 'json' })
    if (!raw) continue

    const data       = raw
    const timeUntil  = new Date(data.deadline) - now
    let   updated    = false

    // Дедлайн прошёл — чистим
    if (timeUntil <= 0) {
      await store.delete(blob.key)
      continue
    }

    // Уведомление за 1 час
    if (!data.notified1h && inWindow(timeUntil, HOUR)) {
      const mins = Math.round(timeUntil / MIN)
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

    // Сохраняем обновлённый статус
    if (updated) await store.setJSON(blob.key, data)
  }
}

// Запускается каждые 5 минут
export const config = { schedule: '*/5 * * * *' }
