import { useState } from 'react'
import type { Task } from '../../types/api'

interface Props {
  tasks: Task[]
  lang: string
  classifyLoading: boolean
  onClassifyAll: () => void
}

export function UnclassifiedStrip({ tasks, lang, classifyLoading, onClassifyAll }: Props) {
  const [addHovered, setAddHovered] = useState(false)

  return (
    <div style={{
      flexShrink: 0,
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-default)',
      borderRadius: 10,
      padding: '12px 16px',
      marginTop: 12,
      position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <span style={{
          fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'var(--text-faint)',
        }}>
          {lang === 'zh' ? '未分类' : 'Unclassified'}
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{tasks.length}</span>
        <span style={{ flex: 1 }} />
        <button
          onClick={onClassifyAll}
          className="btn btn-secondary"
          style={{ height: 30, opacity: classifyLoading ? 0.6 : 1 }}
          disabled={classifyLoading}
        >
          <span style={{ width: 12, height: 12, display: 'inline-flex' }}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 1l1.5 3 3.5.5-2.5 2.5.5 3.5L8 9l-3 1.5.5-3.5L3 4.5 6.5 4z" />
            </svg>
          </span>
          {lang === 'zh' ? '一键分类' : 'Classify all'}
        </button>
      </div>

      {/* Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {tasks.map(task => {
          const title = lang === 'zh' ? (task.title.zh ?? task.title.en) : task.title.en
          return (
            <div key={task.id} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 12px', borderRadius: 999,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              fontSize: 12, color: 'var(--text-primary)',
            }}>
              <span className="qdot qdot-un" />
              {title}
            </div>
          )
        })}
        {/* Dashed add button */}
        <button
          onMouseEnter={() => setAddHovered(true)}
          onMouseLeave={() => setAddHovered(false)}
          style={{
            padding: '6px 12px', borderRadius: 999,
            background: addHovered ? 'var(--accent-fog)' : 'transparent',
            border: '1px dashed ' + (addHovered ? 'var(--accent-edge)' : 'var(--border-default)'),
            color: addHovered ? 'var(--accent-primary)' : 'var(--text-muted)',
            fontSize: 12, cursor: 'default', fontFamily: 'inherit',
            display: 'inline-flex', alignItems: 'center', gap: 6,
            transform: addHovered ? 'translateY(-1px)' : 'none',
            transition: 'all 160ms var(--ease-default)',
          }}
        >
          <span style={{
            width: 12, height: 12, display: 'inline-flex',
            transform: addHovered ? 'rotate(90deg)' : 'none',
            transition: 'transform 220ms var(--ease-spring)',
          }}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M8 3v10M3 8h10" />
            </svg>
          </span>
          {lang === 'zh' ? '添加任务' : 'Add task'}
        </button>
      </div>
    </div>
  )
}
