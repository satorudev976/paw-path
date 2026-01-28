import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { InviteJoinService } from '@/services/invite-join.service';
import { useAuth } from '@/hooks/use-auth';

export default function InviteNicknameScreen() {
  const { token, familyId } = useLocalSearchParams<{ token: string; familyId: string }>();
  const router = useRouter();
  const { authUser } = useAuth();
  
  const [nickname, setNickname] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const isJoiningRef = useRef(false); // 二重実行防止

  const handleJoin = async () => {
    if (!nickname.trim()) {
      Alert.alert('エラー', 'ニックネームを入力してください');
      return;
    }

    if (!token || !authUser) {
      Alert.alert('エラー', '招待情報が見つかりません');
      return;
    }

    // 二重実行防止
    if (isJoiningRef.current) return;
    isJoiningRef.current = true;
    setIsJoining(true);

    try {
      const result = await InviteJoinService.joinFamily(
        token,
        authUser.uid,
        nickname.trim()
      );

      if (result === true) {
        // 成功 → タブ画面へ
        Alert.alert('参加完了', '家族グループに参加しました！', [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)'),
          },
        ]);
      } else {
        // エラー
        const errorMessage = getErrorMessage(result.error);
        Alert.alert('エラー', errorMessage);
      }
    } catch (error) {
      console.error('家族参加エラー:', error);
      Alert.alert('エラー', '家族への参加に失敗しました');
    } finally {
      setIsJoining(false);
      isJoiningRef.current = false;
    }
  };

  const getErrorMessage = (error: string): string => {
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
        return '予期しないエラーが発生しました';
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.icon}>👋</Text>
        <Text style={styles.title}>ニックネームを入力</Text>
        <Text style={styles.subtitle}>
          家族グループで表示される名前を入力してください
        </Text>

        <TextInput
          style={styles.input}
          placeholder="例: たろう"
          value={nickname}
          onChangeText={setNickname}
          maxLength={20}
          autoFocus
          editable={!isJoining}
        />

        <Text style={styles.hint}>※ 後から変更できます</Text>

        <TouchableOpacity
          style={[styles.button, isJoining && styles.buttonDisabled]}
          onPress={handleJoin}
          disabled={isJoining}
        >
          {isJoining ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>参加する</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={isJoining}
        >
          <Text style={styles.cancelButtonText}>キャンセル</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  icon: {
    fontSize: 64,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  input: {
    width: '100%',
    height: 56,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    backgroundColor: '#F5F5F5',
    marginBottom: 8,
  },
  hint: {
    fontSize: 14,
    color: '#999',
    marginBottom: 32,
    alignSelf: 'flex-start',
  },
  button: {
    width: '100%',
    height: 56,
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#B0B0B0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 12,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
});