import { useEffect, useRef, useState } from 'react'
import { useFocusStore } from '../../store/focus'
import { useTasksStore } from '../../store/tasks'
import { useSettingsStore } from '../../store/settings'
import { LumoStatus } from '../../components/ai/LumoStatus'
import { Btn } from '../../components/common/Btn'
import { SettlementModal } from './SettlementModal'
import styles from './Focus.module.css'

export function FocusScreen() {
  const {
    phase, activeTask, secondsLeft, totalSeconds, isRunning, completedPomos,
    startedAt, pauseResume, tick, endSession, setPhase,
  } = useFocusStore()
  const { shortBreakMins, longBreakMins, pomosBeforeLongBreak } = useSettingsStore()
  const { completeTask } = useTasksStore()
  const [showSettlement, setShowSettlement] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(tick, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isRunning, tick])

  useEffect(() => {
    if (secondsLeft === 0 && phase === 'pomodoro' && totalSeconds > 0) {
      setShowSettlement(true)
    }
  }, [secondsLeft, phase, totalSeconds])

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const ss = String(secondsLeft % 60).padStart(2, '0')
  const progress = totalSeconds > 0 ? 1 - secondsLeft / totalSeconds : 0
  const circumference = 2 * Math.PI * 110

  const handleAbandon = () => {
    endSession()
    setShowSettlement(false)
  }

  const handleSettlementDone = () => {
    if (activeTask) completeTask(activeTask.id)
    endSession()
    setShowSettlement(false)
  }

  const handleNextPhase = () => {
    const isLongBreak = completedPomos > 0 && completedPomos % pomosBeforeLongBreak === 0
    const next = isLongBreak ? 'long_break' : 'short_break'
    const mins = isLongBreak ? longBreakMins : shortBreakMins
    setPhase(next, mins)
    setShowSettlement(false)
  }

  if (phase === 'idle') {
    return (
      <div className={styles.page}>
        <div className={styles.idle}>
          <LumoStatus variant="orb" size="lg" />
          <h2 className={styles.idleTitle}>No active session</h2>
          <p className={styles.idleSub}>Start a focus session from the Today screen.</p>
        </div>
      </div>
    )
  }

  const phaseLabel = phase === 'pomodoro' ? 'Focus' : phase === 'short_break' ? 'Short Break' : 'Long Break'

  return (
    <div className={styles.page}>
      {activeTask && (
        <div className={styles.taskBadge}>
          <span className={styles.taskBadgeLabel}>Working on</span>
          <span className={styles.taskBadgeTitle}>{activeTask.title.en}</span>
        </div>
      )}

      <div className={styles.timerWrap}>
        <svg className={styles.ring} viewBox="0 0 240 240">
          <circle
            cx="120" cy="120" r="110"
            fill="none"
            stroke="var(--border-0)"
            strokeWidth="4"
          />
          <circle
            cx="120" cy="120" r="110"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            transform="rotate(-90 120 120)"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className={styles.timerInner}>
          <span className={styles.phaseLabel}>{phaseLabel}</span>
          <span className={styles.timer}>{mm}:{ss}</span>
          <span className={styles.pomoCnt}>🍅 ×{completedPomos}</span>
        </div>
      </div>

      <div className={styles.controls}>
        <Btn size="lg" onClick={pauseResume}>
          {isRunning ? 'Pause' : 'Resume'}
        </Btn>
        <Btn size="lg" variant="secondary" onClick={handleNextPhase}>
          Skip
        </Btn>
        <Btn size="lg" variant="danger" onClick={handleAbandon}>
          Abandon
        </Btn>
      </div>

      <div className={styles.started}>
        {startedAt && <span>Started at {new Date(startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
      </div>

      {showSettlement && activeTask && (
        <SettlementModal
          task={activeTask}
          completedPomos={completedPomos}
          actualMins={Math.round((totalSeconds - secondsLeft) / 60)}
          onDone={handleSettlementDone}
          onNextPhase={handleNextPhase}
          onClose={() => setShowSettlement(false)}
        />
      )}
    </div>
  )
}
