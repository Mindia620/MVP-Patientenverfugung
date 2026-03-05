import { useTranslation } from 'react-i18next'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const { t } = useTranslation()

  const stepLabels: Record<number, string> = {
    1: t('wizard.steps.1'),
    2: t('wizard.steps.2'),
    3: t('wizard.steps.3'),
    4: t('wizard.steps.4'),
    5: t('wizard.steps.5'),
    6: t('wizard.steps.6'),
    7: t('wizard.steps.7'),
    8: t('wizard.steps.8'),
  }

  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100

  return (
    <div className="w-full max-w-2xl mx-auto px-4" role="navigation" aria-label="Wizard progress">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-primary-700">
          {t('wizard.step_of', { current: currentStep, total: totalSteps })}
        </span>
        <span className="text-sm text-gray-500 hidden sm:block">
          {stepLabels[currentStep]}
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={currentStep}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
          />
        </div>

        {/* Step dots — desktop only */}
        <div className="hidden sm:flex absolute inset-0 items-center justify-between px-0">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <div
              key={step}
              className={`w-3 h-3 rounded-full border-2 transition-all duration-200 ${
                step < currentStep
                  ? 'bg-primary-600 border-primary-600'
                  : step === currentStep
                    ? 'bg-white border-primary-600 shadow-md scale-125'
                    : 'bg-white border-gray-300'
              }`}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
