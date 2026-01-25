import React, { createContext, useContext, useState, ReactNode } from 'react';

type InviteContextType = {
  inviteToken: string | null;
  inviteFamilyId: string | null;
  setInviteData: (token: string, familyId: string) => void;
  clearInviteData: () => void;
};

export const InviteContext = createContext<InviteContextType | undefined>(undefined);

export function InviteProvider({ children }: { children: ReactNode }) {
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [inviteFamilyId, setInviteFamilyId] = useState<string | null>(null);

  const setInviteData = (token: string, familyId: string) => {
    setInviteToken(token);
    setInviteFamilyId(familyId);
  };

  const clearInviteData = () => {
    setInviteToken(null);
    setInviteFamilyId(null);
  };

  return (
    <InviteContext.Provider 
      value={{ 
        inviteToken,
        inviteFamilyId,
        setInviteData,
        clearInviteData 
      }}
    >
      {children}
    </InviteContext.Provider>
  );
}
