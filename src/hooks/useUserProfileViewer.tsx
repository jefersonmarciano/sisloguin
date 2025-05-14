
import { useState, useCallback } from 'react';
import { TopUser } from '@/types/top100';
import { UserProfileInfo } from '@/pages/CommunityChat/types';

interface UseUserProfileViewerReturn {
  selectedUser: TopUser | null;
  openUserDetails: (user: TopUser | UserProfileInfo) => void;
  closeUserDetails: () => void;
}

export const useUserProfileViewer = (): UseUserProfileViewerReturn => {
  const [selectedUser, setSelectedUser] = useState<TopUser | null>(null);

  const openUserDetails = useCallback((user: TopUser | UserProfileInfo) => {
    // Convert UserProfileInfo to TopUser if needed
    const topUser: TopUser = {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      earnings: user.earnings,
      rank: 0, // Not relevant when opened from chat
      country: user.country,
      location: user.location || 'Unknown', // Add default if location is missing
      registrationDate: user.registrationDate,
      level: user.level,
      withdrawals: user.withdrawals.map(w => ({
        id: w.id,
        userId: w.userId,
        amount: w.amount,
        status: w.status,
        createdAt: w.createdAt
      }))
    };
    
    setSelectedUser(topUser);
  }, []);

  const closeUserDetails = useCallback(() => {
    setSelectedUser(null);
  }, []);

  return {
    selectedUser,
    openUserDetails,
    closeUserDetails
  };
};
