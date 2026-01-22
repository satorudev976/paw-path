import { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { useRouter } from 'expo-router'

import { useAuth } from '@/hooks/use-auth'
import { useUser } from '@/hooks/use-user'
import { useSubscription } from '@/hooks/use-subscription'
import { useAppAccess } from '@/hooks/use-app-access'

export default function Index() {
  const router = useRouter()

  const { authUser, isLoading: authLoading } = useAuth()
  const { user, isLoading: userLoading } = useUser()
  const { isLoading: subscriptionLoading } = useSubscription()
  const { isLoading: appAccessLoading } = useAppAccess()

  useEffect(() => {
    // 判定中
    if (authLoading || userLoading || subscriptionLoading || appAccessLoading) return

    // 未ログイン（新規ユーザー、ログアウト後のユーザー）
    if (!authUser) {
      router.replace('/login')
      return
    }

    // 新規ユーザー認証後
    if (!user) {
      router.replace('/(onboarding)/nickname')
      return
    }

    router.replace('/(tabs)')
  }, [
    authUser,
    user,
    authLoading,
    userLoading,
    subscriptionLoading,
    appAccessLoading,
  ])

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ActivityIndicator size="large" />
    </View>
  )
}
