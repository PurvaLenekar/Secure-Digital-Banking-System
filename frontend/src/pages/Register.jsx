import React, { useState , useEffect } from 'react';
import { Eye, EyeOff, Globe, Shield, CheckCircle, Grid } from 'lucide-react';
import FinovaBrand from '../components/FinovaBrand';
import axios from "axios";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [currentLang, setCurrentLang] = useState('English');
  const [showLangMenu, setShowLangMenu] = useState(false);
  
  // Form States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');

    useEffect(() => {

    // STEP 1 -> default
    if (fullName || email) {
        setStep(1);
    }

    // STEP 2 -> after basic info
    if (fullName && email ) {
        setStep(2);
    }

    // STEP 3 -> after password
    if (fullName && email  && password) {
        setStep(3);
    }

    }, [fullName, email, password]);


    const handleRegister = async (e) => {

    e.preventDefault();

    try {

        const data = {
            name: fullName,
            email: email,
            password: password
        };

        console.log("SENDING DATA:", data);

        const response = await axios.post(
            "http://localhost:3000/api/auth/register",
            data
        );

        console.log("SUCCESS:", response.data);
        alert("Register successfully!");

    } catch (error) {

        console.log("FULL ERROR:", error);

        console.log("BACKEND RESPONSE:", error.response);

        console.log("BACKEND DATA:", error.response?.data);

    }

};

   return (
    <div className="min-h-screen w-full bg-[#F9F9F9] flex items-center justify-center p-4 md:p-8 font-sans antialiased">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.03)] border border-[#E5E7EB] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[850px]">
        
        {/* ================= LEFT PANEL: REGISTRATION MATRIX ================= */}
        <div className="lg:col-span-6 p-8 md:p-16 flex flex-col justify-between bg-white">
          
          {/* Top Brand Block */}
          <div className="flex items-center justify-between">
            <FinovaBrand />
          </div>

            {/* Form Content Wrapper */}
            <div className="max-w-md w-full mx-auto my-auto space-y-8 py-8">
            
            {/* Elegant 3-Step Horizontal Progress Tracker Bar */}
            <div className="flex items-center w-full justify-between select-none">

            {/* STEP 1 */}
            <div className="flex items-center space-x-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                step >= 1
                    ? 'bg-[#0F766E] text-white'
                    : 'border border-[#6B7280] text-[#111111]'
                }`}>
                1
                </div>

                <span className={`text-xs font-semibold transition-all duration-300 ${
                step >= 1 ? 'text-[#111111]' : 'text-[#6B7280]'
                }`}>
                Account
                </span>
            </div>

            <div className={`h-[2px] flex-grow mx-3 max-w-[40px] transition-all duration-300 ${
                step >= 2 ? 'bg-[#0F766E]' : 'bg-[#E5E7EB]'
            }`} />

            {/* STEP 2 */}
            <div className="flex items-center space-x-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                step >= 2
                    ? 'bg-[#0F766E] text-white'
                    : 'border border-[#6B7280] text-[#111111]'
                }`}>
                2
                </div>

                <span className={`text-xs font-semibold transition-all duration-300 ${
                step >= 2 ? 'text-[#111111]' : 'text-[#6B7280]'
                }`}>
                Identity
                </span>
            </div>

            <div className={`h-[2px] flex-grow mx-3 max-w-[40px] transition-all duration-300 ${
                step >= 3 ? 'bg-[#0F766E]' : 'bg-[#E5E7EB]'
            }`} />

            {/* STEP 3 */}
            <div className="flex items-center space-x-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                step >= 3
                    ? 'bg-[#0F766E] text-white'
                    : 'border border-[#6B7280] text-[#111111]'
                }`}>
                3
                </div>

                <span className={`text-xs font-semibold transition-all duration-300 ${
                step >= 3 ? 'text-[#111111]' : 'text-[#6B7280]'
                }`}>
                Security
                </span>
            </div>

            </div>

            {/* Context Heading Title */}
            <div className="space-y-2.5">
              <h2 className="text-3xl font-bold tracking-tight text-[#111111]">
                Create your account
              </h2>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Join Finova Bank and experience modern secure digital assets built for what's next.
              </p>
            </div>

            {/* Registration Form Stack */}
            <form onSubmit={handleRegister} className="space-y-5">
              
              {/* Full Name Field */}
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="text-xs font-semibold text-[#111111] tracking-wide">
                Full name <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  placeholder="Alex Morgan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-xl text-sm text-[#111111] placeholder-[#9CA3AF] transition duration-200 focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]"
                />
              </div>

              {/* Email Address Field */}
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="text-xs font-semibold text-[#111111] tracking-wide">
                Email address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="alex.morgan@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-xl text-sm text-[#111111] placeholder-[#9CA3AF] transition duration-200 focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]"
                />
              </div>

              {/* Phone Number Coupled Inputs */}
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="text-xs font-semibold text-[#111111] tracking-wide">
                Phone number 
                </label>
                <div className="flex shadow-none rounded-xl overflow-hidden border border-[#E5E7EB] focus-within:border-[#0F766E] focus-within:ring-1 focus-within:ring-[#0F766E] transition duration-200">
                  {/* Country Flag & Dropdown Code trigger select box */}
                  <div className="relative flex items-center bg-white border-r border-[#E5E7EB] px-3">
                    <span className="text-base mr-1.5 select-none">In</span>
                    <select 
                      value={countryCode} 
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="bg-transparent text-sm font-medium text-[#111111] focus:outline-none cursor-pointer pr-1 appearance-none"
                    >
                      <option value="+91">+91</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                    </select>
                    <span className="text-[10px] text-[#6B7280] pointer-events-none ml-0.5">▼</span>
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="(415) 123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-white text-sm text-[#111111] placeholder-[#9CA3AF] focus:outline-none"
                  />
                </div>
              </div>

              {/* Password Dynamic Input Matrix */}
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="text-xs font-semibold text-[#111111] tracking-wide">
                Password  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Create security password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-xl text-sm text-[#111111] placeholder-[#9CA3AF] transition duration-200 focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9CA3AF] hover:text-[#6B7280]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                {/* Visual Security Strength Level Matrix indicator blocks */}
                <div className="pt-1.5 space-y-1.5">
                  <div className="grid grid-cols-4 gap-1.5">
                    <div className="h-[3px] rounded-full bg-[#0F766E]" />
                    <div className="h-[3px] rounded-full bg-[#0F766E]" />
                    <div className="h-[3px] rounded-full bg-[#0F766E]" />
                    <div className="h-[3px] rounded-full bg-[#0F766E]" />
                  </div>
                  <p className="text-[11px] font-semibold text-[#0F766E]">Strong</p>
                </div>
              </div>

              {/* Compliance Terms Policy Agreement checkbox bar */}
              <div className="flex items-start space-x-2.5 pt-1">
                <input
                  id="agreeTerms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={() => setAgreeTerms(!agreeTerms)}
                  className="mt-0.5 w-4 h-4 text-[#0F766E] border-[#E5E7EB] rounded focus:ring-[#0F766E] cursor-pointer"
                />
                <label htmlFor="agreeTerms" className="text-xs text-[#6B7280] leading-tight select-none">
                  I agree to Finova's{' '}
                  <a href="#terms" className="text-[#0F766E] font-medium underline hover:text-[#0d665f]">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#privacy" className="text-[#0F766E] font-medium underline hover:text-[#0d665f]">Privacy Policy</a>.
                </label>
              </div>

                {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-xl">
                    {error}
                </div>
                )}

              {/* Execution Account Generation Trigger Button */}
              <button
                type="submit"
                disabled={!agreeTerms}
                className={`w-full py-3.5 font-semibold rounded-xl text-sm shadow-sm transition duration-200 transform active:scale-[0.99] mt-3 ${
                  agreeTerms 
                    ? 'bg-[#0F766E] text-white hover:bg-[#0d665f] cursor-pointer' 
                    : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
                }`}
              >
                Create account
              </button>
            </form>
          </div>

          {/* Quick Alternative Landing Router Footer Action link */}
          <p className="text-center text-sm text-[#6B7280] z-10">
            Already have an account?{' '}
            <a href="/" className="font-semibold text-[#0F766E] underline hover:text-[#0d665f] transition-all">
              Sign in
            </a>
          </p>
        </div>

        {/* ================= RIGHT PANEL: LUXURY VAULT SHOWCASE ================= */}
        <div className="lg:col-span-6 bg-[#FAF9F6] p-8 md:p-16 flex flex-col justify-between border-l border-[#E5E7EB] relative">
          
          {/* Universal Language Menu Dropdown Matrix Box */}
          <div className="flex justify-end relative z-20">
            <button 
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-[#E5E7EB] text-xs font-medium text-[#6B7280] shadow-sm hover:bg-gray-50 transition-colors"
            >
              <Globe size={14} className="text-[#9CA3AF]" />
              <span>{currentLang}</span>
              <span className="text-[9px] text-[#9CA3AF]">▼</span>
            </button>
            
            {showLangMenu && (
              <div className="absolute top-10 right-0 bg-white border border-[#E5E7EB] rounded-xl shadow-lg py-1 w-28 text-xs text-left z-30">
                {['English', 'Hindi', 'Marathi'].map((l) => (
                  <button 
                    key={l}
                    onClick={() => { setCurrentLang(l); setShowLangMenu(false); }}
                    className="w-full px-3 py-2 hover:bg-gray-50 text-[#111111] text-left"
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Central Spatial Luxury Asset Container (Vault Vector Render) */}
          <div className="flex flex-col items-center justify-center my-auto py-8">
            <div className="relative w-full max-w-[480px] aspect-[4/3] flex items-center justify-center rounded-2xl bg-gradient-to-b from-white/20 to-transparent p-4">
              {/* Replace the URL with your high-fidelity vault rendering or screenshot asset */}
              <img 
                src="/images/register.png" 
                alt="Finova Bank Secure Vault Ledger Node Representation" 
                className="w-full h-full object-contain rounded-2xl drop-shadow-[0_20px_40px_rgba(0,0,0,0.06)] mix-blend-darken"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* Institutional Compliance Enterprise Feature Information Column Cards */}
          <div className="max-w-md w-full mx-auto space-y-5">
            
            {/* Feature Row 1: Bank-grade Security */}
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white rounded-xl border border-[#E5E7EB] text-[#0F766E] shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex-shrink-0">
                <Shield size={20} />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-semibold text-[#111111]">Bank-grade security</h4>
                <p className="text-xs text-[#6B7280] leading-relaxed">Your digital assets are encrypted and monitored continuously by multi-signature safety ledgers.</p>
              </div>
            </div>

            {/* Feature Row 2: FDIC-insured Deposits */}
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white rounded-xl border border-[#E5E7EB] text-[#0F766E] shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex-shrink-0">
                <CheckCircle size={20} />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-semibold text-[#111111]">FDIC-insured deposits</h4>
                <p className="text-xs text-[#6B7280] leading-relaxed">Eligible capital balances are secured safely up to institutional sovereign benchmarks ($250,000).</p>
              </div>
            </div>

            {/* Feature Row 3: Designed For You */}
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white rounded-xl border border-[#E5E7EB] text-[#0F766E] shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex-shrink-0">
                <Grid size={20} />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-semibold text-[#111111]">Designed for you</h4>
                <p className="text-xs text-[#6B7280] leading-relaxed">Modern core automation tracking nodes, metrics, and expense layouts in one integrated interface.</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}