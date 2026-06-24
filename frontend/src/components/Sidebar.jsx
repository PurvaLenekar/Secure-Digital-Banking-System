import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, Wallet, ArrowLeftRight, FileText, CreditCard, 
  BarChart3, Shield, Settings, LogOut 
} from 'lucide-react';
import FinovaBrand from './FinovaBrand';

export default function Sidebar({ activeTab, setActiveTab }) {
    const navigate = useNavigate();
    
    const menuItems = [
        { name: 'Overview', icon: <Home size={16} />, path: '/dashboard' },
        { name: 'Accounts', icon: <Wallet size={16} />, path: '/accounts' },
        { name: 'Transfers', icon: <ArrowLeftRight size={16} />, path: '/transfers' },
        { name: 'Transactions', icon: <FileText size={16} /> , path: '/transactions'},
        { name: 'Fraud Detection', icon: <CreditCard size={16} />, path: '/fraud-detection' },
        { name: 'Analytics', icon: <BarChart3 size={16} />, path: '/analytics' },
        { name: 'Security', icon: <Shield size={16} />, path: '/security' },
        { name: 'Settings', icon: <Settings size={16} />, path: '/settings' },
    ];

    const handleNavigation = (tabName, routePath) => {
        setActiveTab(tabName); 
        navigate(routePath);  
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

  return (
    <aside className="w-64 bg-white border-r border-[#E5E7EB] flex flex-col fixed h-full z-20 select-none overflow-hidden">
      
      {/* 1. FIXED BRAND HEADER */}
      <div className="p-6 pb-4 flex-shrink-0">
        <div className="px-2">
          <FinovaBrand />
        </div>
      </div>
      
      {/* 2. SCROLLABLE MIDDLE BODY (Navigation Links & Logout) */}
      <div className="flex-1 overflow-y-auto px-6 py-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-200">
        <nav className="space-y-1">
          {menuItems.map((item) => (
              <button
              key={item.name}
              onClick={() => handleNavigation(item.name, item.path)} 
              className={`w-full flex items-center space-x-3.5 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                  activeTab === item.name 
                  ? 'bg-[#FAF9F5] text-[#111111]' 
                  : 'text-[#6B7280] hover:bg-gray-50 hover:text-[#111111]'
              }`}
              >
              <span className={activeTab === item.name ? 'text-[#0F766E]' : 'text-inherit'}>
                  {item.icon}
              </span>
              <span>{item.name}</span>
              </button>
          ))}

          {/* DIVIDER LINE */}
          <div className="my-3 border-t border-gray-100" />

          {/* LOGOUT BUTTON */}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3.5 px-4 py-3 text-sm font-semibold rounded-xl text-rose-600 bg-rose-50/40 border border-rose-100/60 hover:bg-rose-50 hover:text-rose-700 transition-all shadow-sm active:scale-[0.99]"
          >
            <span className="text-rose-600">
              <LogOut size={16} className="stroke-[2.5]" />
            </span>
            <span>Log Out</span>
          </button>
        </nav>
      </div>

      {/* 3. FIXED BOTTOM SUPPORT WIDGET */}
      <div className="p-6 pt-4 border-t border-gray-50 bg-white flex-shrink-0">
        <div className="bg-[#FAF9F5] rounded-xl border border-[#E5E7EB]/50 p-4 text-center space-y-3">
          <div className="text-xs font-semibold text-[#6B7280]">Need Help?</div>
          <p className="text-[11px] text-[#9CA3AF] leading-tight">24/7 dedicated customer asset support pipeline node.</p>
          <button className="w-full py-2 bg-white border border-[#E5E7EB] rounded-lg text-xs font-bold hover:bg-gray-50 shadow-sm transition-colors">
            Contact Support
          </button>
        </div>
      </div>

    </aside>
  );
}