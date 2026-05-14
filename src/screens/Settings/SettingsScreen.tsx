import { NavLink, Outlet, Navigate } from 'react-router-dom'
import styles from './Settings.module.css'

const SECTIONS = [
  { to: '/settings/ai', label: 'AI', icon: '✦' },
  { to: '/settings/appearance', label: 'Appearance', icon: '🎨' },
  { to: '/settings/sync', label: 'Sync', icon: '☁' },
  { to: '/settings/privacy', label: 'Privacy', icon: '🔒' },
  { to: '/settings/account', label: 'Account', icon: '👤' },
]

export function SettingsScreen() {
  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        {SECTIONS.map(s => (
          <NavLink
            key={s.to}
            to={s.to}
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>{s.icon}</span>
            <span>{s.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  )
}

export function SettingsIndex() {
  return <Navigate to="/settings/ai" replace />
}
