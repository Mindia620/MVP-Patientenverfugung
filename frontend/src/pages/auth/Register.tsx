import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../../lib/api'
import { useAuthStore } from '../../store/authStore'
import { PageLayout } from '../../components/layout/PageLayout'
import { FormInput } from '../../components/ui/FormField'
import { ShieldIcon } from '../../components/ui/Icons'

const schema = z.object({
  email: z.string().email('Bitte geben Sie eine gültige E-Mail ein'),
  password: z.string().min(8, 'Das Passwort muss mindestens 8 Zeichen lang sein'),
  passwordConfirm: z.string(),
  consent: z.literal(true).refine((val) => val === true, { message: 'Bitte stimmen Sie der Datenschutzerklärung zu' }),
}).refine((d) => d.password === d.passwordConfirm, {
  message: 'Die Passwörter stimmen nicht überein',
  path: ['passwordConfirm'],
})

type FormData = z.infer<typeof schema>

export function Register() {
  const { t } = useTranslation()
  const navigate = useNavigate()
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
      navigate('/dashboard')
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

  return (
    <PageLayout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <ShieldIcon className="w-12 h-12 text-primary-700 mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-gray-900">{t('auth.register_title')}</h1>
          </div>

          <div className="card p-8">
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              <FormInput
                label={t('auth.email')}
                type="email"
                {...register('email')}
                error={errors.email?.message}
                autoComplete="email"
                required
              />
              <FormInput
                label={t('auth.password')}
                type="password"
                {...register('password')}
                error={errors.password?.message}
                autoComplete="new-password"
                hint="Mindestens 8 Zeichen"
                required
              />
              <FormInput
                label="Passwort wiederholen"
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
                  Ich stimme der{' '}
                  <Link to="/privacy" target="_blank" className="text-primary-600 underline">
                    Datenschutzerklärung
                  </Link>{' '}
                  zu
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
                className="btn-primary w-full py-3 text-base"
                disabled={isLoading}
              >
                {isLoading ? 'Wird erstellt...' : t('auth.register_cta')}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
              {t('auth.have_account')}{' '}
              <Link to="/auth/login" className="text-primary-600 font-medium hover:underline">
                {t('nav.login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
