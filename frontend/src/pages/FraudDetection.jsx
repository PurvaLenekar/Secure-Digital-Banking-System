import React, { useState, useEffect } from 'react';
import { AlertTriangle, Activity, CheckCircle2, Ban, ShieldCheck, User } from 'lucide-react';

export default function FraudDetectionSystem() {
  const [alerts, setAlerts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [history, setHistory] = useState([]);

  // Find the selected item using _id
  const selected = alerts.find(a => a._id === selectedId) || null;

  // In FraudDetectionSystem.jsx
    useEffect(() => {
        console.log("Fetching from: http://localhost:3000/api/security/alerts");
        
        fetch('http://localhost:3000/api/security/alerts', {
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Accept': 'application/json' 
            }
        })
        .then(res => {
            if (!res.ok) throw new Error(`Server responded with ${res.status}`);
            return res.json();
        })
        .then(data => {
            console.log("Data received:", data);
            setAlerts(data);
        })
        .catch(err => console.error("FETCH ERROR:", err));
    }, []);


  const handleResolution = async (action) => {
    if (!selected) return;
    
    await fetch(`/api/security/resolve/${selected._id}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify({ action })
    });

    setHistory([{ ...selected, action, resolvedAt: new Date().toLocaleTimeString() }, ...history]);
    const remaining = alerts.filter(a => a._id !== selectedId);
    setAlerts(remaining);
    setSelectedId(remaining.length > 0 ? remaining[0]._id : null);
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen text-slate-800">
      <div className="max-w-6xl mx-auto flex gap-6">
        
        {/* Sidebar: Queue */}
        <div className="w-1/3 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 mb-6 flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-500" />
              Pending Reviews ({alerts.length})
            </h2>
            <div className="space-y-3">
              {alerts.map(a => (
                <div 
                  key={a._id} 
                  onClick={() => setSelectedId(a._id)} 
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedId === a._id ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-slate-200 hover:border-indigo-200'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded">ID: {a._id.slice(-6)}</span>
                    <span className="text-[10px] font-bold text-red-500 uppercase">{a.riskLevel}</span>
                  </div>
                  <div className="text-sm font-medium">{a.reason}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main View: Investigation Console */}
        <div className="w-2/3 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          {selected ? (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold">Investigation</h2>
                <p className="text-slate-500 text-sm">Reviewing alert sequence: <span className="font-mono">{selected._id}</span></p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-slate-400 text-[10px] font-bold uppercase">Amount</p>
                  <p className="text-xl font-bold mt-1 text-slate-900">{selected.amount}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-slate-400 text-[10px] font-bold uppercase">Risk Score</p>
                  <p className="text-xl font-bold mt-1 text-amber-600">{selected.riskScore} / 100</p>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                <p className="text-amber-900 text-xs font-bold uppercase mb-1">Reason for Flag</p>
                <p className="text-sm text-amber-800 italic">"{selected.reason}"</p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => handleResolution('APPROVED')} 
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <CheckCircle2 size={18} /> Approve
                </button>
                <button 
                  onClick={() => handleResolution('BLOCKED')} 
                  className="flex-1 bg-white border-2 border-red-500 text-red-500 hover:bg-red-50 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
                >
                  <Ban size={18} /> Block
                </button>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 space-y-4">
              <ShieldCheck size={48} strokeWidth={1} />
              <p className="text-sm">Select an alert from the queue to start investigation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}