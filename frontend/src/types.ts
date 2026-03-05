export interface AnswersV1 {
  version: '1.0';
  personalInfo: {
    fullName: string;
    street: string;
    postalCode: string;
    city: string;
    dateOfBirth: string;
    placeOfBirth?: string;
  };
  trustedPerson: {
    fullName: string;
    relationship: string;
    street: string;
    postalCode: string;
    city: string;
    phone?: string;
    email?: string;
  };
  trustedPerson2?: {
    fullName: string;
    relationship: string;
    street: string;
    postalCode: string;
    city: string;
    phone?: string;
    email?: string;
  };
  medicalPreferences: {
    cpr: 'allow' | 'refuse' | 'delegate';
    ventilation: 'allow' | 'refuse' | 'delegate';
    artificialNutrition: 'allow' | 'refuse' | 'delegate';
    dialysis: 'allow' | 'refuse' | 'delegate';
    antibiotics: 'allow' | 'refuse' | 'delegate';
    painManagement: 'allow' | 'refuse' | 'delegate';
  };
  scenarios: {
    terminalIllness: {
      applyGeneral: boolean;
      overrides?: Partial<AnswersV1['medicalPreferences']>;
      note?: string;
    };
    irreversibleUnconsciousness: {
      applyGeneral: boolean;
      overrides?: Partial<AnswersV1['medicalPreferences']>;
      note?: string;
    };
    severeDementia: {
      applyGeneral: boolean;
      overrides?: Partial<AnswersV1['medicalPreferences']>;
      note?: string;
    };
  };
  values?: {
    religiousWishes?: string;
    otherWishes?: string;
  };
}

export type Answers = AnswersV1;

export type DocumentType = 'patientenverfuegung' | 'vorsorgevollmacht' | 'betreuungsverfuegung';
