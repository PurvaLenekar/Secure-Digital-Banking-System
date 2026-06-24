import React from 'react';
import { Check } from 'lucide-react';

export default function TransactionLedger({ transactions }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.005)]">
      <div className="p-6 border-b border-[#E5E7EB] flex justify-between items-center">
        <h3 className="text-base font-bold text-[#111111]">Recent Transactions</h3>
        <button className="text-xs font-bold text-[#0F766E] hover:underline flex items-center space-x-1">
          <span>View All Transactions</span>
          <span className="text-[10px]">&gt;</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF9F5]/40 border-b border-[#E5E7EB] text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">
              <th className="py-3.5 px-6">Merchant</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4 text-right">Amount</th>
              <th className="py-3.5 px-6 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {transactions.map((tx, idx) => (
              <tr key={idx} className="hover:bg-[#FAF9F5]/20 transition-colors group">
                <td className="py-4 px-6 flex items-center space-x-3.5">
                  <img 
                    src={tx.logo} 
                    alt="" 
                    className="w-7 h-7 rounded-lg border border-gray-100 bg-white object-contain p-0.5 flex-shrink-0"
                    onError={(e) => { e.target.src = `https://placehold.co/100x100?text=${tx.merchant[0]}` }}
                  />
                  <div>
                    <div className="font-bold text-[#111111] group-hover:text-[#0F766E] transition-colors">{tx.merchant}</div>
                    <div className="text-[10px] text-[#9CA3AF] lowercase font-medium">{tx.url}</div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase ${tx.catBg}`}>
                    {tx.category}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-500">
                  <div className="font-medium text-[#111111]">{tx.date}</div>
                  <div className="text-[10px] text-[#9CA3AF] font-mono">{tx.time}</div>
                </td>
                <td className={`py-4 px-4 text-right font-bold font-mono text-sm ${tx.amount.startsWith('+') ? 'text-emerald-600' : 'text-[#111111]'}`}>
                  {tx.amount}
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <Check size={10} className="mr-0.5 stroke-[3]" /> {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}