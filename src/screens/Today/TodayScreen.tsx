import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTasksStore } from '../../store/tasks'
import { useFocusStore } from '../../store/focus'
import { useSettingsStore } from '../../store/settings'
import { LumoStatus } from '../../components/ai/LumoStatus'
import { ComposeBar } from './ComposeBar'
import { CardClassic } from './CardClassic'
import { CardConviction } from './CardConviction'
import type { Task } from '../../types/api'
import type { AIVariant } from '../../types/ui'

const IconArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
)

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

// ── Empty state ────────────────────────────────────────────────────────────
function TodayEmpty({ lang }: { lang: string }) {
  const suggestions = lang === 'zh'
    ? ['写一份产品介绍', '回邮件', '运动 30 分钟', '学一节课']
    : ['Write a product intro', 'Reply to emails', '30-min workout', 'Take one lesson']

  return (
    <div className="fade-in" style={{
      maxWidth: 600, margin: '60px auto 0', padding: '0 32px',
      textAlign: 'center',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
    }}>
      {/* Big ambient orb */}
      <div style={{ position: 'relative', width: 140, height: 140 }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
          animation: 'lumoBreath 4s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', inset: 30, borderRadius: '50%',
          border: '1px solid var(--accent-edge)',
          animation: 'lumoBreath 4s ease-in-out infinite reverse',
        }} />
        <div style={{
          position: 'absolute', inset: 55, borderRadius: '50%',
          background: 'var(--accent-primary)',
          boxShadow: '0 0 20px var(--accent-primary)',
          animation: 'lumoBreath 4s ease-in-out infinite',
        }} />
      </div>

      <div>
        <div style={{
          fontSize: 24, fontWeight: 600, color: 'var(--text-primary)',
          letterSpacing: '-0.01em', lineHeight: 1.3,
        }}>
          {lang === 'zh' ? '今天想推进什么？' : 'What would you like to push forward today?'}
        </div>
        <div style={{
          fontSize: 14, color: 'var(--text-secondary)', marginTop: 10,
          lineHeight: 1.6, maxWidth: 460, margin: '10px auto 0',
        }}>
          {lang === 'zh'
            ? '输入一个任务，Lumo 会为你分类。'
            : 'Type a task below, and Lumo will classify it for you.'}
        </div>
      </div>

      {/* Quick input */}
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '0 18px', height: 56,
          background: 'var(--bg-surface)',
          border: '1px solid var(--accent-edge)',
          borderRadius: 12,
          boxShadow: '0 0 24px var(--accent-fog)',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--accent-primary)',
            boxShadow: '0 0 8px var(--accent-primary)',
            animation: 'lumoBreath 3s ease-in-out infinite',
            flexShrink: 0,
          }} />
          <input
            className="input"
            placeholder={lang === 'zh' ? '例如"明天下午写产品介绍"' : 'e.g. "Write product intro tomorrow"'}
            style={{ background: 'transparent', border: 'none', height: 'auto', padding: 0, fontSize: 15 }}
          />
          <span style={{ fontSize: 11, color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>↵</span>
        </div>

        {/* Suggestion chips */}
        <div style={{
          marginTop: 14,
          display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap',
        }}>
          {suggestions.map(chip => (
            <span key={chip} style={{
              padding: '5px 10px', borderRadius: 999,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              fontSize: 11, color: 'var(--text-secondary)',
              cursor: 'default',
            }}>
              {chip}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── In-progress banner ──────────────────────────────────────────────────────
function TodayInProgress({
  lang,
  task,
  aiVariant,
  secondsLeft,
  onResume,
}: {
  lang: string
  task: Task
  aiVariant: AIVariant
  secondsLeft: number
  onResume: () => void
}) {
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const ss = String(secondsLeft % 60).padStart(2, '0')
  const title = lang === 'zh' && task.title.zh ? task.title.zh : task.title.en

  return (
    <div className="fade-in" style={{ maxWidth: 880, margin: '0 auto', padding: '20px 32px 40px' }}>
      <LumoStatus variant={aiVariant} text={lang === 'zh' ? '专注中' : 'In focus'} />

      <div className="float-up" style={{
        marginTop: 16,
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(61, 255, 160, 0.06) 0%, var(--bg-surface) 60%)',
        border: '1px solid var(--accent-edge)',
        borderRadius: 12,
        padding: 24,
        overflow: 'hidden',
        display: 'flex', alignItems: 'center', gap: 22,
      }}>
        {/* Mini progress ring */}
        <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
          <svg viewBox="0 0 80 80" style={{ position: 'absolute', inset: 0 }}>
            <circle cx="40" cy="40" r="34" fill="none" stroke="var(--border-default)" strokeWidth="2" />
            <circle cx="40" cy="40" r="34" fill="none"
              stroke="var(--accent-primary)" strokeWidth="3" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 34}
              strokeDashoffset={(1 - 0.75) * 2 * Math.PI * 34}
              transform="rotate(-90 40 40)"
              style={{ filter: 'drop-shadow(0 0 6px var(--accent-primary))' }} />
          </svg>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column',
          }}>
            <div style={{
              fontSize: 18, fontWeight: 500, fontFamily: 'var(--font-mono)',
              color: 'var(--text-primary)', letterSpacing: '-0.02em',
              fontVariantNumeric: 'tabular-nums', lineHeight: 1,
            }}>
              {mm}:{ss}
            </div>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'var(--accent-primary)',
            marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--accent-primary)',
              boxShadow: '0 0 8px var(--accent-primary)',
              animation: 'lumoBreath 3s ease-in-out infinite',
            }} />
            {lang === 'zh' ? '正在专注' : 'In a focus session'}
          </div>
          <div style={{
            fontSize: 18, fontWeight: 600, color: 'var(--text-primary)',
            letterSpacing: '-0.01em', lineHeight: 1.3,
          }}>
            {title}
          </div>
        </div>

        <button className="btn btn-primary btn-lg" onClick={onResume} style={{ flexShrink: 0 }}>
          <IconArrowRight />
          {lang === 'zh' ? '回到专注' : 'Resume Focus'}
        </button>
      </div>
    </div>
  )
}

// ── Task row (simple, for today list) ──────────────────────────────────────
function TodayTaskRow({ task, lang }: { task: Task; lang: string }) {
  const q = task.quadrant === 'unclassified' ? 'un' : task.quadrant.toLowerCase()
  const title = lang === 'zh' && task.title.zh ? task.title.zh : task.title.en

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 0 14px 8px',
      borderBottom: '1px solid var(--border-faint)',
      marginLeft: -8, paddingRight: 8, marginRight: -8,
      borderRadius: 6,
      transition: 'background 120ms var(--ease-default)',
    }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-subtle)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <button style={{
        width: 18, height: 18, borderRadius: '50%',
        border: '1.5px solid var(--border-strong)',
        background: 'transparent',
        flexShrink: 0, cursor: 'default',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }} />
      <span className={`qdot qdot-${q}`} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>
          {title}
        </div>
        <div style={{
          display: 'flex', gap: 12, marginTop: 4,
          fontSize: 12, color: 'var(--text-muted)',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {task.due_date && <span>{getDueLabel(task.due_date, lang)}</span>}
          {task.estimated_mins && <span>{fmtDuration(task.estimated_mins, lang)}</span>}
          {task.estimated_pomos > 0 && (
            <span className="pip">
              {Array.from({ length: task.estimated_pomos }).map((_, i) => (
                <i key={i} className={i < task.actual_pomos ? 'on' : ''} />
              ))}
            </span>
          )}
        </div>
      </div>
      {task.quadrant !== 'unclassified' && (
        <span className={`chip chip-${task.quadrant.toLowerCase()}`}>{task.quadrant}</span>
      )}
    </div>
  )
}

// ── Main Today screen ───────────────────────────────────────────────────────
export function TodayScreen() {
  const { todayTasks, recommendation, fetchToday, loading } = useTasksStore()
  const { phase, activeTask, secondsLeft, startSession } = useFocusStore()
  const { todayCardVariant, language } = useSettingsStore()
  const navigate = useNavigate()
  const lang = language

  // Pick a stable AI variant based on card variant
  const aiVariant: AIVariant =
    todayCardVariant === 'conviction' ? 'orb'
    : todayCardVariant === 'path' ? 'text'
    : 'dot'

  useEffect(() => {
    fetchToday()
  }, [fetchToday])

  const handleStartFocus = async (task: Task) => {
    const { startPomodoro } = useTasksStore.getState()
    const { pomodoroDurationMins } = useSettingsStore.getState()
    const sessionId = await startPomodoro(task.id)
    startSession(task, sessionId, pomodoroDurationMins)
    navigate('/focus')
  }

  const handleResume = () => {
    navigate('/focus')
  }

  // In-progress state
  if (phase !== 'idle' && activeTask) {
    return (
      <TodayInProgress
        lang={lang}
        task={activeTask}
        aiVariant={aiVariant}
        secondsLeft={secondsLeft}
        onResume={handleResume}
      />
    )
  }

  // Loading
  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100%', gap: 16, color: 'var(--text-secondary)',
      }}>
        <LumoStatus variant="orb" text={lang === 'zh' ? '加载中…' : 'Loading your day…'} />
      </div>
    )
  }

  const activePending = todayTasks.filter(t => t.status !== 'completed')
  const completed = todayTasks.filter(t => t.status === 'completed')

  // Empty state
  if (activePending.length === 0) {
    return (
      <div style={{ height: '100%', overflow: 'auto' }}>
        <TodayEmpty lang={lang} />
        <div style={{ maxWidth: 880, margin: '0 auto', padding: '0 32px 40px' }}>
          <ComposeBar />
        </div>
      </div>
    )
  }

  const otherTasks = activePending.filter(t => t.id !== recommendation?.task.id)

  return (
    <div className="fade-in" style={{ maxWidth: 880, margin: '0 auto', padding: '20px 32px 40px' }}>
      {/* Lumo status header */}
      <div style={{
        marginBottom: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <LumoStatus variant={aiVariant} text={lang === 'zh' ? 'Lumo 已为你排序' : 'Lumo has sorted your day'} />
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 11, color: 'var(--text-faint)',
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--status-success)' }} />
          <span>{lang === 'zh' ? '本地模式' : 'Local mode'}</span>
        </div>
      </div>

      {/* Recommendation card */}
      {recommendation && (
        todayCardVariant === 'conviction' ? (
          <CardConviction
            recommendation={recommendation}
            onStartFocus={handleStartFocus}
            aiVariant={aiVariant}
          />
        ) : (
          <CardClassic
            recommendation={recommendation}
            onStartFocus={handleStartFocus}
            aiVariant={aiVariant}
          />
        )
      )}

      {/* Today task list */}
      {otherTasks.length > 0 && (
        <div style={{ marginTop: 36 }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 6,
          }}>
            <div className="section-h" style={{ margin: 0 }}>
              {lang === 'zh' ? '今日任务' : "Today's tasks"}
            </div>
            <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>
              {otherTasks.length} {lang === 'zh' ? '项' : 'tasks'}
            </span>
          </div>
          {otherTasks.map(task => (
            <TodayTaskRow key={task.id} task={task} lang={lang} />
          ))}
        </div>
      )}

      {/* Completed today */}
      {completed.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <div className="section-h">
            {lang === 'zh' ? '已完成' : 'Completed today'}
          </div>
          {completed.map(c => {
            const ctitle = lang === 'zh' && c.title.zh ? c.title.zh : c.title.en
            return (
              <div key={c.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 0', borderBottom: '1px solid var(--border-faint)',
                opacity: 0.55,
              }}>
                <span style={{
                  width: 18, height: 18, borderRadius: '50%',
                  background: 'var(--accent-dim)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--bg-base)', flexShrink: 0,
                }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12l5 5 11-11" />
                  </svg>
                </span>
                <div style={{
                  fontSize: 13, color: 'var(--text-secondary)',
                  textDecoration: 'line-through', textDecorationColor: 'var(--text-faint)',
                  flex: 1,
                }}>
                  {ctitle}
                </div>
                {c.estimated_mins && (
                  <span style={{
                    fontSize: 11, color: 'var(--text-faint)',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {fmtDuration(c.estimated_mins, lang)}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Natural language compose bar */}
      <ComposeBar />
    </div>
  )
}
