import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LumoGlyph } from '../../components/ai/LumoGlyph'
import { AuthHero } from './AuthHero'

export function LoginScreen() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('alex@studio.io')
  const [password, setPassword] = useState('••••••••')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      localStorage.setItem('lumo_token', data.data.token)
      navigate('/today')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ flex: 1, display: 'flex', background: 'var(--bg-base)', position: 'relative', overflow: 'hidden' }}>
      {/* Back button */}
      <button
        onClick={() => navigate('/today')}
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
              Welcome back
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.55, textAlign: 'center' }}>
              Sign in to continue your focused work
            </div>

            <form onSubmit={handleSubmit} style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label className="field-label">Email</label>
                <input
                  className="input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="field-label">Password</label>
                <input
                  className="input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center', marginTop: 4, opacity: loading ? 0.7 : 1 }}
                disabled={loading}
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0 12px' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border-faint)' }} />
              <span style={{ fontSize: 11, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border-faint)' }} />
            </div>

            {/* OAuth */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { provider: 'Google', label: 'Continue with Google' },
                { provider: 'Apple', label: 'Continue with Apple' },
                { provider: 'GitHub', label: 'Continue with GitHub' },
              ].map(({ provider, label }) => (
                <button key={provider} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                  {label}
                </button>
              ))}
            </div>

            <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center', gap: 14, fontSize: 12, color: 'var(--text-secondary)' }}>
              <a style={{ color: 'var(--text-secondary)', textDecoration: 'none', cursor: 'default' }}>Forgot password?</a>
              <span style={{ color: 'var(--text-faint)' }}>·</span>
              <a
                style={{ color: 'var(--text-secondary)', textDecoration: 'none', cursor: 'default' }}
                onClick={() => navigate('/register')}
              >Create account</a>
            </div>

            <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--border-faint)', textAlign: 'center' }}>
              <button className="btn btn-ghost" onClick={() => navigate('/today')} style={{ width: '100%', justifyContent: 'center' }}>
                Continue without account
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
