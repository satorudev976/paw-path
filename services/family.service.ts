import { Family } from '@/domain/entities/family'
import { familyRepository } from '@/infrastructure/firebase/repositories/family.repository'
  
export const FamilyService = {
  /**
   * Family を取得
   */
  async get(familyId: string): Promise<Family> {
    const family = await familyRepository.findById(familyId)
    if (!family) {
      throw new Error('Family not found')
    }
    return family
  },

}
  