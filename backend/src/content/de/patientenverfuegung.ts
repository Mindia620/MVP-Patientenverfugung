interface Answers {
  personalInfo?: {
    fullName?: string;
    dateOfBirth?: string;
    placeOfBirth?: string;
    address?: { street?: string; postalCode?: string; city?: string };
  };
  medicalPreferences?: Record<string, string>;
  scenarios?: Record<string, string | object>;
  additionalWishes?: string;
}

function formatPreference(val: string): string {
  if (val === 'yes') return 'Ja, ich wünsche diese Maßnahme.';
  if (val === 'no') return 'Nein, ich lehne diese Maßnahme ab.';
  return 'Die Entscheidung soll von den behandelnden Ärzten unter Berücksichtigung der konkreten Situation getroffen werden.';
}

export function renderPatientenverfuegung(answers: Answers): string {
  const p = answers.personalInfo || {};
  const addr = p.address || {};
  const med = answers.medicalPreferences || {};
  const wishes = answers.additionalWishes || '';

  const cpr = formatPreference(med.cpr || 'situation_dependent');
  const ventilation = formatPreference(med.ventilation || 'situation_dependent');
  const nutrition = formatPreference(med.artificialNutrition || 'situation_dependent');
  const dialysis = formatPreference(med.dialysis || 'situation_dependent');
  const antibiotics = formatPreference(med.antibiotics || 'situation_dependent');
  const pain = formatPreference(med.painManagement || 'situation_dependent');

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Patientenverfügung</title>
  <style>
    body { font-family: Georgia, serif; font-size: 11pt; line-height: 1.5; margin: 40px; color: #222; }
    h1 { font-size: 14pt; text-align: center; margin-bottom: 24px; }
    h2 { font-size: 12pt; margin-top: 20px; }
    p { margin: 8px 0; }
    .signature { margin-top: 40px; }
  </style>
</head>
<body>
  <h1>Patientenverfügung</h1>

  <p>Ich, <strong>${p.fullName || '[Name]'}</strong>, geboren am ${p.dateOfBirth || '[Datum]'} in ${p.placeOfBirth || '[Ort]'},</p>
  <p>wohnhaft ${addr.street || '[Straße]'}, ${addr.postalCode || '[PLZ]'} ${addr.city || '[Stadt]'},</p>

  <p>treffe hiermit folgende Verfügung für den Fall, dass ich mich nicht mehr selbst äußern kann:</p>

  <h2>1. Wiederbelebung (Reanimation)</h2>
  <p>${cpr}</p>

  <h2>2. Künstliche Beatmung</h2>
  <p>${ventilation}</p>

  <h2>3. Künstliche Ernährung</h2>
  <p>${nutrition}</p>

  <h2>4. Dialyse</h2>
  <p>${dialysis}</p>

  <h2>5. Antibiotika</h2>
  <p>${antibiotics}</p>

  <h2>6. Schmerztherapie</h2>
  <p>${pain}</p>

  ${wishes ? `<h2>7. Zusätzliche Wünsche</h2><p>${wishes.replace(/\n/g, '<br>')}</p>` : ''}

  <p class="signature">Ort, Datum: _________________________</p>
  <p>Unterschrift: _________________________</p>

  <p style="margin-top: 30px; font-size: 9pt; color: #666;">Hinweis: Dieses Dokument wurde mit Vorsorge Wizard erstellt. Es ersetzt keine rechtliche Beratung. Eine notarielle Beglaubigung kann in vielen Fällen empfohlen werden.</p>
</body>
</html>`;
}
