import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Layout } from './components/Layout'
import { IntroPage } from './pages/IntroPage'
import { WizardPage } from './pages/WizardPage'
import { GeneratePage } from './pages/GeneratePage'
import { DashboardPage } from './pages/DashboardPage'
import { AuthPage } from './pages/AuthPage'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IntroPage />} />
          <Route path="wizard" element={<WizardPage />} />
          <Route path="wizard/auth" element={<AuthPage />} />
          <Route path="wizard/generate" element={<GeneratePage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
