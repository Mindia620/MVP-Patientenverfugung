import { create } from 'zustand';
import type { WizardData, WizardStep, PersonalInfo, TrustedPersonStep, MedicalPreferences, SituationalScenarios, ValuesAndWishes } from '../types/wizard';
import { WIZARD_STEPS } from '../types/wizard';

const STORAGE_KEY = 'vorsorge-wizard-draft';

const defaultPersonalInfo: PersonalInfo = {
  salutation: 'herr',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  placeOfBirth: '',
  street: '',
  postalCode: '',
  city: '',
  phone: '',
};

const defaultTrustedPersonStep: TrustedPersonStep = {
  trustedPerson: {
    salutation: 'herr',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    relationship: 'ehepartner',
    street: '',
    postalCode: '',
    city: '',
    phone: '',
  },
  hasAlternatePerson: false,
};

const defaultMedicalPreferences: MedicalPreferences = {
  cpr: 'doctor_decides',
  ventilation: 'doctor_decides',
  artificialNutrition: 'doctor_decides',
  dialysis: 'doctor_decides',
  antibiotics: 'doctor_decides',
  painManagement: 'yes',
};

const defaultSituationalScenarios: SituationalScenarios = {
  terminalIllness: false,
  irreversibleUnconsciousness: false,
  severeDementia: false,
};

const defaultValuesAndWishes: ValuesAndWishes = {};

const defaultWizardData: WizardData = {
  personalInfo: defaultPersonalInfo,
  trustedPersonStep: defaultTrustedPersonStep,
  medicalPreferences: defaultMedicalPreferences,
  situationalScenarios: defaultSituationalScenarios,
  valuesAndWishes: defaultValuesAndWishes,
  confirmed: false,
};

function loadDraft(): WizardData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultWizardData, ...JSON.parse(stored) };
    }
  } catch {
    // ignore parse errors
  }
  return defaultWizardData;
}

function saveDraft(data: WizardData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore storage errors
  }
}

interface WizardStore {
  currentStep: WizardStep;
  data: WizardData;
  setStep: (step: WizardStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setPersonalInfo: (info: PersonalInfo) => void;
  setTrustedPersonStep: (step: TrustedPersonStep) => void;
  setMedicalPreferences: (prefs: MedicalPreferences) => void;
  setSituationalScenarios: (scenarios: SituationalScenarios) => void;
  setValuesAndWishes: (values: ValuesAndWishes) => void;
  setConfirmed: (confirmed: boolean) => void;
  clearDraft: () => void;
  getCurrentStepIndex: () => number;
}

export const useWizardStore = create<WizardStore>((set, get) => ({
  currentStep: 'intro',
  data: loadDraft(),

  setStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const idx = WIZARD_STEPS.indexOf(get().currentStep);
    if (idx < WIZARD_STEPS.length - 1) {
      set({ currentStep: WIZARD_STEPS[idx + 1] });
    }
  },

  prevStep: () => {
    const idx = WIZARD_STEPS.indexOf(get().currentStep);
    if (idx > 0) {
      set({ currentStep: WIZARD_STEPS[idx - 1] });
    }
  },

  setPersonalInfo: (info) => {
    const data = { ...get().data, personalInfo: info };
    saveDraft(data);
    set({ data });
  },

  setTrustedPersonStep: (step) => {
    const data = { ...get().data, trustedPersonStep: step };
    saveDraft(data);
    set({ data });
  },

  setMedicalPreferences: (prefs) => {
    const data = { ...get().data, medicalPreferences: prefs };
    saveDraft(data);
    set({ data });
  },

  setSituationalScenarios: (scenarios) => {
    const data = { ...get().data, situationalScenarios: scenarios };
    saveDraft(data);
    set({ data });
  },

  setValuesAndWishes: (values) => {
    const data = { ...get().data, valuesAndWishes: values };
    saveDraft(data);
    set({ data });
  },

  setConfirmed: (confirmed) => {
    const data = { ...get().data, confirmed };
    saveDraft(data);
    set({ data });
  },

  clearDraft: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ data: defaultWizardData, currentStep: 'intro' });
  },

  getCurrentStepIndex: () => WIZARD_STEPS.indexOf(get().currentStep),
}));
