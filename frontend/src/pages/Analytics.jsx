

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Shield, TrendingUp, AlertTriangle, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function Analytics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/analytics', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Error:", err));
  }, []);

  if (!stats) return <div className="p-10 text-slate-500">Loading data...</div>;

  const kpiItems = [
    { label: 'Total Volume', val: stats.kpis?.volume, icon: TrendingUp, color: 'text-indigo-600' },
    { label: 'Approval Rate', val: stats.kpis?.approvalRate, icon: Shield, color: 'text-emerald-600' },
    { label: 'Fraud Anomalies', val: stats.kpis?.anomalies, icon: AlertTriangle, color: 'text-red-600' },
    { label: 'Active Users', val: stats.kpis?.activeUsers, icon: Users, color: 'text-sky-600' },
  ];

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm">System performance and security metrics.</p>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiItems.map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{item.label}</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-2">{item.val}</h3>
                </div>
                <div className={`p-2 bg-slate-50 rounded-lg ${item.color}`}>
                  <item.icon size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 mb-6">TRANSACTION VOLUME TREND</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="volume" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sidebar: Recent Activity */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 mb-4">RECENT FRAUD LOGS</h2>
            <div className="space-y-4">
              {stats.logs?.map((log, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="p-2 bg-red-100 rounded-lg text-red-600"><AlertTriangle size={14} /></div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{log.fraudType || 'Suspicious Activity'}</p>
                    <p className="text-[10px] text-slate-500">Score: {log.riskScore || 'N/A'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}