import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { DollarSign, UserRound, Settings, Bell, LogOut, Image, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuLabel } from './ui/dropdown-menu';

interface HeaderProps {
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ mobileMenuOpen, toggleMobileMenu }) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  console.log('Header user:', user);
  return (
    <header className="bg-gray-900 bg-opacity-95 backdrop-blur-sm shadow-sm sticky top-0 z-10 transition-all duration-300 text-white">
      <div className="px-4 py-3 max-w-md mx-auto">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img 
              src="https://centermoneyguard.com/upload/logo.png" 
              alt="App Profit Logo" 
              className="h-16" 
            />
          </Link>
          
          <div className="flex items-center space-x-3">
            <div className="language-selector text-xs flex items-center gap-2">
              <div 
                className={`px-1 py-0.5 cursor-pointer rounded flex items-center gap-1 ${language === 'en' ? 'bg-temu-orange text-white' : 'text-gray-300 hover:bg-gray-800'}`}
                onClick={() => setLanguage('en')}
              >
                <span className="font-bold">🇺🇸</span>
              </div>
              <div 
                className={`px-1 py-0.5 cursor-pointer rounded flex items-center gap-1 ${language === 'es' ? 'bg-temu-orange text-white' : 'text-gray-300 hover:bg-gray-800'}`}
                onClick={() => setLanguage('es')}
              >
                <span className="font-bold">🇪🇸</span>
              </div>
            </div>
            
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-2">
                {/* Desktop balance display */}
                <div className="hidden md:flex items-center bg-gray-800 px-2 py-1 rounded-full">
                  <DollarSign className="h-3 w-3 text-temu-orange" />
                  <span className="text-xs font-medium text-white">${user.balance.toFixed(2)}</span>
                </div>
                
                {/* Avatar and enhanced dropdown menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-7 w-7 cursor-pointer hover:scale-105 transition-transform">
                      <AvatarImage src={user.avatarUrl || user.avatar} alt="User avatar" />
                      <AvatarFallback className="bg-temu-orange text-white">{(user.fullName || user.name || '').charAt(0)}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 z-50 bg-gray-900 text-white">
                    {/* User info section */}
                    <div className="flex items-center px-3 py-2 border-b border-gray-700">
                      <Avatar className="h-10 w-10 mr-2">
                        <AvatarImage src={user.avatarUrl || user.avatar} alt="User avatar" />
                        <AvatarFallback className="bg-temu-orange text-white">{(user.fullName || user.name || '').charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">{user.fullName || user.name}</span>
                        <span className="text-xs text-gray-400">{user.email}</span>
                      </div>
                    </div>
                    
                    {/* Mobile balance display */}
                    <div className="flex items-center md:hidden px-3 py-2 text-xs text-gray-200">
                      <DollarSign className="h-3 w-3 text-temu-orange mr-1" />
                      <span className="font-medium">${user.balance.toFixed(2)}</span>
                    </div>
                    
                    <DropdownMenuSeparator className="bg-gray-700" />
                    
                    {/* Profile management section */}
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="text-xs text-gray-400 px-3">{t('profileManagement')}</DropdownMenuLabel>
                      <DropdownMenuItem asChild className="text-xs flex items-center gap-2 cursor-pointer hover:bg-gray-800">
                        <Link to="/profile/edit">
                          <Edit className="h-3 w-3 text-gray-300" />
                          <span>{t('editProfile')}</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="text-xs flex items-center gap-2 cursor-pointer hover:bg-gray-800">
                        <Link to="/profile/photo">
                          <Image className="h-3 w-3 text-gray-300" />
                          <span>{t('profilePhoto')}</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    
                    <DropdownMenuSeparator className="bg-gray-700" />
                    
                    {/* Settings section */}
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="text-xs text-gray-400 px-3">{t('settings')}</DropdownMenuLabel>
                      <DropdownMenuItem asChild className="text-xs flex items-center gap-2 cursor-pointer hover:bg-gray-800">
                        <Link to="/settings">
                          <Settings className="h-3 w-3 text-gray-300" />
                          <span>{t('accountSettings')}</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="text-xs flex items-center gap-2 cursor-pointer hover:bg-gray-800">
                        <Link to="/notifications">
                          <Bell className="h-3 w-3 text-gray-300" />
                          <span>{t('notifications')}</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    
                    <DropdownMenuSeparator className="bg-gray-700" />
                    
                    {/* Logout option */}
                    <DropdownMenuItem onClick={logout} className="text-xs flex items-center gap-2 cursor-pointer text-red-500 hover:bg-gray-800 hover:text-red-600">
                      <LogOut className="h-3 w-3" />
                      <span>{t('logout')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
