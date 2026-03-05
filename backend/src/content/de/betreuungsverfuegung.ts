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

interface TrustedPerson {
  salutation: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  relationship: string;
  street: string;
  postalCode: string;
  city: string;
  phone: string;
}

interface ValuesWishes {
  personalValues?: string;
  religiousWishes?: string;
}

const salutationMap: Record<string, string> = {
  herr: 'Herr',
  frau: 'Frau',
  divers: '',
};

const relationshipMap: Record<string, string> = {
  ehepartner: 'Ehepartner/in',
  kind: 'Kind',
  elternteil: 'Elternteil',
  freund: 'Freund/in',
  sonstige: 'Sonstige',
};

export function generateBetreuungsverfuegungText(
  personal: PersonalInfo,
  trustedPerson: TrustedPerson,
  alternatePerson?: TrustedPerson,
  values?: ValuesWishes,
): string[] {
  const fullName = `${salutationMap[personal.salutation]} ${personal.firstName} ${personal.lastName}`.trim();
  const trustedFullName = `${salutationMap[trustedPerson.salutation]} ${trustedPerson.firstName} ${trustedPerson.lastName}`.trim();

  const sections: string[] = [];

  sections.push('BETREUUNGSVERFÜGUNG');
  sections.push('');
  sections.push(`Ich, ${fullName},`);
  sections.push(`geboren am ${personal.dateOfBirth} in ${personal.placeOfBirth},`);
  sections.push(`wohnhaft in ${personal.street}, ${personal.postalCode} ${personal.city},`);
  sections.push('');
  sections.push('lege für den Fall, dass für mich eine rechtliche Betreuung eingerichtet werden muss, Folgendes fest:');
  sections.push('');

  sections.push('1. GEWÜNSCHTER BETREUER');
  sections.push('');
  sections.push('Als meinen Betreuer / meine Betreuerin wünsche ich:');
  sections.push('');
  sections.push(`${trustedFullName}`);
  sections.push(`geboren am ${trustedPerson.dateOfBirth}`);
  sections.push(`wohnhaft in ${trustedPerson.street}, ${trustedPerson.postalCode} ${trustedPerson.city}`);
  sections.push(`Telefon: ${trustedPerson.phone}`);
  sections.push(`Beziehung: ${relationshipMap[trustedPerson.relationship] || trustedPerson.relationship}`);
  sections.push('');

  if (alternatePerson) {
    const altFullName = `${salutationMap[alternatePerson.salutation]} ${alternatePerson.firstName} ${alternatePerson.lastName}`.trim();
    sections.push('Ersatzperson für die Betreuung:');
    sections.push('');
    sections.push(`${altFullName}`);
    sections.push(`geboren am ${alternatePerson.dateOfBirth}`);
    sections.push(`wohnhaft in ${alternatePerson.street}, ${alternatePerson.postalCode} ${alternatePerson.city}`);
    sections.push(`Telefon: ${alternatePerson.phone}`);
    sections.push(`Beziehung: ${relationshipMap[alternatePerson.relationship] || alternatePerson.relationship}`);
    sections.push('');
    sections.push('Die oben genannte Ersatzperson soll als Betreuer/Betreuerin bestellt werden, wenn die als erste genannte Person das Amt nicht übernehmen kann oder will.');
    sections.push('');
  }

  sections.push('Das Betreuungsgericht hat den Vorschlag des Betreuten zu berücksichtigen (§ 1816 Abs. 2 BGB), es sei denn, die vorgeschlagene Person ist als Betreuer nicht geeignet.');
  sections.push('');

  sections.push('2. WÜNSCHE ZUR BETREUUNG');
  sections.push('');
  sections.push('Ich wünsche, dass der/die Betreuer/in folgende Grundsätze beachtet:');
  sections.push('');
  sections.push('• Mein Wille und meine Wünsche sollen respektiert und umgesetzt werden.');
  sections.push('• Ich möchte so lange wie möglich in meiner gewohnten Umgebung leben.');
  sections.push('• Meine sozialen Kontakte und Beziehungen sollen aufrechterhalten werden.');
  sections.push('• Meine persönlichen Gewohnheiten und Vorlieben sollen nach Möglichkeit beibehalten werden.');
  sections.push('');

  if (values?.personalValues) {
    sections.push('Zusätzliche persönliche Wünsche:');
    sections.push(values.personalValues);
    sections.push('');
  }

  if (values?.religiousWishes) {
    sections.push('Religiöse/spirituelle Wünsche:');
    sections.push(values.religiousWishes);
    sections.push('');
  }

  sections.push('3. NICHT GEWÜNSCHTE BETREUER');
  sections.push('');
  sections.push('Folgende Personen sollen NICHT als Betreuer bestellt werden:');
  sections.push('(Hier können bei Bedarf Namen handschriftlich ergänzt werden.)');
  sections.push('');
  sections.push('');

  sections.push('4. HINWEIS');
  sections.push('');
  sections.push('Diese Betreuungsverfügung ergänzt meine Vorsorgevollmacht und meine Patientenverfügung. Sollte das Gericht trotz meiner Vorsorgevollmacht eine Betreuung für erforderlich halten, bitte ich, die hier genannte Person als Betreuer zu bestellen.');
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
