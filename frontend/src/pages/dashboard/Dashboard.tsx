import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { useAuthStore } from '../../store/authStore'
import { documentsApi, usersApi } from '../../lib/api'
import type { DocumentPackage } from '../../lib/api'
import { PageLayout } from '../../components/layout/PageLayout'
import { DocumentIcon, DownloadIcon, CheckIcon } from '../../components/ui/Icons'

function PackageCard({ pkg }: { pkg: DocumentPackage }) {
  const { t } = useTranslation()

  const docTypes = [
    { type: 'PATIENTENVERFUEGUNG', urlType: 'patientenverfuegung' },
    { type: 'VORSORGEVOLLMACHT', urlType: 'vorsorgevollmacht' },
    { type: 'BETREUUNGSVERFUEGUNG', urlType: 'betreuungsverfuegung' },
  ] as const

  const createdDate = format(new Date(pkg.createdAt), 'dd.MM.yyyy', { locale: de })

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-900">
            {pkg.label ?? t('dashboard.package_label')}
          </h3>
          <p className="text-sm text-gray-500">
            {t('dashboard.created_at')}: {createdDate}
          </p>
        </div>
        <span className={`badge-${pkg.status === 'COMPLETED' ? 'success' : pkg.status === 'FAILED' ? 'error' : 'warning'}`}>
          {t(`dashboard.status.${pkg.status}`)}
        </span>
      </div>

      {pkg.status === 'COMPLETED' && (
        <div className="space-y-2">
          {docTypes.map(({ type, urlType }) => {
            const doc = pkg.documents.find((d) => d.type === type)
            if (!doc) return null
            return (
              <div key={type} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-2">
                  <DocumentIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">
                    {t(`step8.documents.${type}`)}
                  </span>
                  {doc.status === 'GENERATED' && (
                    <CheckIcon className="w-4 h-4 text-green-500" />
                  )}
                </div>
                {doc.status === 'GENERATED' && (
                  <a
                    href={documentsApi.downloadUrl(pkg.id, urlType)}
                    download
                    className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-800 font-medium"
                  >
                    <DownloadIcon className="w-4 h-4" />
                    PDF
                  </a>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function Dashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [packages, setPackages] = useState<DocumentPackage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const { logout } = useAuthStore()

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      const res = await documentsApi.list()
      setPackages(res.data.packages)
    } catch {
      // Handle error silently
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportData = async () => {
    try {
      const res = await usersApi.exportData()
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `vorsorge-wizard-export-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Fehler beim Export.')
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    setDeleteError('')
    try {
      await usersApi.deleteAccount(deletePassword)
      await logout()
      navigate('/')
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number } }
      if (axiosErr?.response?.status === 401) {
        setDeleteError('Falsches Passwort.')
      } else {
        setDeleteError('Ein Fehler ist aufgetreten.')
      }
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
          {user && (
            <p className="text-gray-600 mt-1">
              {t('dashboard.welcome', { name: user.email.split('@')[0] })}
            </p>
          )}
        </div>

        {/* Documents */}
        <section className="mb-10">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : packages.length === 0 ? (
            <div className="card p-10 text-center">
              <DocumentIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">{t('dashboard.no_documents')}</p>
              <Link to="/wizard/step/1" className="btn-primary">
                {t('dashboard.create_first')}
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
              <div className="text-center pt-2">
                <Link to="/wizard/step/1" className="btn-secondary">
                  + {t('dashboard.create_new')}
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Account section */}
        <section className="border-t border-gray-200 pt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.account_section')}</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleExportData}
              className="btn-secondary text-sm"
            >
              {t('dashboard.export_data')}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="btn-danger text-sm"
            >
              {t('dashboard.delete_account')}
            </button>
          </div>
        </section>

        {/* Delete confirmation modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl animate-fade-in">
              <h3 className="text-lg font-bold text-red-700 mb-2">Konto löschen</h3>
              <p className="text-sm text-gray-700 mb-4">{t('dashboard.delete_confirm')}</p>
              <p className="text-sm text-gray-600 mb-2">{t('dashboard.delete_password_prompt')}</p>
              <input
                type="password"
                className="input-field mb-3"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Passwort..."
              />
              {deleteError && (
                <p className="text-sm text-red-600 mb-3">{deleteError}</p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowDeleteConfirm(false); setDeletePassword(''); setDeleteError('') }}
                  className="btn-secondary flex-1"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="btn-danger flex-1"
                  disabled={!deletePassword || isDeleting}
                >
                  {isDeleting ? 'Wird gelöscht...' : 'Endgültig löschen'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
