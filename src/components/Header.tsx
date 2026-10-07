"use client";

import React, { useState } from "react";
import { BusinessProfile } from "@/types";
import { getLabels } from "@/lib/translations";
import {
  ChevronDown,
  Moon,
  Sun,
  Lock,
  Plus,
  Check,
  Database,
  Layers,
} from "lucide-react";

interface HeaderProps {
  businesses: BusinessProfile[];
  currentBusiness: BusinessProfile | null;
  onSelectBusiness: (business: BusinessProfile) => void;
  onOpenNewBusinessModal: () => void;
  onLockApp: () => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  dbStatus: "connected" | "fallback_mode";
  showHindi: boolean;
}

const colorBadgeStyles: Record<string, string> = {
  emerald: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  amber: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  rose: "bg-rose-500/15 text-rose-500 border-rose-500/30",
  blue: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  violet: "bg-violet-500/15 text-violet-500 border-violet-500/30",
  cyan: "bg-cyan-500/15 text-cyan-500 border-cyan-500/30",
};

export default function Header({
  businesses,
  currentBusiness,
  onSelectBusiness,
  onOpenNewBusinessModal,
  onLockApp,
  darkMode,
  onToggleTheme,
  dbStatus,
  showHindi,
}: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const labels = getLabels(showHindi);

  const activeColorClass = currentBusiness?.color
    ? colorBadgeStyles[currentBusiness.color] || colorBadgeStyles.emerald
    : colorBadgeStyles.emerald;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800/80 safe-top">
      <div className="max-w-md mx-auto px-4 h-15 flex items-center justify-between">
        {/* Business Switcher Button */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all text-left active-press"
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs border ${activeColorClass}`}
            >
              {currentBusiness?.name ? currentBusiness.name.charAt(0).toUpperCase() : "B"}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 tracking-wider">
                {labels.business}
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[130px]">
                  {currentBusiness?.name || "Select Profile"}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </div>
            </div>
          </button>

          {/* Business Switcher Dropdown */}
          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute left-0 top-full mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                      {labels.switchProfile}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {businesses.length} {businesses.length === 1 ? "Profile" : "Profiles"}
                  </span>
                </div>

                <div className="max-h-60 overflow-y-auto py-1 space-y-1">
                  {businesses.map((biz) => {
                    const isSelected = currentBusiness?.id === biz.id;
                    const bColor = colorBadgeStyles[biz.color] || colorBadgeStyles.emerald;
                    return (
                      <button
                        key={biz.id}
                        onClick={() => {
                          onSelectBusiness(biz);
                          setDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                          isSelected
                            ? "bg-slate-100 dark:bg-slate-800/80 font-semibold"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 truncate">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs border ${bColor}`}
                          >
                            {biz.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col text-left truncate">
                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {biz.name}
                            </span>
                            <span className="text-[10px] text-slate-400 truncate">
                              {biz.category || "General Business"}
                            </span>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Add Profile Option */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenNewBusinessModal();
                    }}
                    className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold transition-all active-press"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Profile</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Actions: DB Status, Theme, Lock */}
        <div className="flex items-center space-x-1.5">
          {/* Neon DB Indicator */}
          <div
            title={
              dbStatus === "connected"
                ? "PostgreSQL NeonDB Connected"
                : "Local storage mode. Set Neon DATABASE_URL in .env to connect."
            }
            className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-[10px] font-medium border ${
              dbStatus === "connected"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
            }`}
          >
            <Database className="w-3 h-3" />
            <span className="hidden sm:inline">
              {dbStatus === "connected" ? "Neon DB" : "Local DB"}
            </span>
          </div>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle Theme"
            className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all active-press"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>

          {/* Lock App Button */}
          <button
            onClick={onLockApp}
            title="Lock App with Passcode"
            aria-label="Lock App"
            className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-red-500 transition-all active-press"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
