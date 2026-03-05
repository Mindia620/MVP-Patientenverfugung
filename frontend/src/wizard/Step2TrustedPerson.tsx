import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { WizardAnswers } from '../types/wizard';

export function Step2TrustedPerson() {
  const { t } = useTranslation();
  const [showAlternate, setShowAlternate] = useState(false);
  const { register, formState: { errors } } = useFormContext<WizardAnswers>();

  return (
    <div className="space-y-4">
      <p className="text-slate-600">{t('wizard.step2.description')}</p>

      <div>
        <label htmlFor="trustedFullName" className="block text-sm font-medium text-slate-700">
          {t('wizard.step2.fullName')} *
        </label>
        <input
          id="trustedFullName"
          type="text"
          {...register('trustedPerson.fullName')}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
        {errors.trustedPerson?.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.trustedPerson.fullName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="relationship" className="block text-sm font-medium text-slate-700">
          {t('wizard.step2.relationship')} *
        </label>
        <input
          id="relationship"
          type="text"
          placeholder="z.B. Ehepartner, Kind, Freund"
          {...register('trustedPerson.relationship')}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
        {errors.trustedPerson?.relationship && (
          <p className="mt-1 text-sm text-red-600">{errors.trustedPerson.relationship.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="trustedPhone" className="block text-sm font-medium text-slate-700">
          {t('wizard.step2.phone')} ({t('common.optional')})
        </label>
        <input
          id="trustedPhone"
          type="tel"
          {...register('trustedPerson.phone')}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
      </div>

      <div>
        <label htmlFor="trustedEmail" className="block text-sm font-medium text-slate-700">
          {t('wizard.step2.email')} ({t('common.optional')})
        </label>
        <input
          id="trustedEmail"
          type="email"
          {...register('trustedPerson.email')}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
      </div>

      <div>
        <label htmlFor="trustedAddress" className="block text-sm font-medium text-slate-700">
          {t('wizard.step2.address')} ({t('common.optional')})
        </label>
        <input
          id="trustedAddress"
          type="text"
          {...register('trustedPerson.address')}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
      </div>

      <div className="border-t border-slate-200 pt-6">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={showAlternate}
            onChange={(e) => setShowAlternate(e.target.checked)}
            className="rounded border-slate-300"
          />
          <span className="text-sm font-medium text-slate-700">{t('wizard.step2.alternatePerson')}</span>
        </label>
        {showAlternate && (
          <div className="mt-4 space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-700">{t('wizard.step2.alternatePersonLabel')}</p>
            <input
              type="text"
              placeholder={t('wizard.step2.fullName')}
              {...register('alternatePerson.fullName')}
              className="block w-full rounded-lg border border-slate-300 px-3 py-2"
            />
            <input
              type="text"
              placeholder={t('wizard.step2.relationship')}
              {...register('alternatePerson.relationship')}
              className="block w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
        )}
      </div>
    </div>
  );
}
