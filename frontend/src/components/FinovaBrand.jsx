// // src/components/FinovaBrand.jsx
// import React from 'react';

// export function FinovaIcon({ className = "w-6 h-6" }) {
//   return (
//     <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <path d="M16 4L27 15L16 26L5 15L16 4Z" stroke="#0F766E" strokeWidth="2.5" strokeLinejoin="round" />
//       <path d="M16 4V26" stroke="#C8A96B" strokeWidth="1.5" strokeLinecap="round" />
//       <circle cx="16" cy="15" r="2" fill="#C8A96B" />
//     </svg>
//   );
// }

// export default function FinovaBrand() {
//   return (
//     <div className="flex items-center space-x-2.5 font-sans select-none">
//       <FinovaIcon className="w-6.5 h-6.5 flex-shrink-0" />
//       <h1 className="text-xs font-bold tracking-[0.26em] text-[#111111] uppercase leading-none">
//         FINOVA <span className="text-[#0F766E] font-medium tracking-[0.2em]">BANK</span>
//       </h1>
//     </div>
//   );
// }


// src/components/FinovaBrand.jsx
import React from 'react';

// Reusable Finova Architecture Icon - The Emerald Diamond with the Muted Gold Column
export function FinovaIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Diamond Structure (Ledger Safety) */}
      <path d="M16 4L27 15L16 26L5 15L16 4Z" stroke="#0F766E" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Central Column/Axis (Balanced Accounts) */}
      <path d="M16 4V26" stroke="#C8A96B" strokeWidth="1.5" strokeLinecap="round" />
      {/* Focal Core Point (Atomic Transaction Lock) */}
      <circle cx="16" cy="15" r="2" fill="#C8A96B" />
    </svg>
  );
}

// Global Brand Component - The Minimalist institutional identity
export default function FinovaBrand() {
  return (
    <div className="flex items-center space-x-2.5 font-sans select-none">
      <FinovaIcon className="w-6.5 h-6.5 flex-shrink-0" />
      <h1 className="text-xs font-bold tracking-[0.26em] text-[#111111] uppercase leading-none">
        FINOVA <span className="text-[#0F766E] font-medium tracking-[0.2em]">BANK</span>
      </h1>
    </div>
  );
}