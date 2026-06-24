import React, { useState } from 'react';
import { AlertTriangle, ArrowRight, Check, User } from 'lucide-react';

export default function RightSidebarWidgets({ activityFeed }) {
  const [targetAccount, setTargetAccount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');

  return (
    <div className="space-y-8">
      {/* Analytics Widget */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.005)] space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider">Spending Analytics</h4>
          <select className="bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg text-[11px] font-bold text-[#6B7280] px-2 py-1 focus:outline-none cursor-pointer">
            <option>This Month</option>
            <option>Last Quarter</option>
          </select>
        </div>
        <div className="h-28 w-full relative flex items-end pt-4">
          <div className="absolute inset-0 flex flex-col justify-between text-[9px] font-mono text-[#9CA3AF] pointer-events-none opacity-40">
            <div className="w-full border-b border-dashed border-gray-100 pb-1">₹80K</div>
            <div className="w-full border-b border-dashed border-gray-100 pb-1">₹40K</div>
          </div>
          <svg className="w-full h-20 text-[#0F766E]" viewBox="0 0 100 40" preserveAspectRatio="none">
            <path d="M0,35 Q15,20 30,26 T60,15 T90,5 T100,2" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Fraud Alert Widget */}
      <div className="bg-amber-50/60 rounded-2xl border border-amber-200/60 p-5 flex items-start space-x-3.5">
        <div className="p-2 bg-amber-100 text-amber-700 rounded-xl flex-shrink-0">
          <AlertTriangle size={18} className="stroke-[2.2]" />
        </div>
        <div className="space-y-1.5 flex-1">
          <h4 className="text-xs font-bold text-amber-900 tracking-wide uppercase">Fraud Alert Trigger</h4>
          <p className="text-[11px] text-amber-800 leading-relaxed">Suspicious remote terminal connection blocked safely.</p>
          <button className="text-[11px] font-bold text-amber-900 underline flex items-center">
            <span>View Details</span> <ArrowRight size={10} className="ml-1" />
          </button>
        </div>
      </div>

      {/* Security Core Score Widget */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.005)] space-y-5">
        <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider">Security Core Score</h4>
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-gray-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-[#0F766E]" strokeDasharray="92, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="absolute text-center">
              <span className="text-2xl font-bold font-mono tracking-tighter text-[#111111]">92</span>
            </div>
          </div>
          <div className="flex-1 text-[11px] font-semibold space-y-2.5">
            <div className="flex items-center justify-between text-[#6B7280]">
              <span className="flex items-center"><Check size={12} className="text-emerald-600 mr-1.5 stroke-[3]" /> Two-Factor Auth</span>
              <span className="text-emerald-700 bg-emerald-50 text-[9px] px-1.5 rounded-md">Enabled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Transfer Widget */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.005)] space-y-4">
        <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider">Quick Transfer Node</h4>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
          <div className="relative rounded-xl border border-[#E5E7EB] bg-white flex items-center px-3.5">
            <User size={14} className="text-[#9CA3AF] mr-2" />
            <input type="text" placeholder="Enter account details" className="w-full text-xs py-3 bg-transparent focus:outline-none" />
          </div>
          <button className="w-full py-3 bg-[#111111] text-white font-semibold rounded-xl text-xs">Transfer Now</button>
        </form>
      </div>

      {/* Live Activity Feed */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.005)] space-y-4">
        <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider">Live Activity Feed</h4>
        <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100">
          {activityFeed.map((item, id) => (
            <div key={id} className="flex items-start space-x-3.5 relative">
              <div className="w-6 h-6 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center z-10 flex-shrink-0">
                <span className="w-2 h-2 rounded-full bg-[#0F766E]" />
              </div>
              <div className="space-y-0.5">
                <h5 className="text-xs font-bold text-[#111111] leading-snug">{item.title}</h5>
                <p className="text-[10px] text-[#9CA3AF] font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}