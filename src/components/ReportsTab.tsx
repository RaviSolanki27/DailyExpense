"use client";

import React, { useState, useEffect } from "react";
import { BusinessProfile, BusinessStats, PaymentMode, Transaction } from "@/types";
import { getLabels } from "@/lib/translations";
import { ReportsSkeleton } from "./Skeletons";
import {
  Download,
  Calendar,
  Search,
  TrendingUp,
  TrendingDown,
  Smartphone,
  Banknote,
  Trash2,
} from "lucide-react";

interface ReportsTabProps {
  business: BusinessProfile;
  showHindi: boolean;
}

export default function ReportsTab({ business, showHindi }: ReportsTabProps) {
  const labels = getLabels(showHindi);
  const [period, setPeriod] = useState<"today" | "week" | "month" | "year" | "all">("month");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");
  const [modeFilter, setModeFilter] = useState<"ALL" | PaymentMode>("ALL");
  const [search, setSearch] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<BusinessStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const statsRes = await fetch(`/api/stats?businessId=${business.id}&period=${period}`);
      const statsData = await statsRes.json();
      setStats(statsData);

      let url = `/api/transactions?businessId=${business.id}&period=${period}`;
      if (typeFilter !== "ALL") url += `&type=${typeFilter}`;
      if (modeFilter !== "ALL") url += `&paymentMode=${modeFilter}`;
      if (search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;

      const txRes = await fetch(url);
      const txData = await txRes.json();
      if (Array.isArray(txData)) {
        setTransactions(txData);
      }
    } catch (e) {
      console.warn("Failed to fetch reports:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [business.id, period, typeFilter, modeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this transaction?")) return;
    try {
      await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      fetchData();
    } catch (e) {
      console.warn("Delete failed:", e);
    }
  };

  const exportToCSV = () => {
    if (transactions.length === 0) {
      alert("No transactions to export");
      return;
    }
    const headers = ["Date", "Type", "Title", "Amount", "Payment Mode", "Note"];
    const rows = transactions.map((t) => [
      new Date(t.date).toLocaleDateString(),
      t.type,
      `"${t.title.replace(/"/g, '""')}"`,
      t.amount,
      t.paymentMode,
      `"${(t.note || "").replace(/"/g, '""')}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${business.name.replace(/\s+/g, "_")}_${period}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Group transactions by date string
  const groupedTransactions: Record<string, Transaction[]> = {};
  for (const t of transactions) {
    const dateStr = new Date(t.date).toLocaleDateString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    if (!groupedTransactions[dateStr]) groupedTransactions[dateStr] = [];
    groupedTransactions[dateStr].push(t);
  }

  const currentTotalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);
  const currentTotalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);
  const netProfit = currentTotalIncome - currentTotalExpense;

  if (loading && transactions.length === 0) {
    return <ReportsSkeleton />;
  }

  return (
    <div className="max-w-md mx-auto px-4 pb-24 pt-3">
      {/* Period Filter Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 no-scrollbar">
        {[
          { id: "today", label: labels.today },
          { id: "week", label: labels.thisWeek },
          { id: "month", label: labels.thisMonth },
          { id: "year", label: labels.thisYear },
          { id: "all", label: labels.allTime },
        ].map((p) => (
          <button
            key={p.id}
            onClick={() => setPeriod(p.id as any)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all active-press ${
              period === p.id
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-3 gap-2 mt-2 mb-4">
        {/* Income Card */}
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col justify-between">
          <div className="flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            <span>{labels.income}</span>
          </div>
          <div className="mt-1 font-mono font-extrabold text-sm text-emerald-600 dark:text-emerald-400 truncate">
            {business.currency} {currentTotalIncome.toLocaleString()}
          </div>
        </div>

        {/* Expense Card */}
        <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex flex-col justify-between">
          <div className="flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            <TrendingDown className="w-3 h-3" />
            <span>{labels.expense}</span>
          </div>
          <div className="mt-1 font-mono font-extrabold text-sm text-rose-600 dark:text-rose-400 truncate">
            {business.currency} {currentTotalExpense.toLocaleString()}
          </div>
        </div>

        {/* Net Profit Card */}
        <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {labels.netProfit}
          </span>
          <div
            className={`mt-1 font-mono font-extrabold text-sm truncate ${
              netProfit >= 0 ? "text-emerald-500" : "text-rose-500"
            }`}
          >
            {netProfit >= 0 ? "+" : ""}
            {business.currency} {netProfit.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Payment Modes Split Bar */}
      {stats && (
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 mb-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {labels.paymentBreakdown}
            </span>
            <span className="text-[10px] text-slate-400">Cash vs UPI</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20">
              <div className="flex items-center justify-between text-sky-600 dark:text-sky-400 font-semibold text-[11px]">
                <span className="flex items-center space-x-1">
                  <Smartphone className="w-3 h-3" />
                  <span>{labels.online}</span>
                </span>
                <span className="font-mono">
                  {business.currency}{" "}
                  {(stats.breakdown.income.online + stats.breakdown.expense.online).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                <span className="flex items-center space-x-1">
                  <Banknote className="w-3 h-3" />
                  <span>{labels.cash}</span>
                </span>
                <span className="font-mono">
                  {business.currency}{" "}
                  {(stats.breakdown.income.cash + stats.breakdown.expense.cash).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2">
          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none font-semibold"
          >
            <option value="ALL">{labels.allTypes}</option>
            <option value="INCOME">{labels.income}</option>
            <option value="EXPENSE">{labels.expense}</option>
          </select>

          {/* Mode filter */}
          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value as any)}
            className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none font-semibold"
          >
            <option value="ALL">All Modes</option>
            <option value="ONLINE">{labels.online}</option>
            <option value="CASH">{labels.cash}</option>
            <option value="OTHER">{labels.other}</option>
          </select>

          {/* Export CSV button */}
          <button
            onClick={exportToCSV}
            title="Export CSV"
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-500 active-press"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title or note..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-emerald-500"
          />
        </form>
      </div>

      {/* Transaction Feed Grouped by Date */}
      <div className="space-y-4">
        {Object.entries(groupedTransactions).map(([dateStr, items]) => {
          const dayIncome = items
            .filter((i) => i.type === "INCOME")
            .reduce((s, i) => s + i.amount, 0);
          const dayExpense = items
            .filter((i) => i.type === "EXPENSE")
            .reduce((s, i) => s + i.amount, 0);

          return (
            <div key={dateStr} className="space-y-2">
              <div className="flex items-center justify-between px-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <span>{dateStr}</span>
                <div className="flex items-center space-x-2 font-mono text-[10px]">
                  {dayIncome > 0 && <span className="text-emerald-500">+{business.currency}{dayIncome.toLocaleString()}</span>}
                  {dayExpense > 0 && <span className="text-rose-500">-{business.currency}{dayExpense.toLocaleString()}</span>}
                </div>
              </div>

              <div className="space-y-1.5">
                {items.map((tx) => {
                  const isIncome = tx.type === "INCOME";
                  return (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
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
                            <span className="uppercase font-semibold text-slate-500 dark:text-slate-400">
                              {tx.paymentMode}
                            </span>
                            {tx.note && (
                              <>
                                <span>•</span>
                                <span className="truncate italic">{tx.note}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <span
                          className={`text-xs font-extrabold font-mono ${
                            isIncome ? "text-emerald-500" : "text-rose-500"
                          }`}
                        >
                          {isIncome ? "+" : "-"}
                          {business.currency} {tx.amount.toLocaleString()}
                        </span>
                        <button
                          onClick={() => handleDelete(tx.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-red-400 active-press"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {transactions.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mx-auto mb-2 text-slate-400">
              <Calendar className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              No transactions found
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Try switching filters or recording a new expense/income
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
