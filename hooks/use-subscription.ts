import { useContext } from 'react'
import { SubscriptionContext } from '@/contexts/subscription.context'

export const useSubscription = () => {
  const ctx = useContext(SubscriptionContext)
  if (!ctx) {
    throw new Error('SubscriptionContext not found')
  }
  return ctx
}
