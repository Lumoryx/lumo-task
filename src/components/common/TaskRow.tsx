import { useState } from 'react'
import type { Task } from '../../types/api'
import { QuadrantChip } from './Chip'
import { useTasksStore } from '../../store/tasks'
import styles from './TaskRow.module.css'

interface Props {
  task: Task
  showQuadrant?: boolean
  onStartFocus?: (task: Task) => void
}

export function TaskRow({ task, showQuadrant = false, onStartFocus }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { completeTask, deleteTask, toggleToday } = useTasksStore()

  const titleText = task.title.en

  return (
    <div className={`${styles.row} ${task.status === 'completed' ? styles.done : ''}`}>
      <button
        className={`${styles.check} ${task.status === 'completed' ? styles.checked : ''}`}
        onClick={() => task.status !== 'completed' && completeTask(task.id)}
        aria-label="Mark complete"
      >
        {task.status === 'completed' && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <polyline points="2,6 5,9 10,3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div className={styles.content}>
        <span className={styles.title}>{titleText}</span>
        <div className={styles.meta}>
          {showQuadrant && <QuadrantChip quadrant={task.quadrant} />}
          {task.estimated_pomos > 0 && (
            <span className={styles.metaItem}>
              🍅 {task.actual_pomos}/{task.estimated_pomos}
            </span>
          )}
          {task.due_date && (
            <span className={styles.metaItem}>
              📅 {new Date(task.due_date).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        {onStartFocus && task.status !== 'completed' && (
          <button
            className={styles.actionBtn}
            onClick={() => onStartFocus(task)}
            title="Start focus"
          >
            ▶
          </button>
        )}
        <div className={styles.menuWrap}>
          <button
            className={styles.actionBtn}
            onClick={() => setMenuOpen(s => !s)}
            title="More actions"
          >
            ···
          </button>
          {menuOpen && (
            <div className={styles.menu} onMouseLeave={() => setMenuOpen(false)}>
              <button
                className={styles.menuItem}
                onClick={() => { toggleToday(task.id, !task.today); setMenuOpen(false) }}
              >
                {task.today ? 'Remove from Today' : 'Add to Today'}
              </button>
              <button
                className={`${styles.menuItem} ${styles.danger}`}
                onClick={() => { deleteTask(task.id); setMenuOpen(false) }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
