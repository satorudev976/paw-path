// contexts/SubscriptionContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import Purchases from 'react-native-purchases';
import { useUser } from './user.context';

type SubscriptionContextValue = {
  active: boolean;
  loading: boolean;
};

const SubscriptionContext =
  createContext<SubscriptionContextValue | undefined>(undefined);

export function SubscriptionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user: user } = useUser();
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'owner') {
      setActive(false);
      setLoading(false);
      return;
    }

    const load = async () => {
      const info = await Purchases.getCustomerInfo();
      setActive(Object.keys(info.entitlements.active).length > 0);
      setLoading(false);
    };

    load();
  }, [user]);

  return (
    <SubscriptionContext.Provider value={{ active, loading }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx)
    throw new Error(
      'useSubscription must be used inside SubscriptionProvider',
    );
  return ctx;
}
