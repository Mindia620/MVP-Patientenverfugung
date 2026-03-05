import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { trustedPersonSchema } from '../schemas'
import type { Answers } from '../../types'

type FormData = z.infer<typeof trustedPersonSchema>

interface Props {
  data: Answers['trustedPerson']
  data2?: Answers['trustedPerson2']
  hasSecond: boolean
  onToggleSecond: () => void
  onNext: (data: FormData, data2?: FormData) => void
  onBack: () => void
}

export function StepTrustedPerson({ data, data2, hasSecond, onToggleSecond, onNext, onBack }: Props) {
  const { t } = useTranslation()

  const { register, handleSubmit, formState: { errors }, getValues } = useForm<FormData & {
    fullName2?: string; relationship2?: string; street2?: string; postalCode2?: string; city2?: string
  }>({
    resolver: zodResolver(trustedPersonSchema),
    defaultValues: {
      ...data,
      fullName2: data2?.fullName,
      relationship2: data2?.relationship,
      street2: data2?.street,
      postalCode2: data2?.postalCode,
      city2: data2?.city,
    },
  })

  const onSubmit = (formData: FormData) => {
    if (hasSecond) {
      const v = getValues()
      if (v.fullName2 && v.relationship2 && v.street2 && v.postalCode2 && v.city2) {
        onNext(formData, {
          fullName: v.fullName2,
          relationship: v.relationship2,
          street: v.street2,
          postalCode: v.postalCode2,
          city: v.city2,
        })
        return
      }
    }
    onNext(formData)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-800">{t('steps.trustedPerson')}</h2>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{t('trustedPerson.fullName')}</label>
        <input
          {...register('fullName')}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{t('trustedPerson.relationship')}</label>
        <input
          {...register('relationship')}
          placeholder="z.B. Ehepartner, Kind"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        {errors.relationship && <p className="mt-1 text-sm text-red-600">{errors.relationship.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{t('trustedPerson.street')}</label>
        <input
          {...register('street')}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        {errors.street && <p className="mt-1 text-sm text-red-600">{errors.street.message}</p>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('trustedPerson.postalCode')}</label>
          <input
            {...register('postalCode')}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="12345"
          />
          {errors.postalCode && <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>}
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('trustedPerson.city')}</label>
          <input
            {...register('city')}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('trustedPerson.phone')}</label>
          <input
            {...register('phone')}
            placeholder="+49"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('trustedPerson.email')}</label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          type="button"
          onClick={onToggleSecond}
          className="text-sm text-primary-600 hover:underline"
        >
          {hasSecond ? t('common.cancel') : t('trustedPerson.addSecond')}
        </button>
      </div>

      {hasSecond && (
        <>
          <hr className="border-slate-200" />
          <h3 className="font-medium text-slate-700">{t('trustedPerson.addSecond')}</h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('trustedPerson.fullName')}</label>
            <input {...register('fullName2')} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('trustedPerson.relationship')}</label>
            <input {...register('relationship2')} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('trustedPerson.street')}</label>
            <input {...register('street2')} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('trustedPerson.postalCode')}</label>
              <input {...register('postalCode2')} className="w-full px-4 py-2 border border-slate-300 rounded-lg" placeholder="12345" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('trustedPerson.city')}</label>
              <input {...register('city2')} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
            </div>
          </div>
        </>
      )}

      <div className="flex gap-4 justify-end">
        <button type="button" onClick={onBack} className="px-4 py-2 text-slate-600 hover:text-slate-800">
          {t('common.back')}
        </button>
        <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          {t('common.next')}
        </button>
      </div>
    </form>
  )
}
