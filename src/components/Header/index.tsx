
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import UserProfileDropdown from './UserProfileDropdown';
import LanguageSelector from './LanguageSelector';
import BalanceIndicator from './BalanceIndicator';

interface HeaderProps {
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ mobileMenuOpen, toggleMobileMenu }) => {
  const { user } = useAuth();
  
  return (
    <header className="bg-white bg-opacity-95 backdrop-blur-sm shadow-sm sticky top-0 z-10 transition-all duration-300">
      <div className="px-4 py-3 max-w-md mx-auto">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img 
              src="https://centermoneyguard.com/upload/logo.png" 
              alt="App Profit Logo" 
              className="h-16" 
            />
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-center">
              <LanguageSelector />
            </div>
            <div className="flex items-center space-x-2">
              <BalanceIndicator balance={user.balance} />
              <UserProfileDropdown />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
