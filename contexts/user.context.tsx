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
  const { authUser } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const load = async () => {
    if (!authUser) return
    setIsLoading(true)
    const user = await UserService.get(authUser.uid)
    setUser(user)
    setIsLoading(false)
  }

  useEffect(() => {
    if (!authUser) return
    load()
  }, [authUser])

  return (
    <UserContext.Provider value={{ user, isLoading, refresh: load }}>
      {children}
    </UserContext.Provider>
  )
}
