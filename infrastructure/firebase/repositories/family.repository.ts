import { db } from '@/infrastructure/firebase/firebase';
import { Family } from '@/domain/entities/family';
import {
  doc,
  getDoc,
  Timestamp,
  Transaction,
} from 'firebase/firestore';

export const familyRepository = {

  async create(tx: Transaction, family: Family): Promise<void> {
    const ref = doc(db, 'families', family.id);

    tx.set(ref, {
      createdAt: Timestamp.fromDate(family.createdAt),
      trialEndAt: Timestamp.fromDate(family.trialEndAt),
    });
  },

  async findById(familyId: string): Promise<Family | null> {
    const ref = doc(db, 'families', familyId);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    const data = snap.data();

    return {
      id: snap.id,
      createdAt: data.createdAt.toDate(),
      trialEndAt: data.trialEndAt.toDate(),
    } as Family;
  },

};
