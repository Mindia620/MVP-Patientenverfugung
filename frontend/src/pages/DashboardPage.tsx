import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { listDocuments, deleteDocument, getDocument } from '../lib/api'
import { downloadPdf } from '../lib/api'
import type { DocumentType } from '../types'

interface DocumentPackage {
  id: string
  wizardVersion: string
  createdAt: string
}

export function DashboardPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [packages, setPackages] = useState<DocumentPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/')
      return
    }
    if (user) {
      listDocuments()
        .then((res) => setPackages(res.documentPackages))
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [user, authLoading, navigate])

  const handleDownload = async (pkgId: string, docType: DocumentType) => {
    setDownloading(`${pkgId}-${docType}`)
    try {
      const { documentPackage } = await getDocument(pkgId)
      const blob = await downloadPdf(docType, documentPackage.answers)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${docType}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
    } finally {
      setDownloading(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Dokumentpaket löschen?')) return
    try {
      await deleteDocument(id)
      setPackages((p) => p.filter((x) => x.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  if (authLoading || !user) {
    return <div className="animate-pulse h-64 bg-slate-100 rounded-lg" />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Dashboard</h2>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 text-slate-600 hover:underline"
          >
            Wizard starten
          </button>
          <span className="text-slate-500 text-sm">{user.email}</span>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse h-32 bg-slate-100 rounded-lg" />
      ) : packages.length === 0 ? (
        <div className="p-8 bg-white rounded-lg border border-slate-200 text-center text-slate-600">
          Noch keine gespeicherten Dokumente. Starten Sie den Wizard, um Dokumente zu erstellen.
        </div>
      ) : (
        <div className="space-y-4">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="p-4 bg-white rounded-lg border border-slate-200"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium">
                    Erstellt am {new Date(pkg.createdAt).toLocaleDateString('de-DE')}
                  </p>
                  <p className="text-sm text-slate-500">Version {pkg.wizardVersion}</p>
                </div>
                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Löschen
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(['patientenverfuegung', 'vorsorgevollmacht', 'betreuungsverfuegung'] as DocumentType[]).map(
                  (docType) => (
                    <button
                      key={docType}
                      onClick={() => handleDownload(pkg.id, docType)}
                      disabled={!!downloading}
                      className="px-3 py-1 text-sm bg-primary-100 text-primary-800 rounded hover:bg-primary-200 disabled:opacity-50"
                    >
                      {downloading === `${pkg.id}-${docType}` ? '...' : t(`generate.${docType}`)}
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
