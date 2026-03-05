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

export function buildVorsorgevollmacht(answers: WizardAnswers): string {
  const p = answers.personalInfo
  const t = answers.trustedPerson
  const today = new Date().toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const vollmachtgeber = p ? `${p.firstName} ${p.lastName}` : '[Name nicht angegeben]'
  const dob = p ? formatDate(p.dateOfBirth) : '[Geburtsdatum nicht angegeben]'
  const placeOfBirth = p?.placeOfBirth ?? '[Geburtsort nicht angegeben]'
  const address = p
    ? `${p.streetAddress}, ${p.postalCode} ${p.city}, ${p.country}`
    : '[Adresse nicht angegeben]'

  const bevollmaechtigter = t?.fullName ?? '[Name der Vertrauensperson nicht angegeben]'
  const bevRel = t ? relationshipLabel(t.relationship) : ''
  const bevAddress = t
    ? `${t.streetAddress}, ${t.postalCode} ${t.city}`
    : '[Adresse nicht angegeben]'
  const bevPhone = t?.phone ?? '—'
  const bevEmail = t?.email ?? '—'

  let html = `
<div class="document">
  <h1>Vorsorgevollmacht</h1>

  <section>
    <h2>Vollmachtgeber/in</h2>
    <table class="info-table">
      <tr><td>Name:</td><td><strong>${vollmachtgeber}</strong></td></tr>
      <tr><td>Geburtsdatum:</td><td>${dob}</td></tr>
      <tr><td>Geburtsort:</td><td>${placeOfBirth}</td></tr>
      <tr><td>Anschrift:</td><td>${address}</td></tr>
    </table>
  </section>

  <section>
    <h2>Bevollmächtigte Person</h2>
    <p>
      Ich erteile hiermit folgende Person Vollmacht, mich in den unten genannten
      Bereichen zu vertreten:
    </p>
    <table class="info-table">
      <tr><td>Name:</td><td><strong>${bevollmaechtigter}</strong></td></tr>
      <tr><td>Verhältnis:</td><td>${bevRel}</td></tr>
      <tr><td>Anschrift:</td><td>${bevAddress}</td></tr>
      <tr><td>Telefon:</td><td>${bevPhone}</td></tr>
      <tr><td>E-Mail:</td><td>${bevEmail}</td></tr>
    </table>
  </section>
`

  if (t?.substitute) {
    const sub = t.substitute
    html += `
  <section>
    <h2>Ersatzbevollmächtigte Person</h2>
    <p>
      Für den Fall, dass die bevollmächtigte Person die Vollmacht nicht ausüben kann
      oder will, erteile ich folgende Ersatzperson Vollmacht:
    </p>
    <table class="info-table">
      <tr><td>Name:</td><td><strong>${sub.fullName}</strong></td></tr>
      <tr><td>Verhältnis:</td><td>${relationshipLabel(sub.relationship)}</td></tr>
      <tr><td>Anschrift:</td><td>${sub.streetAddress}, ${sub.postalCode} ${sub.city}</td></tr>
      ${sub.phone ? `<tr><td>Telefon:</td><td>${sub.phone}</td></tr>` : ''}
    </table>
  </section>
`
  }

  html += `
  <section>
    <h2>Umfang der Vollmacht</h2>
    <p>Die Vollmacht gilt für alle nachfolgend genannten Bereiche:</p>

    <h3>1. Gesundheitsfürsorge und Medizinische Entscheidungen</h3>
    <p>
      Die bevollmächtigte Person ist befugt, in alle Maßnahmen der Heilbehandlung und
      ärztliche Eingriffe einzuwilligen, sie abzulehnen oder zu widerrufen, auch wenn
      die Gefahr besteht, dass ich infolge der Ablehnung oder des Widerrufs versterbe
      oder einen schwerwiegenden gesundheitlichen Schaden erleide.
    </p>
    <p>
      Dies umfasst insbesondere: die Einwilligung oder Ablehnung von Operationen,
      medizinischen Behandlungen, Medikamentengaben, diagnostischen Maßnahmen sowie
      die Entscheidung über die Unterbringung in einer Klinik oder einem Pflegeheim.
    </p>
    <p>
      Diese Vollmacht ist im Zusammenhang mit meiner Patientenverfügung auszuüben.
    </p>

    <h3>2. Aufenthaltsbestimmung</h3>
    <p>
      Die bevollmächtigte Person ist berechtigt, meinen Aufenthalt zu bestimmen und
      einen Wechsel meines Wohnortes oder Pflegeheimes zu veranlassen.
    </p>

    <h3>3. Einsicht in Krankenunterlagen</h3>
    <p>
      Die bevollmächtigte Person ist berechtigt, meine Krankenakten und sonstigen
      Unterlagen einzusehen und Auskünfte bei Ärzten, Krankenhäusern und
      Pflegeeinrichtungen einzuholen. Ich entbinde alle behandelnden Ärzte und
      Pflegepersonen gegenüber der bevollmächtigten Person von ihrer Schweigepflicht.
    </p>

    <h3>4. Kommunikation mit Behörden</h3>
    <p>
      Die bevollmächtigte Person ist berechtigt, mich gegenüber Behörden, Gerichten,
      Kranken- und Pflegekassen sowie anderen Institutionen zu vertreten.
    </p>

    <h3>5. Vermögensangelegenheiten</h3>
    <p>
      Die bevollmächtigte Person ist berechtigt, mein gesamtes Vermögen zu verwalten
      und mich in allen vermögensrechtlichen Angelegenheiten zu vertreten, soweit
      dies für die Durchführung der Gesundheitssorge und Aufenthaltsbestimmung
      erforderlich ist.
    </p>
    <p class="note">
      <strong>Hinweis:</strong> Für umfangreichere Vermögensvollmachten (z.B. Immobilientransaktionen)
      wird eine notarielle Beurkundung empfohlen.
    </p>
  </section>

  <section>
    <h2>Geltung der Vollmacht</h2>
    <p>
      Diese Vollmacht gilt ab dem Zeitpunkt ihrer Ausstellung. Sie gilt über meinen
      Tod hinaus, soweit der Zweck der jeweiligen Handlung dies erfordert.
    </p>
    <p>
      Die Vollmacht gilt auch im Falle meiner Geschäftsunfähigkeit. Die bevollmächtigte
      Person soll mich von der Bestellung eines Betreuers freistellen, indem sie die
      ihr eingeräumten Befugnisse verantwortungsvoll wahrnimmt.
    </p>
    <p>
      Ich kann diese Vollmacht jederzeit widerrufen, solange ich dazu in der Lage bin.
    </p>
  </section>

  <section>
    <h2>Hinweis zur notariellen Beglaubigung</h2>
    <p>
      Für bestimmte Rechtsgeschäfte (insbesondere Immobilientransaktionen, Grundbucheintragungen)
      ist eine notarielle Beurkundung dieser Vollmacht erforderlich. Es wird empfohlen,
      diese Vollmacht notariell beglaubigen zu lassen, um ihre Akzeptanz durch alle
      Institutionen sicherzustellen.
    </p>
  </section>

  <section class="signature-section">
    <h2>Unterschrift des Vollmachtgebers / der Vollmachtgeberin</h2>
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

    <h3>Bestätigung der bevollmächtigten Person</h3>
    <p>
      Ich, ${bevollmaechtigter}, nehme die mir erteilte Vollmacht an und erkläre,
      diese verantwortungsvoll und ausschließlich im Sinne des Vollmachtgebers /
      der Vollmachtgeberin auszuüben:
    </p>
    <div class="signature-grid">
      <div>
        <p>Ort, Datum</p>
        <div class="signature-line"></div>
        <p class="signature-label">__________________________</p>
      </div>
      <div>
        <p>Unterschrift der bevollmächtigten Person</p>
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
