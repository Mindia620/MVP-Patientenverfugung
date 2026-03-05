import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { valuesSchema } from '../schemas'
import type { Answers } from '../../types'

type FormData = z.infer<typeof valuesSchema>

interface Props {
  data?: Answers['values']
  onNext: (data: FormData) => void
  onBack: () => void
}

export function StepValues({ data, onNext, onBack }: Props) {
  const { t } = useTranslation()

  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(valuesSchema),
    defaultValues: data ?? { religiousWishes: '', otherWishes: '' },
  })

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-800">{t('steps.values')}</h2>
      <p className="text-slate-600 text-sm">{t('values.optional')}</p>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{t('values.religiousWishes')}</label>
        <textarea
          {...register('religiousWishes')}
          rows={4}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{t('values.otherWishes')}</label>
        <textarea
          {...register('otherWishes')}
          rows={4}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

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
