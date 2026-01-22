import { authRepository } from '@/infrastructure/firebase/repositories/auth.repository'

type idToken =
  | { provider: 'google'; idToken: string }
  | { provider: 'apple'; idToken: string }

export const AuthService = {
  async login(params: idToken): Promise<void> {
    params.provider === 'google'
        ? await authRepository.signInWithGoogle(params.idToken)
        : await authRepository.signInWithApple(params.idToken)
  },

  async logout(): Promise<void> {
    await authRepository.signOut();
  }
}
