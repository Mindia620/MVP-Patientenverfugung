import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { downloadPdf } from '../lib/api'
import { useWizardDraft } from '../hooks/useWizardDraft'
import type { Answers, DocumentType } from '../types'

const DOC_TYPES: DocumentType[] = [
  'patientenverfuegung',
  'vorsorgevollmacht',
  'betreuungsverfuegung',
]

export function GeneratePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [answers, setAnswers] = useState<Answers | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const { clearDraft } = useWizardDraft(null, () => {})

  useEffect(() => {
    const stateAnswers = (location.state as { answers?: Answers })?.answers
    if (stateAnswers) {
      setAnswers(stateAnswers)
      clearDraft()
    } else {
      navigate('/wizard')
    }
  }, [location.state, navigate, clearDraft])

  const handleDownload = async (docType: DocumentType) => {
    if (!answers) return
    setLoading(docType)
    try {
      const blob = await downloadPdf(docType, answers)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${docType}_${new Date().toISOString().split('T')[0]}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(null)
    }
  }

  if (!answers) {
    return <div className="animate-pulse h-64 bg-slate-100 rounded-lg" />
  }

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-slate-800">{t('generate.title')}</h2>

      <div className="space-y-4">
        {DOC_TYPES.map((docType) => (
          <div
            key={docType}
            className="p-4 bg-white rounded-lg border border-slate-200 flex items-center justify-between"
          >
            <span className="font-medium">{t(`generate.${docType}`)}</span>
            <button
              onClick={() => handleDownload(docType)}
              disabled={!!loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {loading === docType ? '...' : t('generate.download')}
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900">
        {t('generate.finalDisclaimer')}
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 text-primary-600 hover:underline"
        >
          Zum Dashboard
        </button>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 text-slate-600 hover:underline"
        >
          Zur Startseite
        </button>
      </div>
    </div>
  )
}
