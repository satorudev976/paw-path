import { db } from '@/infrastructure/firebase/firebase';
import { User } from '@/domain/entities/user'
import { Timestamp } from 'firebase/firestore';
import {
    doc,
    setDoc,
    getDoc,
  } from 'firebase/firestore';

export const UserRepository = {
  
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

  async create(user: User): Promise<void> {
    const ref = doc(db, "users", user.id)
    await setDoc(ref, {
      familyId: user.familyId,
      role: user.role,
      createdAt: Timestamp.fromDate(user.createdAt)
    })
  }
}