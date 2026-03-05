import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShieldCheck, LogOut, LayoutDashboard } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/lib/api'
import { Button } from '@/components/ui/Button'

export function Header() {
  const { t, i18n } = useTranslation()
  const { user, setUser } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await authApi.logout().catch(() => null)
    setUser(null)
    navigate('/')
  }

  const toggleLang = () => {
    const next = i18n.language === 'de' ? 'en' : 'de'
    i18n.changeLanguage(next)
    localStorage.setItem('vorsorge-lang', next)
  }

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-slate-900 hover:text-sky-700 transition-colors"
        >
          <ShieldCheck className="text-sky-600" size={24} />
          <span className="font-semibold text-lg tracking-tight">
            {t('app.name')}
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <button
            onClick={toggleLang}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 px-2 py-1 rounded hover:bg-slate-100 transition-colors"
            aria-label="Toggle language"
          >
            {i18n.language === 'de' ? 'EN' : 'DE'}
          </button>

          {user ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                <LayoutDashboard size={15} />
                {t('nav.dashboard')}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut size={15} />
                {t('nav.logout')}
              </Button>
            </>
          ) : (
            <Button variant="secondary" size="sm" onClick={() => navigate('/login')}>
              {t('nav.login')}
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}
