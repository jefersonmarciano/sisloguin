
import React from 'react';
import { Link } from 'react-router-dom';
import { UserRound, Settings, Bell, Image, Edit, DollarSign } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuLabel } from '../ui/dropdown-menu';

const UserProfileDropdown: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-7 w-7 cursor-pointer hover:scale-105 transition-transform">
          <AvatarImage src={user.avatar} alt="User avatar" />
          <AvatarFallback className="bg-sisloguin-orange text-white">{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 z-50 bg-white">
        {/* User info section */}
        <div className="flex items-center gap-2 p-2">
          <Avatar>
            <AvatarImage src={user.avatar} alt="Profile picture" />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{user.name}</span>
            <span className="text-xs text-gray-500">{user.email}</span>
          </div>
        </div>
        <DropdownMenuSeparator />
        
        {/* Menu items */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-gray-500 px-3">
            {t('profileManagement')}
          </DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link to="/profile/edit" className="cursor-pointer">
              <UserRound className="mr-2 h-4 w-4" />
              <span>{t('editProfile')}</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link to="/profile/photo" className="cursor-pointer">
              <Image className="mr-2 h-4 w-4" />
              <span>{t('profilePhoto')}</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel className="text-xs text-gray-500 px-3">
            {t('settings')}
          </DropdownMenuLabel>
          
          <DropdownMenuItem asChild>
            <Link to="/notifications" className="cursor-pointer">
              <Bell className="mr-2 h-4 w-4" />
              <span>{t('notifications')}</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link to="/earnings" className="cursor-pointer">
              <DollarSign className="mr-2 h-4 w-4" />
              <span>{t('earnings')}</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link to="/settings" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>{t('settings')}</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileDropdown;
