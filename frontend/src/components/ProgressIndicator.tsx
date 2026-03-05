import { useTranslation } from 'react-i18next';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-8" aria-label={t('progress.step', { current: currentStep, total: totalSteps })}>
      <div className="flex items-center justify-between gap-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-colors ${
              i + 1 <= currentStep ? 'bg-teal-600' : 'bg-slate-200'
            }`}
            aria-hidden
          />
        ))}
      </div>
      <p className="mt-2 text-sm text-slate-600">
        {t('progress.step', { current: currentStep, total: totalSteps })}
      </p>
    </div>
  );
}
