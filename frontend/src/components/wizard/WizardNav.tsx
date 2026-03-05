import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface WizardNavProps {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  showBack?: boolean;
  nextType?: 'button' | 'submit';
  loading?: boolean;
}

export function WizardNav({
  onBack,
  onNext,
  nextLabel,
  showBack = true,
  nextType = 'submit',
  loading = false,
}: WizardNavProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between pt-4">
      {showBack && onBack ? (
        <Button type="button" variant="ghost" onClick={onBack}>
          <ChevronLeft size={18} className="mr-1" />
          {t('wizard.back')}
        </Button>
      ) : (
        <div />
      )}
      <Button type={nextType} onClick={onNext} disabled={loading}>
        {loading ? t('common.loading') : (nextLabel || t('wizard.next'))}
        {!loading && <ChevronRight size={18} className="ml-1" />}
      </Button>
    </div>
  );
}
