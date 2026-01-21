import { useAuth } from './use-auth'
import { useUser } from './use-user'
import { useFamily } from './use-family'
import { useSubscription } from './use-subscription'

export const useAppSession = () => {
  const auth = useAuth()
  const user = useUser()
  const family = useFamily()
  const subscription = useSubscription()

  const isLoading =
    auth.isLoading ||
    user.isLoading ||
    family.isLoading ||
    subscription.isLoading

  const isLoggedIn = Boolean(auth.authUser)
  const isOnboarded = Boolean(user.user?.nickname)

  return {
    isLoading,
    isLoggedIn,
    isOnboarded,

    authUser: auth.authUser,
    user: user.user,
    family: family.family,
    subscription,

    refreshAll: async () => {
      await Promise.all([
        user.refresh(),
        family.refresh(),
        subscription.refresh(),
      ])
    },
  }
}
