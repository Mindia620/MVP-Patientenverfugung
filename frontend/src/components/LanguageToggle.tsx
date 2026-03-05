import { useTranslation } from 'react-i18next';

export function LanguageToggle() {
  const { i18n } = useTranslation();

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => i18n.changeLanguage('de')}
        className={`rounded px-3 py-1 text-sm font-medium ${
          i18n.language === 'de' ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
        }`}
      >
        DE
      </button>
      <button
        type="button"
        onClick={() => i18n.changeLanguage('en')}
        className={`rounded px-3 py-1 text-sm font-medium ${
          i18n.language === 'en' ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
        }`}
      >
        EN
      </button>
    </div>
  );
}
