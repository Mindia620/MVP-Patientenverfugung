export type MedicalPreference = 'yes' | 'no' | 'situation_dependent';

export interface PersonalInfo {
  fullName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  address: {
    street: string;
    postalCode: string;
    city: string;
  };
}

export interface TrustedPerson {
  fullName: string;
  relationship: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface MedicalPreferences {
  cpr: MedicalPreference;
  ventilation: MedicalPreference;
  artificialNutrition: MedicalPreference;
  dialysis: MedicalPreference;
  antibiotics: MedicalPreference;
  painManagement: MedicalPreference;
}

export type ScenarioChoice = 'same' | 'different' | ScenarioOverrides;

export interface ScenarioOverrides {
  cpr?: MedicalPreference;
  ventilation?: MedicalPreference;
  artificialNutrition?: MedicalPreference;
  dialysis?: MedicalPreference;
  antibiotics?: MedicalPreference;
  painManagement?: MedicalPreference;
}

export interface Scenarios {
  terminalIllness: ScenarioChoice;
  irreversibleUnconsciousness: ScenarioChoice;
  severeDementia: ScenarioChoice;
}

export interface WizardAnswers {
  personalInfo: PersonalInfo;
  trustedPerson: TrustedPerson;
  alternatePerson?: TrustedPerson;
  medicalPreferences: MedicalPreferences;
  scenarios: Scenarios;
  additionalWishes?: string;
}

export const WIZARD_VERSION = '1.0';
