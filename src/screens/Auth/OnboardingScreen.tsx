import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LumoGlyph } from '../../components/ai/LumoGlyph'
import { LumoStatus } from '../../components/ai/LumoStatus'
import { Btn } from '../../components/common/Btn'
import { useSettingsStore } from '../../store/settings'
import type { AccentTheme } from '../../types/ui'
import styles from './Onboarding.module.css'

const ACCENTS: { value: AccentTheme; label: string; color: string }[] = [
  { value: 'green', label: 'Lumo Green', color: '#00C896' },
  { value: 'violet', label: 'Violet', color: '#7C6BFF' },
  { value: 'coral', label: 'Coral', color: '#FF6B6B' },
  { value: 'gold', label: 'Gold', color: '#F5B731' },
]

const STEPS = ['Choose your accent', 'AI setup (optional)', "You're all set"]

export function OnboardingScreen() {
  const navigate = useNavigate()
  const { accent, setAccent } = useSettingsStore()
  const [step, setStep] = useState(0)

  const next = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1)
    else navigate('/today')
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Steps indicator */}
        <div className={styles.steps}>
          {STEPS.map((_, i) => (
            <div key={i} className={`${styles.step} ${i <= step ? styles.stepActive : ''}`} />
          ))}
        </div>

        {step === 0 && (
          <div className={styles.content}>
            <div className={styles.glyphWrap}>
              <LumoStatus variant="orb" size="lg" pulse />
            </div>
            <h1 className={styles.title}>Welcome to Lumo</h1>
            <p className={styles.sub}>AI-powered task management for deep work. Let's personalize your experience.</p>
            <p className={styles.stepLabel}>Choose your accent color</p>
            <div className={styles.accents}>
              {ACCENTS.map(a => (
                <button
                  key={a.value}
                  className={`${styles.accentBtn} ${accent === a.value ? styles.accentSelected : ''}`}
                  onClick={() => setAccent(a.value)}
                  style={{ '--swatch': a.color } as React.CSSProperties}
                  title={a.label}
                >
                  <span className={styles.swatch} />
                  <span className={styles.accentLabel}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className={styles.content}>
            <div className={styles.glyphWrap}>
              <LumoGlyph size={60} />
            </div>
            <h1 className={styles.title}>Set up AI (optional)</h1>
            <p className={styles.sub}>
              Connect your AI provider to unlock smart recommendations, task classification, and focus coaching.
            </p>
            <p className={styles.hint}>You can configure this later in Settings › AI.</p>
          </div>
        )}

        {step === 2 && (
          <div className={styles.content}>
            <div className={styles.glyphWrap}>
              <LumoStatus variant="orb" size="lg" pulse />
            </div>
            <h1 className={styles.title}>You're all set!</h1>
            <p className={styles.sub}>Lumo is ready to help you focus on what matters most today.</p>
          </div>
        )}

        <div className={styles.actions}>
          <Btn fullWidth onClick={next}>
            {step < STEPS.length - 1 ? 'Continue' : 'Start Using Lumo'}
          </Btn>
          {step < STEPS.length - 1 && (
            <Btn variant="ghost" fullWidth onClick={() => navigate('/today')}>
              Skip
            </Btn>
          )}
        </div>
      </div>
    </div>
  )
}
