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
  };
}

export function renderBetreuungsverfuegung(answers: Answers): string {
  const p = answers.personalInfo || {};
  const addr = p.address || {};
  const tp = answers.trustedPerson || {};

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Betreuungsverfügung</title>
  <style>
    body { font-family: Georgia, serif; font-size: 11pt; line-height: 1.5; margin: 40px; color: #222; }
    h1 { font-size: 14pt; text-align: center; margin-bottom: 24px; }
    p { margin: 8px 0; }
    .signature { margin-top: 40px; }
  </style>
</head>
<body>
  <h1>Betreuungsverfügung</h1>

  <p>Ich, <strong>${p.fullName || '[Name]'}</strong>, geboren am ${p.dateOfBirth || '[Datum]'} in ${p.placeOfBirth || '[Ort]'},</p>
  <p>wohnhaft ${addr.street || '[Straße]'}, ${addr.postalCode || '[PLZ]'} ${addr.city || '[Stadt]'},</p>

  <p>erkläre hiermit für den Fall, dass das Betreuungsgericht die Bestellung eines Betreuers oder einer Betreuerin für mich für erforderlich hält:</p>

  <p>Ich wünsche, dass <strong>${tp.fullName || '[Name der Vertrauensperson]'}</strong> (${tp.relationship || '[Beziehung]'}) als Betreuerin bzw. Betreuer für mich bestellt wird.</p>

  <p>Falls diese Person nicht zur Übernahme der Betreuung bereit oder in der Lage sein sollte, bitte ich das Gericht, mich vor der Bestellung einer anderen Person anzuhören.</p>

  <p>Ich wünsche, dass die Betreuung auf die erforderlichen Aufgabenbereiche beschränkt wird und dass meine Wünsche und Wertvorstellungen berücksichtigt werden.</p>

  <p class="signature">Ort, Datum: _________________________</p>
  <p>Unterschrift: _________________________</p>

  <p style="margin-top: 30px; font-size: 9pt; color: #666;">Hinweis: Dieses Dokument wurde mit Vorsorge Wizard erstellt. Die Betreuungsverfügung ist eine Empfehlung an das Gericht; die endgültige Entscheidung trifft das Betreuungsgericht.</p>
</body>
</html>`;
}
