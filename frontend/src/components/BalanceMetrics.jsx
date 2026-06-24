import React from 'react';
import { Eye, EyeOff, ArrowUpRight } from 'lucide-react';

export default function BalanceMetrics({ showBalance, setShowBalance, accounts }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.005)] relative overflow-hidden">
      <div className="space-y-1">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-[#6B7280]">
          <span>Total Balance</span>
          <button onClick={() => setShowBalance(!showBalance)} className="text-[#9CA3AF] hover:text-[#111111] transition-colors">
            {showBalance ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
        </div>
        <h1 className="text-4xl font-bold font-mono tracking-tight pt-1">
          {showBalance ? '₹12,48,392.50' : '••••••••••'}
        </h1>
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-600 pt-1">
          <ArrowUpRight size={14} className="stroke-[2.5]" />
          <span>12.5%</span>
          <span className="text-[#9CA3AF] font-medium">vs last month</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-gray-100 mt-8">
        {accounts.map((acc, index) => (
          <div key={index} className="bg-white border border-[#E5E7EB] rounded-xl p-4 hover:border-[#0F766E]/40 hover:shadow-sm cursor-pointer transition-all flex justify-between items-center group">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <div className={`p-1.5 rounded-lg ${acc.bg}`}>{acc.icon}</div>
                <span className="text-xs font-bold text-[#6B7280]">{acc.type}</span>
              </div>
              <div className="text-lg font-bold font-mono text-[#111111]">
                {showBalance ? acc.balance : '••••••'}
              </div>
              <div className="text-[10px] text-[#9CA3AF] font-medium font-mono">{acc.accNo}</div>
            </div>
            <span className="text-[#9CA3AF] group-hover:text-[#0F766E] group-hover:translate-x-0.5 transition-all text-xs font-mono">&gt;</span>
          </div>
        ))}
      </div>
    </div>
  );
}