import styles from './Toggle.module.css'

interface Props {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
  disabled?: boolean
}

export function Toggle({ checked, onChange, label, disabled }: Props) {
  return (
    <label className={`${styles.wrap} ${disabled ? styles.disabled : ''}`}>
      <div
        className={`${styles.track} ${checked ? styles.on : ''}`}
        onClick={() => !disabled && onChange(!checked)}
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' || e.key === ' ' ? onChange(!checked) : null}
      >
        <div className={styles.thumb} />
      </div>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  )
}
