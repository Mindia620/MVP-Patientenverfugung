import type { WizardAnswers } from '@/types'

function treatmentText(choice: string, yes: string, no: string, doctor: string): string {
  if (choice === 'yes') return yes
  if (choice === 'no') return no
  return doctor
}

export function assemblePatientenverfuegung(answers: WizardAnswers): string {
  const { personalInfo, representative, medicalPreferences, scenarioChoices, personalValues } = answers

  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`
  const birthDate = new Date(personalInfo.birthDate).toLocaleDateString('de-DE')
  const address = `${personalInfo.street}, ${personalInfo.postalCode} ${personalInfo.city}`
  const today = new Date().toLocaleDateString('de-DE')

  const repName = `${representative.firstName} ${representative.lastName}`
  const repAddress = `${representative.street}, ${representative.postalCode} ${representative.city}`

  const terminalWishes = scenarioChoices.terminalIllness.length > 0
    ? scenarioChoices.terminalIllness.map(w => `    – ${terminalWishText(w)}`).join('\n')
    : '    – Keine besonderen Wünsche angegeben'

  const unconsciousWishes = scenarioChoices.irreversibleUnconsciousness.length > 0
    ? scenarioChoices.irreversibleUnconsciousness.map(w => `    – ${unconsciousWishText(w)}`).join('\n')
    : '    – Keine besonderen Wünsche angegeben'

  const dementiaWishes = scenarioChoices.severeDementia.length > 0
    ? scenarioChoices.severeDementia.map(w => `    – ${dementiaWishText(w)}`).join('\n')
    : '    – Keine besonderen Wünsche angegeben'

  const personalStatementSection = personalValues.personalStatement
    ? `\n  ${personalValues.personalStatement}\n`
    : '\n  Keine persönliche Erklärung angegeben.\n'

  const religiousSection = personalValues.religiousWishes
    ? `\nReligiöse und weltanschauliche Wünsche:\n  ${personalValues.religiousWishes}\n`
    : ''

  const organDonationText = {
    yes: 'Ich bin Organspender. Meine Organe sollen nach meinem Tod gespendet werden.',
    no: 'Ich bin kein Organspender. Meine Organe sollen nach meinem Tod nicht gespendet werden.',
    unspecified: 'Zur Organspende treffe ich in diesem Dokument keine Aussage.',
  }[personalValues.organDonation]

  return `PATIENTENVERFÜGUNG

gemäß § 1827 BGB

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ich, ${fullName},
geboren am ${birthDate} in ${personalInfo.birthPlace},
wohnhaft: ${address},

bestimme hiermit für den Fall, dass ich meinen Willen nicht mehr
bilden oder verständlich äußern kann, Folgendes:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. GELTUNGSBEREICH

Diese Patientenverfügung gilt für alle Situationen, in denen ich
krankheitsbedingt nicht mehr in der Lage bin, meinen Willen zu
äußern, insbesondere wenn:
– ich mich im Endstadium einer unheilbaren Erkrankung befinde,
– ich dauerhaft bewusstlos bin, oder
– ich an einer schweren Demenz leide,
und ein Behandlungsabbruch mein Sterben nicht mehr aufhalten
oder erheblich verzögern würde.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. FESTLEGUNGEN ZU MEDIZINISCHEN MAßNAHMEN

2.1 Wiederbelebung (Kardiopulmonale Reanimation)
${treatmentText(
  medicalPreferences.cpr,
  'Ich wünsche, dass im Fall eines Herzstillstands eine Wiederbelebung versucht wird.',
  'Ich wünsche KEINEN Reanimationsversuch. Auf Wiederbelebungsmaßnahmen (Herzdruckmassage, Defibrillation) soll verzichtet werden.',
  'Die Entscheidung über eine Reanimation überlasse ich dem behandelnden Arzt unter Berücksichtigung meiner übrigen Festlegungen.'
)}

2.2 Künstliche Beatmung
${treatmentText(
  medicalPreferences.ventilation,
  'Ich wünsche den Einsatz künstlicher Beatmung, solange begründete Aussicht auf Erholung besteht.',
  'Auf eine maschinelle Beatmung soll verzichtet bzw. eine bereits begonnene Beatmung soll eingestellt werden, wenn die genannten Situationen eingetreten sind.',
  'Die Entscheidung über maschinelle Beatmung überlasse ich dem behandelnden Arzt.'
)}

2.3 Künstliche Ernährung und Flüssigkeitszufuhr
${treatmentText(
  medicalPreferences.artificialNutrition,
  'Ich wünsche den Einsatz künstlicher Ernährung (z. B. Magensonde, PEG), wenn normale Ernährung nicht mehr möglich ist.',
  'Auf künstliche Ernährung und Flüssigkeitszufuhr durch Sonden soll verzichtet werden. Zur Linderung von Hunger und Durst soll mir Nahrung und Flüssigkeit in geeigneter Form angeboten werden.',
  'Die Entscheidung über künstliche Ernährung überlasse ich dem behandelnden Arzt.'
)}

2.4 Dialyse (Nierenersatztherapie)
${treatmentText(
  medicalPreferences.dialysis,
  'Ich wünsche den Einsatz der Dialyse bei Nierenversagen.',
  'Auf Dialyse soll verzichtet werden.',
  'Die Entscheidung über Dialyse überlasse ich dem behandelnden Arzt.'
)}

2.5 Antibiotika und andere lebenserhaltende Medikamente
${treatmentText(
  medicalPreferences.antibiotics,
  'Ich wünsche den Einsatz von Antibiotika auch bei lebensbedrohlichen Infektionen.',
  'Antibiotika und andere lebenserhaltende Medikamente sollen nur noch zur Linderung von Beschwerden, nicht mehr zur Lebensverlängerung eingesetzt werden.',
  'Die Entscheidung über Antibiotika überlasse ich dem behandelnden Arzt.'
)}

2.6 Schmerzbehandlung und palliative Versorgung
${{
  maxRelief: 'Die Linderung von Schmerzen, Atemnot und anderen belastenden Symptomen ist mir besonders wichtig, auch wenn dadurch eine Lebensverkürzung eintreten sollte. Ich wünsche eine umfassende palliative Versorgung.',
  lifeFirst: 'Der Erhalt meines Lebens hat Vorrang. Schmerzmittel sollen nur so weit eingesetzt werden, wie sie das Leben nicht verkürzen.',
  balanced: 'Ich wünsche eine angemessene Schmerzlinderung unter Berücksichtigung des Lebensschutzes. Die Abwägung überlasse ich dem behandelnden Arzt in Abstimmung mit meiner Vertrauensperson.',
}[medicalPreferences.painManagement]}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. SITUATIONSBEZOGENE FESTLEGUNGEN

3.1 Bei unheilbarer, zum Tode führender Erkrankung
${terminalWishes}

3.2 Bei dauerhafter Bewusstlosigkeit / irreversiblem Koma
${unconsciousWishes}

3.3 Bei schwerer Demenz mit fehlender Entscheidungsfähigkeit
${dementiaWishes}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. PERSÖNLICHE WERTE UND WÜNSCHE
${personalStatementSection}${religiousSection}
Organspende:
  ${organDonationText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5. VERTRAUENSPERSON UND BEVOLLMÄCHTIGTE

Ich habe folgende Person bevollmächtigt, meinen Willen gegenüber
Ärzten und Pflegepersonal zu vertreten:

  Name:    ${repName}
  Adresse: ${repAddress}${representative.phone ? `\n  Telefon: ${representative.phone}` : ''}

Meine Bevollmächtigte / mein Bevollmächtigter ist über den Inhalt
dieser Patientenverfügung informiert und mit der Wahrnehmung
dieser Aufgabe einverstanden.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

6. WIDERRUF UND VERBINDLICHKEIT

Diese Patientenverfügung kann jederzeit formlos widerrufen werden.
Ich bin mir des Inhalts und der Tragweite dieser Verfügung bewusst
und habe sie in einem entscheidungsfähigen Zustand unterzeichnet.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HINWEIS: Dieses Dokument wurde mit dem Vorsorge Wizard erstellt.
Es ersetzt keine individuelle Rechtsberatung.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ort, Datum: _________________________, den ${today}

Unterschrift: _________________________
              ${fullName}
`
}

function terminalWishText(key: string): string {
  const map: Record<string, string> = {
    noLifeProlonging: 'Lebensverlängernde Maßnahmen sollen unterbleiben',
    dieAtHome: 'Ich möchte nach Möglichkeit in meiner gewohnten Umgebung sterben',
    palliativeCare: 'Ich wünsche Palliativversorgung und ggf. Begleitung durch einen Hospizdienst',
    painOverLife: 'Die Linderung meiner Beschwerden hat Vorrang vor der Lebensverlängerung',
  }
  return map[key] ?? key
}

function unconsciousWishText(key: string): string {
  const map: Record<string, string> = {
    noLifeProlonging: 'Lebensverlängernde Maßnahmen sollen unterbleiben',
    noArtificialNutrition: 'Auf künstliche Ernährung soll verzichtet werden',
    noVentilation: 'Auf maschinelle Beatmung soll verzichtet werden',
  }
  return map[key] ?? key
}

function dementiaWishText(key: string): string {
  const map: Record<string, string> = {
    noLifeProlonging: 'Lebensverlängernde Maßnahmen sollen unterbleiben',
    noHospital: 'Krankenhauseinweisungen sollen nach Möglichkeit vermieden werden',
    palliativeFocus: 'Wohlfühl- und Palliativmaßnahmen haben Vorrang',
  }
  return map[key] ?? key
}
