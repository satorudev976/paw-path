// app/(onboarding)/nickname.tsx
import { useRouter } from 'expo-router';
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
import { setUpOwnerService } from '@/services/setup-owner.service';
import { useAuth } from '@/hooks/use-auth';
import { useInvite } from '@/hooks/use-invite';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/infrastructure/firebase/firebase';
import { InviteService } from '@/services/invite.service';

export default function NicknameScreen() {
  const router = useRouter();
  const { authUser } = useAuth();
  const { inviteToken, inviteFamilyId, clearInviteData } = useInvite();
  
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const isInvite = !!inviteToken && !!inviteFamilyId;

  const handleSetUp = async () => {
    // バリデーション
    if (!nickname.trim()) {
      Alert.alert('エラー', 'ニックネームを入力してください');
      return;
    }

    if (nickname.trim().length > 20) {
      Alert.alert('エラー', 'ニックネームは20文字以内で入力してください');
      return;
    }

    if (!authUser) {
      Alert.alert('エラー', '認証情報が見つかりません');
      return;
    }

    setIsLoading(true);
    
    try {
      if (isInvite) {
        await handleInviteJoin();
      } else {
        await handleOwnerSetup();
      }
    } catch (error: any) {
      console.error('セットアップエラー:', error);
      Alert.alert('エラー', 'セットアップに失敗しました');
      
      if (isInvite) {
        clearInviteData();
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 通常の新規登録フロー
   */
  const handleOwnerSetup = async () => {
    await setUpOwnerService.setUp(authUser!.uid, nickname.trim());
    
    Alert.alert(
      '登録完了！',
      `${nickname.trim()}さん、ようこそ！`,
      [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
    );
  };

  /**
   * 招待リンク経由のフロー
   * 
   * 1. Firestoreにユーザーを作成（familyId, role: 'family'）
   * 2. 招待を無効化
   * 3. 招待データをクリア
   */
  const handleInviteJoin = async () => {
    if (!inviteToken || !inviteFamilyId) {
      throw new Error('招待情報が不足しています');
    }

    // 1. ユーザーをFirestoreに作成
    const userRef = doc(db, 'users', authUser!.uid);
    await setDoc(userRef, {
      familyId: inviteFamilyId,
      role: 'family',
      nickname: nickname.trim(),
      createdAt: Timestamp.now(),
    }, { merge: true });

    // 2. 招待を無効化
    await InviteService.deactivateInvite(inviteToken);

    // 3. 招待データをクリア
    clearInviteData();
    
    Alert.alert(
      '家族に参加しました！',
      `${nickname.trim()}さん、ようこそ！`,
      [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.emoji}>{isInvite ? '👨‍👩‍👧‍👦' : '🐾'}</Text>
        <Text style={styles.title}>
          {isInvite ? '家族に参加' : 'ニックネームを設定'}
        </Text>
        {isInvite && (
          <Text style={styles.subtitle}>
            家族から招待されました！{'\n'}
            ニックネームを入力して参加しましょう
          </Text>
        )}

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
              {isInvite ? '参加する' : '設定完了'}
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