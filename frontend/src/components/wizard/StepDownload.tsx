import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { FileDown, CheckCircle2, Loader2, AlertCircle, ListChecks } from 'lucide-react'
import { useWizardStore } from '@/store/wizardStore'
import { generateApi } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import type { GeneratedDocument, DocumentType } from '@/types'

export function StepDownload() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { savedPackageId } = useWizardStore()
  const [documents, setDocuments] = useState<GeneratedDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const s = t('wizard.step8', { returnObjects: true }) as Record<string, string>

  useEffect(() => {
    if (!savedPackageId) return
    generateApi
      .generateAll(savedPackageId)
      .then(res => setDocuments(res.data.documents))
      .catch(() => setError(t('errors.serverError')))
      .finally(() => setLoading(false))
  }, [savedPackageId, t])

  const docColors: Record<DocumentType, string> = {
    patientenverfuegung: 'border-sky-200 bg-sky-50 text-sky-700',
    vorsorgevollmacht: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    betreuungsverfuegung: 'border-violet-200 bg-violet-50 text-violet-700',
  }

  const nextSteps = [
    s.nextStep1,
    s.nextStep2,
    s.nextStep3,
    s.nextStep4,
    s.nextStep5,
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        {!loading && !error && documents.length > 0 && (
          <CheckCircle2 size={48} className="text-emerald-500 mx-auto" />
        )}
        <h2 className="text-xl font-bold text-slate-900">{s.title}</h2>
        <p className="text-sm text-slate-500">{s.desc}</p>
      </div>

      {loading && (
        <div className="flex flex-col items-center gap-3 py-12">
          <Loader2 size={32} className="animate-spin text-sky-500" />
          <p className="text-sm text-slate-500">{s.generating}</p>
        </div>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex gap-3 py-4">
            <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      {!loading && documents.length > 0 && (
        <div className="space-y-3">
          {documents.map(doc => (
            <div
              key={doc.id}
              className={`flex items-center justify-between p-4 rounded-2xl border-2 ${docColors[doc.documentType] ?? 'border-slate-200 bg-white'}`}
            >
              <div>
                <p className="font-semibold text-sm">{t(`documents.${doc.documentType}`)}</p>
                <p className="text-xs opacity-70 mt-0.5">{t(`documents.${doc.documentType}Desc`)}</p>
              </div>
              <a
                href={generateApi.downloadUrl(savedPackageId!, doc.id)}
                download={doc.fileName}
                className="flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity"
              >
                <FileDown size={16} />
                {s.downloadPdf}
              </a>
            </div>
          ))}
        </div>
      )}

      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="py-5">
          <div className="flex items-center gap-2 mb-3">
            <ListChecks size={18} className="text-slate-600" />
            <h3 className="font-semibold text-sm text-slate-800">{s.nextStepsTitle}</h3>
          </div>
          <ol className="space-y-2">
            {nextSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-100 text-sky-700 text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Button
        variant="secondary"
        className="w-full"
        onClick={() => navigate('/dashboard')}
      >
        {s.goToDashboard}
      </Button>
    </div>
  )
}
