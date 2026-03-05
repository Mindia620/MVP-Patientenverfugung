import { PageLayout } from '../../components/layout/PageLayout'

export function Privacy() {
  return (
    <PageLayout>
      <article className="max-w-3xl mx-auto px-4 py-12 prose prose-gray">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Datenschutzerklärung</h1>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Verantwortliche Stelle</h2>
          <p className="text-gray-700">
            Vorsorge Wizard<br />
            [Adresse des Betreibers — vor Launch eintragen]<br />
            E-Mail: datenschutz@vorsorge-wizard.de
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. Welche Daten wir verarbeiten</h2>
          <p className="text-gray-700 mb-3">
            Für die Erstellung Ihrer Vorsorgedokumente verarbeiten wir folgende Datenkategorien:
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            <li><strong>Besondere Kategorien (Art. 9 DSGVO):</strong> Medizinische Präferenzen, Behandlungswünsche</li>
            <li><strong>Personenbezogene Daten:</strong> Name, Adresse, Geburtsdatum, Geburtsort</li>
            <li><strong>Kontodaten:</strong> E-Mail-Adresse, gehashtes Passwort</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Zweck der Verarbeitung</h2>
          <p className="text-gray-700">
            Ihre Daten werden ausschließlich zum Zweck der Erstellung Ihrer Vorsorgedokumente
            (Patientenverfügung, Vorsorgevollmacht, Betreuungsverfügung) verarbeitet.
            Eine Weitergabe an Dritte findet nicht statt.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Rechtsgrundlage</h2>
          <p className="text-gray-700">
            Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
            sowie Ihrer ausdrücklichen Einwilligung gemäß Art. 9 Abs. 2 lit. a DSGVO für die
            Verarbeitung besonderer Kategorien personenbezogener Daten.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. Speicherdauer</h2>
          <p className="text-gray-700">
            Ihre Daten werden gespeichert, solange Ihr Konto besteht. Nach Löschung Ihres Kontos
            werden alle personenbezogenen Daten innerhalb von 30 Tagen vollständig gelöscht.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">6. Ihre Rechte</h2>
          <ul className="list-disc ml-6 text-gray-700 space-y-1">
            <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
            <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
            <li>Recht auf Löschung (Art. 17 DSGVO) — über "Konto löschen" in Ihrem Dashboard</li>
            <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO) — über "Daten exportieren"</li>
            <li>Widerrufsrecht für erteilte Einwilligungen</li>
            <li>Beschwerderecht bei der zuständigen Datenschutzbehörde</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">7. Cookies</h2>
          <p className="text-gray-700">
            Wir verwenden ausschließlich technisch notwendige Cookies zur Authentifizierung
            (httpOnly JWT-Cookie). Es werden keine Analyse-, Tracking- oder Werbe-Cookies verwendet.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">8. Datensicherheit</h2>
          <p className="text-gray-700">
            Die Übertragung erfolgt verschlüsselt über HTTPS/TLS. Passwörter werden niemals im
            Klartext gespeichert, sondern mit bcrypt gehasht. Server befinden sich in der EU.
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-8">Stand: März 2026</p>
      </article>
    </PageLayout>
  )
}
