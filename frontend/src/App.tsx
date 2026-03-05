import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './lib/i18n'
import { useAuthStore } from './store/authStore'

// Pages
import { Home } from './pages/Home'
import { Step1Personal } from './pages/wizard/Step1Personal'
import { Step2TrustedPerson } from './pages/wizard/Step2TrustedPerson'
import { Step3Medical } from './pages/wizard/Step3Medical'
import { Step4Scenarios } from './pages/wizard/Step4Scenarios'
import { Step5Values } from './pages/wizard/Step5Values'
import { Step6Summary } from './pages/wizard/Step6Summary'
import { Step7Account } from './pages/wizard/Step7Account'
import { Step8Documents } from './pages/wizard/Step8Documents'
import { Login } from './pages/auth/Login'
import { Register } from './pages/auth/Register'
import { Dashboard } from './pages/dashboard/Dashboard'
import { Privacy } from './pages/legal/Privacy'
import { Imprint } from './pages/legal/Imprint'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
})

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, initialized } = useAuthStore()

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  return <>{children}</>
}

function AppInitializer({ children }: { children: React.ReactNode }) {
  const { initialize, initialized } = useAuthStore()

  useEffect(() => {
    if (!initialized) {
      initialize()
    }
  }, [initialize, initialized])

  return <>{children}</>
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppInitializer>
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Wizard — anonymous access allowed */}
            <Route path="/wizard/step/1" element={<Step1Personal />} />
            <Route path="/wizard/step/2" element={<Step2TrustedPerson />} />
            <Route path="/wizard/step/3" element={<Step3Medical />} />
            <Route path="/wizard/step/4" element={<Step4Scenarios />} />
            <Route path="/wizard/step/5" element={<Step5Values />} />
            <Route path="/wizard/step/6" element={<Step6Summary />} />
            <Route path="/wizard/step/7" element={<Step7Account />} />
            <Route path="/wizard/step/8" element={<Step8Documents />} />

            {/* Auth */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />

            {/* Protected */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            {/* Legal */}
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/imprint" element={<Imprint />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppInitializer>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
