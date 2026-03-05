import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { loginSchema, type LoginFormData } from '@/lib/validation'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'

export function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setUser } = useAuthStore()
  const [showPwd, setShowPwd] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null)
    try {
      const res = await authApi.login(data)
      setUser(res.data.user)
      navigate('/dashboard')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      setServerError(msg ?? t('errors.serverError'))
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-sky-600 mb-4">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{t('auth.loginTitle')}</h1>
        </div>

        <Card>
          <CardContent className="space-y-4">
            {serverError && (
              <div role="alert" className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <Input
                label={t('auth.email')}
                type="email"
                required
                autoComplete="email"
                error={errors.email?.message && t(`errors.${errors.email.message}`, { defaultValue: errors.email.message })}
                {...register('email')}
              />

              <Input
                label={t('auth.password')}
                type={showPwd ? 'text' : 'password'}
                required
                autoComplete="current-password"
                error={errors.password?.message && t(`errors.${errors.password.message}`, { defaultValue: errors.password.message })}
                rightElement={
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPwd(v => !v)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                {...register('password')}
              />

              <Button type="submit" loading={isSubmitting} className="w-full">
                {t('auth.loginCta')}
              </Button>
            </form>

            <p className="text-center text-sm text-slate-500">
              {t('auth.noAccount')}{' '}
              <Link to="/register" className="text-sky-600 hover:text-sky-700 font-medium">
                {t('auth.registerLink')}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
