import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LumoGlyph } from '../../components/ai/LumoGlyph'
import { Btn } from '../../components/common/Btn'
import { Input } from '../../components/common/Input'
import styles from './Auth.module.css'

export function LoginScreen() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <LumoGlyph size={40} />
          <h1 className={styles.title}>Sign in to Lumo</h1>
          <p className={styles.sub}>AI-powered deep work</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <Btn type="submit" fullWidth loading={loading}>
            Sign In
          </Btn>
        </form>

        <div className={styles.footer}>
          <span className={styles.footerText}>Don't have an account?</span>
          <Link to="/register" className={styles.link}>Sign Up</Link>
        </div>
        <div className={styles.divider}>or</div>
        <Btn variant="ghost" fullWidth onClick={() => navigate('/today')}>
          Continue as Guest
        </Btn>
      </div>
    </div>
  )
}
