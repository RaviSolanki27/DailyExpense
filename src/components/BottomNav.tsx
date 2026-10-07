"use client";

import React from "react";
import { PlusCircle, BarChart3, BookOpen, Settings } from "lucide-react";
import { getLabels } from "@/lib/translations";

export type TabType = "add" | "reports" | "khata" | "settings";

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  showHindi: boolean;
}

export default function BottomNav({ activeTab, onChangeTab, showHindi }: BottomNavProps) {
  const labels = getLabels(showHindi);

  const tabs = [
    {
      id: "add" as TabType,
      label: labels.quickAdd,
      icon: PlusCircle,
    },
    {
      id: "reports" as TabType,
      label: labels.reports,
      icon: BarChart3,
    },
    {
      id: "khata" as TabType,
      label: labels.khataBook,
      icon: BookOpen,
    },
    {
      id: "settings" as TabType,
      label: labels.settings,
      icon: Settings,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800/80 safe-bottom">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center w-16 py-1 transition-all active-press ${
                isActive
                  ? "text-emerald-600 dark:text-emerald-400 font-bold"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? "bg-emerald-500/15 scale-110" : ""
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
