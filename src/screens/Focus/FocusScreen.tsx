import { useEffect, useRef, useState } from 'react'
import { useFocusStore } from '../../store/focus'
import { useTasksStore } from '../../store/tasks'
import { useSettingsStore } from '../../store/settings'
import { SettlementModal } from './SettlementModal'

function fmtMMSS(secs: number) {
  const m = Math.max(0, Math.floor(secs / 60))
  const s = Math.max(0, Math.floor(secs % 60))
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function fmtDuration(mins: number, lang: string) {
  if (mins < 60) return `${mins}${lang === 'zh' ? '分' : 'm'}`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h${m}${lang === 'zh' ? '分' : 'm'}` : `${h}h`
}

interface AtmosphereProps {
  progress: number
  paused: boolean
}

function FocusAtmosphere({ progress, paused }: AtmosphereProps) {
  const turns = -90 + progress * 360
  const circumference = 2 * Math.PI * 160

  return (
    <div style={{ position: 'relative', width: 380, height: 380, flexShrink: 0 }}>
      {/* Outer halo */}
      <div style={{
        position: 'absolute', inset: -20, borderRadius: '50%',
        background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 65%)',
        opacity: paused ? 0.3 : 0.9,
        transition: 'opacity 600ms var(--ease-default)',
        animation: paused ? 'none' : 'atmoBreath 5s ease-in-out infinite',
      }} />
      {/* Ambient rings */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        border: '0.5px solid var(--accent-edge)',
        animation: paused ? 'none' : 'atmoBreath 5s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', inset: 30, borderRadius: '50%',
        border: '0.5px solid rgba(61, 255, 160, 0.15)',
      }} />
      {/* Progress ring SVG */}
      <svg viewBox="0 0 380 380" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <linearGradient id="focusProgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-primary)" />
            <stop offset="100%" stopColor="var(--accent-dim)" />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle cx="190" cy="190" r="160" fill="none"
          stroke="var(--border-default)" strokeWidth="2" opacity="0.6" />
        {/* Progress arc */}
        <circle cx="190" cy="190" r="160" fill="none"
          stroke="url(#focusProgGrad)" strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={(1 - progress) * circumference}
          transform="rotate(-90 190 190)"
          style={{
            filter: 'drop-shadow(0 0 8px var(--accent-primary))',
            transition: 'stroke-dashoffset 1s linear',
          }} />
        {/* Tick at current position */}
        <circle
          cx={190 + 160 * Math.cos(turns * Math.PI / 180)}
          cy={190 + 160 * Math.sin(turns * Math.PI / 180)}
          r="5" fill="var(--accent-primary)"
          style={{ filter: 'drop-shadow(0 0 6px var(--accent-primary))' }} />
      </svg>
    </div>
  )
}

export function FocusScreen() {
  const {
    phase, activeTask, secondsLeft, totalSeconds, isRunning, completedPomos,
    pauseResume, tick, endSession, setPhase,
  } = useFocusStore()
  const { shortBreakMins, longBreakMins, pomosBeforeLongBreak, language } = useSettingsStore()
  const { completeTask } = useTasksStore()
  const [showSettlement, setShowSettlement] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lang = language

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(tick, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isRunning, tick])

  useEffect(() => {
    if (secondsLeft === 0 && phase === 'pomodoro' && totalSeconds > 0) {
      setShowSettlement(true)
    }
  }, [secondsLeft, phase, totalSeconds])

  const progress = totalSeconds > 0 ? 1 - secondsLeft / totalSeconds : 0
  const paused = !isRunning && phase !== 'idle'

  const handleAbandon = () => {
    endSession()
    setShowSettlement(false)
  }

  const handleSettlementDone = () => {
    if (activeTask) completeTask(activeTask.id)
    endSession()
    setShowSettlement(false)
  }

  const handleNextPhase = () => {
    const isLongBreak = completedPomos > 0 && completedPomos % pomosBeforeLongBreak === 0
    const next = isLongBreak ? 'long_break' : 'short_break'
    const mins = isLongBreak ? longBreakMins : shortBreakMins
    setPhase(next as 'short_break' | 'long_break', mins)
    setShowSettlement(false)
  }

  if (phase === 'idle') {
    return (
      <div className="fade-in" style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        height: '100%', minHeight: 0,
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-base)',
        color: 'var(--text-muted)', fontSize: 14,
      }}>
        <div className="lumo-bar">
          <span className="lumo-glyph">
            <span className="halo" />
            <span className="core" />
          </span>
          <span>{lang === 'zh' ? '没有进行中的专注。从今日界面开始一个任务。' : 'No active session. Start a focus session from the Today screen.'}</span>
        </div>
      </div>
    )
  }

  const taskTitle = activeTask
    ? (lang === 'zh' ? (activeTask.title.zh ?? activeTask.title.en) : activeTask.title.en)
    : (lang === 'zh' ? '完成客户评审用的首页线框' : 'Finish homepage wireframes for client review')

  const estMins = activeTask?.estimated_mins ?? 90
  const actualMins = totalSeconds > 0 ? Math.round((totalSeconds - secondsLeft) / 60) : 0
  const todayMins = completedPomos * 25

  return (
    <div className="fade-in" style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      height: '100%', minHeight: 0,
      background: `
        radial-gradient(60% 50% at 50% 100%, rgba(61, 255, 160, 0.05) 0%, transparent 70%),
        var(--bg-base)`,
      position: 'relative',
    }}>
      {/* atmoBreath keyframe */}
      <style>{`
        @keyframes atmoBreath {
          0%, 100% { transform: scale(0.98); opacity: 0.85; }
          50% { transform: scale(1.02); opacity: 1; }
        }
      `}</style>

      {/* Top strip */}
      <div style={{
        padding: '20px 32px', display: 'flex', alignItems: 'center', gap: 14,
        borderBottom: '1px solid var(--border-faint)',
      }}>
        <span className="chip chip-q1">Q1</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {taskTitle}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
            {lang === 'zh' ? '目标' : 'Goal'} · {lang === 'zh' ? '完成 Hero 区版式' : 'Finish hero layout draft'}
          </div>
        </div>
        {/* DND indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-faint)', fontSize: 11 }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--accent-primary)',
            boxShadow: '0 0 8px var(--accent-primary)',
            animation: 'lumoBreath 3s ease-in-out infinite',
          }} />
          <span>{lang === 'zh' ? '专注中' : 'DND'}</span>
        </div>
        {/* Exit button */}
        <button
          className="btn btn-ghost"
          onClick={handleAbandon}
          style={{ height: 30 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          {lang === 'zh' ? '退出' : 'Exit'}
        </button>
      </div>

      {/* Center */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', minHeight: 0,
      }}>
        <FocusAtmosphere progress={progress} paused={paused} />

        {/* Centered text overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 4,
        }}>
          {/* Round indicator */}
          <div style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'var(--text-faint)',
          }}>
            {lang === 'zh' ? '第' : 'Round'} {completedPomos + 1} {lang === 'zh' ? '轮' : '/ 4'}
          </div>

          {/* Timer */}
          <div style={{
            fontSize: 88, fontWeight: 200, lineHeight: 1,
            color: 'var(--text-primary)',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.04em',
            fontFamily: 'var(--font-mono)',
            marginTop: 8, marginBottom: 8,
          }}>
            {fmtMMSS(secondsLeft)}
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: 12, marginTop: 8, alignItems: 'center' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleSettlementDone}
              style={{ minWidth: 180, justifyContent: 'center', fontWeight: 600 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12l5 5 11-11" />
              </svg>
              {lang === 'zh' ? '完成' : 'Complete'}
            </button>

            <button
              onClick={pauseResume}
              title={paused ? (lang === 'zh' ? '继续' : 'Resume') : (lang === 'zh' ? '暂停' : 'Pause')}
              style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'default', fontFamily: 'inherit',
                transition: 'all 120ms var(--ease-default)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--bg-subtle)'
                e.currentTarget.style.borderColor = 'var(--border-strong)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--bg-elevated)'
                e.currentTarget.style.borderColor = 'var(--border-default)'
              }}
            >
              <span style={{ width: 16, height: 16, display: 'inline-flex' }}>
                {paused ? (
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
                )}
              </span>
            </button>
          </div>

          {/* Metadata */}
          <div style={{
            marginTop: 14, fontSize: 11, color: 'var(--text-muted)',
            display: 'flex', gap: 20, fontVariantNumeric: 'tabular-nums',
          }}>
            <span>{lang === 'zh' ? '预计' : 'Est'} {fmtDuration(estMins, lang)}</span>
            <span>{lang === 'zh' ? '实际' : 'Actual'} {fmtDuration(actualMins, lang)}</span>
            <span>{lang === 'zh' ? '今日' : 'Today'} {fmtDuration(todayMins, lang)}</span>
          </div>
        </div>
      </div>

      {/* Settlement overlay */}
      {showSettlement && activeTask && (
        <SettlementModal
          task={activeTask}
          lang={lang}
          completedPomos={completedPomos}
          actualMins={actualMins}
          onDone={handleSettlementDone}
          onAgain={() => {
            handleNextPhase()
            setShowSettlement(false)
          }}
          onBack={handleAbandon}
        />
      )}
    </div>
  )
}
