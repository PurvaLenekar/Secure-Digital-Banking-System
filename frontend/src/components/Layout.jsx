import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [userData, setUserData] = useState({ 
    name: 'Account Holder', 
    tier: 'Premium Member', 
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80' 
  });

  useEffect(() => {
    // Dynamically query user credentials out of storage setups
    const storedUser = localStorage.getItem('finova_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUserData(prev => ({ 
        ...prev, 
        name: parsed.fullName || parsed.name || 'Account Holder' 
      }));
    }
  }, []);

  return (
    /* MASTER SHELL VIEWPORT BOUNDARY CONTEXT */
    <div className="h-screen w-screen bg-[#F8F7F4] flex overflow-hidden antialiased">
      
      {/* 1. LEFT SIDEBAR PANEL LAYER */}
      <div className="w-64 h-full flex-shrink-0 relative z-40">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* 2. MAIN WORKING APP CANVAS DESK */}
      <div className="flex-1 h-full flex flex-col overflow-hidden min-w-0 relative">
        
        {/* FIXED HEADER ANCHOR ENGINE:
          We force an explicit h-16 (64px) height block along with flex-shrink-0.
          This prevents Tailwind from collapsing the header out of view!
        */}
        <header className="h-16 w-full bg-white border-b border-[#E5E7EB] flex-shrink-0 z-30 flex items-center">
          <div className="w-full">
            <Header currentLang="EN" setCurrentLang={() => {}} user={userData} />
          </div>
        </header>
        
        {/* 3. INDEPENDENT WEB CONTENT OVERFLOW ROW */}
        <main className="flex-1 overflow-y-auto bg-[#F8F7F4] w-full">
          {children}
        </main>

      </div>
    </div>
  );
}