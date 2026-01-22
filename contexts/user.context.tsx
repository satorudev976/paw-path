import { createContext, useContext, useState, useEffect } from 'react';
import { UserService } from '@/services/user.service'
import { useAuth } from '@/hooks/use-auth'
import { User } from '@/domain/entities/user'

type UserContextValue = {
  user: User | null
  isLoading: boolean
}

export const UserContext = createContext<UserContextValue | null>(null)

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authUser } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadUser = async (uid: string) => {
    setIsLoading(true)
    try {
      const userData = await UserService.get(uid)
      setUser(userData)
    } catch (error) {
      console.error('ユーザー情報取得エラー:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!authUser) {
      setUser(null)
      setIsLoading(false)
      return
    }    
    loadUser(authUser.uid)
  }, [authUser])

  return (
    <UserContext.Provider value={{ user, isLoading }}>
      {children}
    </UserContext.Provider>
  )
}
