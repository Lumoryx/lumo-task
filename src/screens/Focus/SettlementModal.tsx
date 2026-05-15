import type { Task } from '../../types/api'

interface Props {
  task: Task
  lang: string
  completedPomos: number
  actualMins: number
  onDone: () => void
  onAgain: () => void
  onBack: () => void
}

export function SettlementModal({ task, lang, onDone, onAgain, onBack }: Props) {
  const title = lang === 'zh' ? (task.title.zh ?? task.title.en) : task.title.en

  return (
    <div className="fade-in" style={{
      position: 'absolute', inset: 0,
      background: 'rgba(8, 11, 10, 0.78)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 5,
    }}>
      <div style={{
        width: 460,
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-default)',
        borderRadius: 12,
        padding: '28px 28px 22px',
        boxShadow: 'var(--shadow-lifted)',
      }}>
        {/* Check icon */}
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'var(--accent-fog)',
          border: '1px solid var(--accent-edge)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--accent-primary)',
          marginBottom: 14,
        }}>
          <span style={{ width: 18, height: 18, display: 'inline-flex' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12l5 5 11-11" />
            </svg>
          </span>
        </div>

        <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
          {lang === 'zh' ? '番茄完成！' : 'Pomodoro complete!'}
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 8, lineHeight: 1.5 }}>
          {lang === 'zh' ? `专注于"${title}"的一个番茄已完成。` : `Great work on "${title}". Ready for what's next?`}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 20 }}>
          <button className="btn btn-primary" onClick={onDone} style={{ justifyContent: 'space-between', width: '100%' }}>
            <span>{lang === 'zh' ? '标记任务完成' : 'Mark task done'}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
          <button className="btn btn-secondary" onClick={onAgain} style={{ justifyContent: 'space-between', width: '100%' }}>
            <span>{lang === 'zh' ? '再来一个番茄' : 'Another pomodoro'}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
          <button className="btn btn-ghost" onClick={onBack} style={{ justifyContent: 'space-between', width: '100%' }}>
            <span>{lang === 'zh' ? '返回' : 'Go back'}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
