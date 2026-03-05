import { useTranslation } from 'react-i18next'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => i18n.changeLanguage('de')}
        className={`px-3 py-1 text-sm rounded ${i18n.language === 'de' ? 'bg-primary-100 text-primary-800 font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
      >
        DE
      </button>
      <button
        type="button"
        onClick={() => i18n.changeLanguage('en')}
        className={`px-3 py-1 text-sm rounded ${i18n.language === 'en' ? 'bg-primary-100 text-primary-800 font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
      >
        EN
      </button>
    </div>
  )
}
