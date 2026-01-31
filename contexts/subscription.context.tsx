import {
  createContext,
  useState,
  useEffect,
} from 'react'
import { SubscriptionService } from '@/services/subscription.service'

type ProductType = 'monthly' | 'annual' | null

type SubscriptionContextValue = {
  hasEntitlement: boolean
  activeProductType: ProductType
  isLoading: boolean
  refresh: () => Promise<void>
}

export const SubscriptionContext =
  createContext<SubscriptionContextValue | null>(null)

export const SubscriptionProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [hasEntitlement, setHasEntitlement] = useState(false)
  const [activeProductType, setActiveProductType] = useState<ProductType>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadSubscription = async () => {
    setIsLoading(true)
    try {
      const hasPremium = await SubscriptionService.hasPremium()
      setHasEntitlement(hasPremium)
      if (hasPremium) {
        const activeProductType = await SubscriptionService.getActivePackage()
        setActiveProductType(activeProductType)
      } else {
        setActiveProductType(null)
      }
    } catch (error) {
      console.error('サブスクリプション状態の取得エラー:', error)
      setHasEntitlement(false)
      setActiveProductType(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSubscription()
  }, [])

  return (
    <SubscriptionContext.Provider
      value={{ hasEntitlement, activeProductType, isLoading, refresh: loadSubscription }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}
