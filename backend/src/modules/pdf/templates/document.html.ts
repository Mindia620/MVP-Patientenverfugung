export function buildDocumentHtml(title: string, content: string): string {
  const escapedContent = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  const htmlContent = escapedContent
    .replace(/━+/g, '<hr class="divider">')
    .replace(/\n/g, '<br>')

  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 11pt;
    line-height: 1.6;
    color: #1a1a1a;
    background: white;
  }

  .page {
    width: 210mm;
    min-height: 297mm;
    padding: 20mm 22mm 20mm 22mm;
    margin: 0 auto;
  }

  .header {
    border-bottom: 2px solid #1a1a1a;
    padding-bottom: 12px;
    margin-bottom: 20px;
  }

  .document-title {
    font-size: 18pt;
    font-weight: bold;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #1a1a1a;
  }

  .document-subtitle {
    font-size: 10pt;
    color: #555;
    margin-top: 4px;
  }

  .content {
    font-size: 10.5pt;
    line-height: 1.7;
  }

  .content br { display: block; margin-bottom: 0; }

  hr.divider {
    border: none;
    border-top: 1px solid #ccc;
    margin: 14px 0;
  }

  .disclaimer {
    margin-top: 30px;
    padding: 10px 14px;
    border: 1px solid #e0a000;
    background: #fffbf0;
    font-size: 9pt;
    color: #7a5000;
    border-radius: 4px;
  }

  .footer {
    position: fixed;
    bottom: 10mm;
    left: 22mm;
    right: 22mm;
    font-size: 8pt;
    color: #888;
    border-top: 1px solid #ddd;
    padding-top: 6px;
    display: flex;
    justify-content: space-between;
  }

  @page {
    size: A4;
    margin: 0;
  }

  @media print {
    .page { page-break-after: always; }
  }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="document-title">${title}</div>
    <div class="document-subtitle">Erstellt mit Vorsorge Wizard &mdash; ${new Date().toLocaleDateString('de-DE')}</div>
  </div>
  
  <div class="content">
    ${htmlContent}
  </div>

  <div class="disclaimer">
    <strong>Wichtiger Hinweis:</strong> Dieses Dokument wurde mit dem Vorsorge Wizard erstellt und stellt keine Rechtsberatung dar. 
    Es ersetzt keine individuelle rechtliche oder medizinische Beratung. 
    Dieses Dokument muss eigenhändig unterschrieben und datiert werden, um rechtlich wirksam zu sein.
  </div>
</div>

<div class="footer">
  <span>${title} &mdash; Vorsorge Wizard</span>
  <span>vorsorge-wizard.de</span>
</div>
</body>
</html>`
}
