import { useState } from 'react'

export function useAISuggest() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const suggest = async (title, description = '') => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/ai-suggest', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ title, description }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Ошибка AI')
      return data
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { suggest, loading, error }
}
