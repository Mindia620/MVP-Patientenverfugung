import { useTranslation } from 'react-i18next'
import { Pencil, FileText, AlertTriangle } from 'lucide-react'
import { useWizardStore } from '@/store/wizardStore'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { formatDate } from '@/lib/utils'

function SummarySection({
  title,
  stepIndex,
  children,
}: {
  title: string
  stepIndex: number
  children: React.ReactNode
}) {
  const { t } = useTranslation()
  const setStep = useWizardStore(s => s.setStep)

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
        <button
          type="button"
          onClick={() => setStep(stepIndex as Parameters<typeof setStep>[0])}
          className="flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-700 font-medium"
        >
          <Pencil size={12} />
          {t('wizard.step6.edit')}
        </button>
      </div>
      <div className="px-5 py-4 space-y-1.5 text-sm text-slate-600">{children}</div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string | undefined }) {
  if (!value) return null
  return (
    <div className="flex gap-2">
      <span className="text-slate-400 w-36 flex-shrink-0">{label}</span>
      <span className="text-slate-800">{value}</span>
    </div>
  )
}

export function StepSummary() {
  const { t } = useTranslation()
  const { answers, nextStep, prevStep } = useWizardStore()
  const s = t('wizard.step6', { returnObjects: true }) as Record<string, string>
  const s3 = t('wizard.step3', { returnObjects: true }) as Record<string, string>

  const p = answers.personalInfo
  const r = answers.representative
  const m = answers.medicalPreferences

  const choiceLabel = (v: string) => {
    if (v === 'yes') return s3.choiceYes
    if (v === 'no') return s3.choiceNo
    return s3.choiceDoctor
  }

  const documents = [
    { key: 'patientenverfuegung', color: 'text-sky-600 bg-sky-50' },
    { key: 'vorsorgevollmacht', color: 'text-emerald-600 bg-emerald-50' },
    { key: 'betreuungsverfuegung', color: 'text-violet-600 bg-violet-50' },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">{s.title}</h2>
        <p className="text-sm text-slate-500 mt-1">{s.desc}</p>
      </div>

      <div className="space-y-3">
        {p && (
          <SummarySection title={s.personalInfo} stepIndex={1}>
            <Row label={t('wizard.step1.firstName')} value={`${p.firstName} ${p.lastName}`} />
            <Row label={t('wizard.step1.birthDate')} value={formatDate(p.birthDate)} />
            <Row label={t('wizard.step1.birthPlace')} value={p.birthPlace} />
            <Row label={t('wizard.step1.street')} value={`${p.street}, ${p.postalCode} ${p.city}`} />
          </SummarySection>
        )}

        {r && (
          <SummarySection title={s.representative} stepIndex={2}>
            <Row label="Name" value={`${r.firstName} ${r.lastName}`} />
            <Row label={t('wizard.step2.relationship')} value={r.relationship} />
            <Row label="Adresse" value={`${r.street}, ${r.postalCode} ${r.city}`} />
            {r.phone && <Row label={t('wizard.step2.phone')} value={r.phone} />}
          </SummarySection>
        )}

        {m && (
          <SummarySection title={s.medicalPreferences} stepIndex={3}>
            <Row label={s3.cprTitle} value={choiceLabel(m.cpr)} />
            <Row label={s3.ventilationTitle} value={choiceLabel(m.ventilation)} />
            <Row label={s3.nutritionTitle} value={choiceLabel(m.artificialNutrition)} />
            <Row label={s3.dialysisTitle} value={choiceLabel(m.dialysis)} />
            <Row label={s3.antibioticsTitle} value={choiceLabel(m.antibiotics)} />
            <Row label={s3.painTitle} value={
              m.painManagement === 'maxRelief' ? s3.painMaxRelief
              : m.painManagement === 'lifeFirst' ? s3.painLifeFirst
              : s3.painBalanced
            } />
          </SummarySection>
        )}
      </div>

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="flex gap-3 py-4">
          <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 leading-relaxed">{s.legalNote}</p>
        </CardContent>
      </Card>

      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
          {s.documentsToGenerate}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {documents.map(doc => (
            <div key={doc.key} className={`flex items-center gap-2 p-3 rounded-xl ${doc.color} border border-current/20`}>
              <FileText size={15} />
              <span className="text-xs font-medium">{t(`documents.${doc.key}`)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={prevStep} className="flex-1 sm:flex-none sm:w-32">
          {t('wizard.back')}
        </Button>
        <Button onClick={nextStep} className="flex-1">
          {t('wizard.continue')}
        </Button>
      </div>
    </div>
  )
}
