import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useWizardStore } from '../../store/wizardStore'
import { WizardLayout } from '../../components/wizard/WizardLayout'
import { FormTextarea } from '../../components/ui/FormField'
import type { PersonalValues, OrganDonationChoice } from '../../types/wizard'

const schema = z.object({
  valuesStatement: z.string().max(2000).optional(),
  spiritualWishes: z.string().max(500).optional(),
  specificExclusions: z.string().max(500).optional(),
  organDonation: z.enum(['yes', 'no', 'already_registered']),
})

export function Step5Values() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { personalValues, setPersonalValues, setStep } = useWizardStore()

  const { register, handleSubmit, control, watch } = useForm<PersonalValues>({
    resolver: zodResolver(schema),
    defaultValues: personalValues ?? { organDonation: 'already_registered' },
  })

  const watchedValues = watch()

  const onSubmit = (data: PersonalValues) => {
    setPersonalValues(data)
    setStep(6)
    navigate('/wizard/step/6')
  }

  const handleSkip = () => {
    setStep(6)
    navigate('/wizard/step/6')
  }

  const organOptions: { value: OrganDonationChoice; label: string }[] = [
    { value: 'yes', label: t('step5.organDonation_yes') },
    { value: 'no', label: t('step5.organDonation_no') },
    { value: 'already_registered', label: t('step5.organDonation_registered') },
  ]

  return (
    <WizardLayout
      currentStep={5}
      totalSteps={8}
      onBack={() => { setStep(4); navigate('/wizard/step/4') }}
      onNext={handleSubmit(onSubmit)}
      onSkip={handleSkip}
      skipLabel={t('wizard.skip')}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="step-card">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{t('step5.title')}</h1>
            <span className="text-sm text-gray-500 font-normal">{t('wizard.optional')}</span>
          </div>
          <p className="text-gray-600 mb-6">{t('step5.subtitle')}</p>

          <div className="space-y-5">
            <FormTextarea
              label={t('step5.valuesStatement')}
              {...register('valuesStatement')}
              placeholder={t('step5.valuesPlaceholder')}
              rows={5}
              maxLength={2000}
              currentLength={watchedValues.valuesStatement?.length ?? 0}
            />

            <FormTextarea
              label={t('step5.spiritualWishes')}
              {...register('spiritualWishes')}
              placeholder={t('step5.spiritualPlaceholder')}
              rows={3}
              maxLength={500}
              currentLength={watchedValues.spiritualWishes?.length ?? 0}
            />

            <FormTextarea
              label={t('step5.specificExclusions')}
              {...register('specificExclusions')}
              placeholder={t('step5.exclusionsPlaceholder')}
              rows={3}
              maxLength={500}
              currentLength={watchedValues.specificExclusions?.length ?? 0}
            />

            {/* Organ donation */}
            <div>
              <p className="input-label mb-2">{t('step5.organDonation')}</p>
              <Controller
                name="organDonation"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    {organOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => field.onChange(opt.value)}
                        className={`w-full text-left px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all
                          ${field.value === opt.value
                            ? 'bg-primary-50 border-primary-500 text-primary-900'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'
                          }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center
                            ${field.value === opt.value ? 'border-primary-600 bg-primary-600' : 'border-gray-400'}`}>
                            {field.value === opt.value && (
                              <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                          </span>
                          {opt.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              />
              <p className="mt-2 text-xs text-gray-500">
                {t('step5.organ_note')}
              </p>
            </div>
          </div>
        </div>
      </form>
    </WizardLayout>
  )
}
