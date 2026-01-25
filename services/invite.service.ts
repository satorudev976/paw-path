import { inviteRepository } from '@/infrastructure/firebase/repositories/invite.repository';
import { Invite } from '@/domain/entities/invite';
import { randomUUID } from 'expo-crypto';

export const InviteService = {

  /**
   * 招待を作成
   * @param familyId 招待先のfamilyId
   * @param createdBy 招待を作成したユーザーID
   * @returns 招待トークン
   */
  async createInvite(familyId: string, createdBy: string): Promise<string> {
    const token = randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24時間後

    const invite: Invite = {
      token,
      familyId,
      createdBy,
      createdAt: now,
      expiresAt,
      isActive: true,
    };

    await inviteRepository.create(invite);
    return token;
  },

  /**
   * 招待を取得
   */
  async getInvite(token: string): Promise<Invite | null> {
    return await inviteRepository.get(token);
  },

  /**
   * 招待の有効性を確認
   * @returns 有効な招待の場合、招待情報を返す。無効な場合はnull
   */
  async verifyInvite(token: string): Promise<Invite | null> {
    const invite = await inviteRepository.get(token);
    
    if (!invite) {
      return null;
    }

    if (!invite.isActive) {
      return null;
    }

    if (invite.expiresAt < new Date()) {
      return null;
    }

    return invite;
  },

  /**
   * 招待を無効化
   */
  async deactivateInvite(token: string): Promise<void> {
    await inviteRepository.updateIsActive(token, false);
  },

};