import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import type { AnswersV1 } from '../types.js';
import { composePatientenverfuegung } from '../content/de/patientenverfuegung.js';
import { composeVorsorgevollmacht } from '../content/de/vorsorgevollmacht.js';
import { composeBetreuungsverfuegung } from '../content/de/betreuungsverfuegung.js';

const MARGIN = 72;
const FONT_SIZE = 11;
const LINE_HEIGHT = 16;

function wrapText(text: string, maxWidth: number, font: { widthOfTextAtSize: (t: string, s: number) => number }): string[] {
  const lines: string[] = [];
  const paragraphs = text.split('\n\n');

  for (const para of paragraphs) {
    if (para.trim() === '') {
      lines.push('');
      continue;
    }

    const words = para.split(/\s+/);
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? currentLine + ' ' + word : word;
      const width = font.widthOfTextAtSize(testLine, FONT_SIZE);

      if (width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    lines.push('');
  }

  return lines;
}

async function createPdfFromText(text: string): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pageWidth = 595;
  const pageHeight = 842;
  const maxWidth = pageWidth - 2 * MARGIN;

  const allLines = wrapText(text, maxWidth, font);
  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - MARGIN;

  for (const line of allLines) {
    if (y < MARGIN + LINE_HEIGHT) {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      y = pageHeight - MARGIN;
    }

    currentPage.drawText(line, {
      x: MARGIN,
      y,
      size: FONT_SIZE,
      font,
      color: rgb(0, 0, 0),
    });

    y -= LINE_HEIGHT;
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

export async function generatePatientenverfuegung(answers: AnswersV1): Promise<Buffer> {
  const text = composePatientenverfuegung(answers);
  return createPdfFromText(text);
}

export async function generateVorsorgevollmacht(answers: AnswersV1): Promise<Buffer> {
  const text = composeVorsorgevollmacht(answers);
  return createPdfFromText(text);
}

export async function generateBetreuungsverfuegung(answers: AnswersV1): Promise<Buffer> {
  const text = composeBetreuungsverfuegung(answers);
  return createPdfFromText(text);
}

export type DocumentType = 'patientenverfuegung' | 'vorsorgevollmacht' | 'betreuungsverfuegung';

export async function generateDocument(docType: DocumentType, answers: AnswersV1): Promise<Buffer> {
  switch (docType) {
    case 'patientenverfuegung':
      return generatePatientenverfuegung(answers);
    case 'vorsorgevollmacht':
      return generateVorsorgevollmacht(answers);
    case 'betreuungsverfuegung':
      return generateBetreuungsverfuegung(answers);
    default:
      throw new Error('Invalid document type');
  }
}
