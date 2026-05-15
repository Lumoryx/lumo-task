import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LumoGlyph } from '../../components/ai/LumoGlyph'
import { useSettingsStore } from '../../store/settings'

const STEP_LABELS = ['Add tasks', 'Focus length', 'Do Not Disturb']
const STEP_LABELS_ZH = ['添加任务', '专注时长', '免打扰']

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: 36, height: 20, borderRadius: 10,
        background: on ? 'var(--accent-primary)' : 'var(--border-strong)',
        border: 'none', position: 'relative', cursor: 'default',
        transition: 'background 120ms var(--ease-default)',
      }}
    >
      <span style={{
        position: 'absolute', top: 2, left: on ? 18 : 2,
        width: 16, height: 16, borderRadius: '50%',
        background: on ? 'var(--bg-deep)' : 'var(--text-primary)',
        transition: 'left 160ms var(--ease-default)',
      }} />
    </button>
  )
}

function isZh(lang: string): boolean {
  return isZh(lang)
}

export function OnboardingScreen() {
  const navigate = useNavigate()
  const { language } = useSettingsStore()
  const lang: string = language
  const [step, setStep] = useState(0)
  const [obTasks, setObTasks] = useState([
    'Finish homepage wireframes',
    'Draft Q3 OKRs',
  ])
  const [input, setInput] = useState('')
  const [focusMin, setFocusMin] = useState(25)
  const [dndOn, setDndOn] = useState(true)

  const stepLabels = isZh(lang) ? STEP_LABELS_ZH : STEP_LABELS

  const handleDone = () => navigate('/today')

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: `
        radial-gradient(70% 50% at 50% 0%, rgba(61, 255, 160, 0.05), transparent 70%),
        var(--bg-base)
      `,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Top bar */}
      <div style={{ padding: '32px 48px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <LumoGlyph size={24} />
        <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>Lumo Task</span>
        <span style={{ flex: 1 }} />
        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 6 }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              width: i === step ? 24 : 6, height: 6, borderRadius: 3,
              background: i <= step ? 'var(--accent-primary)' : 'var(--border-default)',
              transition: 'all 240ms var(--ease-default)',
            }} />
          ))}
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>
          {step + 1} / 3 · {stepLabels[step]}
        </span>
      </div>

      {/* Content */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 48px',
      }}>
        <div style={{ maxWidth: 560, width: '100%' }} className="fade-in" key={step}>

          {/* Step 0: Add tasks */}
          {step === 0 && (
            <>
              <div style={{ fontSize: 32, fontWeight: 600, lineHeight: 1.2, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                {isZh(lang) ? '你现在在做什么？' : "What's on your plate?"}
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 12, lineHeight: 1.55 }}>
                {isZh(lang) ? '添加几个任务，Lumo 会帮你找到今天最重要的那件事。' : "Add a few tasks — Lumo will help you find the most important one to start."}
              </div>
              <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {obTasks.map((tk, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 16px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 8,
                  }}>
                    <span style={{
                      width: 18, height: 18, borderRadius: '50%',
                      background: 'var(--accent-fog)',
                      border: '1px solid var(--accent-edge)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--accent-primary)', fontSize: 11, fontWeight: 600,
                      flexShrink: 0,
                    }}>{i + 1}</span>
                    <span style={{ flex: 1, fontSize: 14 }}>{tk}</span>
                    <span style={{
                      fontSize: 10, color: 'var(--accent-primary)',
                      background: 'var(--accent-fog)',
                      border: '1px solid var(--accent-edge)',
                      padding: '2px 7px', borderRadius: 4, letterSpacing: '0.02em',
                    }}>Q2 · ~30 min</span>
                  </div>
                ))}
                {/* Input */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '0 16px', height: 48,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 8,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)', boxShadow: '0 0 8px var(--accent-primary)' }} />
                  <input
                    placeholder={isZh(lang) ? '再添加一个任务…' : 'Add another task…'}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && input.trim()) {
                        setObTasks([...obTasks, input.trim()])
                        setInput('')
                      }
                    }}
                    style={{
                      flex: 1, background: 'transparent', border: 'none',
                      color: 'var(--text-primary)', fontFamily: 'inherit',
                      fontSize: 14, outline: 'none',
                    }}
                  />
                  <span style={{ fontSize: 11, color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>↵</span>
                </div>
              </div>
            </>
          )}

          {/* Step 1: Focus duration */}
          {step === 1 && (
            <>
              <div style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.2, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                {isZh(lang) ? '你的专注节奏是？' : 'How long is your focus session?'}
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 12 }}>
                {isZh(lang) ? '可以之后在设置里再调。' : 'You can change this anytime in Settings.'}
              </div>
              <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                {([15, 25, 50] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => setFocusMin(m)}
                    style={{
                      padding: '22px 16px', textAlign: 'left',
                      background: focusMin === m ? 'var(--accent-fog)' : 'var(--bg-surface)',
                      border: `1px solid ${focusMin === m ? 'var(--accent-edge)' : 'var(--border-default)'}`,
                      borderRadius: 10, cursor: 'default',
                      color: 'var(--text-primary)', fontFamily: 'inherit',
                    }}
                  >
                    <div style={{
                      fontSize: 28, fontWeight: 500,
                      color: focusMin === m ? 'var(--accent-primary)' : 'var(--text-primary)',
                      fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em',
                    }}>
                      {m} <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>min</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
                      {m === 15 && (isZh(lang) ? '短促清晰' : 'Sharp & light')}
                      {m === 25 && (isZh(lang) ? '经典番茄 · 推荐' : 'Classic pomodoro · suggested')}
                      {m === 50 && (isZh(lang) ? '深度沉浸' : 'Deep immersion')}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 2: DND */}
          {step === 2 && (
            <>
              <div style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.2, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                {isZh(lang) ? '保护你的专注时间' : 'Protect your focus hours'}
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 12 }}>
                {isZh(lang) ? '在这段时间内，Lumo 不会主动出声。' : "Lumo won't reach out during these hours."}
              </div>
              <div style={{
                marginTop: 36, padding: 22,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 10,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{isZh(lang) ? '免打扰' : 'Do Not Disturb'}</span>
                  <span style={{ flex: 1 }} />
                  <Toggle on={dndOn} onChange={setDndOn} />
                </div>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center', opacity: dndOn ? 1 : 0.4 }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{isZh(lang) ? '从' : 'From'}</div>
                    <div style={{ fontSize: 22, fontWeight: 500, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums', fontFamily: 'var(--font-mono)' }}>22:00</div>
                  </div>
                  <div style={{ flex: 1, height: 2, background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-dim))', borderRadius: 1, marginTop: 12 }} />
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{isZh(lang) ? '到' : 'To'}</div>
                    <div style={{ fontSize: 22, fontWeight: 500, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums', fontFamily: 'var(--font-mono)' }}>09:00</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '20px 48px 36px',
        display: 'flex', alignItems: 'center', gap: 12,
        borderTop: '1px solid var(--border-faint)',
      }}>
        <button className="btn btn-ghost" onClick={handleDone}>
          {isZh(lang) ? '跳过' : 'Skip'}
        </button>
        <span style={{ flex: 1 }} />
        {step > 0 && (
          <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
            {isZh(lang) ? '上一步' : 'Back'}
          </button>
        )}
        <button className="btn btn-primary" onClick={() => step < 2 ? setStep(step + 1) : handleDone()}>
          {step < 2 ? (isZh(lang) ? '下一步' : 'Next') : (isZh(lang) ? '开始' : "Let's go")}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  )
}
