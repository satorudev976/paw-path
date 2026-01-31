import { auth } from '@/infrastructure/firebase/auth.firebase';
import { userRepository } from '@/infrastructure/firebase/repositories/user.repository';
import { inviteRepository } from '@/infrastructure/firebase/repositories/invite.repository';
import { walkRepository } from '@/infrastructure/firebase/repositories/walk.repository';
import { familyRepository } from '@/infrastructure/firebase/repositories/family.repository';
import { UserDeleteError, UserDeleteErrorCodes } from '@/domain/user/user.error';
import { err, ok, type Result } from '@/domain/shared/result'
import { makeError } from '@/domain/shared/errorFactory'
/**
 * アカウント削除サービス
 */
export const AccountDeletionService = {

  /**
   * アカウントを完全に削除
   * @param userId ユーザーID
   * @returns 成功時はtrue、失敗時はエラー型
   */
  async deleteAccount(userId: string): Promise<Result<void, UserDeleteError>> {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        return err(makeError(UserDeleteErrorCodes.Unknown));
      }

      if (user.role === 'owner') {
        const count = await userRepository.countByFamilyId(user.familyId);
        // オーナーの場合、他にメンバーがいるかチェック
        if (count > 1) {
          return err(makeError(UserDeleteErrorCodes.OwnerHasMembers));
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
      return ok(undefined);
    } catch (error) {
      console.error('アカウント削除エラー:', error);
      return err(makeError(UserDeleteErrorCodes.Unknown));
    }
  },

};