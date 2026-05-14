import type { Quadrant } from '../../types/api'
import styles from './Chip.module.css'

interface QuadrantChipProps {
  quadrant: Quadrant
  size?: 'sm' | 'md'
}

const QUADRANT_LABELS: Record<Quadrant, string> = {
  Q1: 'Q1',
  Q2: 'Q2',
  Q3: 'Q3',
  Q4: 'Q4',
  unclassified: '—',
}

export function QuadrantChip({ quadrant, size = 'sm' }: QuadrantChipProps) {
  return (
    <span className={`${styles.chip} ${styles[quadrant.toLowerCase()]} ${styles[size]}`}>
      {QUADRANT_LABELS[quadrant]}
    </span>
  )
}

interface AIChipProps {
  label?: string
}

export function AIChip({ label = 'AI' }: AIChipProps) {
  return <span className={`${styles.chip} ${styles.ai} ${styles.sm}`}>{label}</span>
}
