import type { WizardAnswers } from "../../schemas/wizard.js";
import { humanConsent, humanPain, humanScenario, personBlock } from "./shared.js";

export const buildPatientenverfuegung = (answers: WizardAnswers): string => {
  return [
    "PATIENTENVERFÜGUNG",
    "",
    "Person",
    personBlock(answers),
    "",
    "Medizinische Behandlungswünsche",
    `- Wiederbelebung (CPR): ${humanConsent(answers.medical.cpr)}.`,
    `- Künstliche Beatmung: ${humanConsent(answers.medical.ventilation)}.`,
    `- Künstliche Ernährung: ${humanConsent(answers.medical.artificialNutrition)}.`,
    `- Dialyse: ${humanConsent(answers.medical.dialysis)}.`,
    `- Antibiotikatherapie: ${humanConsent(answers.medical.antibiotics)}.`,
    `- Schmerzbehandlung: ${humanPain(answers.medical.painManagement)}.`,
    "",
    "Situative Anordnungen",
    `- Bei unheilbarer, zum Tode führender Erkrankung: ${humanScenario(answers.scenarios.terminalIllness)}.`,
    `- Bei irreversibler Bewusstlosigkeit: ${humanScenario(answers.scenarios.irreversibleUnconsciousness)}.`,
    `- Bei schwerer Demenz: ${humanScenario(answers.scenarios.severeDementia)}.`,
    "",
    "Persönliche Werte und Wünsche",
    answers.valuesAndWishes?.trim() || "Keine zusätzlichen Angaben.",
    "",
    "Hinweis: Dieses Dokument ist eine strukturierte Entwurfsvorlage und ersetzt keine individuelle Rechts- oder Medizinberatung.",
  ].join("\n");
};
