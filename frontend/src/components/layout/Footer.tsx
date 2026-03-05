import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
        <p className="mb-2 font-medium">{t('footer.disclaimer')}</p>
        <div className="flex justify-center gap-4 text-xs">
          <span>{t('footer.privacy')}</span>
          <span>{t('footer.imprint')}</span>
          <span>{t('footer.terms')}</span>
        </div>
        <p className="mt-3 text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Vorsorge Wizard
        </p>
      </div>
    </footer>
  );
}
