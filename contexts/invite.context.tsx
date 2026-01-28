import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Invite } from '@/domain/entities/invite';

type InviteContextType = {
  invite: Invite | null;
  setInviteData: (invite: Invite) => void;
  clearInviteData: () => void;
};

export const InviteContext = createContext<InviteContextType | undefined>(undefined);

export function InviteProvider({ children }: { children: ReactNode }) {
  const [invite, setInvite] = useState<Invite | null>(null);

  const setInviteData = (invite: Invite) => {
    setInvite(invite);
  };

  const clearInviteData = () => {
    setInvite(null);
  };

  return (
    <InviteContext.Provider 
      value={{ 
        invite,
        setInviteData,
        clearInviteData 
      }}
    >
      {children}
    </InviteContext.Provider>
  );
}
