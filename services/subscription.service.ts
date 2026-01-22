import Purchases from 'react-native-purchases'
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
}
