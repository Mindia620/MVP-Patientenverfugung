import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { personalInfoSchema, type PersonalInfoFormData } from '@/lib/validation'
import { useWizardStore } from '@/store/wizardStore'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export function StepPersonalInfo() {
  const { t } = useTranslation()
  const { answers, setPersonalInfo, nextStep, prevStep } = useWizardStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: answers.personalInfo,
  })

  const onSubmit = (data: PersonalInfoFormData) => {
    setPersonalInfo(data)
    nextStep()
  }

  const s = t('wizard.step1', { returnObjects: true }) as Record<string, string>
  const e = t('errors', { returnObjects: true }) as Record<string, string>

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-6" noValidate>
      <div>
        <h2 className="text-xl font-bold text-slate-900">{s.title}</h2>
        <p className="text-sm text-slate-500 mt-1">{s.desc}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={s.firstName}
          required
          autoComplete="given-name"
          error={errors.firstName && e[errors.firstName.message as string]}
          {...register('firstName')}
        />
        <Input
          label={s.lastName}
          required
          autoComplete="family-name"
          error={errors.lastName && e[errors.lastName.message as string]}
          {...register('lastName')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={s.birthDate}
          type="date"
          required
          autoComplete="bday"
          error={errors.birthDate && e[errors.birthDate.message as string]}
          {...register('birthDate')}
        />
        <Input
          label={s.birthPlace}
          required
          autoComplete="off"
          error={errors.birthPlace && e[errors.birthPlace.message as string]}
          {...register('birthPlace')}
        />
      </div>

      <Input
        label={s.street}
        required
        autoComplete="street-address"
        error={errors.street && e[errors.street.message as string]}
        {...register('street')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={s.postalCode}
          required
          autoComplete="postal-code"
          maxLength={5}
          error={errors.postalCode && e[errors.postalCode.message as string]}
          {...register('postalCode')}
        />
        <Input
          label={s.city}
          required
          autoComplete="address-level2"
          error={errors.city && e[errors.city.message as string]}
          {...register('city')}
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
