import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '@/hooks/use-auth';
import { useUser } from '@/hooks/use-user';

type Status = 'loading' | 'blocked' | 'redirected';

export default function InviteResolveScreen() {
  const router = useRouter();
  const { authUser } = useAuth();
  const { user, isLoading } = useUser();
  const { token } = useLocalSearchParams<{ token?: string }>();

  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    // 前提条件チェック
    if (!authUser || !token || typeof token !== 'string') {
      router.replace('/');
      return;
    }

    // UserContext のロード完了を待つ
    if (isLoading) {
      return;
    }

    // 判定実行
    resolve();
  }, [authUser, token, user, isLoading]);

  const resolve = () => {
    // 既に遷移済みの場合は何もしない（二重実行防止）
    if (status === 'redirected') {
      return;
    }

    // ユーザーが存在しない場合 → 新規ユーザー → nickname へ
    if (!user) {
      setStatus('redirected');
      router.replace({
        pathname: '/(onboarding)/nickname',
        params: { token },
      });
      return;
    }

    // ユーザーが存在する場合 → 既存ユーザー → blocked
    setStatus('blocked');
  };

  // Loading: 判定中
  if (status === 'loading') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>確認中...</Text>
      </View>
    );
  }

  // Blocked: 既存ユーザーで進めない
  if (status === 'blocked') {
    return (
      <View style={styles.container}>
        <Text style={styles.emoji}>⚠️</Text>
        <Text style={styles.errorTitle}>エラー</Text>
        <Text style={styles.errorMessage}>
          既にアカウントが存在します。{'\n'}
          別の家族に参加する場合は、先にアカウントを削除してから招待リンクをタップしてください。
        </Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.replace('/user-profile')}
          >
            <Text style={styles.primaryButtonText}>アカウント削除画面へ</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.secondaryButtonText}>ホームに戻る</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Redirected: 遷移済み（念のための fallback）
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  emoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  errorMessage: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 12,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  secondaryButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '600',
  },
});