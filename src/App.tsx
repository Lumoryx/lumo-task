import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Sidebar } from './components/shell/Sidebar'
import { Topbar } from './components/shell/Topbar'
import { LoginScreen } from './screens/Auth/LoginScreen'
import { RegisterScreen } from './screens/Auth/RegisterScreen'
import { OnboardingScreen } from './screens/Auth/OnboardingScreen'
import { TodayScreen } from './screens/Today/TodayScreen'
import { MatrixScreen } from './screens/Matrix/MatrixScreen'
import { FocusScreen } from './screens/Focus/FocusScreen'
import { SettingsScreen, SettingsIndex } from './screens/Settings/SettingsScreen'
import { SettingsAI } from './screens/Settings/SettingsAI'
import { SettingsAppearance } from './screens/Settings/SettingsAppearance'
import { SettingsSync } from './screens/Settings/SettingsSync'
import { SettingsPrivacy } from './screens/Settings/SettingsPrivacy'
import { SettingsAccount } from './screens/Settings/SettingsAccount'
import { QuickCreate } from './modals/QuickCreate'
import { applyStoredSettings } from './store/settings'

export function App() {
  const [quickCreateOpen, setQuickCreateOpen] = useState(false)

  useEffect(() => {
    applyStoredSettings()
  }, [])

  return (
    <Routes>
      {/* Auth routes — full screen */}
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/onboarding" element={<OnboardingScreen />} />

      {/* App shell */}
      <Route
        path="/*"
        element={
          <div className="stage">
            <div className="page-bg" />
            <div className="win">
              {/* macOS-style titlebar */}
              <div className="win-titlebar">
                <div className="traffic">
                  <i />
                  <i />
                  <i />
                </div>
                <div className="title">Lumo Task</div>
              </div>
              {/* Animated top accent bar */}
              <div className="lumo-pulse" />
              {/* App body: sidebar + main */}
              <div className="win-body">
                <Sidebar />
                <div className="main">
                  <Topbar onQuickCreate={() => setQuickCreateOpen(true)} />
                  <div className="content">
                    <Routes>
                      <Route path="/" element={<Navigate to="/today" replace />} />
                      <Route path="/today" element={<TodayScreen />} />
                      <Route path="/matrix" element={<MatrixScreen />} />
                      <Route path="/focus" element={<FocusScreen />} />
                      <Route path="/settings" element={<SettingsScreen />}>
                        <Route index element={<SettingsIndex />} />
                        <Route path="ai" element={<SettingsAI />} />
                        <Route path="appearance" element={<SettingsAppearance />} />
                        <Route path="sync" element={<SettingsSync />} />
                        <Route path="privacy" element={<SettingsPrivacy />} />
                        <Route path="account" element={<SettingsAccount />} />
                      </Route>
                    </Routes>
                  </div>
                </div>
              </div>
            </div>
            {quickCreateOpen && (
              <QuickCreate onClose={() => setQuickCreateOpen(false)} />
            )}
          </div>
        }
      />
    </Routes>
  )
}
