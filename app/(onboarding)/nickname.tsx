import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
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
import { setUpOwnerService } from '@/services/setup-owner.service'
/**
 * ニックネーム設定画面
 * 
 */
export default function NicknameScreen() {
  const router = useRouter();
  
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { authUid } = useLocalSearchParams<{ authUid: string }>();

  const handleSetUp = async () => {
    console.log('=== ニックネーム設定開始 ===');

    // バリデーション
    if (!nickname.trim()) {
      Alert.alert('エラー', 'ニックネームを入力してください');
      return;
    }

    if (nickname.trim().length > 20) {
      Alert.alert('エラー', 'ニックネームは20文字以内で入力してください');
      return;
    }

    setIsLoading(true);
    
    try {
      await setUpOwnerService.setUp(
        authUid,
        nickname
      )
      // 成功メッセージ
      Alert.alert(
        '参加完了！',
        `${nickname.trim()}さん、ようこそ！`,
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );

    } catch (error: any) {
      console.error('ニックネーム設定エラー:', error);
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
        <Text style={styles.title}>ニックネームを設定</Text>

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
            <Text style={styles.buttonText}>設定完了</Text>
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