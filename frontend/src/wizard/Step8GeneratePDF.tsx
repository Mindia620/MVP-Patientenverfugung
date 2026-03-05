import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const documentTypes = [
  { id: 'patientenverfuegung', labelKey: 'wizard.step8.patientenverfuegung' },
  { id: 'vorsorgevollmacht', labelKey: 'wizard.step8.vorsorgevollmacht' },
  { id: 'betreuungsverfuegung', labelKey: 'wizard.step8.betreuungsverfuegung' },
];

export function Step8GeneratePDF() {
  const { t } = useTranslation();
  const location = useLocation();
  const packageId = (location.state as { packageId?: string } | null)?.packageId;

  const handleDownload = async (type: string) => {
    if (packageId) {
      const res = await fetch(`/api/documents/${packageId}/pdf/${type}`, { credentials: 'include' });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        alert('PDF generation is not yet available. Please try again later.');
      }
    } else {
      alert('Documents will be available after saving. Please complete the account step first.');
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-slate-600">{t('wizard.step8.description')}</p>

      <div className="space-y-4">
        {documentTypes.map(({ id, labelKey }) => (
          <div
            key={id}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4"
          >
            <span className="font-medium text-slate-900">{t(labelKey)}</span>
            <button
              type="button"
              onClick={() => handleDownload(id)}
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
            >
              Download
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm text-slate-700">{t('wizard.step8.printHint')}</p>
      </div>
    </div>
  );
}
