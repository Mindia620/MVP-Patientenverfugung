export interface PersonalInfo {
  firstName: string
  lastName: string
  birthDate: string
  birthPlace: string
  street: string
  postalCode: string
  city: string
}

export interface Representative {
  firstName: string
  lastName: string
  relationship: string
  street: string
  postalCode: string
  city: string
  phone?: string
}

export type TreatmentChoice = 'yes' | 'no' | 'doctor'

export interface MedicalPreferences {
  cpr: TreatmentChoice
  ventilation: TreatmentChoice
  artificialNutrition: TreatmentChoice
  dialysis: TreatmentChoice
  antibiotics: TreatmentChoice
  painManagement: 'maxRelief' | 'lifeFirst' | 'balanced'
}

export interface ScenarioChoices {
  terminalIllness: string[]
  irreversibleUnconsciousness: string[]
  severeDementia: string[]
}

export interface PersonalValues {
  personalStatement?: string
  religiousWishes?: string
  organDonation: 'yes' | 'no' | 'unspecified'
}

export interface WizardAnswers {
  personalInfo: PersonalInfo
  representative: Representative
  substituteRepresentative?: Representative
  medicalPreferences: MedicalPreferences
  scenarioChoices: ScenarioChoices
  personalValues: PersonalValues
}

export interface User {
  id: string
  email: string
  createdAt: string
}

export type DocumentType = 'patientenverfuegung' | 'vorsorgevollmacht' | 'betreuungsverfuegung'

export interface GeneratedDocument {
  id: string
  documentType: DocumentType
  version: number
  createdAt: string
  fileName: string
}

export interface DocumentPackage {
  id: string
  title: string
  version: number
  createdAt: string
  updatedAt: string
  generatedDocuments: GeneratedDocument[]
}

export type WizardStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
