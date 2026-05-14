import type { Task } from '../../types/api'
import { TaskRow } from '../../components/common/TaskRow'
import styles from './MatrixList.module.css'

const GROUPS = [
  { id: 'Q1' as const, label: 'Q1 · Urgent & Important', colorClass: 'q1' },
  { id: 'Q2' as const, label: 'Q2 · Important, Not Urgent', colorClass: 'q2' },
  { id: 'Q3' as const, label: 'Q3 · Urgent, Not Important', colorClass: 'q3' },
  { id: 'Q4' as const, label: 'Q4 · Neither', colorClass: 'q4' },
  { id: 'unclassified' as const, label: 'Unclassified', colorClass: 'unc' },
]

interface Props {
  tasks: Task[]
}

export function MatrixList({ tasks }: Props) {
  const active = tasks.filter(t => t.status !== 'completed')
  return (
    <div className={styles.wrap}>
      {GROUPS.map(g => {
        const group = active.filter(t => t.quadrant === g.id)
        if (!group.length) return null
        return (
          <div key={g.id} className={styles.group}>
            <div className={`${styles.groupHeader} ${styles[g.colorClass]}`}>
              <span className={styles.groupLabel}>{g.label}</span>
              <span className={styles.count}>{group.length}</span>
            </div>
            <div className={styles.rows}>
              {group.map(task => <TaskRow key={task.id} task={task} />)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
