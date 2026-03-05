import { useTranslation } from 'react-i18next';
import { Shield, Globe, LogOut, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../lib/api';

export function Header() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuthStore();

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'de' ? 'en' : 'de');
  };

  const handleLogout = async () => {
    try {
      await api.auth.logout();
    } catch {
      // ignore
    }
    logout();
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-primary-500 hover:text-primary-600 transition-colors">
          <Shield size={28} />
          <span className="text-lg font-bold">{t('app.name')}</span>
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary-500 transition-colors px-2 py-1 rounded"
            aria-label={t('nav.language')}
          >
            <Globe size={16} />
            <span className="uppercase">{i18n.language === 'de' ? 'EN' : 'DE'}</span>
          </button>
          {user && (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary-500 transition-colors px-2 py-1 rounded"
              >
                <LayoutDashboard size={16} />
                <span className="hidden sm:inline">{t('nav.dashboard')}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-500 transition-colors px-2 py-1 rounded"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">{t('nav.logout')}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
