import { chromium } from 'playwright-core'
import { buildDocumentHtml } from './templates/document.html.js'

type WizardAnswers = {
  personalInfo: {
    firstName: string
    lastName: string
    birthDate: string
    birthPlace: string
    street: string
    postalCode: string
    city: string
  }
  representative: {
    firstName: string
    lastName: string
    relationship: string
    street: string
    postalCode: string
    city: string
    phone?: string
  }
  substituteRepresentative?: {
    firstName: string
    lastName: string
    relationship: string
    street: string
    postalCode: string
    city: string
    phone?: string
  }
  medicalPreferences: {
    cpr: string
    ventilation: string
    artificialNutrition: string
    dialysis: string
    antibiotics: string
    painManagement: string
  }
  scenarioChoices: {
    terminalIllness: string[]
    irreversibleUnconsciousness: string[]
    severeDementia: string[]
  }
  personalValues: {
    personalStatement?: string
    religiousWishes?: string
    organDonation: string
  }
}

function treatmentText(choice: string, yes: string, no: string, doctor: string): string {
  if (choice === 'yes') return yes
  if (choice === 'no') return no
  return doctor
}

function assemblePatientenverfuegung(answers: WizardAnswers): string {
  const { personalInfo: p, representative: r, medicalPreferences: m, scenarioChoices: sc, personalValues: pv } = answers
  const fullName = `${p.firstName} ${p.lastName}`
  const birthDate = new Date(p.birthDate).toLocaleDateString('de-DE')
  const today = new Date().toLocaleDateString('de-DE')

  const terminalMap: Record<string, string> = {
    noLifeProlonging: 'Lebensverlängernde Maßnahmen sollen unterbleiben',
    dieAtHome: 'Ich möchte nach Möglichkeit in meiner gewohnten Umgebung sterben',
    palliativeCare: 'Ich wünsche Palliativversorgung und ggf. Hospizbegleitung',
    painOverLife: 'Die Linderung meiner Beschwerden hat Vorrang vor der Lebensverlängerung',
  }
  const unconsciousMap: Record<string, string> = {
    noLifeProlonging: 'Lebensverlängernde Maßnahmen sollen unterbleiben',
    noArtificialNutrition: 'Auf künstliche Ernährung soll verzichtet werden',
    noVentilation: 'Auf maschinelle Beatmung soll verzichtet werden',
  }
  const dementiaMap: Record<string, string> = {
    noLifeProlonging: 'Lebensverlängernde Maßnahmen sollen unterbleiben',
    noHospital: 'Krankenhauseinweisungen sollen nach Möglichkeit vermieden werden',
    palliativeFocus: 'Wohlfühl- und Palliativmaßnahmen haben Vorrang',
  }

  const terminalWishes = sc.terminalIllness.length > 0
    ? sc.terminalIllness.map(w => `    – ${terminalMap[w] ?? w}`).join('\n')
    : '    – Keine besonderen Wünsche angegeben'
  const unconsciousWishes = sc.irreversibleUnconsciousness.length > 0
    ? sc.irreversibleUnconsciousness.map(w => `    – ${unconsciousMap[w] ?? w}`).join('\n')
    : '    – Keine besonderen Wünsche angegeben'
  const dementiaWishes = sc.severeDementia.length > 0
    ? sc.severeDementia.map(w => `    – ${dementiaMap[w] ?? w}`).join('\n')
    : '    – Keine besonderen Wünsche angegeben'

  const painText = {
    maxRelief: 'Die Linderung von Schmerzen, Atemnot und anderen belastenden Symptomen ist mir besonders wichtig, auch wenn dadurch eine Lebensverkürzung eintreten sollte.',
    lifeFirst: 'Der Erhalt meines Lebens hat Vorrang. Schmerzmittel sollen nur so weit eingesetzt werden, wie sie das Leben nicht verkürzen.',
    balanced: 'Ich wünsche angemessene Schmerzlinderung unter Berücksichtigung des Lebensschutzes.',
  }[m.painManagement] ?? ''

  const organText = {
    yes: 'Ich bin Organspender. Meine Organe sollen nach meinem Tod gespendet werden.',
    no: 'Ich bin kein Organspender.',
    unspecified: 'Zur Organspende treffe ich in diesem Dokument keine Aussage.',
  }[pv.organDonation] ?? ''

  return `PATIENTENVERFÜGUNG
gemäß § 1827 BGB

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ich, ${fullName},
geboren am ${birthDate} in ${p.birthPlace},
wohnhaft: ${p.street}, ${p.postalCode} ${p.city},

bestimme hiermit für den Fall, dass ich meinen Willen nicht mehr
bilden oder verständlich äußern kann, Folgendes:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. GELTUNGSBEREICH

Diese Patientenverfügung gilt für alle Situationen, in denen ich
krankheitsbedingt nicht mehr in der Lage bin, meinen Willen zu äußern.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. MEDIZINISCHE MAßNAHMEN

2.1 Wiederbelebung (CPR)
${treatmentText(m.cpr,
  'Ich wünsche, dass im Fall eines Herzstillstands eine Wiederbelebung versucht wird.',
  'Ich wünsche KEINEN Reanimationsversuch.',
  'Die Entscheidung überlasse ich dem behandelnden Arzt.'
)}

2.2 Künstliche Beatmung
${treatmentText(m.ventilation,
  'Ich wünsche den Einsatz künstlicher Beatmung.',
  'Auf maschinelle Beatmung soll verzichtet werden.',
  'Die Entscheidung überlasse ich dem behandelnden Arzt.'
)}

2.3 Künstliche Ernährung
${treatmentText(m.artificialNutrition,
  'Ich wünsche den Einsatz künstlicher Ernährung.',
  'Auf künstliche Ernährung und Flüssigkeitszufuhr soll verzichtet werden.',
  'Die Entscheidung überlasse ich dem behandelnden Arzt.'
)}

2.4 Dialyse
${treatmentText(m.dialysis,
  'Ich wünsche den Einsatz der Dialyse.',
  'Auf Dialyse soll verzichtet werden.',
  'Die Entscheidung überlasse ich dem behandelnden Arzt.'
)}

2.5 Antibiotika
${treatmentText(m.antibiotics,
  'Ich wünsche den Einsatz von Antibiotika auch bei lebensbedrohlichen Infektionen.',
  'Antibiotika sollen nur noch zur Linderung von Beschwerden eingesetzt werden.',
  'Die Entscheidung überlasse ich dem behandelnden Arzt.'
)}

2.6 Schmerzbehandlung
${painText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. SITUATIONSBEZOGENE FESTLEGUNGEN

3.1 Bei unheilbarer, zum Tode führender Erkrankung
${terminalWishes}

3.2 Bei dauerhafter Bewusstlosigkeit
${unconsciousWishes}

3.3 Bei schwerer Demenz
${dementiaWishes}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. PERSÖNLICHE WERTE${pv.personalStatement ? `\n\n${pv.personalStatement}` : '\n\nKeine persönliche Erklärung angegeben.'}
${pv.religiousWishes ? `\n\nReligiöse Wünsche:\n${pv.religiousWishes}` : ''}

Organspende: ${organText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. VERTRAUENSPERSON

  Name:    ${r.firstName} ${r.lastName}
  Adresse: ${r.street}, ${r.postalCode} ${r.city}${r.phone ? `\n  Telefon: ${r.phone}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ort, Datum: _________________________, den ${today}

Unterschrift: _________________________
              ${fullName}`
}

function assembleVorsorgevollmacht(answers: WizardAnswers): string {
  const { personalInfo: p, representative: r, substituteRepresentative: sub } = answers
  const fullName = `${p.firstName} ${p.lastName}`
  const birthDate = new Date(p.birthDate).toLocaleDateString('de-DE')
  const today = new Date().toLocaleDateString('de-DE')

  const subSection = sub ? `
Ersatzbevollmächtigte/r:
  Name:       ${sub.firstName} ${sub.lastName}
  Adresse:    ${sub.street}, ${sub.postalCode} ${sub.city}${sub.phone ? `\n  Telefon:    ${sub.phone}` : ''}
` : ''

  return `VORSORGEVOLLMACHT

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ich, ${fullName},
geboren am ${birthDate} in ${p.birthPlace},
wohnhaft: ${p.street}, ${p.postalCode} ${p.city},

erteile hiermit Vollmacht an:

  Name:       ${r.firstName} ${r.lastName}
  Adresse:    ${r.street}, ${r.postalCode} ${r.city}
  Beziehung:  ${r.relationship}${r.phone ? `\n  Telefon:    ${r.phone}` : ''}
${subSection}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. UMFANG DER VOLLMACHT

1.1 Gesundheitssorge: Entscheidungen über ärztliche Heilbehandlung,
    Krankenhausaufnahme, Einsicht in Krankenunterlagen, Entbindung
    der Ärzte von der Schweigepflicht sowie Entscheidungen über
    lebenserhaltende und lebensverlängernde Maßnahmen.

1.2 Vermögenssorge: Verwaltung des Vermögens, Bankgeschäfte,
    Abschluss und Kündigung von Verträgen.

1.3 Behörden und Gerichte: Vertretung vor Behörden und Gerichten.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. WIRKSAMKEIT

Diese Vollmacht ist sofort wirksam und gilt über den Tod hinaus
(transmortale Vollmacht).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. VERHÄLTNIS ZUR PATIENTENVERFÜGUNG

Die bevollmächtigte Person ist an den Inhalt meiner
Patientenverfügung (soweit vorhanden) gebunden.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ort, Datum: _________________________, den ${today}

Unterschrift Vollmachtgeber/in: _________________________
                                 ${fullName}

Unterschrift Bevollmächtigte/r: _________________________
                                 ${r.firstName} ${r.lastName}`
}

function assembleBetreuungsverfuegung(answers: WizardAnswers): string {
  const { personalInfo: p, representative: r, substituteRepresentative: sub } = answers
  const fullName = `${p.firstName} ${p.lastName}`
  const birthDate = new Date(p.birthDate).toLocaleDateString('de-DE')
  const today = new Date().toLocaleDateString('de-DE')

  const subSection = sub ? `
Ersatzperson:
  Name:       ${sub.firstName} ${sub.lastName}
  Adresse:    ${sub.street}, ${sub.postalCode} ${sub.city}${sub.phone ? `\n  Telefon:    ${sub.phone}` : ''}
` : ''

  return `BETREUUNGSVERFÜGUNG
gemäß §§ 1814, 1820 BGB

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ich, ${fullName},
geboren am ${birthDate} in ${p.birthPlace},
wohnhaft: ${p.street}, ${p.postalCode} ${p.city},

treffe für den Fall, dass das Betreuungsgericht für mich eine
rechtliche Betreuung einrichten muss, folgende Bestimmungen:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. WUNSCH ZUR BETREUERAUSWAHL

Ich wünsche als Betreuer/in:

  Name:       ${r.firstName} ${r.lastName}
  Adresse:    ${r.street}, ${r.postalCode} ${r.city}
  Beziehung:  ${r.relationship}${r.phone ? `\n  Telefon:    ${r.phone}` : ''}
${subSection}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. WÜNSCHE ZUR BETREUUNGSFÜHRUNG

– Ich möchte so lange wie möglich in meiner gewohnten Umgebung wohnen.
– Meine Patientenverfügung (soweit vorhanden) ist zu beachten.
– Soziale Kontakte sollen aufrechterhalten werden.
– Über mein Vermögen soll sparsam verfügt werden.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ort, Datum: _________________________, den ${today}

Unterschrift: _________________________
              ${fullName}`
}

export const pdfService = {
  async generatePdf(htmlContent: string): Promise<Buffer> {
    const browser = await chromium.launch({
      executablePath: process.env.CHROMIUM_PATH ?? '/usr/local/bin/google-chrome',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    })

    try {
      const page = await browser.newPage()
      await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' })
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
      })
      return Buffer.from(pdf)
    } finally {
      await browser.close()
    }
  },

  buildPatientenverfuegung(answers: WizardAnswers): string {
    const text = assemblePatientenverfuegung(answers)
    return buildDocumentHtml('Patientenverfügung', text)
  },

  buildVorsorgevollmacht(answers: WizardAnswers): string {
    const text = assembleVorsorgevollmacht(answers)
    return buildDocumentHtml('Vorsorgevollmacht', text)
  },

  buildBetreuungsverfuegung(answers: WizardAnswers): string {
    const text = assembleBetreuungsverfuegung(answers)
    return buildDocumentHtml('Betreuungsverfügung', text)
  },
}
