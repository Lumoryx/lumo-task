import { useState } from 'react'
import { useTasksStore } from '../../store/tasks'
import { aiApi } from '../../lib/api/ai'
import styles from './ComposeBar.module.css'

interface Props {
  onOpen?: () => void
}

export function ComposeBar({ onOpen: _onOpen }: Props) {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const { createTask } = useTasksStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim()) return
    setLoading(true)
    try {
      const parsed = await aiApi.parseTask(value)
      await createTask({
        title: parsed.data.title,
        quadrant: parsed.data.quadrant as 'Q1' | 'Q2' | 'Q3' | 'Q4' | undefined,
        priority: parsed.data.priority as 'urgent' | 'high' | 'medium' | 'low' | undefined,
        estimated_pomos: parsed.data.estimated_pomos,
        today: true,
      })
      setValue('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={styles.bar} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        placeholder="Add a task… (AI will classify it)"
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={loading}
      />
      <button type="submit" className={styles.send} disabled={!value.trim() || loading}>
        {loading ? (
          <span className={styles.spinner} />
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        )}
      </button>
    </form>
  )
}
