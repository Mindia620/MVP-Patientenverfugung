import type { WizardAnswers } from "../../schemas/wizard.js";

const consentMap: Record<WizardAnswers["medical"]["cpr"], string> = {
  yes: "gewünscht",
  no: "nicht gewünscht",
  case_by_case: "nach Einzelfallabwägung",
};

const painMap: Record<WizardAnswers["medical"]["painManagement"], string> = {
  full_relief: "maximale Linderung von Schmerzen, auch bei möglicher Bewusstseinsminderung",
  balanced: "ausgewogene Schmerztherapie bei Erhalt möglichst klarer Kommunikation",
  minimal: "zurückhaltende Schmerztherapie",
};

const scenarioMap: Record<WizardAnswers["scenarios"]["terminalIllness"], string> = {
  continue_treatment: "lebenserhaltende Behandlung fortführen",
  limit_treatment: "lebenserhaltende Maßnahmen begrenzen",
  comfort_only: "ausschließlich palliative Komfortversorgung",
};

export const humanConsent = (value: WizardAnswers["medical"]["cpr"]) => consentMap[value];
export const humanPain = (value: WizardAnswers["medical"]["painManagement"]) => painMap[value];
export const humanScenario = (value: WizardAnswers["scenarios"]["terminalIllness"]) => scenarioMap[value];

export const personBlock = (answers: WizardAnswers): string =>
  `${answers.personal.firstName} ${answers.personal.lastName}, geboren am ${answers.personal.birthDate}, wohnhaft ${answers.personal.addressLine1}, ${answers.personal.postalCode} ${answers.personal.city}.`;
