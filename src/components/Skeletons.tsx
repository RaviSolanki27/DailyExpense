"use client";

import React from "react";

export function QuickAddSkeleton() {
  return (
    <div className="max-w-md mx-auto px-4 pb-24 pt-3 space-y-4 animate-pulse">
      {/* Mode Switcher Skeleton */}
      <div className="h-11 rounded-2xl bg-slate-200 dark:bg-slate-900 border border-slate-300/40 dark:border-slate-800" />

      {/* Payment Modes Skeleton */}
      <div>
        <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded-md mb-2" />
        <div className="grid grid-cols-3 gap-2">
          <div className="h-10 rounded-xl bg-slate-200 dark:bg-slate-900 border border-slate-300/40 dark:border-slate-800" />
          <div className="h-10 rounded-xl bg-slate-200 dark:bg-slate-900 border border-slate-300/40 dark:border-slate-800" />
          <div className="h-10 rounded-xl bg-slate-200 dark:bg-slate-900 border border-slate-300/40 dark:border-slate-800" />
        </div>
      </div>

      {/* Suggestion Chips Slider Skeleton */}
      <div>
        <div className="h-3 w-40 bg-slate-200 dark:bg-slate-800 rounded-md mb-2" />
        <div className="flex space-x-2 overflow-hidden">
          <div className="h-8 w-24 rounded-xl bg-slate-200 dark:bg-slate-900 flex-shrink-0" />
          <div className="h-8 w-20 rounded-xl bg-slate-200 dark:bg-slate-900 flex-shrink-0" />
          <div className="h-8 w-28 rounded-xl bg-slate-200 dark:bg-slate-900 flex-shrink-0" />
          <div className="h-8 w-20 rounded-xl bg-slate-200 dark:bg-slate-900 flex-shrink-0" />
        </div>
      </div>

      {/* Input Field Skeleton */}
      <div>
        <div className="h-3 w-32 bg-slate-200 dark:bg-slate-800 rounded-md mb-1.5" />
        <div className="h-11 rounded-xl bg-slate-200 dark:bg-slate-900 border border-slate-300/40 dark:border-slate-800" />
      </div>

      {/* Calculator Amount Skeleton */}
      <div className="p-3 rounded-3xl bg-slate-200 dark:bg-slate-900 border border-slate-300/40 dark:border-slate-800 space-y-3">
        <div className="h-16 rounded-2xl bg-slate-300/60 dark:bg-slate-950" />
        <div className="grid grid-cols-4 gap-1.5">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="h-11 rounded-xl bg-slate-300/50 dark:bg-slate-850 bg-slate-800/40" />
          ))}
        </div>
      </div>

      {/* Save Button Skeleton */}
      <div className="h-14 rounded-2xl bg-slate-300 dark:bg-slate-800" />
    </div>
  );
}

export function ReportsSkeleton() {
  return (
    <div className="max-w-md mx-auto px-4 pb-24 pt-3 space-y-4 animate-pulse">
      {/* Period Tabs Skeleton */}
      <div className="flex space-x-2 overflow-hidden">
        <div className="h-8 w-16 rounded-xl bg-slate-200 dark:bg-slate-900 flex-shrink-0" />
        <div className="h-8 w-20 rounded-xl bg-slate-200 dark:bg-slate-900 flex-shrink-0" />
        <div className="h-8 w-20 rounded-xl bg-slate-200 dark:bg-slate-900 flex-shrink-0" />
        <div className="h-8 w-20 rounded-xl bg-slate-200 dark:bg-slate-900 flex-shrink-0" />
      </div>

      {/* 3 Summary Cards Skeleton */}
      <div className="grid grid-cols-3 gap-2">
        <div className="h-16 rounded-2xl bg-slate-200 dark:bg-slate-900" />
        <div className="h-16 rounded-2xl bg-slate-200 dark:bg-slate-900" />
        <div className="h-16 rounded-2xl bg-slate-200 dark:bg-slate-900" />
      </div>

      {/* Payment Modes Bar Skeleton */}
      <div className="h-20 rounded-2xl bg-slate-200 dark:bg-slate-900" />

      {/* Search & Filter Skeleton */}
      <div className="grid grid-cols-2 gap-2">
        <div className="h-9 rounded-xl bg-slate-200 dark:bg-slate-900" />
        <div className="h-9 rounded-xl bg-slate-200 dark:bg-slate-900" />
      </div>
      <div className="h-9 rounded-xl bg-slate-200 dark:bg-slate-900" />

      {/* List items skeleton */}
      <div className="space-y-2 pt-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-14 rounded-2xl bg-slate-200 dark:bg-slate-900 flex items-center justify-between p-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-slate-300 dark:bg-slate-800" />
              <div className="space-y-1">
                <div className="h-3 w-28 bg-slate-300 dark:bg-slate-800 rounded" />
                <div className="h-2 w-16 bg-slate-300 dark:bg-slate-800 rounded" />
              </div>
            </div>
            <div className="h-4 w-16 bg-slate-300 dark:bg-slate-800 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function KhataSkeleton() {
  return (
    <div className="max-w-md mx-auto px-4 pb-24 pt-3 space-y-4 animate-pulse">
      {/* 2 Summary Cards Skeleton */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="h-20 rounded-2xl bg-slate-200 dark:bg-slate-900" />
        <div className="h-20 rounded-2xl bg-slate-200 dark:bg-slate-900" />
      </div>

      {/* Search Bar Skeleton */}
      <div className="flex space-x-2">
        <div className="flex-1 h-10 rounded-xl bg-slate-200 dark:bg-slate-900" />
        <div className="w-24 h-10 rounded-xl bg-slate-200 dark:bg-slate-900" />
      </div>

      {/* Filter Tabs Skeleton */}
      <div className="flex space-x-2">
        <div className="h-7 w-16 rounded-xl bg-slate-200 dark:bg-slate-900" />
        <div className="h-7 w-24 rounded-xl bg-slate-200 dark:bg-slate-900" />
        <div className="h-7 w-24 rounded-xl bg-slate-200 dark:bg-slate-900" />
      </div>

      {/* Contacts List Skeletons */}
      <div className="space-y-2 pt-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 rounded-2xl bg-slate-200 dark:bg-slate-900 p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-slate-300 dark:bg-slate-800" />
              <div className="space-y-1.5">
                <div className="h-3 w-32 bg-slate-300 dark:bg-slate-800 rounded" />
                <div className="h-2 w-20 bg-slate-300 dark:bg-slate-800 rounded" />
              </div>
            </div>
            <div className="space-y-1 text-right">
              <div className="h-4 w-16 bg-slate-300 dark:bg-slate-800 rounded ml-auto" />
              <div className="h-2 w-12 bg-slate-300 dark:bg-slate-800 rounded ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GlobalAppLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-6">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-sky-500 flex items-center justify-center shadow-xl shadow-emerald-500/20 animate-pulse">
          <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
      <h2 className="text-base font-bold tracking-tight text-white font-sans">
        Daily Expense & Khata
      </h2>
      <p className="text-xs text-slate-400 mt-1 animate-pulse">Loading business profiles...</p>
    </div>
  );
}

