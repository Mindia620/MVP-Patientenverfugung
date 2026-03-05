import { Outlet, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useAuth } from '../contexts/AuthContext'

export function Layout() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 py-4 px-4 md:px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-lg font-semibold text-slate-800 hover:text-primary-600">
            {t('app.title')}
          </Link>
          <div className="flex items-center gap-4">
            {user && (
              <>
                <Link to="/dashboard" className="text-sm text-slate-600 hover:text-primary-600">
                  Dashboard
                </Link>
                <button
                  onClick={() => logout()}
                  className="text-sm text-slate-600 hover:text-primary-600"
                >
                  {t('auth.logout')}
                </button>
              </>
            )}
            <LanguageSwitcher />
          </div>
        </div>
      </header>
      <main className="flex-1 py-8 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <Outlet />
        </div>
      </main>
      <footer className="py-4 px-4 text-center text-sm text-slate-500 text-slate-400">
        {t('intro.disclaimer')}
      </footer>
    </div>
  )
}
