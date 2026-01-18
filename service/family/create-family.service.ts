import { doc, collection } from 'firebase/firestore'
import { db } from '@/infrastructure/firebase/firebase'
import { familyRepository } from '@/infrastructure/firebase/repositories/family.repository';
import { Family } from '@/domain/entities/family';

export const createFamily = async (): Promise<void> => {
  const familyId = doc(collection(db, 'families')).id

  const now = new Date()
  const trialEndAt = new Date(
    now.getTime() + 7 * 24 * 60 * 60 * 1000
  )

  const family: Family = {
    id: familyId,
    createdAt: now,
    planStatus: 'active',
    trialEndAt,
    trialUsed: true,
  }

  familyRepository.create(family);
}