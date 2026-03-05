import { useTranslation } from 'react-i18next'
import { Clock, Lock, FileText, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { useWizardStore } from '@/store/wizardStore'

export function StepIntro() {
  const { t } = useTranslation()
  const nextStep = useWizardStore(s => s.nextStep)

  const documents = [
    { key: 'patientenverfuegung', color: 'bg-sky-50 border-sky-200 text-sky-700' },
    { key: 'vorsorgevollmacht', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
    { key: 'betreuungsverfuegung', color: 'bg-violet-50 border-violet-200 text-violet-700' },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-bold text-slate-900">{t('wizard.intro.title')}</h1>
        <p className="text-slate-500 leading-relaxed">{t('wizard.intro.desc')}</p>
      </div>

      <div className="grid gap-3">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          {t('wizard.intro.documents')}
        </p>
        {documents.map(doc => (
          <Card key={doc.key} className={`border ${doc.color.split(' ').slice(1).join(' ')}`}>
            <CardContent className="py-4 px-5">
              <div className="flex items-start gap-3">
                <FileText size={18} className={doc.color.split(' ')[2]} />
                <div>
                  <p className="font-semibold text-sm text-slate-900">{t(`documents.${doc.key}`)}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{t(`documents.${doc.key}Desc`)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <InfoTile icon={<Clock size={16} />} label={t('wizard.intro.time')} value={t('landing.timeEstimate')} />
        <InfoTile icon={<Lock size={16} />} label={t('wizard.intro.privacy')} value={t('wizard.intro.privacyDesc')} />
      </div>

      <div className="pt-2">
        <Button size="lg" className="w-full" onClick={nextStep}>
          {t('wizard.intro.startCta')}
          <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  )
}

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-1.5">
      <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wide">
        {icon}
        {label}
      </div>
      <p className="text-sm text-slate-700 leading-snug">{value}</p>
    </div>
  )
}
