import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, type DocumentPackageResponse } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { FileText, Download, Trash2, Plus, Loader2, AlertTriangle } from 'lucide-react';

const docTypeI18nKeys: Record<string, string> = {
  PATIENTENVERFUEGUNG: 'patientenverfuegung',
  VORSORGEVOLLMACHT: 'vorsorgevollmacht',
  BETREUUNGSVERFUEGUNG: 'betreuungsverfuegung',
};

export function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [packages, setPackages] = useState<DocumentPackageResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    api.documents.list()
      .then((res) => setPackages(res.packages))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm(t('dashboard.deleteConfirm'))) return;
    try {
      await api.documents.delete(id);
      setPackages((prev) => prev.filter((p) => p.id !== id));
    } catch {
      // ignore
    }
  };

  const handleDownload = (packageId: string, type: string) => {
    window.open(api.documents.downloadUrl(packageId, type), '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={32} className="text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary-500">{t('dashboard.title')}</h1>
        <Button size="sm" onClick={() => navigate('/')}>
          <Plus size={16} className="mr-1" />
          {t('dashboard.createNew')}
        </Button>
      </div>

      {packages.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">{t('dashboard.empty')}</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/')}>
            {t('dashboard.createNew')}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-primary-600">
                    {t('dashboard.package')}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {t('dashboard.createdAt')}: {new Date(pkg.createdAt).toLocaleDateString('de-DE')}
                  </p>
                  <span className={`
                    inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium
                    ${pkg.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                      pkg.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'}
                  `}>
                    {t(`dashboard.statuses.${pkg.status}`)}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  aria-label={t('dashboard.delete')}
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {pkg.generatedDocuments.length > 0 && (
                <div className="space-y-2">
                  {pkg.generatedDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-primary-400" />
                        <span className="text-sm font-medium">
                          {t(`generate.documents.${docTypeI18nKeys[doc.documentType]}`) || doc.fileName}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDownload(pkg.id, doc.documentType)}
                        className="text-primary-500 hover:text-primary-600"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {pkg.generatedDocuments.length === 0 && (
                <p className="text-sm text-gray-400 flex items-center gap-1">
                  <AlertTriangle size={14} />
                  {t('dashboard.statuses.DRAFT')}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
