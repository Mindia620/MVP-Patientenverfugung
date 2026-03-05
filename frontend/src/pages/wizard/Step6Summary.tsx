import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useWizardStore } from '../../store/wizardStore'
import { WizardLayout } from '../../components/wizard/WizardLayout'
import { CheckIcon, AlertIcon, DocumentIcon } from '../../components/ui/Icons'

interface SectionProps {
  title: string
  stepNum: number
  isComplete: boolean
  onEdit: () => void
  children: React.ReactNode
}

function SummarySection({ title, stepNum, isComplete, onEdit, children }: SectionProps) {
  const [open, setOpen] = useState(true)

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          {isComplete ? (
            <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <CheckIcon className="w-3.5 h-3.5 text-white" />
            </span>
          ) : (
            <span className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center">
              <span className="text-xs font-bold text-white">{stepNum}</span>
            </span>
          )}
          <span className="font-semibold text-gray-800">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onEdit() }}
            className="text-xs text-primary-600 hover:text-primary-800 font-medium px-2 py-1 rounded hover:bg-primary-50 transition-colors"
          >
            Bearbeiten
          </button>
          <span className="text-gray-400">{open ? '▲' : '▼'}</span>
        </div>
      </button>
      {open && (
        <div className="p-4 text-sm text-gray-700 bg-white">
          {children}
        </div>
      )}
    </div>
  )
}

export function Step6Summary() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { personalInfo, trustedPerson, medicalPrefs, scenarios, personalValues, setStep, setDisclaimerAccepted, disclaimerAccepted } = useWizardStore()

  const handleContinue = () => {
    if (!disclaimerAccepted) {
      alert('Bitte bestätigen Sie den rechtlichen Hinweis.')
      return
    }
    setStep(7)
    navigate('/wizard/step/7')
  }

  const treatmentLabel = (choice: string) => {
    if (choice === 'yes') return 'Ja, gewünscht'
    if (choice === 'no') return 'Abgelehnt'
    return 'Arzt / Vertrauensperson entscheidet'
  }

  const scenarioLabel = (choice: string) => {
    if (choice === 'life_sustaining') return 'Lebenserhaltende Maßnahmen'
    if (choice === 'palliative_only') return 'Nur Palliativversorgung'
    return 'Vertrauensperson entscheidet'
  }

  const treatmentNames: Record<string, string> = {
    cpr: 'Wiederbelebung (CPR)',
    ventilation: 'Maschinelle Beatmung',
    artificialNutrition: 'Künstliche Ernährung',
    dialysis: 'Dialyse',
    antibiotics: 'Antibiotika',
    painManagement: 'Schmerzbehandlung',
  }

  return (
    <WizardLayout
      currentStep={6}
      totalSteps={8}
      onBack={() => { setStep(5); navigate('/wizard/step/5') }}
      onNext={handleContinue}
      nextLabel="Weiter zur Kontoerstellung"
      nextDisabled={!disclaimerAccepted}
    >
      <div className="step-card">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{t('step6.title')}</h1>
        <p className="text-gray-600 mb-6">{t('step6.subtitle')}</p>

        <div className="space-y-3">
          {/* Personal Info */}
          <SummarySection
            title={t('step6.section_personal')}
            stepNum={1}
            isComplete={!!personalInfo}
            onEdit={() => { setStep(1); navigate('/wizard/step/1') }}
          >
            {personalInfo ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <span className="text-gray-500">Name:</span>
                <span>{personalInfo.firstName} {personalInfo.lastName}</span>
                <span className="text-gray-500">Geburtsdatum:</span>
                <span>{new Date(personalInfo.dateOfBirth).toLocaleDateString('de-DE')}</span>
                <span className="text-gray-500">Anschrift:</span>
                <span>{personalInfo.streetAddress}, {personalInfo.postalCode} {personalInfo.city}</span>
              </div>
            ) : <p className="text-amber-600 flex items-center gap-1"><AlertIcon className="w-4 h-4" /> Nicht ausgefüllt</p>}
          </SummarySection>

          {/* Trusted Person */}
          <SummarySection
            title={t('step6.section_trusted')}
            stepNum={2}
            isComplete={!!trustedPerson}
            onEdit={() => { setStep(2); navigate('/wizard/step/2') }}
          >
            {trustedPerson ? (
              <div>
                <p><strong>{trustedPerson.fullName}</strong></p>
                <p className="text-gray-500">{trustedPerson.streetAddress}, {trustedPerson.postalCode} {trustedPerson.city}</p>
                {trustedPerson.substitute && (
                  <p className="mt-1 text-gray-500">Ersatzperson: {trustedPerson.substitute.fullName}</p>
                )}
              </div>
            ) : <p className="text-amber-600 flex items-center gap-1"><AlertIcon className="w-4 h-4" /> Nicht ausgefüllt</p>}
          </SummarySection>

          {/* Medical */}
          <SummarySection
            title={t('step6.section_medical')}
            stepNum={3}
            isComplete={!!medicalPrefs}
            onEdit={() => { setStep(3); navigate('/wizard/step/3') }}
          >
            {medicalPrefs ? (
              <div className="space-y-1">
                {Object.entries(medicalPrefs).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-gray-600">{treatmentNames[key] ?? key}:</span>
                    <span className={`font-medium ${val === 'yes' ? 'text-green-700' : val === 'no' ? 'text-red-700' : 'text-blue-700'}`}>
                      {treatmentLabel(val as string)}
                    </span>
                  </div>
                ))}
              </div>
            ) : <p className="text-amber-600 flex items-center gap-1"><AlertIcon className="w-4 h-4" /> Nicht ausgefüllt</p>}
          </SummarySection>

          {/* Scenarios */}
          <SummarySection
            title={t('step6.section_scenarios')}
            stepNum={4}
            isComplete={!!scenarios}
            onEdit={() => { setStep(4); navigate('/wizard/step/4') }}
          >
            {scenarios ? (
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-gray-600">Unheilbare Erkrankung:</span>
                  <span className="font-medium text-right">{scenarioLabel(scenarios.terminalIllness)}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-gray-600">Dauerhaftes Koma:</span>
                  <span className="font-medium text-right">{scenarioLabel(scenarios.irreversibleUnconscious)}</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-gray-600">Schwere Demenz:</span>
                  <span className="font-medium text-right">{scenarioLabel(scenarios.severeDementia)}</span>
                </div>
              </div>
            ) : <p className="text-amber-600 flex items-center gap-1"><AlertIcon className="w-4 h-4" /> Nicht ausgefüllt</p>}
          </SummarySection>

          {/* Values */}
          <SummarySection
            title={`${t('step6.section_values')} ${t('wizard.optional')}`}
            stepNum={5}
            isComplete={!!personalValues}
            onEdit={() => { setStep(5); navigate('/wizard/step/5') }}
          >
            {personalValues ? (
              <div>
                {personalValues.valuesStatement && (
                  <p className="text-gray-600 line-clamp-2">{personalValues.valuesStatement}</p>
                )}
                <p className="text-gray-500 mt-1">Organspende: {personalValues.organDonation}</p>
              </div>
            ) : <p className="text-gray-500 italic">Optional — kann übersprungen werden</p>}
          </SummarySection>
        </div>

        {/* Documents to be generated */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <DocumentIcon className="w-4 h-4" />
            {t('step6.documents_to_generate')}
          </p>
          <ul className="space-y-1 text-sm text-blue-800">
            <li className="flex items-center gap-2"><CheckIcon className="w-4 h-4 text-green-600" /> Patientenverfügung</li>
            <li className="flex items-center gap-2"><CheckIcon className="w-4 h-4 text-green-600" /> Vorsorgevollmacht</li>
            <li className="flex items-center gap-2"><CheckIcon className="w-4 h-4 text-green-600" /> Betreuungsverfügung</li>
          </ul>
        </div>

        {/* Disclaimer checkbox */}
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={disclaimerAccepted}
              onChange={(e) => setDisclaimerAccepted(e.target.checked)}
              className="mt-0.5 w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer shrink-0"
            />
            <span className="text-sm text-amber-900">
              {t('step6.disclaimer_label')}
            </span>
          </label>
        </div>
      </div>
    </WizardLayout>
  )
}
