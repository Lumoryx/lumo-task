import { useState } from 'react'
import type { Task, ClassifyResult, Quadrant } from '../../types/api'
import { QuadrantChip } from '../../components/common/Chip'
import { Btn } from '../../components/common/Btn'
import styles from './ClassifyDialog.module.css'

interface Props {
  results: ClassifyResult[]
  tasks: Task[]
  onAcceptAll: (results: ClassifyResult[]) => void
  onClose: () => void
}

export function ClassifyDialog({ results, tasks, onAcceptAll, onClose }: Props) {
  const [local, setLocal] = useState(results)

  const changeQuadrant = (taskId: string, q: Quadrant) => {
    setLocal(l => l.map(r => r.task_id === taskId ? { ...r, suggested_quadrant: q as 'Q1' | 'Q2' | 'Q3' | 'Q4' } : r))
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.dialog}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>AI Classification Results</h2>
            <p className={styles.sub}>Review and accept the suggested quadrants</p>
          </div>
          <button className={styles.close} onClick={onClose}>✕</button>
        </div>

        <div className={styles.list}>
          {local.map(r => {
            const task = tasks.find(t => t.id === r.task_id)
            if (!task) return null
            return (
              <div key={r.task_id} className={styles.item}>
                <span className={styles.taskTitle}>{task.title.en}</span>
                <div className={styles.itemRight}>
                  <p className={styles.reason}>{r.reason.en}</p>
                  <div className={styles.quadrantSelect}>
                    {(['Q1', 'Q2', 'Q3', 'Q4'] as const).map(q => (
                      <button
                        key={q}
                        className={`${styles.qBtn} ${r.suggested_quadrant === q ? styles.qSelected : ''}`}
                        onClick={() => changeQuadrant(r.task_id, q)}
                      >
                        <QuadrantChip quadrant={q} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className={styles.footer}>
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn onClick={() => onAcceptAll(local)}>Accept All</Btn>
        </div>
      </div>
    </div>
  )
}
