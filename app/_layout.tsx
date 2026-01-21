import { FamilyProvider } from '@/contexts/family.context'
import { AuthProvider } from '@/contexts/auth.context';
import { SubscriptionProvider } from '@/contexts/subscription.context';
import { UserProvider } from '@/contexts/user.context';
import { AppAccessProvider } from '@/contexts/app-access.context';
import { WalkRecordingProvider } from '@/contexts/walk-recording.context';
import { Slot } from 'expo-router';
import { useEffect } from 'react'
import { initRevenueCat } from '@/infrastructure/revenucat/revenuecat.client'

export default function RootLayout() {
  useEffect(() => {
    initRevenueCat()
  }, [])

  return (
    <AuthProvider>
      <UserProvider>
        <FamilyProvider>
          <SubscriptionProvider>
            <AppAccessProvider>
              <WalkRecordingProvider>
                <Slot />
              </WalkRecordingProvider>
            </AppAccessProvider>
          </SubscriptionProvider>
        </FamilyProvider>
      </UserProvider>
    </AuthProvider>
  );
}
