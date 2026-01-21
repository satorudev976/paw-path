import Purchases from 'react-native-purchases'
import Constants from 'expo-constants'

export const initRevenueCat = async (userId: string) => {
  await Purchases.configure({
    apiKey: Constants.expoConfig?.extra?.revenueCatApiKey,
    appUserID: userId,
  })
}