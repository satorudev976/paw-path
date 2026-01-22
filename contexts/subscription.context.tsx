import {
  createContext,
  useState,
  useEffect,
} from 'react'
import { SubscriptionService } from '@/services/subscription.service'

type SubscriptionContextValue = {
  hasEntitlement: boolean
  isLoading: boolean
}

export const SubscriptionContext =
  createContext<SubscriptionContextValue | null>(null)

export const SubscriptionProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [hasEntitlement, setHasEntitlement] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const loadSubscription = async () => {
    setIsLoading(true)
    try {
      const hasPremium = await SubscriptionService.hasPremium()
      setHasEntitlement(hasPremium)
    } catch (error) {
      console.error('サブスクリプション状態の取得エラー:', error)
      setHasEntitlement(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSubscription()
  }, [])

  return (
    <SubscriptionContext.Provider
      value={{ hasEntitlement, isLoading }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}
