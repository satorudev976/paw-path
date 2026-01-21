// infrastructure/firebase/repositories/auth.repository.ts
import {
  signInWithCredential,
  GoogleAuthProvider,
  OAuthProvider,
  User as AuthUser,
} from 'firebase/auth'
import { auth } from '@/infrastructure/firebase/auth.firebase'


export const authRepository = {
  async signInWithGoogle(idToken: string): Promise<AuthUser> {
    const credential = GoogleAuthProvider.credential(idToken)
    const userCredential = await signInWithCredential(auth, credential)
    return userCredential.user
  },

  async signInWithApple(idToken: string): Promise<AuthUser> {
    const provider = new OAuthProvider('apple.com')
    const credential = provider.credential({ idToken })
    const userCredential = await signInWithCredential(auth, credential)
    return userCredential.user
  },

  getCurrentAuthUser(): AuthUser | null {
    const user = auth.currentUser
    return user
  },

  async signOut(): Promise<void> {
    await auth.signOut()
  },
}
