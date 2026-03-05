import type { AnswersV1 } from '../../types.js';

function formatAddress(person: { street: string; postalCode: string; city: string }): string {
  return `${person.street}, ${person.postalCode} ${person.city}`;
}

function formatDate(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function composeBetreuungsverfuegung(answers: AnswersV1): string {
  const sections: string[] = [];

  sections.push('BETREUUNGSVERFÜGUNG');
  sections.push('');

  sections.push('Ich, ' + answers.personalInfo.fullName + ',');
  sections.push('geboren am ' + formatDate(answers.personalInfo.dateOfBirth) + ',');
  sections.push('wohnhaft ' + formatAddress(answers.personalInfo) + ',');
  sections.push('');
  sections.push('äußere hiermit für den Fall, dass ich unter Betreuung gestellt werde, folgende Wünsche:');
  sections.push('');

  sections.push('1. Wunschbetreuer');
  sections.push('Ich wünsche als Betreuer: ' + answers.trustedPerson.fullName + ' (' + answers.trustedPerson.relationship + ')');
  sections.push('Anschrift: ' + formatAddress(answers.trustedPerson));

  if (answers.trustedPerson2) {
    sections.push('');
    sections.push('Als Ersatzbetreuer wünsche ich: ' + answers.trustedPerson2.fullName + '.');
  }

  sections.push('');
  sections.push('2. Umfang der Betreuung');
  sections.push('Die Betreuung soll sich auf die Gesundheitsfürsorge, Aufenthaltsbestimmung');
  sections.push('und die Vertretung gegenüber Behörden und Ärzten erstrecken.');

  sections.push('');
  sections.push('Ort, Datum: _________________________');
  sections.push('');
  sections.push('Unterschrift: _________________________');

  return sections.join('\n');
}
