"use client";

import React, { useState, useEffect, useRef } from "react";
import { Lock, Delete, ShieldCheck, KeyRound, ArrowRight, Loader2 } from "lucide-react";

interface PasscodeLockProps {
  onUnlock: () => void;
}

export default function PasscodeLock({ onUnlock }: PasscodeLockProps) {
  const [pin, setPin] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [shake, setShake] = useState<boolean>(false);
  const touchHandledRef = useRef<boolean>(false);

  const vibrate = () => {
    try {
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(25);
      }
    } catch {}
  };

  const handleDigit = (digit: string) => {
    vibrate();
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
    vibrate();
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  };

  const handleClear = () => {
    vibrate();
    setPin("");
    setError(null);
  };

  const verifyPin = async (inputPin: string) => {
    setLoading(true);
    setError(null);

    // Timeout controller to ensure mobile never hangs indefinitely
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    try {
      const res = await fetch("/api/auth/passcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: inputPin }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await res.json();

      if (data.success) {
        try {
          localStorage.setItem("daily_expense_unlocked", "true");
          sessionStorage.setItem("daily_expense_unlocked", "true");
        } catch {}
        onUnlock();
      } else {
        triggerError(data.error || "Incorrect 4-digit passcode");
      }
    } catch (e: any) {
      clearTimeout(timeoutId);
      // Fallback verification for offline or local default 0000
      if (inputPin.trim() === "0000") {
        try {
          localStorage.setItem("daily_expense_unlocked", "true");
          sessionStorage.setItem("daily_expense_unlocked", "true");
        } catch {}
        onUnlock();
      } else {
        triggerError("Incorrect passcode (Default: 0000)");
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
      } else if (e.key === "Enter" && pin.length === 4) {
        verifyPin(pin);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pin]);

  // Touch handler to eliminate 300ms mobile tap delay and guarantee response
  const createButtonHandlers = (action: () => void) => {
    return {
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (touchHandledRef.current) {
          touchHandledRef.current = false;
          return;
        }
        action();
      },
      onTouchEnd: (e: React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        touchHandledRef.current = true;
        action();
        setTimeout(() => {
          touchHandledRef.current = false;
        }, 300);
      },
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-slate-950 text-white px-6 py-8 sm:py-12 touch-manipulation overflow-hidden">
      {/* Top Branding */}
      <div className="flex flex-col items-center mt-4 sm:mt-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-3">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white font-sans">
          Daily Expense & Khata
        </h1>
        <p className="text-xs text-slate-400 mt-1">Enter your 4-digit security passcode</p>
      </div>

      {/* PIN Dots Indicator */}
      <div className="flex flex-col items-center my-4">
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

        {loading ? (
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold mt-4">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Verifying passcode...</span>
          </div>
        ) : error ? (
          <p className="text-red-400 text-xs font-medium mt-4 tracking-wide text-center animate-pulse">
            {error}
          </p>
        ) : (
          <button
            type="button"
            onClick={() => {
              setPin("0000");
              verifyPin("0000");
            }}
            className="flex items-center space-x-1.5 text-slate-400 hover:text-emerald-400 text-xs mt-4 transition-colors p-1"
          >
            <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
            <span>Default passcode: <strong className="text-emerald-400 underline">0000</strong> (Tap to Auto-Fill)</span>
          </button>
        )}
      </div>

      {/* Mobile Numeric Keypad */}
      <div className="w-full max-w-xs grid grid-cols-3 gap-3 mb-2">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
          <button
            key={digit}
            type="button"
            disabled={loading}
            {...createButtonHandlers(() => handleDigit(digit))}
            className="h-16 rounded-2xl bg-slate-900 border border-slate-800/80 active:bg-emerald-600 active:text-white transition-all text-2xl font-semibold flex items-center justify-center shadow-sm active-press cursor-pointer touch-manipulation select-none"
          >
            {digit}
          </button>
        ))}

        {/* Clear Button */}
        <button
          type="button"
          disabled={loading || pin.length === 0}
          {...createButtonHandlers(handleClear)}
          className="h-16 rounded-2xl bg-slate-900/40 text-slate-400 text-xs font-semibold uppercase tracking-wider flex items-center justify-center active-press cursor-pointer touch-manipulation select-none disabled:opacity-30"
        >
          Clear
        </button>

        {/* 0 Button */}
        <button
          type="button"
          disabled={loading}
          {...createButtonHandlers(() => handleDigit("0"))}
          className="h-16 rounded-2xl bg-slate-900 border border-slate-800/80 active:bg-emerald-600 active:text-white transition-all text-2xl font-semibold flex items-center justify-center shadow-sm active-press cursor-pointer touch-manipulation select-none"
        >
          0
        </button>

        {/* Delete / Backspace Button */}
        <button
          type="button"
          disabled={loading || pin.length === 0}
          {...createButtonHandlers(handleDelete)}
          className="h-16 rounded-2xl bg-slate-900/40 text-slate-300 flex items-center justify-center active-press cursor-pointer touch-manipulation select-none disabled:opacity-30"
        >
          <Delete className="w-6 h-6" />
        </button>
      </div>

      {/* Manual Unlock Submit Button (Appears if 4 digits entered) */}
      {pin.length === 4 && (
        <button
          type="button"
          disabled={loading}
          {...createButtonHandlers(() => verifyPin(pin))}
          className="w-full max-w-xs py-3.5 mb-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 active-press cursor-pointer touch-manipulation"
        >
          <span>Unlock Application</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}

      {/* Footer Info */}
      <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-2">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>End-to-end local passcode protection</span>
      </div>
    </div>
  );
}
