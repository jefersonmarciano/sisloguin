import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';
import Footer from './Footer';

const Layout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Header mobileMenuOpen={mobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />
      
      <main className="flex-grow px-4 py-4 pb-20 animate-fade-in max-w-md mx-auto w-full">
        <Outlet />
      </main>
      
      <Footer />
      <BottomNav />
    </div>
  );
};

export default Layout;
