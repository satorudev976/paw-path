import { Timestamp } from 'firebase/firestore';

export interface Member {
  userId: string
  role: 'owner' | 'family'
  nickname: string
  joinedAt: Timestamp
}