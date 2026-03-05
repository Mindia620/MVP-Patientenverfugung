import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { valuesAndWishesSchema } from '../../schemas/wizard';
import type { ValuesAndWishes } from '../../types/wizard';
import { useWizardStore } from '../../store/wizardStore';
import { Select } from '../ui/Select';
import { WizardNav } from './WizardNav';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export function ValuesWishesStep() {
  const { t } = useTranslation();
  const { data, setValuesAndWishes, nextStep, prevStep } = useWizardStore();
  const [showExamples, setShowExamples] = useState(false);

  const { register, handleSubmit } = useForm<ValuesAndWishes>({
    resolver: zodResolver(valuesAndWishesSchema),
    defaultValues: data.valuesAndWishes,
  });

  const onSubmit = (values: ValuesAndWishes) => {
    setValuesAndWishes(values);
    nextStep();
  };

  const examples = t('valuesWishes.exampleTexts', { returnObjects: true }) as string[];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-primary-500">
          {t('valuesWishes.title')} <span className="text-base font-normal text-gray-400">{t('valuesWishes.optional')}</span>
        </h2>
        <p className="text-gray-600">{t('valuesWishes.subtitle')}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5 shadow-sm">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            {t('valuesWishes.personalValues')}
          </label>
          <textarea
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 min-h-[100px]"
            placeholder={t('valuesWishes.personalValuesPlaceholder')}
            maxLength={2000}
            {...register('personalValues')}
          />
        </div>

        <button
          type="button"
          onClick={() => setShowExamples(!showExamples)}
          className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1"
        >
          {showExamples ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {t('valuesWishes.examples')}
        </button>
        {showExamples && (
          <ul className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg space-y-1">
            {examples.map((ex, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary-400 mt-0.5">•</span>
                <span>{ex}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            {t('valuesWishes.religiousWishes')}
          </label>
          <textarea
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 min-h-[80px]"
            placeholder={t('valuesWishes.religiousWishesPlaceholder')}
            maxLength={1000}
            {...register('religiousWishes')}
          />
        </div>

        <Select
          label={t('valuesWishes.organDonation')}
          options={[
            { value: '', label: '—' },
            { value: 'yes', label: t('valuesWishes.organDonationOptions.yes') },
            { value: 'no', label: t('valuesWishes.organDonationOptions.no') },
            { value: 'restricted', label: t('valuesWishes.organDonationOptions.restricted') },
          ]}
          {...register('organDonation')}
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            {t('valuesWishes.burialWishes')}
          </label>
          <textarea
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 min-h-[80px]"
            placeholder={t('valuesWishes.burialWishesPlaceholder')}
            maxLength={1000}
            {...register('burialWishes')}
          />
        </div>
      </div>

      <WizardNav onBack={prevStep} />
    </form>
  );
}
