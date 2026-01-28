import { userRepository } from '@/infrastructure/firebase/repositories/user.repository'
import { User } from '@/domain/entities/user'
import { err, ok, type Result } from '@/domain/shared/result'
import { makeError } from '@/domain/shared/errorFactory'
import { UserErrorCodes, type UserError } from '@/domain/user/user.error'

export const UserService = {
  /**
   * user 取得
   */
  async get(uid: string): Promise<User | null> {
    const user = await userRepository.findById(uid);
    return user
  },

  
  async getFamilyUsers(familyId: string): Promise<User[]> {
    const users = await userRepository.findByFamilyId(familyId);
    return users
  },

  async setNickname(uid: string, nickname: string): Promise<void> {
    await userRepository.updateNickname(uid, nickname);
  },

  /**
   * 家族に参加できるかチェック
   * @param userId ユーザーID
   * @returns 参加可能か、エラー型
   */
  async canJoinFamily(userId: string): Promise<Result<void, UserError>> {
    const user = await userRepository.findById(userId);

    if (!user) {
      // ユーザーが存在しない場合は参加可能
      return ok(undefined);
    }
    const count = await userRepository.countByFamilyId(user.familyId);
    // オーナーの場合、他にメンバーがいるかチェック
    if (count > 1) {
      return err(makeError(UserErrorCodes.AlreadyInFamily))
    }
    return ok(undefined);
  },

}
