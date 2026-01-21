import { useContext } from 'react'
import { AppAccessContext } from '@/contexts/app-access.context'

export const useAppAccess = () => {
  const ctx = useContext(AppAccessContext)
  if (!ctx) {
    throw new Error(
      'useAppAccess must be used within AppAccessProvider'
    )
  }
  return ctx
}