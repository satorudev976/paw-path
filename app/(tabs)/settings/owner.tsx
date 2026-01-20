import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
// import { createInviteLink } from '../../src/services/inviteService';
import { useSubscription } from '@/hooks/use-subscription';
import { useUser } from '@/hooks/use-user';
import { UserService } from '@/services/user.service';
import { User } from '@/domain/entities/user';

const WEB_BASE_URL = 'https://paw-path-63154.web.app';

export default function OwnwerSettingsScreen() {
  const router = useRouter();
  const { user } = useUser();
  const subscription = useSubscription()
  
  const [members, setMembers] = useState<Array<User>>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

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

  const getSubscriptionDisplayName = (): string => {
    if (subscription.isTrialActive) return 'トライアル中';
    if (subscription.isActive) return 'プレミアムプラン';
    return '閲覧専用モード';
  }


  const handleShareCode = async () => {

    // // 🆕 メンバー上限チェック
    // if (members.length >= 5) {
    //   Alert.alert(
    //     '上限に達しています',
    //     `家族メンバーは最大5人までです。\n新しいメンバーを招待するには、既存のメンバーを削除してください。`
    //   );
    //   return;
    // }

    // try {
    //   console.log('🔗 招待トークン生成開始');
      
    //   // ✅ トークン生成
    //   const token = await createInviteLink(
    //     {
    //       familyCode,
    //       maxUses: 10,
    //       expiresInHours: 24,
    //     },
    //     userId
    //   );
      
    //   console.log('✅ トークン生成完了:', token);
      
    //   // ✅ トークン付きURL
    //   const inviteUrl = `${WEB_BASE_URL}/join.html?token=${token}`;
      
    //   const shareMessage = `「ぱうぱす」への招待です。家族みんなで、愛犬の足跡を残そう！\n\n下のリンクをタップするだけで簡単に参加できます：\n${inviteUrl}\n\n※このリンクは24時間有効です`;
      
    //   await Share.share({
    //     message: shareMessage,
    //     title: 'PawPathに招待',
    //   });
      
    //   console.log('✅ 招待リンク共有完了');
    // } catch (error) {
    //   console.error('❌ 招待リンク生成エラー:', error);
    //   Alert.alert('エラー', '招待リンクの生成に失敗しました');
    // }
  };

  // ユーザー情報編集画面へ遷移
  const handleEditProfile = () => {
    router.push('/user-profile');
  };

  // 🆕 サブスクリプション管理画面を開く
  const handleOpenSubscriptionManagement = async () => {
    try {
      const url = Platform.OS === 'ios'
        ? 'https://apps.apple.com/account/subscriptions'
        : 'https://play.google.com/store/account/subscriptions';
      
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          '開けません',
          'サブスクリプション管理画面を開けませんでした。\n\n' +
          Platform.select({
            ios: 'iOSの「設定」アプリ → Apple ID → サブスクリプション から管理できます。',
            android: 'Google Playストア → メニュー → 定期購入 から管理できます。',
          })
        );
      }
    } catch (error) {
      console.error('サブスク管理画面を開くエラー:', error);
      Alert.alert('エラー', 'サブスクリプション管理画面を開けませんでした');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* 🆕 サブスクリプション情報 */}
      <View style={styles.section}>
          <TouchableOpacity 
            style={styles.subscriptionCard}
            onPress={() => router.push('/subscription' as any)}
          >
            {subscription.isLoading ? (
              <ActivityIndicator size="small" color="#4A90E2" />
            ) : subscription ? (
              <>
                <View style={styles.subscriptionHeader}>
                  <View style={styles.subscriptionStatus}>
                    <Ionicons 
                      name={
                        subscription.isActive ? 'checkmark-circle' : 
                        subscription.isTrialActive ? 'time' : 
                        'eye-outline'
                      } 
                      size={24} 
                      color={
                        subscription.isActive ? '#50C878' : 
                        subscription.isTrialActive ? '#FF9500' : 
                        '#999999'
                      } 
                    />
                    <Text style={styles.subscriptionPlan}>
                      {getSubscriptionDisplayName()}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
                </View>

                {/* トライアル表示 */}
                {subscription.isTrialActive && (
                  <View style={styles.trialBadge}>
                    <Ionicons name="time-outline" size={16} color="#FF9500" />
                    <Text style={styles.trialText}>
                      お試し期間は７日間です。
                    </Text>
                  </View>
                )}

                {/* 閲覧専用モード警告 */}
                {!subscription.isActive && (
                  <View style={styles.readOnlyWarning}>
                    <Ionicons name="alert-circle-outline" size={16} color="#FF3B30" />
                    <Text style={styles.readOnlyText}>
                      サブスクリプションを再開してください
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <Text style={styles.subscriptionDescription}>
                サブスクリプション情報を読み込めませんでした
              </Text>
            )}
          </TouchableOpacity>
        </View>

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
              {members.map((member, index) => (
                <View style={styles.memberItem}>
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

      {/* 招待ボタン - オーナーのみ表示 */}
      <View style={styles.section}>
          <View style={styles.card}>
              <Text style={styles.sectionTitle}>家族を招待</Text>
              <View style={styles.buttonColumn}>
                <Text style={styles.inviteDescription}>
                  家族をアプリに招待して、散歩記録を共有しましょう
                </Text>

                {/* 共有ボタン */}
                <TouchableOpacity
                  style={[
                    styles.fullButton, 
                    styles.shareButton,
                    members.length >= 5 && styles.shareButtonDisabled
                  ]}
                  onPress={members.length <= 5 ? undefined : handleShareCode}
                  disabled={members.length >= 5}
                >
                  <Ionicons 
                    name="share-outline" 
                    size={20} 
                    color={members.length >= 5 ? "#999999" : "#FFFFFF"} 
                  />
                  <Text style={[
                    styles.fullButtonText, 
                    { color: members.length >= 5 ? "#999999" : "#FFFFFF" }
                  ]}>
                    {members.length >= 5 ? '上限に達しました' : '家族を招待'}
                  </Text>
                </TouchableOpacity>

                {/* 🆕 上限到達メッセージ */}
                {members.length >= 5 && (
                  <View style={styles.limitWarning}>
                    <Ionicons name="alert-circle-outline" size={16} color="#FF6B6B" />
                    <Text style={styles.limitMessage}>
                      家族メンバーは最大5人までです
                    </Text>
                  </View>
                )}

                {/* ヘルプメッセージ */}
                {members.length <= 5 && (
                  <View style={styles.helpBox}>
                    <Text style={styles.helpText}>
                      「家族を招待」ボタンをタップして、メールやSMSなどで招待リンクを送信してください。家族がリンクをタップするだけで参加できます!
                    </Text>
                  </View>
                )}
              </View>
            </View>
        </View>


      {/* アプリについて */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>アプリについて</Text>
        
        {/* 🆕 サブスクリプション管理（契約中のみ表示） */}
        {subscription?.isActive && (
          <TouchableOpacity 
            style={styles.aboutLink}
            onPress={handleOpenSubscriptionManagement}
          >
            <Ionicons name="card-outline" size={24} color="#666666" />
            <Text style={styles.aboutLinkText}>サブスクリプション管理</Text>
            <Ionicons name="open-outline" size={20} color="#CCCCCC" />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.aboutLink}
          onPress={() => Linking.openURL('https://paw-path-63154.web.app/privacy.html')}
        >
          <Ionicons name="shield-checkmark-outline" size={24} color="#666666" />
          <Text style={styles.aboutLinkText}>プライバシーポリシー</Text>
          <Ionicons name="open-outline" size={20} color="#CCCCCC" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.aboutLink}
          onPress={() => Linking.openURL('https://paw-path-63154.web.app/terms.html')}
        >
          <Ionicons name="document-text-outline" size={24} color="#666666" />
          <Text style={styles.aboutLinkText}>利用規約</Text>
          <Ionicons name="open-outline" size={20} color="#CCCCCC" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.aboutLink}
          onPress={() => Linking.openURL('https://paw-path-63154.web.app/support.html')}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  // 🆕 サブスクリプションカード
  subscriptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subscriptionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subscriptionPlan: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  subscriptionDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  trialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  trialText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#856404',
  },
  readOnlyWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
  },
  readOnlyText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#C62828',
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
  buttonColumn: {
    gap: 12,
  },
  inviteDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
  },
  fullButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#4A90E2',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  shareButton: {
    backgroundColor: '#50C878',
    borderColor: '#50C878',
  },
  shareButtonDisabled: {
    backgroundColor: '#CCCCCC',
    borderColor: '#CCCCCC',
    opacity: 0.6,
  },
  limitWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF5F5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  limitMessage: {
    fontSize: 13,
    color: '#FF6B6B',
    fontWeight: '600',
    flex: 1,
  },
  fullButtonText: {
    color: '#4A90E2',
    fontSize: 15,
    fontWeight: '600',
  },
  helpBox: {
    backgroundColor: '#f0f7ff',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  helpText: {
    fontSize: 13,
    color: '#4A90E2',
    lineHeight: 20,
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