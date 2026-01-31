import React, { useEffect, useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  Animated,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGoogleAuthRequest } from '@/hooks/google-auth-request'
import { AuthService } from '@/services/auth.service';
import * as AppleAuthentication from 'expo-apple-authentication'
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/hooks/use-auth';

export default function LoginScreen() {
  const params = useLocalSearchParams<{ next?: string; token?: string }>()
  const router = useRouter();
  const { isLoading, authUser } = useAuth();
  const bounceAnim = useState(new Animated.Value(0))[0];
  const [_, googleResponse, promptGoogleSignIn] = useGoogleAuthRequest();

  useEffect(() => {
    // アイコンのバウンスアニメーション
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -15,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Googleログインのレスポンス処理
  useEffect(() => {
    if (googleResponse?.type === 'success') {
      handleGoogleResponse(googleResponse);
    }
  }, [googleResponse]);

  useEffect(() => {
    if (!authUser) return
  
    if (params?.next && params?.token) {
      router.replace({
        pathname: params.next as any,
        params: { token: params.token },
      })
      return
    }
  
    router.replace('/')
  }, [authUser, params?.next, params?.token])

  const handleGoogleResponse = async (response: any) => {
    await AuthService.login({
      provider: 'google',
      idToken: response.params.id_token,
    });
  }

  const handleGoogleSingIn = async () => {
    try {
      const result = await promptGoogleSignIn();
      console.log('Google認証完了:', result.type);
    } catch (e) {
      console.error(e)
      Alert.alert('Googleログインに失敗しました')
    }
  }

  const handleAppleSignIn = async () => {
    try {
      const result = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      })
  
      const idToken = result.identityToken
      if (!idToken) {
        console.warn('Apple sign-in succeeded but identityToken is missing')
        return
      }
  
      await AuthService.login({
        provider: 'apple',
        idToken,
      })
    } catch (e: any) {
      // ユーザーが閉じた/キャンセルしただけ
      if (
        e?.code === 'ERR_REQUEST_CANCELED' ||
        e?.code === 'ERR_CANCELED' ||
        /canceled/i.test(String(e?.message))
      ) {
        return
      }
  
      console.error('Apple sign-in failed:', e)
      Alert.alert('Appleログインに失敗しました')
    }
  }


  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* アイコン画像 */}
        <Animated.View 
          style={[
            styles.iconContainer,
            { transform: [{ translateY: bounceAnim }] }
          ]}
        >
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.icon}
          />
        </Animated.View>
        
        <Text style={styles.title}>ぱうぱす</Text>

        {/* ログイン */}
        <View style={styles.stepContainer}>
          <View style={styles.stepHeader}>
            <View style={styles.stepDivider} />
            <Text style={styles.stepLabel}>
              {Boolean(params?.next && params?.token)
                ? '招待リンクから参加される方'
                : '新規で始める方、既にアカウントをお持ちの方'}
            </Text>
            <View style={styles.stepDivider} />
          </View>

          <View style={styles.buttonContainer}>
            {/* Googleログイン */}
            <TouchableOpacity
              style={[styles.button, styles.googleButton]}
              onPress={handleGoogleSingIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#4285F4" />
              ) : (
                <>
                  <Text style={styles.googleIcon}>G</Text>
                  <Text style={styles.googleButtonText}>
                    {Boolean(params?.next && params?.token)
                      ? 'Googleでログインして参加'
                      : 'Googleで続ける'}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Appleログイン (iOSのみ) */}
            {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={[styles.button, styles.appleButton]}
                onPress={handleAppleSignIn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.appleIcon}></Text>
                    <Text style={styles.appleButtonText}>
                      {Boolean(params?.next && params?.token)
                        ? 'Appleでログインして参加'
                        : 'Appleで続ける'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ステップ2: 招待 */}
        {!Boolean(params?.next && params?.token) && (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <View style={styles.stepDivider} />
              <Text style={styles.stepLabel}>家族から招待された方</Text>
              <View style={styles.stepDivider} />
            </View>

            {/* 招待リンク案内 */}
            <View style={styles.inviteInfo}>
            <Text style={styles.inviteTitle}>👨‍👩‍👧‍👦 家族から招待されましたか?</Text>
              <Text style={styles.inviteText}>
                家族から招待リンクを送られた方は{'\n'}
              招待リンクから参加できます
              </Text>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  icon: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 40,
  },
  stepContainer: {
    width: '100%',
    marginBottom: 32,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepDivider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    paddingHorizontal: 12,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4285F4',
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  appleButton: {
    backgroundColor: '#000000',
  },
  appleIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    marginRight: 12,
  },
  appleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  inviteInfo: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inviteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
  },
  inviteText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
});