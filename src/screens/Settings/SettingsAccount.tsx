import { useNavigate } from 'react-router-dom'
import { Btn } from '../../components/common/Btn'
import styles from './Settings.module.css'

export function SettingsAccount() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('lumo_token')
    navigate('/login')
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Account</h2>
      <div className={styles.card}>
        <div className={styles.row}>
          <div className={styles.rowLeft}>
            <span className={styles.rowLabel}>Demo User</span>
            <span className={styles.rowSub}>demo@lumo.app</span>
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'var(--accent-dim)',
              border: '1px solid var(--accent-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent)',
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            D
          </div>
        </div>
        <div className={styles.row} style={{ borderBottom: 'none' }}>
          <div className={styles.rowLeft}>
            <span className={styles.rowLabel}>Sign out</span>
            <span className={styles.rowSub}>You'll need to sign in again</span>
          </div>
          <Btn variant="danger" size="sm" onClick={handleLogout}>Sign Out</Btn>
        </div>
      </div>
    </div>
  )
}
