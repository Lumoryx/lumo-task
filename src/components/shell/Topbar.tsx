import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useSettingsStore } from '../../store/settings'

const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
)

const IconPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
)

const TITLES: Record<string, { title: string; titleZh: string; sub?: string }> = {
  '/today': { title: 'Today', titleZh: '今日' },
  '/matrix': { title: 'Matrix', titleZh: '四象限' },
  '/focus': { title: 'Focus', titleZh: '专注' },
  '/settings': { title: 'Settings', titleZh: '设置' },
}

interface Props {
  onQuickCreate?: () => void
}

export function Topbar({ onQuickCreate }: Props) {
  const location = useLocation()
  const { language } = useSettingsStore()
  const [search, setSearch] = useState('')

  // Match the most specific path prefix
  const pathKey = Object.keys(TITLES)
    .filter(k => location.pathname === k || location.pathname.startsWith(k + '/'))
    .sort((a, b) => b.length - a.length)[0] ?? '/today'

  const pageInfo = TITLES[pathKey]
  const title = language === 'zh' ? pageInfo.titleZh : pageInfo.title

  const today = new Date().toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="topbar">
      <div>
        <span className="page-title">{title}</span>
        <span className="page-sub">{today}</span>
      </div>
      <div className="spacer" />

      {/* Search */}
      <div className="topbar-search">
        <span className="topbar-search-icon">
          <IconSearch />
        </span>
        <input
          type="text"
          placeholder={language === 'zh' ? '搜索任务…' : 'Search tasks…'}
          className="topbar-search-input"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <span className="topbar-search-kbd">⌘K</span>
      </div>

      {/* Quick add */}
      <button
        className="icon-btn"
        title={language === 'zh' ? '新建任务' : 'New task'}
        onClick={onQuickCreate}
      >
        <IconPlus />
      </button>

      {/* Avatar */}
      <div className="avatar">AS</div>
    </div>
  )
}
