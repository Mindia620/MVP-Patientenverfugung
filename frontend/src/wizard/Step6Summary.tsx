import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { WizardAnswers } from '../types/wizard';

const medicalLabels: Record<string, string> = {
  yes: 'wizard.step3.yes',
  no: 'wizard.step3.no',
  situation_dependent: 'wizard.step3.situationDependent',
};

export function Step6Summary() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { watch } = useFormContext<WizardAnswers>();
  const data = watch();

  return (
    <div className="space-y-6">
      <p className="text-slate-600">{t('wizard.step6.description')}</p>

      <div className="space-y-4">
        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">{t('wizard.step1.title')}</h3>
            <button
              type="button"
              onClick={() => navigate('/wizard/1')}
              className="text-sm text-teal-600 hover:underline"
            >
              {t('wizard.step6.edit')}
            </button>
          </div>
          <dl className="mt-2 space-y-1 text-sm text-slate-600">
            <div><dt className="inline font-medium">Name:</dt> <dd className="inline">{data.personalInfo?.fullName}</dd></div>
            <div><dt className="inline font-medium">Geburtsdatum:</dt> <dd className="inline">{data.personalInfo?.dateOfBirth}</dd></div>
            <div><dt className="inline font-medium">Geburtsort:</dt> <dd className="inline">{data.personalInfo?.placeOfBirth}</dd></div>
            <div><dt className="inline font-medium">Adresse:</dt> <dd className="inline">{data.personalInfo?.address?.street}, {data.personalInfo?.address?.postalCode} {data.personalInfo?.address?.city}</dd></div>
          </dl>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">{t('wizard.step2.title')}</h3>
            <button type="button" onClick={() => navigate('/wizard/2')} className="text-sm text-teal-600 hover:underline">
              {t('wizard.step6.edit')}
            </button>
          </div>
          <dl className="mt-2 space-y-1 text-sm text-slate-600">
            <div><dt className="inline font-medium">Name:</dt> <dd className="inline">{data.trustedPerson?.fullName}</dd></div>
            <div><dt className="inline font-medium">Beziehung:</dt> <dd className="inline">{data.trustedPerson?.relationship}</dd></div>
          </dl>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">{t('wizard.step3.title')}</h3>
            <button type="button" onClick={() => navigate('/wizard/3')} className="text-sm text-teal-600 hover:underline">
              {t('wizard.step6.edit')}
            </button>
          </div>
          <dl className="mt-2 space-y-1 text-sm text-slate-600">
            {data.medicalPreferences && Object.entries(data.medicalPreferences).map(([key, val]) => (
              <div key={key}><dt className="inline font-medium capitalize">{key}:</dt> <dd className="inline">{t(medicalLabels[val as string] || val)}</dd></div>
            ))}
          </dl>
        </section>

        {data.additionalWishes && (
          <section className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">{t('wizard.step5.title')}</h3>
              <button type="button" onClick={() => navigate('/wizard/5')} className="text-sm text-teal-600 hover:underline">
                {t('wizard.step6.edit')}
              </button>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{data.additionalWishes}</p>
          </section>
        )}
      </div>
    </div>
  );
}
