import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Plus, FileDown, Trash2, FileText, Loader2, AlertCircle } from 'lucide-react'
import { packagesApi, generateApi } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { useWizardStore } from '@/store/wizardStore'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import type { DocumentPackage, DocumentType, GeneratedDocument } from '@/types'

const docColors: Record<DocumentType, string> = {
  patientenverfuegung: 'text-sky-600',
  vorsorgevollmacht: 'text-emerald-600',
  betreuungsverfuegung: 'text-violet-600',
}

function DocumentItem({ doc, packageId }: { doc: GeneratedDocument; packageId: string }) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <FileText size={15} className={docColors[doc.documentType] ?? 'text-slate-500'} />
        <span className="text-sm text-slate-700">{t(`documents.${doc.documentType}`)}</span>
        <Badge variant="info">v{doc.version}</Badge>
      </div>
      <a
        href={generateApi.downloadUrl(packageId, doc.id)}
        download={doc.fileName}
        className="flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-700 font-medium"
      >
        <FileDown size={14} />
        {t('dashboard.download')}
      </a>
    </div>
  )
}

export function Dashboard() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const resetWizard = useWizardStore(s => s.reset)

  const [packages, setPackages] = useState<DocumentPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    packagesApi
      .list()
      .then(res => setPackages(res.data.packages))
      .catch(() => setError(t('errors.serverError')))
      .finally(() => setLoading(false))
  }, [user, navigate, t])

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('dashboard.confirmDelete'))) return
    setDeleting(id)
    try {
      await packagesApi.delete(id)
      setPackages(prev => prev.filter(p => p.id !== id))
    } catch {
      alert(t('errors.serverError'))
    } finally {
      setDeleting(null)
    }
  }

  const handleNewWizard = () => {
    resetWizard()
    navigate('/wizard')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{t('dashboard.title')}</h1>
        <Button onClick={handleNewWizard} size="sm">
          <Plus size={16} />
          {t('dashboard.newPackage')}
        </Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={32} className="animate-spin text-sky-500" />
        </div>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex gap-3 py-4">
            <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      {!loading && packages.length === 0 && !error && (
        <div className="text-center py-20 space-y-4">
          <FileText size={48} className="text-slate-300 mx-auto" />
          <p className="text-slate-500">{t('dashboard.noPackages')}</p>
          <Button onClick={handleNewWizard}>
            {t('dashboard.startWizard')}
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {packages.map(pkg => (
          <Card key={pkg.id}>
            <CardContent className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-900">
                    {pkg.title || `Dokumentenpaket #${pkg.id.slice(0, 8)}`}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {t('dashboard.created')} {formatDate(pkg.createdAt)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  loading={deleting === pkg.id}
                  onClick={() => handleDelete(pkg.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={15} />
                </Button>
              </div>

              {pkg.generatedDocuments?.length > 0 && (
                <div className="border-t border-slate-100 pt-3 space-y-0.5 divide-y divide-slate-50">
                  {pkg.generatedDocuments.map(doc => (
                    <DocumentItem key={doc.id} doc={doc} packageId={pkg.id} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
