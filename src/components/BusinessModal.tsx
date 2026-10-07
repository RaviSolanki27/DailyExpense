"use client";

import React, { useState } from "react";
import { BusinessProfile } from "@/types";
import { X, Building2, Palette, Trash2 } from "lucide-react";

interface BusinessModalProps {
  businessToEdit?: BusinessProfile | null;
  onClose: () => void;
  onSave: (data: {
    name: string;
    category?: string;
    description?: string;
    currency?: string;
    color?: string;
    icon?: string;
  }) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

const colorOptions = [
  { id: "emerald", label: "Emerald Green", bg: "bg-emerald-500" },
  { id: "amber", label: "Amber / Wood", bg: "bg-amber-500" },
  { id: "rose", label: "Rose / Red", bg: "bg-rose-500" },
  { id: "blue", label: "Blue / Transport", bg: "bg-blue-500" },
  { id: "violet", label: "Violet / Purple", bg: "bg-violet-500" },
  { id: "cyan", label: "Cyan / Teal", bg: "bg-cyan-500" },
];

export default function BusinessModal({
  businessToEdit,
  onClose,
  onSave,
  onDelete,
}: BusinessModalProps) {
  const [name, setName] = useState(businessToEdit?.name || "");
  const [category, setCategory] = useState(businessToEdit?.category || "Retail & Services");
  const [description, setDescription] = useState(businessToEdit?.description || "");
  const [currency, setCurrency] = useState(businessToEdit?.currency || "₹");
  const [color, setColor] = useState(businessToEdit?.color || "emerald");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await onSave({
        name: name.trim(),
        category: category.trim(),
        description: description.trim(),
        currency: currency.trim() || "₹",
        color,
      });
      onClose();
    } catch {
      alert("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!businessToEdit || !onDelete) return;
    if (
      confirm(
        `Are you sure you want to delete "${businessToEdit.name}" and all its expenses, income, and khata records?`
      )
    ) {
      setLoading(true);
      try {
        await onDelete(businessToEdit.id);
        onClose();
      } catch {
        alert("Failed to delete profile");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {businessToEdit ? "Edit Business Profile" : "New Business Profile"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Business Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Plywood Shop, Cafe, Car Rental"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Category
            </label>
            <input
              type="text"
              placeholder="e.g. Manufacturing, Food & Dining, Transport"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Theme Color
              </label>
              <div className="flex items-center space-x-1.5 pt-1">
                {colorOptions.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColor(c.id)}
                    className={`w-5 h-5 rounded-full ${c.bg} transition-transform ${
                      color === c.id ? "ring-2 ring-white scale-125" : "opacity-70 hover:opacity-100"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Description (Optional)
            </label>
            <input
              type="text"
              placeholder="Short note about this business"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-2 flex items-center space-x-2">
            {businessToEdit && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 active-press"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
            >
              {loading ? "Saving..." : businessToEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

