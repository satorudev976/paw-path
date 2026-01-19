import { db } from '@/infrastructure/firebase/firebase';
import { User } from '@/domain/entities/user'
import { Timestamp } from 'firebase/firestore';
import {
    doc,
    getDoc,
    Transaction,
  } from 'firebase/firestore';

export const userRepository = {
  
  async findById(userId: string): Promise<User | null> {
    const ref = doc(db, "users", userId)
    const snap = await getDoc(ref)

    if (!snap.exists()) return null

    const user = snap.data()

    return {
      id: snap.id,
      familyId: user.familyId,
      nickname: user.nickname,
      role: user.role,
      createdAt: user.createdAt.toDate()
    }
  },

  async create(tx: Transaction, user: User): Promise<void> {
    const ref = doc(db, "users", user.id)
    tx.set(ref, {
      familyId: user.familyId,
      role: user.role,
      nickname: user.nickname,
      createdAt: Timestamp.fromDate(user.createdAt)
    })
  }
}