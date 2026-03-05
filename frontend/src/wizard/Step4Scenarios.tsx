import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { WizardAnswers } from '../types/wizard';

const scenarios = [
  { key: 'terminalIllness' as const, labelKey: 'wizard.step4.terminalIllness', descKey: 'wizard.step4.terminalIllnessDesc' },
  { key: 'irreversibleUnconsciousness' as const, labelKey: 'wizard.step4.irreversibleUnconsciousness', descKey: 'wizard.step4.irreversibleUnconsciousnessDesc' },
  { key: 'severeDementia' as const, labelKey: 'wizard.step4.severeDementia', descKey: 'wizard.step4.severeDementiaDesc' },
];

export function Step4Scenarios() {
  const { t } = useTranslation();
  const { register } = useFormContext<WizardAnswers>();

  return (
    <div className="space-y-6">
      <p className="text-slate-600">{t('wizard.step4.description')}</p>

      {scenarios.map(({ key, labelKey, descKey }) => (
        <div key={key} className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="font-medium text-slate-900">{t(labelKey)}</h3>
          <p className="mt-1 text-sm text-slate-600">{t(descKey)}</p>
          <div className="mt-4 flex flex-wrap gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="same"
                {...register(`scenarios.${key}`)}
                className="border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm">{t('wizard.step4.samePreferences')}</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="different"
                {...register(`scenarios.${key}`)}
                className="border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm">{t('wizard.step4.differentPreferences')}</span>
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}
