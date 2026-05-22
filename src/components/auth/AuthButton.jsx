import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import AuthModal    from './AuthModal'

export default function AuthButton({ user, loading, syncing, signIn, signOut, syncNow }) {
  const [showModal,    setShowModal]    = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  // Supabase не настроен — ничего не рендерим
  if (!supabase || loading) return null

  if (!user) {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1 text-[12px] px-3 py-[6px] rounded-lg border"
          style={{ color: 'var(--color-muted)', borderColor: 'var(--color-line)',
                   background: 'none', cursor: 'pointer' }}
        >
          🔗 Синхронизация
        </button>

        {showModal && (
          <AuthModal signIn={signIn} onClose={() => setShowModal(false)} />
        )}
      </>
    )
  }

  const shortEmail = user.email?.split('@')[0] ?? '...'

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowDropdown(s => !s)}
        className="flex items-center gap-1 text-[12px] px-3 py-[6px] rounded-lg border"
        style={{ color: 'var(--color-ok)', borderColor: '#00c85133',
                 background: '#00c85108', cursor: 'pointer' }}
      >
        {syncing
          ? <><span className="animate-spin inline-block">⟳</span>&nbsp;Синхронизация...</>
          : <>✓ {shortEmail}</>
        }
      </button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0  }}
            exit={{    opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            style={{ position: 'absolute', top: '110%', right: 0, zIndex: 50,
              background: 'var(--color-surface)', border: '1px solid var(--color-line)',
              borderRadius: '12px', padding: '8px', minWidth: '170px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
          >
            <p className="text-[11px] m-0 px-2 py-1 truncate"
               style={{ color: 'var(--color-muted)' }}>
              {user.email}
            </p>
            <hr style={{ border: 'none', borderTop: '1px solid var(--color-line)', margin: '6px 0' }} />
            <button onClick={() => { syncNow(); setShowDropdown(false) }}
              className="w-full text-left px-2 py-[6px] text-[13px] rounded-lg"
              style={{ background: 'none', border: 'none', cursor: 'pointer',
                       color: 'var(--color-fg)' }}>
              🔄 Синхронизировать
            </button>
            <button onClick={() => { signOut(); setShowDropdown(false) }}
              className="w-full text-left px-2 py-[6px] text-[13px] rounded-lg"
              style={{ background: 'none', border: 'none', cursor: 'pointer',
                       color: 'var(--color-accent)' }}>
              Выйти
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
