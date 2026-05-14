import { useState } from 'react'
import { Input } from '../../components/common/Input'
import { Btn } from '../../components/common/Btn'
import { SegControl } from '../../components/common/SegControl'
import { aiApi } from '../../lib/api/ai'
import styles from './Settings.module.css'

const PROVIDERS = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'deepseek', label: 'DeepSeek' },
  { value: 'gemini', label: 'Gemini' },
]

const MODELS: Record<string, string[]> = {
  openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'],
  anthropic: ['claude-sonnet-4-6', 'claude-haiku-4-5-20251001'],
  deepseek: ['deepseek-chat', 'deepseek-reasoner'],
  gemini: ['gemini-2.0-flash', 'gemini-2.0-pro'],
}

type Provider = 'openai' | 'anthropic' | 'deepseek' | 'gemini'

export function SettingsAI() {
  const [provider, setProvider] = useState<Provider>('openai')
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState('gpt-4o')
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'ok' | 'fail'>('idle')

  const handleProviderChange = (p: string) => {
    const prov = p as Provider
    setProvider(prov)
    setModel(MODELS[prov][0])
  }

  const handleTest = async () => {
    setTestStatus('loading')
    try {
      await aiApi.testConnection(provider, apiKey, model)
      setTestStatus('ok')
    } catch {
      setTestStatus('fail')
    }
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>AI Configuration</h2>

      <div className={styles.card}>
        <div className={styles.row}>
          <div className={styles.rowLeft}>
            <span className={styles.rowLabel}>Provider</span>
            <span className={styles.rowSub}>Select your AI service provider</span>
          </div>
          <SegControl
            options={PROVIDERS}
            value={provider}
            onChange={handleProviderChange}
          />
        </div>

        <Input
          label="API Key"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          placeholder="sk-..."
          masked
        />

        <div className={styles.row}>
          <div className={styles.rowLeft}>
            <span className={styles.rowLabel}>Model</span>
          </div>
          <select
            className={modelSelectStyle}
            value={model}
            onChange={e => setModel(e.target.value)}
          >
            {MODELS[provider].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className={styles.row} style={{ borderBottom: 'none' }}>
          <div className={styles.rowLeft}>
            <span className={styles.rowLabel}>Connection</span>
            <span className={styles.rowSub}>
              {testStatus === 'ok' && '✓ Connection successful'}
              {testStatus === 'fail' && '✗ Connection failed'}
              {testStatus === 'idle' && 'Not tested'}
            </span>
          </div>
          <Btn
            size="sm"
            variant="secondary"
            loading={testStatus === 'loading'}
            onClick={handleTest}
          >
            Test Connection
          </Btn>
        </div>
      </div>
    </div>
  )
}

const modelSelectStyle = `
  background: var(--surface-1);
  border: 1px solid var(--border-1);
  border-radius: var(--radius-md);
  color: var(--text-0);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  padding: 6px 10px;
  outline: none;
  cursor: pointer;
`.replace(/\n\s*/g, ' ').trim()
