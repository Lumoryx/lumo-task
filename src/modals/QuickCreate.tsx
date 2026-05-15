import { useEffect, useRef, useState } from 'react'
import { useTasksStore } from '../store/tasks'
import { useSettingsStore } from '../store/settings'
import type { Quadrant } from '../types/api'

interface Props {
  defaultQuadrant?: Quadrant
  onClose: () => void
}

const Q_META: {
  q: 'Q1' | 'Q2' | 'Q3' | 'Q4'
  titleEn: string; titleZh: string
  subEn: string; subZh: string
  fog: string
}[] = [
  { q: 'Q1', titleEn: 'Do first', titleZh: '立即做', subEn: 'Urgent · Important', subZh: '重要 · 紧急', fog: 'rgba(255, 107, 107, 0.14)' },
  { q: 'Q2', titleEn: 'Schedule', titleZh: '安排做', subEn: 'Important · Later', subZh: '重要 · 不紧急', fog: 'rgba(168, 230, 75, 0.14)' },
  { q: 'Q3', titleEn: 'Delegate', titleZh: '委托做', subEn: 'Urgent · Minor', subZh: '紧急 · 不重要', fog: 'rgba(91, 200, 212, 0.14)' },
  { q: 'Q4', titleEn: 'Drop', titleZh: '减少做', subEn: 'Not urgent · Minor', subZh: '不紧急 · 不重要', fog: 'rgba(107, 126, 120, 0.14)' },
]

const Q_COLORS: Record<string, string> = {
  Q1: 'var(--q1-color)',
  Q2: 'var(--q2-color)',
  Q3: 'var(--q3-color)',
  Q4: 'var(--q4-color)',
}

function fmtDate(d: Date | null, lang: string) {
  if (!d) return lang === 'zh' ? '选择日期' : 'Pick a date'
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const dd = new Date(d); dd.setHours(0, 0, 0, 0)
  const diff = Math.round((dd.getTime() - today.getTime()) / 86400000)
  if (diff === 0) return lang === 'zh' ? '今天' : 'Today'
  if (diff === 1) return lang === 'zh' ? '明天' : 'Tomorrow'
  if (diff === -1) return lang === 'zh' ? '昨天' : 'Yesterday'
  return dd.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' })
}

function ParsedField({ label, colSpan, children }: { label: string; colSpan?: number; children: React.ReactNode }) {
  return (
    <div style={{ gridColumn: colSpan === 2 ? 'span 2' : 'auto' }}>
      <div style={{
        fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: 'var(--text-faint)',
        marginBottom: 6,
      }}>{label}</div>
      {children}
    </div>
  )
}

export function QuickCreate({ defaultQuadrant = 'Q2', onClose }: Props) {
  const { createTask } = useTasksStore()
  const { language } = useSettingsStore()
  const lang = language
  const [title, setTitle] = useState('')
  const [quadrant, setQuadrant] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4'>(
    (defaultQuadrant !== 'unclassified' ? defaultQuadrant : 'Q2') as 'Q1' | 'Q2' | 'Q3' | 'Q4'
  )
  const [duration, setDuration] = useState(90)
  const [due, setDue] = useState<Date | null>(() => {
    const d = new Date(); d.setDate(d.getDate() + 2); d.setHours(0, 0, 0, 0); return d
  })
  const [loading, setLoading] = useState(false)
  const titleRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (titleRef.current) {
        titleRef.current.focus()
        const el = titleRef.current
        el.style.height = 'auto'
        el.style.height = Math.min(el.scrollHeight, 180) + 'px'
      }
    }, 30)
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => { clearTimeout(timeout); window.removeEventListener('keydown', onKey) }
  }, [onClose])

  const pomos = Math.max(1, Math.ceil(duration / 25))

  const clampDuration = (n: number) => Math.min(480, Math.max(5, n))

  const handleAdd = async () => {
    if (!title.trim()) return
    setLoading(true)
    try {
      await createTask({
        title: title.trim(),
        quadrant,
        estimated_mins: duration,
        due_date: due?.toISOString().split('T')[0],
        estimated_pomos: pomos,
      })
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute', inset: 0,
        background: 'rgba(8, 11, 10, 0.65)',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        zIndex: 100, paddingTop: 100,
        animation: 'fadeIn 200ms var(--ease-default) both',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="float-up"
        style={{
          width: 520,
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-default)',
          borderRadius: 14,
          overflow: 'visible',
          boxShadow: 'var(--shadow-lifted), 0 0 40px var(--accent-fog)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '16px 20px 14px',
          borderBottom: '1px solid var(--border-faint)',
        }}>
          <span style={{ width: 16, height: 16, display: 'inline-flex', color: 'var(--accent-primary)' }}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M8 3v10M3 8h10" />
            </svg>
          </span>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            {lang === 'zh' ? '新建任务' : 'Create task'}
          </span>
          <span style={{ flex: 1 }} />
          <span style={{
            padding: '1px 5px', borderRadius: 3, fontSize: 10,
            border: '1px solid var(--border-default)',
            background: 'var(--bg-base)', fontFamily: 'var(--font-mono)',
            color: 'var(--text-faint)',
          }}>esc</span>
        </div>

        {/* Body */}
        <div style={{ padding: '18px 20px 8px' }}>
          {/* Title textarea */}
          <ParsedField label={lang === 'zh' ? '任务' : 'Task'} colSpan={2}>
            <textarea
              ref={titleRef}
              className="input"
              value={title}
              onChange={e => {
                setTitle(e.target.value)
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 180) + 'px'
              }}
              onKeyDown={e => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                  e.preventDefault()
                  handleAdd()
                }
              }}
              rows={2}
              placeholder={lang === 'zh' ? '想做什么?可以输入多行内容、子任务和备注…' : 'What do you want to do? Multi-line — add sub-steps, notes…'}
              style={{
                height: 'auto', minHeight: 64, maxHeight: 180,
                padding: '10px 14px',
                fontSize: 15, fontWeight: 500, lineHeight: 1.5,
                resize: 'none', overflowY: 'auto',
                fontFamily: 'inherit',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10, color: 'var(--text-faint)' }}>
              <span>{lang === 'zh' ? 'Enter 换行 · ⌘↵ 添加' : 'Enter for newline · ⌘↵ to add'}</span>
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>{title.length} / 280</span>
            </div>
          </ParsedField>

          {/* Quadrant picker */}
          <div style={{ marginTop: 14 }}>
            <ParsedField label={lang === 'zh' ? '象限' : 'Quadrant'}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6 }}>
                {Q_META.map(({ q, titleEn, titleZh, subEn, subZh, fog }) => {
                  const active = q === quadrant
                  const qColor = Q_COLORS[q]
                  const qTitle = lang === 'zh' ? titleZh : titleEn
                  const qSub = lang === 'zh' ? subZh : subEn
                  return (
                    <button
                      key={q}
                      onClick={() => setQuadrant(q)}
                      style={{
                        padding: '9px 10px 10px',
                        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3,
                        background: active ? 'var(--bg-elevated)' : 'transparent',
                        border: '1px solid ' + (active ? qColor : 'var(--border-default)'),
                        borderRadius: 8,
                        color: 'var(--text-primary)',
                        cursor: 'default', fontFamily: 'inherit',
                        position: 'relative', textAlign: 'left',
                        transition: 'all 120ms var(--ease-default)',
                        boxShadow: active ? `0 0 0 3px ${fog}` : 'none',
                        overflow: 'hidden',
                      }}
                      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--bg-subtle)' }}
                      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                    >
                      {/* Q pill */}
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '1px 6px 2px',
                        borderRadius: 3,
                        background: fog,
                        color: qColor,
                        fontSize: 10, fontWeight: 600,
                        letterSpacing: '0.04em',
                        fontVariantNumeric: 'tabular-nums',
                        whiteSpace: 'nowrap',
                      }}>
                        <span style={{
                          width: 4, height: 4, borderRadius: '50%',
                          background: qColor,
                          boxShadow: active ? `0 0 5px ${qColor}` : 'none',
                        }} />
                        {q}
                      </div>
                      {/* Verb */}
                      <div style={{
                        fontSize: 12,
                        fontWeight: active ? 600 : 500,
                        color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                        letterSpacing: '-0.005em',
                        whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                        overflow: 'hidden', maxWidth: '100%',
                      }}>{qTitle}</div>
                      {/* Subtitle */}
                      <div style={{
                        fontSize: 10, color: 'var(--text-muted)',
                        lineHeight: 1.35, letterSpacing: '0.01em',
                        whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                        overflow: 'hidden', maxWidth: '100%',
                      }}>{qSub}</div>
                    </button>
                  )
                })}
              </div>
            </ParsedField>
          </div>

          {/* Due + Duration */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
            <ParsedField label={lang === 'zh' ? '截止日期' : 'Due date'}>
              <button
                style={{
                  width: '100%', height: 38,
                  padding: '0 12px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 8,
                  display: 'flex', alignItems: 'center', gap: 10,
                  color: 'var(--text-primary)', fontSize: 14,
                  cursor: 'default', fontFamily: 'inherit',
                }}
                onClick={() => {
                  const d = new Date()
                  d.setDate(d.getDate() + 1)
                  d.setHours(0, 0, 0, 0)
                  setDue(d)
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                  <rect x="3" y="4" width="18" height="17" rx="2" />
                  <path d="M3 9h18M8 2v4M16 2v4" />
                </svg>
                <span style={{ flex: 1, textAlign: 'left' }}>{fmtDate(due, lang)}</span>
              </button>
            </ParsedField>

            <ParsedField label={lang === 'zh' ? '预计耗时' : 'Estimated'}>
              {/* Number stepper */}
              <div style={{ display: 'flex', alignItems: 'stretch', height: 38 }}>
                <button
                  onClick={() => setDuration(clampDuration(duration - 5))}
                  style={{
                    width: 32, height: 38, flexShrink: 0,
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-secondary)',
                    fontFamily: 'inherit', fontSize: 16,
                    cursor: 'default', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '8px 0 0 8px',
                  }}
                >−</button>
                <div style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  background: 'var(--bg-surface)',
                  borderTop: '1px solid var(--border-default)',
                  borderBottom: '1px solid var(--border-default)',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit', fontSize: 14, fontWeight: 500,
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  <input
                    type="number" min={5} max={480} step={5}
                    value={duration}
                    onChange={e => setDuration(clampDuration(Number(e.target.value) || 5))}
                    style={{
                      width: 56, textAlign: 'right', padding: 0,
                      background: 'transparent', border: 'none', outline: 'none',
                      color: 'inherit', fontFamily: 'inherit', fontSize: 14, fontWeight: 500,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  />
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{lang === 'zh' ? '分钟' : 'min'}</span>
                </div>
                <button
                  onClick={() => setDuration(clampDuration(duration + 5))}
                  style={{
                    width: 32, height: 38, flexShrink: 0,
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-secondary)',
                    fontFamily: 'inherit', fontSize: 16,
                    cursor: 'default', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '0 8px 8px 0',
                  }}
                >+</button>
              </div>
            </ParsedField>
          </div>

          {/* Pomodoro display */}
          <div style={{
            marginTop: 14, padding: '10px 12px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-faint)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--text-faint)',
            }}>
              {lang === 'zh' ? '约' : '≈'} {pomos} {lang === 'zh' ? '个番茄' : 'pomodoros'}
            </span>
            <span style={{ flex: 1 }} />
            <span className="pip">
              {Array.from({ length: Math.max(pomos, 4) }).map((_, i) => (
                <i key={i} className={i < pomos ? 'on' : ''} style={{ width: 8, height: 8 }} />
              ))}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 20px',
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-faint)',
          borderRadius: '0 0 14px 14px',
        }}>
          <span style={{ flex: 1 }} />
          <button className="btn btn-ghost" onClick={onClose}>
            {lang === 'zh' ? '取消' : 'Cancel'}
          </button>
          <button className="btn btn-secondary" onClick={handleAdd} disabled={loading || !title.trim()}>
            {lang === 'zh' ? '添加并开始' : 'Add & start'}
          </button>
          <button
            className="btn btn-primary"
            onClick={handleAdd}
            disabled={loading || !title.trim()}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {lang === 'zh' ? '添加' : 'Add'}
            <span style={{
              padding: '1px 5px', borderRadius: 3, marginLeft: 6,
              background: 'rgba(0,0,0,0.15)',
              fontFamily: 'var(--font-mono)', fontSize: 10,
            }}>↵</span>
          </button>
        </div>
      </div>
    </div>
  )
}
