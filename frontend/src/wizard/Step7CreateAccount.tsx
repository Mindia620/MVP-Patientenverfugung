import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { WizardAnswers } from '../types/wizard';
import { WIZARD_VERSION } from '../types/wizard';

export function Step7CreateAccount() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getValues } = useFormContext<WizardAnswers>();
  const [mode, setMode] = useState<'create' | 'login'>('create');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'create' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      const endpoint = mode === 'create' ? '/api/auth/register' : '/api/auth/login';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || 'An error occurred');
        return;
      }

      const answers = getValues();
      const saveRes = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ wizardVersion: WIZARD_VERSION, answers }),
      });

      let packageId: string | null = null;
      if (saveRes.ok) {
        const data = await saveRes.json().catch(() => ({}));
        packageId = data.id || null;
      }

      navigate('/wizard/8', { state: { packageId } });
    } catch {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-slate-600">{t('wizard.step7.description')}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            {t('wizard.step7.email')} *
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            {t('wizard.step7.password')} *
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        {mode === 'create' && (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
              {t('wizard.step7.confirmPassword')} *
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-lg bg-teal-600 px-6 py-3 font-semibold text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          {mode === 'create' ? t('wizard.step7.createAccount') : t('wizard.step7.login')}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setMode(mode === 'create' ? 'login' : 'create')}
        className="text-sm text-teal-600 hover:underline"
      >
        {mode === 'create' ? t('wizard.step7.alreadyRegistered') : t('wizard.step7.createAccount')}
      </button>
    </div>
  );
}
