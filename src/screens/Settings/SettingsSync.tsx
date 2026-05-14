import { Toggle } from '../../components/common/Toggle'
import { useState } from 'react'
import styles from './Settings.module.css'

export function SettingsSync() {
  const [cloudSync, setCloudSync] = useState(false)
  const [autoBackup, setAutoBackup] = useState(false)

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Sync & Backup</h2>
      <div className={styles.card}>
        <div className={styles.row}>
          <div className={styles.rowLeft}>
            <span className={styles.rowLabel}>Cloud Sync</span>
            <span className={styles.rowSub}>Sync tasks across devices (requires account)</span>
          </div>
          <Toggle checked={cloudSync} onChange={setCloudSync} />
        </div>
        <div className={styles.row} style={{ borderBottom: 'none' }}>
          <div className={styles.rowLeft}>
            <span className={styles.rowLabel}>Auto Backup</span>
            <span className={styles.rowSub}>Daily local backup to Downloads folder</span>
          </div>
          <Toggle checked={autoBackup} onChange={setAutoBackup} />
        </div>
      </div>
    </div>
  )
}
