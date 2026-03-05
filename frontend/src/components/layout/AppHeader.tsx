import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../store/authStore'
import { ShieldIcon } from '../ui/Icons'

export function AppHeader() {
  const { t, i18n } = useTranslation()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'de' ? 'en' : 'de')
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-xl text-primary-800 hover:text-primary-900 transition-colors"
        >
          <ShieldIcon className="w-7 h-7 text-primary-600" />
          <span>Vorsorge Wizard</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={toggleLanguage}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
            aria-label="Switch language"
          >
            {i18n.language === 'de' ? 'EN' : 'DE'}
          </button>

          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm font-medium text-gray-700 hover:text-primary-700 hidden sm:block transition-colors"
              >
                {t('nav.dashboard')}
              </Link>
              <button
                onClick={handleLogout}
                className="btn-ghost text-sm"
              >
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <Link to="/auth/login" className="text-sm font-medium text-gray-700 hover:text-primary-700 transition-colors">
                {t('nav.login')}
              </Link>
              <Link to="/auth/register" className="btn-primary text-sm px-4 py-2">
                {t('nav.register')}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
