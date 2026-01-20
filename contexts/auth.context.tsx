import { createContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth'
import { auth } from '@/infrastructure/firebase/auth.firebase'

type AuthContextValue = {
  firebaseUser: FirebaseUser | null
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user)
      setIsLoading(false)
    })
  }, [])

  return (
    <AuthContext.Provider value={{ firebaseUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
