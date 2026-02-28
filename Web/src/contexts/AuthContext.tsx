import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from 'firebase/auth'
import { FirebaseApi } from '../services/firebase/metodos'

type AuthContextValue = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<User | null>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      // ensure persistence is initialized before subscribing
      await FirebaseApi.initPersistence?.()
      const unsub = FirebaseApi.onAuthStateChanged((u) => {
        if (!mounted) return
        setUser(u)
        setLoading(false)
      })
      // cleanup
      ;(AuthContext as any)._unsub = unsub
    })()
    return () => {
      mounted = false
      const unsub = (AuthContext as any)._unsub
      if (typeof unsub === 'function') unsub()
    }
  }, [])

  const login = async (email: string, password: string) => {
    const u = await FirebaseApi.login(email, password)
    return u
  }

  const logout = async () => {
    await FirebaseApi.logout()
  }

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext
