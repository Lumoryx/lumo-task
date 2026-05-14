import type { Task } from '../../types/api'
import { Btn } from '../../components/common/Btn'
import { LumoStatus } from '../../components/ai/LumoStatus'
import styles from './SettlementModal.module.css'

interface Props {
  task: Task
  completedPomos: number
  actualMins: number
  onDone: () => void
  onNextPhase: () => void
  onClose: () => void
}

export function SettlementModal({ task, completedPomos, actualMins, onDone, onNextPhase, onClose }: Props) {
  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.orbWrap}>
          <LumoStatus variant="orb" size="md" pulse />
        </div>

        <h2 className={styles.title}>Session complete!</h2>
        <p className={styles.sub}>{task.title.en}</p>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>🍅 {completedPomos}</span>
            <span className={styles.statLabel}>Pomodoros</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statValue}>⏱ {actualMins}m</span>
            <span className={styles.statLabel}>Time spent</span>
          </div>
        </div>

        <div className={styles.actions}>
          <Btn fullWidth onClick={onNextPhase}>
            Take a break
          </Btn>
          <Btn fullWidth variant="secondary" onClick={onDone}>
            Mark task done
          </Btn>
        </div>
      </div>
    </div>
  )
}
