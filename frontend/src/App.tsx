import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { WizardPage } from './pages/WizardPage';
import { DashboardPage } from './pages/DashboardPage';
import { useAuthStore } from './store/authStore';
import { api } from './lib/api';
import './i18n';

function AuthLoader({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    api.auth.me()
      .then((res) => setUser(res.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthLoader>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<WizardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthLoader>
    </BrowserRouter>
  );
}
