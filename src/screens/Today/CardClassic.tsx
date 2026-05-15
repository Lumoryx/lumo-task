import { useState } from 'react'
import type { AIRecommendation, Task } from '../../types/api'
import { LumoStatus } from '../../components/ai/LumoStatus'
import { useSettingsStore } from '../../store/settings'
import type { AIVariant } from '../../types/ui'

const IconPlay = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" style={{ width: 14, height: 14 }}>
    <path d="M7 5v14l12-7z" />
  </svg>
)

const IconMore = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
    style={{ width: 16, height: 16 }}>
    <circle cx="5" cy="12" r="1.2" /><circle cx="12" cy="12" r="1.2" /><circle cx="19" cy="12" r="1.2" />
  </svg>
)

interface Props {
  recommendation: AIRecommendation
  onStartFocus: (task: Task) => void
  aiVariant?: AIVariant
}

function getDueLabel(dueDate: string | undefined, lang: string): string {
  if (!dueDate) return ''
  const date = new Date(dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diff === 0) return lang === 'zh' ? '今天' : 'Today'
  if (diff === 1) return lang === 'zh' ? '明天' : 'Tomorrow'
  if (diff < 0) return lang === 'zh' ? '已逾期' : 'Overdue'
  return date.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' })
}

function fmtDuration(mins: number | undefined, lang: string): string {
  if (!mins) return ''
  if (mins < 60) return lang === 'zh' ? `${mins} 分钟` : `${mins} min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (m === 0) return lang === 'zh' ? `${h} 小时` : `${h}h`
  return lang === 'zh' ? `${h} 小时 ${m} 分` : `${h}h ${m}m`
}

export function CardClassic({ recommendation, onStartFocus, aiVariant = 'dot' }: Props) {
  const { task, reason, conviction } = recommendation
  const { language } = useSettingsStore()
  const lang = language
  const [menuOpen, setMenuOpen] = useState(false)

  const title = lang === 'zh' && task.title.zh ? task.title.zh : task.title.en
  const desc = task.description
    ? (lang === 'zh' && task.description.zh ? task.description.zh : task.description.en)
    : null
  const reasonText = lang === 'zh' && reason.zh ? reason.zh : reason.en

  const quadrantClass = task.quadrant !== 'unclassified'
    ? `chip chip-${task.quadrant.toLowerCase()}`
    : 'chip chip-q4'

  return (
    <div className="float-up" style={{
      position: 'relative',
      background: 'linear-gradient(180deg, var(--bg-elevated) 0%, #161D19 100%)',
      border: '1px solid var(--border-default)',
      borderRadius: 12,
      padding: 28,
      overflow: 'visible',
    }}>
      {/* Halo — clipped by overflow-hidden wrapper so action menu can escape */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 12,
        overflow: 'hidden', pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute', top: -120, right: -80, width: 320, height: 320,
          background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 60%)',
        }} />
      </div>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
        <span className="chip chip-ai">
          <span style={{
            width: 4, height: 4, borderRadius: '50%',
            background: 'var(--accent-primary)',
            boxShadow: '0 0 6px var(--accent-primary)',
          }} />
          {lang === 'zh' ? 'Lumo 推荐' : 'Recommended'}
        </span>
        {task.quadrant !== 'unclassified' && (
          <span className={quadrantClass}>{task.quadrant}</span>
        )}
        <span style={{ flex: 1 }} />
        <span style={{
          fontSize: 11, color: 'var(--text-muted)',
          fontVariantNumeric: 'tabular-nums',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          {task.due_date && <span>{getDueLabel(task.due_date, lang)}</span>}
          {task.due_date && task.estimated_mins && <span>·</span>}
          {task.estimated_mins && <span>{fmtDuration(task.estimated_mins, lang)}</span>}
          {(task.due_date || task.estimated_mins) && task.estimated_pomos > 0 && <span>·</span>}
          {task.estimated_pomos > 0 && (
            <span className="pip" style={{ verticalAlign: 'middle' }}>
              {Array.from({ length: task.estimated_pomos }).map((_, i) => (
                <i key={i} className={i < task.actual_pomos ? 'on' : ''} />
              ))}
            </span>
          )}
        </span>
      </div>

      {/* Title */}
      <div style={{
        fontSize: 26, fontWeight: 600, color: 'var(--text-primary)',
        lineHeight: 1.25, marginTop: 18, letterSpacing: '-0.01em',
        maxWidth: 620, position: 'relative',
      }}>
        {title}
      </div>

      {/* Description */}
      {desc && (
        <div style={{
          fontSize: 14, color: 'var(--text-secondary)',
          marginTop: 10, lineHeight: 1.6, maxWidth: 620, position: 'relative',
        }}>
          {desc}
        </div>
      )}

      {/* AI reasoning box */}
      <div style={{
        marginTop: 20, padding: '12px 14px',
        background: 'rgba(61, 255, 160, 0.025)',
        border: '1px solid rgba(61, 255, 160, 0.18)',
        borderRadius: 8,
        display: 'flex', gap: 12, alignItems: 'center',
        position: 'relative',
      }}>
        <LumoStatus variant={aiVariant} text="" />
        <div style={{
          fontSize: 13, color: 'var(--text-secondary)',
          lineHeight: 1.55, flex: 1,
          marginLeft: aiVariant === 'orb' ? -4 : -10,
        }}>
          {reasonText}
        </div>
        {conviction != null && (
          <span style={{
            fontSize: 11, color: 'var(--accent-primary)',
            fontVariantNumeric: 'tabular-nums',
            fontWeight: 600, flexShrink: 0,
          }}>
            {Math.round(conviction * 100)}%
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div style={{
        display: 'flex', gap: 8, marginTop: 22,
        position: 'relative', alignItems: 'center',
      }}>
        <button className="btn btn-primary btn-lg" onClick={() => onStartFocus(task)}>
          <IconPlay />
          {lang === 'zh' ? '开始专注' : 'Start Focus'}
        </button>
        <button className="btn btn-ghost">
          {lang === 'zh' ? '稍后再说' : 'not now'}
        </button>
        <span style={{ flex: 1 }} />
        <div style={{ position: 'relative' }}>
          <button
            onClick={e => { e.stopPropagation(); setMenuOpen(v => !v) }}
            style={{
              width: 34, height: 34, borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: menuOpen ? 'var(--bg-elevated)' : 'transparent',
              border: 'none',
              color: menuOpen ? 'var(--text-primary)' : 'var(--text-muted)',
              cursor: 'default', fontFamily: 'inherit',
              transition: 'all 120ms var(--ease-default)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--bg-elevated)'
              e.currentTarget.style.color = 'var(--text-primary)'
            }}
            onMouseLeave={e => {
              if (!menuOpen) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'var(--text-muted)'
              }
            }}
          >
            <IconMore />
          </button>
        </div>
      </div>
    </div>
  )
}
