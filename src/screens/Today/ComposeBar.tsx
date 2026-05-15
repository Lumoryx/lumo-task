import { useState, useRef } from 'react'
import { useTasksStore } from '../../store/tasks'
import { aiApi } from '../../lib/api/ai'
import { useSettingsStore } from '../../store/settings'

interface Props {
  onOpen?: () => void
  placeholder?: string
}

export function ComposeBar({ onOpen: _onOpen, placeholder }: Props) {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const { createTask } = useTasksStore()
  const { language } = useSettingsStore()
  const inputRef = useRef<HTMLInputElement>(null)

  const hasText = value.trim().length > 0

  const defaultPlaceholder = language === 'zh'
    ? '描述一个任务… Lumo 会帮你分类'
    : 'What would you like to push forward? Lumo will classify it…'

  const handleSubmit = async () => {
    const v = value.trim()
    if (!v) return
    setLoading(true)
    try {
      const parsed = await aiApi.parseTask(v)
      await createTask({
        title: parsed.data.title,
        quadrant: parsed.data.quadrant as 'Q1' | 'Q2' | 'Q3' | 'Q4' | undefined,
        priority: parsed.data.priority as 'urgent' | 'high' | 'medium' | 'low' | undefined,
        estimated_pomos: parsed.data.estimated_pomos,
        today: true,
      })
      setValue('')
      setTimeout(() => inputRef.current?.focus(), 60)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginTop: 32, position: 'relative' }}>
      <div className="compose-bar">
        <span className="compose-dot" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && hasText) {
              e.preventDefault()
              handleSubmit()
            }
          }}
          placeholder={placeholder ?? defaultPlaceholder}
          disabled={loading}
        />
        <span className="compose-kbd">↵</span>
        <button
          className={'compose-send' + (hasText ? ' active' : '')}
          onClick={handleSubmit}
          disabled={!hasText || loading}
          title={language === 'zh' ? '创建任务' : 'Send'}
          aria-label={language === 'zh' ? '创建任务' : 'Send'}
        >
          {loading ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <circle cx="12" cy="12" r="9" strokeOpacity="0.3" />
              <path d="M12 3a9 9 0 0 1 9 9" style={{ animation: 'spin 1s linear infinite' }} />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth={hasText ? 2 : 1.6} strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13" />
              <path d="M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          )}
        </button>
      </div>
      <div style={{
        fontSize: 11, color: 'var(--text-faint)',
        marginTop: 8, paddingLeft: 16,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{ opacity: 0.7 }}>✦</span>
        <span>
          {language === 'zh'
            ? '例如"明天下午写产品介绍，30分钟"'
            : 'e.g. "Write product intro tomorrow, 30 min"'}
        </span>
      </div>
    </div>
  )
}
