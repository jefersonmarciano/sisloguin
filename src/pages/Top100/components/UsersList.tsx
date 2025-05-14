
import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import UserListItem from './UserListItem';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { TopUser } from '../../../types/top100';

interface UsersListProps {
  isLoading: boolean;
  visibleUsers: TopUser[];
  showAll: boolean;
  loadMoreUsers: () => void;
  openUserDetails: (user: TopUser) => void;
}

const UsersList = ({ 
  isLoading, 
  visibleUsers, 
  showAll, 
  loadMoreUsers, 
  openUserDetails 
}: UsersListProps) => {
  const { t } = useLanguage();
  
  if (isLoading) {
    return (
      <div className="p-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="py-2 flex items-center animate-pulse">
            <div className="w-8 flex justify-center">
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
            <div className="flex flex-1 items-center">
              <Skeleton className="h-8 w-8 rounded-full mr-2" />
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div>
      <div className="divide-y divide-gray-100">
        {visibleUsers.map((user, index) => (
          <UserListItem 
            key={user.id}
            rank={index + 1}
            user={user}
            onClick={() => openUserDetails(user)}
          />
        ))}
      </div>
      
      {!showAll && visibleUsers.length > 0 && (
        <div className="flex justify-center p-4 border-t border-gray-100">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadMoreUsers}
            className="text-temu-orange border-temu-orange hover:bg-orange-50"
          >
            {t('viewAll')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default UsersList;
