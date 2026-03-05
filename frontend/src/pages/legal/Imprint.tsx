import { PageLayout } from '../../components/layout/PageLayout'

export function Imprint() {
  return (
    <PageLayout>
      <article className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Impressum</h1>

        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Angaben gemäß § 5 TMG</h2>
          <p className="text-gray-700">
            [Firmenname / Name des Betreibers]<br />
            [Straße, Hausnummer]<br />
            [PLZ, Ort]<br />
            Deutschland
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Kontakt</h2>
          <p className="text-gray-700">
            E-Mail: kontakt@vorsorge-wizard.de<br />
            [Telefon optional]
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Haftungsausschluss</h2>
          <p className="text-gray-700 mb-3">
            <strong>Haftung für Inhalte:</strong> Vorsorge Wizard erstellt rechtlich strukturierte
            Dokumente auf Basis Ihrer Eingaben. Die erzeugten Dokumente stellen keine Rechts- oder
            Medizinberatung dar und ersetzen nicht die Beratung durch einen Rechtsanwalt, Notar
            oder Arzt.
          </p>
          <p className="text-gray-700">
            <strong>Keine Garantie für Rechtsgültigkeit:</strong> Trotz sorgfältiger inhaltlicher
            Kontrolle übernehmen wir keine Haftung für die Aktualität, Vollständigkeit und
            Richtigkeit der erzeugten Dokumente im Einzelfall.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Urheberrecht</h2>
          <p className="text-gray-700">
            Die durch Vorsorge Wizard erstellten Softwarekomponenten und Inhalte unterliegen dem
            deutschen Urheberrecht. Nutzer erhalten das Recht, die für sie persönlich erstellten
            Dokumente zu verwenden.
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-8">Stand: März 2026</p>
      </article>
    </PageLayout>
  )
}
