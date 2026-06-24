import React, { useState } from 'react';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';
import FinovaBrand from '../components/FinovaBrand';
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleResetSubmit = async (e) => {

    e.preventDefault();

    try {

        const response = await axios.post(
        "http://localhost:3000/api/auth/forgot-password",
        {
            email
        }
        );

        console.log(response.data);

        alert("OTP sent to your email");

        localStorage.setItem("resetEmail", email);

        window.location.href = "/otpverification";

    } catch (error) {

        console.log(error);

        alert(
        error.response?.data?.message || "Failed to send OTP"
        );
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8F7F4] text-[#111111] font-sans flex flex-col items-center justify-between antialiased">
      
      {/* Top Application Header Platform Control Matrix */}
      <header className="w-full max-w-7xl mx-auto px-8 pt-6 flex justify-between items-center select-none">
        <FinovaBrand />
        <div className="flex items-center space-x-1.5 text-xs font-medium text-[#6B7280]">
          <span>Need help?</span>
          <a href="#support" className="text-[#0F766E] hover:underline transition-all flex items-center">
            Contact support <span className="ml-0.5 text-[10px]">&gt;</span>
          </a>
        </div>
      </header>

      {/* Main Focus Node Workspace Area Container */}
      <main className="w-full max-w-xl mx-auto px-4 py-8 flex flex-1 items-center justify-center">
        <div className="w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.015)] border border-[#E5E7EB] p-10 md:p-14 text-center space-y-8 relative overflow-hidden">
          
          {/* Top Asset Graphic Showcase: Lock & Paper Plane Node Block */}
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* Soft Ambient Background Ring Layout */}
              <div className="absolute inset-2 border border-[#E5E7EB]/40 rounded-full bg-[#FAF9F6] shadow-[inset_0_2px_6px_rgba(0,0,0,0.01)]" />
              
              {/* Elegant Modern SVG Padlock Vector Render Layer */}
              <svg className="w-16 h-16 text-[#111111] relative z-10 drop-shadow-sm" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="14" y="26" width="36" height="28" rx="6" stroke="currentColor" strokeWidth="2.5" fill="white" />
                <path d="M22 26V18C22 13 25.5 9 32 9C38.5 9 42 13 42 18V26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="32" cy="38" r="3" fill="currentColor" />
                <path d="M32 41V46" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>

              {/* Dynamic Action Floating Badge Trigger Ring (Paper Plane Token Alert) */}
              <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-[#C8A96B] border-2 border-white shadow-sm flex items-center justify-center text-white z-20">
                <svg className="w-3.5 h-3.5 transform translate-x-[-0.5px] translate-y-[0.5px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Text Context Headings */}
          <div className="space-y-2.5 max-w-sm mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111111]">
              Reset your password
            </h2>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              Enter your email and we'll send you a secure validation link to reset your account password credentials.
            </p>
          </div>

          {/* Form Processing Matrix Input Element */}
          <form onSubmit={handleResetSubmit} className="space-y-5 max-w-sm mx-auto text-left">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-[#111111] tracking-wide">
                Email address
              </label>
              <div className="relative rounded-xl border border-[#E5E7EB] focus-within:border-[#0F766E] focus-within:ring-1 focus-within:ring-[#0F766E] transition duration-200 shadow-sm overflow-hidden bg-white">
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 text-sm text-[#111111] placeholder-[#9CA3AF] bg-transparent focus:outline-none pr-10"
                />
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#9CA3AF]">
                  <Mail size={16} className="stroke-[2.2]" />
                </div>
              </div>
            </div>

            {/* CTA Execution Button Node */}
            <button
              type="submit"
              className="w-full py-3 bg-[#0F766E] text-white font-semibold rounded-xl text-sm shadow-md shadow-emerald-950/5 hover:bg-[#0d665f] transition duration-200 transform active:scale-[0.99] text-center block"
            >
              Send reset link
            </button>
          </form>

          {/* Alternative Navigation Split Line Routing */}
          <div className="max-w-sm mx-auto space-y-4 pt-1">
            <div className="relative flex items-center text-xs font-medium text-[#9CA3AF] uppercase">
              <div className="flex-grow border-t border-[#E5E7EB]"></div>
              <span className="flex-shrink mx-3 text-[10px] tracking-widest font-bold">Or</span>
              <div className="flex-grow border-t border-[#E5E7EB]"></div>
            </div>

            <div className="flex justify-center">
              <a 
                href="/" 
                className="flex items-center space-x-2 text-sm font-semibold text-[#0F766E] hover:text-[#0d665f] transition-colors group select-none"
              >
                <ArrowLeft size={16} className="transform group-hover:-translate-x-0.5 transition-transform stroke-[2.5]" />
                <span>Back to sign in</span>
              </a>
            </div>
          </div>

        </div>
      </main>

      {/* Corporate Compliance System System-Wide Platform Footer */}
      <footer className="w-full max-w-7xl mx-auto px-8 py-5 flex flex-col sm:flex-row items-center justify-between text-[10px] tracking-widest text-[#9CA3AF] border-t border-[#E5E7EB]/40 mt-auto uppercase font-medium">
        <p>© 2026 Finova Bank, Inc. Protected with enterprise-grade JWT Encryption.</p>
        <div className="flex space-x-6 mt-2 sm:mt-0">
          <a href="#privacy" className="hover:text-[#6B7280] transition-colors">Privacy</a>
          <a href="#security" className="hover:text-[#6B7280] transition-colors">Security</a>
          <a href="#terms" className="hover:text-[#6B7280] transition-colors">Terms</a>
          <a href="#status" className="hover:text-[#6B7280] transition-colors flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 inline-block animate-pulse" /> Status
          </a>
        </div>
      </footer>
    </div>
  );
}