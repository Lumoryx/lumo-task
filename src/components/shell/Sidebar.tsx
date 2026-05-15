import { useLocation, useNavigate } from 'react-router-dom'
import { LumoGlyph } from '../ai/LumoGlyph'
import { useTasksStore } from '../../store/tasks'
import { useSettingsStore } from '../../store/settings'

const IconToday = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
)

const IconMatrix = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="8" height="8" rx="1" />
    <rect x="13" y="3" width="8" height="8" rx="1" />
    <rect x="3" y="13" width="8" height="8" rx="1" />
    <rect x="13" y="13" width="8" height="8" rx="1" />
  </svg>
)

const IconSettings = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </svg>
)

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { tasks } = useTasksStore()
  const { language } = useSettingsStore()

  const taskCount = tasks.length

  const items = [
    { key: 'today', path: '/today', label: language === 'zh' ? '今日' : 'Today', icon: <IconToday />, badge: 5 },
    { key: 'matrix', path: '/matrix', label: language === 'zh' ? '四象限' : 'Matrix', icon: <IconMatrix />, badge: taskCount || undefined },
    { key: 'settings', path: '/settings', label: language === 'zh' ? '设置' : 'Settings', icon: <IconSettings /> },
  ]

  const isActive = (path: string) => {
    if (path === '/settings') return location.pathname.startsWith('/settings')
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <span className="glyph">
          <LumoGlyph size={22} />
        </span>
        <span>
          Lumo{' '}
          <span style={{ color: 'var(--text-faint)', fontWeight: 400, marginLeft: 4 }}>
            Task
          </span>
        </span>
      </div>

      <div className="sidebar-section">
        {language === 'zh' ? '工作区' : 'Workspace'}
      </div>

      {items.map((item) => (
        <div
          key={item.key}
          className={'nav-item' + (isActive(item.path) ? ' active' : '')}
          onClick={() => navigate(item.path)}
        >
          {item.icon}
          <span>{item.label}</span>
          {item.badge != null && (
            <span className="badge">{item.badge}</span>
          )}
        </div>
      ))}

      <div className="sidebar-foot">
        <div className="local-status">
          <span className="dot" />
          <span>{language === 'zh' ? '本地 · 离线' : 'Local · Offline'}</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>
          {language === 'zh' ? '本地模式' : 'Local mode'}
        </div>
      </div>
    </div>
  )
}
