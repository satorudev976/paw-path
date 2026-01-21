import { createContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  User as AuthUser,
} from 'firebase/auth'
import { auth } from '@/infrastructure/firebase/auth.firebase'

type AuthContextValue = {
  authUser: AuthUser | null
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setAuthUser(user)
      setIsLoading(false)
    })
  }, [])

  return (
    <AuthContext.Provider value={{ authUser: authUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
