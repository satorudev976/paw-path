import { userRepository } from '@/infrastructure/firebase/repositories/user.repository'
import { User } from '@/domain/entities/user'

export const UserService = {
  /**
   * user 取得
   */
  async get(uid: string): Promise<User | null> {
    const user = await userRepository.findById(uid);

    if (!user) return null
    return user
  },

  
  async getFamilyUsers(familyId: string): Promise<User[]> {
    const users = await userRepository.findByFamilyId(familyId);
    return users
  },

  async setNickname(uid: string, nickname: string): Promise<void> {
    await userRepository.updateNickname(uid, nickname);
  }

}
