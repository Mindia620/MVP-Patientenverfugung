import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { useNavigate, Link } from 'react-router-dom'
import { useWizardStore } from '../../store/wizardStore'
import { useAuthStore } from '../../store/authStore'
import { authApi } from '../../lib/api'
import { WizardLayout } from '../../components/wizard/WizardLayout'
import { FormInput } from '../../components/ui/FormField'
import { CheckIcon } from '../../components/ui/Icons'

const schema = z.object({
  email: z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein'),
  password: z.string().min(8, 'Das Passwort muss mindestens 8 Zeichen lang sein'),
  passwordConfirm: z.string(),
  consent: z.literal(true).refine((val) => val === true, { message: 'Bitte stimmen Sie der Datenschutzerklärung zu' }),
}).refine((d) => d.password === d.passwordConfirm, {
  message: 'Die Passwörter stimmen nicht überein',
  path: ['passwordConfirm'],
})

type FormData = z.infer<typeof schema>

export function Step7Account() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setStep } = useWizardStore()
  const { setUser } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setServerError('')
    try {
      const res = await authApi.register(data.email, data.password)
      setUser(res.data.user)
      setStep(8)
      navigate('/wizard/step/8')
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number } }
      if (axiosErr?.response?.status === 409) {
        setServerError(t('auth.errors.email_taken'))
      } else {
        setServerError(t('auth.errors.server_error'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnonymous = () => {
    setStep(8)
    navigate('/wizard/step/8')
  }

  const benefits = [
    t('step7.benefits.save'),
    t('step7.benefits.edit'),
    t('step7.benefits.access'),
  ]

  return (
    <WizardLayout
      currentStep={7}
      totalSteps={8}
      onBack={() => { setStep(6); navigate('/wizard/step/6') }}
      hideNav
    >
      <div className="step-card">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{t('step7.title')}</h1>
        <p className="text-gray-600 mb-4">{t('step7.subtitle')}</p>

        {/* Benefits */}
        <ul className="mb-6 space-y-2">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-center gap-2 text-sm text-gray-700">
              <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <CheckIcon className="w-3 h-3 text-green-600" />
              </span>
              {benefit}
            </li>
          ))}
        </ul>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <FormInput
            label={t('step7.email')}
            type="email"
            {...register('email')}
            error={errors.email?.message}
            autoComplete="email"
            required
          />
          <FormInput
            label={t('step7.password')}
            type="password"
            {...register('password')}
            error={errors.password?.message}
            autoComplete="new-password"
            hint={t('step7.password_hint')}
            required
          />
          <FormInput
            label={t('step7.password_confirm')}
            type="password"
            {...register('passwordConfirm')}
            error={errors.passwordConfirm?.message}
            autoComplete="new-password"
            required
          />

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register('consent')}
              className="mt-0.5 w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer shrink-0"
            />
            <span className="text-sm text-gray-700">
              {t('step7.consent')}{' '}
              <Link to="/privacy" target="_blank" className="text-primary-600 underline">
                Datenschutzerklärung
              </Link>
            </span>
          </label>
          {errors.consent && (
            <p className="input-error">{errors.consent.message}</p>
          )}

          {serverError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full text-base py-3"
            disabled={isLoading}
          >
            {isLoading ? 'Wird erstellt...' : t('step7.cta_create')}
          </button>
        </form>

        <div className="mt-4 text-center">
          <span className="text-gray-400 text-sm">— oder —</span>
        </div>

        <button
          type="button"
          onClick={handleAnonymous}
          className="mt-3 w-full btn-secondary"
        >
          {t('step7.cta_anonymous')}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          {t('step7.already_have_account')}{' '}
          <Link to="/auth/login" className="text-primary-600 font-medium hover:underline">
            {t('step7.login')}
          </Link>
        </p>
      </div>
    </WizardLayout>
  )
}
