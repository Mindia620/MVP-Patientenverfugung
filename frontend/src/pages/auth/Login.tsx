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
  password: z.string().min(1, 'Passwort ist erforderlich'),
})

type FormData = z.infer<typeof schema>

export function Login() {
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
      const res = await authApi.login(data.email, data.password)
      setUser(res.data.user)
      navigate('/dashboard')
    } catch {
      setServerError(t('auth.errors.invalid_credentials'))
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
            <h1 className="text-2xl font-bold text-gray-900">{t('auth.login_title')}</h1>
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
                autoComplete="current-password"
                required
              />

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
                {isLoading ? 'Wird angemeldet...' : t('auth.login_cta')}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
              {t('auth.no_account')}{' '}
              <Link to="/auth/register" className="text-primary-600 font-medium hover:underline">
                {t('nav.register')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
