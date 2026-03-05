import type { Answers } from '../types'

export const defaultAnswers: Answers = {
  version: '1.0',
  personalInfo: {
    fullName: '',
    street: '',
    postalCode: '',
    city: '',
    dateOfBirth: '',
    placeOfBirth: '',
  },
  trustedPerson: {
    fullName: '',
    relationship: '',
    street: '',
    postalCode: '',
    city: '',
    phone: '',
    email: '',
  },
  medicalPreferences: {
    cpr: 'delegate',
    ventilation: 'delegate',
    artificialNutrition: 'delegate',
    dialysis: 'delegate',
    antibiotics: 'allow',
    painManagement: 'allow',
  },
  scenarios: {
    terminalIllness: { applyGeneral: true },
    irreversibleUnconsciousness: { applyGeneral: true },
    severeDementia: { applyGeneral: true },
  },
  values: {
    religiousWishes: '',
    otherWishes: '',
  },
}
