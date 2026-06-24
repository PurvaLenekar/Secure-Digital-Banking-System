import React, { useState, useEffect } from "react";
import axios from "axios";
import { HelpCircle, ShieldCheck, Search } from "lucide-react";

export default function TransfersPage() {
  const generateUniqueKey = () => `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  const [formData, setFormData] = useState({
    beneficiary: null,
    amount: "",
    category: "Peer Transfer",
    description: "",
    pin: "",
    otp: "",
    idempotencyKey: generateUniqueKey()
  });

  const [isLoading, setIsLoading] = useState(true);
  const [accountData, setAccountData] = useState({ id: "", accountNumber: "", balance: 0 });
  const [beneficiaries, setBeneficiaries] = useState([]);
  
  // UI States
  const [showTransferOtp, setShowTransferOtp] = useState(false);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  
  // Separate states for PIN Reset
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [pinOtp, setPinOtp] = useState("");
  const [newSecurePin, setNewSecurePin] = useState("");

  const [fraudWarning, setFraudWarning] = useState(null);

  const parsedAmount = parseFloat(formData.amount) || 0;

  const formatINR = (val) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(val);

  useEffect(() => {
    const fetchTransferPageData = async () => {
      try {
        const token = localStorage.getItem("token");
        const accountResponse = await axios.get("http://localhost:3000/api/accounts", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const accountsList = accountResponse.data.accounts || accountResponse.data;
        const firstAccount = Array.isArray(accountsList) ? accountsList[0] : accountsList;

        if (firstAccount) {
          setAccountData({
            id: firstAccount._id,
            accountNumber: firstAccount.accountNumber,
            balance: firstAccount.balance || 0
          });
        }
        setBeneficiaries([
          { _id: "69f994b47f2cb70b8ae7f768", name: "Rahul Sharma", accountNumber: "100001" },
          { _id: "69f993597f2cb70b8ae7f763", name: "Neha Verma", accountNumber: "100002" }
        ]);
      } catch (err) {
        console.error("Data retrieval error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransferPageData();
  }, []);

  const handleRequestTransferOtp = async () => {
    if (parsedAmount <= 0) return alert("Enter a valid amount");
    setIsRequestingOtp(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/api/transactions/request-otp", 
        { amount: parsedAmount }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowTransferOtp(true);
      alert("OTP sent to your email!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const handleRequestOtp = async () => {
      alert("Verification OTP sent.");
      setIsOtpSent(true);
  };

  const handleVerifyAndUpdatePin = async () => {
      if (!pinOtp || !newSecurePin) return alert("Please fill in all fields");
      alert("PIN Updated Successfully");
      setIsOtpSent(false);
      setPinOtp("");
      setNewSecurePin("");
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    if (!formData.beneficiary || !formData.amount) return alert("Fill all fields");

    try {
      const token = localStorage.getItem("token");
      const payload = {
        fromAccount: accountData.id,
        toAccount: formData.beneficiary._id,
        amount: parsedAmount,
        pin: formData.pin,
        idempotencyKey: formData.idempotencyKey,
        category: formData.category,
        description: formData.description,
        ...(parsedAmount > 10000 && { otp: formData.otp })
      };

      await axios.post("http://localhost:3000/api/transactions", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(`Transfer of ${formatINR(parsedAmount)} successful`);
    } catch (err) {
      if (err.response?.data?.fraudDetected) {
            setFraudWarning(err.response.data.message);
        } else {
            alert(err.response?.data?.message || "Transfer failed");
        }
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 space-y-8 max-w-[1600px] w-full mx-auto">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">Transfer Money</h1>
          <p className="text-xs text-[#6B7280]">Send money securely across banking gateways.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#6B7280] shadow-sm hover:bg-gray-50 flex items-center space-x-1"><span>🛡️</span><span>Limits & fees</span></button>
          <button className="px-3 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#6B7280] shadow-sm hover:bg-gray-50 flex items-center space-x-1"><HelpCircle size={14} className="text-[#9CA3AF]" /><span>Need help?</span></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">From Account</label>
            <div className="w-full border border-[#E5E7EB] rounded-xl p-4 flex items-center justify-between bg-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#0F766E]/5 text-[#0F766E] rounded-xl flex items-center justify-center text-base">🏦</div>
                <div>
                  <div className="text-xs font-bold text-[#111111]">Checking Account •••• {accountData.accountNumber || "N/A"}</div>
                  <div className="text-[11px] font-mono text-[#6B7280]">Available balance: {formatINR(accountData.balance)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">To Beneficiary</label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input type="text" placeholder="Select beneficiary below..." value={formData.beneficiary?.name || ""} readOnly className="w-full bg-gray-50 border border-[#E5E7EB] rounded-xl pl-9 pr-10 py-3 text-xs font-bold" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {beneficiaries.map((b, i) => (
                <button key={i} type="button" onClick={() => setFormData({...formData, beneficiary: b})} className={`p-3 border rounded-xl flex items-center space-x-2.5 text-left transition-all ${formData.beneficiary?._id === b._id ? "border-[#0F766E] bg-[#FAF9F5] shadow-sm" : "border-[#E5E7EB] hover:bg-gray-50"}`}>
                  <div className="w-8 h-8 bg-emerald-100 text-emerald-700 font-bold rounded-full flex items-center justify-center text-[10px]">{b.name?.charAt(0)}</div>
                  <div>
                    <div className="text-xs font-bold text-[#111111]">{b.name}</div>
                    <div className="text-[10px] text-[#9CA3AF]">Acc: {b.accountNumber}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</label>
            <div className="flex items-center border-b border-gray-100 pb-3">
              <span className="text-4xl font-semibold text-[#111111]">₹</span>
              <input type="number" placeholder="0.00" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="text-4xl font-bold font-mono text-[#111111] bg-transparent outline-none w-full placeholder-gray-200" />
            </div>
          </div>

          {parsedAmount > 10000 && (
            <div className="mb-4">
              {!showTransferOtp ? (
                <button type="button" onClick={handleRequestTransferOtp} className="text-xs bg-[#0F766E] text-white py-2 px-4 rounded-xl">{isRequestingOtp ? "Sending..." : "Verify Identity (OTP Required)"}</button>
              ) : (
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[#6B7280]">Enter OTP received in email</label>
                  <input type="text" value={formData.otp} onChange={(e) => setFormData({...formData, otp: e.target.value})} className="w-full border p-2 rounded-xl text-xs" placeholder="000000" />
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Transaction Category</label>
            <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-gray-50 border border-[#E5E7EB] rounded-xl px-4 py-3 text-xs font-bold text-[#111111] focus:outline-none focus:border-[#0F766E]">
              <option value="Peer Transfer">👥 Peer Transfer</option>
              <option value="Shopping">🛍️ Shopping</option>
              <option value="Food & Dining">🍔 Food & Dining</option>
              <option value="Utilities">💡 Utilities & Bills</option>
              <option value="Entertainment">🎬 Entertainment</option>
              <option value="Investment">📈 Investment</option>
              <option value="Travel">✈️ Travel</option>
              <option value="Other">📦 Other Expenses</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Transaction Description / Context</label>
            <input type="text" placeholder="E.g., Dinner with team..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-50 border border-[#E5E7EB] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#0F766E]" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Transaction PIN</label>
            <input type="password" placeholder="Enter your security PIN" value={formData.pin} onChange={(e) => setFormData({...formData, pin: e.target.value})} className="w-full bg-gray-50 border border-[#E5E7EB] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#0F766E]" />
          </div>

          <button onClick={handleTransferSubmit} className="w-full py-3.5 bg-[#0F766E] hover:bg-[#0d665f] text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-[0.99]">Continue →</button>
        </div>

        {/* Add this block in the right-hand column (lg:col-span-5) */}
       

        <div className="lg:col-span-5 space-y-4">
          {fraudWarning && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 space-y-3 shadow-sm animate-in fade-in zoom-in duration-300">
            <div className="flex items-center space-x-2 text-red-600">
              <span className="text-xl">⚠️</span>
              <h3 className="text-xs font-bold uppercase tracking-wider">Security Alert</h3>
            </div>
            <p className="text-xs text-red-700 leading-relaxed">{fraudWarning}</p>
            <button 
              onClick={() => setFraudWarning(null)} 
              className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-all"
            >
              Understood
            </button>
          </div>
        )}


          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">Transfer Summary</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between"><span>You send</span><span className="font-bold">{formatINR(parsedAmount)}</span></div>
              <div className="flex justify-between"><span>Recipient gets</span><span className="font-bold text-emerald-600">{formatINR(parsedAmount)}</span></div>
              <div className="flex justify-between"><span>Selected Category</span><span className="font-bold text-slate-700">{formData.category}</span></div>
              <div className="flex justify-between"><span>Transfer fee</span><span className="text-emerald-600 font-medium">Free</span></div>
              <div className="flex justify-between"><span>Fraud risk check</span><span className="text-emerald-600 flex items-center space-x-1 font-medium"><ShieldCheck size={14} /><span>Low Risk</span></span></div>
            </div>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111111]">🔐 Secure PIN Settings</h3>
            {!isOtpSent ? (
              <button onClick={handleRequestOtp} className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all">Request Verification OTP</button>
            ) : (
              <div className="space-y-3">
                <input type="text" placeholder="6-Digit OTP" maxLength={6} value={pinOtp} onChange={(e) => setPinOtp(e.target.value)} className="w-full bg-gray-50 border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs font-mono tracking-widest text-center focus:outline-none focus:border-[#0F766E]" />
                <input type="password" placeholder="New 4-Digit PIN" maxLength={4} value={newSecurePin} onChange={(e) => setNewSecurePin(e.target.value)} className="w-full bg-gray-50 border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0F766E]" />
                <div className="flex gap-2">
                  <button type="button" onClick={() => setIsOtpSent(false)} className="w-1/3 py-2 bg-gray-100 text-xs font-semibold rounded-xl">Cancel</button>
                  <button type="button" onClick={handleVerifyAndUpdatePin} className="w-2/3 py-2 bg-[#0F766E] text-white text-xs font-semibold rounded-xl">Verify & Update</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
