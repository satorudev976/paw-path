// presentation/hooks/useGoogleAuthRequest.ts
import * as Google from 'expo-auth-session/providers/google'

export const useGoogleAuthRequest = () =>
  Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    // androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
})
