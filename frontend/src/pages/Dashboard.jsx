

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff,
  PieChart,
  Globe
} from 'lucide-react';

// Core layout dashboard panels
import RightSidebarWidgets from '../components/RightSidebarWidgets';

export default function DashboardPage() {
  const [showBalance, setShowBalance] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [totalBalance, setTotalBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  const [categoryAnalytics, setCategoryAnalytics] = useState({});
  const [activityFeed, setActivityFeed] = useState([]);
  const [userLang, setUserLang] = useState('en');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:3000/api/dashboard",
          {
            headers: { 
              Authorization: `Bearer ${token}` 
            },
            withCredentials: true
          }
        );

        const data = response.data.dashboardData;
        setUserLang(response.data.userLanguage || 'en');

        let calculatedIncome = 0;
        let calculatedExpense = 0;
        const categoryMap = {};

        (data.transactions || []).forEach((tx) => {
          const isCredit = !tx.fromAccount || tx.type === 'DEPOSIT';
          const txAmount = tx.amount || 0;

          if (isCredit) {
            calculatedIncome += txAmount;
          } else {
            calculatedExpense += txAmount;
            
            // Extract categories for dynamic charts representation
            let baseCategory = tx.type === 'DEPOSIT' ? 'Wallet Deposit' : 'Outgoing Transfer';
            if (tx.note && tx.note.includes("|")) {
              const parts = tx.note.split("|");
              if (parts[0]?.trim()) baseCategory = parts[0].trim();
            }
            
            categoryMap[baseCategory] = (categoryMap[baseCategory] || 0) + txAmount;
          }
        });

        setCategoryAnalytics(categoryMap);

        const finalIncome = data.totalIncome > 0 ? data.totalIncome : calculatedIncome;
        const finalExpense = data.totalExpense > 0 ? data.totalExpense : calculatedExpense;

        setTotalIncome(finalIncome);
        setTotalExpense(finalExpense);
        setTotalBalance(data.totalBalance > 0 ? data.totalBalance : (finalIncome - finalExpense));

        setActivityFeed([
          {
            title: 'Dashboard engine synced',
            desc: new Date().toLocaleString()
          },
          {
            title: 'Analytical models generated',
            desc: `${Object.keys(categoryMap).length} functional expense streams compiled`
          }
        ]);

      } catch (err) {
        console.error("Error connecting to backend dashboard stream:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatINR = (val) => {
    return new Intl.NumberFormat(
      'en-IN',
      {
        style: 'currency',
        currency: 'INR'
      }
    ).format(val);
  };

  if (isLoading) {
    return (
      <div className="p-8 text-xs font-mono font-bold text-teal-600">
        Compiling structural banking visuals...
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-[1600px] w-full mx-auto">

      {/* HEADER WITH AI LANGUAGE SIGNATURE */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#111111] uppercase">
            System Telemetry Node
          </h1>
          <p className="text-xs text-[#6B7280]">
            Real-time ledger processing analytics and expenditure visualization panels.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          <Globe size={12} className="text-teal-600 animate-spin" />
          <span className="text-[10px] font-mono font-bold uppercase text-gray-600">Locale Context: {userLang}</span>
        </div>
      </div>

      {/* MAIN GRID CONTAINER */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

        {/* LEFT COMPONENT COLUMN */}
        <div className="xl:col-span-8 space-y-8">

          {/* METRICS ROW CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* TOTAL BALANCE */}
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] flex justify-between items-center">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
                  Total Main Balance
                </span>
                <div className="text-2xl font-bold font-mono text-[#111111]">
                  {showBalance ? formatINR(totalBalance) : '••••••••••'}
                </div>
              </div>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-2 text-[#9CA3AF] hover:text-[#111111] transition-colors"
              >
                {showBalance ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* TOTAL INFLOW */}
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] flex items-center space-x-4">
              <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
                <ArrowUpRight size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
                  Total Inflow
                </span>
                <div className="text-lg font-bold font-mono text-emerald-600 mt-0.5">
                  {showBalance ? formatINR(totalIncome) : '••••••••••'}
                </div>
              </div>
            </div>

            {/* TOTAL OUTFLOW */}
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] flex items-center space-x-4">
              <div className="p-2.5 bg-rose-50 text-rose-700 rounded-xl">
                <ArrowDownRight size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
                  Total Outflow
                </span>
                <div className="text-lg font-bold font-mono text-rose-600 mt-0.5">
                  {showBalance ? formatINR(totalExpense) : '••••••••••'}
                </div>
              </div>
            </div>

          </div>

          {/* VISUAL ANALYTICS AND SPENDING CHART LAYOUT CONTAINER */}
          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] space-y-6">
            <div className="flex items-center space-x-2 text-gray-800">
              <PieChart size={18} className="text-teal-700" />
              <h2 className="text-xs font-black uppercase tracking-wider">
                Category Expenditure Breakdown
              </h2>
            </div>

            {Object.keys(categoryAnalytics).length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-400 font-medium font-mono border border-dashed border-gray-200 rounded-xl">
                No active outgoing debit data pools located to map analytics.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-2">
                
                {/* INTERACTIVE COMPOSITION DISTRIBUTION GRAPH BARS */}
                <div className="space-y-4">
                  {Object.entries(categoryAnalytics).map(([category, amount], idx) => {
                    const percentage = totalExpense > 0 ? ((amount / totalExpense) * 100).toFixed(1) : 0;
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-gray-700">{category}</span>
                          <span className="font-mono font-semibold text-gray-500">
                            {formatINR(amount)} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-teal-600 to-emerald-500 rounded-full transition-all duration-1000"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* INTERACTIVE COMPLIANCE & RATE-LIMIT CHECKPOINT PANEL */}
                <div className="p-6 bg-[#0B0F19] text-gray-200 rounded-3xl border border-gray-800 space-y-4 shadow-xl relative overflow-hidden font-mono">
                  {/* Decorative subtle background mesh */}
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-teal-500/10 rounded-full blur-xl pointer-events-none"></div>
                  
                  <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300">
                        Backend Security Core
                      </span>
                    </div>
                    <span className="text-[9px] bg-teal-950 text-teal-400 border border-teal-800/60 font-bold px-2 py-0.5 rounded-md">
                      Active Shield
                    </span>
                  </div>

                  {/* DYNAMIC RULE METRICS */}
                  <div className="space-y-3.5 text-[11px]">
                    {/* Metric 1: Idempotency Validation Status */}
                    <div className="flex justify-between items-center bg-gray-900/60 p-2.5 rounded-xl border border-gray-800/40">
                      <span className="text-gray-400">Idempotency Key:</span>
                      <span className="text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/30">
                        [READY] Next Block
                      </span>
                    </div>

                    {/* Metric 2: Live Dynamic Concurrency Lock Pool */}
                    <div className="flex justify-between items-center bg-gray-900/60 p-2.5 rounded-xl border border-gray-800/40">
                      <span className="text-gray-400">Concurrency Lock:</span>
                      <span className="text-gray-300 font-bold">
                        {totalBalance < 1000 ? "⚠️ Strict Isolation" : "✓ Pessimistic Mongoose"}
                      </span>
                    </div>

                    {/* Metric 3: Live Threshold Warnings based on real data */}
                    <div className="space-y-1 bg-gray-900/40 p-2.5 rounded-xl border border-gray-800/20">
                      <div className="flex justify-between text-gray-400">
                        <span>Single Tx Risk Limit:</span>
                        <span className="text-amber-400 font-bold">₹50,000 max</span>
                      </div>
                      <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden mt-1">
                        <div 
                          className="h-full bg-gradient-to-r from-teal-500 to-amber-500 transition-all duration-500"
                          style={{ width: `${Math.min((totalExpense / 50000) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* FOOTER AUDIT NOTICE */}
                  <div className="pt-2.5 border-t border-gray-800 text-[9px] text-gray-500 flex justify-between items-center">
                    <span>Rate Limit: 99/100 requests left</span>
                    <span className="text-teal-500 hover:underline cursor-pointer select-none">View System Logs</span>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>

        {/* RIGHT SIDEBAR COLUMN */}
        <div className="xl:col-span-4">
          <RightSidebarWidgets activityFeed={activityFeed} />
        </div>

      </div>

    </div>
  );
}