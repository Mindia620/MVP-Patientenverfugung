export type TreatmentChoice = 'yes' | 'no' | 'doctor'
export type ScenarioChoice = 'life_sustaining' | 'palliative_only' | 'trusted_person_decides'
export type OrganDonationChoice = 'yes' | 'no' | 'already_registered'

export interface PersonalInfo {
  firstName: string
  lastName: string
  dateOfBirth: string
  placeOfBirth: string
  streetAddress: string
  postalCode: string
  city: string
  country: string
}

export interface TrustedPersonEntry {
  fullName: string
  relationship: string
  streetAddress: string
  postalCode: string
  city: string
  phone?: string
  email?: string
}

export interface TrustedPerson extends TrustedPersonEntry {
  substitute?: TrustedPersonEntry
}

export interface MedicalPrefs {
  cpr: TreatmentChoice
  ventilation: TreatmentChoice
  artificialNutrition: TreatmentChoice
  dialysis: TreatmentChoice
  antibiotics: TreatmentChoice
  painManagement: TreatmentChoice
}

export interface Scenarios {
  terminalIllness: ScenarioChoice
  terminalIllnessNotes?: string
  irreversibleUnconscious: ScenarioChoice
  irreversibleUnconsciousNotes?: string
  severeDementia: ScenarioChoice
  severeDementiaExtra?: string
}

export interface PersonalValues {
  valuesStatement?: string
  spiritualWishes?: string
  specificExclusions?: string
  organDonation: OrganDonationChoice
}

export interface WizardState {
  currentStep: number
  wizardVersion: string
  personalInfo?: PersonalInfo
  trustedPerson?: TrustedPerson
  medicalPrefs?: MedicalPrefs
  scenarios?: Scenarios
  personalValues?: PersonalValues
  disclaimerAccepted: boolean
}
