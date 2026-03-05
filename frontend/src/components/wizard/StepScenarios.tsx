import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { scenarioChoicesSchema, type ScenarioChoicesFormData } from '@/lib/validation'
import { useWizardStore } from '@/store/wizardStore'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

function ScenarioSection({
  title,
  description,
  options,
  value,
  onChange,
}: {
  title: string
  description: string
  options: { value: string; label: string }[]
  value: string[]
  onChange: (v: string[]) => void
}) {
  const toggle = (key: string) => {
    onChange(value.includes(key) ? value.filter(v => v !== key) : [...value, key])
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
      <div>
        <h3 className="font-semibold text-slate-900 text-sm">{title}</h3>
        <p className="text-sm text-slate-600 mt-1 leading-relaxed italic">&ldquo;{description}&rdquo;</p>
      </div>

      <div className="space-y-2" role="group" aria-label={title}>
        {options.map(opt => {
          const selected = value.includes(opt.value)
          return (
            <label
              key={opt.value}
              className={cn(
                'flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm',
                selected
                  ? 'border-sky-500 bg-sky-50 text-sky-800'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
              )}
            >
              <input
                type="checkbox"
                checked={selected}
                onChange={() => toggle(opt.value)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              {opt.label}
            </label>
          )
        })}
      </div>
    </div>
  )
}

export function StepScenarios() {
  const { t } = useTranslation()
  const { answers, setScenarioChoices, nextStep, prevStep } = useWizardStore()
  const s = t('wizard.step4', { returnObjects: true }) as Record<string, unknown>

  const { control, handleSubmit } = useForm<ScenarioChoicesFormData>({
    resolver: zodResolver(scenarioChoicesSchema),
    defaultValues: answers.scenarioChoices,
  })

  const onSubmit = (data: ScenarioChoicesFormData) => {
    setScenarioChoices(data)
    nextStep()
  }

  const terminalOpts = s.terminalOptions as Record<string, string>
  const unconsciousOpts = s.unconsciousOptions as Record<string, string>
  const dementiaOpts = s.dementiaOptions as Record<string, string>

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-5" noValidate>
      <div>
        <h2 className="text-xl font-bold text-slate-900">{s.title as string}</h2>
        <p className="text-sm text-slate-500 mt-1">{s.desc as string}</p>
      </div>

      <Controller
        control={control}
        name="terminalIllness"
        render={({ field }) => (
          <ScenarioSection
            title={s.terminalTitle as string}
            description={s.terminalDesc as string}
            options={Object.entries(terminalOpts).map(([k, v]) => ({ value: k, label: v }))}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="irreversibleUnconsciousness"
        render={({ field }) => (
          <ScenarioSection
            title={s.unconsciousTitle as string}
            description={s.unconsciousDesc as string}
            options={Object.entries(unconsciousOpts).map(([k, v]) => ({ value: k, label: v }))}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="severeDementia"
        render={({ field }) => (
          <ScenarioSection
            title={s.dementiaTitle as string}
            description={s.dementiaDesc as string}
            options={Object.entries(dementiaOpts).map(([k, v]) => ({ value: k, label: v }))}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={prevStep} className="flex-1 sm:flex-none sm:w-32">
          {t('wizard.back')}
        </Button>
        <Button type="submit" className="flex-1">
          {t('wizard.continue')}
        </Button>
      </div>
    </form>
  )
}
