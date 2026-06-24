import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import {
  Search,
  SlidersHorizontal,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff,
  Download,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AccountsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [showBalance, setShowBalance] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // DASHBOARD STATES
  const [balance, setBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [transactions, setTransactions] = useState([]);

  // DEPOSIT DEBIT FORM STATES
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositDesc, setDepositDesc] = useState('');
  const [isSubmittingDeposit, setIsSubmittingDeposit] = useState(false);

  const [userAccounts, setUserAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState('');

  const [insights, setInsights] = useState([]);
  const [loadingInsights, setLoadingInsights] = useState(false);


  // FETCH DASHBOARD DATA FUNCTION WITH CORRECTED BALANCE MAPPING
  const fetchAccountData = async () => {
    try {
      setIsLoading(true);
      setError('');
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token not found");
        return;
      }

      // NEW: Fetch user accounts for the dropdown
      const accountsRes = await axios.get("http://localhost:3000/api/accounts", { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setUserAccounts(accountsRes.data.accounts);
      if (accountsRes.data.accounts.length > 0) {
        setSelectedAccountId(accountsRes.data.accounts[0]._id);
      }

      // Fetch Dashboard Data
      const response = await axios.get("http://localhost:3000/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      const data = response.data.dashboardData;
      let calculatedIncome = 0;
      let calculatedExpense = 0;

      const formattedTransactions = (data.transactions || []).map((tx, index) => {
        const isCredit = !tx.fromAccount || tx.type === 'DEPOSIT';
        const txAmount = tx.amount || 0;
        if (isCredit) calculatedIncome += txAmount; else calculatedExpense += txAmount;

        return {
          id: tx._id || index + 1,
          type: isCredit ? 'Credit' : 'Debit',
          merchant: tx.note || tx.description || (isCredit ? 'Money Received' : 'Money Sent'),
          category: tx.type === 'DEPOSIT' ? 'Wallet Deposit' : (isCredit ? 'Incoming Transfer' : 'Outgoing Transfer'),
          amount: txAmount,
          date: tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('en-IN') : 'N/A',
          status: tx.status || 'SUCCESS'
        };
      });

      setTransactions(formattedTransactions);
      setTotalIncome(data.totalIncome > 0 ? data.totalIncome : calculatedIncome);
      setTotalExpense(data.totalExpense > 0 ? data.totalExpense : calculatedExpense);
      setBalance(data.totalBalance > 0 ? data.totalBalance : (calculatedIncome - calculatedExpense));

    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountData();
  }, []);

  const fetchInsights = async () => {
    setLoadingInsights(true);
    try {
        const token = localStorage.getItem("token");
        console.log("Attempting to fetch insights...");
        const res = await axios.get("http://localhost:3000/api/dashboard/ai-insights", {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Insights received:", res.data); // See what we got
        setInsights(res.data.insights || []);
    } catch (err) {
        console.error("DEBUG - Full Error Object:", err);
        if (err.response) {
            console.error("Server responded with:", err.response.data);
        }
    } finally {
        setLoadingInsights(false);
    }
};

// Call it in your existing useEffect
  useEffect(() => {
      fetchAccountData();
      fetchInsights(); // Add this line
  }, []);



  // SUBMIT ADD FUNDS ENGINE
  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsSubmittingDeposit(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/dashboard/add-funds",
        {
          amount: parseFloat(depositAmount),
          description: depositDesc,
          accountId: selectedAccountId // <--- THIS SENDS THE ID
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );

      // Assuming your API returns { success: true }
      setSuccessMsg("Funds successfully deposited!");
      setDepositAmount('');
      setDepositDesc('');
      setShowDepositForm(false);
      await fetchAccountData(); 
    } catch (err) {
      setError(err?.response?.data?.message || "Deposit failed.");
    } finally {
      setIsSubmittingDeposit(false);
    }
  };

  // FILTER LOGIC FIXED (Matches tx.type to Credit/Debit values correctly)
  const filteredTransactions = (transactions || []).filter((tx) => {
    const matchesSearch =
      tx.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = statusFilter === 'All' || tx.type === statusFilter;
    return matchesSearch && matchesFilter;
  });

  // INR FORMAT
  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(val);
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-8 max-w-[1600px] w-full mx-auto animate-pulse">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-gray-200 rounded-lg"></div>
            <div className="h-4 w-72 bg-gray-100 rounded-md"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-10 w-28 bg-gray-200 rounded-xl"></div>
            <div className="h-10 w-32 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-24 bg-gray-100 rounded-2xl border border-gray-200"></div>
          <div className="h-24 bg-gray-100 rounded-2xl border border-gray-200"></div>
          <div className="h-24 bg-gray-100 rounded-2xl border border-gray-200"></div>
        </div>
        <div className="h-64 bg-gray-50 rounded-2xl border border-gray-200"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-[1600px] w-full mx-auto">
      
      {/* STATUS SYSTEM NOTIFICATIONS */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError('')}><X size={16} /></button>
        </div>
      )}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm flex justify-between items-center">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')}><X size={16} /></button>
        </div>
      )}

      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">
            Accounts Overview
          </h1>
          <p className="text-xs text-[#6B7280]">
            Monitor balances and recent transaction activity.
          </p>
        </div>

        {/* HEADER CONTROL SYSTEM BUTTONS */}
        <div className="flex items-center space-x-3 self-start sm:self-auto">
          <button
            onClick={() => setShowDepositForm(!showDepositForm)}
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-white border border-[#E5E7EB] hover:bg-gray-50 text-[#111111] text-xs font-semibold rounded-xl shadow-sm transition-all active:scale-[0.98]"
          >
            <Download size={14} className="text-emerald-600" />
            <span>Deposit Funds</span>
          </button>

          <button
            onClick={() => navigate('/transfers')}
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-[#0F766E] hover:bg-[#0d665f] text-white text-xs font-semibold rounded-xl shadow-sm transition-all active:scale-[0.98]"
          >
            <Plus size={14} />
            <span>New Transfer</span>
          </button>
        </div>
      </div>

      {/* DROP DOWN FORM FOR ADDING FUNDS */}
      {showDepositForm && (
        <div className="bg-[#FAF9F5] border border-[#E5E7EB] rounded-2xl p-6 transition-all shadow-inner max-w-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
              Deposit Wallet Funds
            </h3>
            <button 
              onClick={() => setShowDepositForm(false)} 
              className="p-1 hover:bg-gray-200/60 rounded-lg text-gray-400 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          </div>
          

          <div className="space-y-1.5 mb-4">
            <label className="text-[11px] font-bold text-[#6B7280] uppercase">Select Account</label>
            <select 
              value={selectedAccountId} 
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#0F766E]"
            >
              {userAccounts.map(acc => (
                <option key={acc._id} value={acc._id}>Account ID: {acc._id.slice(-6)}</option>
              ))}
            </select>
          </div>


          <form onSubmit={handleDepositSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#6B7280] uppercase">Amount (INR)</label>
                <input 
                  type="number" 
                  required
                  min="1"
                  placeholder="e.g. 5000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-[#0F766E]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#6B7280] uppercase">Memo Description</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Self deposit via UPI"
                  value={depositDesc}
                  onChange={(e) => setDepositDesc(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0F766E]"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmittingDeposit}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl transition-all shadow-sm disabled:opacity-50"
            >
              {isSubmittingDeposit ? "Processing..." : "Complete Account Credit"}
            </button>
          </form>
        </div>
      )}

      {/* BALANCE & ANALYSIS HIGHLIGHT METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* BALANCE */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
              Net Wallet Balance
            </span>
            <div className="text-2xl font-bold font-mono text-[#111111]">
              {showBalance ? formatINR(balance) : '••••••••••'}
            </div>
          </div>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 text-[#9CA3AF] hover:text-[#111111] transition-colors"
          >
            {showBalance ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* INCOME */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm flex items-center space-x-4">
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
            <ArrowUpRight size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
              Total Incoming
            </span>
            <div className="text-lg font-bold font-mono text-emerald-600 mt-0.5">
              {showBalance ? formatINR(totalIncome) : '••••••••••'}
            </div>
          </div>
        </div>

        {/* EXPENSE */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm flex items-center space-x-4">
          <div className="p-2.5 bg-rose-50 text-rose-700 rounded-xl">
            <ArrowDownRight size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
              Total Outgoing
            </span>
            <div className="text-lg font-bold font-mono text-rose-600 mt-0.5">
              {showBalance ? formatINR(totalExpense) : '••••••••••'}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 shadow-sm">
        <h3 className="text-sm font-bold text-indigo-900 mb-4 flex items-center gap-2">
          ✨ AI Spending Insights
        </h3>
        {loadingInsights ? (
          <p className="text-xs text-indigo-400">Analyzing your spending habits...</p>
        ) : (
          <ul className="space-y-3">
            {insights.map((tip, i) => (
              <li key={i} className="text-xs text-indigo-700 flex items-start gap-2">
                <span className="mt-0.5">•</span> {tip}
              </li>
            ))}
          </ul>
        )}
      </div>


      {/* TRANSACTION TABLE BLOCK */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
          <div className="relative w-full sm:max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-[#E5E7EB] rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#0F766E] focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#6B7280] px-3 py-2 focus:outline-none cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Credit">Credit</option>
              <option value="Debit">Debit</option>
            </select>
            <button className="p-2 bg-gray-50 border border-[#E5E7EB] rounded-xl text-[#6B7280] hover:text-[#111111]">
              <SlidersHorizontal size={14} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
                <th className="py-3 px-6">Transaction</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-6 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/40 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#111111]">{tx.merchant}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${
                        tx.type === "Credit" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                      }`}>
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-500 font-medium">{tx.date}</td>
                    <td className={`py-4 px-6 text-right font-bold font-mono ${
                      tx.type === 'Credit' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {tx.type === 'Credit' ? '+' : '-'} {formatINR(tx.amount)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-xs font-medium text-[#9CA3AF]">
                    No transaction records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}


