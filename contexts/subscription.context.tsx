import {
  createContext,
  useState,
  useCallback,
} from 'react'
import { SubscriptionService } from '@/services/subscription.service'

type SubscriptionContextValue = {
  hasEntitlement: boolean
  isLoading: boolean
  refresh: () => Promise<void>
}

export const SubscriptionContext =
  createContext<SubscriptionContextValue | null>(null)

export const SubscriptionProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [hasEntitlement, setHasEntitlement] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true)
      const hasPremium = await SubscriptionService.hasPremium()
      setHasEntitlement(hasPremium)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <SubscriptionContext.Provider
      value={{ hasEntitlement, isLoading, refresh }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}
