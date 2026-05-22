import { supabase }          from './supabase'
import { useChallengeStore } from '../store/challengeStore'

// ─── Row mappers ──────────────────────────────────────────────────────────────
const toRow = (c, userId) => ({
  id:                c.id,
  user_id:           userId,
  title:             c.title,
  description:       c.description ?? '',
  deadline:          c.deadline,
  failure_condition: c.failureCondition,
  reward:            c.reward,
  stake:             c.stake,
  difficulty:        c.difficulty,
  notes:             c.notes ?? [],
  target:            c.target ?? null,
  status:            c.status,
  created_at:        c.createdAt,
  completed_at:      c.completedAt ?? null,
  failure_note:      c.failureNote ?? null,
  xp_earned:         c.xpEarned ?? 0,
  saved_hours:       c.savedHours ?? 0,
})

const fromRow = (r) => ({
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
})

// ─── Merge: union, Supabase wins on id conflict ───────────────────────────────
function merge(local, remote) {
  const map = new Map(local.map(c => [c.id, c]))
  remote.forEach(r => map.set(r.id, r)) // remote overwrites
  return Array.from(map.values())
}

// ─── Main sync function ───────────────────────────────────────────────────────
export async function syncWithSupabase(userId) {
  if (!supabase) return

  const state = useChallengeStore.getState()

  // 1. Upload local → Supabase (upsert — идемпотентно)
  const rows = state.challenges.map(c => toRow(c, userId))
  if (rows.length > 0) {
    await supabase.from('challenges').upsert(rows, { onConflict: 'id' })
  }

  await supabase.from('user_stats').upsert({
    user_id:     userId,
    streak:      state.streak,
    best_streak: state.bestStreak ?? 0,
    total_xp:    state.totalXP,
  })

  // 2. Download Supabase → local
  const { data: remoteChallenges } = await supabase
    .from('challenges')
    .select('*')
    .eq('user_id', userId)

  const { data: remoteStats } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  // 3. Merge и обновляем store
  const merged = merge(state.challenges, (remoteChallenges ?? []).map(fromRow))

  useChallengeStore.setState({
    challenges: merged,
    streak:     remoteStats?.streak      ?? state.streak,
    bestStreak: remoteStats?.best_streak ?? state.bestStreak,
    totalXP:    remoteStats?.total_xp    ?? state.totalXP,
  })
}
