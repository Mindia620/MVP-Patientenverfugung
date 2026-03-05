import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function AppFooter() {
  const { t } = useTranslation()

  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">
            © {new Date().getFullYear()} Vorsorge Wizard
          </p>
          <nav className="flex items-center gap-6 text-sm">
            <Link to="/privacy" className="hover:text-white transition-colors">
              {t('nav.privacy')}
            </Link>
            <Link to="/imprint" className="hover:text-white transition-colors">
              {t('nav.imprint')}
            </Link>
          </nav>
        </div>
        <p className="mt-4 text-xs text-center text-gray-600">
          Vorsorge Wizard erstellt rechtlich strukturierte Dokumente. Die Dokumente ersetzen keine professionelle Rechtsberatung.
        </p>
      </div>
    </footer>
  )
}
