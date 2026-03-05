import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { medicalPreferencesSchema, type MedicalPreferencesFormData } from '@/lib/validation'
import { useWizardStore } from '@/store/wizardStore'
import { Button } from '@/components/ui/Button'
import { Tooltip } from '@/components/ui/Tooltip'
import { cn } from '@/lib/utils'

type RadioOption = { value: string; label: string }

function TreatmentCard({
  title,
  question,
  tooltip,
  name,
  options,
  value,
  onChange,
  error,
}: {
  title: string
  question: string
  tooltip: string
  name: string
  options: RadioOption[]
  value: string
  onChange: (v: string) => void
  error?: string
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 text-sm">{title}</h3>
          <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">{question}</p>
        </div>
        <Tooltip content={tooltip} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" role="radiogroup" aria-label={title}>
        {options.map(opt => (
          <label
            key={opt.value}
            className={cn(
              'flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm',
              value === opt.value
                ? 'border-sky-500 bg-sky-50 text-sky-800 font-medium'
                : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
            )}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />
            <span className={cn(
              'w-4 h-4 rounded-full border-2 flex-shrink-0',
              value === opt.value ? 'border-sky-500 bg-sky-500' : 'border-slate-300 bg-white'
            )} />
            {opt.label}
          </label>
        ))}
      </div>

      {error && <p role="alert" className="text-xs text-red-600">⚠ {error}</p>}
    </div>
  )
}

export function StepMedicalPreferences() {
  const { t } = useTranslation()
  const { answers, setMedicalPreferences, nextStep, prevStep } = useWizardStore()
  const s = t('wizard.step3', { returnObjects: true }) as Record<string, string>

  const { control, handleSubmit } = useForm<MedicalPreferencesFormData>({
    resolver: zodResolver(medicalPreferencesSchema),
    defaultValues: answers.medicalPreferences,
  })

  const onSubmit = (data: MedicalPreferencesFormData) => {
    setMedicalPreferences(data)
    nextStep()
  }

  const standardOptions: RadioOption[] = [
    { value: 'yes', label: s.choiceYes },
    { value: 'no', label: s.choiceNo },
    { value: 'doctor', label: s.choiceDoctor },
  ]

  const painOptions: RadioOption[] = [
    { value: 'maxRelief', label: s.painMaxRelief },
    { value: 'lifeFirst', label: s.painLifeFirst },
    { value: 'balanced', label: s.painBalanced },
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-5" noValidate>
      <div>
        <h2 className="text-xl font-bold text-slate-900">{s.title}</h2>
        <p className="text-sm text-slate-500 mt-1">{s.desc}</p>
      </div>

      <Controller
        control={control}
        name="cpr"
        render={({ field, fieldState }) => (
          <TreatmentCard
            title={s.cprTitle}
            question={s.cprQuestion}
            tooltip={s.cprTooltip}
            name="cpr"
            options={standardOptions}
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="ventilation"
        render={({ field, fieldState }) => (
          <TreatmentCard
            title={s.ventilationTitle}
            question={s.ventilationQuestion}
            tooltip={s.ventilationTooltip}
            name="ventilation"
            options={standardOptions}
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="artificialNutrition"
        render={({ field, fieldState }) => (
          <TreatmentCard
            title={s.nutritionTitle}
            question={s.nutritionQuestion}
            tooltip={s.nutritionTooltip}
            name="artificialNutrition"
            options={standardOptions}
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="dialysis"
        render={({ field, fieldState }) => (
          <TreatmentCard
            title={s.dialysisTitle}
            question={s.dialysisQuestion}
            tooltip={s.dialysisTooltip}
            name="dialysis"
            options={standardOptions}
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="antibiotics"
        render={({ field, fieldState }) => (
          <TreatmentCard
            title={s.antibioticsTitle}
            question={s.antibioticsQuestion}
            tooltip={s.antibioticsTooltip}
            name="antibiotics"
            options={[
              { value: 'yes', label: s.antibioticsChoiceYes },
              { value: 'no', label: s.antibioticsChoiceRelief },
              { value: 'doctor', label: s.antibioticsChoiceDoctor },
            ]}
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="painManagement"
        render={({ field, fieldState }) => (
          <TreatmentCard
            title={s.painTitle}
            question={s.painQuestion}
            tooltip={s.painTooltip}
            name="painManagement"
            options={painOptions}
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
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
