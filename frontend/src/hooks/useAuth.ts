import { useEffect } from 'react'
import { authApi } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

export function useAuthInit() {
  const { setUser, setLoading } = useAuthStore()

  useEffect(() => {
    authApi
      .me()
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [setUser, setLoading])
}
