import { getStore } from '@netlify/blobs'

export default async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  try {
    const { subscription, challengeId, deadline, title } = await req.json()

    if (!subscription || !challengeId || !deadline) {
      return new Response('Missing required fields', { status: 400 })
    }

    const store = getStore('push-subscriptions')

    await store.setJSON(challengeId, {
      subscription,
      deadline,
      title,
      notified1h:  false,
      notified15m: false,
      createdAt:   new Date().toISOString(),
    })

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[subscribe] Error:', err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}

export const config = { path: '/api/subscribe' }
