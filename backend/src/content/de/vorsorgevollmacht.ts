interface Answers {
  personalInfo?: {
    fullName?: string;
    dateOfBirth?: string;
    placeOfBirth?: string;
    address?: { street?: string; postalCode?: string; city?: string };
  };
  trustedPerson?: {
    fullName?: string;
    relationship?: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  alternatePerson?: {
    fullName?: string;
    relationship?: string;
  };
}

export function renderVorsorgevollmacht(answers: Answers): string {
  const p = answers.personalInfo || {};
  const addr = p.address || {};
  const tp = answers.trustedPerson || {};
  const alt = answers.alternatePerson || {};

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Vorsorgevollmacht</title>
  <style>
    body { font-family: Georgia, serif; font-size: 11pt; line-height: 1.5; margin: 40px; color: #222; }
    h1 { font-size: 14pt; text-align: center; margin-bottom: 24px; }
    p { margin: 8px 0; }
    .signature { margin-top: 40px; }
  </style>
</head>
<body>
  <h1>Vorsorgevollmacht</h1>

  <p>Ich, <strong>${p.fullName || '[Name]'}</strong>, geboren am ${p.dateOfBirth || '[Datum]'} in ${p.placeOfBirth || '[Ort]'},</p>
  <p>wohnhaft ${addr.street || '[Straße]'}, ${addr.postalCode || '[PLZ]'} ${addr.city || '[Stadt]'},</p>

  <p>ermächtige hiermit</p>

  <p><strong>${tp.fullName || '[Name der Vertrauensperson]'}</strong>, ${tp.relationship || '[Beziehung]'},</p>
  ${tp.address ? `<p>wohnhaft ${tp.address},</p>` : ''}
  ${tp.phone ? `<p>Tel.: ${tp.phone}</p>` : ''}
  ${tp.email ? `<p>E-Mail: ${tp.email}</p>` : ''}

  <p>in allen Angelegenheiten, in denen ich auf Grund von Krankheit, Unfall oder Alter nicht mehr in der Lage bin, meine Angelegenheiten selbst zu besorgen, für mich zu handeln und mich zu vertreten.</p>

  <p>Die Vollmacht umfasst insbesondere:</p>
  <ul>
    <li>Gesundheitsangelegenheiten und Einwilligung in medizinische Maßnahmen</li>
    <li>Vermögensangelegenheiten</li>
    <li>Behördenangelegenheiten</li>
    <li>Wohnungsangelegenheiten</li>
  </ul>

  ${alt.fullName ? `
  <p>Als Ersatzperson bevollmächtige ich <strong>${alt.fullName}</strong> (${alt.relationship || 'Beziehung'}), für den Fall, dass die oben genannte Person verhindert ist.</p>
  ` : ''}

  <p class="signature">Ort, Datum: _________________________</p>
  <p>Unterschrift: _________________________</p>

  <p style="margin-top: 30px; font-size: 9pt; color: #666;">Hinweis: Dieses Dokument wurde mit Vorsorge Wizard erstellt. Eine notarielle Beglaubigung der Vorsorgevollmacht wird in vielen Fällen empfohlen.</p>
</body>
</html>`;
}
