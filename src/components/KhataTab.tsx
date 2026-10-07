"use client";

import React, { useState, useEffect } from "react";
import { BusinessProfile, KhataParty, KhataEntry, PaymentMode } from "@/types";
import {
  BookOpen,
  UserPlus,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  Phone,
  MessageCircle,
  Plus,
  Trash2,
  X,
  Calendar,
  CheckCircle2,
  Clock,
  Send,
} from "lucide-react";

interface KhataTabProps {
  business: BusinessProfile;
}

export default function KhataTab({ business }: KhataTabProps) {
  const [parties, setParties] = useState<KhataParty[]>([]);
  const [selectedParty, setSelectedParty] = useState<KhataParty | null>(null);
  const [search, setSearch] = useState<string>("");
  const [filterType, setFilterType] = useState<"ALL" | "RECEIVABLE" | "PAYABLE">("ALL");
  const [showAddPartyModal, setShowAddPartyModal] = useState<boolean>(false);
  const [showAddEntryModal, setShowAddEntryModal] = useState<boolean>(false);
  const [entryType, setEntryType] = useState<"GAVE" | "GOT">("GAVE");

  // Add party form state
  const [partyName, setPartyName] = useState<string>("");
  const [partyPhone, setPartyPhone] = useState<string>("");
  const [partyNotes, setPartyNotes] = useState<string>("");

  // Add entry form state
  const [entryAmount, setEntryAmount] = useState<string>("");
  const [entryDesc, setEntryDesc] = useState<string>("");
  const [entryMode, setEntryMode] = useState<PaymentMode>("CASH");
  const [entryDate, setEntryDate] = useState<string>(new Date().toISOString().split("T")[0]);

  const [loading, setLoading] = useState<boolean>(true);

  const fetchParties = async () => {
    try {
      const res = await fetch(`/api/khata/parties?businessId=${business.id}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setParties(data);
        if (selectedParty) {
          const updatedSelected = data.find((p) => p.id === selectedParty.id);
          if (updatedSelected) setSelectedParty(updatedSelected);
        }
      }
    } catch (e) {
      console.warn("Failed to fetch khata:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParties();
  }, [business.id]);

  const handleCreateParty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partyName.trim()) return;

    try {
      const res = await fetch("/api/khata/parties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          name: partyName.trim(),
          phone: partyPhone.trim() || undefined,
          notes: partyNotes.trim() || undefined,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setPartyName("");
        setPartyPhone("");
        setPartyNotes("");
        setShowAddPartyModal(false);
        fetchParties();
        setSelectedParty(created);
      }
    } catch (e) {
      alert("Failed to create customer/party");
    }
  };

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParty || !entryAmount || Number(entryAmount) <= 0) return;

    try {
      const res = await fetch("/api/khata/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partyId: selectedParty.id,
          type: entryType,
          amount: Number(entryAmount),
          description: entryDesc.trim() || undefined,
          paymentMode: entryMode,
          date: entryDate,
        }),
      });

      if (res.ok) {
        setEntryAmount("");
        setEntryDesc("");
        setShowAddEntryModal(false);
        // Refresh party details
        const partyRes = await fetch(`/api/khata/parties/${selectedParty.id}`);
        const freshParty = await partyRes.json();
        setSelectedParty(freshParty);
        fetchParties();
      }
    } catch (e) {
      alert("Failed to record khata entry");
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm("Delete this ledger entry?")) return;
    try {
      await fetch(`/api/khata/entries/${entryId}`, { method: "DELETE" });
      if (selectedParty) {
        const partyRes = await fetch(`/api/khata/parties/${selectedParty.id}`);
        const freshParty = await partyRes.json();
        setSelectedParty(freshParty);
      }
      fetchParties();
    } catch (e) {
      console.warn("Delete entry failed:", e);
    }
  };

  const handleDeleteParty = async (partyId: string) => {
    if (!confirm("Are you sure you want to delete this contact and all their history?")) return;
    try {
      await fetch(`/api/khata/parties/${partyId}`, { method: "DELETE" });
      setSelectedParty(null);
      fetchParties();
    } catch (e) {
      console.warn("Delete party failed:", e);
    }
  };

  // Summaries
  const totalReceivable = parties.reduce((sum, p) => sum + (p.netBalance > 0 ? p.netBalance : 0), 0);
  const totalPayable = parties.reduce((sum, p) => sum + (p.netBalance < 0 ? Math.abs(p.netBalance) : 0), 0);

  // Filtered parties
  const filteredParties = parties.filter((p) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchesName = p.name.toLowerCase().includes(q);
      const matchesPhone = p.phone?.toLowerCase().includes(q);
      if (!matchesName && !matchesPhone) return false;
    }
    if (filterType === "RECEIVABLE" && p.netBalance <= 0) return false;
    if (filterType === "PAYABLE" && p.netBalance >= 0) return false;
    return true;
  });

  const sendWhatsAppReminder = (party: KhataParty) => {
    const cleanPhone = (party.phone || "").replace(/\D/g, "");
    const msg = `Namaste ${party.name}, gentle reminder regarding your balance of ${business.currency} ${Math.abs(
      party.netBalance
    ).toLocaleString()} with ${business.name}. Please settle at your earliest convenience. Thank you!`;
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-24 pt-3">
      {/* Khata Summary Cards */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {/* You Will Get (Maine Diye / Udhar diya) */}
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col justify-between">
          <div className="flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="w-4 h-4" />
            <span>You Will Get (लेना है)</span>
          </div>
          <div className="mt-2 font-mono font-extrabold text-base text-emerald-600 dark:text-emerald-400 truncate">
            {business.currency} {totalReceivable.toLocaleString()}
          </div>
        </div>

        {/* You Will Give (Maine Liye / Dena hai) */}
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex flex-col justify-between">
          <div className="flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            <ArrowDownLeft className="w-4 h-4" />
            <span>You Will Give (देना है)</span>
          </div>
          <div className="mt-2 font-mono font-extrabold text-base text-rose-600 dark:text-rose-400 truncate">
            {business.currency} {totalPayable.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Action Bar: Search & Add Party */}
      <div className="flex items-center space-x-2 mb-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search party by name / phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none"
          />
        </div>

        <button
          onClick={() => setShowAddPartyModal(true)}
          className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm active-press flex-shrink-0"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>+ Add Party</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1.5 mb-3">
        <button
          onClick={() => setFilterType("ALL")}
          className={`px-3 py-1 rounded-xl text-[11px] font-semibold transition-all ${
            filterType === "ALL"
              ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
              : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
          }`}
        >
          All ({parties.length})
        </button>
        <button
          onClick={() => setFilterType("RECEIVABLE")}
          className={`px-3 py-1 rounded-xl text-[11px] font-semibold transition-all ${
            filterType === "RECEIVABLE"
              ? "bg-emerald-600 text-white"
              : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
          }`}
        >
          You Will Get
        </button>
        <button
          onClick={() => setFilterType("PAYABLE")}
          className={`px-3 py-1 rounded-xl text-[11px] font-semibold transition-all ${
            filterType === "PAYABLE"
              ? "bg-rose-600 text-white"
              : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
          }`}
        >
          You Will Give
        </button>
      </div>

      {/* Parties List */}
      <div className="space-y-2">
        {filteredParties.map((party) => {
          const isReceivable = party.netBalance > 0;
          const isPayable = party.netBalance < 0;
          const isSettled = party.netBalance === 0;

          return (
            <div
              key={party.id}
              onClick={() => setSelectedParty(party)}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs flex items-center justify-between cursor-pointer active-press"
            >
              <div className="flex items-center space-x-3 truncate">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {party.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex flex-col truncate">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {party.name}
                  </span>
                  <div className="flex items-center space-x-1.5 text-[10px] text-slate-400">
                    {party.phone && <span>{party.phone}</span>}
                    {party.notes && (
                      <>
                        <span>•</span>
                        <span className="truncate italic">{party.notes}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <div
                  className={`text-xs font-extrabold font-mono ${
                    isReceivable
                      ? "text-emerald-500"
                      : isPayable
                      ? "text-rose-500"
                      : "text-slate-400"
                  }`}
                >
                  {business.currency} {Math.abs(party.netBalance).toLocaleString()}
                </div>
                <div className="text-[10px] font-semibold text-slate-400">
                  {isReceivable ? "You Will Get" : isPayable ? "You Will Give" : "Settled"}
                </div>
              </div>
            </div>
          );
        })}

        {filteredParties.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen className="w-10 h-10 mx-auto text-slate-400 mb-2" />
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              No contacts found
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Tap &quot;+ Add Party&quot; to maintain borrow/lend khata
            </p>
          </div>
        )}
      </div>

      {/* Party Detail & Ledger Sheet Modal */}
      {selectedParty && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full max-w-md h-[90vh] sm:h-auto sm:max-h-[85vh] bg-white dark:bg-slate-950 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center justify-center">
                  {selectedParty.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {selectedParty.name}
                  </h3>
                  <p className="text-[10px] text-slate-400">{selectedParty.phone || "No phone added"}</p>
                </div>
              </div>

              <div className="flex items-center space-x-1.5">
                {selectedParty.phone && (
                  <button
                    onClick={() => sendWhatsAppReminder(selectedParty)}
                    title="Send WhatsApp Reminder"
                    className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 active-press"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDeleteParty(selectedParty.id)}
                  title="Delete Party"
                  className="p-2 rounded-xl text-slate-400 hover:text-red-400 active-press"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedParty(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 active-press"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Running Balance Banner */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Net Balance
                </span>
                <div
                  className={`text-lg font-mono font-extrabold ${
                    selectedParty.netBalance > 0
                      ? "text-emerald-500"
                      : selectedParty.netBalance < 0
                      ? "text-rose-500"
                      : "text-slate-400"
                  }`}
                >
                  {business.currency} {Math.abs(selectedParty.netBalance).toLocaleString()}
                </div>
              </div>
              <div className="text-right text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {selectedParty.netBalance > 0
                  ? "You will get (लेना है)"
                  : selectedParty.netBalance < 0
                  ? "You will give (देना है)"
                  : "All Settled (बराबर)"}
              </div>
            </div>

            {/* Entries Ledger Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Transaction History ({selectedParty.entries?.length || 0})
              </span>

              {selectedParty.entries?.map((entry) => {
                const isGave = entry.type === "GAVE"; // You gave
                return (
                  <div
                    key={entry.id}
                    className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between shadow-xs"
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isGave ? "bg-rose-500/15 text-rose-500" : "bg-emerald-500/15 text-emerald-500"
                        }`}
                      >
                        {isGave ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownLeft className="w-3.5 h-3.5" />}
                      </div>

                      <div className="flex flex-col truncate">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {entry.description || (isGave ? "Maine Diye (You Gave)" : "Maine Liye (You Got)")}
                        </span>
                        <div className="flex items-center space-x-1.5 text-[10px] text-slate-400">
                          <span>{new Date(entry.date).toLocaleDateString()}</span>
                          <span>•</span>
                          <span className="uppercase">{entry.paymentMode}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span
                        className={`text-xs font-extrabold font-mono ${
                          isGave ? "text-rose-500" : "text-emerald-500"
                        }`}
                      >
                        {isGave ? "-" : "+"}
                        {business.currency} {entry.amount.toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-400 active-press"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {(!selectedParty.entries || selectedParty.entries.length === 0) && (
                <div className="text-center py-8 text-xs text-slate-400">
                  No ledger entries recorded yet for {selectedParty.name}.
                </div>
              )}
            </div>

            {/* Bottom 2 Big Buttons: You Gave / You Got */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 grid grid-cols-2 gap-3 safe-bottom">
              <button
                onClick={() => {
                  setEntryType("GAVE");
                  setShowAddEntryModal(true);
                }}
                className="py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-md shadow-rose-600/20 active-press"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>- Maine Diye (You Gave)</span>
              </button>

              <button
                onClick={() => {
                  setEntryType("GOT");
                  setShowAddEntryModal(true);
                }}
                className="py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/20 active-press"
              >
                <ArrowDownLeft className="w-4 h-4" />
                <span>+ Maine Liye (You Got)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Party Modal */}
      {showAddPartyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Add Customer / Supplier
              </h3>
              <button
                onClick={() => setShowAddPartyModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateParty} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Name (नाम) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar, City Transport"
                  value={partyName}
                  onChange={(e) => setPartyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Phone / WhatsApp (फोन)
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={partyPhone}
                  onChange={(e) => setPartyPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Notes / Address (विवरण)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Regular vendor, Timber supplier"
                  value={partyNotes}
                  onChange={(e) => setPartyNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddPartyModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                >
                  Save Party
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Khata Entry Modal */}
      {showAddEntryModal && selectedParty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {entryType === "GAVE" ? "Maine Diye (You Gave)" : "Maine Liye (You Got)"}
              </h3>
              <button
                onClick={() => setShowAddEntryModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEntry} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Amount ({business.currency}) *
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  autoFocus
                  placeholder="0.00"
                  value={entryAmount}
                  onChange={(e) => setEntryAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-lg font-bold font-mono text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Description / Item (विवरण)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5 sheets plywood, Cash given, Bill #201"
                  value={entryDesc}
                  onChange={(e) => setEntryDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={entryMode}
                    onChange={(e) => setEntryMode(e.target.value as any)}
                    className="w-full px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none"
                  >
                    <option value="CASH">Cash</option>
                    <option value="ONLINE">Online / UPI</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    className="w-full px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddEntryModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-2.5 rounded-xl text-white text-xs font-bold shadow-md ${
                    entryType === "GAVE"
                      ? "bg-rose-600 hover:bg-rose-500 shadow-rose-600/30"
                      : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30"
                  }`}
                >
                  Record Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
