import { supabase } from '../lib/supabase'
import { useChallengeStore } from '../store/challengeStore'

// ── Маппинг camelCase ↔ snake_case ───────────────────────────────────────

function toRow(c, userId) {
  return {
    id:                c.id,
    user_id:           userId,
    title:             c.title,
    description:       c.description ?? '',
    deadline:          c.deadline,
    failure_condition: c.failureCondition,
    reward:            c.reward,
    stake:             c.stake ?? '',
    difficulty:        c.difficulty,
    notes:             c.notes ?? [],
    status:            c.status,
    created_at:        c.createdAt,
    completed_at:      c.completedAt ?? null,
    failure_note:      c.failureNote ?? null,
    xp_earned:         c.xpEarned ?? 0,
    saved_hours:       c.savedHours ?? 0,
    target:            c.target ?? null,
    updated_at:        new Date().toISOString(),
  }
}

function fromRow(row) {
  return {
    id:               row.id,
    title:            row.title,
    description:      row.description ?? '',
    deadline:         row.deadline,
    failureCondition: row.failure_condition ?? 'Не выполнил задачу',
    reward:           row.reward ?? 'Гордость за себя',
    stake:            row.stake ?? '',
    difficulty:       row.difficulty ?? 'medium',
    notes:            row.notes ?? [],
    status:           row.status,
    createdAt:        row.created_at,
    completedAt:      row.completed_at ?? null,
    failureNote:      row.failure_note ?? null,
    xpEarned:         row.xp_earned ?? 0,
    savedHours:       row.saved_hours ?? 0,
    target:           row.target ?? null,
  }
}

// ── Merge: объединяем local и remote, побеждает более свежий ────────────

function mergeChallenges(local, remote) {
  const map = new Map()
  local.forEach(c => map.set(c.id, c))
  // Remote перезаписывает local (source of truth — сервер)
  remote.forEach(r => map.set(r.id, r))
  return Array.from(map.values())
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

// ── Главная функция синхронизации ────────────────────────────────────────

export async function syncWithSupabase(userId) {
  if (!supabase) throw new Error('Supabase не настроен')

  const state = useChallengeStore.getState()

  // 1. Загружаем локальные данные на сервер (upsert)
  if (state.challenges.length > 0) {
    const rows = state.challenges.map(c => toRow(c, userId))
    const { error } = await supabase
      .from('challenges')
      .upsert(rows, { onConflict: 'id' })
    if (error) console.warn('[sync] upload error:', error.message)
  }

  // Загружаем stats
  await supabase.from('user_stats').upsert({
    user_id:     userId,
    streak:      state.streak,
    best_streak: state.bestStreak ?? 0,
    total_xp:    state.totalXP,
    active_id:   state.activeId,
    updated_at:  new Date().toISOString(),
  }, { onConflict: 'user_id' })

  // 2. Скачиваем данные с сервера
  const { data: remoteRows } = await supabase
    .from('challenges')
    .select('*')
    .eq('user_id', userId)

  const { data: remoteStats } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single()

  // 3. Мержим и обновляем store
  const remote   = (remoteRows ?? []).map(fromRow)
  const merged   = mergeChallenges(state.challenges, remote)
  const stats    = remoteStats ?? {}

  useChallengeStore.setState({
    challenges: merged,
    activeId:   stats.active_id ?? state.activeId,
    streak:     Math.max(state.streak,      stats.streak      ?? 0),
    bestStreak: Math.max(state.bestStreak ?? 0, stats.best_streak ?? 0),
    totalXP:    Math.max(state.totalXP,     stats.total_xp    ?? 0),
  })
}
