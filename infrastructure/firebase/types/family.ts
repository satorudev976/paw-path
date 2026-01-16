import { Timestamp } from 'firebase/firestore';

export interface Family {
  familyId: string
  ownerId: string
  createdAt: Timestamp
  planStatus: 'active' | 'readOnly'
  memberCount: number
  trialEndAt: Timestamp
  trialUsed: boolean
}
