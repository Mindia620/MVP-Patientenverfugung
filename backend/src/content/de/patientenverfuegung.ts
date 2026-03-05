interface PersonalInfo {
  salutation: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  street: string;
  postalCode: string;
  city: string;
}

interface TreatmentPrefs {
  cpr: string;
  ventilation: string;
  artificialNutrition: string;
  dialysis: string;
  antibiotics: string;
  painManagement: string;
}

interface Scenarios {
  terminalIllness: boolean;
  irreversibleUnconsciousness: boolean;
  severeDementia: boolean;
}

interface ValuesWishes {
  personalValues?: string;
  religiousWishes?: string;
  organDonation?: string;
  burialWishes?: string;
}

const salutationMap: Record<string, string> = {
  herr: 'Herr',
  frau: 'Frau',
  divers: '',
};

const treatmentText = (pref: string, treatmentYes: string, treatmentNo: string): string => {
  switch (pref) {
    case 'yes': return treatmentYes;
    case 'no': return treatmentNo;
    case 'doctor_decides': return 'Die behandelnden Ärzte sollen nach bestem medizinischem Ermessen entscheiden.';
    default: return '';
  }
};

export function generatePatientenverfuegungText(
  personal: PersonalInfo,
  treatments: TreatmentPrefs,
  scenarios: Scenarios,
  values: ValuesWishes,
): string[] {
  const fullName = `${salutationMap[personal.salutation]} ${personal.firstName} ${personal.lastName}`.trim();

  const sections: string[] = [];

  sections.push('PATIENTENVERFÜGUNG');
  sections.push('');
  sections.push(`Ich, ${fullName},`);
  sections.push(`geboren am ${personal.dateOfBirth} in ${personal.placeOfBirth},`);
  sections.push(`wohnhaft in ${personal.street}, ${personal.postalCode} ${personal.city},`);
  sections.push('');
  sections.push('verfüge hiermit für den Fall, dass ich meinen Willen nicht mehr bilden oder verständlich äußern kann:');
  sections.push('');

  // Situational scope
  sections.push('1. GELTUNGSBEREICH');
  sections.push('');
  sections.push('Diese Patientenverfügung gilt in folgenden Situationen:');
  sections.push('');

  if (scenarios.terminalIllness) {
    sections.push('• Wenn ich mich im Endstadium einer unheilbaren, tödlich verlaufenden Krankheit befinde, selbst wenn der Todeszeitpunkt noch nicht absehbar ist.');
  }
  if (scenarios.irreversibleUnconsciousness) {
    sections.push('• Wenn ich mich nach ärztlicher Einschätzung aller Wahrscheinlichkeit nach unumkehrbar im unmittelbaren Sterbeprozess befinde oder infolge einer Gehirnschädigung meine Fähigkeit, Einsichten zu gewinnen, Entscheidungen zu treffen und mit anderen Menschen in Kontakt zu treten, nach Einschätzung zweier erfahrener Ärzte mit an Sicherheit grenzender Wahrscheinlichkeit unwiederbringlich erloschen ist.');
  }
  if (scenarios.severeDementia) {
    sections.push('• Wenn ich infolge eines weit fortgeschrittenen Hirnabbauprozesses (z.B. bei Demenzerkrankung) auch mit ausdauernder Hilfestellung nicht mehr in der Lage bin, Nahrung und Flüssigkeit auf natürliche Weise zu mir zu nehmen, Personen aus meinem engsten Umfeld dauerhaft nicht mehr erkennen und mich verbal und nonverbal nicht mehr verständlich äußern kann.');
  }

  sections.push('');
  sections.push('2. BEHANDLUNGSWÜNSCHE');
  sections.push('');

  sections.push('a) Wiederbelebungsmaßnahmen:');
  sections.push(treatmentText(
    treatments.cpr,
    'Ich wünsche, dass im Falle eines Herz-Kreislauf-Stillstandes Wiederbelebungsmaßnahmen durchgeführt werden.',
    'Ich wünsche keine Wiederbelebungsmaßnahmen. Bei einem Herz-Kreislauf-Stillstand soll keine Reanimation erfolgen.',
  ));
  sections.push('');

  sections.push('b) Künstliche Beatmung:');
  sections.push(treatmentText(
    treatments.ventilation,
    'Ich wünsche eine künstliche Beatmung, wenn diese medizinisch indiziert ist.',
    'Ich wünsche keine künstliche Beatmung. Bereits eingeleitete Beatmung soll eingestellt werden, wenn die unter 1. beschriebenen Situationen eintreten.',
  ));
  sections.push('');

  sections.push('c) Künstliche Ernährung:');
  sections.push(treatmentText(
    treatments.artificialNutrition,
    'Ich wünsche eine künstliche Ernährung, soweit medizinisch sinnvoll.',
    'Ich wünsche keine künstliche Ernährung, weder über eine Magensonde durch die Bauchdecke noch über einen venösen Zugang. Bereits eingeleitete Maßnahmen der künstlichen Ernährung sollen eingestellt werden.',
  ));
  sections.push('');

  sections.push('d) Dialyse:');
  sections.push(treatmentText(
    treatments.dialysis,
    'Ich wünsche eine Dialysebehandlung, wenn diese medizinisch notwendig ist.',
    'Ich wünsche keine Dialysebehandlung. Bereits begonnene Dialyse soll beendet werden, wenn die unter 1. beschriebenen Situationen eintreten.',
  ));
  sections.push('');

  sections.push('e) Antibiotika:');
  sections.push(treatmentText(
    treatments.antibiotics,
    'Ich wünsche den Einsatz von Antibiotika zur Behandlung von Infektionen.',
    'Ich wünsche keinen Einsatz von Antibiotika. Infektionen sollen nicht behandelt werden, wenn die unter 1. beschriebenen Situationen eintreten.',
  ));
  sections.push('');

  sections.push('f) Schmerzbehandlung:');
  sections.push(treatmentText(
    treatments.painManagement,
    'Ich wünsche eine fachgerechte Schmerz- und Symptombehandlung. Ich akzeptiere dabei, dass eine im Einzelfall palliativmedizinisch gebotene Behandlung möglicherweise eine Verkürzung meiner Lebenszeit zur Folge haben kann.',
    'Ich wünsche nur eine Basisversorgung zur Schmerzlinderung.',
  ));
  sections.push('');

  // Values & wishes
  if (values.personalValues || values.religiousWishes || values.burialWishes) {
    sections.push('3. PERSÖNLICHE WERTVORSTELLUNGEN');
    sections.push('');
    if (values.personalValues) {
      sections.push(values.personalValues);
      sections.push('');
    }
    if (values.religiousWishes) {
      sections.push('Religiöse/spirituelle Wünsche:');
      sections.push(values.religiousWishes);
      sections.push('');
    }
    if (values.burialWishes) {
      sections.push('Bestattungswünsche:');
      sections.push(values.burialWishes);
      sections.push('');
    }
  }

  // Organ donation
  if (values.organDonation) {
    const organSection = values.organDonation === 'yes'
      ? 'Ich bin grundsätzlich zur Organspende bereit. Komme ich nach ärztlicher Beurteilung als Organspender in Betracht, geht die Transplantationsmedizin vor.'
      : values.organDonation === 'no'
      ? 'Ich lehne eine Organentnahme ab.'
      : 'Ich bin unter Einschränkungen zur Organspende bereit (nur bestimmte Organe).';
    sections.push('ORGANSPENDE');
    sections.push('');
    sections.push(organSection);
    sections.push('');
  }

  sections.push('SCHLUSSBESTIMMUNGEN');
  sections.push('');
  sections.push('Ich erwarte, dass der in meiner Patientenverfügung geäußerte Wille zu bestimmten ärztlichen und pflegerischen Maßnahmen von den behandelnden Ärztinnen und Ärzten und dem Pflegepersonal befolgt wird. Mein(e) Bevollmächtigte(r) soll meinem Willen Ausdruck und Geltung verschaffen.');
  sections.push('');
  sections.push('Ich bin mir des Inhalts und der Konsequenzen meiner darin getroffenen Entscheidungen bewusst.');
  sections.push('');
  sections.push('Mir ist bekannt, dass ich diese Patientenverfügung jederzeit formlos widerrufen kann.');
  sections.push('');
  sections.push('');
  sections.push(`___________________________`);
  sections.push(`Ort, Datum`);
  sections.push('');
  sections.push('');
  sections.push(`___________________________`);
  sections.push(`${fullName}`);
  sections.push('(Unterschrift)');
  sections.push('');
  sections.push('');
  sections.push('Hinweis: Dieses Dokument wurde mit Vorsorge Wizard erstellt und stellt keine Rechtsberatung dar. Für eine individuelle Beratung wenden Sie sich bitte an einen Rechtsanwalt oder Notar.');

  return sections;
}
