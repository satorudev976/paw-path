import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { UserService } from '@/services/user.service';
import { User } from '@/domain/entities/user';
import { useUser } from '@/hooks/use-user';
import { privacyUrl, supportUrl, termsUrl } from '@/constants/site';

export default function FamilySettingsScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [members, setMembers] = useState<Array<User>>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);


  // 🆕 画面にフォーカスが戻るたびにメンバーリストを再読み込み
  useFocusEffect(
    React.useCallback(() => {
      const loadMembers = async () => {
        if (!user?.familyId) {
          setIsLoadingMembers(false);
          return;
        }
  
        console.log('設定画面にフォーカス - メンバー一覧を再読み込み');
        setIsLoadingMembers(true);
        try {
          const users = await UserService.getFamilyUsers(user.familyId);
          setMembers(users);
        } catch (error) {
          console.error('メンバー一覧読み込みエラー:', error);
        } finally {
          setIsLoadingMembers(false);
        }
      };
  
      loadMembers();
    }, [user?.familyId])
  );

  // ユーザー情報編集画面へ遷移
  const handleEditProfile = () => {
    router.push('/user-profile');
  };

  return (
    <ScrollView style={styles.container}>
      {/* ユーザー情報 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ユーザー情報</Text>
        <TouchableOpacity style={styles.infoCard} onPress={handleEditProfile}>
        <Ionicons name="person" size={20} color="#666666" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>ニックネーム</Text>
            <Text style={styles.infoValue}>{user?.nickname}</Text>
            <Text style={styles.editHint}>タップして編集</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#CCCCCC" />
        </TouchableOpacity>
      </View>

      {/* 参加メンバー */}
      <View style={styles.section}>
        <View style={styles.memberHeader}>
          <Text style={styles.sectionTitle}>参加メンバー</Text>
          {isLoadingMembers ? (
            <ActivityIndicator size="small" color="#4A90E2" />
          ) : (
            <Text style={styles.memberCount}>
              {members.length}/5人
            </Text>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.memberList}>
            {members.map((member) => (
              <View key={member.id} style={styles.memberItem}>
                <Ionicons name="person" size={20} color="#666666" />
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.nickname}</Text>
                  {member.role === 'owner' && (
                    <Text style={styles.ownerBadge}>オーナー</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* アプリについて */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>アプリについて</Text>
        <TouchableOpacity 
          style={styles.aboutLink}
          onPress={() => Linking.openURL(privacyUrl)}
        >
          <Ionicons name="shield-checkmark-outline" size={24} color="#666666" />
          <Text style={styles.aboutLinkText}>プライバシーポリシー</Text>
          <Ionicons name="open-outline" size={20} color="#CCCCCC" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.aboutLink}
          onPress={() => Linking.openURL(termsUrl)}
        >
          <Ionicons name="document-text-outline" size={24} color="#666666" />
          <Text style={styles.aboutLinkText}>利用規約</Text>
          <Ionicons name="open-outline" size={20} color="#CCCCCC" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.aboutLink}
          onPress={() => Linking.openURL(supportUrl)}
        >
          <Ionicons name="help-circle-outline" size={24} color="#666666" />
          <Text style={styles.aboutLinkText}>サポート・ヘルプ</Text>
          <Ionicons name="open-outline" size={20} color="#CCCCCC" />
        </TouchableOpacity>
      </View>


      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  memberCount: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
  },
  memberList: {
    gap: 8,
  },
  memberItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  memberInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  memberName: {
    fontSize: 16,
    color: '#333333',
  },
  ownerBadge: {
    fontSize: 10,
    color: '#FFFFFF',
    backgroundColor: '#4A90E2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoContent: {
    flex: 1,
    marginLeft: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '600',
  },
  editHint: {
    fontSize: 12,
    color: '#4A90E2',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  aboutLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  aboutLinkText: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    marginLeft: 12,
  },
});