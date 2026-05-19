import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

const LEVELS = [
  { id: 'beginner', label: 'Beginner',    emoji: '🌱', minStreak: 0  },
  { id: 'bronze',   label: 'On a Roll',   emoji: '🔥', minStreak: 3  },
  { id: 'silver',   label: 'Unstoppable', emoji: '⚡', minStreak: 7  },
  { id: 'gold',     label: 'Legend',      emoji: '👑', minStreak: 15 },
]

const XP_TABLE = { easy: 10, medium: 25, hard: 50 }

function computeLevel(streak) {
  return [...LEVELS].reverse().find(l => streak >= l.minStreak) || LEVELS[0]
}

const useChallengeStore = create(
  persist(
    (set, get) => ({
      challenges: [],
      activeId:   null,
      streak:     0,
      totalXP:    0,

      createChallenge(data) {
        const id = uuidv4()
        const challenge = {
          id,
          title:            data.title,
          description:      data.description ?? '',
          deadline:         data.deadline,
          failureCondition: data.failureCondition ?? 'Не выполнил задачу',
          reward:           data.reward ?? 'Гордость за себя',
          stake:            data.stake ?? '',
          difficulty:       data.difficulty ?? 'medium',
          notes:            [],
          status:           'active',
          createdAt:        new Date().toISOString(),
          completedAt:      null,
          failureNote:      null,
          xpEarned:         0,
          // ── Прогресс-трекер ────────────────────────────────
          target: data.targetEnabled && data.targetValue
            ? { value: Number(data.targetValue), unit: data.targetUnit ?? '', current: 0 }
            : null,
          // ── Заметки ────────────────────────────────────────
          notes: [],
        }
        set(state => ({ challenges: [...state.challenges, challenge], activeId: id }))
        return id
      },

      completeChallenge(id) {
        const { challenges, streak } = get()
        const ch = challenges.find(c => c.id === id)
        if (!ch) return

        const completedAt = new Date().toISOString()
        const deadlineMs  = new Date(ch.deadline) - new Date(ch.createdAt)
        const usedMs      = new Date(completedAt)  - new Date(ch.createdAt)
        const savedHours  = Math.max(0, Math.floor((deadlineMs - usedMs) / 3_600_000))
        const baseXP      = XP_TABLE[ch.difficulty] ?? 25
        const xpEarned    = baseXP + savedHours * 5

        const prevLevel = computeLevel(streak)
        const newStreak = streak + 1
        const newLevel  = computeLevel(newStreak)

        set(state => ({
          challenges: state.challenges.map(c =>
            c.id === id ? { ...c, status: 'completed', completedAt, xpEarned, savedHours } : c
          ),
          activeId: null,
          streak:   newStreak,
          totalXP:  state.totalXP + xpEarned,
        }))

        return {
          xpEarned, savedHours, newStreak,
          level: newLevel, prevLevel,
          leveledUp:           newLevel.id !== prevLevel.id,
          challengeTitle:      ch.title,
          challengeDifficulty: ch.difficulty,
        }
      },

      failChallenge(id, failureNote = '') {
        set(state => ({
          challenges: state.challenges.map(c =>
            c.id === id
              ? { ...c, status: 'failed', completedAt: new Date().toISOString(), failureNote }
              : c
          ),
          activeId: null,
          streak:   0,
        }))
      },

      addNote(challengeId, text) {
        const note = { id: uuidv4(), text, createdAt: new Date().toISOString() }
        set(state => ({
          challenges: state.challenges.map(c =>
            c.id === challengeId ? { ...c, notes: [...(c.notes ?? []), note] } : c
          ),
        }))
      },

      deleteNote(challengeId, noteId) {
        set(state => ({
          challenges: state.challenges.map(c =>
            c.id === challengeId
              ? { ...c, notes: (c.notes ?? []).filter(n => n.id !== noteId) }
              : c
          ),
        }))
      },

      cancelChallenge(id) {
        set(state => ({
          challenges: state.challenges.filter(c => c.id !== id),
          activeId: null,
        }))
      },

      deleteChallenge(id) {
        set(state => ({ challenges: state.challenges.filter(c => c.id !== id) }))
      },

      // ── Прогресс-трекер ──────────────────────────────────────
      updateProgress(id, current) {
        set(state => ({
          challenges: state.challenges.map(c => {
            if (c.id !== id || !c.target) return c
            const clamped = Math.max(0, Math.min(current, c.target.value))
            return { ...c, target: { ...c.target, current: clamped } }
          }),
        }))
      },

      // ── Заметки ──────────────────────────────────────────────
      addNote(id, text) {
        const note = { id: uuidv4(), text: text.trim(), createdAt: new Date().toISOString() }
        set(state => ({
          challenges: state.challenges.map(c =>
            c.id === id ? { ...c, notes: [...(c.notes ?? []), note] } : c
          ),
        }))
      },

      deleteNote(challengeId, noteId) {
        set(state => ({
          challenges: state.challenges.map(c =>
            c.id === challengeId
              ? { ...c, notes: (c.notes ?? []).filter(n => n.id !== noteId) }
              : c
          ),
        }))
      },

      exportData() {
        const { challenges, streak, totalXP } = get()
        return JSON.stringify({ challenges, streak, totalXP }, null, 2)
      },
    }),
    { name: 'self-challenge-store', version: 2 }
  )
)

export { useChallengeStore, computeLevel, LEVELS, XP_TABLE }
