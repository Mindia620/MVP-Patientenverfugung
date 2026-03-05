import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Eye, EyeOff } from 'lucide-react'
import { registerSchema, type RegisterFormData } from '@/lib/validation'
import { useWizardStore } from '@/store/wizardStore'
import { useAuthStore } from '@/store/authStore'
import { authApi, packagesApi } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import type { WizardAnswers } from '@/types'

function passwordStrength(pwd: string): { level: number; label: string; color: string } {
  if (pwd.length < 6) return { level: 0, label: 'weak', color: 'bg-red-400' }
  if (pwd.length < 10) return { level: 1, label: 'fair', color: 'bg-amber-400' }
  if (!/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) return { level: 2, label: 'good', color: 'bg-yellow-400' }
  return { level: 3, label: 'strong', color: 'bg-emerald-500' }
}

export function StepRegister() {
  const { t } = useTranslation()
  const { answers, setSavedPackageId, nextStep, prevStep } = useWizardStore()
  const { setUser } = useAuthStore()
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const s = t('wizard.step7', { returnObjects: true }) as Record<string, unknown>
  const e = t('errors', { returnObjects: true }) as Record<string, string>
  const strengthLabels = s.passwordStrength as Record<string, string>

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      acceptPrivacy: false,
      acceptTerms: false,
    },
  })

  const pwd = watch('password') ?? ''
  const strength = passwordStrength(pwd)

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null)
    try {
      const regRes = await authApi.register({ email: data.email, password: data.password })
      setUser(regRes.data.user)

      const pkgRes = await packagesApi.create(answers as WizardAnswers)
      setSavedPackageId(pkgRes.data.package.id)

      nextStep()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setServerError(msg ?? e.serverError)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto space-y-6" noValidate>
      <div>
        <h2 className="text-xl font-bold text-slate-900">{s.title as string}</h2>
        <p className="text-sm text-slate-500 mt-1">{s.desc as string}</p>
      </div>

      {serverError && (
        <div role="alert" className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <div className="space-y-4">
        <Input
          label={s.email as string}
          type="email"
          required
          autoComplete="email"
          error={errors.email && (e[errors.email.message as string] ?? errors.email.message)}
          {...register('email')}
        />

        <div className="space-y-1.5">
          <Input
            label={s.password as string}
            type={showPwd ? 'text' : 'password'}
            required
            autoComplete="new-password"
            hint={s.minChars as string}
            error={errors.password && (e[errors.password.message as string] ?? errors.password.message)}
            rightElement={
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPwd(v => !v)}
                aria-label={showPwd ? 'Hide password' : 'Show password'}
                className="text-slate-400 hover:text-slate-600"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            {...register('password')}
          />
          {pwd.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${strength.color}`}
                  style={{ width: `${((strength.level + 1) / 4) * 100}%` }}
                />
              </div>
              <span className="text-xs text-slate-500">{strengthLabels[strength.label]}</span>
            </div>
          )}
        </div>

        <Input
          label={s.confirmPassword as string}
          type={showConfirm ? 'text' : 'password'}
          required
          autoComplete="new-password"
          error={errors.confirmPassword && (e[errors.confirmPassword.message as string] ?? errors.confirmPassword.message)}
          rightElement={
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowConfirm(v => !v)}
              aria-label="Toggle confirm password visibility"
              className="text-slate-400 hover:text-slate-600"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
          {...register('confirmPassword')}
        />
      </div>

      <div className="space-y-3 pt-1">
        <Checkbox
          label={
            <span>
              {(s.acceptPrivacy as string).split('Datenschutzerklärung')[0]}
              <a href="/datenschutz" className="underline text-sky-600 hover:text-sky-700" target="_blank" rel="noopener noreferrer">
                Datenschutzerklärung
              </a>
              {(s.acceptPrivacy as string).split('Datenschutzerklärung')[1]}
            </span>
          }
          error={errors.acceptPrivacy && (e[errors.acceptPrivacy.message as string] ?? errors.acceptPrivacy.message)}
          {...register('acceptPrivacy')}
        />
        <Checkbox
          label={s.acceptTerms as string}
          error={errors.acceptTerms && (e[errors.acceptTerms.message as string] ?? errors.acceptTerms.message)}
          {...register('acceptTerms')}
        />
        <Checkbox
          label={s.emailReminders as string}
          {...register('emailReminders' as keyof RegisterFormData)}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={prevStep} className="flex-1 sm:flex-none sm:w-32">
          {t('wizard.back')}
        </Button>
        <Button type="submit" loading={isSubmitting} className="flex-1">
          {s.registerCta as string}
        </Button>
      </div>

      <p className="text-center text-sm text-slate-500">
        {s.alreadyHaveAccount as string}{' '}
        <a href="/login" className="text-sky-600 hover:text-sky-700 font-medium">
          {s.loginLink as string}
        </a>
      </p>
    </form>
  )
}
