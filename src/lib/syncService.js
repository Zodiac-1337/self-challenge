import { supabase }          from './supabase'
import { useChallengeStore } from '../store/challengeStore'

// ─── Маппинг camelCase ↔ snake_case ──────────────────────────────────────────
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
    target:            c.target ?? null,
    status:            c.status,
    created_at:        c.createdAt,
    completed_at:      c.completedAt ?? null,
    failure_note:      c.failureNote ?? null,
    xp_earned:         c.xpEarned ?? 0,
    saved_hours:       c.savedHours ?? 0,
    updated_at:        new Date().toISOString(),
  }
}

function fromRow(r) {
  return {
    id:               r.id,
    title:            r.title,
    description:      r.description ?? '',
    deadline:         r.deadline,
    failureCondition: r.failure_condition ?? 'Не выполнил задачу',
    reward:           r.reward ?? 'Гордость за себя',
    stake:            r.stake ?? '',
    difficulty:       r.difficulty ?? 'medium',
    notes:            r.notes ?? [],
    target:           r.target ?? null,
    status:           r.status,
    createdAt:        r.created_at,
    completedAt:      r.completed_at ?? null,
    failureNote:      r.failure_note ?? null,
    xpEarned:         r.xp_earned ?? 0,
    savedHours:       r.saved_hours ?? 0,
  }
}

// ─── Merge: local + remote, remote побеждает при конфликте ───────────────────
function merge(local, remote) {
  const map = new Map(local.map(c => [c.id, c]))
  remote.forEach(r => map.set(r.id, r))
  return [...map.values()].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )
}

// ─── Главная функция синхронизации ───────────────────────────────────────────
export async function syncWithSupabase(userId) {
  if (!supabase) return

  const state = useChallengeStore.getState()

  // 1. Загружаем локальные данные на сервер
  if (state.challenges.length > 0) {
    const rows = state.challenges.map(c => toRow(c, userId))
    const { error } = await supabase
      .from('challenges')
      .upsert(rows, { onConflict: 'id' })
    if (error) console.warn('[sync] upload error:', error.message)
  }

  await supabase.from('user_stats').upsert({
    user_id:     userId,
    streak:      state.streak,
    best_streak: state.bestStreak ?? 0,
    total_xp:    state.totalXP,
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
    .maybeSingle()

  // 3. Мержим и обновляем store
  const merged = merge(state.challenges, (remoteRows ?? []).map(fromRow))
  const stats  = remoteStats ?? {}

  // activeId — берём из мержа (не храним в Supabase отдельно)
  const activeChallenge = merged.find(c => c.status === 'active')

  useChallengeStore.setState({
    challenges: merged,
    activeId:   activeChallenge?.id ?? null,
    streak:     Math.max(state.streak,       stats.streak      ?? 0),
    bestStreak: Math.max(state.bestStreak ?? 0, stats.best_streak ?? 0),
    totalXP:    Math.max(state.totalXP,      stats.total_xp    ?? 0),
  })
}
