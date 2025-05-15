
import React from 'react';
import { DollarSign, Star, User } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { TopUser } from '../../../types/top100';
import UserRankIcon from './UserRankIcon';

interface UserListItemProps {
  user: TopUser;
  rank: number;
  onClick: (user: TopUser) => void;
}

const UserListItem: React.FC<UserListItemProps> = ({ user, rank, onClick }) => {
  return (
    <div 
      className={`p-3 flex items-center hover:bg-gray-50 transition-colors cursor-pointer opacity-0 animate-fade-in`}
      style={{
        animationDelay: `${rank * 0.05}s`,
        animationFillMode: 'forwards'
      }}
      onClick={() => onClick(user)}
    >
      <div className="w-8 flex justify-center">
        <UserRankIcon rank={rank} />
      </div>
      
      <div className="flex-1 flex items-center">
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        
        <div>
          <div className="font-medium text-sm">{user.name}</div>
          <div className="text-xs text-gray-500">{user.location || user.country}</div>
        </div>
      </div>
      
      <div className="flex items-center font-medium text-sm">
        <DollarSign className="h-3 w-3 text-sisloguin-orange mr-1" />
        {user.earnings.toLocaleString()}
        {rank <= 3 && (
          <Star className="h-3 w-3 text-yellow-500 ml-1" fill="gold" />
        )}
      </div>
    </div>
  );
};

export default UserListItem;
