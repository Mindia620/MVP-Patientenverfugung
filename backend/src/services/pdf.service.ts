import { chromium, Browser } from 'playwright'

let browser: Browser | null = null

async function getBrowser(): Promise<Browser> {
  if (!browser || !browser.isConnected()) {
    browser = await chromium.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
  }
  return browser
}

export async function closeBrowser(): Promise<void> {
  if (browser) {
    await browser.close()
    browser = null
  }
}

const DOCUMENT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Georgia', 'Times New Roman', serif;
    font-size: 11pt;
    line-height: 1.6;
    color: #1a1a1a;
    background: white;
  }

  .document {
    max-width: 170mm;
    margin: 0 auto;
    padding: 10mm 0;
  }

  h1 {
    font-size: 20pt;
    font-weight: 700;
    color: #1e3a5f;
    margin-bottom: 4pt;
    border-bottom: 2pt solid #1e3a5f;
    padding-bottom: 6pt;
  }

  .subtitle {
    font-size: 10pt;
    color: #555;
    margin-bottom: 16pt;
    font-style: italic;
  }

  h2 {
    font-size: 13pt;
    font-weight: 700;
    color: #1e3a5f;
    margin-top: 18pt;
    margin-bottom: 8pt;
    border-bottom: 0.5pt solid #ccd;
    padding-bottom: 3pt;
  }

  h3 {
    font-size: 11pt;
    font-weight: 700;
    color: #2c4a6e;
    margin-top: 12pt;
    margin-bottom: 6pt;
  }

  section {
    margin-bottom: 8pt;
  }

  p {
    margin-bottom: 8pt;
  }

  .info-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 10pt;
  }

  .info-table td {
    padding: 4pt 8pt 4pt 0;
    vertical-align: top;
  }

  .info-table td:first-child {
    width: 110pt;
    font-weight: 600;
    color: #444;
    white-space: nowrap;
  }

  .decision {
    background: #f0f4ff;
    border-left: 3pt solid #1e40af;
    padding: 8pt 12pt;
    margin: 8pt 0;
    font-style: italic;
  }

  .treatment-list {
    list-style: none;
    padding: 0;
  }

  .treatment-list li {
    padding: 6pt 0 6pt 16pt;
    border-bottom: 0.5pt solid #eee;
    position: relative;
  }

  .treatment-list li::before {
    content: '→';
    position: absolute;
    left: 0;
    color: #1e40af;
    font-weight: bold;
  }

  ul li {
    margin-left: 20pt;
    margin-bottom: 5pt;
  }

  .note {
    background: #fffbeb;
    border: 1pt solid #f59e0b;
    padding: 8pt 12pt;
    border-radius: 3pt;
    font-size: 10pt;
  }

  .signature-section {
    margin-top: 24pt;
    page-break-inside: avoid;
  }

  .signature-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20pt;
    margin-top: 12pt;
    margin-bottom: 20pt;
  }

  .signature-line {
    border-bottom: 1pt solid #333;
    height: 30pt;
    margin-bottom: 4pt;
  }

  .signature-label {
    font-size: 9pt;
    color: #666;
  }

  .witness-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20pt;
    margin-top: 12pt;
  }

  .witness {
    font-size: 10pt;
  }

  .witness p {
    margin-bottom: 4pt;
  }

  footer {
    margin-top: 24pt;
    padding-top: 8pt;
    border-top: 0.5pt solid #ccc;
    font-size: 8pt;
    color: #888;
    text-align: center;
    page-break-inside: avoid;
  }

  @media print {
    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    .signature-section { page-break-inside: avoid; }
    footer { page-break-inside: avoid; }
  }
`

export async function generatePdf(documentHtml: string): Promise<Buffer> {
  const b = await getBrowser()
  const page = await b.newPage()

  try {
    const fullHtml = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${DOCUMENT_CSS}</style>
</head>
<body>
  ${documentHtml}
</body>
</html>`

    await page.setContent(fullHtml, { waitUntil: 'load' })

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '20mm',
        right: '20mm',
      },
    })

    return Buffer.from(pdfBuffer)
  } finally {
    await page.close()
  }
}
