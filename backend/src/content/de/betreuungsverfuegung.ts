import type { WizardAnswers } from "../../schemas/wizard.js";
import { humanScenario, personBlock } from "./shared.js";

export const buildBetreuungsverfuegung = (answers: WizardAnswers): string => {
  return [
    "BETREUUNGSVERFÜGUNG",
    "",
    "Verfügende Person",
    personBlock(answers),
    "",
    "Gewünschte betreuende Person",
    `${answers.trustedPerson.fullName}, Beziehung: ${answers.trustedPerson.relationship}, Telefon: ${answers.trustedPerson.phone}.`,
    "",
    "Leitlinien für Betreuung und Entscheidungen",
    `- Endstadium einer tödlich verlaufenden Erkrankung: ${humanScenario(answers.scenarios.terminalIllness)}.`,
    `- Irreversible Bewusstlosigkeit: ${humanScenario(answers.scenarios.irreversibleUnconsciousness)}.`,
    `- Schwere Demenz: ${humanScenario(answers.scenarios.severeDementia)}.`,
    "",
    "Persönliche Werte",
    answers.valuesAndWishes?.trim() || "Keine zusätzlichen Angaben.",
    "",
    "Hinweis: Dieses Dokument ist eine strukturierte Entwurfsvorlage und ersetzt keine individuelle Rechtsberatung.",
  ].join("\n");
};
