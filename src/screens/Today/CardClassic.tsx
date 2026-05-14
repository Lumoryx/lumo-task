import type { AIRecommendation } from '../../types/api'
import { Btn } from '../../components/common/Btn'
import { QuadrantChip } from '../../components/common/Chip'
import { useTasksStore } from '../../store/tasks'
import type { Task } from '../../types/api'
import styles from './CardClassic.module.css'

interface Props {
  recommendation: AIRecommendation
  onStartFocus: (task: Task) => void
}

export function CardClassic({ recommendation, onStartFocus }: Props) {
  const { task, reason, conviction } = recommendation
  const { completeTask } = useTasksStore()

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <QuadrantChip quadrant={task.quadrant} size="md" />
        <span className={styles.conviction}>{Math.round(conviction * 100)}% match</span>
      </div>

      <h2 className={styles.title}>{task.title.en}</h2>

      {task.description && (
        <p className={styles.desc}>{task.description.en}</p>
      )}

      <div className={styles.aiReason}>
        <span className={styles.aiLabel}>Why now</span>
        <p className={styles.aiText}>{reason.en}</p>
      </div>

      <div className={styles.meta}>
        {task.estimated_pomos > 0 && (
          <span className={styles.metaItem}>🍅 {task.estimated_pomos} pomos</span>
        )}
        {task.estimated_mins && (
          <span className={styles.metaItem}>⏱ ~{task.estimated_mins} min</span>
        )}
      </div>

      <div className={styles.actions}>
        <Btn size="lg" fullWidth onClick={() => onStartFocus(task)}>
          Start Focus
        </Btn>
        <Btn size="lg" variant="secondary" onClick={() => completeTask(task.id)}>
          Mark Done
        </Btn>
      </div>
    </div>
  )
}
