import { useTranslation } from 'react-i18next'

const STEPS = [
  'personalInfo',
  'trustedPerson',
  'medicalPreferences',
  'scenarios',
  'values',
  'summary',
] as const

interface ProgressBarProps {
  currentStep: number
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  const { t } = useTranslation()

  return (
    <div className="mb-8">
      <div className="flex justify-between text-xs text-slate-500 mb-2">
        <span>{t('common.step', { current: currentStep + 1, total: STEPS.length })}</span>
        <span>{t(`steps.${STEPS[currentStep]}`)}</span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-600 transition-all duration-300"
          style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
        />
      </div>
    </div>
  )
}
