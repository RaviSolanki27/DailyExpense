"use client";

import React, { useState } from "react";
import { BusinessProfile } from "@/types";
import {
  Building2,
  Lock,
  KeyRound,
  Database,
  Moon,
  Sun,
  Smartphone,
  ShieldCheck,
  Check,
  Plus,
  Edit2,
  Terminal,
  ExternalLink,
} from "lucide-react";

interface SettingsTabProps {
  businesses: BusinessProfile[];
  currentBusiness: BusinessProfile | null;
  onSelectBusiness: (biz: BusinessProfile) => void;
  onOpenCreateBusiness: () => void;
  onEditBusiness: (biz: BusinessProfile) => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  dbStatus: "connected" | "fallback_mode";
  onLockApp: () => void;
}

export default function SettingsTab({
  businesses,
  currentBusiness,
  onSelectBusiness,
  onOpenCreateBusiness,
  onEditBusiness,
  darkMode,
  onToggleTheme,
  dbStatus,
  onLockApp,
}: SettingsTabProps) {
  // Passcode change state
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinMessage, setPinMessage] = useState<{ text: string; error: boolean } | null>(null);
  const [pinLoading, setPinLoading] = useState(false);

  const handleUpdatePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 4) {
      setPinMessage({ text: "New passcode must be exactly 4 digits", error: true });
      return;
    }
    if (newPin !== confirmPin) {
      setPinMessage({ text: "New passcode and confirmation do not match", error: true });
      return;
    }

    setPinLoading(true);
    setPinMessage(null);
    try {
      const res = await fetch("/api/auth/passcode", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPasscode: currentPin,
          newPasscode: newPin,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPinMessage({ text: "Passcode updated successfully in database!", error: false });
        setCurrentPin("");
        setNewPin("");
        setConfirmPin("");
      } else {
        setPinMessage({ text: data.error || "Failed to update passcode", error: true });
      }
    } catch {
      setPinMessage({ text: "Network error updating passcode", error: true });
    } finally {
      setPinLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-24 pt-3 space-y-5">
      {/* 1. Business Profiles Management */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-emerald-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Business Profiles ({businesses.length})
            </h3>
          </div>
          <button
            onClick={onOpenCreateBusiness}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Profile</span>
          </button>
        </div>

        <div className="space-y-2">
          {businesses.map((biz) => {
            const isActive = currentBusiness?.id === biz.id;
            return (
              <div
                key={biz.id}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                  isActive
                    ? "bg-slate-50 dark:bg-slate-800/60 border-emerald-500/40"
                    : "bg-white dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/80"
                }`}
              >
                <div
                  onClick={() => onSelectBusiness(biz)}
                  className="flex items-center space-x-3 cursor-pointer flex-1 truncate"
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs flex items-center justify-center text-slate-800 dark:text-slate-200">
                    {biz.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {biz.name}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate">
                      {biz.category || "General Business"} • {biz.currency}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 ml-2">
                  <button
                    onClick={() => onEditBusiness(biz)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 active-press"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {isActive ? (
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-500 text-[10px] font-bold">
                      Active
                    </span>
                  ) : (
                    <button
                      onClick={() => onSelectBusiness(biz)}
                      className="px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-slate-500"
                    >
                      Select
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Security & 4-Digit Passcode */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-emerald-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              App Security & Passcode
            </h3>
          </div>
          <button
            onClick={onLockApp}
            className="px-2.5 py-1 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 text-[11px] font-semibold flex items-center space-x-1 active-press"
          >
            <Lock className="w-3 h-3" />
            <span>Lock Now</span>
          </button>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 mb-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center space-x-1.5 font-bold text-slate-900 dark:text-white mb-1">
            <KeyRound className="w-3.5 h-3.5 text-emerald-500" />
            <span>Database Passcode Management</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            By default, the 4-digit passcode is <strong className="text-emerald-500">0000</strong>.
            You can modify it here or query/update directly in Neon PostgreSQL via:
          </p>
          <code className="block mt-1.5 p-2 rounded-xl bg-slate-900 text-slate-200 font-mono text-[10px] select-all overflow-x-auto">
            UPDATE &quot;AppConfig&quot; SET passcode = &apos;1234&apos; WHERE id = &apos;default&apos;;
          </code>
        </div>

        <form onSubmit={handleUpdatePin} className="space-y-2.5">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                Current PIN
              </label>
              <input
                type="password"
                maxLength={4}
                required
                placeholder="0000"
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ""))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-center text-slate-900 dark:text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                New PIN
              </label>
              <input
                type="password"
                maxLength={4}
                required
                placeholder="4 digits"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-center text-slate-900 dark:text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                Confirm PIN
              </label>
              <input
                type="password"
                maxLength={4}
                required
                placeholder="4 digits"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-center text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>

          {pinMessage && (
            <div
              className={`p-2 rounded-xl text-xs font-medium ${
                pinMessage.error
                  ? "bg-red-500/10 text-red-500 border border-red-500/20"
                  : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
              }`}
            >
              {pinMessage.text}
            </div>
          )}

          <button
            type="submit"
            disabled={pinLoading || newPin.length !== 4}
            className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-bold transition-all disabled:opacity-50"
          >
            {pinLoading ? "Updating..." : "Save New Passcode"}
          </button>
        </form>
      </div>

      {/* 3. Database & NeonDB Configuration */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center space-x-2 mb-3">
          <Database className="w-4 h-4 text-emerald-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            PostgreSQL / NeonDB Connection
          </h3>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
            <span className="text-slate-500">Database Status:</span>
            <div className="flex items-center space-x-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  dbStatus === "connected" ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
                }`}
              />
              <span className="font-bold">
                {dbStatus === "connected" ? "Connected (NeonDB)" : "Local Storage Mode"}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            To connect your live Neon database:
          </p>

          <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
            <li>
              Open <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">.env</code> in this project folder.
            </li>
            <li>
              Paste your NeonDB URL into <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">DATABASE_URL</code>
            </li>
            <li>
              Run command: <code className="font-mono text-emerald-500">npm run db:push</code>
            </li>
            <li>
              Seed initial businesses: <code className="font-mono text-emerald-500">npm run db:seed</code>
            </li>
          </ol>
        </div>
      </div>

      {/* 4. Appearance & PWA Installation */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {darkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span className="text-xs font-bold text-slate-900 dark:text-white">Dark / Light Mode</span>
          </div>
          <button
            onClick={onToggleTheme}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            {darkMode ? "Switch to Light" : "Switch to Dark"}
          </button>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Smartphone className="w-4 h-4 text-emerald-500" />
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">PWA Mobile App</span>
              <span className="text-[10px] text-slate-400">Installable on Android & iOS</span>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-lg">
            Ready to Install
          </span>
        </div>
      </div>

      {/* App Version Info */}
      <div className="text-center pt-2 pb-6 text-[10px] text-slate-400">
        Daily Business Expense & Khata • v1.0.0 PWA
      </div>
    </div>
  );
}
