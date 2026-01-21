import Purchases from 'react-native-purchases'
import Constants from 'expo-constants'

export const SubscriptionService = {
  async purchasesLogIn(userId: string) {
    await Purchases.logIn(userId)
  },

  async purchasesLogOut() {
    await Purchases.logOut()
  },

  async hasPremium(): Promise<boolean> {
    const info = await Purchases.getCustomerInfo()
    return Boolean(
      info.entitlements.active[Constants.expoConfig?.extra?.revenuCat?.entitlement]
    )
  },
}
