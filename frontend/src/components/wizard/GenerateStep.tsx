import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, type GeneratedDocResponse } from '../../lib/api';
import { useWizardStore } from '../../store/wizardStore';
import { Button } from '../ui/Button';
import { FileText, Download, CheckCircle, Loader2, Printer } from 'lucide-react';

const DOC_TYPES = ['PATIENTENVERFUEGUNG', 'VORSORGEVOLLMACHT', 'BETREUUNGSVERFUEGUNG'] as const;

const docTypeI18nKeys: Record<string, string> = {
  PATIENTENVERFUEGUNG: 'patientenverfuegung',
  VORSORGEVOLLMACHT: 'vorsorgevollmacht',
  BETREUUNGSVERFUEGUNG: 'betreuungsverfuegung',
};

export function GenerateStep() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, clearDraft } = useWizardStore();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<GeneratedDocResponse[]>([]);
  const [packageId, setPackageId] = useState<string>('');
  const [error, setError] = useState('');

  useEffect(() => {
    const generate = async () => {
      try {
        const saveRes = await api.documents.save(data);
        setPackageId(saveRes.id);
        const genRes = await api.documents.generate(saveRes.id);
        setDocuments(genRes.documents);
      } catch {
        setError(t('common.error'));
      } finally {
        setLoading(false);
      }
    };
    generate();
  }, []);

  const handleDownload = (type: string) => {
    if (!packageId) return;
    window.open(api.documents.downloadUrl(packageId, type), '_blank');
  };

  const handleDashboard = () => {
    clearDraft();
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 animate-fade-in">
        <Loader2 size={48} className="text-primary-500 animate-spin" />
        <p className="text-lg text-gray-600">{t('generate.generating')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-red-600">{error}</p>
        <Button onClick={() => window.location.reload()}>{t('common.retry')}</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <CheckCircle size={48} className="mx-auto text-secondary-400" />
        <h2 className="text-2xl font-bold text-primary-500">{t('generate.title')}</h2>
        <p className="text-gray-600">{t('generate.success')}</p>
      </div>

      <div className="space-y-3">
        {DOC_TYPES.map((type) => {
          const doc = documents.find((d) => d.documentType === type);
          return (
            <div
              key={type}
              className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 text-primary-500 rounded-lg flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-600">
                    {t(`generate.documents.${docTypeI18nKeys[type]}`)}
                  </h3>
                  {doc && (
                    <p className="text-xs text-gray-400">{doc.fileName}</p>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(type)}
                disabled={!doc}
              >
                <Download size={16} className="mr-1" />
                {t('generate.download')}
              </Button>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Printer size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-blue-700">{t('generate.printHint')}</p>
      </div>

      <div className="text-center">
        <Button onClick={handleDashboard}>
          {t('generate.toDashboard')}
        </Button>
      </div>
    </div>
  );
}
