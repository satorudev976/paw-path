import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/infrastructure/firebase/auth.firebase'

type AuthState = {
  status: 'loading' | 'authenticated' | 'unauthenticated'
  uid: string | null
}

export const AuthContext = createContext<AuthState | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    status: 'loading',
    uid: null,
  })

  useEffect(() => {
    return onAuthStateChanged(auth, user => {
      if (!user) {
        setState({ status: 'unauthenticated', uid: null })
      } else {
        setState({ status: 'authenticated', uid: user.uid })
      }
    })
  }, [])

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
