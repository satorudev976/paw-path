import Purchases from 'react-native-purchases'
import Constants from 'expo-constants'

export const initRevenueCat = (userId: string) => {
  Purchases.configure({
    apiKey: Constants.expoConfig?.extra?.revenuCat?.iosKey,
    appUserID: userId,
  })
}
