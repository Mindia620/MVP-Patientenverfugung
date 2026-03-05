import type { WizardAnswers } from '@/types'

export function assembleBetreuungsverfuegung(answers: WizardAnswers): string {
  const { personalInfo, representative, substituteRepresentative } = answers

  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`
  const birthDate = new Date(personalInfo.birthDate).toLocaleDateString('de-DE')
  const address = `${personalInfo.street}, ${personalInfo.postalCode} ${personalInfo.city}`
  const today = new Date().toLocaleDateString('de-DE')

  const repName = `${representative.firstName} ${representative.lastName}`
  const repAddress = `${representative.street}, ${representative.postalCode} ${representative.city}`

  const substituteSection = substituteRepresentative
    ? `
Ersatzperson (falls die Hauptperson nicht geeignet oder nicht
verfügbar ist):

  Name:       ${substituteRepresentative.firstName} ${substituteRepresentative.lastName}
  Adresse:    ${substituteRepresentative.street}, ${substituteRepresentative.postalCode} ${substituteRepresentative.city}
  Beziehung:  ${substituteRepresentative.relationship}${substituteRepresentative.phone ? `\n  Telefon:    ${substituteRepresentative.phone}` : ''}
`
    : ''

  return `BETREUUNGSVERFÜGUNG

gemäß §§ 1814, 1820 BGB

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ich, ${fullName},
geboren am ${birthDate} in ${personalInfo.birthPlace},
wohnhaft: ${address},

treffe für den Fall, dass das Betreuungsgericht für mich eine
rechtliche Betreuung einrichten muss, folgende Bestimmungen:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. WUNSCH ZUR BETREUERAUSWAHL

Ich wünsche, dass das Betreuungsgericht als Betreuer/in bestellt:

  Name:       ${repName}
  Adresse:    ${repAddress}
  Beziehung:  ${representative.relationship}${representative.phone ? `\n  Telefon:    ${representative.phone}` : ''}

Die genannte Person ist mit dieser Aufgabe einverstanden und
mir persönlich bekannt. Ich vertraue ihr, dass sie meine
Interessen im Sinne dieser Verfügung wahrnimmt.
${substituteSection}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. AUSDRÜCKLICH ABGELEHNTE PERSONEN

Für den Fall, dass das Gericht nach freiem Ermessen eine andere
Person als Betreuer/in bestellen möchte, erkläre ich:

Ich lehne die Bestellung folgender Personen oder Einrichtungen
ausdrücklich ab (soweit keine konkrete Person bekannt ist,
bitte handschriftlich ergänzen):

  Abgelehnte Person/Einrichtung: _________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. WÜNSCHE ZUR BETREUUNGSFÜHRUNG

3.1 Wohnen
  – Ich möchte so lange wie möglich in meiner gewohnten Umgebung
    wohnen bleiben.
  – Sollte eine Heimunterbringung erforderlich werden, ist mein
    Wunsch nach einer Einrichtung in meiner Heimatstadt zu
    berücksichtigen.

3.2 Gesundheit und Pflege
  – Meine Wünsche bezüglich medizinischer Behandlung sind in
    meiner Patientenverfügung (soweit vorhanden) niedergelegt.
  – Diese Wünsche sind vom Betreuer zu beachten und gegenüber
    Ärzten und Pflegenden durchzusetzen.

3.3 Finanzen
  – Über mein Vermögen soll sparsam und in meinem Sinne verfügt
    werden.
  – Größere Ausgaben bedürfen besonderer Sorgfalt.

3.4 Kommunikation und soziales Umfeld
  – Meine sozialen Kontakte sollen möglichst aufrechterhalten
    werden.
  – Post und Nachrichten sollen regelmäßig durchgesehen werden.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. VERHÄLTNIS ZUR VORSORGEVOLLMACHT

Sollte meine Vorsorgevollmacht wirksam und die bevollmächtigte
Person verfügbar und handlungsfähig sein, wird eine gesetzliche
Betreuung in der Regel entbehrlich sein.

Diese Betreuungsverfügung gilt hilfsweise für den Fall, dass
keine wirksame Vollmacht vorliegt oder die Vollmacht nicht
ausreicht.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HINWEIS: Dieses Dokument wurde mit dem Vorsorge Wizard erstellt.
Es ersetzt keine individuelle Rechtsberatung.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ort, Datum: _________________________, den ${today}

Unterschrift: _________________________
              ${fullName}
`
}
