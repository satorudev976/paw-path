import { FamilyProvider } from '@/contexts/family.context'
import { AuthProvider } from '@/contexts/auth.context';
import { SubscriptionProvider } from '@/contexts/subscription.context';
import { UserProvider } from '@/contexts/user.context';
import { WalkRecordingProvider } from '@/contexts/walk-recording.context';
import { Slot } from 'expo-router';

export default function RootLayout() {
  return (
    <AuthProvider>
      <UserProvider>
        <FamilyProvider>
          <SubscriptionProvider>
            <WalkRecordingProvider>
              <Slot />
            </WalkRecordingProvider>
          </SubscriptionProvider>
        </FamilyProvider>
      </UserProvider>
    </AuthProvider>
  );
}
