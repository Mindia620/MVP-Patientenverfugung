import { WizardAnswers } from '../types/wizard'
import { buildPatientenverfuegung as buildPatientenverfuegungV1 } from './v1.0/patientenverfuegung'
import { buildVorsorgevollmacht as buildVorsorgevollmachtV1 } from './v1.0/vorsorgevollmacht'
import { buildBetreuungsverfuegung as buildBetreuungsverfuegungV1 } from './v1.0/betreuungsverfuegung'

type DocumentType = 'PATIENTENVERFUEGUNG' | 'VORSORGEVOLLMACHT' | 'BETREUUNGSVERFUEGUNG'

type Builder = (answers: WizardAnswers) => string

const contentRegistry: Record<string, Record<DocumentType, Builder>> = {
  '1.0': {
    PATIENTENVERFUEGUNG: buildPatientenverfuegungV1,
    VORSORGEVOLLMACHT: buildVorsorgevollmachtV1,
    BETREUUNGSVERFUEGUNG: buildBetreuungsverfuegungV1,
  },
}

export function getDocumentContent(
  type: DocumentType,
  wizardVersion: string,
  answers: WizardAnswers
): string {
  const versionBuilders = contentRegistry[wizardVersion] ?? contentRegistry['1.0']
  const builder = versionBuilders[type]
  if (!builder) {
    throw new Error(`No content builder for document type: ${type}, version: ${wizardVersion}`)
  }
  return builder(answers)
}
