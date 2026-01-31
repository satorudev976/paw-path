import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { InviteService } from '@/services/invite.service';
import { useAuth } from '@/hooks/use-auth';

type Status = 'verifying' | 'invalid' | 'ready';

export default function InviteTokenScreen() {
  const router = useRouter();
  const { authUser } = useAuth();
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [status, setStatus] = useState<Status>('verifying');

  useEffect(() => {
    const run = async () => {
      if (!token || typeof token !== 'string') {
        setStatus('invalid');
        return;
      }

      // 招待を検証
      const ok = await InviteService.verifyInvite(token);
      if (!ok) {
        setStatus('invalid');
        return;
      }

      if (!authUser) {
        // ログイン画面へ：招待で来た情報をURLで引き回す
        router.replace({
          pathname: '/login',
          params: {
            next: '/(auth)/invite/invite-resolve',
            token,
          },
        });
        return;
      }

      // 認証済みの場合は resolve 画面へ
      router.replace({
        pathname: '/(auth)/invite/invite-resolve',
        params: {
          token,
        },
      });
    };

    run();
  }, [token, authUser]);

  if (status === 'verifying') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>招待を確認しています...</Text>
      </View>
    );
  }

  if (status === 'invalid') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>招待リンクが無効です</Text>
        <Text style={styles.backButton} onPress={() => router.replace('/')}>
          戻る
        </Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  backButton: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
    padding: 12,
  },
});