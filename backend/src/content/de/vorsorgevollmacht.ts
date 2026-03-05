import type { AnswersV1 } from '../../types.js';

function formatAddress(person: { street: string; postalCode: string; city: string }): string {
  return `${person.street}, ${person.postalCode} ${person.city}`;
}

function formatDate(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function composeVorsorgevollmacht(answers: AnswersV1): string {
  const sections: string[] = [];

  sections.push('VORSORGEVOLLMACHT');
  sections.push('');

  sections.push('Ich, ' + answers.personalInfo.fullName + ',');
  sections.push('geboren am ' + formatDate(answers.personalInfo.dateOfBirth) + ',');
  sections.push('wohnhaft ' + formatAddress(answers.personalInfo) + ',');
  sections.push('');
  sections.push('erteile hiermit folgende Vorsorgevollmacht:');
  sections.push('');

  sections.push('1. Bevollmächtigter');
  sections.push('Ich bevollmächtige ' + answers.trustedPerson.fullName + ' (' + answers.trustedPerson.relationship + ')');
  sections.push('als meine Vertrauensperson in allen Angelegenheiten, die meine Person betreffen.');
  sections.push('Anschrift: ' + formatAddress(answers.trustedPerson));

  if (answers.trustedPerson2) {
    sections.push('');
    sections.push('Als weitere Vertrauensperson benenne ich ' + answers.trustedPerson2.fullName + '.');
  }

  sections.push('');
  sections.push('2. Umfang der Vollmacht');
  sections.push('Die Vollmacht umfasst alle Angelegenheiten der persönlichen und rechtlichen Fürsorge,');
  sections.push('insbesondere: Gesundheitssorge, Aufenthaltsbestimmung, Wohnungsangelegenheiten,');
  sections.push('Vertretung gegenüber Behörden und Ärzten.');

  sections.push('');
  sections.push('Ort, Datum: _________________________');
  sections.push('');
  sections.push('Unterschrift: _________________________');

  return sections.join('\n');
}
