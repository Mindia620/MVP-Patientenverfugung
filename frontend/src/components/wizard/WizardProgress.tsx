import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WizardProgressProps {
  currentStep: number
  totalSteps: number
}

const STEP_LABELS_DE = [
  'Intro',
  'Persönliche Angaben',
  'Vertrauensperson',
  'Medizinische Wünsche',
  'Situationen',
  'Werte',
  'Überprüfung',
  'Konto',
  'Dokumente',
]

const STEP_LABELS_EN = [
  'Intro',
  'Personal Info',
  'Trusted Person',
  'Medical Wishes',
  'Scenarios',
  'Values',
  'Review',
  'Account',
  'Documents',
]

export function WizardProgress({ currentStep, totalSteps }: WizardProgressProps) {
  const { t, i18n } = useTranslation()
  const labels = i18n.language === 'de' ? STEP_LABELS_DE : STEP_LABELS_EN
  const progressPercent = Math.round((currentStep / totalSteps) * 100)

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          {t('wizard.progressLabel')}
        </span>
        <span className="text-xs font-medium text-slate-500">
          {t('wizard.step')} {currentStep} {t('wizard.of')} {totalSteps}
        </span>
      </div>
      <div
        className="w-full bg-slate-200 rounded-full h-2"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progressPercent}
        aria-label={`${progressPercent}% abgeschlossen`}
      >
        <div
          className="bg-sky-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      {currentStep > 0 && currentStep <= labels.length - 1 && (
        <p className="mt-1.5 text-xs text-slate-500">{labels[currentStep]}</p>
      )}
    </div>
  )
}

interface StepIndicatorProps {
  steps: number
  currentStep: number
  className?: string
}

export function StepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: steps }).map((_, i) => {
        const stepNum = i + 1
        const done = stepNum < currentStep
        const active = stepNum === currentStep
        return (
          <div
            key={i}
            className={cn(
              'flex items-center justify-center rounded-full text-xs font-semibold transition-all duration-200',
              done
                ? 'bg-sky-600 text-white w-6 h-6'
                : active
                  ? 'bg-sky-600 text-white w-7 h-7 ring-2 ring-sky-200'
                  : 'bg-slate-200 text-slate-500 w-6 h-6'
            )}
            aria-current={active ? 'step' : undefined}
          >
            {done ? <Check size={12} /> : stepNum}
          </div>
        )
      })}
    </div>
  )
}
