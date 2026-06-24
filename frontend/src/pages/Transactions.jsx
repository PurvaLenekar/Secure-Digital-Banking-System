
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, SlidersHorizontal, Download, Calendar } from 'lucide-react';

export default function TransactionsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });

        const data = response.data.dashboardData;
        const formatted = (data.transactions || []).map((tx, idx) => {
          const isCredit = !tx.fromAccount || tx.type === 'DEPOSIT';
          let merchant = tx.note || tx.description || (isCredit ? 'Money Received' : 'Money Sent');
          let category = tx.type === 'DEPOSIT' ? 'Wallet Deposit' : (isCredit ? 'Incoming Transfer' : 'Outgoing Transfer');

          if (tx.note && tx.note.includes("|")) {
            const parts = tx.note.split("|");
            category = parts[0]?.trim() || category;
            merchant = parts[1]?.trim() || merchant;
          }

          return {
            id: tx._id || idx + 1,
            merchant,
            category,
            direction: isCredit ? 'Incoming' : 'Outgoing',
            amount: tx.amount || 0,
            status: tx.status || 'COMPLETED',
            date: tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'
          };
        });

        setTransactions(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const filteredData = transactions.filter(tx => {
    const matchesSearch = tx.merchant.toLowerCase().includes(searchQuery.toLowerCase()) || tx.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || tx.direction === activeFilter || tx.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) return <div className="p-8 text-xs font-semibold text-gray-500">Compiling ledger registers...</div>;

  return (
    <div className="p-8 space-y-6 max-w-[1600px] w-full mx-auto">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">Ledger Audit Book</h1>
          <p className="text-xs text-[#6B7280]">Deep-dive transaction verification logs and compliance records.</p>
        </div>
        <button className="flex items-center space-x-1.5 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-xs font-bold rounded-xl shadow-sm self-start sm:self-auto text-gray-800">
          <Download size={14} />
          <span>Export Ledger Schema</span>
        </button>
      </div>

      {/* FILTER CONTROL AND SCOPING HOVER SYSTEM */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm">
        <div className="flex flex-wrap gap-2">
          {['All', 'Incoming', 'Outgoing', 'PENDING', 'FAILED'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeFilter === filter
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {filter === 'PENDING' ? 'Pending' : filter === 'FAILED' ? 'Failed' : filter}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto md:flex-next">
          <div className="relative w-full md:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Filter ledger records..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#0F766E] focus:bg-white transition-all" />
          </div>
          <button className="p-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 hover:text-gray-900"><Calendar size={14} /></button>
          <button className="p-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 hover:text-gray-900"><SlidersHorizontal size={14} /></button>
        </div>
      </div>

      {/* COMPREHENSIVE RECORDS TABULAR SYSTEM */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-500">
              <th className="py-3.5 px-6">Transaction Target Ledger</th>
              <th className="py-3.5 px-4">Classification</th>
              <th className="py-3.5 px-4">Date Authorized</th>
              <th className="py-3.5 px-4">Operational Status</th>
              <th className="py-3.5 px-6 text-right">Value Mapping</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-xs font-medium">
            {filteredData.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50/30 transition-colors">
                <td className="py-4 px-6 font-bold text-gray-900">{tx.merchant}</td>
                <td className="py-4 px-4"><span className="text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md text-[10px]">{tx.category}</span></td>
                <td className="py-4 px-4 text-gray-500">{tx.date}</td>
                <td className="py-4 px-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    tx.status === 'COMPLETED' || tx.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700' :
                    tx.status === 'PENDING' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {tx.status}
                  </span>
                </td>
                <td className={`py-4 px-6 text-right font-bold font-mono text-xs ${tx.direction === 'Incoming' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {tx.direction === 'Incoming' ? '+' : '-'} {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(tx.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}