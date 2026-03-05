import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { medicalPreferencesSchema } from '../../schemas/wizard';
import type { MedicalPreferences, TreatmentPreference } from '../../types/wizard';
import { useWizardStore } from '../../store/wizardStore';
import { Tooltip } from '../ui/Tooltip';
import { WizardNav } from './WizardNav';
import { AlertCircle } from 'lucide-react';

const TREATMENTS = ['cpr', 'ventilation', 'artificialNutrition', 'dialysis', 'antibiotics', 'painManagement'] as const;
const OPTIONS: TreatmentPreference[] = ['yes', 'no', 'doctor_decides'];

function TreatmentCard({
  name,
  value,
  onChange,
  t,
}: {
  name: string;
  value: TreatmentPreference;
  onChange: (v: TreatmentPreference) => void;
  t: (key: string) => string;
}) {
  const note = name === 'painManagement' ? t(`medicalPreferences.${name}.note`) : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="mb-3">
        <h3 className="font-semibold text-primary-600 flex items-center">
          {t(`medicalPreferences.${name}.title`)}
          <Tooltip content={t(`medicalPreferences.${name}.tooltip`)} />
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {t(`medicalPreferences.${name}.question`)}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`
              flex-1 px-3 py-2.5 rounded-lg text-sm font-medium border-2 transition-all
              ${value === opt
                ? opt === 'yes'
                  ? 'border-secondary-400 bg-secondary-50 text-secondary-700'
                  : opt === 'no'
                  ? 'border-red-400 bg-red-50 text-red-700'
                  : 'border-primary-400 bg-primary-50 text-primary-700'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }
            `}
          >
            {t(`medicalPreferences.options.${opt}`)}
          </button>
        ))}
      </div>
      {note && (
        <p className="mt-2 text-xs text-amber-600 flex items-center gap-1">
          <AlertCircle size={12} />
          {note}
        </p>
      )}
    </div>
  );
}

export function MedicalPreferencesStep() {
  const { t } = useTranslation();
  const { data, setMedicalPreferences, nextStep, prevStep } = useWizardStore();

  const { control, handleSubmit } = useForm<MedicalPreferences>({
    resolver: zodResolver(medicalPreferencesSchema),
    defaultValues: data.medicalPreferences,
  });

  const onSubmit = (values: MedicalPreferences) => {
    setMedicalPreferences(values);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-primary-500">{t('medicalPreferences.title')}</h2>
        <p className="text-gray-600">{t('medicalPreferences.subtitle')}</p>
      </div>

      <div className="space-y-4">
        {TREATMENTS.map((treatment) => (
          <Controller
            key={treatment}
            name={treatment}
            control={control}
            render={({ field }) => (
              <TreatmentCard
                name={treatment}
                value={field.value}
                onChange={field.onChange}
                t={t}
              />
            )}
          />
        ))}
      </div>

      <WizardNav onBack={prevStep} />
    </form>
  );
}
