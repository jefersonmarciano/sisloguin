
import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useUserProfileViewer } from '@/hooks/useUserProfileViewer';
import UserProfileModal from '@/components/shared/UserProfileModal';
import { generateTopUsers } from './utils/mockDataGenerator';
import UsersList from './components/UsersList';
import { TopUser } from '../../types/top100';

const Top100: React.FC = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [visibleUsers, setVisibleUsers] = useState<TopUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const { selectedUser, openUserDetails, closeUserDetails } = useUserProfileViewer();

  useEffect(() => {
    // Simulate loading data from API with a cleaner approach
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Add a small delay for UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const users = generateTopUsers();
        setTopUsers(users);
        setVisibleUsers(users.slice(0, 10)); // Initial 10 users
      } catch (error) {
        console.error('Error loading top users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    
    // Cleanup function
    return () => {
      setTopUsers([]);
      setVisibleUsers([]);
    };
  }, []);

  const loadMoreUsers = useCallback(() => {
    if (showAll) return;
    
    // Load all users
    setVisibleUsers(topUsers);
    setShowAll(true);
    
    toast({
      title: t('allUsersLoaded'),
      description: t('top100UsersDisplayed')
    });
  }, [showAll, topUsers, toast, t]);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <BarChart className="h-5 w-5 text-temu-orange mr-2" />
          <h1 className="text-xl font-bold">{t('top100')}</h1>
        </div>
        <div className="text-xs text-gray-500">
          {new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES')}
        </div>
      </div>

      <Card className="mb-4 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h2 className="font-semibold text-base">{t('earnings')} {t('top100')}</h2>
          <div className="text-temu-orange flex items-center text-xs cursor-pointer">
            {t('seeDetails')}
            <ChevronRight className="h-3 w-3 ml-1" />
          </div>
        </div>

        <UsersList
          isLoading={isLoading}
          visibleUsers={visibleUsers}
          showAll={showAll}
          loadMoreUsers={loadMoreUsers}
          openUserDetails={openUserDetails}
        />
      </Card>
      
      {selectedUser && (
        <UserProfileModal 
          user={selectedUser}
          open={!!selectedUser}
          onClose={closeUserDetails}
        />
      )}
    </div>
  );
};

export default Top100;
