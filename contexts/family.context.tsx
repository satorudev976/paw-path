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

  const load = async () => {
    if (!user) return
    setIsLoading(true)
    const family = await FamilyService.get(user.familyId)
    setFamily(family)
    setIsLoading(false)
  }

  useEffect(() => {
    if (!user) return
    load()
  }, [user])

  return (
    <FamilyContext.Provider value={{ family, isLoading, refresh: load }}>
      {children}
    </FamilyContext.Provider>
  )
}
