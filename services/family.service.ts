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

  /**
   * planStatus 更新（ownerのみ想定）
   */
  async updatePlanStatus(familyId: string, status: 'active' | 'readOnly'): Promise<void> {
    await familyRepository.updatePlanStatus(familyId, status);
  },

  /**
   * trial 使用済みフラグを立てる
   */
  async markTrialUsed(familyId: string): Promise<void> {
    await familyRepository.updateTrialUsed(familyId, true);
  },
}
  