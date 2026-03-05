import { useWizardStore } from '@/store/wizardStore'
import { WizardProgress } from '@/components/wizard/WizardProgress'
import { StepIntro } from '@/components/wizard/StepIntro'
import { StepPersonalInfo } from '@/components/wizard/StepPersonalInfo'
import { StepRepresentative } from '@/components/wizard/StepRepresentative'
import { StepMedicalPreferences } from '@/components/wizard/StepMedicalPreferences'
import { StepScenarios } from '@/components/wizard/StepScenarios'
import { StepPersonalValues } from '@/components/wizard/StepPersonalValues'
import { StepSummary } from '@/components/wizard/StepSummary'
import { StepRegister } from '@/components/wizard/StepRegister'
import { StepDownload } from '@/components/wizard/StepDownload'

const TOTAL_STEPS = 8

const steps = [
  StepIntro,
  StepPersonalInfo,
  StepRepresentative,
  StepMedicalPreferences,
  StepScenarios,
  StepPersonalValues,
  StepSummary,
  StepRegister,
  StepDownload,
]

export function Wizard() {
  const currentStep = useWizardStore(s => s.currentStep)
  const StepComponent = steps[currentStep] ?? StepIntro

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-2xl mx-auto mb-8">
        {currentStep > 0 && (
          <WizardProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        )}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
        <StepComponent />
      </div>
    </div>
  )
}
