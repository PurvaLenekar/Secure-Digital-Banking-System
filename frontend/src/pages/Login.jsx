import React, { useState } from 'react';
import { Eye, EyeOff, Check } from 'lucide-react';
import FinovaBrand, { FinovaIcon } from '../components/FinovaBrand';
import { useNavigate } from 'react-router-dom';
import axios from "axios";


export default function LoginPage() {
  const [currentLang, setCurrentLang] = useState('EN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const navigate = useNavigate();

    const handleSignIn = async (e) => {

        e.preventDefault();

        try {

            const response = await axios.post(
            "http://localhost:3000/api/auth/login",
            {
                email,
                password
            }
            );

            console.log(response.data);

            localStorage.setItem(
            "token",
            response.data.token
            );

            // 1. Build an extraction object matching what Header expects to parse
            const userPayload = {
              name: response.data.user?.name || email.split('@')[0], // Uses name from response, or strips the domain off the email as fallback
              email: response.data.user?.email || email,             // Falls back to form input if API response lacks it
              profileImage: response.data.user?.profileImage || ""
            };

            // 2. Save it directly to storage so Header can parse it immediately upon layout mount
            localStorage.setItem("user", JSON.stringify(userPayload));

            alert("Login Successful");
            navigate("/dashboard");

        } catch (error) {

            console.log(error);

            alert(
            error.response?.data?.message || "Login Failed"
            );
        }
    };

  return (
    <div className="min-h-screen w-full bg-[#F8F7F4] text-[#111111] font-sans flex flex-col items-center justify-between antialiased">
      
      {/* Top Navigation / Language Selector Header */}
      <header className="w-full max-w-7xl mx-auto px-8 pt-6 flex justify-end items-center">
        <div className="flex items-center space-x-4 text-xs font-medium tracking-wider text-[#6B7280]">
          {['EN', 'HI', 'MR'].map((lang) => (
            <button
              key={lang}
              onClick={() => setCurrentLang(lang)}
              className={`relative py-1 transition-colors duration-200 hover:text-[#111111] ${
                currentLang === lang ? 'text-[#111111] font-semibold' : ''
              }`}
            >
              {lang}
              {currentLang === lang && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C8A96B] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Main Container Card */}
      <main className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-1 items-center justify-center">
        <div className="w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-[#E5E7EB] overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[600px]">
          
          {/* Left Panel: Luxury Corporate Brand Showcase */}
         
            <div className="relative hidden md:flex items-center justify-center bg-[#FAF9F6] border-r border-[#E5E7EB] overflow-hidden">
            
            <img
                src="/images/login_page_img.png"
                alt="Fintech Illustration"
                className="w-full h-full object-cover"
            />

            {/* Optional dark overlay for better contrast (remove if not needed) */}
            <div className="absolute inset-0 bg-black/10"></div>

            </div>

          {/* Right Panel: Transaction-Grade Secure Form Matrix */}
          <div className="p-12 flex flex-col justify-center bg-white">
            <div className="max-w-sm w-full mx-auto space-y-8">
              
              {/* Context Header */}
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight text-[#111111]">
                  Welcome back
                </h2>
                <p className="text-sm text-[#6B7280]">
                  Sign in to your Finova Bank secure node
                </p>
              </div>

              {/* Input Interactive Form Stack */}
              <form onSubmit={handleSignIn} className="space-y-5">
                
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-medium text-[#111111] tracking-wide">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#111111] placeholder-[#9CA3AF] shadow-sm transition duration-200 focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-xs font-medium text-[#111111] tracking-wide">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#111111] placeholder-[#9CA3AF] shadow-sm transition duration-200 focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Inline Utilities Layer */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={rememberDevice}
                        onChange={() => setRememberDevice(!rememberDevice)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${
                        rememberDevice ? 'bg-[#0F766E] border-[#0F766E]' : 'border-[#E5E7EB] bg-white'
                      }`}>
                        {rememberDevice && <Check size={11} className="text-white stroke-[3]" />}
                      </div>
                    </div>
                    <span className="text-xs font-medium text-[#6B7280]">Remember device</span>
                  </label>
                  
                  <a href="forgetpasword" className="text-xs font-medium text-[#C8A96B] hover:underline transition-all">
                    Forgot password?
                  </a>
                </div>

                {/* Execution CTA Trigger */}
                <button
                  type="submit"
                  className="w-full py-3 bg-[#0F766E] text-white font-medium rounded-lg text-sm shadow-md shadow-emerald-950/10 hover:bg-[#0d665f] transition duration-200 transform active:scale-[0.99]"
                >
                  Sign in
                </button>
              </form>
              

              {/* Registration Alternative Route */}
              <p className="text-center text-xs text-[#6B7280]">
                Don't have an account?{' '}
                <a href="/register" className="font-semibold text-[#C8A96B] hover:underline transition-all">
                  Create account
                </a>
              </p>

            </div>
          </div>

        </div>
      </main>

      {/* Corporate Compliance System Footer */}
      <footer className="w-full max-w-7xl mx-auto px-8 py-4 flex flex-col sm:flex-row items-center justify-between text-[10px] tracking-wider text-[#9CA3AF] border-t border-[#E5E7EB]/40 mt-auto uppercase font-medium">
        <p>© 2026 Finova Bank. Protected with enterprise-grade JWT & Ledger Integrity.</p>
        <div className="flex space-x-6 mt-2 sm:mt-0">
          <a href="#privacy" className="hover:text-[#6B7280] transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-[#6B7280] transition-colors">Terms of Service</a>
          <a href="#security" className="hover:text-[#6B7280] transition-colors">Security Infrastructure</a>
        </div>
      </footer>
    </div>
  );
}