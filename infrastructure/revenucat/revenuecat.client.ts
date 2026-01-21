import Purchases from 'react-native-purchases'
import Constants from 'expo-constants'

export const initRevenueCat = () => {
  console.log('RevenuCat初期化')
  Purchases.configure({
    apiKey: Constants.expoConfig?.extra?.revenuCat?.iosKey,
  })
}
