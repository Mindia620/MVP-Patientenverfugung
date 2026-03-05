import { DocumentType } from "@prisma/client";
import type { WizardAnswers } from "../schemas/wizard.js";
import { buildBetreuungsverfuegung } from "../content/de/betreuungsverfuegung.js";
import { buildPatientenverfuegung } from "../content/de/patientenverfuegung.js";
import { buildVorsorgevollmacht } from "../content/de/vorsorgevollmacht.js";

export type AssembledDocument = {
  type: DocumentType;
  title: string;
  fileName: string;
  content: string;
};

export const assembleGermanDocuments = (answers: WizardAnswers): AssembledDocument[] => {
  const safeLastName = answers.personal.lastName.trim().toLowerCase().replace(/\s+/g, "-");

  return [
    {
      type: DocumentType.PATIENTENVERFUEGUNG,
      title: "Patientenverfuegung",
      fileName: `patientenverfuegung-${safeLastName}.pdf`,
      content: buildPatientenverfuegung(answers),
    },
    {
      type: DocumentType.VORSORGEVOLLMACHT,
      title: "Vorsorgevollmacht",
      fileName: `vorsorgevollmacht-${safeLastName}.pdf`,
      content: buildVorsorgevollmacht(answers),
    },
    {
      type: DocumentType.BETREUUNGSVERFUEGUNG,
      title: "Betreuungsverfuegung",
      fileName: `betreuungsverfuegung-${safeLastName}.pdf`,
      content: buildBetreuungsverfuegung(answers),
    },
  ];
};
