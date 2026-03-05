import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { medicalPreferencesSchema } from '../schemas'
import type { Answers } from '../../types'
import { Tooltip } from '../../components/Tooltip'

type FormData = z.infer<typeof medicalPreferencesSchema>

const FIELDS: (keyof FormData)[] = [
  'cpr',
  'ventilation',
  'artificialNutrition',
  'dialysis',
  'antibiotics',
  'painManagement',
]

interface Props {
  data: Answers['medicalPreferences']
  onNext: (data: FormData) => void
  onBack: () => void
}

export function StepMedicalPreferences({ data, onNext, onBack }: Props) {
  const { t } = useTranslation()

  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(medicalPreferencesSchema),
    defaultValues: data,
  })

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-800">{t('steps.medicalPreferences')}</h2>
      <p className="text-slate-600 text-sm">
        Wählen Sie für jede Behandlung, ob Sie sie wünschen, ablehnen oder Ihrer Vertrauensperson überlassen.
      </p>

      <div className="space-y-4">
        {FIELDS.map((field) => (
          <div key={String(field)} className="p-4 bg-white rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <label className="font-medium text-slate-700">{t(`medical.${String(field)}`)}</label>
              <Tooltip content={t(`medical.${String(field)}Tooltip`)} />
            </div>
            <div className="flex flex-wrap gap-4">
              {(['allow', 'refuse', 'delegate'] as const).map((value) => (
                <label key={value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    {...register(field as keyof FormData)}
                    value={value}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm">{t(`medical.${value}`)}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
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
