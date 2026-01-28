import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { InviteService } from '@/services/invite.service';
import { UserService } from '@/services/user.service';
import { useAuth } from '@/hooks/use-auth';
import { InviteErrorCode, InviteErrorCodes } from '@/domain/invite/invite.errors';
import { UserErrorCode, UserErrorCodes } from '@/domain/user/user.error';
import { useInvite } from '@/hooks/use-invite';
import { OwnerToFamilyService } from '@/services/owner-to-family.service';

export default function InviteTokenScreen() {
  const router = useRouter();
  const { authUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const { invite, clearInviteData } = useInvite();

  useEffect(() => {
    verifyAndNavigate();
  }, [invite, authUser]);

  const verifyAndNavigate = async () => {
    if (!invite || !authUser) return;

    setIsVerifying(true);

    // 招待を検証
    const verifyResult = await InviteService.verifyInvite(invite);
    if (!verifyResult.ok) {
      setError(verifyErrorMessage(verifyResult.error.code));
      setIsVerifying(false);
      clearInviteData();
      return;
    }

    // 参加可能かチェック
    const canJoinResult = await UserService.canJoinFamily(authUser.uid);
    if (!canJoinResult.ok) {
      setError(joinFamilyMessage(canJoinResult.error.code));
      setIsVerifying(false);
      clearInviteData();
      return;
    }


    const joinUser = await UserService.get(authUser.uid);
    if (joinUser) {
        await OwnerToFamilyService.toFamily(invite.familyId)
    }
  };

  const verifyErrorMessage = (code: InviteErrorCode) => {
    switch (code) {
      case InviteErrorCodes.Expired:
        return '招待の有効期限が切れています';
      case InviteErrorCodes.InvalidToken:
        return '使用不可能な招待リンクです'
      case InviteErrorCodes.AlreadyUsed:
        return 'この招待は既に使用されています'
      default:
        return '招待の確認中にエラーが発生しました'
    }
  }

  const joinFamilyMessage = (code: UserErrorCode) => {
    switch (code) {
      case UserErrorCodes.AlreadyInFamily:
        return '既に他の家族に所属しているため、参加できません'
      default:
        return '招待の確認中にエラーが発生しました'
    }
  }

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
        <Text style={styles.errorMessage}>{error}</Text>
        <Text
          style={styles.backButton}
          onPress={() => router.replace('/')}
        >
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