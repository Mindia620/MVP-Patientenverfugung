import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { saveDocument } from '../lib/api'
import type { Answers } from '../types'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Mindestens 8 Zeichen'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwörter stimmen nicht überein',
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

export function AuthPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { register: authRegister } = useAuth()
  const [error, setError] = useState('')

  const answers = (location.state as { answers?: Answers })?.answers

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setError('')
    try {
      await authRegister(data.email, data.password)
      if (answers) {
        await saveDocument(answers)
      }
      navigate('/wizard/generate', { state: { answers } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    }
  }

  const handleSkip = () => {
    if (answers) {
      navigate('/wizard/generate', { state: { answers } })
    }
  }

  if (!answers) {
    navigate('/wizard')
    return null
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h2 className="text-xl font-semibold text-slate-800">{t('auth.createAccount')}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.email')}</label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.password')}</label>
          <input
            type="password"
            {...register('password')}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.confirmPassword')}</label>
          <input
            type="password"
            {...register('confirmPassword')}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          {t('auth.register')}
        </button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={handleSkip}
          className="text-sm text-slate-600 hover:underline"
        >
          {t('auth.skipSave')}
        </button>
      </div>
    </div>
  )
}
