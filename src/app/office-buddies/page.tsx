'use client';
import React from 'react';
import { OfficeBuddiesProvider } from '../office-buddies-context';
import BuddyInviteDialog from '../../components/buddy-invite-dialog';
import BuddyInvitesList from '../../components/buddy-invites-list';
import BuddyList from '../../components/buddy-list';
import BuddySchedule from '../../components/buddy-schedule';

const OfficeBuddiesPage = () => (
  <OfficeBuddiesProvider>
    <div className="flex flex-col md:flex-row gap-6 p-6">
      <div className="flex flex-col gap-4">
        <BuddyInviteDialog />
        <BuddyInvitesList />
      </div>
      <div className="flex flex-col gap-4">
        <BuddyList />
        <BuddySchedule />
      </div>
    </div>
  </OfficeBuddiesProvider>
);

export default OfficeBuddiesPage;
