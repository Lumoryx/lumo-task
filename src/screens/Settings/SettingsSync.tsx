import { useState } from 'react'
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

export function SettingsSync({ lang: langProp }: Props) {
  const { language } = useSettingsStore()
  const lang = langProp ?? language
  const [sync, setSync] = useState(true)
  const [taskSync, setTaskSync] = useState(true)
  const [memSync, setMemSync] = useState(true)
  const [convSync, setConvSync] = useState(false)

  return (
    <div className="fade-in">
      <SectionHeader
        title={lang === 'zh' ? '同步' : 'Sync'}
        sub={lang === 'zh'
          ? '默认情况下，你的数据保存在这台设备上。开启同步后，数据才会到达云端。'
          : 'Your data is saved on this device by default. Data only reaches the cloud after you enable sync.'}
      />

      <SettingsPanel>
        <SettingRow
          label={lang === 'zh' ? '云同步' : 'Cloud sync'}
          helper={lang === 'zh' ? '总开关。关闭后所有子项停止同步。' : 'Master toggle — turning off pauses all sub-syncs.'}
        >
          <Toggle on={sync} onChange={setSync} />
        </SettingRow>
        <div style={{ opacity: sync ? 1 : 0.4, pointerEvents: sync ? 'auto' : 'none', transition: 'opacity 200ms var(--ease-default)' }}>
          <SettingRow label={lang === 'zh' ? '任务同步' : 'Tasks'}>
            <Toggle on={taskSync} onChange={setTaskSync} />
          </SettingRow>
          <SettingRow
            label={lang === 'zh' ? '记忆同步' : 'Memory'}
            helper={lang === 'zh' ? 'Pro · AI 自动提取的偏好与事实' : 'Pro · AI-extracted preferences & facts'}
          >
            <Toggle on={memSync} onChange={setMemSync} />
          </SettingRow>
          <SettingRow
            label={lang === 'zh' ? '对话同步' : 'Conversations'}
            helper={lang === 'zh' ? 'Pro · 跨设备保留 AI 对话上下文' : 'Pro · keep AI chat context across devices'}
          >
            <Toggle on={convSync} onChange={setConvSync} />
          </SettingRow>
        </div>
      </SettingsPanel>

      <div className="settings-group-h">{lang === 'zh' ? '状态' : 'Status'}</div>
      <SettingsPanel>
        <SettingRow label={lang === 'zh' ? '同步状态' : 'Status'}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '8px 12px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 8,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--status-success)', boxShadow: '0 0 8px var(--status-success)' }} />
            <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{lang === 'zh' ? '刚刚已同步' : 'Synced just now'}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>· 14:32 · 24 {lang === 'zh' ? '项已更新' : 'items'}</span>
            <span style={{ marginLeft: 12 }}>
              <button className="btn btn-ghost" style={{ height: 28, padding: '0 10px' }}>
                {lang === 'zh' ? '手动同步' : 'Sync now'}
              </button>
            </span>
          </div>
        </SettingRow>
      </SettingsPanel>
    </div>
  )
}
