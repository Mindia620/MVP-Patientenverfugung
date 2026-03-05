import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { personalInfoSchema } from '../schemas'
import type { Answers } from '../../types'

type FormData = z.infer<typeof personalInfoSchema>

interface Props {
  data: Answers['personalInfo']
  onNext: (data: FormData) => void
  onBack?: () => void
}

export function StepPersonalInfo({ data, onNext, onBack }: Props) {
  const { t } = useTranslation()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: data,
  })

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-800">{t('steps.personalInfo')}</h2>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{t('personalInfo.fullName')}</label>
        <input
          {...register('fullName')}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{t('personalInfo.street')}</label>
        <input
          {...register('street')}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        {errors.street && <p className="mt-1 text-sm text-red-600">{errors.street.message}</p>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('personalInfo.postalCode')}</label>
          <input
            {...register('postalCode')}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="12345"
          />
          {errors.postalCode && <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>}
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('personalInfo.city')}</label>
          <input
            {...register('city')}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{t('personalInfo.dateOfBirth')}</label>
        <input
          type="date"
          {...register('dateOfBirth')}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{t('personalInfo.placeOfBirth')}</label>
        <input
          {...register('placeOfBirth')}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div className="flex gap-4 justify-end">
        {onBack && (
          <button type="button" onClick={onBack} className="px-4 py-2 text-slate-600 hover:text-slate-800">
            {t('common.back')}
          </button>
        )}
        <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          {t('common.next')}
        </button>
      </div>
    </form>
  )
}
