import Purchases, { PurchasesPackage, PurchasesOfferings } from 'react-native-purchases'
import Constants from 'expo-constants'

export const SubscriptionService = {
  async purchasesLogIn(userId: string) {
    await Purchases.logIn(userId)
  },

  async purchasesLogOut() {
    const isAnonymous = await Purchases.isAnonymous()
    if (isAnonymous) {
      console.log('RevenueCat: 匿名ユーザーのためログアウト不要')
      return
    }
    await Purchases.logOut()
  },

  async hasPremium(): Promise<boolean> {
    const info = await Purchases.getCustomerInfo()
    return Boolean(
      info.entitlements.active[Constants.expoConfig?.extra?.revenuCat?.entitlement]
    )
  },

  async getActivePackage(): Promise<'monthly' | 'annual' | null> {
    const info = await Purchases.getCustomerInfo()
    const activeEntitlements = info.entitlements.active
    if (Object.keys(activeEntitlements).length === 0) {
      return null
    }

    const entitlement = Object.values(activeEntitlements)[0]
    const productId = entitlement.productIdentifier
    console.log('現在のプラン:', productId)
    if (productId.includes('monthly')) {
      return 'monthly'
    } else if (productId.includes('annual')) {
      return 'annual'
    }
    return null
  },

  async purchasePackage(pkg: PurchasesPackage): Promise<boolean> {
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg)
  
      const entitlementId =
        Constants.expoConfig?.extra?.revenuCat?.entitlement
  
      return Boolean(
        entitlementId &&
          customerInfo.entitlements.active[entitlementId]
      )
    } catch (e: any) {
      // ✅ ユーザーキャンセルは正常終了
      if (e?.userCancelled) {
        return false
      }
  
      throw e
    }
  }
  ,

  async restorePurchases(): Promise<boolean> {
    const customerInfo = await Purchases.restorePurchases()
  
    return Boolean(
      customerInfo.entitlements.active[
        Constants.expoConfig?.extra?.revenuCat?.entitlement
      ]
    )
  },

  async getAvailablePackages(): Promise<PurchasesOfferings | null> {
    try {
      console.log('プラン取得開始');
      
      const offerings: PurchasesOfferings = await Purchases.getOfferings();
      
      if (!offerings.current) {
        console.warn('現在のOfferingが見つかりません');
        return null;
      }
      
      const monthly = offerings.current.monthly;
      const annual = offerings.current.annual;
      
      console.log('プラン取得完了:', {
        monthly: monthly?.product.identifier,
        annual: annual?.product.identifier,
      });
      
      return offerings;
    } catch (error) {
      console.error('プラン取得エラー:', error);
      throw error;
    }
  }  
}
