// Конвертация base64url → Uint8Array (нужно для applicationServerKey)
function urlBase64ToUint8Array(base64) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const b64     = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw     = atob(b64)
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)))
}

/**
 * Запрашивает разрешение на уведомления и отправляет подписку на сервер.
 * Нефатальная — при любой ошибке тихо проваливается.
 *
 * @param {{ id: string, title: string, deadline: string }} challenge
 */
export async function subscribeChallenge(challenge) {
  // Проверяем поддержку
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return

  const publicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY
  if (!publicKey) {
    console.warn('[push] VITE_VAPID_PUBLIC_KEY not set — skip push subscription')
    return
  }

  try {
    // Запрашиваем разрешение (браузер покажет нативный диалог)
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return

    // Ждём готовности Service Worker
    const reg = await navigator.serviceWorker.ready

    // Получаем или создаём подписку
    let sub = await reg.pushManager.getSubscription()
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly:      true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      })
    }

    // Отправляем на сервер
    await fetch('/api/subscribe', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        subscription: sub.toJSON(),
        challengeId:  challenge.id,
        deadline:     challenge.deadline,
        title:        challenge.title,
      }),
    })
  } catch (err) {
    // Не блокируем пользователя — push необязателен
    console.warn('[push] Subscription failed:', err.message)
  }
}
