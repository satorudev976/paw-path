import { createContext } from 'react'
import { useSubscription } from '@/hooks/use-subscription'
import { useFamily } from '@/hooks/use-family'

export type AppAccess = 'active' | 'readOnly'

type AppAccessContextValue = {
  readonly: boolean
  trialUse: boolean
  isLoading: boolean
}

export const AppAccessContext =
  createContext<AppAccessContextValue | null>(null)

export const AppAccessProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const { hasEntitlement, isLoading: subLoading } = useSubscription()
  const { family, isLoading: familyLoading } = useFamily()

  const isLoading = subLoading || familyLoading

  // 読み取り専用かどうかを判定
  const readonly = (() => {
    if (isLoading || !family) return true
    if (hasEntitlement) return false
    if (family.trialEndAt > new Date()) return false
    return true
  })()

  // アプリお試し期間中かどうかを判定
  const trialUse = (() => {
    if (isLoading || !family) return false
    if (hasEntitlement) return false
    return family.trialEndAt > new Date()
  })()


  return (
    <AppAccessContext.Provider value={{ readonly, trialUse, isLoading }}>
      {children}
    </AppAccessContext.Provider>
  )
}