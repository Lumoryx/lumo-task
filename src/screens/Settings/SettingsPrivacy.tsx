import { Toggle } from '../../components/common/Toggle'
import { useState } from 'react'
import styles from './Settings.module.css'

export function SettingsPrivacy() {
  const [analytics, setAnalytics] = useState(false)
  const [crashReports, setCrashReports] = useState(true)

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Privacy</h2>
      <div className={styles.card}>
        <div className={styles.row}>
          <div className={styles.rowLeft}>
            <span className={styles.rowLabel}>Usage Analytics</span>
            <span className={styles.rowSub}>Help improve Lumo by sharing anonymous usage data</span>
          </div>
          <Toggle checked={analytics} onChange={setAnalytics} />
        </div>
        <div className={styles.row} style={{ borderBottom: 'none' }}>
          <div className={styles.rowLeft}>
            <span className={styles.rowLabel}>Crash Reports</span>
            <span className={styles.rowSub}>Automatically send crash reports to the team</span>
          </div>
          <Toggle checked={crashReports} onChange={setCrashReports} />
        </div>
      </div>
    </div>
  )
}
