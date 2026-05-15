import { useSettingsStore } from '../../store/settings'

interface Props {
  lang?: string
}

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div style={{ paddingBottom: 4 }}>
      <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
        {title}
      </div>
      {sub && (
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.55, maxWidth: 560 }}>
          {sub}
        </div>
      )}
    </div>
  )
}

function SettingsPanel({ children }: { children: React.ReactNode }) {
  return <div className="settings-panel">{children}</div>
}

function SettingRow({ label, helper, children, align }: {
  label: string; helper?: string; children?: React.ReactNode; align?: 'top'
}) {
  return (
    <div className={'settings-row' + (align === 'top' ? ' row-top' : '')}>
      <div>
        <div className="settings-label">{label}</div>
        {helper && <div className="settings-helper">{helper}</div>}
      </div>
      <div style={{ minWidth: 0 }}>{children}</div>
    </div>
  )
}

function SegControl({ value, onChange, options }: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="seg">
      {options.map(o => (
        <button
          key={o.value}
          className={value === o.value ? 'on' : ''}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: 36, height: 20, borderRadius: 10,
        background: on ? 'var(--accent-primary)' : 'var(--border-strong)',
        border: 'none', position: 'relative', cursor: 'default',
        transition: 'background 120ms var(--ease-default)',
        flexShrink: 0, padding: 0,
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

const ACCENTS = [
  { key: 'green', label: 'Lumo Green', color: '#3DFFA0' },
  { key: 'cyan', label: 'Calm Cyan', color: '#38D4D4' },
  { key: 'amber', label: 'Warm Amber', color: '#FFAA44' },
  { key: 'graphite', label: 'Graphite', color: '#A0ADB0' },
] as const

export function SettingsAppearance({ lang: langProp }: Props) {
  const { accent, setAccent, density, setDensity, reducedMotion, setReducedMotion, language, setLanguage } = useSettingsStore()
  const lang = langProp ?? language

  return (
    <div className="fade-in">
      <SectionHeader
        title={lang === 'zh' ? '外观' : 'Appearance'}
        sub={lang === 'zh'
          ? '整理界面的节奏与质感。改动会立刻应用到整体界面。'
          : 'Tune the rhythm and texture of the interface — changes apply globally as you make them.'}
      />

      <div className="settings-group-h">{lang === 'zh' ? '色调' : 'Color'}</div>
      <SettingsPanel>
        <SettingRow
          label={lang === 'zh' ? '主题' : 'Theme'}
          helper={lang === 'zh' ? '本期仅支持暗色 · 浅色与跟随系统即将推出' : 'Dark only this release · Light & System coming soon'}
        >
          <SegControl
            value="dark"
            onChange={() => {}}
            options={[
              { value: 'dark', label: lang === 'zh' ? '暗色' : 'Dark' },
              { value: 'light', label: lang === 'zh' ? '浅色' : 'Light' },
              { value: 'system', label: lang === 'zh' ? '系统' : 'System' },
            ]}
          />
        </SettingRow>

        <SettingRow
          label={lang === 'zh' ? '强调色' : 'Accent color'}
          helper={lang === 'zh'
            ? '立刻应用 — 影响高亮、按钮、状态指示器、Lumo 呼吸光等。'
            : "Applies instantly — highlights, buttons, status indicators, Lumo's breathing glow."}
          align="top"
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, maxWidth: 460 }}>
            {ACCENTS.map(a => {
              const active = a.key === accent
              return (
                <button
                  key={a.key}
                  onClick={() => setAccent(a.key as 'green' | 'violet' | 'coral' | 'gold')}
                  style={{
                    padding: 12, textAlign: 'left',
                    background: active ? 'var(--bg-elevated)' : 'var(--bg-deep)',
                    border: '1px solid ' + (active ? 'var(--accent-edge)' : 'var(--border-default)'),
                    borderRadius: 8, cursor: 'default',
                    fontFamily: 'inherit',
                    boxShadow: active ? '0 0 0 3px var(--accent-fog)' : 'none',
                    transition: 'all 140ms var(--ease-default)',
                  }}
                >
                  <div style={{
                    width: '100%', height: 28, borderRadius: 4,
                    background: `linear-gradient(135deg, ${a.color} 0%, ${a.color}44 100%)`,
                    boxShadow: active ? `0 0 12px ${a.color}66` : 'none',
                    marginBottom: 8,
                    position: 'relative',
                  }}>
                    {active && (
                      <span style={{
                        position: 'absolute', top: 6, right: 6,
                        width: 16, height: 16, borderRadius: '50%',
                        background: 'rgba(0,0,0,0.45)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff',
                      }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 12l5 5 11-11" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <div style={{
                    fontSize: 11,
                    color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: active ? 500 : 400,
                  }}>{a.label}</div>
                </button>
              )
            })}
          </div>
        </SettingRow>
      </SettingsPanel>

      <div className="settings-group-h">{lang === 'zh' ? '节奏' : 'Rhythm'}</div>
      <SettingsPanel>
        <SettingRow
          label={lang === 'zh' ? '动效' : 'Motion'}
          helper={lang === 'zh' ? '降低后关闭呼吸光与卡片飘入。' : 'Reduced turns off breathing glows and card-float entries.'}
        >
          <SegControl
            value={reducedMotion ? 'reduced' : 'standard'}
            onChange={v => setReducedMotion(v === 'reduced')}
            options={[
              { value: 'standard', label: lang === 'zh' ? '标准' : 'Standard' },
              { value: 'reduced', label: lang === 'zh' ? '降低' : 'Reduced' },
            ]}
          />
        </SettingRow>

        <SettingRow
          label={lang === 'zh' ? '卡片密度' : 'Card density'}
          helper={lang === 'zh' ? '影响列表行高与导航高度。' : 'Affects row height and navigation density.'}
        >
          <SegControl
            value={density}
            onChange={v => setDensity(v as 'compact' | 'default' | 'spacious')}
            options={[
              { value: 'default', label: lang === 'zh' ? '宽松' : 'Comfortable' },
              { value: 'compact', label: lang === 'zh' ? '紧凑' : 'Compact' },
            ]}
          />
        </SettingRow>

        <SettingRow
          label={lang === 'zh' ? '语言' : 'Language'}
        >
          <SegControl
            value={language}
            onChange={v => setLanguage(v as 'en' | 'zh')}
            options={[
              { value: 'en', label: 'English' },
              { value: 'zh', label: '中文' },
            ]}
          />
        </SettingRow>

        <SettingRow
          label={lang === 'zh' ? '减少动效' : 'Reduce Motion'}
          helper={lang === 'zh' ? '关闭所有动效和过渡' : 'Disable all animations and transitions'}
        >
          <Toggle on={reducedMotion} onChange={setReducedMotion} />
        </SettingRow>
      </SettingsPanel>
    </div>
  )
}
