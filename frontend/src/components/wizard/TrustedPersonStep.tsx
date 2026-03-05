import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { trustedPersonStepSchema } from '../../schemas/wizard';
import type { TrustedPersonStep as TrustedPersonStepType } from '../../types/wizard';
import { useWizardStore } from '../../store/wizardStore';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { WizardNav } from './WizardNav';
import { UserPlus, UserMinus, HelpCircle } from 'lucide-react';
import { useState } from 'react';

function PersonForm({
  prefix,
  register,
  errors,
  t,
}: {
  prefix: string;
  register: any;
  errors: any;
  t: any;
}) {
  const getError = (field: string) => {
    const parts = prefix ? [...prefix.split('.'), field] : [field];
    let err: any = errors;
    for (const p of parts) err = err?.[p];
    return err?.message ? t(`validation.${err.message}`) : undefined;
  };

  const relationshipOptions = [
    { value: 'ehepartner', label: t('trustedPerson.relationships.ehepartner') },
    { value: 'kind', label: t('trustedPerson.relationships.kind') },
    { value: 'elternteil', label: t('trustedPerson.relationships.elternteil') },
    { value: 'freund', label: t('trustedPerson.relationships.freund') },
    { value: 'sonstige', label: t('trustedPerson.relationships.sonstige') },
  ];

  const p = prefix ? `${prefix}.` : '';

  return (
    <div className="space-y-4">
      <Select
        label={t('personalInfo.salutation')}
        options={[
          { value: 'herr', label: t('personalInfo.salutations.herr') },
          { value: 'frau', label: t('personalInfo.salutations.frau') },
          { value: 'divers', label: t('personalInfo.salutations.divers') },
        ]}
        error={getError('salutation')}
        {...register(`${p}salutation`)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label={t('personalInfo.firstName')} error={getError('firstName')} {...register(`${p}firstName`)} />
        <Input label={t('personalInfo.lastName')} error={getError('lastName')} {...register(`${p}lastName`)} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label={t('personalInfo.dateOfBirth')} type="date" error={getError('dateOfBirth')} {...register(`${p}dateOfBirth`)} />
        <Select label={t('trustedPerson.relationship')} options={relationshipOptions} error={getError('relationship')} {...register(`${p}relationship`)} />
      </div>
      <Input label={t('personalInfo.street')} error={getError('street')} {...register(`${p}street`)} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label={t('personalInfo.postalCode')} maxLength={5} error={getError('postalCode')} {...register(`${p}postalCode`)} />
        <Input label={t('personalInfo.city')} error={getError('city')} {...register(`${p}city`)} />
      </div>
      <Input label={t('personalInfo.phone')} type="tel" error={getError('phone')} {...register(`${p}phone`)} />
    </div>
  );
}

export function TrustedPersonStep() {
  const { t } = useTranslation();
  const { data, setTrustedPersonStep, nextStep, prevStep } = useWizardStore();
  const [showWhyAlternate, setShowWhyAlternate] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<TrustedPersonStepType>({
    resolver: zodResolver(trustedPersonStepSchema),
    defaultValues: data.trustedPersonStep,
  });

  const hasAlternate = watch('hasAlternatePerson');

  const onSubmit = (values: TrustedPersonStepType) => {
    if (!values.hasAlternatePerson) {
      values.alternatePerson = undefined;
    }
    setTrustedPersonStep(values);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-primary-500">{t('trustedPerson.title')}</h2>
        <p className="text-gray-600">{t('trustedPerson.subtitle')}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <PersonForm prefix="trustedPerson" register={register} errors={errors} t={t} />
      </div>

      <div className="flex items-center gap-3">
        {!hasAlternate ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setValue('hasAlternatePerson', true)}
          >
            <UserPlus size={16} className="mr-1" />
            {t('trustedPerson.addAlternate')}
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setValue('hasAlternatePerson', false)}
          >
            <UserMinus size={16} className="mr-1" />
            {t('trustedPerson.removeAlternate')}
          </Button>
        )}
        <button
          type="button"
          onClick={() => setShowWhyAlternate(!showWhyAlternate)}
          className="text-sm text-gray-500 hover:text-primary-500 flex items-center gap-1"
        >
          <HelpCircle size={14} />
          {t('trustedPerson.whyAlternate')}
        </button>
      </div>

      {showWhyAlternate && (
        <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          {t('trustedPerson.whyAlternateText')}
        </p>
      )}

      {hasAlternate && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-primary-500 mb-1">{t('trustedPerson.alternateTitle')}</h3>
          <p className="text-sm text-gray-500 mb-4">{t('trustedPerson.alternateHint')}</p>
          <PersonForm prefix="alternatePerson" register={register} errors={errors} t={t} />
        </div>
      )}

      <WizardNav onBack={prevStep} />
    </form>
  );
}
