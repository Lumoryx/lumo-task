import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LumoGlyph } from '../../components/ai/LumoGlyph'
import { Btn } from '../../components/common/Btn'
import { Input } from '../../components/common/Input'
import styles from './Auth.module.css'

export function RegisterScreen() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      localStorage.setItem('lumo_token', data.data.token)
      navigate('/onboarding')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <LumoGlyph size={40} />
          <h1 className={styles.title}>Create your account</h1>
          <p className={styles.sub}>Start your focused journey</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            label="Your Name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Jane Smith"
            required
          />
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
            Create Account
          </Btn>
        </form>

        <div className={styles.footer}>
          <span className={styles.footerText}>Already have an account?</span>
          <Link to="/login" className={styles.link}>Sign In</Link>
        </div>
      </div>
    </div>
  )
}
