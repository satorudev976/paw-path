import { Timestamp } from 'firebase/firestore';

export interface Invite {
  token: string
  familyId: string
  createdBy: string
  createdAt: Timestamp
  expiresAt: Timestamp
  maxUses: number
  usedCount: number
  isActive: boolean
}