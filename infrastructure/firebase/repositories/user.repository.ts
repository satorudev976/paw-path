import { db } from '@/infrastructure/firebase/firebase';
import { User } from '@/domain/entities/user'
import { Timestamp } from 'firebase/firestore';
import {
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  Transaction,
} from 'firebase/firestore'

export const userRepository = {
  
  async findById(userId: string): Promise<User | null> {
    try {
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
    } catch (error: any) {
      // アカウント作成前の新規ユーザーのユーザー情報取得時
      if (error.code === 'permission-denied') {
        return null
      }
      throw error
    }
    
  },

  async findByFamilyId(familyId: string): Promise<User[]> {
    const ref = collection(db, "users");
    const q = query(
      ref,
      where("familyId", "==", familyId),
      orderBy("createdAt", "asc")  // 作成日時の昇順（古い順）
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        familyId: data.familyId,
        nickname: data.nickname,
        role: data.role,
        createdAt: data.createdAt.toDate(),
      };
    });
  },

  async create(tx: Transaction, user: User): Promise<void> {
    const ref = doc(db, "users", user.id)
    tx.set(ref, {
      familyId: user.familyId,
      role: user.role,
      nickname: user.nickname,
      createdAt: Timestamp.fromDate(user.createdAt)
    })
  },

  async updateNickname(
    uid: string,
    nickname: string
  ): Promise<void> {
    const ref = doc(db, 'users', uid)

    await updateDoc(ref, {
      nickname,
    })
  },

  async delete(uid: string): Promise<void> {
    await deleteDoc(doc(db, 'users', uid))
  },
}