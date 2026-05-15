import { useState } from 'react'
import { aiApi } from '../../lib/api/ai'
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

export function SettingsAI({ lang: langProp }: Props) {
  const { language } = useSettingsStore()
  const lang = langProp ?? language
  const [showKey, setShowKey] = useState(false)
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'ok' | 'fail'>('idle')

  const handleTest = async () => {
    setTestStatus('loading')
    try {
      await aiApi.testConnection('anthropic', '', 'claude-haiku-4-5')
      setTestStatus('ok')
    } catch {
      setTestStatus('fail')
    }
  }

  return (
    <div className="fade-in">
      <SectionHeader
        title={lang === 'zh' ? 'AI 配置' : 'AI Configuration'}
        sub={lang === 'zh'
          ? '连接你常用的大模型。API Key 仅保存在本地，绝不会上传。'
          : 'Connect a model you already use. API keys stay on this device — never uploaded.'}
      />

      <SettingsPanel>
        <SettingRow
          label={lang === 'zh' ? 'AI 状态' : 'AI Status'}
          helper={lang === 'zh' ? '上次连接 12 秒前 · 21ms 延迟' : 'Last check 12s ago · 21ms latency'}
        >
          <span className="chip chip-ai" style={{ height: 24 }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%',
              background: 'var(--accent-primary)',
              boxShadow: '0 0 6px var(--accent-primary)',
              animation: 'lumoBreath 3s ease-in-out infinite',
            }} />
            {lang === 'zh' ? '已连接' : 'Connected'}
          </span>
        </SettingRow>

        <SettingRow label={lang === 'zh' ? '提供商' : 'Provider'}>
          <select className="input" style={{ width: 260, height: 36 }} defaultValue="Claude">
            <option>OpenAI</option>
            <option>Claude</option>
            <option>Gemini</option>
            <option>DeepSeek</option>
            <option>Ollama</option>
            <option>Custom…</option>
          </select>
        </SettingRow>

        <SettingRow
          label="API Key"
          helper={lang === 'zh' ? '保存后将以掩码形式显示。' : 'Hidden after save — toggle to reveal momentarily.'}
        >
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              className="input"
              style={{ width: 320 }}
              type={showKey ? 'text' : 'password'}
              defaultValue="sk-ant-····················9f3a"
            />
            <button className="btn btn-secondary" onClick={() => setShowKey(v => !v)}>
              {lang === 'zh' ? (showKey ? '隐藏' : '显示') : (showKey ? 'Hide' : 'Show')}
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleTest}
              style={{ opacity: testStatus === 'loading' ? 0.6 : 1 }}
            >
              {testStatus === 'ok' ? '✓' : testStatus === 'fail' ? '✗' : (lang === 'zh' ? '测试' : 'Test')}
            </button>
          </div>
        </SettingRow>

        <SettingRow
          label={lang === 'zh' ? 'Base URL' : 'Base URL'}
          helper={lang === 'zh' ? '用于自定义或自托管的提供商' : 'Custom / self-hosted endpoint'}
        >
          <input
            className="input"
            style={{ width: 360 }}
            placeholder="https://api.anthropic.com/v1"
          />
        </SettingRow>

        <SettingRow label={lang === 'zh' ? '模型' : 'Model'}>
          <select className="input" style={{ width: 260, height: 36 }} defaultValue="claude-haiku-4-5">
            <option>claude-haiku-4-5</option>
            <option>claude-sonnet-4</option>
            <option>claude-opus-4</option>
          </select>
        </SettingRow>

        <SettingRow
          label={lang === 'zh' ? '本月用量' : 'Usage this month'}
          helper="Pro · 8,420 / 60,000 tokens"
        >
          <div style={{ width: 360 }}>
            <div style={{ height: 4, background: 'var(--bg-deep)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                width: '14%', height: '100%',
                background: 'linear-gradient(90deg, var(--accent-dim), var(--accent-primary))',
                boxShadow: '0 0 6px var(--accent-primary)',
              }} />
            </div>
          </div>
        </SettingRow>
      </SettingsPanel>
    </div>
  )
}
