import { useWizardStore } from '../store/wizardStore';
import { WizardLayout } from '../components/layout/WizardLayout';
import { IntroStep } from '../components/wizard/IntroStep';
import { PersonalInfoStep } from '../components/wizard/PersonalInfoStep';
import { TrustedPersonStep } from '../components/wizard/TrustedPersonStep';
import { MedicalPreferencesStep } from '../components/wizard/MedicalPreferencesStep';
import { SituationalScenariosStep } from '../components/wizard/SituationalScenariosStep';
import { ValuesWishesStep } from '../components/wizard/ValuesWishesStep';
import { SummaryStep } from '../components/wizard/SummaryStep';
import { AccountStep } from '../components/wizard/AccountStep';
import { GenerateStep } from '../components/wizard/GenerateStep';

const STEP_COMPONENTS: Record<string, React.ComponentType> = {
  'intro': IntroStep,
  'personal-info': PersonalInfoStep,
  'trusted-person': TrustedPersonStep,
  'medical-preferences': MedicalPreferencesStep,
  'situational-scenarios': SituationalScenariosStep,
  'values-wishes': ValuesWishesStep,
  'summary': SummaryStep,
  'account': AccountStep,
  'generate': GenerateStep,
};

export function WizardPage() {
  const { currentStep } = useWizardStore();
  const StepComponent = STEP_COMPONENTS[currentStep] || IntroStep;

  return (
    <WizardLayout>
      <StepComponent />
    </WizardLayout>
  );
}
