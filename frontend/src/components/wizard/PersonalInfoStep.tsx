import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personalInfoSchema } from '../../schemas/wizard';
import type { PersonalInfo } from '../../types/wizard';
import { useWizardStore } from '../../store/wizardStore';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { WizardNav } from './WizardNav';

export function PersonalInfoStep() {
  const { t } = useTranslation();
  const { data, setPersonalInfo, nextStep, prevStep } = useWizardStore();

  const { register, handleSubmit, formState: { errors } } = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: data.personalInfo,
  });

  const onSubmit = (values: PersonalInfo) => {
    setPersonalInfo(values);
    nextStep();
  };

  const getError = (field: keyof PersonalInfo) => {
    const err = errors[field];
    return err?.message ? t(`validation.${err.message}`) : undefined;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-primary-500">{t('personalInfo.title')}</h2>
        <p className="text-gray-600">{t('personalInfo.subtitle')}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
        <Select
          label={t('personalInfo.salutation')}
          options={[
            { value: 'herr', label: t('personalInfo.salutations.herr') },
            { value: 'frau', label: t('personalInfo.salutations.frau') },
            { value: 'divers', label: t('personalInfo.salutations.divers') },
          ]}
          error={getError('salutation')}
          {...register('salutation')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t('personalInfo.firstName')}
            error={getError('firstName')}
            {...register('firstName')}
          />
          <Input
            label={t('personalInfo.lastName')}
            error={getError('lastName')}
            {...register('lastName')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t('personalInfo.dateOfBirth')}
            type="date"
            error={getError('dateOfBirth')}
            {...register('dateOfBirth')}
          />
          <Input
            label={t('personalInfo.placeOfBirth')}
            error={getError('placeOfBirth')}
            {...register('placeOfBirth')}
          />
        </div>

        <Input
          label={t('personalInfo.street')}
          error={getError('street')}
          {...register('street')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t('personalInfo.postalCode')}
            maxLength={5}
            error={getError('postalCode')}
            {...register('postalCode')}
          />
          <Input
            label={t('personalInfo.city')}
            error={getError('city')}
            {...register('city')}
          />
        </div>

        <Input
          label={t('personalInfo.phone')}
          type="tel"
          error={getError('phone')}
          {...register('phone')}
        />
      </div>

      <WizardNav onBack={prevStep} />
    </form>
  );
}
