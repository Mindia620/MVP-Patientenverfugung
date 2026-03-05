import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Suspense } from 'react'
import '@/i18n'
import { Layout } from '@/components/layout/Layout'
import { Landing } from '@/pages/Landing'
import { Wizard } from '@/pages/Wizard'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { useAuthInit } from '@/hooks/useAuth'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 5 * 60 * 1000 },
  },
})

function AppRoutes() {
  useAuthInit()

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/wizard" element={<Wizard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Layout>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full" /></div>}>
          <AppRoutes />
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
