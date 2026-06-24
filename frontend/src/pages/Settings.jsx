import React, { useState } from 'react';
import { Shield, Bell, Key, Save, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  // State for Tabs
  const [activeTab, setActiveTab] = useState('Security');
  
  // State for form fields
  const [settings, setSettings] = useState({
    txnLimit: '100000',
    rateLimit: '60',
    autoFreeze: true,
    emailAlerts: true,
    smsAlerts: false
  });

  // Handle Save (Simulates API call)
  const handleSave = () => {
    console.log("Saving Settings:", settings);
    alert("Configuration Updated Successfully!");
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-black text-slate-900 mb-8">System Configuration</h1>

      <div className="flex gap-8">
        {/* SIDEBAR NAVIGATION */}
        <div className="w-1/5 space-y-2">
          {[
            { name: 'Security', icon: Shield },
            { name: 'Notifications', icon: Bell },
            { name: 'Integrations', icon: Key }
          ].map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition ${
                activeTab === tab.name ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <tab.icon size={16} /> {tab.name}
            </button>
          ))}
        </div>

        {/* CONTENT AREA */}
        <div className="w-4/5 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h2 className="text-lg font-bold mb-6">{activeTab} Preferences</h2>

          {/* SECURITY TAB */}
          {activeTab === 'Security' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">TRANSACTION LIMIT (₹)</label>
                  <input 
                    type="number" 
                    value={settings.txnLimit}
                    onChange={(e) => setSettings({...settings, txnLimit: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-bold" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">RATE LIMIT (REQ/MIN)</label>
                  <input 
                    type="number" 
                    value={settings.rateLimit}
                    onChange={(e) => setSettings({...settings, rateLimit: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-bold" 
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <div className="text-sm font-bold text-slate-800">Auto-Freeze Mode</div>
                  <div className="text-[10px] text-slate-500">Automatically block high-risk accounts.</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={settings.autoFreeze}
                  onChange={() => setSettings({...settings, autoFreeze: !settings.autoFreeze})}
                  className="w-6 h-6 rounded-md accent-emerald-600" 
                />
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'Notifications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border-b">
                <span className="text-xs font-bold text-slate-700">Send Email on Fraud Detection</span>
                <input type="checkbox" checked={settings.emailAlerts} onChange={() => setSettings({...settings, emailAlerts: !settings.emailAlerts})} className="w-5 h-5 accent-emerald-600" />
              </div>
              <div className="flex items-center justify-between p-4 border-b">
                <span className="text-xs font-bold text-slate-700">Send SMS Alerts</span>
                <input type="checkbox" checked={settings.smsAlerts} onChange={() => setSettings({...settings, smsAlerts: !settings.smsAlerts})} className="w-5 h-5 accent-emerald-600" />
              </div>
            </div>
          )}

          {/* INTEGRATIONS TAB */}
          {activeTab === 'Integrations' && (
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-slate-400 block">SYSTEM API KEY</label>
              <div className="flex gap-2">
                <input type="password" value="sk-live-7829103948" readOnly className="flex-1 bg-slate-50 border p-3 rounded-xl text-xs font-mono" />
                <button className="bg-slate-900 text-white px-6 py-2 rounded-xl text-xs font-bold">Regenerate</button>
              </div>
            </div>
          )}

          {/* SAVE BUTTON */}
          <div className="mt-10 pt-6 border-t flex justify-end">
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl text-xs font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
            >
              <Save size={14} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}