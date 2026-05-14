import type { AIRecommendation, Task } from '../../types/api'
import { Btn } from '../../components/common/Btn'
import { QuadrantChip } from '../../components/common/Chip'
import { useTasksStore } from '../../store/tasks'
import styles from './CardConviction.module.css'

interface Props {
  recommendation: AIRecommendation
  onStartFocus: (task: Task) => void
}

export function CardConviction({ recommendation, onStartFocus }: Props) {
  const { task, reason, conviction, not_now } = recommendation
  const { completeTask } = useTasksStore()
  const pct = Math.round(conviction * 100)

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.convictionBar}>
          <div className={styles.convictionFill} style={{ width: `${pct}%` }} />
        </div>

        <div className={styles.header}>
          <QuadrantChip quadrant={task.quadrant} size="md" />
          <span className={styles.pct}>{pct}%</span>
        </div>

        <h2 className={styles.title}>{task.title.en}</h2>
        <p className={styles.reason}>{reason.en}</p>

        <div className={styles.actions}>
          <Btn onClick={() => onStartFocus(task)}>Start Focus</Btn>
          <Btn variant="secondary" onClick={() => completeTask(task.id)}>Done</Btn>
        </div>
      </div>

      {not_now.length > 0 && (
        <div className={styles.sidecar}>
          <span className={styles.sidecarLabel}>Not now</span>
          {not_now.slice(0, 2).map(item => (
            <div key={item.task_id} className={styles.sidecarItem}>
              <span className={styles.sidecarReason}>{item.reason.en}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
