import { runTransaction } from 'firebase/firestore';
import { db } from '@/infrastructure/firebase/firebase';
import { inviteRepository } from '@/infrastructure/firebase/repositories/invite.repository';
import { userRepository } from '@/infrastructure/firebase/repositories/user.repository';
import { User } from '@/domain/entities/user';
import { Invite } from '@/domain/entities/invite';
import { err, ok, type Result } from '@/domain/shared/result';
import { makeError } from '@/domain/shared/errorFactory';
import { UserErrorCodes, type UserError } from '@/domain/user/user.error';
import { CleanupService } from './cleanup.service';

export const InviteAcceptService = {
  /**
   * 既存ユーザーが別の家族に参加（家族切り替え）
   * @param invite 招待情報
   * @param userId ユーザーID
   * @param currentFamilyId 現在の家族ID（クリーンアップ用）
   */
  async switchFamily(
    invite: Invite,
    userId: string,
    currentFamilyId: string
  ): Promise<Result<void, UserError>> {
    try {
      console.log('🔄 家族切り替え開始:', { userId, from: currentFamilyId, to: invite.familyId });
      await runTransaction(db, async (tx) => {
        inviteRepository.updateIsActive(tx, invite.token, false);
        userRepository.switchFamily(tx, userId, invite.familyId);
      });
      await CleanupService.cleanupFamilyData(currentFamilyId, userId);

      console.log('✅ 家族切り替え完了');
      return ok(undefined);
    } catch (error) {
      console.error('❌ 家族切り替えエラー:', error);
      return err(makeError(UserErrorCodes.Unknown, { cause: error }));
    }
  },

  async joinFamily(
    invite: Invite,
    userId: string,
    nickname: string
  ): Promise<void> {
    // トランザクションでユーザー作成 + 招待無効化
    const newUser: User = {
      id: userId,
      familyId: invite.familyId,
      role: 'family',
      nickname: nickname,
      createdAt: new Date(),
    };

    await runTransaction(db, async (tx) => {
      inviteRepository.updateIsActive(tx, invite.token, false)
      userRepository.create(tx, newUser);
    });
  },
};