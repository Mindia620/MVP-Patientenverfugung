import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useWizardStore } from '../../store/wizardStore'
import { WizardLayout } from '../../components/wizard/WizardLayout'
import type { Scenarios, ScenarioChoice } from '../../types/wizard'
import { FormTextarea } from '../../components/ui/FormField'

const scenarioChoiceSchema = z.enum(['life_sustaining', 'palliative_only', 'trusted_person_decides'])

const schema = z.object({
  terminalIllness: scenarioChoiceSchema,
  terminalIllnessNotes: z.string().max(500).optional(),
  irreversibleUnconscious: scenarioChoiceSchema,
  irreversibleUnconsciousNotes: z.string().max(500).optional(),
  severeDementia: scenarioChoiceSchema,
  severeDementiaExtra: z.string().max(1000).optional(),
})

type ScenarioKey = 'terminalIllness' | 'irreversibleUnconscious' | 'severeDementia'
type NotesKey = 'terminalIllnessNotes' | 'irreversibleUnconsciousNotes' | 'severeDementiaExtra'

interface ScenarioBlockProps {
  scenarioKey: ScenarioKey
  value: ScenarioChoice
  notesValue: string
  onChange: (val: ScenarioChoice) => void
  onNotesChange: (val: string) => void
}

function ScenarioBlock({ scenarioKey, value, notesValue, onChange, onNotesChange }: ScenarioBlockProps) {
  const { t } = useTranslation()

  const choices: { value: ScenarioChoice; label: string }[] = [
    { value: 'life_sustaining', label: t('step4.choice_life_sustaining') },
    { value: 'palliative_only', label: t('step4.choice_palliative_only') },
    { value: 'trusted_person_decides', label: t('step4.choice_trusted_person') },
  ]

  return (
    <div className="card p-5">
      <div className="mb-3">
        <h3 className="font-bold text-gray-900 mb-1">
          {t(`step4.scenarios.${scenarioKey}.title`)}
        </h3>
        <p className="text-sm text-gray-600 italic">
          {t(`step4.scenarios.${scenarioKey}.description`)}
        </p>
      </div>

      <div className="space-y-2">
        {choices.map((choice) => (
          <button
            key={choice.value}
            type="button"
            onClick={() => onChange(choice.value)}
            className={`w-full text-left px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all duration-150
              ${value === choice.value
                ? 'bg-primary-50 border-primary-500 text-primary-900'
                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
              }`}
            aria-pressed={value === choice.value}
          >
            <span className="inline-flex items-center gap-3">
              <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center
                ${value === choice.value ? 'border-primary-600 bg-primary-600' : 'border-gray-400'}`}>
                {value === choice.value && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </span>
              {choice.label}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-3">
        <FormTextarea
          label={t('step4.additional_notes')}
          value={notesValue}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={2}
          maxLength={500}
          currentLength={notesValue.length}
          placeholder="Optional..."
          id={`notes-${scenarioKey}`}
        />
      </div>
    </div>
  )
}

const scenarios: { key: ScenarioKey; notesKey: NotesKey }[] = [
  { key: 'terminalIllness', notesKey: 'terminalIllnessNotes' },
  { key: 'irreversibleUnconscious', notesKey: 'irreversibleUnconsciousNotes' },
  { key: 'severeDementia', notesKey: 'severeDementiaExtra' },
]

export function Step4Scenarios() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { scenarios: savedScenarios, setScenarios, setStep } = useWizardStore()

  const defaultValues: Scenarios = savedScenarios ?? {
    terminalIllness: 'palliative_only',
    terminalIllnessNotes: '',
    irreversibleUnconscious: 'palliative_only',
    irreversibleUnconsciousNotes: '',
    severeDementia: 'palliative_only',
    severeDementiaExtra: '',
  }

  const { control, handleSubmit, watch, setValue } = useForm<Scenarios>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const watchedValues = watch()

  const onSubmit = (data: Scenarios) => {
    setScenarios(data)
    setStep(5)
    navigate('/wizard/step/5')
  }

  return (
    <WizardLayout
      currentStep={4}
      totalSteps={8}
      onBack={() => { setStep(3); navigate('/wizard/step/3') }}
      onNext={handleSubmit(onSubmit)}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="step-card">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{t('step4.title')}</h1>
          <p className="text-gray-600 mb-6">{t('step4.subtitle')}</p>

          <div className="space-y-4">
            {scenarios.map(({ key, notesKey }) => (
              <Controller
                key={key}
                name={key}
                control={control}
                render={({ field }) => (
                  <ScenarioBlock
                    scenarioKey={key}
                    value={field.value}
                    notesValue={watchedValues[notesKey] as string ?? ''}
                    onChange={field.onChange}
                    onNotesChange={(val) => setValue(notesKey, val)}
                  />
                )}
              />
            ))}
          </div>
        </div>
      </form>
    </WizardLayout>
  )
}
