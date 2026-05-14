import { useState } from 'react'
import { Input, TextArea } from '../components/common/Input'
import { Btn } from '../components/common/Btn'
import { SegControl } from '../components/common/SegControl'
import { useTasksStore } from '../store/tasks'
import type { Quadrant, Priority } from '../types/api'
import styles from './QuickCreate.module.css'

interface Props {
  defaultQuadrant?: Quadrant
  onClose: () => void
}

const QUADRANT_OPTIONS: { value: Quadrant; label: string }[] = [
  { value: 'Q1', label: 'Q1' },
  { value: 'Q2', label: 'Q2' },
  { value: 'Q3', label: 'Q3' },
  { value: 'Q4', label: 'Q4' },
  { value: 'unclassified', label: 'Auto' },
]

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

export function QuickCreate({ defaultQuadrant = 'unclassified', onClose }: Props) {
  const { createTask } = useTasksStore()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [quadrant, setQuadrant] = useState<Quadrant>(defaultQuadrant)
  const [priority, setPriority] = useState<Priority>('medium')
  const [pomos, setPomos] = useState(1)
  const [today, setToday] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    try {
      await createTask({ title, description: description || undefined, quadrant, priority, estimated_pomos: pomos, today })
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>New Task</h2>
          <button className={styles.close} onClick={onClose}>✕</button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            label="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            required
            autoFocus
          />
          <TextArea
            label="Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Add details…"
          />

          <div className={styles.field}>
            <label className={styles.fieldLabel}>Quadrant</label>
            <SegControl<Quadrant>
              options={QUADRANT_OPTIONS}
              value={quadrant}
              onChange={setQuadrant}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>Priority</label>
            <SegControl<Priority>
              options={PRIORITY_OPTIONS}
              value={priority}
              onChange={setPriority}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Est. Pomodoros</label>
              <div className={styles.stepper}>
                <button type="button" className={styles.stepBtn} onClick={() => setPomos(p => Math.max(1, p - 1))}>−</button>
                <span className={styles.stepVal}>{pomos}</span>
                <button type="button" className={styles.stepBtn} onClick={() => setPomos(p => p + 1)}>+</button>
              </div>
            </div>
            <label className={styles.checkRow}>
              <input type="checkbox" checked={today} onChange={e => setToday(e.target.checked)} />
              <span>Add to Today</span>
            </label>
          </div>

          <div className={styles.footer}>
            <Btn type="button" variant="secondary" onClick={onClose}>Cancel</Btn>
            <Btn type="submit" loading={loading} disabled={!title.trim()}>Create Task</Btn>
          </div>
        </form>
      </div>
    </div>
  )
}
