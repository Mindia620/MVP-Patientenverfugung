import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WizardState, PersonalInfo, TrustedPerson, MedicalPrefs, Scenarios, PersonalValues } from '../types/wizard'

interface WizardStore extends WizardState {
  setStep: (step: number) => void
  setPersonalInfo: (data: PersonalInfo) => void
  setTrustedPerson: (data: TrustedPerson) => void
  setMedicalPrefs: (data: MedicalPrefs) => void
  setScenarios: (data: Scenarios) => void
  setPersonalValues: (data: PersonalValues) => void
  setDisclaimerAccepted: (value: boolean) => void
  reset: () => void
  getAnswersSnapshot: () => Record<string, unknown>
}

const initialState: WizardState = {
  currentStep: 1,
  wizardVersion: '1.0',
  disclaimerAccepted: false,
}

export const useWizardStore = create<WizardStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setStep: (step) => set({ currentStep: step }),

      setPersonalInfo: (data) => set({ personalInfo: data }),

      setTrustedPerson: (data) => set({ trustedPerson: data }),

      setMedicalPrefs: (data) => set({ medicalPrefs: data }),

      setScenarios: (data) => set({ scenarios: data }),

      setPersonalValues: (data) => set({ personalValues: data }),

      setDisclaimerAccepted: (value) => set({ disclaimerAccepted: value }),

      reset: () => set(initialState),

      getAnswersSnapshot: () => {
        const state = get()
        return {
          wizardVersion: state.wizardVersion,
          personalInfo: state.personalInfo,
          trustedPerson: state.trustedPerson,
          medicalPrefs: state.medicalPrefs,
          scenarios: state.scenarios,
          personalValues: state.personalValues,
        }
      },
    }),
    {
      name: 'vorsorge-wizard-draft',
      version: 1,
    }
  )
)
