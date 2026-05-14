import type { AIVariant } from '../../types/ui'
import styles from './LumoStatus.module.css'

interface Props {
  variant?: AIVariant
  label?: string
  size?: 'sm' | 'md' | 'lg'
  pulse?: boolean
}

export function LumoStatus({ variant = 'dot', label, size = 'md', pulse = false }: Props) {
  if (variant === 'dot') {
    return (
      <span
        className={`${styles.dot} ${styles[size]} ${pulse ? styles.pulse : ''}`}
        aria-label="AI active"
      />
    )
  }

  if (variant === 'orb') {
    return (
      <div className={`${styles.orbWrap} ${styles[size]}`}>
        <div className={`${styles.orb} ${pulse ? styles.breathe : ''}`} />
      </div>
    )
  }

  return (
    <div className={styles.textWrap}>
      <span className={`${styles.dot} ${styles.sm} ${pulse ? styles.pulse : ''}`} />
      {label && <span className={styles.label}>{label}</span>}
    </div>
  )
}
