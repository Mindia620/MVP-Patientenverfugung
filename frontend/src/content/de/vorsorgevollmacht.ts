import type { WizardAnswers } from '@/types'

export function assembleVorsorgevollmacht(answers: WizardAnswers): string {
  const { personalInfo, representative, substituteRepresentative } = answers

  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`
  const birthDate = new Date(personalInfo.birthDate).toLocaleDateString('de-DE')
  const address = `${personalInfo.street}, ${personalInfo.postalCode} ${personalInfo.city}`
  const today = new Date().toLocaleDateString('de-DE')

  const repName = `${representative.firstName} ${representative.lastName}`
  const repAddress = `${representative.street}, ${representative.postalCode} ${representative.city}`
  const repRelationship = representative.relationship

  const substituteSection = substituteRepresentative
    ? `
Ersatzbevollmächtigte/r:
  Name:       ${substituteRepresentative.firstName} ${substituteRepresentative.lastName}
  Adresse:    ${substituteRepresentative.street}, ${substituteRepresentative.postalCode} ${substituteRepresentative.city}
  Beziehung:  ${substituteRepresentative.relationship}${substituteRepresentative.phone ? `\n  Telefon:    ${substituteRepresentative.phone}` : ''}

Die Ersatzbevollmächtigte / der Ersatzbevollmächtigte ist nur
handlungsbefugt, wenn die erstgenannte bevollmächtigte Person
verhindert oder nicht erreichbar ist.
`
    : ''

  return `VORSORGEVOLLMACHT

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ich, ${fullName},
geboren am ${birthDate} in ${personalInfo.birthPlace},
wohnhaft: ${address},

erteile hiermit Vollmacht an:

Bevollmächtigte/r:
  Name:       ${repName}
  Adresse:    ${repAddress}
  Beziehung:  ${repRelationship}${representative.phone ? `\n  Telefon:    ${representative.phone}` : ''}
${substituteSection}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. UMFANG DER VOLLMACHT

Die Vollmacht gilt für folgende Bereiche:

1.1 Gesundheitssorge und Medizin
  – Entscheidungen über ärztliche Heilbehandlung und Pflegemaßnahmen
  – Entscheidungen über Krankenhausaufnahme und -entlassung
  – Einsicht in Krankenunterlagen; Entbindung der Ärzte von der
    Schweigepflicht
  – Entscheidungen, die gefährliche oder mit Todesgefahr verbundene
    Maßnahmen betreffen (ausdrückliche Vollmacht gemäß § 1820 Abs. 2 BGB)
  – Entscheidungen über lebenserhaltende und lebensverlängernde
    Maßnahmen, auch wenn dadurch mein Tod eintreten könnte
  – Unterbringung in einem Heim oder einer Einrichtung

1.2 Vermögenssorge
  – Verwaltung meines Vermögens einschließlich Bankgeschäften
    (Girokonto, Sparbuch, Wertpapiere)
  – Abschluss, Änderung und Kündigung von Verträgen
  – Entgegennahme und Abgabe von Willenserklärungen

1.3 Behörden und Gerichte
  – Vertretung vor Behörden, Ämtern und Gerichten
  – Entgegennahme von Bescheiden, Urteilen und sonstigen
    Schriftstücken

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. WIRKSAMKEIT

Diese Vollmacht ist wirksam ab dem Zeitpunkt, ab dem ich nicht mehr
in der Lage bin, meinen Willen zu bilden und/oder zu äußern
(Innenvollmacht). Für den Rechtsverkehr ist sie sofort wirksam
(Außenvollmacht).

Die Vollmacht gilt über meinen Tod hinaus (transmortale Vollmacht).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. VERHÄLTNIS ZUR PATIENTENVERFÜGUNG

Meine bevollmächtigte Person ist an den Inhalt meiner
Patientenverfügung (soweit vorhanden) gebunden. Sie hat meinen
dort niedergelegten Willen gegenüber Ärzten und Pflegenden
durchzusetzen.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. BEFREIUNG VOM SELBSTKONTRAHIERUNGSVERBOT

Die bevollmächtigte Person ist von den Beschränkungen des § 181
BGB (Selbstkontrahierungsverbot) befreit, soweit gesetzlich
zulässig.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. WIDERRUF

Diese Vollmacht kann jederzeit gegenüber der bevollmächtigten
Person oder einem beteiligten Dritten widerrufen werden.
Bei meiner Handlungsfähigkeit erlischt die Vollmacht auf Widerruf
sofort.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HINWEIS: Dieses Dokument wurde mit dem Vorsorge Wizard erstellt.
Es ersetzt keine individuelle Rechtsberatung. Für Grundstücks-
geschäfte ist eine notarielle Beurkundung erforderlich.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ort, Datum: _________________________, den ${today}

Unterschrift Vollmachtgeber/in: _________________________
                                 ${fullName}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ich, ${repName}, nehme diese Vollmacht an und erkläre mich bereit,
die Interessen von ${fullName} nach bestem Wissen und Gewissen
zu vertreten.

Unterschrift Bevollmächtigte/r: _________________________
                                 ${repName}
`
}
