import React, { useEffect, useState } from 'react';
import {
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
import { AuthService, userType } from '@/services/auth.service';
import * as AppleAuthentication from 'expo-apple-authentication'
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/use-auth';

export default function LoginScreen() {
  const router = useRouter();
  const { isLoading } = useAuth();
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

  const handleGoogleSingIn = async () => {
    if (googleResponse?.type !== 'success') return
    const idToken = googleResponse.authentication?.idToken
    if (idToken) {
      const user = await AuthService.login({
        provider: 'google',
        idToken: idToken
      });

      await handleSingIn(user);
    }
  }

  const handleAppleSignIn = async () => {
    const result = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    })
    const idToken = result.identityToken
      if (idToken) {
        const user = await AuthService.login({
          provider: 'apple',
          idToken: idToken
        });

        await handleSingIn(user);
      }
  }

  const handleSingIn = async (user: userType) => {
    
    if (user.type === 'authenticated') {
      // 既存ユーザーがログアウトして、再度ログイン
      router.replace('/(tabs)');
    } else {
      // 新規ユーザー
      router.replace({
        pathname: '/(onboarding)/nickname',
        params: {
          authUid: user.authUid,
        },
      });
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

        {/* ステップ1: ログイン */}
        <View style={styles.stepContainer}>
          <View style={styles.stepHeader}>
            <View style={styles.stepDivider} />
            <Text style={styles.stepLabel}>新規で始める方、既にアカウントをお持ちの方</Text>
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
                  <Text style={styles.googleButtonText}>Googleで続ける</Text>
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
                    <Text style={styles.appleButtonText}>Appleで続ける</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ステップ2: 招待 */}
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

        <Text style={styles.termsText}>
          続行することで、利用規約とプライバシーポリシーに同意したものとみなされます
        </Text>

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
  termsText: {
    marginTop: 40,
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 18,
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