import { defaultAnswers, type WizardAnswers, wizardSchema } from "../wizardSchema";

const STORAGE_KEY = "vorsorge-wizard-draft-v1";

export const loadDraft = (): WizardAnswers => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return defaultAnswers;
  }

  try {
    const parsed = JSON.parse(raw);
    const result = wizardSchema.safeParse(parsed);
    return result.success ? result.data : defaultAnswers;
  } catch {
    return defaultAnswers;
  }
};

export const saveDraft = (answers: WizardAnswers) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
};

export const clearDraft = () => {
  localStorage.removeItem(STORAGE_KEY);
};
