import axios from 'axios'
import type { User, DocumentPackage, WizardAnswers, GeneratedDocument } from '@/types'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      window.location.href = '/login?session=expired'
    }
    return Promise.reject(err)
  }
)

// Auth
export const authApi = {
  register: (data: { email: string; password: string }) =>
    api.post<{ user: User }>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<{ user: User }>('/auth/login', data),

  logout: () => api.post('/auth/logout'),

  me: () => api.get<{ user: User }>('/auth/me'),
}

// Document packages
export const packagesApi = {
  create: (answers: WizardAnswers) =>
    api.post<{ package: DocumentPackage }>('/packages', { answers }),

  list: () => api.get<{ packages: DocumentPackage[] }>('/packages'),

  get: (id: string) =>
    api.get<{ package: DocumentPackage & { answers: WizardAnswers } }>(`/packages/${id}`),

  delete: (id: string) => api.delete(`/packages/${id}`),
}

// PDF generation
export const generateApi = {
  generateAll: (packageId: string) =>
    api.post<{ documents: GeneratedDocument[] }>(`/generate/${packageId}/all`),

  downloadUrl: (packageId: string, docId: string) =>
    `/api/generate/${packageId}/download/${docId}`,

  status: (packageId: string) =>
    api.get<{ documents: GeneratedDocument[] }>(`/generate/${packageId}/status`),
}

export default api
