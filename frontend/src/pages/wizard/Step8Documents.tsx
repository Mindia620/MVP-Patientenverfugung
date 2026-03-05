import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, Link } from 'react-router-dom'
import { useWizardStore } from '../../store/wizardStore'
import { useAuthStore } from '../../store/authStore'
import { documentsApi } from '../../lib/api'
import type { DocumentPackage } from '../../lib/api'
import { WizardLayout } from '../../components/wizard/WizardLayout'
import { DocumentIcon, DownloadIcon, CheckIcon } from '../../components/ui/Icons'

function DocumentCard({
  type,
  packageId,
  status,
}: {
  type: string
  packageId: string
  status: string
}) {
  const { t } = useTranslation()

  const downloadUrl = documentsApi.downloadUrl(packageId, type.toLowerCase())
  const label = t(`step8.documents.${type}`)

  return (
    <div className="card p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
          <DocumentIcon className="w-5 h-5 text-primary-700" />
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{label}</p>
          {status === 'GENERATED' && (
            <span className="badge-success">
              <CheckIcon className="w-3 h-3" />
              Bereit
            </span>
          )}
          {status === 'FAILED' && (
            <span className="badge-error">Fehler</span>
          )}
        </div>
      </div>

      {status === 'GENERATED' && (
        <a
          href={downloadUrl}
          download
          className="btn-primary text-sm px-4 py-2 flex items-center gap-2"
        >
          <DownloadIcon className="w-4 h-4" />
          {t('step8.download')}
        </a>
      )}
    </div>
  )
}

export function Step8Documents() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { getAnswersSnapshot, setStep } = useWizardStore()
  const { user } = useAuthStore()
  const [pkg, setPkg] = useState<DocumentPackage | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!pkg && !isGenerating) {
      generateDocuments()
    }
  }, [])

  const generateDocuments = async () => {
    setIsGenerating(true)
    setError('')
    try {
      const answers = getAnswersSnapshot()
      const res = await documentsApi.generate(answers)
      setPkg(res.data.package)
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number } }
      if (axiosErr?.response?.status === 401) {
        setError('Bitte melden Sie sich an, um Dokumente zu generieren.')
      } else {
        setError('Fehler beim Erstellen der Dokumente. Bitte versuchen Sie es erneut.')
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const nextSteps = t('step8.next_steps', { returnObjects: true }) as string[]

  const docTypes = [
    'PATIENTENVERFUEGUNG',
    'VORSORGEVOLLMACHT',
    'BETREUUNGSVERFUEGUNG',
  ] as const

  return (
    <WizardLayout
      currentStep={8}
      totalSteps={8}
      onBack={() => { setStep(7); navigate('/wizard/step/7') }}
      hideNav={!error}
    >
      <div className="step-card">
        {isGenerating ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('step8.generating')}</h2>
            <p className="text-gray-500 text-sm">Ihre drei Dokumente werden erstellt...</p>
          </div>
        ) : error ? (
          <div>
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4">
              {error}
            </div>
            <button onClick={generateDocuments} className="btn-primary w-full">
              Erneut versuchen
            </button>
          </div>
        ) : pkg ? (
          <div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <CheckIcon className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{t('step8.title')}</h1>
              <p className="text-gray-600 mt-1">{t('step8.subtitle')}</p>
            </div>

            <div className="space-y-3 mb-6">
              {docTypes.map((type) => {
                const doc = pkg.documents.find((d) => d.type === type)
                if (!doc) return null
                return (
                  <DocumentCard
                    key={type}
                    type={type}
                    packageId={pkg.id}
                    status={doc.status}
                  />
                )
              })}
            </div>

            {/* Next steps */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h3 className="font-semibold text-amber-900 mb-3">{t('step8.next_steps_title')}</h3>
              <ol className="space-y-2">
                {nextSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-amber-800">
                    <span className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center shrink-0 text-xs font-bold">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {user && (
              <div className="mt-4 text-center">
                <Link to="/dashboard" className="text-primary-600 text-sm font-medium hover:underline">
                  Zu meinen Dokumenten →
                </Link>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </WizardLayout>
  )
}
