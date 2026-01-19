import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './auth.context';
import { User } from '@/domain/entities/user'
import { userRepository } from '@/infrastructure/firebase/repositories/user.repository';

type UserContextValue = {
  user: User | null;
  loading: boolean;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { authUser: authUser } = useAuth();
  const [user, setAppUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authUser) {
      setAppUser(null);
      setLoading(false);
      return;
    }

    const load = async () => {
      const user = await userRepository.findById(authUser.uid)
      setAppUser(user);
      setLoading(false);
    };

    load();
  }, [authUser]);

  return (
    <UserContext.Provider value={{ user: user, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside UserProvider');
  return ctx;
}
