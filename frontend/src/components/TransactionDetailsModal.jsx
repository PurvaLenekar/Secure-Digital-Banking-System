import React from 'react';
import {
  X,
  Copy,
  ArrowRight,
  Download,
  Flag,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

export default function TransactionDetailsModal({
  isOpen,
  onClose,
  transaction
}) {

  if (!isOpen || !transaction) return null;

  // =========================
  // DYNAMIC VALUES FROM BACKEND
  // =========================

  const transactionId =
    transaction._id || transaction.id || "N/A";

  const amount =
    transaction.amount || 0;

  const status =
    transaction.status || "COMPLETED";

  const transactionType =
    transaction.type || "Outgoing";

  const merchant =
    transaction.merchant ||
    transaction.toAccount?.user?.name ||
    "Unknown Merchant";

  const description =
    transaction.desc ||
    transaction.note ||
    "Transaction Payment";

  const category =
    transaction.category || "Transfer";

  const transactionDate = transaction.createdAt
    ? new Date(transaction.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      })
    : transaction.date || "N/A";

  const transactionTime = transaction.createdAt
    ? new Date(transaction.createdAt).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit"
      })
    : transaction.time || "N/A";

  const fromUser =
    transaction.fromAccount?.user?.name ||
    "Sender Account";

  const toUser =
    transaction.toAccount?.user?.name ||
    merchant;

  const fromAccountNumber =
    transaction.fromAccount?.accountNumber ||
    "XXXX";

  const toAccountNumber =
    transaction.toAccount?.accountNumber ||
    "XXXX";

  const bankName =
    transaction.toAccount?.bankName ||
    "Bank Account";

  const logo =
    transaction.logo ||
    null;

  // =========================
  // INR FORMATTER
  // =========================

  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);

  // =========================
  // COPY TRANSACTION ID
  // =========================

  const handleCopyId = () => {
    navigator.clipboard.writeText(transactionId);
    alert("Transaction ID copied!");
  };

  // =========================
  // STATUS STYLES
  // =========================

  const getStatusStyles = (status) => {

    switch (status?.toUpperCase()) {

      case 'COMPLETED':
        return {
          badge:
            'bg-emerald-50 text-emerald-700 border-emerald-100',
          dot:
            'bg-emerald-500'
        };

      case 'PENDING':
        return {
          badge:
            'bg-amber-50 text-amber-700 border-amber-100',
          dot:
            'bg-amber-500'
        };

      case 'FAILED':
      case 'REVERSED':
        return {
          badge:
            'bg-rose-50 text-rose-700 border-rose-100',
          dot:
            'bg-rose-500'
        };

      default:
        return {
          badge:
            'bg-gray-50 text-gray-700 border-gray-100',
          dot:
            'bg-gray-500'
        };
    }
  };

  const statusStyle = getStatusStyles(status);

  return (

    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm overflow-y-auto p-4 sm:p-6 md:py-12">

      {/* OVERLAY */}
      <div
        className="fixed inset-0"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative z-10 bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">

          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Transaction Details
          </span>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors"
          >
            <X size={18} />
          </button>

        </div>

        {/* TOP INFO */}
        <div className="p-8 text-center flex flex-col items-center border-b border-gray-50">

          {logo ? (
            <img
              src={logo}
              alt=""
              className="w-16 h-16 rounded-2xl object-contain bg-gray-50 p-2 border border-gray-100 mb-3"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-100 border border-gray-200 rounded-2xl flex items-center justify-center font-bold text-lg text-gray-600 mb-3">
              {merchant.substring(0, 2).toUpperCase()}
            </div>
          )}

          <h2 className="text-lg font-bold text-[#111111]">
            {merchant}
          </h2>

          <p className="text-xs text-gray-400 mt-0.5">
            {description}
          </p>

          <div className="text-3xl font-extrabold font-mono text-[#111111] mt-4">

            {transactionType === "Incoming" ? "+" : "-"}

            {formattedAmount}

          </div>

          {/* STATUS */}
          <div className="mt-3">

            <span
              className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${statusStyle.badge}`}
            >

              <span
                className={`w-1.5 h-1.5 rounded-full animate-pulse ${statusStyle.dot}`}
              />

              <span>{status}</span>

            </span>

          </div>

        </div>

        {/* TRANSACTION ID */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-xs">

          <span className="font-semibold text-gray-400 uppercase tracking-wider">
            Transaction ID
          </span>

          <div className="flex items-center space-x-2">

            <span className="font-mono text-gray-700">
              {transactionId}
            </span>

            <button
              onClick={handleCopyId}
              className="text-gray-400 hover:text-gray-700"
            >
              <Copy size={12} />
            </button>

          </div>

        </div>

        {/* TIMELINE */}
        <div className="p-6 border-b border-gray-100">

          <div className="flex items-center justify-between">

            <div className="flex flex-col items-center">
              <CheckCircle2
                size={28}
                className="text-emerald-600"
              />
              <span className="text-[10px] font-bold mt-2">
                Initiated
              </span>
            </div>

            <div className="flex-1 h-0.5 bg-emerald-500 mx-2" />

            <div className="flex flex-col items-center">
              <CheckCircle2
                size={28}
                className="text-emerald-600"
              />
              <span className="text-[10px] font-bold mt-2">
                Processing
              </span>
            </div>

            <div className="flex-1 h-0.5 bg-emerald-500 mx-2" />

            <div className="flex flex-col items-center">
              <CheckCircle2
                size={28}
                className={
                  status === "FAILED"
                    ? "text-rose-600"
                    : "text-emerald-600"
                }
              />

              <span className="text-[10px] font-bold mt-2">
                {status}
              </span>
            </div>

          </div>

        </div>

        {/* FROM TO */}
        <div className="p-6 border-b border-gray-100 grid grid-cols-1 md:grid-cols-7 gap-4 items-center">

          {/* FROM */}
          <div className="md:col-span-3 bg-gray-50 rounded-xl p-4">

            <div className="text-[10px] text-gray-400 uppercase font-bold">
              From
            </div>

            <div className="font-bold text-[#111111] mt-1">
              {fromUser}
            </div>

            <div className="text-[11px] text-gray-500 mt-1">
              •••• {fromAccountNumber}
            </div>

          </div>

          {/* ARROW */}
          <div className="md:col-span-1 flex justify-center">

            <ArrowRight
              size={18}
              className="text-gray-400"
            />

          </div>

          {/* TO */}
          <div className="md:col-span-3 bg-gray-50 rounded-xl p-4">

            <div className="text-[10px] text-gray-400 uppercase font-bold">
              To
            </div>

            <div className="font-bold text-[#111111] mt-1">
              {toUser}
            </div>

            <div className="text-[11px] text-gray-500 mt-1">
              {bankName} •••• {toAccountNumber}
            </div>

          </div>

        </div>

        {/* DETAILS */}
        <div className="divide-y divide-gray-50 px-6">

          <div className="py-4 flex justify-between text-xs">

            <span className="text-gray-400">
              Category
            </span>

            <span className="font-semibold">
              {category}
            </span>

          </div>

          <div className="py-4 flex justify-between text-xs">

            <span className="text-gray-400">
              Date & Time
            </span>

            <span className="font-semibold">
              {transactionDate} • {transactionTime}
            </span>

          </div>

          <div className="py-4 flex justify-between text-xs">

            <span className="text-gray-400">
              Note
            </span>

            <span className="font-semibold">
              {transaction.note || "No note added"}
            </span>

          </div>

          <div className="py-4 flex justify-between text-xs">

            <span className="text-gray-400">
              Transaction Fee
            </span>

            <span className="font-semibold">
              ₹0
            </span>

          </div>

        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">

          <div className="flex items-center gap-2 w-full sm:w-auto">

            <button className="flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50 flex items-center justify-center gap-2">
              <Download size={14} />
              <span>Download Receipt</span>
            </button>

            <button className="flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center gap-2">
              <Flag size={14} />
              <span>Report</span>
            </button>

          </div>

          <button className="w-full sm:w-auto px-5 py-2 bg-[#0F766E] hover:bg-[#0d665f] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2">

            <RefreshCw size={14} />

            <span>Repeat Transfer</span>

          </button>

        </div>

      </div>

    </div>
  );
}