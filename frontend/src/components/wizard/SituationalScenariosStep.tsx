import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { situationalScenariosSchema } from '../../schemas/wizard';
import type { SituationalScenarios } from '../../types/wizard';
import { useWizardStore } from '../../store/wizardStore';
import { WizardNav } from './WizardNav';
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

const SCENARIOS = ['terminalIllness', 'irreversibleUnconsciousness', 'severeDementia'] as const;

function ScenarioCard({
  name,
  checked,
  onChange,
  t,
}: {
  name: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  t: (key: string) => string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`
        rounded-xl border-2 p-5 transition-all cursor-pointer
        ${checked ? 'border-primary-400 bg-primary-50/50 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}
      `}
      onClick={() => onChange(!checked)}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onChange(!checked); } }}
    >
      <div className="flex items-start gap-3">
        <div className={`
          mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
          ${checked ? 'bg-primary-500 border-primary-500 text-white' : 'border-gray-300'}
        `}>
          {checked && (
            <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 6l3 3 5-5" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-primary-600">
            {t(`situationalScenarios.${name}.title`)}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {t(`situationalScenarios.${name}.description`)}
          </p>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className="text-xs text-primary-500 hover:text-primary-600 flex items-center gap-1 mt-2"
          >
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {t('common.moreInfo')}
          </button>
          {expanded && (
            <p className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded">
              {t(`situationalScenarios.${name}.info`)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function SituationalScenariosStep() {
  const { t } = useTranslation();
  const { data, setSituationalScenarios, nextStep, prevStep } = useWizardStore();

  const { control, handleSubmit, formState: { errors } } = useForm<SituationalScenarios>({
    resolver: zodResolver(situationalScenariosSchema),
    defaultValues: data.situationalScenarios,
  });

  const onSubmit = (values: SituationalScenarios) => {
    setSituationalScenarios(values);
    nextStep();
  };

  const hasError = !!errors.terminalIllness;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-primary-500">{t('situationalScenarios.title')}</h2>
        <p className="text-gray-600">{t('situationalScenarios.subtitle')}</p>
      </div>

      <p className="text-sm text-gray-500 bg-blue-50 px-4 py-2 rounded-lg">
        {t('situationalScenarios.hint')}
      </p>

      {hasError && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-2 rounded-lg">
          <AlertTriangle size={16} />
          {t('validation.atLeastOneScenario')}
        </div>
      )}

      <div className="space-y-3">
        {SCENARIOS.map((scenario) => (
          <Controller
            key={scenario}
            name={scenario}
            control={control}
            render={({ field }) => (
              <ScenarioCard
                name={scenario}
                checked={field.value}
                onChange={field.onChange}
                t={t}
              />
            )}
          />
        ))}
      </div>

      <WizardNav onBack={prevStep} />
    </form>
  );
}
