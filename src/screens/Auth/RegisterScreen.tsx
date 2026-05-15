import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LumoGlyph } from '../../components/ai/LumoGlyph'
import { AuthHero } from './AuthHero'

export function RegisterScreen() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [nick, setNick] = useState('')
  const [agreed, setAgreed] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: nick }),
      })
      const data = await res.json()
      localStorage.setItem('lumo_token', data.data.token)
      navigate('/onboarding')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ flex: 1, display: 'flex', background: 'var(--bg-base)', position: 'relative', overflow: 'hidden' }}>
      {/* Back button */}
      <button
        onClick={() => navigate('/login')}
        style={{
          position: 'absolute', top: 18, left: 18, zIndex: 5,
          display: 'inline-flex', alignItems: 'center', gap: 6,
          height: 32, padding: '0 12px 0 8px', borderRadius: 8,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          color: 'var(--text-secondary)',
          fontSize: 12, fontFamily: 'inherit', cursor: 'default',
          transition: 'all 120ms var(--ease-default)',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-primary)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-surface)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
        Back
      </button>

      {/* Left hero */}
      <AuthHero />

      {/* Right form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 40px', minWidth: 0 }}>
        <div style={{ width: 340, maxWidth: '100%' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 22 }}>
            <LumoGlyph size={20} />
            <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>
              Lumo <span style={{ color: 'var(--text-faint)', fontWeight: 400, marginLeft: 2 }}>Task</span>
            </span>
          </div>

          <div className="fade-in">
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--text-primary)', textAlign: 'center' }}>
              Create your account
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.55, textAlign: 'center' }}>
              Start your focused journey with Lumo Task
            </div>

            <form onSubmit={handleSubmit} style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label className="field-label">Email</label>
                <input className="input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="field-label">Password</label>
                <input className="input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <div>
                <label className="field-label">Confirm password</label>
                <input className="input" type="password" placeholder="••••••••" value={confirm} onChange={e => setConfirm(e.target.value)} />
              </div>
              <div>
                <label className="field-label">
                  Nickname <span style={{ color: 'var(--text-faint)' }}>· optional</span>
                </label>
                <input className="input" type="text" placeholder="What should we call you?" value={nick} onChange={e => setNick(e.target.value)} />
              </div>
              {/* Terms */}
              <label style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                fontSize: 12, color: 'var(--text-secondary)',
                lineHeight: 1.5, marginTop: 4, cursor: 'default',
              }}>
                <span style={{
                  width: 14, height: 14, borderRadius: 3,
                  border: '1.5px solid var(--border-strong)',
                  flexShrink: 0, marginTop: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--bg-elevated)',
                }}
                  onClick={() => setAgreed(v => !v)}
                >
                  {agreed && <span style={{ width: 8, height: 8, borderRadius: 1, background: 'var(--accent-primary)' }} />}
                </span>
                <span>I agree to the Terms of Service and Privacy Policy</span>
              </label>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center', marginTop: 4, opacity: loading ? 0.7 : 1 }}
                disabled={loading || !agreed}
              >
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>

            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 14, fontSize: 12, color: 'var(--text-secondary)' }}>
              <a style={{ color: 'var(--text-secondary)', textDecoration: 'none', cursor: 'default' }} onClick={() => navigate('/login')}>
                Already have an account? Sign in
              </a>
              <span style={{ color: 'var(--text-faint)' }}>·</span>
              <a style={{ color: 'var(--text-secondary)', textDecoration: 'none', cursor: 'default' }} onClick={() => navigate('/today')}>
                Use without account
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
