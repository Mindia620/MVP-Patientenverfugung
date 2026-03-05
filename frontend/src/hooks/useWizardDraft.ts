import { useCallback, useEffect } from 'react'
import type { Answers } from '../types'

const STORAGE_KEY = 'vorsorge-wizard-draft'

export function useWizardDraft(answers: Answers | null, setAnswers: (a: Answers | null) => void) {
  const saveDraft = useCallback((data: Answers) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      // ignore
    }
  }, [])

  const loadDraft = useCallback((): Answers | null => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      return JSON.parse(raw) as Answers
    } catch {
      return null
    }
  }, [])

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
    setAnswers(null)
  }, [setAnswers])

  const hasDraft = useCallback(() => {
    return localStorage.getItem(STORAGE_KEY) !== null
  }, [])

  useEffect(() => {
    if (answers) {
      saveDraft(answers)
    }
  }, [answers, saveDraft])

  return { loadDraft, clearDraft, hasDraft }
}
