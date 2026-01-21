// app/index.tsx
import { useAuth } from '@/hooks/use-auth';
import { useUser } from '@/hooks/use-user';
import { Redirect } from 'expo-router';

export default function Index() {
  const { firebaseUser, isLoading: authLoading } = useAuth();
  const { user, isLoading: userLoading } = useUser();

  if (authLoading) {
    return null; // or Splash
  }

  if (!firebaseUser) {
    return <Redirect href="/(auth)/login" />;
  }

  if (userLoading) {
    return null;
  }

  if (!user?.nickname) {
    return <Redirect href="/(onboarding)/nickname" />;
  }

  return <Redirect href="/(tabs)" />;
}
