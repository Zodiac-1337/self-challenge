export const inputStyle = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  padding: '14px 16px',
  color: 'var(--text)',
  fontSize: '15px',
  fontFamily: 'var(--font-body)',
  width: '100%',
  outline: 'none',
}

export const titleStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: '1.8rem',
  letterSpacing: '0.04em',
  margin: 0,
}

export const subStyle = {
  color: 'var(--text-muted)',
  fontSize: '14px',
  margin: '4px 0 0',
}

export const labelStyle = {
  fontSize: '14px',
  fontWeight: '600',
  color: 'var(--text)',
}

export const btnPrimaryStyle = (active = true) => ({
  background: active ? 'var(--accent)' : 'var(--surface-2)',
  color: active ? '#fff' : 'var(--text-muted)',
  border: 'none',
  borderRadius: '16px',
  padding: '18px',
  fontFamily: 'var(--font-display)',
  fontSize: '1.3rem',
  letterSpacing: '0.06em',
  cursor: active ? 'pointer' : 'not-allowed',
  transition: 'background 0.2s',
  width: '100%',
})

export const btnGhostStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--text-muted)',
  fontSize: '14px',
  cursor: 'pointer',
}
