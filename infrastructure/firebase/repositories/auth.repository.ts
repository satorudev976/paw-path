import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth'
import { auth } from '../auth.firebase'
import {
    OAuthProvider,
    User,
    signOut as firebaseSignOut,
  } from 'firebase/auth';
/**
 * Googleログイン処理
 */
export const signInWithGoogle = async (idToken: string): Promise<User> => {
  const credential = GoogleAuthProvider.credential(idToken);
  const userCredential = await signInWithCredential(auth, credential);
  return userCredential.user;
};

/**
 * Appleログイン処理
 */
export const signInWithApple = async (identityToken: string): Promise<User> => {
  const provider = new OAuthProvider('apple.com');
  const credential = provider.credential({ idToken: identityToken });
  const userCredential = await signInWithCredential(auth, credential);
  return userCredential.user;
};

/**
 * サインアウト
 */
export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};

/**
 * アカウント削除
 */
export const deleteAuthAccount = async (): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error('ユーザーが認証されていません');
  await user.delete();
};