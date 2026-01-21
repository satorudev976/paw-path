import { createContext, useMemo } from 'react'
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

  const readonly = useMemo(() => {
    if (!isLoading || !family) return true

    // サブスク契約をしていたら書き込み可能
    if (hasEntitlement) return false

    // オーナーまたは家族のとき、アプリ内期間中であれば書き込み可能
    if (family.trialEndAt > new Date())
      return false

    // 上記以外は読み取り専用
    return true
  }, [hasEntitlement, family, isLoading])

  const trialUse = useMemo(() => {
    if (isLoading || !family) return false

    // サブスク契約中はトライアルではない（正規プラン）
    if (hasEntitlement) return false

    // トライアル期間中 = 使用中
    return family.trialEndAt > new Date()
  }, [hasEntitlement, family, isLoading])


  return (
    <AppAccessContext.Provider value={{ readonly, trialUse, isLoading }}>
      {children}
    </AppAccessContext.Provider>
  )
}