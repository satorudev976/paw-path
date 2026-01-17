import { familyRepository } from '@/infrastructure/firebase/repositories/family.repository';

export const createFamily = async (userId: string): Promise<string> => {
  const familyId = await familyRepository.create(userId);
  return familyId
}