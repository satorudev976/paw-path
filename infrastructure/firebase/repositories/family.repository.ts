import { db } from '@/infrastructure/firebase/firebase';
import { Family } from '@/domain/entities/family';
import {
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from 'firebase/firestore';

export const familyRepository = {

  async create(family: Family): Promise<void> {
    const ref = doc(db, 'families', family.id);

    await setDoc(ref, {
      createdAt: Timestamp.fromDate(family.createdAt),
      planStatus: family.planStatus,
      trialEndAt: Timestamp.fromDate(family.trialEndAt),
      trialUsed: family.trialUsed,
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
      planStatus: data.planStatus,
      trialEndAt: data.trialEndAt.toDate(),
      trialUsed: data.trialUsed,
    };
  },
};
