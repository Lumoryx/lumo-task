import { useSettingsStore } from '../../store/settings'

interface Props {
  lang?: string
}

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div style={{ paddingBottom: 4 }}>
      <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{title}</div>
      {sub && <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.55, maxWidth: 560 }}>{sub}</div>}
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

export function SettingsPrivacy({ lang: langProp }: Props) {
  const { language } = useSettingsStore()
  const lang = langProp ?? language
  return (
    <div className="fade-in">
      <SectionHeader
        title={lang === 'zh' ? '隐私与本地数据' : 'Privacy & Local Data'}
        sub={lang === 'zh'
          ? 'Lumo 默认把一切保留在本地。下面是你的数据具体在哪里、能做什么。'
          : "Lumo keeps everything local by default. Here's where your data lives and what you can do with it."}
      />

      <SettingsPanel>
        <SettingRow
          label={lang === 'zh' ? '本地数据库' : 'Local database'}
          helper={lang === 'zh' ? 'SQLite · 占用 8.4 MB' : 'SQLite · 8.4 MB'}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 12px',
            background: 'var(--bg-deep)',
            border: '1px solid var(--border-default)',
            borderRadius: 6,
            fontFamily: 'var(--font-mono)',
            fontSize: 12, color: 'var(--text-secondary)',
            maxWidth: 540,
          }}>
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              ~/Library/Application Support/Lumo/lumo.sqlite
            </span>
            <button className="btn btn-ghost" style={{ height: 26, padding: '0 8px', fontSize: 11 }}>
              {lang === 'zh' ? '复制' : 'Copy'}
            </button>
          </div>
        </SettingRow>

        <SettingRow
          label={lang === 'zh' ? '导出本地数据' : 'Export local data'}
          helper={lang === 'zh' ? 'JSON 或可读 Markdown 格式' : 'JSON or readable Markdown'}
        >
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary">JSON</button>
            <button className="btn btn-secondary">Markdown</button>
          </div>
        </SettingRow>

        <SettingRow
          label={lang === 'zh' ? '本地备份' : 'Local backup'}
          helper={lang === 'zh' ? '上次备份 · 今日 02:00' : 'Last backup · today 02:00'}
        >
          <button className="btn btn-secondary">{lang === 'zh' ? '立即备份' : 'Back up now'}</button>
        </SettingRow>

        <SettingRow
          label="AI Key"
          helper={lang === 'zh'
            ? 'API Key 仅以本机加密后保存。云同步不会传输此项。'
            : 'API keys are encrypted on this device only. Cloud sync never carries them.'}
        >
          <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 14, height: 14, display: 'inline-flex' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            {lang === 'zh' ? '本机加密保存' : 'Encrypted on this device'}
          </span>
        </SettingRow>
      </SettingsPanel>
    </div>
  )
}
