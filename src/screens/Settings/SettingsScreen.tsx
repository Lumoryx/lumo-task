import { useState } from 'react'
import { useSettingsStore } from '../../store/settings'
import { SettingsAI } from './SettingsAI'
import { SettingsAppearance } from './SettingsAppearance'
import { SettingsSync } from './SettingsSync'
import { SettingsPrivacy } from './SettingsPrivacy'
import { SettingsAccount } from './SettingsAccount'

type Section = 'account' | 'ai' | 'appearance' | 'sync' | 'privacy'

export function SettingsScreen() {
  const { language } = useSettingsStore()
  const lang = language
  const [section, setSection] = useState<Section>('ai')

  const sections: { key: Section; label: string }[] = [
    { key: 'account', label: lang === 'zh' ? '账户' : 'Account' },
    { key: 'ai', label: 'AI' },
    { key: 'appearance', label: lang === 'zh' ? '外观' : 'Appearance' },
    { key: 'sync', label: lang === 'zh' ? '同步' : 'Sync' },
    { key: 'privacy', label: lang === 'zh' ? '隐私与数据' : 'Privacy' },
  ]

  return (
    <div className="fade-in" style={{ display: 'flex', height: '100%' }}>
      {/* Left nav */}
      <div style={{
        width: 220, flexShrink: 0, padding: '24px 12px',
        borderRight: '1px solid var(--border-faint)',
        background: 'var(--bg-deep)',
      }}>
        {sections.map(s => (
          <div
            key={s.key}
            className={'nav-item ' + (section === s.key ? 'active' : '')}
            style={{ margin: '2px 0' }}
            onClick={() => setSection(s.key)}
          >
            <span style={{
              width: 5, height: 5, borderRadius: '50%',
              background: section === s.key ? 'var(--accent-primary)' : 'var(--border-strong)',
              flexShrink: 0,
            }} />
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Content */}
      <div
        key={section}
        style={{ flex: 1, padding: '28px 40px', overflowY: 'auto', minWidth: 0 }}
      >
        {section === 'ai' && <SettingsAI lang={lang} />}
        {section === 'appearance' && <SettingsAppearance lang={lang} />}
        {section === 'sync' && <SettingsSync lang={lang} />}
        {section === 'privacy' && <SettingsPrivacy lang={lang} />}
        {section === 'account' && <SettingsAccount lang={lang} />}
      </div>
    </div>
  )
}

// Keep for router compatibility
export function SettingsIndex() {
  return null
}
