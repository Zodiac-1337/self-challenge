export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'ANTHROPIC_API_KEY не настроен в переменных окружения Netlify' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    )
  }

  let title, description
  try {
    ;({ title, description } = await req.json())
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 })
  }

  if (!title?.trim()) {
    return new Response(JSON.stringify({ error: 'title is required' }), { status: 400 })
  }

  const prompt = `Я создаю персональный челлендж: "${title}"${description?.trim() ? `\nДетали: "${description}"` : ''}

Предложи конкретные:
1. Условие провала — чёткий критерий что считать провалом (1–2 предложения, без воды)
2. Награда за победу — конкретная и личная мотивация (1 предложение)

Отвечай ТОЛЬКО в JSON без markdown и преамбулы:
{"failureCondition": "...", "reward": "..."}`

  let claudeRes
  try {
    claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages:   [{ role: 'user', content: prompt }],
      }),
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Сеть недоступна' }), { status: 502 })
  }

  if (!claudeRes.ok) {
    const body = await claudeRes.text()
    console.error('[ai-suggest] Claude API error:', claudeRes.status, body)
    return new Response(JSON.stringify({ error: 'Claude API вернул ошибку' }), { status: 502 })
  }

  const data = await claudeRes.json()
  const text = data.content?.[0]?.text ?? ''

  try {
    // Claude может добавить ```json ... ``` — чистим
    const clean  = text.replace(/```json\n?|```/g, '').trim()
    const parsed = JSON.parse(clean)
    if (!parsed.failureCondition || !parsed.reward) throw new Error('Incomplete')
    return new Response(JSON.stringify(parsed), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch {
    console.error('[ai-suggest] Parse error. Raw text:', text)
    return new Response(JSON.stringify({ error: 'Не удалось разобрать ответ AI' }), { status: 502 })
  }
}

export const config = { path: '/api/ai-suggest' }
