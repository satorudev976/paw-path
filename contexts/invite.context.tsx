import React, { createContext, useContext, useState, ReactNode } from 'react';

type InviteContextType = {
  inviteToken: string | null;
  setInviteData: (token: string) => void;
  clearInviteData: () => void;
};

export const InviteContext = createContext<InviteContextType | undefined>(undefined);

export function InviteProvider({ children }: { children: ReactNode }) {
  const [inviteToken, setInviteToken] = useState<string | null>(null);

  const setInviteData = (token: string) => {
    setInviteToken(token);
  };

  const clearInviteData = () => {
    setInviteToken(null);
  };

  return (
    <InviteContext.Provider 
      value={{ 
        inviteToken,
        setInviteData,
        clearInviteData 
      }}
    >
      {children}
    </InviteContext.Provider>
  );
}
