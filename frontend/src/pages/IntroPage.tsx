import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useWizardDraft } from '../hooks/useWizardDraft'

export function IntroPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { loadDraft, hasDraft } = useWizardDraft(null, () => {})

  const handleStart = () => {
    navigate('/wizard')
  }

  const handleResume = () => {
    const draft = loadDraft()
    if (draft) {
      navigate('/wizard', { state: { answers: draft } })
    }
  }

  return (
    <div className="max-w-xl mx-auto text-center space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-semibold text-slate-800 mb-4">
          {t('intro.title')}
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          {t('intro.description')}
        </p>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-left text-sm text-amber-900">
        {t('intro.disclaimer')}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleStart}
          className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          {t('intro.start')}
        </button>
        {hasDraft() && (
          <button
            onClick={handleResume}
            className="px-8 py-3 bg-slate-200 text-slate-800 rounded-lg font-medium hover:bg-slate-300 transition-colors"
          >
            {t('intro.resume')}
          </button>
        )}
      </div>
    </div>
  )
}
