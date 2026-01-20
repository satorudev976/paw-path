// services/login.service.ts
import { authRepository } from '@/infrastructure/firebase/repositories/auth.repository'
import { userRepository } from '@/infrastructure/firebase/repositories/user.repository'
import { User } from '@/domain/entities/user'

type idToken =
  | { provider: 'google'; idToken: string }
  | { provider: 'apple'; idToken: string }

export type userType =
  | { type: 'authenticated'; user: User }
  | { type: 'guest'; authUid: string }

export const AuthService = {
  async login(params: idToken): Promise<userType> {
    const authUser =
      params.provider === 'google'
        ? await authRepository.signInWithGoogle(params.idToken)
        : await authRepository.signInWithApple(params.idToken)

    const user = await userRepository.findById(authUser.uid)
    
    if (user) return { type: 'authenticated', user: user }

    return { type: 'guest', authUid: authUser.uid }
  },
}
