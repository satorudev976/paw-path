import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { InviteJoinService, InviteJoinError } from '@/services/invite-join.service';
import { useAuth } from '@/hooks/use-auth';

export default function InviteTokenScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const router = useRouter();
  const { authUser } = useAuth();
  const [error, setError] = useState<InviteJoinError | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (!token) {
      setError('invite-not-found');
      setIsVerifying(false);
      return;
    }

    if (!authUser) {
      // 認証されていない場合はログイン画面へ
      router.replace('/login');
      return;
    }

    verifyAndNavigate();
  }, [token, authUser]);

  const verifyAndNavigate = async () => {
    if (!token || !authUser) return;

    setIsVerifying(true);

    // 招待を検証
    const verifyResult = await InviteJoinService.verifyInvite(token);
    if ('error' in verifyResult) {
      setError(verifyResult.error);
      setIsVerifying(false);
      return;
    }

    // 参加可能かチェック
    const canJoinResult = await InviteJoinService.canJoinFamily(authUser.uid);
    if (canJoinResult !== true) {
      setError(canJoinResult.error);
      setIsVerifying(false);
      return;
    }

    // 検証成功 → ニックネーム入力画面へ
    router.replace({
      pathname: '/(auth)/invite/nickname',
      params: { token, familyId: verifyResult.familyId },
    });
  };

  const getErrorMessage = (error: InviteJoinError): string => {
    switch (error) {
      case 'invite-not-found':
        return '招待が見つかりません';
      case 'invite-expired':
        return '招待の有効期限が切れています';
      case 'invite-inactive':
        return 'この招待は既に使用されています';
      case 'already-in-family':
        return '既に他の家族に所属しているため、参加できません';
      default:
        return '招待の確認中にエラーが発生しました';
    }
  };

  if (isVerifying) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>招待を確認しています...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>招待リンクが無効です</Text>
        <Text style={styles.errorMessage}>{getErrorMessage(error)}</Text>
        <Text
          style={styles.backButton}
          onPress={() => router.replace('/(tabs)')}
        >
          ホームに戻る
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
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  backButton: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
    padding: 12,
  },
});