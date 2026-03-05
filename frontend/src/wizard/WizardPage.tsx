import { FormProvider, useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { wizardAnswersSchema } from '../lib/schemas';
import type { WizardAnswers } from '../types/wizard';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { Step1PersonalInfo } from './Step1PersonalInfo';
import { Step2TrustedPerson } from './Step2TrustedPerson';
import { Step3MedicalPreferences } from './Step3MedicalPreferences';
import { Step4Scenarios } from './Step4Scenarios';
import { Step5AdditionalWishes } from './Step5AdditionalWishes';
import { Step6Summary } from './Step6Summary';
import { Step7CreateAccount } from './Step7CreateAccount';
import { Step8GeneratePDF } from './Step8GeneratePDF';

const defaultValues: Partial<WizardAnswers> = {
  medicalPreferences: {
    cpr: 'situation_dependent',
    ventilation: 'situation_dependent',
    artificialNutrition: 'situation_dependent',
    dialysis: 'situation_dependent',
    antibiotics: 'situation_dependent',
    painManagement: 'situation_dependent',
  },
  scenarios: {
    terminalIllness: 'same',
    irreversibleUnconsciousness: 'same',
    severeDementia: 'same',
  },
};

const STEPS = [
  { path: '1', component: Step1PersonalInfo },
  { path: '2', component: Step2TrustedPerson },
  { path: '3', component: Step3MedicalPreferences },
  { path: '4', component: Step4Scenarios },
  { path: '5', component: Step5AdditionalWishes },
  { path: '6', component: Step6Summary },
  { path: '7', component: Step7CreateAccount },
  { path: '8', component: Step8GeneratePDF },
];

export function WizardPage() {
  const { step } = useParams<{ step: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const currentIndex = STEPS.findIndex((s) => s.path === step);
  const currentStep = currentIndex >= 0 ? STEPS[currentIndex] : null;

  const form = useForm<WizardAnswers>({
    resolver: zodResolver(wizardAnswersSchema),
    defaultValues: defaultValues as WizardAnswers,
    mode: 'onBlur',
  });

  useEffect(() => {
    const draft = localStorage.getItem('vorsorge-wizard-draft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.personalInfo || parsed.medicalPreferences) {
          form.reset({ ...defaultValues, ...parsed } as WizardAnswers);
        }
      } catch {
        // Ignore invalid draft
      }
    }
  }, [form]);

  useEffect(() => {
    const subscription = form.watch((data) => {
      localStorage.setItem('vorsorge-wizard-draft', JSON.stringify(data));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleNext = async () => {
    const fieldsToValidate: (keyof WizardAnswers)[] =
      currentIndex === 0 ? ['personalInfo'] :
      currentIndex === 1 ? ['trustedPerson'] :
      currentIndex === 2 ? ['medicalPreferences'] :
      currentIndex === 3 ? ['scenarios'] :
      currentIndex === 4 ? ['additionalWishes'] : [];

    const valid = await form.trigger(fieldsToValidate as never[]);
    if (valid && currentIndex < STEPS.length - 1) {
      navigate(`/wizard/${STEPS[currentIndex + 1].path}`);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      navigate(`/wizard/${STEPS[currentIndex - 1].path}`);
    } else {
      navigate('/');
    }
  };

  if (!currentStep) {
    navigate('/wizard/1', { replace: true });
    return null;
  }

  const StepComponent = currentStep.component;
  const stepNum = currentIndex + 1;

  return (
    <FormProvider {...form}>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <ProgressIndicator currentStep={stepNum} totalSteps={8} />

        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          {t(`wizard.step${stepNum}.title`)}
        </h2>

        <StepComponent />

        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
          >
            {t('common.back')}
          </button>
          {currentIndex < 6 && currentIndex !== 5 && (
            <button
              type="button"
              onClick={handleNext}
              className="rounded-lg bg-teal-600 px-6 py-2 font-semibold text-white hover:bg-teal-700"
            >
              {t('common.next')}
            </button>
          )}
          {currentIndex === 5 && (
            <button
              type="button"
              onClick={handleNext}
              className="rounded-lg bg-teal-600 px-6 py-2 font-semibold text-white hover:bg-teal-700"
            >
              {t('wizard.step6.continueToSave')}
            </button>
          )}
        </div>
      </div>
    </FormProvider>
  );
}
