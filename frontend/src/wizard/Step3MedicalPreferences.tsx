import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '../components/Tooltip';
import type { WizardAnswers } from '../types/wizard';
const treatments = [
  { key: 'cpr' as const, labelKey: 'wizard.step3.cpr', tooltipKey: 'wizard.step3.cprTooltip' },
  { key: 'ventilation' as const, labelKey: 'wizard.step3.ventilation', tooltipKey: 'wizard.step3.ventilationTooltip' },
  { key: 'artificialNutrition' as const, labelKey: 'wizard.step3.artificialNutrition', tooltipKey: 'wizard.step3.artificialNutritionTooltip' },
  { key: 'dialysis' as const, labelKey: 'wizard.step3.dialysis', tooltipKey: 'wizard.step3.dialysisTooltip' },
  { key: 'antibiotics' as const, labelKey: 'wizard.step3.antibiotics', tooltipKey: 'wizard.step3.antibioticsTooltip' },
  { key: 'painManagement' as const, labelKey: 'wizard.step3.painManagement', tooltipKey: 'wizard.step3.painManagementTooltip' },
];

export function Step3MedicalPreferences() {
  const { t } = useTranslation();
  const { register, formState: { errors } } = useFormContext<WizardAnswers>();

  return (
    <div className="space-y-6">
      <p className="text-slate-600">{t('wizard.step3.description')}</p>

      {treatments.map(({ key, labelKey, tooltipKey }) => (
        <div key={key} className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <label className="font-medium text-slate-700">{t(labelKey)}</label>
            <Tooltip content={t(tooltipKey)}>
              <span />
            </Tooltip>
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="yes"
                {...register(`medicalPreferences.${key}`)}
                className="border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm">{t('wizard.step3.yes')}</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="no"
                {...register(`medicalPreferences.${key}`)}
                className="border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm">{t('wizard.step3.no')}</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="situation_dependent"
                {...register(`medicalPreferences.${key}`)}
                className="border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm">{t('wizard.step3.situationDependent')}</span>
            </label>
          </div>
          {errors.medicalPreferences?.[key] && (
            <p className="mt-1 text-sm text-red-600">{errors.medicalPreferences[key]?.message}</p>
          )}
        </div>
      ))}
    </div>
  );
}
