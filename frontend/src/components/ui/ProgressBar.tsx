import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { WIZARD_STEPS, type WizardStep } from '../../types/wizard';
import { useWizardStore } from '../../store/wizardStore';

const VISIBLE_STEPS = WIZARD_STEPS.filter((s): s is Exclude<WizardStep, 'intro'> => s !== 'intro');

const stepKeys: Record<string, string> = {
  'personal-info': 'personalInfo',
  'trusted-person': 'trustedPerson',
  'medical-preferences': 'medicalPreferences',
  'situational-scenarios': 'situationalScenarios',
  'values-wishes': 'valuesWishes',
  summary: 'summary',
  account: 'account',
  generate: 'generate',
};

export function ProgressBar() {
  const { t } = useTranslation();
  const { currentStep, setStep } = useWizardStore();

  if (currentStep === 'intro') return null;

  const currentIdx = VISIBLE_STEPS.indexOf(currentStep as typeof VISIBLE_STEPS[number]);

  return (
    <nav aria-label="Wizard Progress" className="w-full px-4 py-3">
      <ol className="flex items-center justify-between gap-1">
        {VISIBLE_STEPS.map((step, idx) => {
          const isCompleted = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const isClickable = idx <= currentIdx;

          return (
            <li key={step} className="flex-1 flex flex-col items-center">
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && setStep(step)}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                  transition-all duration-200 mb-1
                  ${isCompleted ? 'bg-secondary-400 text-white' : ''}
                  ${isCurrent ? 'bg-primary-500 text-white ring-2 ring-primary-200' : ''}
                  ${!isCompleted && !isCurrent ? 'bg-gray-200 text-gray-500' : ''}
                  ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
                `}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isCompleted ? <Check size={14} /> : idx + 1}
              </button>
              <span className={`text-xs text-center hidden sm:block ${isCurrent ? 'font-semibold text-primary-600' : 'text-gray-500'}`}>
                {t(`wizard.steps.${stepKeys[step]}`)}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-500 transition-all duration-500 rounded-full"
          style={{ width: `${((currentIdx + 1) / VISIBLE_STEPS.length) * 100}%` }}
        />
      </div>
    </nav>
  );
}
