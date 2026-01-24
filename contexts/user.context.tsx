import { createContext, useContext, useState, useEffect } from 'react';
import { UserService } from '@/services/user.service'
import { useAuth } from '@/hooks/use-auth'
import { User } from '@/domain/entities/user'

type UserContextValue = {
  user: User | null
  isLoading: boolean
  refresh: () => Promise<void>
}

export const UserContext = createContext<UserContextValue | null>(null)

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authUser, isLoading: authLoading } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadUser = async (uid: string) => {
    setIsLoading(true)
    try {
      const user = await UserService.get(uid)
      console.log('ユーザー情報取得:', user)
      setUser(user)
    } catch (error) {
      console.error('ユーザー情報取得エラー:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (authLoading) {
      setIsLoading(true)
      return
    }

    if (!authUser) {
      setUser(null)
      setIsLoading(false)
      return
    }    
    loadUser(authUser.uid)
  }, [authUser, authLoading])

  const refresh = async () => {
    if (!authUser) return
    setIsLoading(true)
    await loadUser(authUser.uid)
  }

  return (
    <UserContext.Provider value={{ user, isLoading, refresh}}>
      {children}
    </UserContext.Provider>
  )
}
