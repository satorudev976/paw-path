import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { PurchasesOfferings, PurchasesPackage } from 'react-native-purchases'
import { useSubscription } from '@/hooks/use-subscription'
import { useAppAccess } from '@/hooks/use-app-access'
import { SubscriptionService } from '@/services/subscription.service'

export default function SubscriptionScreen() {
  const router = useRouter()
  const [offering, setOffering] = useState<PurchasesOfferings | null>(null)
  const [isLoadingPlans, setIsLoadingPlans] = useState(true)

  const { hasEntitlement, activeProductType, refresh } = useSubscription()
  const { trialUse, readonly } = useAppAccess()

  // プラン取得
  useEffect(() => {
    const loadPlans = async () => {
      try {
        setIsLoadingPlans(true)
        const offering = await SubscriptionService.getAvailablePackages()
        setOffering(offering)
      } catch (error) {
        console.error('プラン取得エラー:', error)
        Alert.alert('エラー', 'プラン情報の取得に失敗しました')
      } finally {
        setIsLoadingPlans(false)
      }
    }

    loadPlans()
  }, [])

  const monthlyPkg = offering?.current?.monthly
  const annualPkg = offering?.current?.annual

  const priceString = (pkg?: PurchasesPackage, fallback = '') =>
    pkg?.product?.priceString ?? fallback

  // 購入処理
  const handlePurchase = async (plan: PurchasesPackage) => {
    try {
      const success = await SubscriptionService.purchasePackage(plan)

      if (success) {
        Alert.alert('購入完了！', 'サブスクリプションが有効になりました。', [
          {
            text: 'OK',
            onPress: () => {
              refresh()
              router.back()
            },
          },
        ])
      } else {
        Alert.alert('エラー', '購入に失敗しました')
      }
    } catch (error: any) {
      if (error?.message === 'CANCELLED') {
        // ユーザーキャンセル - 何もしない
        return
      }
      console.error('購入エラー:', error)
      Alert.alert('エラー', '購入処理中にエラーが発生しました')
    }
  }

  // 復元処理
  const handleRestore = async () => {
    try {
      const success = await SubscriptionService.restorePurchases()

      if (success) {
        Alert.alert('復元完了！', 'サブスクリプションが復元されました。', [
          {
            text: 'OK',
            onPress: () => {
              refresh()
              router.back()
            },
          },
        ])
      } else {
        Alert.alert('復元失敗', '復元可能なサブスクリプションが見つかりませんでした。')
      }
    } catch (error) {
      console.error('復元エラー:', error)
      Alert.alert('エラー', '復元処理中にエラーが発生しました')
    }
  }

  // サブスク管理画面を開く
  const handleOpenManagement = async () => {
    try {
      const url =
        Platform.OS === 'ios'
          ? 'https://apps.apple.com/account/subscriptions'
          : 'https://play.google.com/store/account/subscriptions'

      const supported = await Linking.canOpenURL(url)

      if (supported) {
        await Linking.openURL(url)
      } else {
        Alert.alert(
          '開けません',
          'サブスクリプション管理画面を開けませんでした。\n\n' +
            Platform.select({
              ios: 'iOSの「設定」アプリ → Apple ID → サブスクリプション から管理できます。',
              android: 'Google Playストア → メニュー → 定期購入 から管理できます。',
            })
        )
      }
    } catch (error) {
      console.error('サブスク管理画面を開くエラー:', error)
      Alert.alert('エラー', 'サブスクリプション管理画面を開けませんでした')
    }
  }

  // ローディング中
  if (isLoadingPlans) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>サブスクリプション</Text>
          <View style={styles.backButton} />
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#50C878" />
          <Text style={styles.loadingText}>読み込み中...</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>サブスクリプション</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* ステータスバナー */}
        {trialUse && (
          <View style={styles.trialBanner}>
            <Ionicons name="gift" size={28} color="#FF9500" />
            <View style={styles.trialInfo}>
              <Text style={styles.trialTitle}>お試し期間中</Text>
              <Text style={styles.trialSubtitle}>お試し期間は７日間です。</Text>
            </View>
          </View>
        )}

        {hasEntitlement && (
          <View style={styles.activeBanner}>
            <Ionicons name="checkmark-circle" size={28} color="#50C878" />
            <View style={styles.activeInfo}>
              <Text style={styles.activeTitle}>契約中</Text>
              <Text style={styles.activeSubtitle}>
                {activeProductType === 'annual'
                  ? '年額プラン'
                  : activeProductType === 'monthly'
                  ? '月額プラン'
                  : 'プラン確認中'}
              </Text>
            </View>
          </View>
        )}

        {readonly && (
          <View style={styles.readOnlyBanner}>
            <Ionicons name="eye-outline" size={28} color="#FF3B30" />
            <View style={styles.readOnlyInfo}>
              <Text style={styles.readOnlyTitle}>閲覧専用モード</Text>
              <Text style={styles.readOnlySubtitle}>
                新しい記録を作成するにはサブスクリプションが必要です
              </Text>
            </View>
          </View>
        )}

        {/* メインメッセージ */}
        <View style={styles.messageSection}>
          <Text style={styles.mainTitle}>家族みんなが使える！</Text>
        </View>

        {/* プランカード */}
        <View style={styles.plansSection}>
          {/* 月額プラン */}
          {monthlyPkg && (
            <TouchableOpacity
              style={styles.planCard}
              onPress={() => handlePurchase(monthlyPkg)}
              disabled={hasEntitlement}
              activeOpacity={0.8}
            >
              <View style={styles.planHeader}>
                <Ionicons name="diamond-outline" size={24} color="#4A90E2" />
                <Text style={styles.planName}>月額プラン</Text>
              </View>

              <Text style={styles.planPrice}>
                {priceString(monthlyPkg, '¥100')} <Text style={styles.planPeriod}>/ 月</Text>
              </Text>

              {!hasEntitlement && (
                <View style={styles.planButton}>
                  <Text style={styles.planButtonText}>選択する</Text>
                </View>
              )}

              {hasEntitlement && activeProductType === 'monthly' && (
                <View style={styles.currentPlanBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="#50C878" />
                  <Text style={styles.currentPlanText}>現在のプラン</Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          {/* 年額プラン */}
          {annualPkg && (
            <TouchableOpacity
              style={[styles.planCard, styles.planCardRecommended]}
              onPress={() => handlePurchase(annualPkg)}
              disabled={hasEntitlement}
              activeOpacity={0.8}
            >

              <View style={styles.planHeader}>
                <Ionicons name="star" size={24} color="#FFD700" />
                <Text style={styles.planName}>年額プラン</Text>
              </View>

              <Text style={styles.planPrice}>
                {priceString(annualPkg, '¥1,000')} <Text style={styles.planPeriod}>/ 年</Text>
              </Text>


              {!hasEntitlement && (
                <View style={[styles.planButton, styles.planButtonRecommended]}>
                  <Text style={styles.planButtonText}>選択する</Text>
                </View>
              )}

              {hasEntitlement && activeProductType === 'annual' && (
                <View style={styles.currentPlanBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="#50C878" />
                  <Text style={styles.currentPlanText}>現在のプラン</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* サブスク管理ボタン */}
        {hasEntitlement && (
          <TouchableOpacity style={styles.managementButton} onPress={handleOpenManagement}>
            <Text style={styles.managementButtonText}>サブスクリプション管理</Text>
            <Ionicons name="chevron-forward" size={20} color="#4A90E2" />
          </TouchableOpacity>
        )}

        {/* 復元ボタン */}
        {!hasEntitlement && (
          <TouchableOpacity style={styles.restoreButton} onPress={handleRestore} disabled={hasEntitlement}>
            <Text style={styles.restoreButtonText}>購入履歴を復元</Text>
          </TouchableOpacity>
        )}

        {/* 注意事項 */}
        <View style={styles.noticeSection}>
          <Text style={styles.noticeText}>
            • サブスクリプションは自動更新されます{'\n'}
            • 解約はいつでも可能です{'\n'}
            • 家族メンバーは追加料金なしで利用できます{'\n'}
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  trialBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#FFF3E0',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  trialInfo: {
    flex: 1,
  },
  trialTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E65100',
    marginBottom: 4,
  },
  trialSubtitle: {
    fontSize: 14,
    color: '#F57C00',
  },
  activeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#E8F5E9',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  activeInfo: {
    flex: 1,
  },
  activeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 4,
  },
  activeSubtitle: {
    fontSize: 14,
    color: '#388E3C',
  },
  readOnlyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#FFEBEE',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  readOnlyInfo: {
    flex: 1,
  },
  readOnlyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#C62828',
    marginBottom: 4,
  },
  readOnlySubtitle: {
    fontSize: 14,
    color: '#D32F2F',
  },
  messageSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  mainSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  plansSection: {
    gap: 16,
    marginBottom: 32,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  planCardRecommended: {
    borderColor: '#FFD700',
    borderWidth: 3,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -12,
    right: 20,
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  recommendedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  planPrice: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  planPeriod: {
    fontSize: 18,
    fontWeight: '400',
    color: '#666666',
  },
  planFeatures: {
    gap: 8,
    marginBottom: 20,
  },
  planFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planFeatureText: {
    fontSize: 14,
    color: '#666666',
  },
  planButton: {
    backgroundColor: '#50C878',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  planButtonRecommended: {
    backgroundColor: '#FFD700',
  },
  planButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  currentPlanBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
  },
  currentPlanText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },
  managementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  managementButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
  },
  restoreButton: {
    alignItems: 'center',
    padding: 16,
    marginBottom: 24,
  },
  restoreButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2',
  },
  noticeSection: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  noticeText: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 20,
  },
})
