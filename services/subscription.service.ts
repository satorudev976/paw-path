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

  async purchasePackage(packageToPurchase: PurchasesPackage): Promise<boolean> {
    const { customerInfo } =
    await Purchases.purchasePackage(packageToPurchase)

    return Boolean(
      customerInfo.entitlements.active[
        Constants.expoConfig?.extra?.revenuCat?.entitlement
      ]
    )
  },

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
