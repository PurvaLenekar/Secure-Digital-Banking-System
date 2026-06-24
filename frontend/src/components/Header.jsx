

import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // 1. Import hook

export default function Header({ currentLang, setCurrentLang }) {
  const { t, i18n } = useTranslation(); // 2. Initialize hook

  // GET USER FROM LOCAL STORAGE
  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user?.name || "User";
  const userEmail = user?.email || "user@gmail.com";
  const profileImage = user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0F766E&color=fff`;

  // 3. Language Change Handler
  const handleLangChange = (lang) => {
    const code = lang.toLowerCase(); // Converts 'EN' to 'en'
    setCurrentLang(lang); // Updates your UI state
    i18n.changeLanguage(code); // Updates i18next
  };

  // Add this inside your Header function
  console.log("Current i18n Language:", i18n.language);

  return (
    <header className="w-full h-20 bg-white border-b border-[#E5E7EB] px-8 flex items-center justify-between sticky top-0 z-10 select-none">
      
      {/* SEARCH BAR */}
      <div className="relative w-full max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
        <input
          type="text"
          placeholder={t('header.search_placeholder')} // 4. Localized placeholder
          className="w-full bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder-[#9CA3AF] focus:outline-none focus:border-[#0F766E] focus:bg-white transition-all"
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center space-x-6">
        
        

        {/* NOTIFICATION */}
        <button className="relative p-2 text-[#6B7280] hover:text-[#111111] hover:bg-gray-50 rounded-xl transition-all">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {/* USER PROFILE */}
        <div className="flex items-center space-x-3 pl-2 border-l border-[#E5E7EB] cursor-pointer group">
          <img src={profileImage} alt={t('header.profile_alt')} className="w-9 h-9 rounded-xl object-cover ring-1 ring-gray-200" />
          <div className="text-left hidden md:block">
            <div className="text-xs font-bold text-[#111111] group-hover:text-[#0F766E] transition-colors">
              {userName}
            </div>
            <div className="text-[10px] text-[#9CA3AF] font-medium tracking-wide">
              {userEmail}
            </div>
          </div>
          <ChevronDown size={14} className="text-[#9CA3AF]" />
        </div>
      </div>
    </header>
  );
}