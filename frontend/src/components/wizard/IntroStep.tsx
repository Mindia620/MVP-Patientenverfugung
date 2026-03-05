import { useTranslation } from 'react-i18next';
import { FileText, Users, Scale, Lock, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { useWizardStore } from '../../store/wizardStore';

export function IntroStep() {
  const { t } = useTranslation();
  const { nextStep } = useWizardStore();
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const documents = [
    { icon: FileText, title: t('intro.doc1'), desc: t('intro.doc1Desc') },
    { icon: Users, title: t('intro.doc2'), desc: t('intro.doc2Desc') },
    { icon: Scale, title: t('intro.doc3'), desc: t('intro.doc3Desc') },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary-500 leading-tight">
          {t('intro.title')}
        </h1>
        <p className="text-lg text-gray-600 max-w-lg mx-auto">
          {t('intro.subtitle')}
        </p>
      </div>

      <div className="grid gap-4">
        {documents.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-primary-50 text-primary-500 rounded-lg flex items-center justify-center">
              <Icon size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-primary-600">{title}</h3>
              <p className="text-sm text-gray-600 mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <button
          type="button"
          onClick={() => setShowDisclaimer(!showDisclaimer)}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="flex items-center gap-2 font-medium text-amber-800">
            <Scale size={18} />
            {t('intro.disclaimer')}
          </span>
          {showDisclaimer ? <ChevronUp size={18} className="text-amber-600" /> : <ChevronDown size={18} className="text-amber-600" />}
        </button>
        {showDisclaimer && (
          <p className="mt-3 text-sm text-amber-700 leading-relaxed">
            {t('intro.disclaimerText')}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500 justify-center">
        <Lock size={14} />
        <span>{t('intro.privacyNote')}</span>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-400 justify-center">
        <Clock size={14} />
        <span>{t('intro.estimatedTime')}</span>
      </div>

      <div className="text-center">
        <Button size="lg" onClick={nextStep}>
          {t('intro.cta')}
        </Button>
      </div>
    </div>
  );
}
