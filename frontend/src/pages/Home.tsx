import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageLayout } from '../components/layout/PageLayout'
import { ShieldIcon, LockIcon } from '../components/ui/Icons'

export function Home() {
  const { t } = useTranslation()
  const [disclaimerOpen, setDisclaimerOpen] = useState(false)

  const documents = [
    {
      key: 'patientenverfuegung',
      icon: '📋',
      description: 'Legen Sie fest, welche medizinischen Maßnahmen Sie in kritischen Situationen wünschen oder ablehnen.',
    },
    {
      key: 'vorsorgevollmacht',
      icon: '✍️',
      description: 'Bestimmen Sie, wer in Ihrem Namen entscheidet, wenn Sie es selbst nicht mehr können.',
    },
    {
      key: 'betreuungsverfuegung',
      icon: '🤝',
      description: 'Teilen Sie dem Betreuungsgericht mit, wen Sie als gesetzlichen Betreuer wünschen.',
    },
  ]

  const trustFeatures = [
    { icon: '🔒', text: 'Keine Registrierung für den Wizard erforderlich' },
    { icon: '🇩🇪', text: 'Rechtlich strukturierte deutsche Dokumente' },
    { icon: '📱', text: 'Funktioniert auf allen Geräten' },
    { icon: '🆓', text: 'Vollständig kostenlos' },
  ]

  return (
    <PageLayout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-900 to-primary-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <ShieldIcon className="w-14 h-14 text-primary-200" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight mb-4">
            {t('intro.headline')}
          </h1>
          <p className="text-xl text-primary-200 mb-8 max-w-2xl mx-auto">
            {t('intro.subline')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/wizard/step/1" className="btn-primary bg-white text-primary-800 hover:bg-primary-50 text-lg px-8 py-4">
              {t('intro.cta_start')} →
            </Link>
            <Link to="/auth/login" className="btn-secondary border-primary-300 text-primary-100 hover:bg-primary-700 text-lg px-8 py-4">
              {t('intro.cta_login')}
            </Link>
          </div>

          <p className="mt-6 text-primary-300 text-sm flex items-center justify-center gap-2">
            <LockIcon className="w-4 h-4" />
            {t('intro.privacy_note')}
          </p>
        </div>
      </section>

      {/* Documents */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-10">
            Was Sie erhalten
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div key={doc.key} className="card p-6 text-center hover:shadow-md transition-shadow">
                <div className="text-4xl mb-3">{doc.icon}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  {t(`intro.documents.${doc.key}`)}
                </h3>
                <p className="text-gray-600 text-sm">{doc.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-10">
            So einfach funktioniert es
          </h2>
          <div className="space-y-4">
            {[
              { step: '1', title: 'Wizard ausfüllen', desc: '8 einfache Schritte, je einer pro Thema. Keine Registrierung nötig.' },
              { step: '2', title: 'Zusammenfassung prüfen', desc: 'Alle Angaben übersichtlich zusammengefasst. Jederzeit bearbeitbar.' },
              { step: '3', title: 'Dokumente herunterladen', desc: 'Drei rechtlich strukturierte PDFs auf einmal — ausdrucken, unterschreiben, fertig.' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4 card p-5">
                <div className="w-10 h-10 rounded-full bg-primary-700 text-white flex items-center justify-center font-bold text-lg shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust features */}
      <section className="py-12 px-4 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {trustFeatures.map((feat) => (
              <div key={feat.text} className="text-center p-4">
                <div className="text-3xl mb-2">{feat.icon}</div>
                <p className="text-sm text-gray-600">{feat.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 px-4 bg-amber-50 border-t border-amber-200">
        <div className="max-w-3xl mx-auto">
          <button
            type="button"
            onClick={() => setDisclaimerOpen(!disclaimerOpen)}
            className="flex items-center gap-2 text-amber-800 font-semibold text-sm hover:text-amber-900"
          >
            <span>⚠️</span>
            {t('intro.disclaimer_title')}
            <span>{disclaimerOpen ? '▲' : '▼'}</span>
          </button>
          {disclaimerOpen && (
            <p className="mt-3 text-sm text-amber-800 animate-fade-in">
              {t('intro.disclaimer_text')}
            </p>
          )}
        </div>
      </section>
    </PageLayout>
  )
}
