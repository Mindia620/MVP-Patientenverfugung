import { create } from 'zustand'
import { authApi } from '../lib/api'
import type { User } from '../lib/api'

interface AuthStore {
  user: User | null
  loading: boolean
  initialized: boolean
  setUser: (user: User | null) => void
  initialize: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: false,
  initialized: false,

  setUser: (user) => set({ user }),

  initialize: async () => {
    set({ loading: true })
    try {
      const res = await authApi.me()
      set({ user: res.data.user, initialized: true, loading: false })
    } catch {
      set({ user: null, initialized: true, loading: false })
    }
  },

  logout: async () => {
    try {
      await authApi.logout()
    } finally {
      set({ user: null })
    }
  },
}))
