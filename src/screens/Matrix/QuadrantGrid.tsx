import { useState } from 'react'
import type { Task, Quadrant } from '../../types/api'
import type { MatrixLayout } from '../../types/ui'
import { TaskRow } from '../../components/common/TaskRow'
import { Btn } from '../../components/common/Btn'
import { useTasksStore } from '../../store/tasks'
import styles from './QuadrantGrid.module.css'

const QUADRANTS: { id: Quadrant; label: string; sub: string; colorClass: string }[] = [
  { id: 'Q1', label: 'Q1 · Urgent & Important', sub: 'Do first', colorClass: 'q1' },
  { id: 'Q2', label: 'Q2 · Important, Not Urgent', sub: 'Schedule', colorClass: 'q2' },
  { id: 'Q3', label: 'Q3 · Urgent, Not Important', sub: 'Delegate', colorClass: 'q3' },
  { id: 'Q4', label: 'Q4 · Neither', sub: 'Eliminate', colorClass: 'q4' },
]

interface Props {
  tasks: Task[]
  layout: MatrixLayout
}

interface QuickAddState {
  quadrant: Quadrant | null
  value: string
}

export function QuadrantGrid({ tasks, layout }: Props) {
  const { createTask } = useTasksStore()
  const [quickAdd, setQuickAdd] = useState<QuickAddState>({ quadrant: null, value: '' })

  const handleAdd = async (quadrant: Quadrant) => {
    if (!quickAdd.value.trim()) return
    await createTask({ title: quickAdd.value, quadrant })
    setQuickAdd({ quadrant: null, value: '' })
  }

  const unclassified = tasks.filter(t => t.quadrant === 'unclassified' && t.status !== 'completed')

  return (
    <div className={`${styles.wrap} ${layout === 'hybrid' ? styles.hybrid : ''}`}>
      <div className={styles.grid}>
        {QUADRANTS.map(q => {
          const qTasks = tasks.filter(t => t.quadrant === q.id && t.status !== 'completed')
          return (
            <div key={q.id} className={`${styles.quadrant} ${styles[q.colorClass]}`}>
              <div className={styles.qHeader}>
                <div>
                  <span className={styles.qLabel}>{q.label}</span>
                  <span className={styles.qSub}>{q.sub}</span>
                </div>
                <span className={styles.qCount}>{qTasks.length}</span>
              </div>

              <div className={styles.qTasks}>
                {qTasks.map(task => (
                  <TaskRow key={task.id} task={task} />
                ))}
                {qTasks.length === 0 && (
                  <span className={styles.qEmpty}>No tasks</span>
                )}
              </div>

              {quickAdd.quadrant === q.id ? (
                <div className={styles.quickAdd}>
                  <input
                    className={styles.quickInput}
                    placeholder="Task title…"
                    value={quickAdd.value}
                    onChange={e => setQuickAdd(s => ({ ...s, value: e.target.value }))}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleAdd(q.id)
                      if (e.key === 'Escape') setQuickAdd({ quadrant: null, value: '' })
                    }}
                    autoFocus
                  />
                  <div className={styles.quickActions}>
                    <Btn size="sm" onClick={() => handleAdd(q.id)}>Add</Btn>
                    <Btn size="sm" variant="ghost" onClick={() => setQuickAdd({ quadrant: null, value: '' })}>Cancel</Btn>
                  </div>
                </div>
              ) : (
                <button
                  className={styles.addBtn}
                  onClick={() => setQuickAdd({ quadrant: q.id, value: '' })}
                >
                  + Add task
                </button>
              )}
            </div>
          )
        })}
      </div>

      {unclassified.length > 0 && (
        <div className={styles.pool}>
          <div className={styles.poolHeader}>
            <span className={styles.poolLabel}>Unclassified</span>
            <span className={styles.qCount}>{unclassified.length}</span>
          </div>
          {unclassified.map(task => (
            <TaskRow key={task.id} task={task} showQuadrant />
          ))}
        </div>
      )}
    </div>
  )
}
