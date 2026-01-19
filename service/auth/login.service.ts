// services/login.service.ts
import { authRepository } from '@/infrastructure/firebase/repositories/auth.repository'
import { userRepository } from '@/infrastructure/firebase/repositories/user.repository'
import { User } from '@/domain/entities/user'

type idToken =
  | { provider: 'google'; idToken: string }
  | { provider: 'apple'; idToken: string }

export const loginService = {
  async login(params: idToken): Promise<User | null> {
    const authUser =
      params.provider === 'google'
        ? await authRepository.signInWithGoogle(params.idToken)
        : await authRepository.signInWithApple(params.idToken)

    const user = await userRepository.findById(authUser.uid)
    return user
  },
}
