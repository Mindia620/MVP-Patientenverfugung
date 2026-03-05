import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { WizardAnswers } from '../types/wizard';

export function Step1PersonalInfo() {
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
  } = useFormContext<WizardAnswers>();

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">
          {t('wizard.step1.fullName')} *
        </label>
        <input
          id="fullName"
          type="text"
          {...register('personalInfo.fullName')}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
        {errors.personalInfo?.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.personalInfo.fullName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-slate-700">
          {t('wizard.step1.dateOfBirth')} *
        </label>
        <input
          id="dateOfBirth"
          type="date"
          {...register('personalInfo.dateOfBirth')}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
        {errors.personalInfo?.dateOfBirth && (
          <p className="mt-1 text-sm text-red-600">{errors.personalInfo.dateOfBirth.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="placeOfBirth" className="block text-sm font-medium text-slate-700">
          {t('wizard.step1.placeOfBirth')} *
        </label>
        <input
          id="placeOfBirth"
          type="text"
          placeholder="z.B. München, Deutschland"
          {...register('personalInfo.placeOfBirth')}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
        {errors.personalInfo?.placeOfBirth && (
          <p className="mt-1 text-sm text-red-600">{errors.personalInfo.placeOfBirth.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="street" className="block text-sm font-medium text-slate-700">
          {t('wizard.step1.street')} *
        </label>
        <input
          id="street"
          type="text"
          {...register('personalInfo.address.street')}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
        {errors.personalInfo?.address?.street && (
          <p className="mt-1 text-sm text-red-600">{errors.personalInfo.address.street.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium text-slate-700">
            {t('wizard.step1.postalCode')} *
          </label>
          <input
            id="postalCode"
            type="text"
            {...register('personalInfo.address.postalCode')}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
          {errors.personalInfo?.address?.postalCode && (
            <p className="mt-1 text-sm text-red-600">
              {errors.personalInfo.address.postalCode.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-slate-700">
            {t('wizard.step1.city')} *
          </label>
          <input
            id="city"
            type="text"
            {...register('personalInfo.address.city')}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
          {errors.personalInfo?.address?.city && (
            <p className="mt-1 text-sm text-red-600">{errors.personalInfo.address.city.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
