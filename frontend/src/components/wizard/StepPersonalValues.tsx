import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { personalValuesSchema, type PersonalValuesFormData } from '@/lib/validation'
import { useWizardStore } from '@/store/wizardStore'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'

export function StepPersonalValues() {
  const { t } = useTranslation()
  const { answers, setPersonalValues, nextStep, prevStep } = useWizardStore()
  const s = t('wizard.step5', { returnObjects: true }) as Record<string, string>

  const { register, control, watch, handleSubmit } = useForm<PersonalValuesFormData>({
    resolver: zodResolver(personalValuesSchema),
    defaultValues: answers.personalValues,
  })

  const statementLen = watch('personalStatement')?.length ?? 0
  const religiousLen = watch('religiousWishes')?.length ?? 0

  const onSubmit = (data: PersonalValuesFormData) => {
    setPersonalValues(data)
    nextStep()
  }

  const organOptions = [
    { value: 'yes', label: s.organDonationYes },
    { value: 'no', label: s.organDonationNo },
    { value: 'unspecified', label: s.organDonationUnspecified },
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-6" noValidate>
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-slate-900">{s.title}</h2>
          <Badge variant="info">{s.optional}</Badge>
        </div>
        <p className="text-sm text-slate-500 mt-1">{s.desc}</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5">
        <Controller
          control={control}
          name="personalStatement"
          render={({ field }) => (
            <Textarea
              label={s.personalStatement}
              placeholder={s.personalStatementPlaceholder}
              hint={s.personalStatementHint}
              rows={5}
              maxLength={2000}
              currentLength={statementLen}
              {...field}
            />
          )}
        />

        <Controller
          control={control}
          name="religiousWishes"
          render={({ field }) => (
            <Textarea
              label={s.religiousWishes}
              placeholder={s.religiousWishesPlaceholder}
              rows={3}
              maxLength={500}
              currentLength={religiousLen}
              {...field}
            />
          )}
        />

        <Select
          label={s.organDonation}
          options={organOptions}
          {...register('organDonation')}
        />
      </div>

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
