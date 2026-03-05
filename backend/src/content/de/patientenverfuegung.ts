import type { AnswersV1 } from '../../types.js';

const preferenceLabels: Record<string, { de: string }> = {
  allow: { de: 'ja, wünsche ich' },
  refuse: { de: 'nein, lehne ich ab' },
  delegate: { de: 'überlasse ich meiner Vertrauensperson' },
};

function getPreference(pref: 'allow' | 'refuse' | 'delegate'): string {
  return preferenceLabels[pref]?.de ?? pref;
}

function formatAddress(person: { street: string; postalCode: string; city: string }): string {
  return `${person.street}, ${person.postalCode} ${person.city}`;
}

function formatDate(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function composePatientenverfuegung(answers: AnswersV1): string {
  const sections: string[] = [];

  sections.push('PATIENTENVERFÜGUNG');
  sections.push('');

  sections.push('Ich, ' + answers.personalInfo.fullName + ',');
  sections.push('geboren am ' + formatDate(answers.personalInfo.dateOfBirth) + (answers.personalInfo.placeOfBirth ? ' in ' + answers.personalInfo.placeOfBirth : '') + ',');
  sections.push('wohnhaft ' + formatAddress(answers.personalInfo) + ',');
  sections.push('');
  sections.push('treffe hiermit folgende Verfügung für den Fall, dass ich mich nicht mehr selbst äußern kann:');
  sections.push('');

  sections.push('1. Vertrauensperson');
  sections.push('Ich bevollmächtige ' + answers.trustedPerson.fullName + ' (' + answers.trustedPerson.relationship + ')');
  sections.push('als meine Vertrauensperson in allen Fragen der medizinischen Behandlung.');
  sections.push('Anschrift: ' + formatAddress(answers.trustedPerson));

  if (answers.trustedPerson2) {
    sections.push('');
    sections.push('Als weitere Vertrauensperson benenne ich ' + answers.trustedPerson2.fullName + ' (' + answers.trustedPerson2.relationship + ').');
    sections.push('Anschrift: ' + formatAddress(answers.trustedPerson2));
  }

  sections.push('');
  sections.push('2. Behandlungswünsche');
  sections.push('');

  const prefs = answers.medicalPreferences;
  sections.push('- Wiederbelebung (Reanimation): ' + getPreference(prefs.cpr));
  sections.push('- Künstliche Beatmung: ' + getPreference(prefs.ventilation));
  sections.push('- Künstliche Ernährung: ' + getPreference(prefs.artificialNutrition));
  sections.push('- Dialyse: ' + getPreference(prefs.dialysis));
  sections.push('- Antibiotika: ' + getPreference(prefs.antibiotics));
  sections.push('- Schmerztherapie: ' + getPreference(prefs.painManagement));

  sections.push('');
  sections.push('3. Situationsbezogene Präzisierungen');
  sections.push('');

  if (answers.scenarios.terminalIllness.applyGeneral) {
    sections.push('Bei terminaler Erkrankung ohne Aussicht auf Besserung: Es gelten meine allgemeinen Behandlungswünsche.');
  } else if (answers.scenarios.terminalIllness.overrides) {
    sections.push('Bei terminaler Erkrankung: Abweichende Wünsche (siehe oben).');
  }

  if (answers.scenarios.irreversibleUnconsciousness.applyGeneral) {
    sections.push('Bei irreversibler Bewusstlosigkeit: Es gelten meine allgemeinen Behandlungswünsche.');
  } else if (answers.scenarios.irreversibleUnconsciousness.overrides) {
    sections.push('Bei irreversibler Bewusstlosigkeit: Abweichende Wünsche.');
  }

  if (answers.scenarios.severeDementia.applyGeneral) {
    sections.push('Bei schwerer Demenz: Es gelten meine allgemeinen Behandlungswünsche.');
  } else if (answers.scenarios.severeDementia.overrides) {
    sections.push('Bei schwerer Demenz: Abweichende Wünsche.');
  }

  if (answers.values?.religiousWishes || answers.values?.otherWishes) {
    sections.push('');
    sections.push('4. Persönliche Wünsche');
    sections.push('');
    if (answers.values.religiousWishes) {
      sections.push(answers.values.religiousWishes);
    }
    if (answers.values.otherWishes) {
      sections.push(answers.values.otherWishes);
    }
  }

  sections.push('');
  sections.push('Ort, Datum: _________________________');
  sections.push('');
  sections.push('Unterschrift: _________________________');

  return sections.join('\n');
}
