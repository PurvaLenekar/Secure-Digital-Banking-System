import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Lock, Users, Shield } from 'lucide-react';
import FinovaBrand from '../components/FinovaBrand';
import axios from "axios";

export default function OtpVerificationPage() {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [timeLeft, setTimeLeft] = useState(45); // Countdown matching 0:45 from template
  const inputRefs = useRef([]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Resend Countdown Timer Loop
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Handle Digit Entry & Auto Shift Focus
  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, ''); // Numeric inputs only
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); // Extract latest character
    setOtp(newOtp);

    // Contextually move cursor focus to right sibling matrix container node
    if (element.nextSibling && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle Backspace Shifting
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);

      // Move cursor focus to left sibling node container on clearing field
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleVerifySubmit = async (e) => {

    e.preventDefault();

    const otpCode = otp.join('');

    const email = localStorage.getItem("resetEmail");

    if (newPassword !== confirmPassword) {

        alert("Passwords do not match");

        return;
    }

    try {

        const response = await axios.post(
        "http://localhost:3000/api/auth/reset-password",
        {
            email,
            otp: otpCode,
            newPassword
        }
        );

        console.log(response.data);

        alert("Password reset successful");

        localStorage.removeItem("resetEmail");

        window.location.href = "/";

    } catch (error) {

        console.log(error);

        alert(
        error.response?.data?.message || "OTP Verification Failed"
        );
    }
    };

  const handleResendCode = () => {
    if (timeLeft > 0) return;
    // Dispatch new OTP request trigger here
    setTimeLeft(45);
    setOtp(new Array(6).fill(''));
    inputRefs.current[0].focus();
  };

  // Format Seconds to neat MM:SS layout structure
  const formatTime = (seconds) => {
    return `0:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="min-h-screen w-full bg-[#F9F9F6] text-[#111111] font-sans flex flex-col items-center justify-between antialiased relative overflow-hidden">
      
      {/* Decorative Branding Spatial Curve Line Elements matching image template lines */}
      <div className="absolute pointer-events-none border border-[#C8A96B]/10 rounded-full w-[800px] h-[800px] -left-96 -bottom-96" />
      <div className="absolute pointer-events-none border border-[#C8A96B]/10 rounded-full w-[600px] h-[600px] -right-64 -bottom-64" />

      {/* Top Application Layout Header */}
      <header className="w-full max-w-7xl mx-auto px-8 pt-6 flex justify-between items-center z-10 select-none">
        <FinovaBrand />
        <div className="flex items-center space-x-1.5 text-xs font-semibold tracking-wide text-[#6B7280]">
          <Shield size={14} className="text-[#0F766E]" />
          <span>Secure and encrypted</span>
        </div>
      </header>

      {/* Center Focused Main Verification Workspace Matrix Container */}
      <main className="w-full max-w-2xl mx-auto px-4 py-8 flex flex-1 items-center justify-center z-10">
        <div className="w-full bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.015)] border border-[#E5E7EB] p-10 md:p-14 text-center space-y-8">
          
          {/* Central High-End Identity Shield Smartphone Presentation Asset Graphic */}
          <div className="flex items-center justify-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* Background ambient scatter elements */}
              <div className="absolute inset-4 rounded-full bg-[#FAF9F6] border border-[#E5E7EB]/40 shadow-[inset_0_2px_8px_rgba(0,0,0,0.01)]" />
              
              {/* Phone Node Silhouette Core Layer */}
              <div className="w-14 h-28 border-2 border-[#111111]/80 rounded-[14px] bg-white relative z-10 shadow-sm flex flex-col items-center pt-1.5">
                {/* Speaker pill notch */}
                <div className="w-4 h-1 bg-[#111111]/80 rounded-full mb-5" />
                
                {/* Embedded Diamond Identity Status Shield Component Accent */}
                <div className="w-9 h-11 bg-[#0F766E] shadow-md shadow-emerald-950/20 flex items-center justify-center rounded-md relative z-20">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Dotted Abstract Grid Canvas Layout side context details */}
              <div className="absolute right-0 bottom-8 text-[#9CA3AF]/40 text-lg select-none tracking-widest font-mono opacity-60">
                ••••<br />••••
              </div>
            </div>
          </div>

          {/* Heading Module */}
          <div className="space-y-2 max-w-sm mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-[#111111]">
              Verify your identity
            </h2>
            <p className="text-sm text-[#6B7280]">
              We sent a 6-digit verification code to your registered mobile phone node.
            </p>
          </div>

          {/* 6-Digit Array Input Segment Form Element Workspace */}
          <form onSubmit={handleVerifySubmit} className="space-y-8 max-w-lg mx-auto">
            <div className="flex justify-center items-center gap-2.5 md:gap-3.5">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  ref={(el) => (inputRefs.current[index] = el)}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`w-12 h-14 md:w-14 md:h-16 text-center text-xl md:text-2xl font-semibold bg-white border rounded-xl transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-[#0F766E] ${
                    digit 
                      ? 'border-[#0F766E] text-[#111111] bg-[#FAF9F6]/30' 
                      : 'border-[#E5E7EB] text-[#111111]'
                  }`}
                />
              ))}
            </div>

            {/* Token Resend Prompt Banner Utility Block */}
            <div className="text-xs font-medium text-[#6B7280] select-none">
              Don't see the code?{' '}
              {timeLeft > 0 ? (
                <span className="text-[#C8A96B] font-semibold">
                  Resend in {formatTime(timeLeft)}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-[#0F766E] font-bold underline hover:text-[#0d665f] cursor-pointer transition-colors"
                >
                  Resend code
                </button>
              )}
            </div>


            <div className="space-y-4">

        {/* New Password */}
        <div className="space-y-2 text-left">
            <label className="text-xs font-semibold text-[#111111] tracking-wide">
            New Password
            </label>

            <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]"
            />
        </div>

        {/* Confirm Password */}
        <div className="space-y-2 text-left">
            <label className="text-xs font-semibold text-[#111111] tracking-wide">
            Confirm Password
            </label>

            <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]"
            />
        </div>

        </div>

            {/* Verification Execution CTA Trigger Button Node */}
            <button
              type="submit"
              disabled={otp.some(d => d === '')}
              className={`w-full py-3.5 font-semibold rounded-xl text-sm shadow-md transition duration-200 transform active:scale-[0.99] ${
                otp.every(d => d !== '')
                  ? 'bg-[#0F766E] text-white shadow-emerald-950/10 hover:bg-[#0d665f] cursor-pointer'
                  : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed shadow-none'
              }`}
            >
              Verify
            </button>
          </form>

        </div>
      </main>

      {/* Bottom Compliance Framework Security Feature Grid Row Matrix */}
      <section className="w-full max-w-4xl mx-auto px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#6B7280] font-medium border-t border-[#E5E7EB]/40 mt-auto select-none">
        <div className="flex items-center justify-center space-x-2">
          <ShieldCheck size={16} className="text-[#C8A96B] stroke-[2]" />
          <span>Bank-level security</span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <Lock size={15} className="text-[#C8A96B] stroke-[2]" />
          <span>Your data is protected</span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <Users size={16} className="text-[#C8A96B] stroke-[2]" />
          <span>Trusted by thousands</span>
        </div>
      </section>

      {/* Small Platform Copyright Legals Footnote */}
      <footer className="w-full text-center py-4 text-[10px] tracking-widest text-[#9CA3AF] uppercase font-medium select-none">
        © 2026 Finova Bank, Inc. All rights reserved.
      </footer>
    </div>
  );
}