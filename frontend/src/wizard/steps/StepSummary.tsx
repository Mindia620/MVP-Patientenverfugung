import { useTranslation } from 'react-i18next'
import type { Answers } from '../../types'
import { useNavigate } from 'react-router-dom'

interface Props {
  answers: Answers
  onEditStep: (step: number) => void
}

export function StepSummary({ answers, onEditStep }: Props) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const medicalLabels: Record<string, string> = {
    allow: t('medical.allow'),
    refuse: t('medical.refuse'),
    delegate: t('medical.delegate'),
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-800">{t('summary.title')}</h2>

      <div className="space-y-4">
        <section className="p-4 bg-white rounded-lg border border-slate-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">{t('steps.personalInfo')}</h3>
            <button
              type="button"
              onClick={() => onEditStep(0)}
              className="text-sm text-primary-600 hover:underline"
            >
              {t('summary.edit')}
            </button>
          </div>
          <p>{answers.personalInfo.fullName}</p>
          <p className="text-slate-600 text-sm">
            {answers.personalInfo.street}, {answers.personalInfo.postalCode} {answers.personalInfo.city}
          </p>
          <p className="text-slate-600 text-sm">{answers.personalInfo.dateOfBirth}</p>
        </section>

        <section className="p-4 bg-white rounded-lg border border-slate-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">{t('steps.trustedPerson')}</h3>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="text-sm text-primary-600 hover:underline"
            >
              {t('summary.edit')}
            </button>
          </div>
          <p>{answers.trustedPerson.fullName} ({answers.trustedPerson.relationship})</p>
          <p className="text-slate-600 text-sm">
            {answers.trustedPerson.street}, {answers.trustedPerson.postalCode} {answers.trustedPerson.city}
          </p>
        </section>

        <section className="p-4 bg-white rounded-lg border border-slate-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">{t('steps.medicalPreferences')}</h3>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="text-sm text-primary-600 hover:underline"
            >
              {t('summary.edit')}
            </button>
          </div>
          <ul className="text-sm space-y-1">
            <li>{t('medical.cpr')}: {medicalLabels[answers.medicalPreferences.cpr]}</li>
            <li>{t('medical.ventilation')}: {medicalLabels[answers.medicalPreferences.ventilation]}</li>
            <li>{t('medical.artificialNutrition')}: {medicalLabels[answers.medicalPreferences.artificialNutrition]}</li>
            <li>{t('medical.dialysis')}: {medicalLabels[answers.medicalPreferences.dialysis]}</li>
            <li>{t('medical.antibiotics')}: {medicalLabels[answers.medicalPreferences.antibiotics]}</li>
            <li>{t('medical.painManagement')}: {medicalLabels[answers.medicalPreferences.painManagement]}</li>
          </ul>
        </section>

        {(answers.values?.religiousWishes || answers.values?.otherWishes) && (
          <section className="p-4 bg-white rounded-lg border border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">{t('steps.values')}</h3>
              <button
                type="button"
                onClick={() => onEditStep(4)}
                className="text-sm text-primary-600 hover:underline"
              >
                {t('summary.edit')}
              </button>
            </div>
            {answers.values?.religiousWishes && <p className="text-sm">{answers.values.religiousWishes}</p>}
            {answers.values?.otherWishes && <p className="text-sm">{answers.values.otherWishes}</p>}
          </section>
        )}
      </div>

      <div className="flex gap-4 justify-end">
        <button
          type="button"
          onClick={() => onEditStep(0)}
          className="px-4 py-2 text-slate-600 hover:text-slate-800"
        >
          {t('common.back')}
        </button>
        <button
          type="button"
          onClick={() => navigate('/wizard/auth', { state: { answers } })}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          {t('summary.confirm')}
        </button>
      </div>
    </div>
  )
}
