import { useNavigate } from 'react-router-dom'
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

export function SettingsAccount({ lang: langProp }: Props) {
  const navigate = useNavigate()
  const { language } = useSettingsStore()
  const lang = langProp ?? language

  const handleSignOut = () => {
    localStorage.removeItem('lumo_token')
    navigate('/login')
  }

  return (
    <div className="fade-in">
      <SectionHeader
        title={lang === 'zh' ? '账户' : 'Account'}
        sub={lang === 'zh' ? '身份、数据、安全。' : 'Identity, data, security.'}
      />

      <SettingsPanel>
        <SettingRow label={lang === 'zh' ? '身份' : 'Identity'} align="top">
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            {/* 56x56 avatar */}
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-dim), var(--accent-primary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 600, color: 'var(--text-inverse)',
              boxShadow: '0 0 0 1px var(--border-default)',
              flexShrink: 0,
            }}>AS</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                Alex Stein
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.35 }}>
                alex@studio.io
              </div>
            </div>
            <button className="btn btn-ghost">{lang === 'zh' ? '编辑' : 'Edit'}</button>
          </div>
        </SettingRow>

        <SettingRow
          label={lang === 'zh' ? '本地数据' : 'Local data'}
          helper={lang === 'zh' ? '上次保存 14:32' : 'Last saved 14:32'}
          align="top"
        >
          <div className="stat-group" style={{ maxWidth: 480 }}>
            <div className="stat">
              <div className="stat-label">{lang === 'zh' ? '任务' : 'Tasks'}</div>
              <div className="stat-value">24</div>
            </div>
            <div className="stat">
              <div className="stat-label">{lang === 'zh' ? '记忆' : 'Memories'}</div>
              <div className="stat-value">17</div>
            </div>
            <div className="stat">
              <div className="stat-label">{lang === 'zh' ? '番茄' : 'Pomodoros'}</div>
              <div className="stat-value">312</div>
            </div>
          </div>
        </SettingRow>

        <SettingRow label={lang === 'zh' ? '安全' : 'Security'}>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary">
              {lang === 'zh' ? '修改密码' : 'Change password'}
            </button>
            <button className="btn btn-ghost" onClick={handleSignOut}>
              {lang === 'zh' ? '退出登录' : 'Sign out'}
            </button>
          </div>
        </SettingRow>
      </SettingsPanel>
    </div>
  )
}
