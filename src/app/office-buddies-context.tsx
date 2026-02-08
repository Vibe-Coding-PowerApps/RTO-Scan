
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Types
type Coworker = { id: string; name: string };
type Schedule = { date: string; floor: string; desk: string };
type Invite = { id: string; from: string; to: string; status: 'pending' | 'accepted' | 'declined' };

interface OfficeBuddiesContextType {
  coworkers: Coworker[];
  invites: Invite[];
  buddies: Coworker[];
  schedules: Record<string, Schedule[]>;
  sendInvite: (to: string) => void;
  acceptInvite: (inviteId: string) => void;
  declineInvite: (inviteId: string) => void;
}

// Mock coworker list
const mockCoworkers: Coworker[] = [
  { id: '1', name: 'Alice Smith' },
  { id: '2', name: 'Bob Johnson' },
  { id: '3', name: 'Charlie Lee' },
];

// Mock schedules
const mockSchedules: Record<string, Schedule[]> = {
  '1': [
    { date: '2026-02-10', floor: '3', desk: 'A12' },
    { date: '2026-02-11', floor: '2', desk: 'B5' },
  ],
  '2': [
    { date: '2026-02-10', floor: '3', desk: 'A13' },
  ],
  '3': [
    { date: '2026-02-11', floor: '2', desk: 'B6' },
  ],
};

const OfficeBuddiesContext = createContext<OfficeBuddiesContextType | undefined>(undefined);

export const useOfficeBuddies = () => {
  const ctx = useContext(OfficeBuddiesContext);
  if (!ctx) throw new Error('useOfficeBuddies must be used within OfficeBuddiesProvider');
  return ctx;
};

export const OfficeBuddiesProvider = ({ children }: { children: ReactNode }) => {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [buddies, setBuddies] = useState<Coworker[]>([]);
  const [schedules] = useState<Record<string, Schedule[]>>(mockSchedules);

  // Send invite
  const sendInvite = (to: string) => {
    setInvites((prev) => [
      ...prev,
      { id: Date.now().toString(), from: 'me', to, status: 'pending' },
    ]);
  };

  // Accept invite
  const acceptInvite = (inviteId: string) => {
    setInvites((prev) =>
      prev.map((inv) =>
        inv.id === inviteId ? { ...inv, status: 'accepted' } : inv
      )
    );
    const invite = invites.find((inv) => inv.id === inviteId);
    if (invite) {
      const buddyId = invite.from === 'me' ? invite.to : invite.from;
      const buddy = mockCoworkers.find((c) => c.id === buddyId);
      if (buddy && !buddies.some((b) => b.id === buddy.id)) {
        setBuddies((prev) => [...prev, buddy]);
      }
    }
  };

  // Decline invite
  const declineInvite = (inviteId: string) => {
    setInvites((prev) =>
      prev.map((inv) =>
        inv.id === inviteId ? { ...inv, status: 'declined' } : inv
      )
    );
  };

  return (
    <OfficeBuddiesContext.Provider
      value={{
        coworkers: mockCoworkers,
        invites,
        buddies,
        schedules,
        sendInvite,
        acceptInvite,
        declineInvite,
      }}
    >
      {children}
    </OfficeBuddiesContext.Provider>
  );
};
