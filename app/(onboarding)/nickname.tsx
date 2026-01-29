import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { setUpOwnerService } from '@/services/setup-owner.service';
import { useAuth } from '@/hooks/use-auth';
import { useUser } from '@/hooks/use-user';
import { NicknameErrorCode, NicknameErrorCodes } from '@/domain/profile/nickname.errors';
import { UserProfileService } from '@/services/user-profile.service';

export default function NicknameScreen() {
  const router = useRouter();
  const { authUser } = useAuth();
  const { user, refresh } = useUser();
  
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [user]);

  const nicknameErrorMessage = (code: NicknameErrorCode) => {
    switch (code) {
      case NicknameErrorCodes.TooShort:
        return 'ニックネームを入力してください'
      case NicknameErrorCodes.TooLong:
        return 'ニックネームは20文字以内で入力してください'
      default:
        return '入力内容を確認してください'
    }
  }

  const handleSetUp = async () => {

    setIsLoading(true);

    const result = UserProfileService.validateNickname(nickname.trim());
    if (!result.ok) {
      Alert.alert('入力エラー', nicknameErrorMessage(result.error.code));
      return;
    }
    
    try {
      await setUpOwnerService.setUp(authUser!.uid, nickname.trim());
      refresh();
    } catch (error: any) {
      console.error('セットアップエラー:', error);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.emoji}>🐾</Text>
        <Text style={styles.title}>
          ニックネームを設定
        </Text>

        <TextInput
          style={styles.input}
          placeholder="例: たろう"
          value={nickname}
          onChangeText={setNickname}
          maxLength={20}
          autoFocus
          editable={!isLoading}
        />

        <Text style={styles.hint}>※20文字以内</Text>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSetUp}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>
              設定完了
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    padding: 40,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  input: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 18,
    marginBottom: 8,
  },
  hint: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 32,
  },
  button: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#4A90E2',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});