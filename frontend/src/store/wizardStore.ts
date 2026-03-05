import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  WizardAnswers,
  WizardStep,
  PersonalInfo,
  Representative,
  MedicalPreferences,
  ScenarioChoices,
  PersonalValues,
} from '@/types'

const defaultMedicalPreferences: MedicalPreferences = {
  cpr: 'doctor',
  ventilation: 'doctor',
  artificialNutrition: 'doctor',
  dialysis: 'doctor',
  antibiotics: 'doctor',
  painManagement: 'balanced',
}

const defaultScenarioChoices: ScenarioChoices = {
  terminalIllness: [],
  irreversibleUnconsciousness: [],
  severeDementia: [],
}

const defaultAnswers: Partial<WizardAnswers> = {
  medicalPreferences: defaultMedicalPreferences,
  scenarioChoices: defaultScenarioChoices,
  personalValues: { organDonation: 'unspecified' },
}

interface WizardState {
  currentStep: WizardStep
  answers: Partial<WizardAnswers>
  savedPackageId: string | null

  setStep: (step: WizardStep) => void
  nextStep: () => void
  prevStep: () => void

  setPersonalInfo: (data: PersonalInfo) => void
  setRepresentative: (data: Representative) => void
  setSubstituteRepresentative: (data: Representative | undefined) => void
  setMedicalPreferences: (data: MedicalPreferences) => void
  setScenarioChoices: (data: ScenarioChoices) => void
  setPersonalValues: (data: PersonalValues) => void

  setSavedPackageId: (id: string) => void
  reset: () => void

  isComplete: () => boolean
}

const TOTAL_STEPS = 8

export const useWizardStore = create<WizardState>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      answers: defaultAnswers,
      savedPackageId: null,

      setStep: (step) => set({ currentStep: step }),
      nextStep: () =>
        set(s => ({ currentStep: Math.min(s.currentStep + 1, TOTAL_STEPS) as WizardStep })),
      prevStep: () =>
        set(s => ({ currentStep: Math.max(s.currentStep - 1, 0) as WizardStep })),

      setPersonalInfo: (data) =>
        set(s => ({ answers: { ...s.answers, personalInfo: data } })),
      setRepresentative: (data) =>
        set(s => ({ answers: { ...s.answers, representative: data } })),
      setSubstituteRepresentative: (data) =>
        set(s => ({ answers: { ...s.answers, substituteRepresentative: data } })),
      setMedicalPreferences: (data) =>
        set(s => ({ answers: { ...s.answers, medicalPreferences: data } })),
      setScenarioChoices: (data) =>
        set(s => ({ answers: { ...s.answers, scenarioChoices: data } })),
      setPersonalValues: (data) =>
        set(s => ({ answers: { ...s.answers, personalValues: data } })),

      setSavedPackageId: (id) => set({ savedPackageId: id }),

      reset: () =>
        set({ currentStep: 0, answers: defaultAnswers, savedPackageId: null }),

      isComplete: () => {
        const { answers } = get()
        return !!(
          answers.personalInfo &&
          answers.representative &&
          answers.medicalPreferences &&
          answers.scenarioChoices &&
          answers.personalValues
        )
      },
    }),
    {
      name: 'vorsorge-wizard-draft',
    }
  )
)
