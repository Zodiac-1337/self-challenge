import { useState, useEffect } from 'react'
import { supabase }          from '../lib/supabase'
import { syncWithSupabase }  from '../lib/syncService'

export function useAuth() {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    if (!supabase) { setLoading(false); return }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const nextUser = session?.user ?? null
        setUser(nextUser)
        if (nextUser) {
          setSyncing(true)
          try   { await syncWithSupabase(nextUser.id) }
          catch (err) { console.warn('[sync] failed:', err.message) }
          finally     { setSyncing(false) }
        }
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email) => {
    if (!supabase) return { error: new Error('Supabase не настроен') }
    return supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    })
  }

  const signOut = () => supabase?.auth.signOut()

  const syncNow = async () => {
    if (!user) return
    setSyncing(true)
    try   { await syncWithSupabase(user.id) }
    finally { setSyncing(false) }
  }

  return { user, loading, syncing, signIn, signOut, syncNow }
}
