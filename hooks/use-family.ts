import { useContext } from 'react'
import { FamilyContext } from '@/contexts/family.context'

export const useFamily = () => {
  const ctx = useContext(FamilyContext)
  if (!ctx) {
    throw new Error('useFamily must be used within FamilyProvider')
  }
  return ctx
}
