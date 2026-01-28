import { auth } from '@/infrastructure/firebase/auth.firebase';
import { userRepository } from '@/infrastructure/firebase/repositories/user.repository';
import { inviteRepository } from '@/infrastructure/firebase/repositories/invite.repository';
import { walkRepository } from '@/infrastructure/firebase/repositories/walk.repository';
import { familyRepository } from '@/infrastructure/firebase/repositories/family.repository';
/**
 * アカウント削除のエラー型
 */
export type AccountDeletionError =
  | 'user-not-found'              // ユーザーが見つからない
  | 'owner-has-members'           // オーナーで他にメンバーがいる
  | 'unknown';                    // その他のエラー

/**
 * アカウント削除サービス
 */
export const AccountDeletionService = {

  /**
   * アカウントを完全に削除
   * @param userId ユーザーID
   * @returns 成功時はtrue、失敗時はエラー型
   */
  async deleteAccount(userId: string): Promise<true | { error: AccountDeletionError }> {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        return { error: 'user-not-found' };
      }

      if (user.role === 'owner') {
        const familyMembers = await userRepository.findByFamilyId(user.familyId);
        // オーナーの場合、他にメンバーがいるかチェック
        if (familyMembers.length > 1) {
          return { error: 'owner-has-members' };
        }
      }
      console.log('🗑️ ユーザーデータを削除:', userId, `(${user.role})`);
      await walkRepository.deleteWalksByUserId(userId, user.familyId);
      // オーナーの場合は家族と招待も削除
      if (user.role === 'owner') {
        await inviteRepository.deleteByFamilyId(user.familyId);
        await familyRepository.delete(user.familyId)
        console.log('✅ 家族ドキュメント削除完了');
      }
      await userRepository.delete(user.id);
      console.log('✅ ユーザードキュメント削除完了');
      await auth.signOut();
      return true;
    } catch (error) {
      console.error('アカウント削除エラー:', error);
      return { error: 'unknown' };
    }
  },

};