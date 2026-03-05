import { WizardAnswers } from '../../types/wizard'

function formatDate(isoDate: string): string {
  try {
    const d = new Date(isoDate)
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return isoDate
  }
}

function relationshipLabel(rel: string): string {
  const map: Record<string, string> = {
    spouse: 'Ehepartner/in',
    partner: 'Lebenspartner/in',
    child: 'Kind',
    sibling: 'Geschwister',
    friend: 'Freund/in',
    other: 'Sonstige/r',
  }
  return map[rel] ?? rel
}

export function buildBetreuungsverfuegung(answers: WizardAnswers): string {
  const p = answers.personalInfo
  const t = answers.trustedPerson
  const v = answers.personalValues
  const today = new Date().toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const name = p ? `${p.firstName} ${p.lastName}` : '[Name nicht angegeben]'
  const dob = p ? formatDate(p.dateOfBirth) : '[Geburtsdatum nicht angegeben]'
  const placeOfBirth = p?.placeOfBirth ?? '[Geburtsort nicht angegeben]'
  const address = p
    ? `${p.streetAddress}, ${p.postalCode} ${p.city}, ${p.country}`
    : '[Adresse nicht angegeben]'

  const betreuer = t?.fullName ?? '[Name nicht angegeben]'
  const betreuerRel = t ? relationshipLabel(t.relationship) : ''
  const betreuerAddress = t
    ? `${t.streetAddress}, ${t.postalCode} ${t.city}`
    : '[Adresse nicht angegeben]'

  let html = `
<div class="document">
  <h1>Betreuungsverfügung</h1>
  <p class="subtitle">gemäß § 1820 BGB</p>

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
      Für den Fall, dass ich aufgrund von Krankheit, Behinderung oder anderen Umständen
      nicht mehr in der Lage bin, meine Angelegenheiten selbst zu regeln, und das
      Gericht für mich eine Betreuung einrichten muss, bitte ich, folgende Person als
      meine/n Betreuer/in zu bestellen:
    </p>
  </section>

  <section>
    <h2>Gewünschte Betreuungsperson</h2>
    <table class="info-table">
      <tr><td>Name:</td><td><strong>${betreuer}</strong></td></tr>
      <tr><td>Verhältnis:</td><td>${betreuerRel}</td></tr>
      <tr><td>Anschrift:</td><td>${betreuerAddress}</td></tr>
      ${t?.phone ? `<tr><td>Telefon:</td><td>${t.phone}</td></tr>` : ''}
      ${t?.email ? `<tr><td>E-Mail:</td><td>${t.email}</td></tr>` : ''}
    </table>
    <p>
      Ich vertraue dieser Person vollständig und bin überzeugt, dass sie meine
      Interessen in meinem Sinne wahrnehmen wird.
    </p>
  </section>
`

  if (t?.substitute) {
    const sub = t.substitute
    html += `
  <section>
    <h2>Ersatz-Betreuungsperson</h2>
    <p>
      Falls die oben genannte Person nicht als Betreuerin / Betreuer bestellt werden
      kann oder will, bitte ich, folgende Person zu bestellen:
    </p>
    <table class="info-table">
      <tr><td>Name:</td><td><strong>${sub.fullName}</strong></td></tr>
      <tr><td>Verhältnis:</td><td>${relationshipLabel(sub.relationship)}</td></tr>
      <tr><td>Anschrift:</td><td>${sub.streetAddress}, ${sub.postalCode} ${sub.city}</td></tr>
    </table>
  </section>
`
  }

  html += `
  <section>
    <h2>Aufgabenkreise der Betreuung</h2>
    <p>
      Ich wünsche, dass die Betreuungsperson für folgende Aufgabenkreise zuständig ist:
    </p>
    <ul>
      <li><strong>Gesundheitsfürsorge:</strong> Einwilligung in medizinische Behandlungen,
        Entscheidungen über ärztliche Maßnahmen, Abschluss von Behandlungsverträgen.</li>
      <li><strong>Aufenthaltsbestimmung:</strong> Festlegung und Änderung meines Wohnortes,
        Entscheidungen über die Unterbringung in Pflegeeinrichtungen.</li>
      <li><strong>Vermögenssorge:</strong> Verwaltung meines Vermögens und Regelung meiner
        finanziellen Angelegenheiten, soweit erforderlich.</li>
      <li><strong>Behördenverkehr:</strong> Vertretung gegenüber Behörden, Gerichten,
        Kranken- und Pflegekassen.</li>
      <li><strong>Wohnungsangelegenheiten:</strong> Kündigung oder Aufrechterhaltung
        meines Mietvertrages.</li>
    </ul>
  </section>

  <section>
    <h2>Ausschluss bestimmter Personen</h2>
    <p>
      Ich bitte das Betreuungsgericht ausdrücklich, folgende Personen <strong>nicht</strong>
      als Betreuer/in zu bestellen: [Hier können Sie ggf. Personen eintragen, die Sie
      ausschließen möchten — bitte handschriftlich ergänzen falls zutreffend]
    </p>
  </section>
`

  if (v?.valuesStatement) {
    html += `
  <section>
    <h2>Persönliche Wünsche und Wertvorstellungen</h2>
    <p>
      Die Betreuungsperson soll bei all ihren Entscheidungen folgende persönliche
      Wertvorstellungen und Wünsche berücksichtigen:
    </p>
    <p>${v.valuesStatement.replace(/\n/g, '<br/>')}</p>
  </section>
`
  }

  html += `
  <section>
    <h2>Wünsche für den Pflegefall</h2>
    <p>
      Falls eine Pflege notwendig wird, wünsche ich mir:
    </p>
    <ul>
      <li>Nach Möglichkeit eine Pflege zu Hause durch meine Vertrauensperson oder
          professionelle ambulante Pflegedienste.</li>
      <li>Falls eine stationäre Unterbringung notwendig ist: eine Einrichtung in der
          Nähe meiner Familie und Freunde.</li>
      <li>Die Wahrung meiner Würde, meiner Persönlichkeit und meiner Gewohnheiten
          soweit wie möglich.</li>
    </ul>
    <p><em>Bitte ergänzen Sie hier ggf. weitere spezifische Wünsche handschriftlich.</em></p>
  </section>

  <section>
    <h2>Hinweis</h2>
    <p>
      Eine Betreuungsverfügung ist kein Ersatz für eine Vorsorgevollmacht. Während die
      Vorsorgevollmacht direkt wirkt, muss das Gericht bei einer Betreuungsverfügung
      noch eine Betreuung einrichten. Das Gericht ist an Ihre Wünsche gebunden, sofern
      das Wohl der zu betreuenden Person dies zulässt.
    </p>
    <p>
      Es wird empfohlen, diese Betreuungsverfügung beim Betreuungsgericht (Amtsgericht)
      oder beim Zentralen Vorsorgeregister der Bundesnotarkammer zu hinterlegen.
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

  <footer>
    <p>Erstellt mit Vorsorge Wizard am ${today}. Dieses Dokument ersetzt keine professionelle rechtliche Beratung.</p>
  </footer>
</div>
`

  return html
}
