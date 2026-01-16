import { Timestamp } from 'firebase/firestore';

export interface User {
  userId: string 
  familyId: string
  nickname: string | null
  createdAt: Timestamp
}
  