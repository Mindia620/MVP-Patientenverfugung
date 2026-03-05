import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export function IntroPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">{t('intro.title')}</h1>
      <p className="mt-2 text-xl text-slate-600">{t('intro.subtitle')}</p>

      <div className="mt-8 space-y-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-semibold text-slate-900">Patientenverfügung</h2>
          <p className="mt-1 text-slate-600">{t('intro.patientenverfuegung')}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-semibold text-slate-900">Vorsorgevollmacht</h2>
          <p className="mt-1 text-slate-600">{t('intro.vorsorgevollmacht')}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="font-semibold text-slate-900">Betreuungsverfügung</h2>
          <p className="mt-1 text-slate-600">{t('intro.betreuungsverfuegung')}</p>
        </div>
      </div>

      <div className="mt-8 rounded-lg border-2 border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-medium text-amber-900">{t('intro.disclaimer')}</p>
      </div>

      <p className="mt-4 text-sm text-slate-500">{t('intro.timeEstimate')}</p>

      <button
        type="button"
        onClick={() => navigate('/wizard/1')}
        className="mt-8 w-full rounded-lg bg-teal-600 px-6 py-3 font-semibold text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
      >
        {t('common.start')}
      </button>
    </div>
  );
}
