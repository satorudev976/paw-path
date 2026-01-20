import * as Google from 'expo-auth-session/providers/google'
import Constants from 'expo-constants'

export const useGoogleAuthRequest = () =>
  Google.useAuthRequest({
    iosClientId: Constants.expoConfig?.extra?.googleAuth.iosClientId,
    // androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: Constants.expoConfig?.extra?.googleAuth.webClientId,
})
