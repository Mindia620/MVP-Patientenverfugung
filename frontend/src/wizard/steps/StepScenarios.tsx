import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { scenariosSchema } from '../schemas'
import type { Answers } from '../../types'

type FormData = z.infer<typeof scenariosSchema>

interface Props {
  data: Answers['scenarios']
  onNext: (data: FormData) => void
  onBack: () => void
}

export function StepScenarios({ data, onNext, onBack }: Props) {
  const { t } = useTranslation()

  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(scenariosSchema),
    defaultValues: data,
  })

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-800">{t('steps.scenarios')}</h2>
      <p className="text-slate-600 text-sm">
        Für jede Situation können Sie Ihre allgemeinen Wünsche anwenden oder anpassen.
      </p>

      <div className="space-y-4">
        <div className="p-4 bg-white rounded-lg border border-slate-200">
          <h3 className="font-medium text-slate-700 mb-2">{t('scenarios.terminalIllness')}</h3>
          <p className="text-sm text-slate-500 mb-3">{t('scenarios.terminalIllnessDesc')}</p>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              {...register('terminalIllness.applyGeneral')}
              value="true"
              className="text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm">{t('scenarios.applyGeneral')}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer ml-4">
            <input
              type="radio"
              {...register('terminalIllness.applyGeneral')}
              value="false"
              className="text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm">{t('scenarios.customize')}</span>
          </label>
        </div>

        <div className="p-4 bg-white rounded-lg border border-slate-200">
          <h3 className="font-medium text-slate-700 mb-2">{t('scenarios.irreversibleUnconsciousness')}</h3>
          <p className="text-sm text-slate-500 mb-3">{t('scenarios.irreversibleUnconsciousnessDesc')}</p>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              {...register('irreversibleUnconsciousness.applyGeneral')}
              value="true"
              className="text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm">{t('scenarios.applyGeneral')}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer ml-4">
            <input
              type="radio"
              {...register('irreversibleUnconsciousness.applyGeneral')}
              value="false"
              className="text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm">{t('scenarios.customize')}</span>
          </label>
        </div>

        <div className="p-4 bg-white rounded-lg border border-slate-200">
          <h3 className="font-medium text-slate-700 mb-2">{t('scenarios.severeDementia')}</h3>
          <p className="text-sm text-slate-500 mb-3">{t('scenarios.severeDementiaDesc')}</p>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              {...register('severeDementia.applyGeneral')}
              value="true"
              className="text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm">{t('scenarios.applyGeneral')}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer ml-4">
            <input
              type="radio"
              {...register('severeDementia.applyGeneral')}
              value="false"
              className="text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm">{t('scenarios.customize')}</span>
          </label>
        </div>
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
