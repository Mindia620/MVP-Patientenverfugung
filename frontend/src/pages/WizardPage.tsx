import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { defaultAnswers } from '../wizard/defaultAnswers'
import { useWizardDraft } from '../hooks/useWizardDraft'
import { ProgressBar } from '../wizard/ProgressBar'
import { StepPersonalInfo } from '../wizard/steps/StepPersonalInfo'
import { StepTrustedPerson } from '../wizard/steps/StepTrustedPerson'
import { StepMedicalPreferences } from '../wizard/steps/StepMedicalPreferences'
import { StepScenarios } from '../wizard/steps/StepScenarios'
import { StepValues } from '../wizard/steps/StepValues'
import { StepSummary } from '../wizard/steps/StepSummary'
import type { Answers } from '../types'

export function WizardPage() {
  const location = useLocation()
  const [answers, setAnswers] = useState<Answers | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [hasSecondPerson, setHasSecondPerson] = useState(false)

  const { loadDraft } = useWizardDraft(answers, setAnswers)

  useEffect(() => {
    const stateAnswers = (location.state as { answers?: Answers })?.answers
    const draft = loadDraft()
    if (stateAnswers) {
      setAnswers(stateAnswers)
    } else if (draft) {
      setAnswers(draft)
    } else {
      setAnswers({ ...defaultAnswers })
    }
  }, [])

  if (!answers) {
    return <div className="animate-pulse h-64 bg-slate-100 rounded-lg" />
  }

  const updateAnswers = (updater: (a: Answers) => Answers) => {
    setAnswers(updater(answers))
  }

  const handlePersonalInfo = (data: Answers['personalInfo']) => {
    updateAnswers((a) => ({ ...a, personalInfo: data }))
    setCurrentStep(1)
  }

  const handleTrustedPerson = (data: Answers['trustedPerson'], data2?: Answers['trustedPerson2']) => {
    updateAnswers((a) => ({
      ...a,
      trustedPerson: data,
      trustedPerson2: data2,
    }))
    setCurrentStep(2)
  }

  const handleMedicalPreferences = (data: Answers['medicalPreferences']) => {
    updateAnswers((a) => ({ ...a, medicalPreferences: data }))
    setCurrentStep(3)
  }

  const handleScenarios = (data: Answers['scenarios']) => {
    updateAnswers((a) => ({ ...a, scenarios: data }))
    setCurrentStep(4)
  }

  const handleValues = (data: Answers['values']) => {
    updateAnswers((a) => ({ ...a, values: data }))
    setCurrentStep(5)
  }

  const handleEditStep = (step: number) => {
    setCurrentStep(step)
  }

  return (
    <div className="space-y-6">
      <ProgressBar currentStep={currentStep} />

      {currentStep === 0 && (
        <StepPersonalInfo
          data={answers.personalInfo}
          onNext={handlePersonalInfo}
        />
      )}

      {currentStep === 1 && (
        <StepTrustedPerson
          data={answers.trustedPerson}
          data2={answers.trustedPerson2}
          hasSecond={hasSecondPerson}
          onToggleSecond={() => setHasSecondPerson(!hasSecondPerson)}
          onNext={handleTrustedPerson}
          onBack={() => setCurrentStep(0)}
        />
      )}

      {currentStep === 2 && (
        <StepMedicalPreferences
          data={answers.medicalPreferences}
          onNext={handleMedicalPreferences}
          onBack={() => setCurrentStep(1)}
        />
      )}

      {currentStep === 3 && (
        <StepScenarios
          data={answers.scenarios}
          onNext={handleScenarios}
          onBack={() => setCurrentStep(2)}
        />
      )}

      {currentStep === 4 && (
        <StepValues
          data={answers.values}
          onNext={handleValues}
          onBack={() => setCurrentStep(3)}
        />
      )}

      {currentStep === 5 && (
        <StepSummary
          answers={answers}
          onEditStep={handleEditStep}
        />
      )}
    </div>
  )
}
