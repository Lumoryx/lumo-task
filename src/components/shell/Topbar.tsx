import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import styles from './Topbar.module.css'

const TITLES: Record<string, string> = {
  '/today': 'Today',
  '/matrix': 'Matrix',
  '/focus': 'Focus',
  '/settings': 'Settings',
  '/settings/ai': 'Settings',
  '/settings/appearance': 'Settings',
  '/settings/sync': 'Settings',
  '/settings/privacy': 'Settings',
  '/settings/account': 'Settings',
}

interface Props {
  onQuickCreate?: () => void
}

export function Topbar({ onQuickCreate }: Props) {
  const location = useLocation()
  const title = TITLES[location.pathname] ?? 'Lumo'
  const [search, setSearch] = useState('')

  return (
    <header className={styles.topbar}>
      <h1 className={styles.title}>{title}</h1>

      <div className={styles.right}>
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className={styles.search}
            placeholder="Search tasks…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {onQuickCreate && (
          <button className={styles.quickCreate} onClick={onQuickCreate} title="New task">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        )}

        <button className={styles.avatar} title="Account">
          <span>D</span>
        </button>
      </div>
    </header>
  )
}
