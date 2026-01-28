import { runTransaction, doc } from 'firebase/firestore';
import { db } from '@/infrastructure/firebase/firebase';
import { inviteRepository } from '@/infrastructure/firebase/repositories/invite.repository';
import { userRepository } from '@/infrastructure/firebase/repositories/user.repository';
import { User } from '@/domain/entities/user';

/**
 * 招待参加のエラー型
 */
export type InviteJoinError =
  | 'invite-not-found'      // 招待が見つからない
  | 'invite-expired'        // 招待の有効期限切れ
  | 'invite-inactive'       // 招待が無効化されている
  | 'already-in-family'     // 既に他の家族に所属している
  | 'unknown';              // その他のエラー

/**
 * 招待参加サービス
 */
export const InviteJoinService = {
  /**
   * 招待を検証（参加処理前のチェック）
   * @param token 招待トークン
   * @returns 招待情報（有効な場合）、エラー型（無効な場合）
   */
  async verifyInvite(token: string): Promise<{ familyId: string } | { error: InviteJoinError }> {
    const invite = await inviteRepository.get(token);

    if (!invite) {
      return { error: 'invite-not-found' };
    }

    if (!invite.isActive) {
      return { error: 'invite-inactive' };
    }

    if (invite.expiresAt < new Date()) {
      return { error: 'invite-expired' };
    }

    return { familyId: invite.familyId };
  },

  /**
   * 家族に参加できるかチェック
   * @param userId ユーザーID
   * @returns 参加可能か、エラー型
   */
  async canJoinFamily(userId: string): Promise<true | { error: InviteJoinError }> {
    const user = await userRepository.findById(userId);

    if (!user) {
      // ユーザーが存在しない場合は参加可能
      return true;
    }
    const count = await userRepository.countByFamilyId(user.familyId);
    // オーナーの場合、他にメンバーがいるかチェック
    if (count > 1) {
      return { error: 'already-in-family' };
    }
    return true
  },

  /**
   * 招待に参加（ユーザー作成 or 更新）
   * @param token 招待トークン
   * @param userId ユーザーID
   * @param nickname ニックネーム
   * @returns 成功時はtrue、失敗時はエラー型
   */
  async joinFamily(
    token: string,
    userId: string,
    nickname: string
  ): Promise<true | { error: InviteJoinError }> {
    try {
      // 招待を検証
      const verifyResult = await this.verifyInvite(token);
      if ('error' in verifyResult) {
        return verifyResult;
      }

      const { familyId } = verifyResult;

      // 参加可能かチェック
      const canJoinResult = await this.canJoinFamily(userId);
      if (canJoinResult !== true) {
        return canJoinResult;
      }

      // トランザクションでユーザー作成/更新 + 招待無効化
      await runTransaction(db, async (tx) => {
        const inviteRef = doc(db, 'invites', token);
        const userRef = doc(db, 'users', userId);

        // 招待を無効化
        tx.update(inviteRef, { isActive: false });

        // ユーザーを作成 or 更新
        const existingUser = await userRepository.findById(userId);

        if (!existingUser) {
          // 新規ユーザー作成
          const newUser: User = {
            id: userId,
            familyId,
            role: 'family',
            nickname,
            createdAt: new Date(),
          };
          userRepository.create(tx, newUser);
        } else {
          // 既存ユーザーの familyId を更新
          tx.update(userRef, {
            familyId,
            nickname, // ニックネームも更新
          });
        }
      });

      return true;
    } catch (error) {
      console.error('招待参加エラー:', error);
      return { error: 'unknown' };
    }
  },
};