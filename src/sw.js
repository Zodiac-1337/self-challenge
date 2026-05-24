import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";

// Workbox precaching — инжектируется vite-plugin-pwa
precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

// ── Push notification handler ──────────────────────────────────────────────
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json()

  event.waitUntil(
    self.registration.showNotification(data.title ?? 'Self-Challenge', {
      body:      data.body,
      icon:      '/icons/icon-192.png',
      badge:     '/favicon.svg',
      tag:       'challenge-reminder',
      renotify:  true,
      vibrate:   [200, 100, 200],
      data:      { url: '/' },
    })
  )
})

// ── Notification click — открывает/фокусирует приложение ──────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Если вкладка уже открыта — фокусируем
        for (const client of clientList) {
          if ('focus' in client) return client.focus()
        }
        // Иначе открываем новую
        return clients.openWindow('/')
      })
  )
})
