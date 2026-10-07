"use client";

import React, { useState, useEffect } from "react";
import { Delete, Equal, Plus, Minus, X, Divide, RefreshCw } from "lucide-react";

interface CalculatorPadProps {
  currency: string;
  value: number;
  onChange: (val: number) => void;
  onDone?: () => void;
}

export default function CalculatorPad({
  currency,
  value,
  onChange,
  onDone,
}: CalculatorPadProps) {
  const [expression, setExpression] = useState<string>(value > 0 ? String(value) : "");
  const [calculatedValue, setCalculatedValue] = useState<number>(value);

  // Synchronize when value changes externally (e.g. reset)
  useEffect(() => {
    if (value === 0 && expression !== "" && !expression.match(/[+\-*/]/)) {
      setExpression("");
      setCalculatedValue(0);
    }
  }, [value]);

  const safeEvaluate = (expr: string): number => {
    try {
      // Clean expression: only digits, decimal, and basic operators
      const cleaned = expr.replace(/×/g, "*").replace(/÷/g, "/");
      // Prevent consecutive operators at the end
      const sanitized = cleaned.replace(/[+\-*/]+$/, "");
      if (!sanitized) return 0;

      // Safe evaluation using Function
      const result = new Function(`return (${sanitized})`)();
      if (typeof result === "number" && !isNaN(result) && isFinite(result)) {
        return Math.round(result * 100) / 100;
      }
      return 0;
    } catch {
      return calculatedValue;
    }
  };

  const handleInput = (char: string) => {
    let nextExpr = expression;

    if (char === "C") {
      setExpression("");
      setCalculatedValue(0);
      onChange(0);
      return;
    }

    if (char === "⌫") {
      nextExpr = nextExpr.slice(0, -1);
      setExpression(nextExpr);
      const evalResult = safeEvaluate(nextExpr);
      setCalculatedValue(evalResult);
      onChange(evalResult);
      return;
    }

    if (char === "=") {
      const finalVal = safeEvaluate(expression);
      setExpression(finalVal > 0 ? String(finalVal) : "");
      setCalculatedValue(finalVal);
      onChange(finalVal);
      if (onDone) onDone();
      return;
    }

    // Quick operators
    const isOp = ["+", "-", "×", "÷"].includes(char);
    const lastChar = nextExpr.slice(-1);
    const lastIsOp = ["+", "-", "×", "÷"].includes(lastChar);

    if (isOp) {
      if (nextExpr === "") {
        if (char === "-") nextExpr = "-";
        else return;
      } else if (lastIsOp) {
        // Replace operator
        nextExpr = nextExpr.slice(0, -1) + char;
      } else {
        nextExpr = nextExpr + char;
      }
    } else {
      // Digit or decimal
      if (char === "." && lastChar === ".") return;
      nextExpr = nextExpr + char;
    }

    setExpression(nextExpr);
    const evalResult = safeEvaluate(nextExpr);
    setCalculatedValue(evalResult);
    onChange(evalResult);
  };

  const handleQuickAdd = (addAmount: number) => {
    const current = calculatedValue || 0;
    const nextVal = current + addAmount;
    setExpression(String(nextVal));
    setCalculatedValue(nextVal);
    onChange(nextVal);
  };

  return (
    <div className="w-full bg-slate-900/60 dark:bg-slate-950/80 rounded-3xl p-3 border border-slate-200/40 dark:border-slate-800/80 shadow-inner">
      {/* Amount Display */}
      <div className="bg-slate-950/90 rounded-2xl p-3.5 mb-2.5 border border-slate-800 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-medium">Amount Calculation</span>
          {expression.match(/[+\-×÷]/) && (
            <span className="text-emerald-400 font-mono text-xs">
              = {currency} {calculatedValue.toLocaleString()}
            </span>
          )}
        </div>
        <div className="flex items-baseline justify-between overflow-hidden">
          <span className="text-xl font-bold text-slate-400 mr-2">{currency}</span>
          <div className="text-right truncate font-mono">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {expression || "0"}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Add Increment Chips */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 no-scrollbar mb-1">
        {[100, 500, 1000, 2000, 5000].map((addVal) => (
          <button
            key={addVal}
            type="button"
            onClick={() => handleQuickAdd(addVal)}
            className="flex-shrink-0 px-2.5 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-white text-[11px] font-semibold transition-all active-press"
          >
            +{addVal >= 1000 ? `${addVal / 1000}k` : addVal}
          </button>
        ))}
      </div>

      {/* 4x5 Calculator Grid */}
      <div className="grid grid-cols-4 gap-1.5">
        {/* Row 1 */}
        <button
          type="button"
          onClick={() => handleInput("C")}
          className="h-11 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 font-bold text-sm flex items-center justify-center active-press"
        >
          C
        </button>
        <button
          type="button"
          onClick={() => handleInput("÷")}
          className="h-11 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-emerald-400 font-bold text-lg flex items-center justify-center active-press"
        >
          ÷
        </button>
        <button
          type="button"
          onClick={() => handleInput("×")}
          className="h-11 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-emerald-400 font-bold text-lg flex items-center justify-center active-press"
        >
          ×
        </button>
        <button
          type="button"
          onClick={() => handleInput("⌫")}
          className="h-11 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-sm flex items-center justify-center active-press"
        >
          <Delete className="w-4 h-4" />
        </button>

        {/* Row 2 */}
        <button
          type="button"
          onClick={() => handleInput("7")}
          className="h-11 rounded-xl bg-slate-850 hover:bg-slate-750 bg-slate-900 border border-slate-800 text-white font-semibold text-lg flex items-center justify-center active-press shadow-xs"
        >
          7
        </button>
        <button
          type="button"
          onClick={() => handleInput("8")}
          className="h-11 rounded-xl bg-slate-850 hover:bg-slate-750 bg-slate-900 border border-slate-800 text-white font-semibold text-lg flex items-center justify-center active-press shadow-xs"
        >
          8
        </button>
        <button
          type="button"
          onClick={() => handleInput("9")}
          className="h-11 rounded-xl bg-slate-850 hover:bg-slate-750 bg-slate-900 border border-slate-800 text-white font-semibold text-lg flex items-center justify-center active-press shadow-xs"
        >
          9
        </button>
        <button
          type="button"
          onClick={() => handleInput("-")}
          className="h-11 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-emerald-400 font-bold text-lg flex items-center justify-center active-press"
        >
          -
        </button>

        {/* Row 3 */}
        <button
          type="button"
          onClick={() => handleInput("4")}
          className="h-11 rounded-xl bg-slate-850 hover:bg-slate-750 bg-slate-900 border border-slate-800 text-white font-semibold text-lg flex items-center justify-center active-press shadow-xs"
        >
          4
        </button>
        <button
          type="button"
          onClick={() => handleInput("5")}
          className="h-11 rounded-xl bg-slate-850 hover:bg-slate-750 bg-slate-900 border border-slate-800 text-white font-semibold text-lg flex items-center justify-center active-press shadow-xs"
        >
          5
        </button>
        <button
          type="button"
          onClick={() => handleInput("6")}
          className="h-11 rounded-xl bg-slate-850 hover:bg-slate-750 bg-slate-900 border border-slate-800 text-white font-semibold text-lg flex items-center justify-center active-press shadow-xs"
        >
          6
        </button>
        <button
          type="button"
          onClick={() => handleInput("+")}
          className="h-11 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-emerald-400 font-bold text-lg flex items-center justify-center active-press"
        >
          +
        </button>

        {/* Row 4 */}
        <button
          type="button"
          onClick={() => handleInput("1")}
          className="h-11 rounded-xl bg-slate-850 hover:bg-slate-750 bg-slate-900 border border-slate-800 text-white font-semibold text-lg flex items-center justify-center active-press shadow-xs"
        >
          1
        </button>
        <button
          type="button"
          onClick={() => handleInput("2")}
          className="h-11 rounded-xl bg-slate-850 hover:bg-slate-750 bg-slate-900 border border-slate-800 text-white font-semibold text-lg flex items-center justify-center active-press shadow-xs"
        >
          2
        </button>
        <button
          type="button"
          onClick={() => handleInput("3")}
          className="h-11 rounded-xl bg-slate-850 hover:bg-slate-750 bg-slate-900 border border-slate-800 text-white font-semibold text-lg flex items-center justify-center active-press shadow-xs"
        >
          3
        </button>
        <button
          type="button"
          onClick={() => handleInput("=")}
          className="h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-lg flex items-center justify-center active-press shadow-md shadow-emerald-500/20"
        >
          <Equal className="w-5 h-5" />
        </button>

        {/* Row 5 */}
        <button
          type="button"
          onClick={() => handleInput("0")}
          className="h-11 rounded-xl bg-slate-850 hover:bg-slate-750 bg-slate-900 border border-slate-800 text-white font-semibold text-lg flex items-center justify-center active-press shadow-xs"
        >
          0
        </button>
        <button
          type="button"
          onClick={() => handleInput("00")}
          className="h-11 rounded-xl bg-slate-850 hover:bg-slate-750 bg-slate-900 border border-slate-800 text-white font-semibold text-sm flex items-center justify-center active-press shadow-xs"
        >
          00
        </button>
        <button
          type="button"
          onClick={() => handleInput(".")}
          className="h-11 rounded-xl bg-slate-850 hover:bg-slate-750 bg-slate-900 border border-slate-800 text-white font-semibold text-lg flex items-center justify-center active-press shadow-xs"
        >
          .
        </button>
      </div>
    </div>
  );
}
