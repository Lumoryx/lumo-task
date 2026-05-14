import { create } from 'zustand'
import type { Task } from '../types/api'

type FocusPhase = 'pomodoro' | 'short_break' | 'long_break' | 'idle'

interface FocusState {
  phase: FocusPhase
  activeTask: Task | null
  sessionId: string | null
  secondsLeft: number
  totalSeconds: number
  isRunning: boolean
  completedPomos: number
  startedAt: number | null

  startSession: (task: Task, sessionId: string, durationMins: number) => void
  pauseResume: () => void
  tick: () => void
  endSession: () => void
  setPhase: (phase: FocusPhase, durationMins: number) => void
}

export const useFocusStore = create<FocusState>()((set, get) => ({
  phase: 'idle',
  activeTask: null,
  sessionId: null,
  secondsLeft: 0,
  totalSeconds: 0,
  isRunning: false,
  completedPomos: 0,
  startedAt: null,

  startSession: (task, sessionId, durationMins) => {
    const totalSeconds = durationMins * 60
    set({
      phase: 'pomodoro',
      activeTask: task,
      sessionId,
      secondsLeft: totalSeconds,
      totalSeconds,
      isRunning: true,
      startedAt: Date.now(),
    })
  },

  pauseResume: () => set(s => ({ isRunning: !s.isRunning })),

  tick: () => {
    const s = get()
    if (!s.isRunning || s.secondsLeft <= 0) return
    const next = s.secondsLeft - 1
    if (next <= 0) {
      set({
        secondsLeft: 0,
        isRunning: false,
        completedPomos: s.phase === 'pomodoro' ? s.completedPomos + 1 : s.completedPomos,
      })
    } else {
      set({ secondsLeft: next })
    }
  },

  endSession: () =>
    set({
      phase: 'idle',
      activeTask: null,
      sessionId: null,
      secondsLeft: 0,
      totalSeconds: 0,
      isRunning: false,
      startedAt: null,
    }),

  setPhase: (phase, durationMins) => {
    const totalSeconds = durationMins * 60
    set({ phase, secondsLeft: totalSeconds, totalSeconds, isRunning: false })
  },
}))
