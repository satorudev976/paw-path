import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@/hooks/use-user';
import { AuthService } from '@/services/auth.service';
import { UserService } from '@/services/user.service';
import { AccountDeletionService } from '@/services/account-deletion.service';
import { useAuth } from '@/hooks/use-auth';

export default function UserProfileScreen() {
  const router = useRouter();
  const { user, refresh } = useUser();
  const { authUser } = useAuth();
  
  const [editedNickname, setEditedNickname] = useState<string>('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!authUser) {
      router.replace('/');
    }
  }, [authUser]);

  useEffect(() => {
    if (user) {
      setEditedNickname(user.nickname);
    }
  }, [user]);

  const handleNicknameChange = (text: string) => {
    setEditedNickname(text);
    setHasChanges(user ? text.trim() !== user.nickname : false);
  };

  const handleResetNickname = () => {
    if (user) {
      setEditedNickname(user.nickname);
      setHasChanges(false);
    }
  };

  const handleSaveNickname = async () => {
    if (!user) return;
    
    if (!editedNickname.trim()) {
      Alert.alert('エラー', 'ニックネームを入力してください');
      return;
    }

    try {
      await UserService.setNickname(user.id, editedNickname.trim());
      await refresh();
      setHasChanges(false);
      Alert.alert('成功', 'ニックネームを保存しました');
    } catch (error) {
      console.error('ニックネーム保存エラー:', error);
      Alert.alert('エラー', 'ニックネームの保存に失敗しました');
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'ログアウト',
      'ログアウトしますか?\n\n※ログアウトしてもデータは保持されます。',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: 'ログアウト',
          style: 'destructive',
          onPress: async () => {
            try {
              await AuthService.logout();
            } catch (error) {
              console.error('ログアウトエラー:', error);
              Alert.alert('エラー', 'ログアウトに失敗しました');
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    Alert.alert(
      '⚠️ アカウント削除',
      'アカウントを削除すると、あなたが記録した散歩データが削除されます。\n\nこの操作は取り消せません。本当に削除しますか?',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除する',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              '最終確認',
              '本当にアカウントを削除しますか?\n\nこの操作は取り消せません。',
              [
                { text: 'キャンセル', style: 'cancel' },
                {
                  text: '完全に削除',
                  style: 'destructive',
                  onPress: executeAccountDeletion,
                },
              ]
            );
          },
        },
      ]
    );
  };

  const executeAccountDeletion = async () => {
    if (!user) return;

    try {
      console.log('アカウント削除開始:', user.id);

      const result = await AccountDeletionService.deleteAccount(user.id);

      if (result === true) {
        console.log('✅ アカウント削除完了');
        // 削除成功（自動的にログイン画面にリダイレクトされる）
      } else {
        // エラー
        const errorMessage = getAccountDeletionErrorMessage(result.error);
        Alert.alert('エラー', errorMessage);
      }
    } catch (error: any) {
      console.error('❌ アカウント削除エラー:', error);
      Alert.alert('エラー', 'アカウントの削除に失敗しました');
    }
  };

  const getAccountDeletionErrorMessage = (error: string): string => {
    switch (error) {
      case 'user-not-found':
        return 'ユーザーが見つかりません';
      case 'owner-has-members':
        return '他のメンバーがいるため、オーナーは退会できません';
      default:
        return '予期しないエラーが発生しました';
    }
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.push('/(tabs)/settings')} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ユーザー情報</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* ニックネーム */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ニックネーム</Text>
            <View style={styles.card}>
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.nicknameInput}
                  value={editedNickname}
                  onChangeText={handleNicknameChange}
                  placeholder="ニックネームを入力"
                  maxLength={20}
                />
                {hasChanges && (
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.resetButton}
                      onPress={handleResetNickname}
                    >
                      <Text style={styles.resetButtonText}>元に戻す</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={handleSaveNickname}
                    >
                      <Text style={styles.saveButtonText}>保存</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* アカウント管理 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>アカウント管理</Text>

            {/* ログアウトボタン */}
            <TouchableOpacity style={styles.actionButton} onPress={handleSignOut}>
              <Ionicons name="log-out-outline" size={24} color="#4A90E2" />
              <Text style={[styles.actionButtonText, { color: '#4A90E2' }]}>ログアウト</Text>
              <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
            </TouchableOpacity>

            {/* アカウント削除ボタン */}
            <TouchableOpacity 
                style={[styles.actionButton, { marginTop: 12 }]} 
              onPress={handleDeleteAccount}
            >
              <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
              <Text style={styles.actionButtonText}>アカウントを削除</Text>
              <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
            </TouchableOpacity>
          </View>

          {/* 注意事項 */}
          <View style={styles.warningBox}>
            <Ionicons name="warning-outline" size={20} color="#FF9800" />
            <Text style={styles.warningText}>
              アカウントを削除すると、散歩記録が完全に削除されます。この操作は取り消せません。
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666666',
    marginBottom: 8,
    paddingLeft: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputGroup: {
    gap: 12,
  },
  nicknameInput: {
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  resetButtonText: {
    color: '#666666',
    fontSize: 15,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#FF6B6B',
    marginLeft: 12,
    flex: 1,
    fontWeight: '600',
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#E65100',
    lineHeight: 20,
  },
});