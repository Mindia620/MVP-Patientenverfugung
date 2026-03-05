import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Clock, Lock, ChevronRight, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { useWizardStore } from '@/store/wizardStore'

export function Landing() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const resetWizard = useWizardStore(s => s.reset)

  const handleStart = () => {
    resetWizard()
    navigate('/wizard')
  }

  const benefits = [
    {
      icon: <Clock size={20} className="text-sky-600" />,
      title: t('landing.benefit1Title'),
      desc: t('landing.benefit1Desc'),
    },
    {
      icon: <Lock size={20} className="text-sky-600" />,
      title: t('landing.benefit2Title'),
      desc: t('landing.benefit2Desc'),
    },
    {
      icon: <ShieldCheck size={20} className="text-sky-600" />,
      title: t('landing.benefit3Title'),
      desc: t('landing.benefit3Desc'),
    },
  ]

  const documents = [
    {
      key: 'patientenverfuegung',
      gradient: 'from-sky-500 to-sky-600',
      bg: 'bg-sky-50 border-sky-100',
    },
    {
      key: 'vorsorgevollmacht',
      gradient: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-50 border-emerald-100',
    },
    {
      key: 'betreuungsverfuegung',
      gradient: 'from-violet-500 to-violet-600',
      bg: 'bg-violet-50 border-violet-100',
    },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-sky-50 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 text-xs font-semibold px-3 py-1 rounded-full mb-6">
              <ShieldCheck size={13} />
              {t('landing.benefit3Title')}
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
              {t('landing.headline')}
            </h1>
            <p className="mt-4 text-lg text-slate-500 leading-relaxed">
              {t('landing.subline')}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button size="lg" onClick={handleStart}>
                {t('landing.cta')}
                <ChevronRight size={18} />
              </Button>
              <a href="#documents">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  {t('landing.learnMore')}
                </Button>
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-slate-400" />
                {t('landing.timeEstimate')}
              </span>
              <span className="flex items-center gap-1.5">
                <Lock size={14} className="text-slate-400" />
                {t('landing.privacyNote')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {benefits.map(b => (
            <div key={b.title} className="text-center space-y-3">
              <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center mx-auto">
                {b.icon}
              </div>
              <h3 className="font-semibold text-slate-900">{b.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Documents */}
      <section id="documents" className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900">
              {t('wizard.intro.documents')}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {documents.map(doc => (
              <Card key={doc.key} className={`border ${doc.bg.split(' ').slice(1).join(' ')}`}>
                <CardContent className="space-y-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${doc.gradient} flex items-center justify-center`}>
                    <FileText size={18} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900">{t(`documents.${doc.key}`)}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{t(`documents.${doc.key}Desc`)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('landing.cta')}</h2>
        <Button size="lg" onClick={handleStart}>
          {t('landing.cta')}
          <ChevronRight size={18} />
        </Button>
      </section>
    </div>
  )
}
