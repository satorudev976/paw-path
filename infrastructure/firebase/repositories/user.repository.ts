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

    const data = snap.data()

    return {
      id: snap.id,
      familyId: data.familyId,
      role: data.role,
      createdAt: data.createdAt.toDate()
    }
  },

  async create(tx: Transaction, user: User): Promise<void> {
    const ref = doc(db, "users", user.id)
    tx.set(ref, {
      familyId: user.familyId,
      role: user.role,
      createdAt: Timestamp.fromDate(user.createdAt)
    })
  }
}