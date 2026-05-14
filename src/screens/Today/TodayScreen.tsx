import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTasksStore } from '../../store/tasks'
import { useFocusStore } from '../../store/focus'
import { useSettingsStore } from '../../store/settings'
import { LumoStatus } from '../../components/ai/LumoStatus'
import { Btn } from '../../components/common/Btn'
import { TaskRow } from '../../components/common/TaskRow'
import { ComposeBar } from './ComposeBar'
import { CardClassic } from './CardClassic'
import { CardConviction } from './CardConviction'
import type { Task } from '../../types/api'
import styles from './Today.module.css'

export function TodayScreen() {
  const { todayTasks, recommendation, fetchToday, loading } = useTasksStore()
  const { phase, activeTask, secondsLeft, isRunning, startSession, pauseResume } = useFocusStore()
  const { todayCardVariant } = useSettingsStore()
  const [parseOpen, setParseOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchToday()
  }, [fetchToday])

  const handleStartFocus = async (task: Task) => {
    const { startPomodoro } = useTasksStore.getState()
    const { pomodoroDurationMins } = useSettingsStore.getState()
    const sessionId = await startPomodoro(task.id)
    startSession(task, sessionId, pomodoroDurationMins)
    navigate('/focus')
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  const activePending = todayTasks.filter(t => t.status !== 'completed')
  const completed = todayTasks.filter(t => t.status === 'completed')

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.dateRow}>
          <span className={styles.date}>{today}</span>
          <LumoStatus variant="text" label="Lumo" pulse />
        </div>

        {/* Active focus banner */}
        {phase !== 'idle' && activeTask && (
          <div className={styles.focusBanner}>
            <div className={styles.focusBannerLeft}>
              <span className={styles.focusLabel}>Focus session running</span>
              <span className={styles.focusTask}>{activeTask.title.en}</span>
            </div>
            <div className={styles.focusBannerRight}>
              <span className={styles.focusTimer}>
                {String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:
                {String(secondsLeft % 60).padStart(2, '0')}
              </span>
              <Btn size="sm" variant="secondary" onClick={pauseResume}>
                {isRunning ? 'Pause' : 'Resume'}
              </Btn>
              <Btn size="sm" onClick={() => navigate('/focus')}>
                Go to Focus
              </Btn>
            </div>
          </div>
        )}

        {loading ? (
          <div className={styles.loading}>
            <LumoStatus variant="orb" size="md" pulse />
            <span>Loading your day…</span>
          </div>
        ) : activePending.length === 0 ? (
          <div className={styles.empty}>
            <LumoStatus variant="orb" size="lg" pulse />
            <h2 className={styles.emptyTitle}>What's on your mind?</h2>
            <p className={styles.emptySub}>Type a task below, and Lumo will classify it for you.</p>
          </div>
        ) : (
          <>
            {/* Recommended card */}
            {recommendation && phase === 'idle' && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <LumoStatus variant="dot" size="sm" pulse />
                  <span className={styles.sectionLabel}>Lumo recommends</span>
                </div>
                {todayCardVariant === 'conviction' ? (
                  <CardConviction
                    recommendation={recommendation}
                    onStartFocus={handleStartFocus}
                  />
                ) : (
                  <CardClassic
                    recommendation={recommendation}
                    onStartFocus={handleStartFocus}
                  />
                )}
              </div>
            )}

            {/* Task list */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionLabel}>Today's tasks</span>
                <span className={styles.count}>{activePending.length}</span>
              </div>
              <div className={styles.taskList}>
                {activePending
                  .filter(t => t.id !== recommendation?.task.id)
                  .map(task => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      showQuadrant
                      onStartFocus={handleStartFocus}
                    />
                  ))}
              </div>
            </div>

            {/* Completed */}
            {completed.length > 0 && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionLabel}>Completed</span>
                  <span className={styles.count}>{completed.length}</span>
                </div>
                <div className={styles.taskList}>
                  {completed.map(task => (
                    <TaskRow key={task.id} task={task} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <ComposeBar onOpen={() => setParseOpen(true)} />
        {parseOpen && <div style={{ display: 'none' }} />}
      </div>
    </div>
  )
}
