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

export function generateVorsorgevollmachtText(
  personal: PersonalInfo,
  trustedPerson: TrustedPerson,
  alternatePerson?: TrustedPerson,
): string[] {
  const fullName = `${salutationMap[personal.salutation]} ${personal.firstName} ${personal.lastName}`.trim();
  const trustedFullName = `${salutationMap[trustedPerson.salutation]} ${trustedPerson.firstName} ${trustedPerson.lastName}`.trim();

  const sections: string[] = [];

  sections.push('VORSORGEVOLLMACHT');
  sections.push('');
  sections.push(`Ich, ${fullName},`);
  sections.push(`geboren am ${personal.dateOfBirth} in ${personal.placeOfBirth},`);
  sections.push(`wohnhaft in ${personal.street}, ${personal.postalCode} ${personal.city},`);
  sections.push('');
  sections.push('erteile hiermit Vollmacht an:');
  sections.push('');
  sections.push(`${trustedFullName}`);
  sections.push(`geboren am ${trustedPerson.dateOfBirth}`);
  sections.push(`wohnhaft in ${trustedPerson.street}, ${trustedPerson.postalCode} ${trustedPerson.city}`);
  sections.push(`Telefon: ${trustedPerson.phone}`);
  sections.push(`Beziehung: ${relationshipMap[trustedPerson.relationship] || trustedPerson.relationship}`);
  sections.push('');

  if (alternatePerson) {
    const altFullName = `${salutationMap[alternatePerson.salutation]} ${alternatePerson.firstName} ${alternatePerson.lastName}`.trim();
    sections.push('Ersatzbevollmächtigte(r):');
    sections.push('');
    sections.push(`${altFullName}`);
    sections.push(`geboren am ${alternatePerson.dateOfBirth}`);
    sections.push(`wohnhaft in ${alternatePerson.street}, ${alternatePerson.postalCode} ${alternatePerson.city}`);
    sections.push(`Telefon: ${alternatePerson.phone}`);
    sections.push(`Beziehung: ${relationshipMap[alternatePerson.relationship] || alternatePerson.relationship}`);
    sections.push('');
    sections.push('Die Ersatzbevollmächtigung greift, wenn die oben genannte bevollmächtigte Person verhindert, verstorben oder selbst geschäftsunfähig ist.');
    sections.push('');
  }

  sections.push('Diese Vollmacht gilt ab sofort und über den Tod hinaus. Sie ist in folgenden Bereichen wirksam:');
  sections.push('');

  sections.push('1. GESUNDHEITSSORGE / PFLEGEBEDÜRFTIGKEIT');
  sections.push('');
  sections.push('Die bevollmächtigte Person darf in alle Untersuchungen des Gesundheitszustandes, Heilbehandlungen oder ärztliche Eingriffe einwilligen, diese ablehnen oder die Einwilligung widerrufen, auch wenn die begründete Gefahr besteht, dass ich aufgrund der Maßnahme oder ihres Unterbleibens sterbe oder einen schweren und länger dauernden gesundheitlichen Schaden erleide (§ 1829 Abs. 1 und 2 BGB).');
  sections.push('');
  sections.push('Die bevollmächtigte Person darf über meine Unterbringung in einer geschlossenen Einrichtung, Abteilung oder einem entsprechenden Teil einer Einrichtung entscheiden, sofern dies zu meinem Wohl erforderlich ist (§ 1831 BGB).');
  sections.push('');

  sections.push('2. AUFENTHALT UND WOHNUNGSANGELEGENHEITEN');
  sections.push('');
  sections.push('Die bevollmächtigte Person darf meinen Aufenthalt bestimmen, Verträge über die Nutzung von Wohnraum für mich abschließen und kündigen sowie meinen Haushalt auflösen.');
  sections.push('');

  sections.push('3. BEHÖRDEN UND GERICHTE');
  sections.push('');
  sections.push('Die bevollmächtigte Person darf mich bei Behörden, Versicherungen, Renten- und Sozialleistungsträgern sowie vor Gerichten vertreten.');
  sections.push('');

  sections.push('4. VERMÖGENSSORGE');
  sections.push('');
  sections.push('Die bevollmächtigte Person darf mein Vermögen verwalten und über einzelne Vermögensgegenstände verfügen. Dies umfasst die Verwaltung von Bankkonten, die Führung von Geschäften und alle rechtsgeschäftlichen Handlungen, die zur ordnungsgemäßen Vermögensverwaltung notwendig sind.');
  sections.push('');

  sections.push('5. POST UND FERNMELDEVERKEHR');
  sections.push('');
  sections.push('Die bevollmächtigte Person darf die für mich bestimmte Post entgegennehmen und öffnen sowie über den Fernmeldeverkehr entscheiden. Sie darf über die Aufnahme, Aufrechterhaltung und Beendigung meines Telekommunikationsverkehrs entscheiden.');
  sections.push('');

  sections.push('6. VERTRETUNG VOR GERICHT');
  sections.push('');
  sections.push('Die bevollmächtigte Person darf mich in allen gerichtlichen Verfahren vertreten, Prozesshandlungen jeder Art vornehmen sowie Rechtsmittel einlegen oder auf sie verzichten.');
  sections.push('');

  sections.push('INNENVERHÄLTNIS');
  sections.push('');
  sections.push('Im Innenverhältnis soll die bevollmächtigte Person von der Vollmacht nur Gebrauch machen, wenn ich nicht mehr in der Lage bin, meine Angelegenheiten selbst zu regeln. Die bevollmächtigte Person ist an meine Wünsche und Weisungen gebunden, insbesondere an die in meiner Patientenverfügung niedergelegten Entscheidungen.');
  sections.push('');

  sections.push('');
  sections.push(`___________________________`);
  sections.push(`Ort, Datum`);
  sections.push('');
  sections.push('');
  sections.push(`___________________________`);
  sections.push(`${fullName}`);
  sections.push('(Unterschrift des/der Vollmachtgebenden)');
  sections.push('');
  sections.push('');
  sections.push('ANNAHMEERKLÄRUNG DER BEVOLLMÄCHTIGTEN PERSON:');
  sections.push('');
  sections.push('Ich nehme die Vollmacht an und verpflichte mich, den Willen des Vollmachtgebers zu achten und im Sinne seiner Wünsche zu handeln.');
  sections.push('');
  sections.push('');
  sections.push(`___________________________`);
  sections.push(`Ort, Datum`);
  sections.push('');
  sections.push('');
  sections.push(`___________________________`);
  sections.push(`${trustedFullName}`);
  sections.push('(Unterschrift der bevollmächtigten Person)');
  sections.push('');
  sections.push('');
  sections.push('Hinweis: Dieses Dokument wurde mit Vorsorge Wizard erstellt und stellt keine Rechtsberatung dar. Für eine individuelle Beratung wenden Sie sich bitte an einen Rechtsanwalt oder Notar.');

  return sections;
}
