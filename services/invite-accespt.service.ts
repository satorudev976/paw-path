import { runTransaction } from 'firebase/firestore';
import { db } from '@/infrastructure/firebase/firebase';
import { inviteRepository } from '@/infrastructure/firebase/repositories/invite.repository';
import { userRepository } from '@/infrastructure/firebase/repositories/user.repository';
import { User } from '@/domain/entities/user';
import { Invite } from '@/domain/entities/invite';

export const InviteAcceptService = {

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