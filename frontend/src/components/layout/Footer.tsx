import { useTranslation } from 'react-i18next'
import { ShieldCheck } from 'lucide-react'

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-500">
            <ShieldCheck size={16} className="text-sky-500" />
            <span className="text-sm font-medium">{t('app.name')}</span>
          </div>
          <nav className="flex flex-wrap gap-4 text-xs text-slate-500">
            <a href="/impressum" className="hover:text-slate-900 transition-colors">{t('footer.impressum')}</a>
            <a href="/datenschutz" className="hover:text-slate-900 transition-colors">{t('footer.datenschutz')}</a>
            <a href="/nutzungsbedingungen" className="hover:text-slate-900 transition-colors">{t('footer.nutzungsbedingungen')}</a>
          </nav>
        </div>
        <p className="mt-4 text-xs text-slate-400 max-w-2xl leading-relaxed">
          {t('app.disclaimer')}
        </p>
      </div>
    </footer>
  )
}
