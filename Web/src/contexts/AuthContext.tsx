import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { FirebaseApi } from '../services/firebase/metodos'
import type { UserBack } from '../utils/DataTypeBackEnd'
import { Auth } from '../services/Back-end/Auth'

type AuthContextValue = {
  user: UserBack | null
  loading: boolean
  // login resolves to the backend user when both Firebase and backend validate
  login: (email: string, password: string) => Promise<UserBack | null>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserBack | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
      ; (async () => {
        // ensure persistence is initialized before subscribing
        await FirebaseApi.initPersistence?.()
        const unsub = FirebaseApi.onAuthStateChanged(async (fbUser) => {
          if (!mounted) return
          try {
            if (!fbUser) {
              setUser(null)
              setLoading(false)
              return
            }
            const token = await fbUser.getIdToken()
            const userBack = await Auth.login(token)
            if (userBack) {
              setUser(userBack)
            } else {
              // user does not exist in backend — sign out from Firebase and clear state
              await FirebaseApi.logout()
              setUser(null)
            }
          } catch (e) {
            await FirebaseApi.logout()
            setUser(null)
          } finally {
            setLoading(false)
          }
        })
        ; (AuthContext as any)._unsub = unsub
      })()
    return () => {
      mounted = false
      const unsub = (AuthContext as any)._unsub
      if (typeof unsub === 'function') unsub()
    }
  }, [])

  const login = async (email: string, password: string) => {
    // first authenticate with Firebase
    const fbUser = await FirebaseApi.login(email, password)
    if (!fbUser) return null

    // then validate existence in backend using Firebase token
    try {
      const token = await fbUser.getIdToken()
      const userBack = await Auth.login(token)
      if (userBack) {
        setUser(userBack)
        return userBack
      }
      // backend user not found: sign out
      await FirebaseApi.logout()
      return null
    } catch (e) {
      await FirebaseApi.logout()
      return null
    }
  }

  const logout = async () => {
    await FirebaseApi.logout()
    setUser(null)
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
