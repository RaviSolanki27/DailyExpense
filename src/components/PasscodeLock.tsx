"use client";

import React, { useState, useEffect } from "react";
import { Lock, Delete, ShieldCheck, KeyRound } from "lucide-react";

interface PasscodeLockProps {
  onUnlock: () => void;
}

export default function PasscodeLock({ onUnlock }: PasscodeLockProps) {
  const [pin, setPin] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [shake, setShake] = useState<boolean>(false);

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError(null);
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  };

  const handleClear = () => {
    setPin("");
    setError(null);
  };

  const verifyPin = async (inputPin: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/passcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: inputPin }),
      });
      const data = await res.json();

      if (data.success) {
        sessionStorage.setItem("daily_expense_unlocked", "true");
        onUnlock();
      } else {
        triggerError(data.error || "Incorrect 4-digit passcode");
      }
    } catch {
      // Local fallback verification
      if (inputPin === "0000") {
        sessionStorage.setItem("daily_expense_unlocked", "true");
        onUnlock();
      } else {
        triggerError("Incorrect passcode. Try default: 0000");
      }
    } finally {
      setLoading(false);
    }
  };

  const triggerError = (msg: string) => {
    setError(msg);
    setShake(true);
    setTimeout(() => {
      setShake(false);
      setPin("");
    }, 500);
  };

  // Keyboard support for desktop testing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        handleDigit(e.key);
      } else if (e.key === "Backspace") {
        handleDelete();
      } else if (e.key === "Escape") {
        handleClear();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pin]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-slate-950 text-white px-6 py-12 select-none">
      {/* Top Branding */}
      <div className="flex flex-col items-center mt-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">Daily Expense & Khata</h1>
        <p className="text-xs text-slate-400 mt-1">Enter your 4-digit security passcode</p>
      </div>

      {/* PIN Dots Indicator */}
      <div className="flex flex-col items-center my-6">
        <div
          className={`flex items-center space-x-5 ${
            shake ? "animate-shake" : ""
          }`}
        >
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  isFilled
                    ? "bg-emerald-400 scale-125 shadow-md shadow-emerald-400/50"
                    : "border-2 border-slate-700 bg-slate-800/60"
                }`}
              />
            );
          })}
        </div>

        {error ? (
          <p className="text-red-400 text-xs font-medium mt-4 tracking-wide text-center animate-pulse">
            {error}
          </p>
        ) : (
          <div className="flex items-center space-x-1.5 text-slate-400 text-xs mt-4">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Default passcode: <strong className="text-emerald-400">0000</strong> (Set in DB)</span>
          </div>
        )}
      </div>

      {/* Numeric Keypad */}
      <div className="w-full max-w-xs grid grid-cols-3 gap-3 mb-4">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
          <button
            key={digit}
            onClick={() => handleDigit(digit)}
            disabled={loading}
            className="h-16 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:bg-slate-800 active:bg-emerald-600 active:text-white transition-all text-2xl font-semibold flex items-center justify-center shadow-sm active-press"
          >
            {digit}
          </button>
        ))}

        {/* Clear Button */}
        <button
          onClick={handleClear}
          disabled={loading || pin.length === 0}
          className="h-16 rounded-2xl bg-slate-900/40 hover:bg-slate-800/60 text-slate-400 text-xs font-semibold uppercase tracking-wider flex items-center justify-center active-press"
        >
          Clear
        </button>

        {/* 0 Button */}
        <button
          onClick={() => handleDigit("0")}
          disabled={loading}
          className="h-16 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:bg-slate-800 active:bg-emerald-600 active:text-white transition-all text-2xl font-semibold flex items-center justify-center shadow-sm active-press"
        >
          0
        </button>

        {/* Delete / Backspace Button */}
        <button
          onClick={handleDelete}
          disabled={loading || pin.length === 0}
          className="h-16 rounded-2xl bg-slate-900/40 hover:bg-slate-800/60 text-slate-300 flex items-center justify-center active-press"
        >
          <Delete className="w-6 h-6" />
        </button>
      </div>

      {/* Footer Info */}
      <div className="flex items-center space-x-2 text-[11px] text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>End-to-end local passcode protection</span>
      </div>
    </div>
  );
}
