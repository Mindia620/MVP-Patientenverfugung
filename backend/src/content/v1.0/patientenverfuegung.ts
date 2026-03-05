import { WizardAnswers, TreatmentChoice, ScenarioChoice } from '../../types/wizard'

function formatDate(isoDate: string): string {
  try {
    const d = new Date(isoDate)
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return isoDate
  }
}

function treatmentText(choice: TreatmentChoice, treatmentName: string): string {
  switch (choice) {
    case 'yes':
      return `${treatmentName}: Ich wünsche die Durchführung dieser Maßnahme.`
    case 'no':
      return `${treatmentName}: Ich lehne diese Maßnahme ausdrücklich ab.`
    case 'doctor':
      return `${treatmentName}: Diese Entscheidung überlasse ich dem behandelnden Arzt bzw. meiner Vertrauensperson.`
  }
}

function scenarioText(choice: ScenarioChoice): string {
  switch (choice) {
    case 'life_sustaining':
      return 'Ich wünsche, dass alle medizinisch möglichen lebenserhaltenden Maßnahmen eingeleitet und aufrechterhalten werden.'
    case 'palliative_only':
      return 'Ich lehne lebenserhaltende Maßnahmen ab. Ich wünsche ausschließlich palliative Versorgung zur Linderung von Schmerzen und Leiden.'
    case 'trusted_person_decides':
      return 'Die Entscheidung über lebenserhaltende Maßnahmen überlasse ich meiner bevollmächtigten Vertrauensperson in Absprache mit dem behandelnden Arzt.'
  }
}

export function buildPatientenverfuegung(answers: WizardAnswers): string {
  const p = answers.personalInfo
  const m = answers.medicalPrefs
  const s = answers.scenarios
  const v = answers.personalValues
  const today = new Date().toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const name = p ? `${p.firstName} ${p.lastName}` : '[Name nicht angegeben]'
  const dob = p ? formatDate(p.dateOfBirth) : '[Geburtsdatum nicht angegeben]'
  const address = p
    ? `${p.streetAddress}, ${p.postalCode} ${p.city}, ${p.country}`
    : '[Adresse nicht angegeben]'
  const placeOfBirth = p?.placeOfBirth ?? '[Geburtsort nicht angegeben]'

  let html = `
<div class="document">
  <h1>Patientenverfügung</h1>
  <p class="subtitle">gemäß § 1827 BGB</p>

  <section>
    <h2>Angaben zur Person</h2>
    <table class="info-table">
      <tr><td>Name:</td><td><strong>${name}</strong></td></tr>
      <tr><td>Geburtsdatum:</td><td>${dob}</td></tr>
      <tr><td>Geburtsort:</td><td>${placeOfBirth}</td></tr>
      <tr><td>Anschrift:</td><td>${address}</td></tr>
    </table>
  </section>

  <section>
    <h2>Erklärung</h2>
    <p>
      Für den Fall, dass ich meinen Willen nicht mehr bilden oder verständlich äußern kann,
      verfüge ich hiermit vorsorglich und verbindlich Folgendes für alle medizinischen
      Maßnahmen, die in meiner Person vorgenommen werden sollen:
    </p>
    <p>
      Diese Verfügung wurde von mir in einwandfreiem Geisteszustand und nach reiflicher
      Überlegung erstellt. Sie gilt für alle Situationen, in denen ich meinen Willen nicht
      mehr bilden oder verständlich äußern kann.
    </p>
  </section>
`

  if (v?.valuesStatement) {
    html += `
  <section>
    <h2>Meine persönlichen Werte und Lebensvorstellungen</h2>
    <p>${v.valuesStatement.replace(/\n/g, '<br/>')}</p>
  </section>
`
  }

  html += `
  <section>
    <h2>Situationen, auf die sich diese Verfügung bezieht</h2>
`

  if (s) {
    html += `
    <h3>Situation 1: Unheilbare, zum Tode führende Erkrankung</h3>
    <p>
      Wenn ich an einer unheilbaren, weit fortgeschrittenen Erkrankung leide, die in
      absehbarer Zeit zum Tode führen wird, und keine Aussicht auf eine wesentliche
      Besserung besteht:
    </p>
    <p class="decision">${scenarioText(s.terminalIllness)}</p>
    ${s.terminalIllnessNotes ? `<p><em>Ergänzende Hinweise: ${s.terminalIllnessNotes}</em></p>` : ''}

    <h3>Situation 2: Irreversibles Koma / Dauerhaftes Bewusstsein</h3>
    <p>
      Wenn ich infolge einer Gehirnschädigung dauerhaft bewusstlos bin oder meine
      Hirnfunktionen dauerhaft so stark beeinträchtigt sind, dass ich nicht mehr
      kommunizieren kann, und keine Aussicht auf Wiedererlangung des Bewusstseins besteht:
    </p>
    <p class="decision">${scenarioText(s.irreversibleUnconscious)}</p>
    ${s.irreversibleUnconsciousNotes ? `<p><em>Ergänzende Hinweise: ${s.irreversibleUnconsciousNotes}</em></p>` : ''}

    <h3>Situation 3: Schwere Demenz</h3>
    <p>
      Wenn ich an einer weit fortgeschrittenen Demenzerkrankung leide, meine Persönlichkeit
      und mein Gedächtnis unwiederbringlich verloren sind und ich nicht mehr in der Lage bin,
      meinen Willen zu äußern:
    </p>
    <p class="decision">${scenarioText(s.severeDementia)}</p>
    ${s.severeDementiaExtra ? `<p><em>Weitere Wünsche zu diesem Szenario: ${s.severeDementiaExtra}</em></p>` : ''}
`
  }

  html += `  </section>`

  if (m) {
    html += `
  <section>
    <h2>Einwilligung und Ablehnung bestimmter medizinischer Maßnahmen</h2>
    <p>
      Für die oben beschriebenen Situationen treffe ich hinsichtlich folgender
      medizinischer Maßnahmen nachfolgende Entscheidungen:
    </p>
    <ul class="treatment-list">
      <li>${treatmentText(m.cpr, 'Wiederbelebungsmaßnahmen (CPR)')}</li>
      <li>${treatmentText(m.ventilation, 'Maschinelle Beatmung')}</li>
      <li>${treatmentText(m.artificialNutrition, 'Künstliche Ernährung und Flüssigkeitszufuhr')}</li>
      <li>${treatmentText(m.dialysis, 'Dialyse (Blutwäsche bei Nierenversagen)')}</li>
      <li>${treatmentText(m.antibiotics, 'Antibiotika und andere lebenserhaltende Medikamente')}</li>
      <li>${treatmentText(m.painManagement, 'Palliative Schmerztherapie und Leidenslinderung')}</li>
    </ul>
    <p>
      Ich weise ausdrücklich darauf hin, dass ich keine Schmerzlinderung ablehne, auch wenn
      diese das Leben möglicherweise verkürzt (indirekte Sterbehilfe), sofern ich dies
      oben angegeben habe.
    </p>
  </section>
`
  }

  if (v?.spiritualWishes) {
    html += `
  <section>
    <h2>Religiöse und spirituelle Wünsche</h2>
    <p>${v.spiritualWishes.replace(/\n/g, '<br/>')}</p>
  </section>
`
  }

  if (v?.specificExclusions) {
    html += `
  <section>
    <h2>Ausdrücklich abgelehnte Maßnahmen</h2>
    <p>${v.specificExclusions.replace(/\n/g, '<br/>')}</p>
  </section>
`
  }

  if (v?.organDonation) {
    const organText =
      v.organDonation === 'yes'
        ? 'Ich bin grundsätzlich zur Organspende bereit. Näheres regele ich in meinem Organspendeausweis.'
        : v.organDonation === 'no'
          ? 'Ich lehne eine Organspende ab.'
          : 'Meine Entscheidung zur Organspende habe ich bereits separat geregelt (Organspendeausweis).'

    html += `
  <section>
    <h2>Organspende</h2>
    <p>${organText}</p>
  </section>
`
  }

  html += `
  <section>
    <h2>Verbindlichkeit dieser Verfügung</h2>
    <p>
      Diese Patientenverfügung ist gemäß § 1827 BGB rechtsverbindlich. Ich erwarte, dass
      Ärzte und Pflegepersonal meine Entscheidungen respektieren und entsprechend handeln.
    </p>
    <p>
      Ich behalte mir vor, diese Verfügung jederzeit widerrufen oder ändern zu können.
      Eventuelle spätere handschriftliche Verfügungen oder Erklärungen gehen dieser
      Verfügung vor.
    </p>
    <p>
      Diese Patientenverfügung gilt ab sofort und hat keine zeitliche Begrenzung.
      Um Aktualität zu dokumentieren, empfehle ich eine regelmäßige Überprüfung und
      Bestätigung, mindestens alle zwei Jahre.
    </p>
  </section>

  <section class="signature-section">
    <h2>Unterschrift</h2>
    <div class="signature-grid">
      <div>
        <p>Ort, Datum</p>
        <div class="signature-line"></div>
        <p class="signature-label">__________________________</p>
      </div>
      <div>
        <p>Eigenhändige Unterschrift</p>
        <div class="signature-line"></div>
        <p class="signature-label">__________________________</p>
      </div>
    </div>
  </section>

  <section>
    <h2>Bestätigung durch Zeugen (empfohlen)</h2>
    <p>
      Die unterzeichnenden Personen bestätigen, dass der/die Verfasser/in obige
      Patientenverfügung im Vollbesitz seiner/ihrer geistigen Kräfte und ohne Druck
      erstellt hat:
    </p>
    <div class="witness-grid">
      <div class="witness">
        <p>Zeuge/Zeugin 1:</p>
        <div class="signature-line"></div>
        <p>Name: ______________________________</p>
        <p>Anschrift: _________________________</p>
        <p>Datum: _____________________________</p>
      </div>
      <div class="witness">
        <p>Zeuge/Zeugin 2:</p>
        <div class="signature-line"></div>
        <p>Name: ______________________________</p>
        <p>Anschrift: _________________________</p>
        <p>Datum: _____________________________</p>
      </div>
    </div>
  </section>

  <footer>
    <p>Erstellt mit Vorsorge Wizard am ${today}. Dieses Dokument ersetzt keine professionelle rechtliche Beratung.</p>
  </footer>
</div>
`

  return html
}
