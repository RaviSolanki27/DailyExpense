"use client";

import React, { useState, useEffect } from "react";
import { BusinessProfile, FrequentTag, PaymentMode, Transaction, TransactionType } from "@/types";
import { getLabels } from "@/lib/translations";
import CalculatorPad from "./CalculatorPad";
import confetti from "canvas-confetti";
import {
  TrendingUp,
  TrendingDown,
  Smartphone,
  Banknote,
  CreditCard,
  CheckCircle2,
  Plus,
  Trash2,
  Clock,
} from "lucide-react";

interface QuickAddTabProps {
  business: BusinessProfile;
  frequentTags: FrequentTag[];
  onRefreshData: () => void;
  onAddFrequentTag: (label: string) => void;
  showHindi: boolean;
}

export default function QuickAddTab({
  business,
  frequentTags,
  onRefreshData,
  onAddFrequentTag,
  showHindi,
}: QuickAddTabProps) {
  const labels = getLabels(showHindi);
  const [type, setType] = useState<TransactionType>("EXPENSE");
  const [amount, setAmount] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("CASH");
  const [note, setNote] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showNewTagInput, setShowNewTagInput] = useState<boolean>(false);
  const [newTagLabel, setNewTagLabel] = useState<string>("");
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  // Income quick source suggestions
  const incomeSuggestions = [
    "Customer Payment",
    "Counter Cash Sales",
    "UPI QR Scan",
    "Advance Received",
    "Service Bill",
    "Client Payout",
  ];

  // Fetch recent 5 transactions for active business
  const fetchRecent = async () => {
    try {
      const res = await fetch(`/api/transactions?businessId=${business.id}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setRecentTransactions(data.slice(0, 5));
      }
    } catch (e) {
      console.warn("Failed to fetch recent transactions:", e);
    }
  };

  useEffect(() => {
    fetchRecent();
  }, [business.id]);

  const handleSelectExpenseSuggestion = (label: string) => {
    setTitle(label);
  };

  const handleAddNewTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagLabel.trim()) {
      onAddFrequentTag(newTagLabel.trim());
      setTitle(newTagLabel.trim());
      setNewTagLabel("");
      setShowNewTagInput(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please enter or select a description/title");
      return;
    }
    if (amount <= 0) {
      alert("Please enter a valid amount greater than 0");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          type,
          amount,
          title: title.trim(),
          paymentMode,
          date,
          note: note.trim() || undefined,
        }),
      });

      if (res.ok) {
        // Trigger small confetti celebration
        try {
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.8 },
            colors: type === "INCOME" ? ["#10b981", "#34d399", "#059669"] : ["#ef4444", "#f87171", "#dc2626"],
          });
        } catch {}

        setSuccessBanner(
          `Added ${type === "INCOME" ? "Income" : "Expense"}: ${business.currency} ${amount.toLocaleString()}`
        );
        setTimeout(() => setSuccessBanner(null), 3000);

        // Reset form
        setTitle("");
        setAmount(0);
        setNote("");
        fetchRecent();
        onRefreshData();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save transaction");
      }
    } catch {
      alert("Failed to save transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    try {
      await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      fetchRecent();
      onRefreshData();
    } catch (e) {
      console.warn("Delete failed:", e);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-24 pt-3">
      {/* Success Banner */}
      {successBanner && (
        <div className="mb-3 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center space-x-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Segmented Mode Switcher: Income vs Expense */}
      <div className="p-1 rounded-2xl bg-slate-200 dark:bg-slate-900 border border-slate-300/60 dark:border-slate-800 grid grid-cols-2 gap-1 mb-4 shadow-sm">
        <button
          type="button"
          onClick={() => {
            setType("INCOME");
            setTitle("");
          }}
          className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all active-press ${
            type === "INCOME"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>{labels.incomeSub}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setType("EXPENSE");
            setTitle("");
          }}
          className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all active-press ${
            type === "EXPENSE"
              ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          <span>{labels.expenseSub}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Payment Mode Selector: Online / UPI vs Cash vs Other */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            {labels.paymentBreakdown}
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMode("ONLINE")}
              className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 border transition-all active-press ${
                paymentMode === "ONLINE"
                  ? "bg-sky-500/15 border-sky-500 text-sky-600 dark:text-sky-400 font-bold shadow-xs"
                  : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{labels.online}</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMode("CASH")}
              className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 border transition-all active-press ${
                paymentMode === "CASH"
                  ? "bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs"
                  : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              <Banknote className="w-3.5 h-3.5" />
              <span>{labels.cash}</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMode("OTHER")}
              className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 border transition-all active-press ${
                paymentMode === "OTHER"
                  ? "bg-purple-500/15 border-purple-500 text-purple-600 dark:text-purple-400 font-bold shadow-xs"
                  : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>{labels.other}</span>
            </button>
          </div>
        </div>

        {/* Expense Slider Suggestions OR Income Quick Suggestions */}
        {type === "EXPENSE" ? (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                <span>{labels.frequentExpenses}</span>
                <span className="text-[10px] text-slate-400 font-normal">{labels.tapToAutoFill}</span>
              </span>
              <button
                type="button"
                onClick={() => setShowNewTagInput(!showNewTagInput)}
                className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-0.5 font-medium"
              >
                <Plus className="w-3 h-3" />
                <span>Add Chip</span>
              </button>
            </div>

            {/* Quick Tag creation drawer */}
            {showNewTagInput && (
              <div className="p-2 mb-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="e.g. Vegetables, Diesel, Tea..."
                  value={newTagLabel}
                  onChange={(e) => setNewTagLabel(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddNewTag}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 active-press"
                >
                  Save
                </button>
              </div>
            )}

            {/* Horizontal Slider / Scroll of Suggestion Chips */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
              {frequentTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleSelectExpenseSuggestion(tag.label)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all active-press ${
                    title.toLowerCase() === tag.label.toLowerCase()
                      ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-700"
                  }`}
                >
                  {tag.label}
                </button>
              ))}
              {frequentTags.length === 0 && (
                <span className="text-xs text-slate-400 italic">No suggestion buttons yet</span>
              )}
            </div>
          </div>
        ) : (
          /* Income Quick Suggestions */
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Income Category / Source {labels.tapToAutoFill}
            </span>
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
              {incomeSuggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTitle(item)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all active-press ${
                    title.toLowerCase() === item.toLowerCase()
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Title / Description Input */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            {type === "INCOME" ? `Income Source / ${labels.description}` : labels.description}
          </label>
          <input
            type="text"
            required
            placeholder={
              type === "INCOME"
                ? "e.g. Sales Counter, Ramesh Bhai UPI, Advance"
                : "e.g. Vegetables, Diesel, Hardware, Labor..."
            }
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Inbuilt Calculator Pad for Amount */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            {labels.amount} ({business.currency})
          </label>
          <CalculatorPad
            currency={business.currency}
            value={amount}
            onChange={(val) => setAmount(val)}
          />
        </div>

        {/* Date & Note Row */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              {labels.date}
            </label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              {labels.notes}
            </label>
            <input
              type="text"
              placeholder="e.g. Bill #104, Vendor"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none"
            />
          </div>
        </div>

        {/* Big Submit Button */}
        <button
          type="submit"
          disabled={loading || amount <= 0}
          className={`w-full py-4 rounded-2xl font-bold text-sm text-white shadow-lg transition-all active-press flex items-center justify-center space-x-2 ${
            type === "INCOME"
              ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/30"
              : "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-rose-600/30"
          } ${loading || amount <= 0 ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {type === "INCOME" ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          <span>
            {loading
              ? "Saving..."
              : `${type === "INCOME" ? labels.saveIncome : labels.saveExpense} (${business.currency} ${amount.toLocaleString()})`}
          </span>
        </button>
      </form>

      {/* Recent Activity List */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{labels.recentEntries} ({business.name})</span>
          </div>
          <span className="text-[10px] text-slate-400">Last 5</span>
        </div>

        <div className="space-y-2">
          {recentTransactions.map((tx) => {
            const isIncome = tx.type === "INCOME";
            return (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-xs"
              >
                <div className="flex items-center space-x-3 truncate">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isIncome
                        ? "bg-emerald-500/15 text-emerald-500"
                        : "bg-rose-500/15 text-rose-500"
                    }`}
                  >
                    {isIncome ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {tx.title}
                    </span>
                    <div className="flex items-center space-x-1.5 text-[10px] text-slate-400">
                      <span>{new Date(tx.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="uppercase font-semibold">{tx.paymentMode}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`text-xs font-extrabold font-mono ${
                      isIncome ? "text-emerald-500" : "text-rose-500"
                    }`}
                  >
                    {isIncome ? "+" : "-"}
                    {business.currency} {tx.amount.toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleDeleteRecent(tx.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-red-400 active-press"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {recentTransactions.length === 0 && (
            <div className="text-center py-6 text-xs text-slate-400">
              No transactions recorded yet for {business.name}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
