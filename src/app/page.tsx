"use client";

import React, { useState, useEffect } from "react";
import PasscodeLock from "@/components/PasscodeLock";
import Header from "@/components/Header";
import BottomNav, { TabType } from "@/components/BottomNav";
import QuickAddTab from "@/components/QuickAddTab";
import ReportsTab from "@/components/ReportsTab";
import KhataTab from "@/components/KhataTab";
import SettingsTab from "@/components/SettingsTab";
import BusinessModal from "@/components/BusinessModal";
import { BusinessProfile, FrequentTag } from "@/types";

export default function Home() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [checkedLock, setCheckedLock] = useState<boolean>(false);

  // App data state
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
  const [currentBusiness, setCurrentBusiness] = useState<BusinessProfile | null>(null);
  const [frequentTags, setFrequentTags] = useState<FrequentTag[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("add");

  // Modals state
  const [showBusinessModal, setShowBusinessModal] = useState<boolean>(false);
  const [businessToEdit, setBusinessToEdit] = useState<BusinessProfile | null>(null);

  // Settings: Theme & Hindi Translation
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [showHindi, setShowHindi] = useState<boolean>(true);
  const [dbStatus, setDbStatus] = useState<"connected" | "fallback_mode">("connected");
  const [loading, setLoading] = useState<boolean>(true);

  // 1. Initial lock check, theme, and Hindi setup
  useEffect(() => {
    // Check lock
    const unlocked = sessionStorage.getItem("daily_expense_unlocked") === "true";
    setIsUnlocked(unlocked);
    setCheckedLock(true);

    // Theme setup: check localStorage first
    const savedTheme = localStorage.getItem("daily_expense_theme");
    let isDark = false;
    if (savedTheme === "dark") {
      isDark = true;
    } else if (savedTheme === "light") {
      isDark = false;
    } else {
      // Default to false (Light Mode) if not set, or check media query
      isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Hindi translation setup: default true
    const savedHindi = localStorage.getItem("daily_expense_show_hindi");
    if (savedHindi !== null) {
      setShowHindi(savedHindi === "true");
    } else {
      setShowHindi(true);
    }

    // Check DB status
    fetch("/api/status")
      .then((r) => r.json())
      .then((data) => {
        if (data.database === "connected") setDbStatus("connected");
        else setDbStatus("fallback_mode");
      })
      .catch(() => setDbStatus("fallback_mode"));
  }, []);

  // 2. Fetch businesses
  const fetchBusinesses = async () => {
    try {
      const res = await fetch("/api/businesses");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setBusinesses(data);

        // Retrieve last active business or default to first
        const savedBizId = localStorage.getItem("daily_expense_active_biz");
        const found = data.find((b: BusinessProfile) => b.id === savedBizId);
        const selected = found || data[0];
        setCurrentBusiness(selected);
      }
    } catch (e) {
      console.warn("Failed to fetch businesses:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isUnlocked) {
      fetchBusinesses();
    }
  }, [isUnlocked]);

  // 3. Fetch frequent tags when business changes
  const fetchFrequentTags = async (businessId: string) => {
    try {
      const res = await fetch(`/api/frequent-tags?businessId=${businessId}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setFrequentTags(data);
      }
    } catch (e) {
      console.warn("Failed to fetch tags:", e);
    }
  };

  useEffect(() => {
    if (currentBusiness) {
      fetchFrequentTags(currentBusiness.id);
      localStorage.setItem("daily_expense_active_biz", currentBusiness.id);
    }
  }, [currentBusiness?.id]);

  // Handle business selection
  const handleSelectBusiness = (biz: BusinessProfile) => {
    setCurrentBusiness(biz);
  };

  // Handle business save (create or edit)
  const handleSaveBusiness = async (data: {
    name: string;
    category?: string;
    description?: string;
    currency?: string;
    color?: string;
    icon?: string;
  }) => {
    if (businessToEdit) {
      const res = await fetch(`/api/businesses/${businessToEdit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updated = await res.json();
        setBusinesses((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
        if (currentBusiness?.id === updated.id) setCurrentBusiness(updated);
      }
    } else {
      const res = await fetch("/api/businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const created = await res.json();
        setBusinesses((prev) => [...prev, created]);
        setCurrentBusiness(created);
      }
    }
  };

  // Handle business delete
  const handleDeleteBusiness = async (id: string) => {
    const res = await fetch(`/api/businesses/${id}`, { method: "DELETE" });
    if (res.ok) {
      const remaining = businesses.filter((b) => b.id !== id);
      setBusinesses(remaining);
      if (remaining.length > 0) {
        setCurrentBusiness(remaining[0]);
      } else {
        setCurrentBusiness(null);
      }
    }
  };

  // Handle adding new frequent tag
  const handleAddFrequentTag = async (label: string) => {
    if (!currentBusiness) return;
    try {
      const res = await fetch("/api/frequent-tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId: currentBusiness.id, label }),
      });
      if (res.ok) {
        fetchFrequentTags(currentBusiness.id);
      }
    } catch (e) {
      console.warn("Failed to add tag:", e);
    }
  };

  // Theme toggle with explicit DOM and state synchronization
  const toggleTheme = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("daily_expense_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("daily_expense_theme", "light");
    }
  };

  // Hindi toggle
  const toggleHindi = () => {
    const nextHindi = !showHindi;
    setShowHindi(nextHindi);
    localStorage.setItem("daily_expense_show_hindi", String(nextHindi));
  };

  // Lock App
  const handleLockApp = () => {
    sessionStorage.removeItem("daily_expense_unlocked");
    setIsUnlocked(false);
  };

  // Don't render until lock status is checked
  if (!checkedLock) return null;

  // Passcode Lock Screen
  if (!isUnlocked) {
    return <PasscodeLock onUnlock={() => setIsUnlocked(true)} />;
  }

  // Loading state
  if (loading && businesses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-400">Loading your business tracker...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-500/20 font-sans">
      {/* Top Header */}
      <Header
        businesses={businesses}
        currentBusiness={currentBusiness}
        onSelectBusiness={handleSelectBusiness}
        onOpenNewBusinessModal={() => {
          setBusinessToEdit(null);
          setShowBusinessModal(true);
        }}
        onLockApp={handleLockApp}
        darkMode={darkMode}
        onToggleTheme={toggleTheme}
        dbStatus={dbStatus}
        showHindi={showHindi}
      />

      {/* Main Content View by Active Tab */}
      <div className="flex-1 w-full max-w-md mx-auto">
        {currentBusiness ? (
          <>
            {activeTab === "add" && (
              <QuickAddTab
                business={currentBusiness}
                frequentTags={frequentTags}
                onRefreshData={() => {}}
                onAddFrequentTag={handleAddFrequentTag}
                showHindi={showHindi}
              />
            )}

            {activeTab === "reports" && (
              <ReportsTab business={currentBusiness} showHindi={showHindi} />
            )}

            {activeTab === "khata" && (
              <KhataTab business={currentBusiness} showHindi={showHindi} />
            )}

            {activeTab === "settings" && (
              <SettingsTab
                businesses={businesses}
                currentBusiness={currentBusiness}
                onSelectBusiness={handleSelectBusiness}
                onOpenCreateBusiness={() => {
                  setBusinessToEdit(null);
                  setShowBusinessModal(true);
                }}
                onEditBusiness={(biz) => {
                  setBusinessToEdit(biz);
                  setShowBusinessModal(true);
                }}
                darkMode={darkMode}
                onToggleTheme={toggleTheme}
                dbStatus={dbStatus}
                onLockApp={handleLockApp}
                showHindi={showHindi}
                onToggleHindi={toggleHindi}
              />
            )}
          </>
        ) : (
          <div className="text-center py-20 px-4">
            <h2 className="text-base font-bold mb-2">No Business Profiles</h2>
            <p className="text-xs text-slate-400 mb-4">
              Create your first business profile to begin tracking expenses and income.
            </p>
            <button
              onClick={() => {
                setBusinessToEdit(null);
                setShowBusinessModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-600/30"
            >
              + Create Business Profile
            </button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} showHindi={showHindi} />

      {/* Business Profile Modal */}
      {showBusinessModal && (
        <BusinessModal
          businessToEdit={businessToEdit}
          onClose={() => {
            setShowBusinessModal(false);
            setBusinessToEdit(null);
          }}
          onSave={handleSaveBusiness}
          onDelete={businessToEdit ? handleDeleteBusiness : undefined}
        />
      )}
    </main>
  );
}
