import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { summaryConfirmSchema } from '../../schemas/wizard';
import { useWizardStore } from '../../store/wizardStore';
import { WizardNav } from './WizardNav';
import { Edit3, AlertTriangle } from 'lucide-react';

function SectionCard({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="font-semibold text-primary-600">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1"
        >
          <Edit3 size={14} />
          {t('summary.edit')}
        </button>
      </div>
      <div className="px-5 py-4 text-sm text-gray-700 space-y-1">
        {children}
      </div>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value?: string | boolean | null }) {
  if (value === undefined || value === null || value === '') return null;
  const display = typeof value === 'boolean' ? (value ? 'Ja' : 'Nein') : value;
  return (
    <div className="flex justify-between py-0.5">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-right">{display}</span>
    </div>
  );
}

export function SummaryStep() {
  const { t } = useTranslation();
  const { data, setConfirmed, setStep, nextStep, prevStep } = useWizardStore();
  const { personalInfo, trustedPersonStep, medicalPreferences, situationalScenarios, valuesAndWishes } = data;

  const { register, handleSubmit, formState: { errors } } = useForm<{ confirmed: true }>({
    resolver: zodResolver(summaryConfirmSchema) as any,
    defaultValues: { confirmed: data.confirmed || undefined },
  });

  const onSubmit = () => {
    setConfirmed(true);
    nextStep();
  };

  const treatmentLabel = (v: string) => t(`medicalPreferences.options.${v}`);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 animate-fade-in">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-primary-500">{t('summary.title')}</h2>
        <p className="text-gray-600">{t('summary.subtitle')}</p>
      </div>

      <SectionCard title={t('summary.sections.personalInfo')} onEdit={() => setStep('personal-info')}>
        <DataRow label={t('personalInfo.salutation')} value={t(`personalInfo.salutations.${personalInfo.salutation}`)} />
        <DataRow label={t('personalInfo.firstName')} value={personalInfo.firstName} />
        <DataRow label={t('personalInfo.lastName')} value={personalInfo.lastName} />
        <DataRow label={t('personalInfo.dateOfBirth')} value={personalInfo.dateOfBirth} />
        <DataRow label={t('personalInfo.placeOfBirth')} value={personalInfo.placeOfBirth} />
        <DataRow label={t('personalInfo.street')} value={personalInfo.street} />
        <DataRow label={t('personalInfo.postalCode')} value={`${personalInfo.postalCode} ${personalInfo.city}`} />
      </SectionCard>

      <SectionCard title={t('summary.sections.trustedPerson')} onEdit={() => setStep('trusted-person')}>
        <DataRow label={t('personalInfo.firstName')} value={trustedPersonStep.trustedPerson.firstName} />
        <DataRow label={t('personalInfo.lastName')} value={trustedPersonStep.trustedPerson.lastName} />
        <DataRow label={t('trustedPerson.relationship')} value={t(`trustedPerson.relationships.${trustedPersonStep.trustedPerson.relationship}`)} />
        <DataRow label={t('personalInfo.phone')} value={trustedPersonStep.trustedPerson.phone} />
        <DataRow label={t('personalInfo.city')} value={`${trustedPersonStep.trustedPerson.postalCode} ${trustedPersonStep.trustedPerson.city}`} />
      </SectionCard>

      {trustedPersonStep.hasAlternatePerson && trustedPersonStep.alternatePerson && (
        <SectionCard title={t('summary.sections.alternatePerson')} onEdit={() => setStep('trusted-person')}>
          <DataRow label={t('personalInfo.firstName')} value={trustedPersonStep.alternatePerson.firstName} />
          <DataRow label={t('personalInfo.lastName')} value={trustedPersonStep.alternatePerson.lastName} />
          <DataRow label={t('trustedPerson.relationship')} value={t(`trustedPerson.relationships.${trustedPersonStep.alternatePerson.relationship}`)} />
          <DataRow label={t('personalInfo.phone')} value={trustedPersonStep.alternatePerson.phone} />
        </SectionCard>
      )}

      <SectionCard title={t('summary.sections.medicalPreferences')} onEdit={() => setStep('medical-preferences')}>
        <DataRow label={t('medicalPreferences.cpr.title')} value={treatmentLabel(medicalPreferences.cpr)} />
        <DataRow label={t('medicalPreferences.ventilation.title')} value={treatmentLabel(medicalPreferences.ventilation)} />
        <DataRow label={t('medicalPreferences.artificialNutrition.title')} value={treatmentLabel(medicalPreferences.artificialNutrition)} />
        <DataRow label={t('medicalPreferences.dialysis.title')} value={treatmentLabel(medicalPreferences.dialysis)} />
        <DataRow label={t('medicalPreferences.antibiotics.title')} value={treatmentLabel(medicalPreferences.antibiotics)} />
        <DataRow label={t('medicalPreferences.painManagement.title')} value={treatmentLabel(medicalPreferences.painManagement)} />
      </SectionCard>

      <SectionCard title={t('summary.sections.situationalScenarios')} onEdit={() => setStep('situational-scenarios')}>
        <DataRow label={t('situationalScenarios.terminalIllness.title')} value={situationalScenarios.terminalIllness} />
        <DataRow label={t('situationalScenarios.irreversibleUnconsciousness.title')} value={situationalScenarios.irreversibleUnconsciousness} />
        <DataRow label={t('situationalScenarios.severeDementia.title')} value={situationalScenarios.severeDementia} />
      </SectionCard>

      <SectionCard title={t('summary.sections.valuesWishes')} onEdit={() => setStep('values-wishes')}>
        {valuesAndWishes.personalValues && <p>{valuesAndWishes.personalValues}</p>}
        {valuesAndWishes.religiousWishes && <p>{valuesAndWishes.religiousWishes}</p>}
        {valuesAndWishes.organDonation && (
          <DataRow label={t('valuesWishes.organDonation')} value={t(`valuesWishes.organDonationOptions.${valuesAndWishes.organDonation}`)} />
        )}
        {valuesAndWishes.burialWishes && <p>{valuesAndWishes.burialWishes}</p>}
        {!valuesAndWishes.personalValues && !valuesAndWishes.religiousWishes && !valuesAndWishes.organDonation && !valuesAndWishes.burialWishes && (
          <p className="text-gray-400 italic">—</p>
        )}
      </SectionCard>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-700">{t('summary.disclaimerReminder')}</p>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          className="mt-1 w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-300"
          {...register('confirmed')}
        />
        <span className="text-sm text-gray-700">{t('summary.confirm')}</span>
      </label>
      {errors.confirmed && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertTriangle size={14} />
          {t('validation.mustConfirm')}
        </p>
      )}

      <WizardNav onBack={prevStep} />
    </form>
  );
}
