import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { StepIndicator } from './StepIndicator'
import { LockIcon } from '../ui/Icons'

interface WizardLayoutProps {
  currentStep: number
  totalSteps: number
  children: ReactNode
  onBack?: () => void
  onNext?: () => void
  nextLabel?: string
  backLabel?: string
  nextDisabled?: boolean
  isLoading?: boolean
  hideNav?: boolean
  skipLabel?: string
  onSkip?: () => void
}

export function WizardLayout({
  currentStep,
  totalSteps,
  children,
  onBack,
  onNext,
  nextLabel,
  backLabel,
  nextDisabled,
  isLoading,
  hideNav,
  skipLabel,
  onSkip,
}: WizardLayoutProps) {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex flex-col">
      {/* Header with progress */}
      <div className="pt-8 pb-6 px-4 bg-white border-b border-gray-100 shadow-sm">
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-2xl animate-fade-in">
          {children}
        </div>
      </main>

      {/* Navigation */}
      {!hideNav && (
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-4 shadow-lg">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {onBack && (
                <button onClick={onBack} className="btn-ghost" type="button">
                  ← {backLabel ?? t('wizard.back')}
                </button>
              )}
              {onSkip && (
                <button onClick={onSkip} className="btn-ghost text-gray-400" type="button">
                  {skipLabel ?? t('wizard.skip')}
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="privacy-note hidden sm:flex">
                <LockIcon className="w-4 h-4" />
                <span className="text-xs">Ihre Daten sind sicher</span>
              </span>
              {onNext && (
                <button
                  onClick={onNext}
                  className="btn-primary min-w-[140px]"
                  disabled={nextDisabled || isLoading}
                  type="button"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <SpinnerIcon />
                      {t('wizard.saving')}
                    </span>
                  ) : (
                    `${nextLabel ?? t('wizard.continue')} →`
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SpinnerIcon() {
  return (
    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}
