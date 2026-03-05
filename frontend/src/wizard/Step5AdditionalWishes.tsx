import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { WizardAnswers } from '../types/wizard';

export function Step5AdditionalWishes() {
  const { t } = useTranslation();
  const { register, watch, formState: { errors } } = useFormContext<WizardAnswers>();
  const value = watch('additionalWishes') || '';

  return (
    <div className="space-y-4">
      <p className="text-slate-600">{t('wizard.step5.description')}</p>

      <div>
        <label htmlFor="additionalWishes" className="block text-sm font-medium text-slate-700">
          {t('wizard.step5.title')} ({t('common.optional')})
        </label>
        <textarea
          id="additionalWishes"
          rows={6}
          maxLength={2000}
          placeholder={t('wizard.step5.placeholder')}
          {...register('additionalWishes')}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
        <p className="mt-1 text-right text-sm text-slate-500">{value.length} / 2000</p>
        {errors.additionalWishes && (
          <p className="mt-1 text-sm text-red-600">{errors.additionalWishes.message}</p>
        )}
      </div>
    </div>
  );
}
