import type { WizardAnswers } from "../../schemas/wizard.js";
import { personBlock } from "./shared.js";

export const buildVorsorgevollmacht = (answers: WizardAnswers): string => {
  return [
    "VORSORGEVOLLMACHT",
    "",
    "Vollmachtgeber/in",
    personBlock(answers),
    "",
    "Bevollmächtigte Person",
    `${answers.trustedPerson.fullName}, Beziehung: ${answers.trustedPerson.relationship}, Telefon: ${answers.trustedPerson.phone}${answers.trustedPerson.email ? `, E-Mail: ${answers.trustedPerson.email}` : ""}.`,
    "",
    "Umfang der Vollmacht",
    "- Gesundheitssorge und Einwilligung in medizinische Maßnahmen im Rahmen meiner Patientenverfügung.",
    "- Aufenthalts- und Betreuungsangelegenheiten.",
    "- Kommunikation mit Ärztinnen, Ärzten, Pflegeeinrichtungen und Behörden.",
    "",
    "Hinweis",
    "Die bevollmächtigte Person soll meinen dokumentierten Werten und Wünschen folgen.",
    "",
    "Hinweis: Dieses Dokument ist eine strukturierte Entwurfsvorlage und ersetzt keine individuelle Rechtsberatung.",
  ].join("\n");
};
