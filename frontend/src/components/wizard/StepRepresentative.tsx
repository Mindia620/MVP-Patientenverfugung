import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Plus, Minus } from 'lucide-react'
import { representativeSchema, type RepresentativeFormData } from '@/lib/validation'
import { useWizardStore } from '@/store/wizardStore'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Tooltip } from '@/components/ui/Tooltip'

function RepresentativeFields({
  register,
  errors,
  prefix,
}: {
  register: ReturnType<typeof useForm<RepresentativeFormData>>['register']
  errors: ReturnType<typeof useForm<RepresentativeFormData>>['formState']['errors']
  prefix?: string
}) {
  const { t } = useTranslation()
  const s = t('wizard.step2', { returnObjects: true }) as Record<string, unknown>
  const e = t('errors', { returnObjects: true }) as Record<string, string>

  const rels = s.relationships as Record<string, string>
  const relationshipOptions = [
    { value: '', label: '– Bitte wählen –' },
    { value: 'spouse', label: rels.spouse },
    { value: 'child', label: rels.child },
    { value: 'sibling', label: rels.sibling },
    { value: 'friend', label: rels.friend },
    { value: 'other', label: rels.other },
  ]

  void prefix

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={t('wizard.step1.firstName')}
          required
          error={errors.firstName && e[errors.firstName.message as string]}
          {...register('firstName')}
        />
        <Input
          label={t('wizard.step1.lastName')}
          required
          error={errors.lastName && e[errors.lastName.message as string]}
          {...register('lastName')}
        />
      </div>
      <Select
        label={s.relationship as string}
        required
        options={relationshipOptions}
        error={errors.relationship && e[errors.relationship.message as string]}
        {...register('relationship')}
      />
      <Input
        label={t('wizard.step1.street')}
        required
        error={errors.street && e[errors.street.message as string]}
        {...register('street')}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={t('wizard.step1.postalCode')}
          required
          maxLength={5}
          error={errors.postalCode && e[errors.postalCode.message as string]}
          {...register('postalCode')}
        />
        <Input
          label={t('wizard.step1.city')}
          required
          error={errors.city && e[errors.city.message as string]}
          {...register('city')}
        />
      </div>
      <Input
        label={s.phone as string}
        type="tel"
        autoComplete="tel"
        {...register('phone')}
      />
    </div>
  )
}

export function StepRepresentative() {
  const { t } = useTranslation()
  const { answers, setRepresentative, setSubstituteRepresentative, nextStep, prevStep } = useWizardStore()
  const [showSubstitute, setShowSubstitute] = useState(!!answers.substituteRepresentative)

  const s = t('wizard.step2', { returnObjects: true }) as Record<string, string>

  const primaryForm = useForm<RepresentativeFormData>({
    resolver: zodResolver(representativeSchema),
    defaultValues: answers.representative,
  })

  const substituteForm = useForm<RepresentativeFormData>({
    resolver: zodResolver(representativeSchema),
    defaultValues: answers.substituteRepresentative,
  })

  const handleSubmit = primaryForm.handleSubmit(async (primaryData) => {
    setRepresentative(primaryData)

    if (showSubstitute) {
      const valid = await substituteForm.trigger()
      if (!valid) return
      const subData = substituteForm.getValues()
      setSubstituteRepresentative(subData)
    } else {
      setSubstituteRepresentative(undefined)
    }

    nextStep()
  })

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-slate-900">{s.title}</h2>
          <Tooltip content={s.whyTooltip} />
        </div>
        <p className="text-sm text-slate-500 mt-1">{s.desc}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="bg-sky-50 border border-sky-100 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">
            {t('wizard.step2.title')} (1)
          </h3>
          <RepresentativeFields
            register={primaryForm.register}
            errors={primaryForm.formState.errors}
          />
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowSubstitute(v => !v)}
            className="flex items-center gap-2 text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors"
          >
            {showSubstitute ? <Minus size={16} /> : <Plus size={16} />}
            {s.addSubstitute}
          </button>
        </div>

        {showSubstitute && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-1">{s.substituteTitle}</h3>
            <p className="text-xs text-slate-500 mb-4">{s.substituteDesc}</p>
            <RepresentativeFields
              register={substituteForm.register}
              errors={substituteForm.formState.errors}
              prefix="substitute"
            />
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={prevStep} className="flex-1 sm:flex-none sm:w-32">
            {t('wizard.back')}
          </Button>
          <Button type="submit" className="flex-1">
            {t('wizard.continue')}
          </Button>
        </div>
      </form>
    </div>
  )
}
