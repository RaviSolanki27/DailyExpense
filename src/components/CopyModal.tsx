"use client";

import React, { useState, useEffect } from "react";
import { BusinessProfile } from "@/types";
import {
  generateWhatsAppDailySummary,
  copyTextToClipboard,
  openWhatsAppShare,
  SummaryData,
} from "@/lib/whatsapp-formatter";
import {
  X,
  Copy,
  Check,
  Send,
  Calendar,
  Layers,
  Sparkles,
  Loader2,
  CheckSquare,
  Square,
} from "lucide-react";

interface CopyModalProps {
  isOpen: boolean;
  onClose: () => void;
  businesses: BusinessProfile[];
  currentBusiness: BusinessProfile | null;
  showHindi: boolean;
}

export default function CopyModal({
  isOpen,
  onClose,
  businesses,
  currentBusiness,
  showHindi,
}: CopyModalProps) {
  // State for Scope: "all" or specific businessId
  const [selectedScope, setSelectedScope] = useState<string>("all");

  // State for Date: "today", "yesterday", or "custom"
  const [dateMode, setDateMode] = useState<"today" | "yesterday" | "custom">("today");
  const [customDate, setCustomDate] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  });

  // State for Section inclusions
  const [includeTransactions, setIncludeTransactions] = useState<boolean>(true);
  const [includeKhata, setIncludeKhata] = useState<boolean>(true);

  // Data fetching state
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Compute effective date string
  const getEffectiveDate = (): string => {
    const now = new Date();
    if (dateMode === "today") {
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    }
    if (dateMode === "yesterday") {
      const y = new Date(now.getTime() - 86400000);
      return `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, "0")}-${String(y.getDate()).padStart(2, "0")}`;
    }
    return customDate;
  };

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const dateStr = getEffectiveDate();
      const res = await fetch(`/api/summary?businessId=${selectedScope}&date=${dateStr}`);
      if (res.ok) {
        const data = await res.json();
        setSummaryData(data);
      }
    } catch (e) {
      console.error("Failed to load summary:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSummary();
      setCopied(false);
    }
  }, [isOpen, selectedScope, dateMode, customDate]);

  if (!isOpen) return null;

  // Generate preview text
  const formattedText = summaryData
    ? generateWhatsAppDailySummary(summaryData, {
        includeTransactions,
        includeKhata,
        showHindi,
        isSingleBusiness: selectedScope !== "all",
      })
    : "";

  const handleCopy = async () => {
    if (!formattedText) return;
    const ok = await copyTextToClipboard(formattedText);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleSendWhatsApp = () => {
    if (!formattedText) return;
    openWhatsAppShare(formattedText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                <span>Copy & Share Daily Hisab</span>
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {showHindi ? "व्हाट्सएप पर भेजने हेतु पूरा हिसाब कॉपी करें" : "Formatted WhatsApp daily breakdown"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 text-xs">
          {/* Scope Selector */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5 mb-2">
              <Layers className="w-3.5 h-3.5 text-emerald-500" />
              <span>{showHindi ? "खाता चुनें (Scope)" : "Select Account Scope"}</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedScope("all")}
                className={`py-2 px-3 rounded-xl border text-center font-semibold transition-all active-press ${
                  selectedScope === "all"
                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-xs"
                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                }`}
              >
                <span>🏢 All Accounts ({businesses.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedScope(currentBusiness?.id || "all")}
                className={`py-2 px-3 rounded-xl border text-center font-semibold truncate transition-all active-press ${
                  selectedScope !== "all"
                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-xs"
                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                }`}
              >
                <span className="truncate">{currentBusiness?.name || "Current Account"}</span>
              </button>
            </div>
          </div>

          {/* Date Selector */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5 mb-2">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>{showHindi ? "तारीख चुनें (Date)" : "Select Date"}</span>
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setDateMode("today")}
                className={`flex-1 py-1.5 px-3 rounded-xl border text-center font-semibold transition-all ${
                  dateMode === "today"
                    ? "bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400"
                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                }`}
              >
                {showHindi ? "आज (Today)" : "Today"}
              </button>

              <button
                type="button"
                onClick={() => setDateMode("yesterday")}
                className={`flex-1 py-1.5 px-3 rounded-xl border text-center font-semibold transition-all ${
                  dateMode === "yesterday"
                    ? "bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400"
                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                }`}
              >
                {showHindi ? "कल (Yesterday)" : "Yesterday"}
              </button>

              <button
                type="button"
                onClick={() => setDateMode("custom")}
                className={`flex-1 py-1.5 px-3 rounded-xl border text-center font-semibold transition-all ${
                  dateMode === "custom"
                    ? "bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400"
                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                }`}
              >
                {showHindi ? "अन्य तारीख" : "Custom"}
              </button>
            </div>

            {dateMode === "custom" && (
              <div className="mt-2">
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold outline-none focus:border-blue-500"
                />
              </div>
            )}
          </div>

          {/* Section Inclusion Checkboxes */}
          <div className="flex items-center space-x-3 pt-1">
            <button
              type="button"
              onClick={() => setIncludeTransactions(!includeTransactions)}
              className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
            >
              {includeTransactions ? (
                <CheckSquare className="w-4 h-4 text-emerald-500" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>{showHindi ? "आमदनी व खर्च (Income/Expense)" : "Income & Expenses"}</span>
            </button>

            <button
              type="button"
              onClick={() => setIncludeKhata(!includeKhata)}
              className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
            >
              {includeKhata ? (
                <CheckSquare className="w-4 h-4 text-emerald-500" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>{showHindi ? "खाता लेना व देना (Khata)" : "Khata Lena / Dena"}</span>
            </button>
          </div>

          {/* WhatsApp Preview Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <span>Preview for WhatsApp:</span>
              {loading && (
                <span className="flex items-center space-x-1 text-emerald-500">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Updating...</span>
                </span>
              )}
            </div>

            <div className="relative rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/90 p-3 max-h-52 overflow-y-auto font-mono text-[11px] leading-relaxed text-slate-800 dark:text-slate-200 select-all whitespace-pre-wrap">
              {loading ? (
                <div className="py-8 flex flex-col items-center justify-center space-y-2 text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                  <span>Loading account details...</span>
                </div>
              ) : formattedText ? (
                formattedText
              ) : (
                <span className="text-slate-400 italic">No data found for this selection</span>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/50 flex flex-col gap-2">
          {copied && (
            <div className="w-full py-1.5 px-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold text-center flex items-center justify-center space-x-1.5 animate-in fade-in duration-150">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>Copied to clipboard! Ready to paste in WhatsApp ✓</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopy}
              disabled={loading || !formattedText}
              className={`py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 transition-all active-press ${
                copied
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                  : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 shadow-sm"
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Copied! (कॉपी हो गया)" : "Copy Text (कॉपी करें)"}</span>
            </button>

            <button
              onClick={handleSendWhatsApp}
              disabled={loading || !formattedText}
              className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/20 transition-all active-press"
            >
              <Send className="w-4 h-4" />
              <span>WhatsApp पर भेजें</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
