import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useWizardStore } from '../../store/wizardStore'
import { WizardLayout } from '../../components/wizard/WizardLayout'
import { FormInput, FormSelect } from '../../components/ui/FormField'
import { InfoIcon } from '../../components/ui/Tooltip'
import type { TrustedPerson } from '../../types/wizard'

const schema = z.object({
  fullName: z.string().min(2, 'Name ist erforderlich'),
  relationship: z.string().min(1, 'Bitte wählen Sie eine Option'),
  streetAddress: z.string().min(1, 'Adresse ist erforderlich'),
  postalCode: z.string().min(1, 'PLZ ist erforderlich'),
  city: z.string().min(1, 'Ort ist erforderlich'),
  phone: z.string().optional(),
  email: z.string().email('Bitte geben Sie eine gültige E-Mail ein').optional().or(z.literal('')),
  hasSubstitute: z.boolean().optional(),
  substituteFullName: z.string().optional(),
  substituteRelationship: z.string().optional(),
  substituteStreetAddress: z.string().optional(),
  substitutePostalCode: z.string().optional(),
  substituteCity: z.string().optional(),
  substitutePhone: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function Step2TrustedPerson() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { trustedPerson, setTrustedPerson, setStep } = useWizardStore()
  const [showSubstitute, setShowSubstitute] = useState(!!trustedPerson?.substitute)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: trustedPerson?.fullName ?? '',
      relationship: trustedPerson?.relationship ?? '',
      streetAddress: trustedPerson?.streetAddress ?? '',
      postalCode: trustedPerson?.postalCode ?? '',
      city: trustedPerson?.city ?? '',
      phone: trustedPerson?.phone ?? '',
      email: trustedPerson?.email ?? '',
      substituteFullName: trustedPerson?.substitute?.fullName ?? '',
      substituteRelationship: trustedPerson?.substitute?.relationship ?? '',
      substituteStreetAddress: trustedPerson?.substitute?.streetAddress ?? '',
      substitutePostalCode: trustedPerson?.substitute?.postalCode ?? '',
      substituteCity: trustedPerson?.substitute?.city ?? '',
      substitutePhone: trustedPerson?.substitute?.phone ?? '',
    },
  })

  const onSubmit = (data: FormData) => {
    const trusted: TrustedPerson = {
      fullName: data.fullName,
      relationship: data.relationship,
      streetAddress: data.streetAddress,
      postalCode: data.postalCode,
      city: data.city,
      phone: data.phone || undefined,
      email: data.email || undefined,
    }

    if (showSubstitute && data.substituteFullName) {
      trusted.substitute = {
        fullName: data.substituteFullName,
        relationship: data.substituteRelationship ?? 'other',
        streetAddress: data.substituteStreetAddress ?? '',
        postalCode: data.substitutePostalCode ?? '',
        city: data.substituteCity ?? '',
        phone: data.substitutePhone || undefined,
      }
    }

    setTrustedPerson(trusted)
    setStep(3)
    navigate('/wizard/step/3')
  }

  const relationshipOptions = [
    { value: '', label: 'Bitte wählen...' },
    { value: 'spouse', label: t('step2.relationships.spouse') },
    { value: 'partner', label: t('step2.relationships.partner') },
    { value: 'child', label: t('step2.relationships.child') },
    { value: 'sibling', label: t('step2.relationships.sibling') },
    { value: 'friend', label: t('step2.relationships.friend') },
    { value: 'other', label: t('step2.relationships.other') },
  ]

  return (
    <WizardLayout
      currentStep={2}
      totalSteps={8}
      onBack={() => { setStep(1); navigate('/wizard/step/1') }}
      onNext={handleSubmit(onSubmit)}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="step-card">
          <div className="flex items-start gap-2 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{t('step2.title')}</h1>
            <InfoIcon tooltip={t('step2.tooltip_trusted')} />
          </div>
          <p className="text-gray-600 mb-6">{t('step2.subtitle')}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label={t('step2.fullName')}
              {...register('fullName')}
              error={errors.fullName?.message}
              required
            />
            <FormSelect
              label={t('step2.relationship')}
              {...register('relationship')}
              error={errors.relationship?.message}
              options={relationshipOptions}
              required
            />
            <FormInput
              label={t('step2.streetAddress')}
              {...register('streetAddress')}
              error={errors.streetAddress?.message}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label={t('step2.postalCode')}
                {...register('postalCode')}
                error={errors.postalCode?.message}
                required
              />
              <FormInput
                label={t('step2.city')}
                {...register('city')}
                error={errors.city?.message}
                required
              />
            </div>
            <FormInput
              label={t('step2.phone')}
              type="tel"
              {...register('phone')}
              error={errors.phone?.message}
            />
            <FormInput
              label={t('step2.email')}
              type="email"
              {...register('email')}
              error={errors.email?.message}
            />
          </div>

          {/* Substitute person */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowSubstitute(!showSubstitute)}
              className="flex items-center gap-2 text-sm font-medium text-primary-700 hover:text-primary-800 transition-colors"
            >
              <span className="text-lg">{showSubstitute ? '−' : '+'}</span>
              <span className="flex items-center gap-1">
                {t('step2.add_substitute')}
                <InfoIcon tooltip={t('step2.tooltip_substitute')} />
              </span>
            </button>

            {showSubstitute && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-fade-in">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">{t('step2.substitute_title')}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label={t('step2.fullName')}
                    {...register('substituteFullName')}
                    error={errors.substituteFullName?.message}
                  />
                  <FormSelect
                    label={t('step2.relationship')}
                    {...register('substituteRelationship')}
                    error={errors.substituteRelationship?.message}
                    options={relationshipOptions}
                  />
                  <FormInput
                    label={t('step2.streetAddress')}
                    {...register('substituteStreetAddress')}
                    error={errors.substituteStreetAddress?.message}
                  />
                  <FormInput
                    label={t('step2.phone')}
                    type="tel"
                    {...register('substitutePhone')}
                    error={errors.substitutePhone?.message}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </WizardLayout>
  )
}
