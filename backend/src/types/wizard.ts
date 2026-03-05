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

export type TreatmentChoice = 'yes' | 'no' | 'doctor'

export interface MedicalPrefs {
  cpr: TreatmentChoice
  ventilation: TreatmentChoice
  artificialNutrition: TreatmentChoice
  dialysis: TreatmentChoice
  antibiotics: TreatmentChoice
  painManagement: TreatmentChoice
}

export type ScenarioChoice =
  | 'life_sustaining'
  | 'palliative_only'
  | 'trusted_person_decides'

export interface Scenarios {
  terminalIllness: ScenarioChoice
  terminalIllnessNotes?: string
  irreversibleUnconscious: ScenarioChoice
  irreversibleUnconsciousNotes?: string
  severeDementia: ScenarioChoice
  severeDementiaExtra?: string
}

export type OrganDonationChoice = 'yes' | 'no' | 'already_registered'

export interface PersonalValues {
  valuesStatement?: string
  spiritualWishes?: string
  specificExclusions?: string
  organDonation: OrganDonationChoice
}

export interface WizardAnswers {
  personalInfo?: PersonalInfo
  trustedPerson?: TrustedPerson
  medicalPrefs?: MedicalPrefs
  scenarios?: Scenarios
  personalValues?: PersonalValues
  wizardVersion: string
}
