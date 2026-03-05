import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { prisma } from '../lib/prisma.js';
import { generatePatientenverfuegungText } from '../content/de/patientenverfuegung.js';
import { generateVorsorgevollmachtText } from '../content/de/vorsorgevollmacht.js';
import { generateBetreuungsverfuegungText } from '../content/de/betreuungsverfuegung.js';

const STORAGE_PATH = process.env.PDF_STORAGE_PATH || './storage/pdfs';
const PAGE_WIDTH = 595.28;  // A4
const PAGE_HEIGHT = 841.89; // A4
const MARGIN = 60;
const LINE_HEIGHT = 14;
const TITLE_SIZE = 16;
const BODY_SIZE = 10;
const MAX_TEXT_WIDTH = PAGE_WIDTH - 2 * MARGIN;

function wrapText(text: string, font: any, fontSize: number, maxWidth: number): string[] {
  if (!text) return [''];
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);
    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines.length ? lines : [''];
}

async function createPdfFromLines(lines: string[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  const addNewPage = () => {
    page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    y = PAGE_HEIGHT - MARGIN;
  };

  for (const line of lines) {
    const isTitle = line === line.toUpperCase() && line.length > 0 && !line.startsWith('___') && !line.startsWith('(');
    const fontSize = isTitle ? TITLE_SIZE : BODY_SIZE;
    const currentFont = isTitle ? boldFont : font;
    const lineSpacing = isTitle ? LINE_HEIGHT * 1.8 : LINE_HEIGHT;

    if (line === '') {
      y -= LINE_HEIGHT * 0.8;
      if (y < MARGIN) addNewPage();
      continue;
    }

    const wrappedLines = wrapText(line, currentFont, fontSize, MAX_TEXT_WIDTH);

    for (const wrappedLine of wrappedLines) {
      if (y < MARGIN + LINE_HEIGHT) addNewPage();

      page.drawText(wrappedLine, {
        x: MARGIN,
        y,
        size: fontSize,
        font: currentFont,
        color: rgb(0.1, 0.1, 0.1),
      });

      y -= lineSpacing;
    }
  }

  // Footer on every page
  const pages = pdfDoc.getPages();
  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    const footerText = `Seite ${i + 1} von ${pages.length} — Erstellt mit Vorsorge Wizard`;
    const footerWidth = font.widthOfTextAtSize(footerText, 7);
    p.drawText(footerText, {
      x: (PAGE_WIDTH - footerWidth) / 2,
      y: 25,
      size: 7,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });
  }

  return pdfDoc.save();
}

interface WizardAnswers {
  personalInfo: any;
  trustedPersonStep: any;
  medicalPreferences: any;
  situationalScenarios: any;
  valuesAndWishes: any;
}

export async function generateAllDocuments(
  packageId: string,
  userId: string,
  answers: WizardAnswers,
  wizardVersion: string,
) {
  const storageDir = path.join(STORAGE_PATH, userId, packageId);
  fs.mkdirSync(storageDir, { recursive: true });

  const { personalInfo, trustedPersonStep, medicalPreferences, situationalScenarios, valuesAndWishes } = answers;
  const trustedPerson = trustedPersonStep.trustedPerson;
  const alternatePerson = trustedPersonStep.hasAlternatePerson ? trustedPersonStep.alternatePerson : undefined;

  const docs: { type: string; fileName: string; lines: string[] }[] = [
    {
      type: 'PATIENTENVERFUEGUNG',
      fileName: 'Patientenverfuegung.pdf',
      lines: generatePatientenverfuegungText(personalInfo, medicalPreferences, situationalScenarios, valuesAndWishes),
    },
    {
      type: 'VORSORGEVOLLMACHT',
      fileName: 'Vorsorgevollmacht.pdf',
      lines: generateVorsorgevollmachtText(personalInfo, trustedPerson, alternatePerson),
    },
    {
      type: 'BETREUUNGSVERFUEGUNG',
      fileName: 'Betreuungsverfuegung.pdf',
      lines: generateBetreuungsverfuegungText(personalInfo, trustedPerson, alternatePerson, valuesAndWishes),
    },
  ];

  const results = [];

  for (const doc of docs) {
    const pdfBytes = await createPdfFromLines(doc.lines);
    const filePath = path.join(storageDir, doc.fileName);
    fs.writeFileSync(filePath, pdfBytes);

    const saved = await prisma.generatedDocument.create({
      data: {
        documentPackageId: packageId,
        documentType: doc.type as any,
        fileName: doc.fileName,
        filePath,
        fileSize: pdfBytes.length,
        wizardVersion,
      },
    });

    results.push({
      id: saved.id,
      documentType: saved.documentType,
      fileName: saved.fileName,
      generatedAt: saved.generatedAt.toISOString(),
    });
  }

  return results;
}
