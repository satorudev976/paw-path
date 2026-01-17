import { Timestamp } from 'firebase/firestore';

export interface User {
  userId: string 
  familyId: string
  role: 'owner' | 'family'
  nickname: string | null
  createdAt: Timestamp
}
  