// Utility to generate formatted WhatsApp messages with emojis and markdown

export interface SummaryBusinessData {
  business: {
    id: string;
    name: string;
    category?: string | null;
    currency: string;
  };
  income: {
    total: number;
    online: number;
    cash: number;
    other: number;
    items: Array<{ title: string; amount: number; paymentMode: string; note?: string | null }>;
  };
  expenses: {
    total: number;
    online: number;
    cash: number;
    other: number;
    items: Array<{ title: string; amount: number; paymentMode: string; note?: string | null }>;
  };
  netBalance: number;
  khata: {
    lenaList: Array<{ id: string; name: string; phone?: string | null; amount: number }>;
    totalLena: number;
    denaList: Array<{ id: string; name: string; phone?: string | null; amount: number }>;
    totalDena: number;
  };
}

export interface SummaryData {
  date: string; // YYYY-MM-DD
  businesses: SummaryBusinessData[];
  grandTotal: {
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
    totalLena: number;
    totalDena: number;
  };
}

export function formatDateLabel(dateStr: string): string {
  try {
    const parts = dateStr.split("-").map(Number);
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleDateString("en-US", { month: "short" });
    const year = d.getFullYear();
    return `${weekday}, ${day} ${month}, ${year}`;
  } catch {
    return dateStr;
  }
}

/**
 * Generates compact, clean formatted WhatsApp text for daily business hisab.
 */
export function generateWhatsAppDailySummary(
  data: SummaryData,
  options: {
    includeTransactions?: boolean;
    includeKhata?: boolean;
    showHindi?: boolean;
    isSingleBusiness?: boolean;
  } = {}
): string {
  const {
    includeTransactions = true,
    includeKhata = true,
    showHindi = true,
    isSingleBusiness = false,
  } = options;

  const dateFormatted = formatDateLabel(data.date);
  const lines: string[] = [];

  // Compact Header
  lines.push(`🗓️ *Date:* ${dateFormatted}`);
  lines.push("");

  const multiBiz = !isSingleBusiness && data.businesses.length > 1;

  // Loop through businesses
  data.businesses.forEach((b, index) => {
    const curr = b.business.currency || "₹";

    // Business Header
    if (multiBiz) {
      lines.push(`🏢 *${index + 1}. ${b.business.name.toUpperCase()}*`);
    } else {
      lines.push(`🏢 *${b.business.name.toUpperCase()}*`);
    }
    lines.push("");

    if (includeTransactions) {
      // Income section
      lines.push(
        showHindi
          ? `💰 *Income (जमा):* ${curr}${b.income.total.toLocaleString()}`
          : `💰 *Income:* ${curr}${b.income.total.toLocaleString()}`
      );
      if (b.income.total > 0) {
        if (b.income.online > 0) lines.push(`  • Online / UPI: ${curr}${b.income.online.toLocaleString()}`);
        if (b.income.cash > 0) lines.push(`  • Cash (नकद): ${curr}${b.income.cash.toLocaleString()}`);
        if (b.income.other > 0) lines.push(`  • Other: ${curr}${b.income.other.toLocaleString()}`);
      }
      lines.push("");

      // Expenses section
      lines.push(
        showHindi
          ? `💸 *Expenses (खर्च):* ${curr}${b.expenses.total.toLocaleString()}`
          : `💸 *Expenses:* ${curr}${b.expenses.total.toLocaleString()}`
      );
      if (b.expenses.items.length > 0) {
        b.expenses.items.forEach((item) => {
          const modeTag = item.paymentMode === "ONLINE" ? "Online" : item.paymentMode === "CASH" ? "Cash" : "Other";
          lines.push(`  • ${item.title}: ${curr}${item.amount.toLocaleString()} (${modeTag})`);
        });
      }
      lines.push("");

      // Net balance
      const netSign = b.netBalance >= 0 ? "+" : "";
      lines.push(
        showHindi
          ? `📈 *Net Balance (बचत):* ${netSign}${curr}${b.netBalance.toLocaleString()}`
          : `📈 *Net Balance:* ${netSign}${curr}${b.netBalance.toLocaleString()}`
      );
      lines.push("");
    }

    // Khata Status: ONLY if lena or dena entries exist for today!
    const hasLena = b.khata?.lenaList && b.khata.lenaList.length > 0;
    const hasDena = b.khata?.denaList && b.khata.denaList.length > 0;

    if (includeKhata && (hasLena || hasDena)) {
      lines.push(
        showHindi
          ? "🤝 *Khata Status (उधार खाता):*"
          : "🤝 *Khata Status:*"
      );

      if (hasLena) {
        lines.push(
          showHindi
            ? "  🟢 *Lena (You'll Get / लेना बाकी):*"
            : "  🟢 *Receivable (You'll Get):*"
        );
        b.khata.lenaList.forEach((party) => {
          lines.push(`    • ${party.name}: ${curr}${party.amount.toLocaleString()}`);
        });
        lines.push(`    👉 *Total Lena:* ${curr}${b.khata.totalLena.toLocaleString()}`);
      }

      if (hasDena) {
        lines.push(
          showHindi
            ? "  🔴 *Dena (You Owe / देना बाकी):*"
            : "  🔴 *Payable (You Owe):*"
        );
        b.khata.denaList.forEach((party) => {
          lines.push(`    • ${party.name}: ${curr}${party.amount.toLocaleString()}`);
        });
        lines.push(`    👉 *Total Dena:* ${curr}${b.khata.totalDena.toLocaleString()}`);
      }
      lines.push("");
    }

    // Separator between businesses if not the last one, or before grand totals
    if (multiBiz && index < data.businesses.length - 1) {
      lines.push("━━━━━━━━━━━━━━━━━━━━");
    }
  });

  // Grand Total Summary if multiple accounts are included
  if (multiBiz) {
    const curr = "₹";
    lines.push("━━━━━━━━━━━━━━━━━━━━");

    if (includeTransactions) {
      lines.push(`💵 *Total Income:* ${curr}${data.grandTotal.totalIncome.toLocaleString()}`);
      lines.push(`💳 *Total Expense:* ${curr}${data.grandTotal.totalExpense.toLocaleString()}`);
      const netSign = data.grandTotal.netBalance >= 0 ? "+" : "";
      lines.push(`💰 *Net Balance Today:* ${netSign}${curr}${data.grandTotal.netBalance.toLocaleString()}`);
    }

    const anyLenaToday = data.grandTotal.totalLena > 0;
    const anyDenaToday = data.grandTotal.totalDena > 0;
    if (includeKhata && (anyLenaToday || anyDenaToday)) {
      lines.push("");
      if (anyLenaToday) {
        lines.push(
          showHindi
            ? `🟢 *Total Lena (सभी से लेना):* ${curr}${data.grandTotal.totalLena.toLocaleString()}`
            : `🟢 *Total Receivable:* ${curr}${data.grandTotal.totalLena.toLocaleString()}`
        );
      }
      if (anyDenaToday) {
        lines.push(
          showHindi
            ? `🔴 *Total Dena (सभी को देना):* ${curr}${data.grandTotal.totalDena.toLocaleString()}`
            : `🔴 *Total Payable:* ${curr}${data.grandTotal.totalDena.toLocaleString()}`
        );
      }
    }
  }

  return lines.join("\n").trim();
}

/**
 * Format a single transaction receipt for sharing
 */
export function generateSingleTransactionText(
  tx: {
    title: string;
    amount: number;
    type: "INCOME" | "EXPENSE";
    paymentMode: string;
    date: string | Date;
    note?: string | null;
  },
  businessName: string,
  currency: string = "₹"
): string {
  const d = new Date(tx.date);
  const formattedDate = d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const lines = [
    `📝 *Transaction Receipt*`,
    `🏢 *Business:* ${businessName}`,
    `📅 *Date:* ${formattedDate}`,
    `🏷️ *Type:* ${tx.type === "INCOME" ? "Income (आमदनी)" : "Expense (खर्च)"}`,
    `📌 *Title:* ${tx.title}`,
    `💳 *Payment Mode:* ${tx.paymentMode === "ONLINE" ? "Online (UPI)" : tx.paymentMode === "CASH" ? "Cash (नकद)" : "Other"}`,
    `💵 *Amount:* ${currency}${tx.amount.toLocaleString()}`,
  ];

  if (tx.note) {
    lines.push(`📝 *Note:* ${tx.note}`);
  }

  lines.push(`_Sent via Daily Expense Tracker_`);
  return lines.join("\n");
}

/**
 * Format a single Khata party statement for sharing
 */
export function generateKhataPartyStatementText(
  party: {
    name: string;
    phone?: string | null;
    totalGave: number; // Diye
    totalGot: number; // Liye
    netBalance: number; // positive = lena, negative = dena
  },
  businessName: string,
  currency: string = "₹"
): string {
  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const isLena = party.netBalance > 0;
  const isDena = party.netBalance < 0;
  const absBal = Math.abs(party.netBalance);

  const lines = [
    `🤝 *Khata Statement - ${party.name}*`,
    `🏢 *Business:* ${businessName}`,
    `📅 *Date:* ${today}`,
  ];

  if (party.phone) {
    lines.push(`📞 *Contact:* ${party.phone}`);
  }

  lines.push("────────────────────");
  lines.push(`• Total Given (दिए): ${currency}${party.totalGave.toLocaleString()}`);
  lines.push(`• Total Received (लिए): ${currency}${party.totalGot.toLocaleString()}`);
  lines.push("────────────────────");

  if (isLena) {
    lines.push(`⚖️ *Pending Status:* You will GET ${currency}${absBal.toLocaleString()} (लेना बाकी)`);
    lines.push("");
    lines.push(`_Namaste! Please clear your pending balance of ${currency}${absBal.toLocaleString()} at your earliest convenience._`);
  } else if (isDena) {
    lines.push(`⚖️ *Pending Status:* You OWE ${currency}${absBal.toLocaleString()} (देना बाकी)`);
    lines.push("");
    lines.push(`_Hisab note: ${currency}${absBal.toLocaleString()} pending to be paid._`);
  } else {
    lines.push(`⚖️ *Pending Status:* All settled! ₹0 Balance (हिसाब चुकता)`);
  }

  lines.push("");
  lines.push(`_Generated via Daily Expense Tracker_`);
  return lines.join("\n");
}

/**
 * Copy text to clipboard with modern API & mobile fallback
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    console.warn("Clipboard API failed, using fallback:", err);
  }

  // Fallback for mobile / insecure contexts / older browsers
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "-9999px";
    textArea.style.left = "-9999px";
    textArea.setAttribute("readonly", "");
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error("Copy fallback failed:", err);
    return false;
  }
}

/**
 * Open WhatsApp with prefilled text
 */
export function openWhatsAppShare(text: string, phone?: string | null) {
  const cleanPhone = phone ? phone.replace(/[^0-9]/g, "") : "";
  const encoded = encodeURIComponent(text);

  let url = "";
  if (cleanPhone) {
    url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`;
  } else {
    url = `https://api.whatsapp.com/send?text=${encoded}`;
  }

  window.open(url, "_blank");
}

