import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Shield, 
  Search, 
  Maximize2, 
  AlertTriangle, 
  RefreshCw,
  UserCheck,
  CheckCircle2
} from 'lucide-react';

export default function SecurityPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [apiError, setApiError] = useState(null); 
  
  const [securityScore, setSecurityScore] = useState(100);
  const [frozenCount, setFrozenCount] = useState(0);
  const [members, setMembers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [adminUser, setAdminUser] = useState({ name: 'Admin', email: '' });

  const initialSecuritySync = async () => {
    try {
      setIsLoading(true);
      setApiError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthorized(false);
        setIsLoading(false);
        setApiError("No authorization token found in localStorage.");
        return;
      }

      const response = await axios.get("http://localhost:3000/api/security/fraud-metrics", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      setIsAuthorized(true);
      
      const dataPayload = response?.data || {};
      const memberLedgers = dataPayload.memberLedgers || dataPayload.members || [];
      const heuristicLogs = dataPayload.heuristicLogs || dataPayload.alerts || [];
      const systemHealthScore = dataPayload.systemHealthScore || dataPayload.securityScore || 100;
      const currentAdmin = dataPayload.currentAdmin || dataPayload.user || { name: 'Admin' };
      
      setMembers(memberLedgers);
      setAlerts(heuristicLogs);
      setSecurityScore(systemHealthScore);
      setAdminUser(currentAdmin);

    } catch (err) {
      console.error("Backend Error Response:", err);
      setIsAuthorized(false);
      setApiError(err.response?.data?.message || err.message || "Could not connect to the backend server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initialSecuritySync();
  }, []);

  const handleToggleFreeze = async (targetId, currentStatus) => {
    const nextStatus = currentStatus === 'FROZEN' ? 'ACTIVE' : 'FROZEN';
    
    try {
      const token = localStorage.getItem("token");
      
      await axios.patch(`http://localhost:3000/api/security/toggle-freeze/${targetId}`, 
        { status: nextStatus },
        { 
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true 
        }
      );

      setMembers(prev => prev.map(m => {
        const id = m._id || m.id;
        if (id === targetId) {
          return { ...m, status: nextStatus };
        }
        return m;
      }));
      
    } catch (err) {
      console.error("Action failed:", err);
      alert("Failed to update user status on the backend.");
    }
  };

  useEffect(() => {
    const count = members.filter(m => m?.status === 'FROZEN').length;
    setFrozenCount(count);
  }, [members]);

  const filteredMembers = members.filter(member => {
    const nameMatch = member?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const flatMatch = member?.flatNo?.toLowerCase().includes(searchQuery.toLowerCase());
    const idMatch = (member?._id || member?.id)?.toString().includes(searchQuery);
    return nameMatch || flatMatch || idMatch;
  });

  // AUTHORIZATION / CONNECTION ERROR PANEL
  if (!isLoading && !isAuthorized) {
    return (
      <div className="w-full bg-slate-50 min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white border border-slate-200 p-8 rounded-2xl max-w-md space-y-4 shadow-sm">
          <AlertTriangle className="text-red-500 mx-auto" size={40} />
          <h1 className="text-lg font-bold text-slate-800">
            Connection Configuration Required
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200 text-left overflow-x-auto font-mono">
            <span className="text-red-600 font-bold">Log Trace:</span> {apiError}
          </p>
          <p className="text-[11px] text-slate-400">
            Verify your local environment: Node.js api running on port 3000, account admin flags active, and auth token present.
          </p>
          <button 
            onClick={initialSecuritySync}
            className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-black text-xs text-white py-2.5 rounded-xl transition-all font-semibold shadow-sm"
          >
            <RefreshCw size={12} />
            <span>Retry Connection Pipeline</span>
          </button>
        </div>
      </div>
    );
  }

  // LOADING SCREEN
  if (isLoading) {
    return (
      <div className="w-full bg-slate-50 min-h-screen flex items-center justify-center p-6 text-xs text-slate-500 font-medium tracking-wide">
        <div className="flex items-center space-x-3 bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm">
          <RefreshCw size={14} className="animate-spin text-slate-900" />
          <span>Synchronizing System Ledger Registries...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 min-h-screen text-slate-600 p-6 space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-slate-100 p-2 rounded-xl text-slate-900 border border-slate-200">
            <Shield size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Security Posture Terminal
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Real-time monitoring and account isolation parameters
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center font-bold border border-slate-200">
            {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Identity</div>
            <div className="text-slate-800 font-semibold text-xs">{adminUser?.name || 'Admin'}</div>
          </div>
        </div>
      </div>

      {/* REGION CONTAINER: PIPELINE & GRAPH */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* FRAUD ENGINE POSTURE BOX */}
        <div className="xl:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
              Engine State: <span className="text-slate-900 font-bold uppercase">Heuristic Analysis active</span>
            </div>
            <button 
              onClick={initialSecuritySync}
              className="flex items-center space-x-1.5 text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 font-medium transition-colors shadow-sm"
            >
              <RefreshCw size={12} className="text-slate-400" />
              <span>Poll Hot-Sync</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-6 flex items-center space-x-2.5">
              <div className="space-y-3 text-[10px] font-medium text-slate-500 w-28">
                <div className="bg-slate-50 border border-slate-200 p-2 rounded-lg leading-tight">Input Transaction</div>
                <div className="bg-slate-50 border border-slate-200 p-2 rounded-lg leading-tight">Stream Core 1</div>
                <div className="bg-slate-50 border border-slate-200 p-2 rounded-lg leading-tight">Stream Core 2</div>
              </div>

              <div className="flex-1 flex flex-col justify-center items-center h-24 relative max-w-[40px]">
                <div className="w-full h-[1px] bg-slate-200 absolute top-4 left-0"></div>
                <div className="w-full h-[1px] bg-slate-200 absolute bottom-4 left-0"></div>
                <div className="w-[1px] h-16 bg-slate-200 absolute left-full top-4"></div>
                <div className="w-4 h-[1px] bg-slate-200 absolute left-full top-12"></div>
              </div>

              <div className="space-y-3 text-[10px] font-semibold w-32">
                <div className="bg-slate-100 border border-slate-200 text-slate-800 px-3 py-2 rounded-lg text-center">RBAC Validation</div>
                <div className="bg-slate-100 border border-slate-200 text-slate-800 px-3 py-2 rounded-lg text-center">Rate Limit Filter</div>
              </div>
            </div>

            <div className="md:col-span-3 text-center md:border-l border-slate-200 py-2">
              <div className="text-5xl font-black text-slate-900 tracking-tight">{securityScore}%</div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1">System Health Score</div>
            </div>

            <div className="md:col-span-3 text-[9px] text-slate-400 space-y-1">
              <div className="text-slate-500 font-bold mb-1">Risk Score Trend</div>
              <div className="h-20 w-full relative flex items-end">
                <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#000000" stopOpacity="0.1"/>
                      <stop offset="100%" stopColor="#000000" stopOpacity="0.0"/>
                    </linearGradient>
                  </defs>
                  <path d="M0 10 Q25 15 50 28 T100 35 L100 40 L0 40 Z" fill="url(#chartGrad)" />
                  <path d="M0 10 Q25 15 50 28 T100 35" fill="none" stroke="#000000" strokeWidth="1.5" />
                  <circle cx="100" cy="35" r="2" fill="#000000" />
                </svg>
                <div className="absolute left-0 top-0 text-[8px]">150</div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[8px]">100</div>
                <div className="absolute left-0 bottom-0 text-[8px]">50</div>
              </div>
              <div className="flex justify-between text-slate-300 text-[8px] pt-1">
                <span>00:00</span><span>12:00</span><span>Now</span>
              </div>
            </div>
          </div>
        </div>

        {/* CONTROLS PANEL */}
        <div className="xl:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col space-y-4">
          <div>
            <h2 className="text-xs font-bold tracking-wider text-slate-800 uppercase">
              Ledger Isolation Controls
            </h2>
            <div className="text-[11px] font-medium text-red-500 mt-1 bg-red-50 border border-red-100 rounded-md px-2 py-0.5 inline-block">
              Isolated Accounts: {frozenCount}
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={13} />
            <input 
              type="text" 
              placeholder="Filter ledger users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-2 text-xs focus:outline-none text-slate-700 focus:border-slate-300 transition-colors"
            />
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[220px] pr-1">
            {filteredMembers.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-400 italic border border-dashed border-slate-200 rounded-xl bg-slate-50">
                No ledger member profiles found.
              </div>
            ) : (
              filteredMembers.map((member) => {
                const memberId = member._id || member.id;
                
                // --- INTEGRATED DASHBOARD COMPOSITION LOGIC ---
                // Synchronizes structural checks directly with the system data object configurations
                const incomingAmount = member?.totalIncome || member?.calculatedIncome || 0;
                const outgoingAmount = member?.totalExpense || member?.calculatedExpense || 0;
                
                const rawBalance = member?.totalBalance ?? 
                                   member?.balance ?? 
                                   member?.walletBalance ?? 
                                   member?.netBalance ?? 
                                   (incomingAmount - outgoingAmount);
                                   
                const absoluteBalance = typeof rawBalance === 'string' ? parseFloat(rawBalance) || 0 : rawBalance;
                const isFrozen = member?.status === 'FROZEN';

                return (
                  <div 
                    key={memberId} 
                    className={`p-3.5 rounded-xl border text-xs transition-all ${
                      isFrozen
                        ? 'bg-red-50/40 border-red-200 shadow-sm'
                        : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="font-bold text-slate-800 text-sm flex items-center space-x-1.5">
                          <span>{member?.name || 'User Profile'}</span>
                          {!isFrozen && <UserCheck size={12} className="text-emerald-600" />}
                        </div>
                        <div className="text-slate-400 text-[11px]">Flat: {member?.flatNo || 'N/A'}</div>
                        <div className="text-slate-500 text-[11px] font-medium">
                          Net Wallet Balance: <span className="text-slate-900 font-extrabold">₹{Number(absoluteBalance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-2">
                        <button 
                          onClick={() => handleToggleFreeze(memberId, member?.status)}
                          className={`text-[10px] px-3 py-1.5 rounded-lg font-bold tracking-wide border uppercase transition-all shadow-sm ${
                            isFrozen
                              ? 'bg-red-600 border-red-600 text-white hover:bg-red-700'
                              : 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {isFrozen ? 'Unfreeze' : 'Freeze'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* COMPLIANCE FEED PANEL */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-slate-900"></span>
            <span>Real-Time Compliance Trace Feed</span>
          </h2>
          <Maximize2 size={12} className="text-slate-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100 uppercase text-[10px] tracking-wider">
                <th className="pb-3 font-semibold">Alert Identifier</th>
                <th className="pb-3 font-semibold">Heuristic Context Event</th>
                <th className="pb-3 font-semibold">Timestamp</th>
                <th className="pb-3 font-semibold text-right">Operational Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {alerts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-slate-400 italic bg-slate-50/50 rounded-xl">
                    No active heuristic anomaly events logged in current cycle.
                  </td>
                </tr>
              ) : (
                alerts.map((alert, idx) => (
                  <tr key={alert._id || idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 font-bold text-slate-700">{alert.alertId || `ALRT-${idx+100}`}</td>
                    <td className="py-3.5 text-slate-500">
                      <span className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${alert.severity === 'HIGH' ? 'bg-amber-500' : 'bg-slate-900'}`}></span>
                        <span className="font-medium text-slate-700">{alert.eventDetails || alert.event}</span>
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-400">
                      {alert.createdAt ? new Date(alert.createdAt).toLocaleTimeString() : 'Just Now'}
                    </td>
                    <td className="py-3.5 text-right">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[10px] font-semibold border ${
                        alert.resolution === 'MITIGATED' || alert.resolution === 'CLEARED'
                          ? 'text-green-700 bg-green-50 border-green-100'
                          : 'text-amber-700 bg-amber-50 border-amber-100'
                      }`}>
                        <CheckCircle2 size={10} className="mr-0.5" />
                        <span>{alert.resolution || 'REVIEW PENDING'}</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}


