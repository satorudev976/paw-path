import { createContext, useState, useEffect } from 'react';
import { FamilyService } from '@/services/family.service'
import { useUser } from '@/hooks/use-user'
import { Family } from '@/domain/entities/family'

type FamilyContextValue = {
  family: Family | null
  isLoading: boolean
  refresh: () => Promise<void>
}

export const FamilyContext = createContext<FamilyContextValue | null>(null)

export const FamilyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser()
  const [family, setFamily] = useState<Family | null>(null)
  const [isLoading, setIsLoading] = useState(true)


  const loadFamily = async (familyId: string) => {
    setIsLoading(true)
    try {
      const family = await FamilyService.get(familyId)
      setFamily(family)
    } catch (error) {
      console.error('家族情報取得エラー:', error)
      setFamily(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!user) {
      setIsLoading(false)
      setFamily(null)
      return
    }
    loadFamily(user?.familyId)
  }, [user])

  const refresh = async () => {
    if (!user?.familyId) return
    await loadFamily(user.familyId)
  }

  return (
    <FamilyContext.Provider value={{ family, isLoading, refresh }}>
      {children}
    </FamilyContext.Provider>
  )
}