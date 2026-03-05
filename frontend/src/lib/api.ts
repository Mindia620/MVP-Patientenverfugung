import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      // Let components handle auth redirects
    }
    return Promise.reject(error)
  }
)

export interface User {
  id: string
  email: string
  createdAt: string
}

export interface WizardDraft {
  id: string
  wizardVersion: string
  personalInfo: Record<string, unknown> | null
  trustedPerson: Record<string, unknown> | null
  medicalPrefs: Record<string, unknown> | null
  scenarios: Record<string, unknown> | null
  personalValues: Record<string, unknown> | null
  currentStep: number
}

export interface GeneratedDocument {
  id: string
  type: 'PATIENTENVERFUEGUNG' | 'VORSORGEVOLLMACHT' | 'BETREUUNGSVERFUEGUNG'
  status: 'PENDING' | 'GENERATED' | 'FAILED'
  fileSize: number | null
  generatedAt: string | null
}

export interface DocumentPackage {
  id: string
  label: string | null
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED'
  createdAt: string
  wizardVersion: string
  documents: GeneratedDocument[]
}

// Auth
export const authApi = {
  register: (email: string, password: string) =>
    api.post<{ user: User }>('/auth/register', { email, password }),

  login: (email: string, password: string) =>
    api.post<{ user: User }>('/auth/login', { email, password }),

  logout: () => api.post('/auth/logout'),

  me: () => api.get<{ user: User }>('/auth/me'),
}

// Wizard
export const wizardApi = {
  getDraft: () => api.get<{ draft: WizardDraft | null }>('/wizard/draft'),

  saveDraft: (data: Partial<WizardDraft>) =>
    api.post<{ draft: WizardDraft }>('/wizard/draft', data),
}

// Documents
export const documentsApi = {
  generate: (answers: Record<string, unknown>) =>
    api.post<{ package: DocumentPackage }>('/documents/generate', answers),

  list: () => api.get<{ packages: DocumentPackage[] }>('/documents'),

  get: (id: string) => api.get<{ package: DocumentPackage }>(`/documents/${id}`),

  downloadUrl: (packageId: string, type: string) =>
    `/api/documents/${packageId}/pdf/${type}`,
}

// Users
export const usersApi = {
  exportData: () => api.get('/users/me/export'),

  deleteAccount: (password: string) =>
    api.delete('/users/me', { data: { password } }),
}

export default api
