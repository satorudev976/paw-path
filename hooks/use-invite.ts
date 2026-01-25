import { useContext } from 'react'
import { InviteContext } from '@/contexts/invite.context'

export function useInvite() {
  const context = useContext(InviteContext);
  if (!context) {
    throw new Error('useInvite must be used within InviteProvider');
  }
  return context;
}