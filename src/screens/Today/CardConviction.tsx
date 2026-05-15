import type { AIRecommendation, Task } from '../../types/api'
import { LumoStatus } from '../../components/ai/LumoStatus'
import { useSettingsStore } from '../../store/settings'
import { useTasksStore } from '../../store/tasks'
import type { AIVariant } from '../../types/ui'

const IconPlay = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" style={{ width: 14, height: 14 }}>
    <path d="M7 5v14l12-7z" />
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

export function CardConviction({ recommendation, onStartFocus, aiVariant = 'dot' }: Props) {
  const { task, reason, conviction, not_now } = recommendation
  const { language } = useSettingsStore()
  const { tasks } = useTasksStore()
  const lang = language

  const title = lang === 'zh' && task.title.zh ? task.title.zh : task.title.en
  const reasonText = lang === 'zh' && reason.zh ? reason.zh : reason.en
  const pct = Math.round((conviction ?? 0) * 100)

  const quadrantClass = task.quadrant !== 'unclassified'
    ? `chip chip-${task.quadrant.toLowerCase()}`
    : 'chip chip-q4'

  return (
    <div className="float-up" style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-default)',
      borderRadius: 12,
      padding: 0,
      overflow: 'hidden',
      display: 'grid',
      gridTemplateColumns: '1fr 240px',
    }}>
      {/* Main column */}
      <div style={{ padding: '28px 28px 22px', borderRight: '1px solid var(--border-faint)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <LumoStatus variant={aiVariant} text={lang === 'zh' ? 'Lumo 推荐' : 'Recommended'} />
          <span style={{ flex: 1 }} />
          {task.quadrant !== 'unclassified' && (
            <span className={quadrantClass}>{task.quadrant}</span>
          )}
        </div>

        {/* Italic reasoning quote */}
        <div style={{
          fontSize: 13, color: 'var(--text-secondary)', marginTop: 16,
          fontStyle: 'italic', lineHeight: 1.6,
        }}>
          "{reasonText}"
        </div>

        {/* Task title */}
        <div style={{
          fontSize: 24, fontWeight: 600, color: 'var(--text-primary)',
          lineHeight: 1.25, marginTop: 18, letterSpacing: '-0.01em',
          maxWidth: 540,
        }}>
          {title}
        </div>

        {/* Metadata row */}
        <div style={{
          display: 'flex', gap: 18, marginTop: 16,
          fontSize: 12, color: 'var(--text-muted)',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {task.due_date && (
            <span>
              <span style={{ color: 'var(--text-faint)' }}>
                {lang === 'zh' ? '截止' : 'Due'}
              </span>
              {' · '}{getDueLabel(task.due_date, lang)}
            </span>
          )}
          {task.estimated_mins && (
            <span>
              <span style={{ color: 'var(--text-faint)' }}>
                {lang === 'zh' ? '预计' : 'Est'}
              </span>
              {' · '}{fmtDuration(task.estimated_mins, lang)}
            </span>
          )}
          {task.estimated_pomos > 0 && (
            <span>
              <span style={{ color: 'var(--text-faint)' }}>
                {lang === 'zh' ? '番茄' : 'Poms'}
              </span>
              {' · '}
              <span className="pip" style={{ verticalAlign: 'middle' }}>
                {Array.from({ length: task.estimated_pomos }).map((_, i) => (
                  <i key={i} className={i < task.actual_pomos ? 'on' : ''} />
                ))}
              </span>
            </span>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, marginTop: 22 }}>
          <button className="btn btn-primary btn-lg" onClick={() => onStartFocus(task)}>
            <IconPlay />
            {lang === 'zh' ? '开始专注' : 'Start Focus'}
          </button>
          <button className="btn btn-ghost">
            {lang === 'zh' ? '跳过' : 'Skip'}
          </button>
          <button className="btn btn-ghost">
            {lang === 'zh' ? '详情' : 'Details'}
          </button>
        </div>
      </div>

      {/* Conviction sidecar */}
      <div style={{
        padding: '28px 22px 22px',
        background: 'linear-gradient(180deg, rgba(61, 255, 160, 0.04) 0%, transparent 100%)',
        display: 'flex', flexDirection: 'column', gap: 18,
      }}>
        {/* Conviction percentage */}
        <div>
          <div style={{
            fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--text-faint)', marginBottom: 10,
          }}>
            {lang === 'zh' ? '置信度' : 'Conviction'}
          </div>
          <div style={{
            fontSize: 32, fontWeight: 600, color: 'var(--accent-primary)',
            fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em',
            display: 'flex', alignItems: 'baseline', gap: 2,
          }}>
            {pct}
            <span style={{ fontSize: 16, color: 'var(--text-muted)' }}>%</span>
          </div>
          {/* Progress bar */}
          <div style={{
            marginTop: 8, height: 3, background: 'var(--bg-deep)',
            borderRadius: 2, overflow: 'hidden',
          }}>
            <div style={{
              width: pct + '%', height: '100%',
              background: 'linear-gradient(90deg, var(--accent-dim), var(--accent-primary))',
              boxShadow: '0 0 8px var(--accent-primary)',
            }} />
          </div>
        </div>

        {/* Why not others */}
        {not_now.length > 0 && (
          <div>
            <div style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--text-faint)', marginBottom: 10,
            }}>
              {lang === 'zh' ? '为何暂缓' : 'Why not others'}
            </div>
            {not_now.slice(0, 2).map(nn => {
              const ref = tasks.find(x => x.id === nn.task_id)
              if (!ref) return null
              const refTitle = lang === 'zh' && ref.title.zh ? ref.title.zh : ref.title.en
              const nnReason = lang === 'zh' && nn.reason.zh ? nn.reason.zh : nn.reason.en
              return (
                <div key={nn.task_id} style={{ marginBottom: 12 }}>
                  <div style={{
                    fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500,
                    lineHeight: 1.35,
                  }}>
                    {refTitle}
                  </div>
                  <div style={{
                    fontSize: 11, color: 'var(--text-muted)', marginTop: 3,
                    lineHeight: 1.45,
                  }}>
                    {nnReason}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
