import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AccentTheme, Language, Density, TodayCardVariant, MatrixLayout } from '../types/ui'
import { setLanguage } from '../lib/i18n'

interface SettingsState {
  accent: AccentTheme
  language: Language
  density: Density
  reducedMotion: boolean
  todayCardVariant: TodayCardVariant
  matrixLayout: MatrixLayout
  pomodoroDurationMins: number
  shortBreakMins: number
  longBreakMins: number
  pomosBeforeLongBreak: number

  setAccent: (accent: AccentTheme) => void
  setLanguage: (lang: Language) => void
  setDensity: (density: Density) => void
  setReducedMotion: (v: boolean) => void
  setTodayCardVariant: (v: TodayCardVariant) => void
  setMatrixLayout: (v: MatrixLayout) => void
  setPomodoroSettings: (v: {
    pomodoroDurationMins?: number
    shortBreakMins?: number
    longBreakMins?: number
    pomosBeforeLongBreak?: number
  }) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      accent: 'green',
      language: 'en',
      density: 'default',
      reducedMotion: false,
      todayCardVariant: 'classic',
      matrixLayout: '2x2',
      pomodoroDurationMins: 25,
      shortBreakMins: 5,
      longBreakMins: 15,
      pomosBeforeLongBreak: 4,

      setAccent: (accent) => {
        document.documentElement.setAttribute('data-accent', accent)
        set({ accent })
      },
      setLanguage: (language) => {
        setLanguage(language)
        set({ language })
      },
      setDensity: (density) => {
        document.documentElement.setAttribute('data-density', density)
        set({ density })
      },
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
      setTodayCardVariant: (todayCardVariant) => set({ todayCardVariant }),
      setMatrixLayout: (matrixLayout) => set({ matrixLayout }),
      setPomodoroSettings: (v) => set(v),
    }),
    { name: 'lumo-settings' },
  ),
)

export function applyStoredSettings() {
  const s = useSettingsStore.getState()
  document.documentElement.setAttribute('data-accent', s.accent)
  document.documentElement.setAttribute('data-density', s.density)
  setLanguage(s.language)
}
