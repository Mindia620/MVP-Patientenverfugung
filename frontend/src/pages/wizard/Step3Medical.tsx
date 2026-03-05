import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useWizardStore } from '../../store/wizardStore'
import { WizardLayout } from '../../components/wizard/WizardLayout'
import type { MedicalPrefs, TreatmentChoice } from '../../types/wizard'
import { Tooltip } from '../../components/ui/Tooltip'

const treatmentChoiceSchema = z.enum(['yes', 'no', 'doctor'])

const schema = z.object({
  cpr: treatmentChoiceSchema,
  ventilation: treatmentChoiceSchema,
  artificialNutrition: treatmentChoiceSchema,
  dialysis: treatmentChoiceSchema,
  antibiotics: treatmentChoiceSchema,
  painManagement: treatmentChoiceSchema,
})

type TreatmentKey = keyof MedicalPrefs

interface TreatmentCardProps {
  treatmentKey: TreatmentKey
  value: TreatmentChoice
  onChange: (val: TreatmentChoice) => void
}

function TreatmentCard({ treatmentKey, value, onChange }: TreatmentCardProps) {
  const { t } = useTranslation()
  const title = t(`step3.treatments.${treatmentKey}.title`)
  const tooltip = t(`step3.treatments.${treatmentKey}.tooltip`)

  const choices: { value: TreatmentChoice; label: string; color: string }[] = [
    { value: 'yes', label: t('step3.choice_yes'), color: 'green' },
    { value: 'no', label: t('step3.choice_no'), color: 'red' },
    { value: 'doctor', label: t('step3.choice_doctor'), color: 'blue' },
  ]

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{title}</h3>
        <Tooltip content={tooltip}>
          <span className="ml-2 shrink-0 text-xs text-primary-600 underline cursor-help whitespace-nowrap">
            {t('step3.learn_more')}
          </span>
        </Tooltip>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {choices.map((choice) => (
          <button
            key={choice.value}
            type="button"
            onClick={() => onChange(choice.value)}
            className={`px-3 py-2.5 rounded-lg border-2 text-sm font-medium transition-all duration-150 text-left sm:text-center
              ${value === choice.value
                ? choice.color === 'green'
                  ? 'bg-green-50 border-green-500 text-green-800'
                  : choice.color === 'red'
                    ? 'bg-red-50 border-red-500 text-red-800'
                    : 'bg-blue-50 border-blue-500 text-blue-800'
                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
            aria-pressed={value === choice.value}
          >
            <span className="mr-1">
              {value === choice.value ? '✓' : '○'}
            </span>
            {choice.label}
          </button>
        ))}
      </div>
    </div>
  )
}

const treatmentKeys: TreatmentKey[] = [
  'cpr',
  'ventilation',
  'artificialNutrition',
  'dialysis',
  'antibiotics',
  'painManagement',
]

export function Step3Medical() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { medicalPrefs, setMedicalPrefs, setStep } = useWizardStore()

  const defaultValues: MedicalPrefs = medicalPrefs ?? {
    cpr: 'doctor',
    ventilation: 'doctor',
    artificialNutrition: 'doctor',
    dialysis: 'doctor',
    antibiotics: 'doctor',
    painManagement: 'yes',
  }

  const { control, handleSubmit } = useForm<MedicalPrefs>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const onSubmit = (data: MedicalPrefs) => {
    setMedicalPrefs(data)
    setStep(4)
    navigate('/wizard/step/4')
  }

  return (
    <WizardLayout
      currentStep={3}
      totalSteps={8}
      onBack={() => { setStep(2); navigate('/wizard/step/2') }}
      onNext={handleSubmit(onSubmit)}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="step-card">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{t('step3.title')}</h1>
          <p className="text-gray-600 mb-6">{t('step3.subtitle')}</p>

          <div className="space-y-3">
            {treatmentKeys.map((key) => (
              <Controller
                key={key}
                name={key}
                control={control}
                render={({ field }) => (
                  <TreatmentCard
                    treatmentKey={key}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            ))}
          </div>

          <p className="mt-4 text-xs text-gray-500 italic">
            Sie können jederzeit zurückgehen und Ihre Angaben ändern.
          </p>
        </div>
      </form>
    </WizardLayout>
  )
}
