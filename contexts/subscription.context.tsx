import React, {
  createContext,
  useEffect,
  useState,
  useCallback,
} from 'react'

import { useAuthContext } from './auth.context'
import { FamilyService } from '@/services/family.service'
import { SubscriptionService } from '@/services/subscription.service'

export type SubscriptionState = {
  isLoading: boolean
  isActive: boolean        // 利用可能か
  isTrialActive: boolean
  planStatus: 'active' | 'readOnly'
}

type SubscriptionContextValue = SubscriptionState & {
  refresh: () => Promise<void>
}

export const SubscriptionContext =
  createContext<SubscriptionContextValue | null>(null)

export const SubscriptionProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const { user } = useAuthContext()

  const [state, setState] = useState<SubscriptionState>({
    isLoading: true,
    isActive: false,
    isTrialActive: false,
    planStatus: 'readOnly',
  })

  const evaluate = useCallback(async () => {
    if (!user) return

    setState((s) => ({ ...s, isLoading: true }))

    const family = await FamilyService.get(user.familyId)
    const hasEntitlement =
      user.role === 'owner'
        ? await SubscriptionService.hasPremium()
        : false

    const now = Date.now()
    const trialActive = family.trialEndAt.getTime() > now

    const active = hasEntitlement || trialActive

    setState({
      isLoading: false,
      isActive: active,
      isTrialActive: trialActive,
      planStatus: active ? 'active' : 'readOnly',
    })

    // Firestore 同期（オーナーのみ）
    if (user.role === 'owner' &&
        family.planStatus !== (active ? 'active' : 'readOnly')
    ) {
      await FamilyService.updatePlanStatus(
        user.familyId,
        active ? 'active' : 'readOnly'
      )
    }
  }, [user])

  useEffect(() => {
    if (!user) return
    evaluate()
  }, [user, evaluate])

  return (
    <SubscriptionContext.Provider
      value={{ ...state, refresh: evaluate }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}
