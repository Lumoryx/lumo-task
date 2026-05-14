import { useSettingsStore } from '../../store/settings'
import { Toggle } from '../../components/common/Toggle'
import { SegControl } from '../../components/common/SegControl'
import type { AccentTheme, Language, Density } from '../../types/ui'
import styles from './Settings.module.css'

const ACCENTS: { value: AccentTheme; label: string; color: string }[] = [
  { value: 'green', label: 'Lumo Green', color: '#00C896' },
  { value: 'violet', label: 'Violet', color: '#7C6BFF' },
  { value: 'coral', label: 'Coral', color: '#FF6B6B' },
  { value: 'gold', label: 'Gold', color: '#F5B731' },
]

export function SettingsAppearance() {
  const {
    accent, setAccent,
    language, setLanguage,
    density, setDensity,
    reducedMotion, setReducedMotion,
  } = useSettingsStore()

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Appearance</h2>

      <div className={styles.card}>
        <div className={styles.row}>
          <div className={styles.rowLeft}>
            <span className={styles.rowLabel}>Accent Color</span>
            <span className={styles.rowSub}>Applied globally across the app</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {ACCENTS.map(a => (
              <button
                key={a.value}
                title={a.label}
                onClick={() => setAccent(a.value)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: a.color,
                  border: accent === a.value ? `3px solid white` : '3px solid transparent',
                  cursor: 'pointer',
                  outline: accent === a.value ? `2px solid ${a.color}` : 'none',
                  outlineOffset: 2,
                  transition: 'outline 0.15s',
                }}
              />
            ))}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.rowLeft}>
            <span className={styles.rowLabel}>Language</span>
          </div>
          <SegControl<Language>
            options={[
              { value: 'en', label: 'English' },
              { value: 'zh', label: '中文' },
            ]}
            value={language}
            onChange={setLanguage}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.rowLeft}>
            <span className={styles.rowLabel}>Density</span>
            <span className={styles.rowSub}>Controls spacing and text size</span>
          </div>
          <SegControl<Density>
            options={[
              { value: 'compact', label: 'Compact' },
              { value: 'default', label: 'Default' },
              { value: 'spacious', label: 'Spacious' },
            ]}
            value={density}
            onChange={setDensity}
          />
        </div>

        <div className={styles.row} style={{ borderBottom: 'none' }}>
          <div className={styles.rowLeft}>
            <span className={styles.rowLabel}>Reduce Motion</span>
            <span className={styles.rowSub}>Disable breathing animations and transitions</span>
          </div>
          <Toggle checked={reducedMotion} onChange={setReducedMotion} />
        </div>
      </div>
    </div>
  )
}
