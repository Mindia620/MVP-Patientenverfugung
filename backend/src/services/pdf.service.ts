import { chromium } from 'playwright';
import { renderPatientenverfuegung } from '../content/de/patientenverfuegung.js';
import { renderVorsorgevollmacht } from '../content/de/vorsorgevollmacht.js';
import { renderBetreuungsverfuegung } from '../content/de/betreuungsverfuegung.js';

const renderers: Record<string, (answers: object) => string> = {
  patientenverfuegung: renderPatientenverfuegung as (a: object) => string,
  vorsorgevollmacht: renderVorsorgevollmacht as (a: object) => string,
  betreuungsverfuegung: renderBetreuungsverfuegung as (a: object) => string,
};

export async function generatePdf(type: string, answers: object): Promise<Buffer> {
  const render = renderers[type];
  if (!render) {
    throw new Error(`Unknown document type: ${type}`);
  }

  const html = render(answers);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle' });
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
