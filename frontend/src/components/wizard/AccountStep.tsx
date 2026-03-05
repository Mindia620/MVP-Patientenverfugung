import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useWizardStore } from '../../store/wizardStore';
import { useAuthStore } from '../../store/authStore';
import { api, ApiError } from '../../lib/api';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { WizardNav } from './WizardNav';
import { AlertTriangle } from 'lucide-react';

const registerSchema = z.object({
  email: z.string().email('emailInvalid'),
  password: z.string().min(8, 'passwordMin'),
  confirmPassword: z.string(),
  acceptPrivacy: z.literal(true),
  acceptTerms: z.literal(true),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'passwordMismatch',
  path: ['confirmPassword'],
});

const loginSchema = z.object({
  email: z.string().email('emailInvalid'),
  password: z.string().min(1, 'required'),
});

type RegisterForm = z.infer<typeof registerSchema>;
type LoginForm = z.infer<typeof loginSchema>;

export function AccountStep() {
  const { t } = useTranslation();
  const { nextStep, prevStep, data } = useWizardStore();
  const { user, setUser } = useAuthStore();
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const regForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '', acceptPrivacy: false as any, acceptTerms: false as any },
  });

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const saveAndContinue = async () => {
    try {
      await api.documents.save(data);
    } catch {
      // non-critical; documents can be re-saved later
    }
    nextStep();
  };

  if (user) {
    saveAndContinue();
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">{t('common.loading')}</p>
      </div>
    );
  }

  const onRegister = async (values: RegisterForm) => {
    setError('');
    setLoading(true);
    try {
      const res = await api.auth.register(values.email, values.password);
      setUser(res.user);
      await saveAndContinue();
    } catch (e) {
      if (e instanceof ApiError) setError(e.message);
      else setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const onLogin = async (values: LoginForm) => {
    setError('');
    setLoading(true);
    try {
      const res = await api.auth.login(values.email, values.password);
      setUser(res.user);
      await saveAndContinue();
    } catch (e) {
      if (e instanceof ApiError) setError(e.message);
      else setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const getRegError = (field: keyof RegisterForm) => {
    const err = regForm.formState.errors[field];
    return err?.message ? t(`validation.${err.message}`) : undefined;
  };

  const getLoginError = (field: keyof LoginForm) => {
    const err = loginForm.formState.errors[field];
    return err?.message ? t(`validation.${err.message}`) : undefined;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-primary-500">
          {mode === 'register' ? t('account.title') : t('account.loginTitle')}
        </h2>
        <p className="text-gray-600">
          {mode === 'register' ? t('account.subtitle') : t('account.loginSubtitle')}
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-3 rounded-lg">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {mode === 'register' ? (
        <form onSubmit={regForm.handleSubmit(onRegister)} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
          <Input label={t('account.email')} type="email" error={getRegError('email')} {...regForm.register('email')} />
          <Input label={t('account.password')} type="password" hint={t('account.passwordHint')} error={getRegError('password')} {...regForm.register('password')} />
          <Input label={t('account.confirmPassword')} type="password" error={getRegError('confirmPassword')} {...regForm.register('confirmPassword')} />

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded" {...regForm.register('acceptPrivacy')} />
            <span className="text-sm text-gray-700">{t('account.acceptPrivacy')}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded" {...regForm.register('acceptTerms')} />
            <span className="text-sm text-gray-700">{t('account.acceptTerms')}</span>
          </label>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t('common.loading') : t('account.register')}
          </Button>

          <p className="text-center text-sm text-gray-500">
            {t('account.switchToLogin')}{' '}
            <button type="button" onClick={() => setMode('login')} className="text-primary-500 hover:underline">
              {t('account.login')}
            </button>
          </p>
        </form>
      ) : (
        <form onSubmit={loginForm.handleSubmit(onLogin)} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
          <Input label={t('account.email')} type="email" error={getLoginError('email')} {...loginForm.register('email')} />
          <Input label={t('account.password')} type="password" error={getLoginError('password')} {...loginForm.register('password')} />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t('common.loading') : t('account.login')}
          </Button>

          <p className="text-center text-sm text-gray-500">
            {t('account.switchToRegister')}{' '}
            <button type="button" onClick={() => setMode('register')} className="text-primary-500 hover:underline">
              {t('account.register')}
            </button>
          </p>
        </form>
      )}

      <WizardNav onBack={prevStep} showBack={true} nextType="button" onNext={undefined} nextLabel="" />
    </div>
  );
}
