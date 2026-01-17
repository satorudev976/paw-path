import { db } from '@/infrastructure/firebase/firebase';
import {
    collection,
    doc,
    setDoc,
  } from 'firebase/firestore';

const familiesRef = collection(db, 'families');

export const familyRepository = {

  async create(ownerId: string): Promise<string> {
    const ref = doc(familiesRef);
    const familyId = ref.id;

    const now = new Date();
    const trialEndAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7日後
    
    await setDoc(ref, {
      familyId: familyId,
      ownerId: ownerId,
      createdAt: now,
      planStatus: 'active',
      memberLimit: 5,
      trialEndAt: trialEndAt,
      trialUsed: true,
    });
    
    return familyId;
  }

}
