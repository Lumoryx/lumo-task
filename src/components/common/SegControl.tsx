import styles from './SegControl.module.css'

interface Option<T extends string> {
  value: T
  label: string
}

interface Props<T extends string> {
  options: Option<T>[]
  value: T
  onChange: (v: T) => void
}

export function SegControl<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <div className={styles.wrap}>
      {options.map(o => (
        <button
          key={o.value}
          className={`${styles.seg} ${value === o.value ? styles.active : ''}`}
          onClick={() => onChange(o.value)}
          type="button"
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
