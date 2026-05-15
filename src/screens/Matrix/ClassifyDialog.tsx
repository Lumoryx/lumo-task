import { useEffect, useState } from 'react'
import type { Task } from '../../types/api'

interface Props {
  tasks: Task[]
  lang: string
  onClose: () => void
  onApply: (assign: Record<string, string>) => void
}

const Q_COLORS = {
  Q1: 'var(--q1-color)',
  Q2: 'var(--q2-color)',
  Q3: 'var(--q3-color)',
  Q4: 'var(--q4-color)',
} as const

export function ClassifyDialog({ tasks, lang, onClose, onApply }: Props) {
  const [assign, setAssign] = useState<Record<string, string>>(() => {
    const m: Record<string, string> = {}
    tasks.forEach(task => { m[task.id] = 'Q2' })
    return m
  })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const counts = (['Q1', 'Q2', 'Q3', 'Q4'] as const).reduce((acc, q) => {
    acc[q] = tasks.filter(task => assign[task.id] === q).length
    return acc
  }, {} as Record<string, number>)

  const reasonFor = (q: string) => {
    const map: Record<string, Record<string, string>> = {
      en: {
        Q1: 'Time-sensitive & high impact',
        Q2: 'Anchors a long-term goal',
        Q3: 'Urgent but delegate-able',
        Q4: 'Consider dropping',
      },
      zh: {
        Q1: '时间敏感、影响大',
        Q2: '对长线目标重要',
        Q3: '紧急但可以委派',
        Q4: '可考虑直接放弃',
      },
    }
    return (map[lang] ?? map.en)[q] ?? ''
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute', inset: 0,
        background: 'rgba(8, 11, 10, 0.65)',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 120, padding: 32,
        animation: 'fadeIn 200ms var(--ease-default) both',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="float-up"
        style={{
          width: '100%', maxWidth: 560,
          maxHeight: 'calc(100% - 0px)',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--accent-edge)',
          borderRadius: 14,
          boxShadow: 'var(--shadow-lifted), 0 0 50px var(--accent-fog)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 18px',
          borderBottom: '1px solid var(--border-faint)',
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          {/* Lumo pulse icon */}
          <span style={{ width: 16, height: 16, marginTop: 1, position: 'relative', flexShrink: 0 }}>
            <span style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              background: 'var(--accent-glow)', animation: 'lumoBreath 3s ease-in-out infinite reverse',
            }} />
            <span style={{
              position: 'absolute', inset: 5, borderRadius: '50%',
              background: 'var(--accent-primary)', boxShadow: '0 0 10px var(--accent-primary)',
              animation: 'lumoBreath 3s ease-in-out infinite',
            }} />
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
              {lang === 'zh'
                ? `我建议这样分类 ${tasks.length} 项任务`
                : `I'd classify these ${tasks.length} tasks like this`}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.5 }}>
              {lang === 'zh'
                ? '看一下,可以单个改象限,确认后一次性应用。'
                : "Review and override any quadrant. We'll apply all changes at once."}
            </div>
          </div>
          <span style={{
            padding: '2px 6px', borderRadius: 3, fontSize: 10,
            border: '1px solid var(--border-default)',
            background: 'var(--bg-base)', fontFamily: 'var(--font-mono)',
            color: 'var(--text-faint)', flexShrink: 0,
          }}>esc</span>
        </div>

        {/* Summary bar */}
        <div style={{
          padding: '10px 18px',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-faint)',
          display: 'flex', gap: 14,
          fontSize: 11, color: 'var(--text-muted)',
          fontVariantNumeric: 'tabular-nums',
          alignItems: 'center',
        }}>
          {(['Q1', 'Q2', 'Q3', 'Q4'] as const).map(q => (
            <span key={q} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: Q_COLORS[q],
              }} />
              <span style={{ color: 'var(--text-secondary)' }}>{q}</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{counts[q]}</span>
            </span>
          ))}
        </div>

        {/* Task list */}
        <div style={{ padding: '8px 6px', overflowY: 'auto', flex: 1, minHeight: 0 }}>
          {tasks.map(task => {
            const title = lang === 'zh' ? (task.title.zh ?? task.title.en) : task.title.en
            return (
              <div key={task.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', margin: '2px 4px',
                borderRadius: 6,
              }}>
                <span className="qdot qdot-un" />
                <div style={{
                  flex: 1, fontSize: 13, color: 'var(--text-primary)',
                  lineHeight: 1.4, minWidth: 0,
                  whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden',
                }}>{title}</div>
                <span style={{ fontSize: 11, color: 'var(--text-faint)', flexShrink: 0 }}>→</span>
                {/* Quadrant picker */}
                <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
                  {(['Q1', 'Q2', 'Q3', 'Q4'] as const).map(q => {
                    const active = assign[task.id] === q
                    const qColor = Q_COLORS[q]
                    return (
                      <button
                        key={q}
                        onClick={() => setAssign(a => ({ ...a, [task.id]: q }))}
                        title={reasonFor(q)}
                        style={{
                          height: 24, minWidth: 30, padding: '0 7px',
                          borderRadius: 4,
                          background: active ? 'var(--bg-elevated)' : 'transparent',
                          border: '1px solid ' + (active ? qColor : 'var(--border-default)'),
                          color: active ? qColor : 'var(--text-muted)',
                          fontSize: 11, fontWeight: active ? 600 : 500,
                          fontFamily: 'inherit', cursor: 'default',
                          fontVariantNumeric: 'tabular-nums',
                          boxShadow: active ? `inset 0 0 0 0.5px ${qColor}` : 'none',
                          transition: 'all 120ms var(--ease-default)',
                        }}
                      >{q}</button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Reasoning footer */}
        <div style={{
          padding: '10px 18px',
          background: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-faint)',
          fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5,
        }}>
          <span style={{ color: 'var(--accent-primary)' }}>✦</span>{' '}
          {lang === 'zh'
            ? '依据任务关键词、截止时间、与已有目标的关系做的初步判断。可以全部覆盖。'
            : 'Suggestions based on keywords, due-dates, and your stated goals. Feel free to override.'}
        </div>

        {/* Footer buttons */}
        <div style={{
          padding: '12px 18px',
          background: 'var(--bg-deep)',
          borderTop: '1px solid var(--border-faint)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ flex: 1, fontSize: 12, color: 'var(--text-muted)' }}>
            {lang === 'zh'
              ? `应用后 ${tasks.length} 项将被移入对应象限`
              : `Will move ${tasks.length} task${tasks.length === 1 ? '' : 's'} into their quadrants`}
          </span>
          <button onClick={onClose} className="btn btn-ghost" style={{ height: 32, padding: '0 12px', fontSize: 12 }}>
            {lang === 'zh' ? '取消' : 'Cancel'}
          </button>
          <button onClick={() => onApply(assign)} className="btn btn-primary" style={{ height: 32, padding: '0 14px', fontSize: 12 }}>
            {lang === 'zh' ? `应用 ${tasks.length} 项` : `Apply all ${tasks.length}`}
          </button>
        </div>
      </div>
    </div>
  )
}
