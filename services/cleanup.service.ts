import { walkRepository } from '@/infrastructure/firebase/repositories/walk.repository';
import { inviteRepository } from '@/infrastructure/firebase/repositories/invite.repository';
import { familyRepository } from '@/infrastructure/firebase/repositories/family.repository';

export const CleanupService = {
  /**
   * 指定された家族IDに紐づくすべてのデータを削除
   * @param familyId 削除対象の家族ID
   * @param userId 削除対象のユーザーID（walksの削除に使用）
   */
  async cleanupFamilyData(familyId: string, userId: string): Promise<void> {
    console.log('家族データクリーンアップ開始:', { familyId, userId });

    await walkRepository.deleteWalksByUserId(userId, familyId);

    await inviteRepository.deleteByFamilyId(familyId);

    await familyRepository.delete(familyId);

    console.log('家族データクリーンアップ完了');
  },
};