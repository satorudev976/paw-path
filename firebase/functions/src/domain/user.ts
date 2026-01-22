import { Timestamp } from 'firebase/firestore';

export interface User {
  familyId: string
  role: 'owner' | 'family'
  nickname: string | null
  createdAt: Timestamp
}
  