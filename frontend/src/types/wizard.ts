export type Salutation = 'herr' | 'frau' | 'divers';
export type Relationship = 'ehepartner' | 'kind' | 'elternteil' | 'freund' | 'sonstige';
export type TreatmentPreference = 'yes' | 'no' | 'doctor_decides';
export type OrganDonationPreference = 'yes' | 'no' | 'restricted';

export interface PersonalInfo {
  salutation: Salutation;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  street: string;
  postalCode: string;
  city: string;
  phone?: string;
}

export interface TrustedPerson {
  salutation: Salutation;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  relationship: Relationship;
  street: string;
  postalCode: string;
  city: string;
  phone: string;
}

export interface TrustedPersonStep {
  trustedPerson: TrustedPerson;
  hasAlternatePerson: boolean;
  alternatePerson?: TrustedPerson;
}

export interface MedicalPreferences {
  cpr: TreatmentPreference;
  ventilation: TreatmentPreference;
  artificialNutrition: TreatmentPreference;
  dialysis: TreatmentPreference;
  antibiotics: TreatmentPreference;
  painManagement: TreatmentPreference;
}

export interface SituationalScenarios {
  terminalIllness: boolean;
  irreversibleUnconsciousness: boolean;
  severeDementia: boolean;
}

export interface ValuesAndWishes {
  personalValues?: string;
  religiousWishes?: string;
  organDonation?: OrganDonationPreference;
  burialWishes?: string;
}

export interface WizardData {
  personalInfo: PersonalInfo;
  trustedPersonStep: TrustedPersonStep;
  medicalPreferences: MedicalPreferences;
  situationalScenarios: SituationalScenarios;
  valuesAndWishes: ValuesAndWishes;
  confirmed: boolean;
}

export const WIZARD_STEPS = [
  'intro',
  'personal-info',
  'trusted-person',
  'medical-preferences',
  'situational-scenarios',
  'values-wishes',
  'summary',
  'account',
  'generate',
] as const;

export type WizardStep = (typeof WIZARD_STEPS)[number];
