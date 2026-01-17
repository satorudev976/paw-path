import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth'
import { auth } from '../auth.firebase'
import {
    OAuthProvider,
    User as AuthUser,
    signOut as firebaseSignOut,
  } from 'firebase/auth';
import { useGoogleAuthRequest } from '@/hooks/google-auth-request'
import * as AppleAuthentication from 'expo-apple-authentication'

const [_, googleResponse, promptGoogleSignIn] =
  useGoogleAuthRequest();

export const signInWithGoogle= async (): Promise<AuthUser> => {
  const result = await promptGoogleSignIn()
  if (result.type !== 'success') {
    throw new Error('Google Sign-In cancelled')
  }
  const user = await signInWithGoogleByToken(result.params.id_token)
  return user
}

export const signInWithApple = async (): Promise<AuthUser> => {
  const appleResult = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });

  if (!appleResult.identityToken) {
    throw new Error('APPLE_ID_TOKEN_MISSING');
  }

  const user = await signInWithAppleByToken(appleResult.identityToken);
  return user
};

/**
 * Googleログイン処理
 */
const signInWithGoogleByToken = async (idToken: string): Promise<AuthUser> => {
  const credential = GoogleAuthProvider.credential(idToken);
  const userCredential = await signInWithCredential(auth, credential);
  return userCredential.user;
};

/**
 * Appleログイン処理
 */
const signInWithAppleByToken = async (identityToken: string): Promise<AuthUser> => {
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