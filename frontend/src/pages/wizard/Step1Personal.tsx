import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useWizardStore } from '../../store/wizardStore'
import { WizardLayout } from '../../components/wizard/WizardLayout'
import { FormInput, FormSelect } from '../../components/ui/FormField'
import type { PersonalInfo } from '../../types/wizard'
import { LockIcon } from '../../components/ui/Icons'

const schema = z.object({
  firstName: z.string().min(1, 'Vorname ist erforderlich'),
  lastName: z.string().min(1, 'Nachname ist erforderlich'),
  dateOfBirth: z.string().refine((val) => {
    const date = new Date(val)
    const now = new Date()
    const age = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    return age >= 18
  }, 'Sie müssen mindestens 18 Jahre alt sein'),
  placeOfBirth: z.string().min(1, 'Geburtsort ist erforderlich'),
  streetAddress: z.string().min(1, 'Straße ist erforderlich'),
  postalCode: z.string().regex(/^\d{5}$/, 'Bitte geben Sie eine gültige Postleitzahl ein'),
  city: z.string().min(1, 'Ort ist erforderlich'),
  country: z.string().min(1, 'Land ist erforderlich'),
})

export function Step1Personal() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { personalInfo, setPersonalInfo, setStep } = useWizardStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInfo>({
    resolver: zodResolver(schema),
    defaultValues: personalInfo ?? { country: 'Deutschland' },
  })

  const onSubmit = (data: PersonalInfo) => {
    setPersonalInfo(data)
    setStep(2)
    navigate('/wizard/step/2')
  }

  const maxDob = new Date()
  maxDob.setFullYear(maxDob.getFullYear() - 18)

  const countryOptions = [
    { value: 'Deutschland', label: 'Deutschland' },
    { value: 'Österreich', label: 'Österreich' },
    { value: 'Schweiz', label: 'Schweiz' },
    { value: 'Sonstiges', label: 'Sonstiges' },
  ]

  return (
    <WizardLayout
      currentStep={1}
      totalSteps={8}
      onNext={handleSubmit(onSubmit)}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="step-card">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{t('step1.title')}</h1>
          <p className="text-gray-600 mb-6">{t('step1.subtitle')}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label={t('step1.firstName')}
              {...register('firstName')}
              error={errors.firstName?.message}
              autoComplete="given-name"
              required
            />
            <FormInput
              label={t('step1.lastName')}
              {...register('lastName')}
              error={errors.lastName?.message}
              autoComplete="family-name"
              required
            />
            <FormInput
              label={t('step1.dateOfBirth')}
              type="date"
              {...register('dateOfBirth')}
              error={errors.dateOfBirth?.message}
              max={maxDob.toISOString().split('T')[0]}
              autoComplete="bday"
              required
            />
            <FormInput
              label={t('step1.placeOfBirth')}
              {...register('placeOfBirth')}
              error={errors.placeOfBirth?.message}
              required
            />
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Adresse</h2>
            <div className="grid grid-cols-1 gap-4">
              <FormInput
                label={t('step1.streetAddress')}
                {...register('streetAddress')}
                error={errors.streetAddress?.message}
                autoComplete="street-address"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label={t('step1.postalCode')}
                  {...register('postalCode')}
                  error={errors.postalCode?.message}
                  maxLength={5}
                  autoComplete="postal-code"
                  required
                  hint="5-stellige PLZ"
                />
                <FormInput
                  label={t('step1.city')}
                  {...register('city')}
                  error={errors.city?.message}
                  autoComplete="address-level2"
                  required
                />
              </div>
              <FormSelect
                label={t('step1.country')}
                {...register('country')}
                error={errors.country?.message}
                options={countryOptions}
                required
              />
            </div>
          </div>

          <div className="mt-6 flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
            <LockIcon className="w-4 h-4 text-primary-600 mt-0.5 shrink-0" />
            <p className="text-sm text-blue-800">{t('step1.privacy_note')}</p>
          </div>
        </div>
      </form>
    </WizardLayout>
  )
}
