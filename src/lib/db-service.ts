import { prisma } from "./prisma";

// In-memory fallback dataset for when DATABASE_URL is not yet connected to NeonDB
const defaultMockData = {
  config: {
    id: "default",
    passcode: "0000",
    appName: "Daily Business Expense & Khata",
  },
  businesses: [
    {
      id: "biz-plywood",
      name: "Plywood Business",
      category: "Manufacturing & Retail",
      description: "Timber, laminates, and wood trade",
      currency: "₹",
      color: "amber",
      icon: "box",
      isDefault: true,
      createdAt: new Date(),
    },
    {
      id: "biz-restaurant",
      name: "Restaurant",
      category: "Food & Dining",
      description: "Daily food, ingredients, and cafe counter",
      currency: "₹",
      color: "rose",
      icon: "utensils",
      isDefault: false,
      createdAt: new Date(),
    },
    {
      id: "biz-carrental",
      name: "Car Rental Business",
      category: "Transport & Logistics",
      description: "Fleet, cabs, bookings, and fleet maintenance",
      currency: "₹",
      color: "blue",
      icon: "car",
      isDefault: false,
      createdAt: new Date(),
    },
  ],
  frequentTags: [
    // Plywood tags
    { id: "tag-1", businessId: "biz-plywood", label: "Plywood Sheets", usageCount: 15 },
    { id: "tag-2", businessId: "biz-plywood", label: "Timber Wood", usageCount: 10 },
    { id: "tag-3", businessId: "biz-plywood", label: "Laminate Mica", usageCount: 8 },
    { id: "tag-4", businessId: "biz-plywood", label: "Fevicol & Glue", usageCount: 12 },
    { id: "tag-5", businessId: "biz-plywood", label: "Hardware & Screws", usageCount: 6 },
    { id: "tag-6", businessId: "biz-plywood", label: "Transport / Freight", usageCount: 9 },
    { id: "tag-7", businessId: "biz-plywood", label: "Labor Wages", usageCount: 14 },
    { id: "tag-8", businessId: "biz-plywood", label: "Electricity", usageCount: 4 },
    // Restaurant tags
    { id: "tag-9", businessId: "biz-restaurant", label: "Vegetables", usageCount: 22 },
    { id: "tag-10", businessId: "biz-restaurant", label: "Dairy & Milk", usageCount: 18 },
    { id: "tag-11", businessId: "biz-restaurant", label: "Cooking Oil", usageCount: 12 },
    { id: "tag-12", businessId: "biz-restaurant", label: "Gas Cylinder", usageCount: 9 },
    { id: "tag-13", businessId: "biz-restaurant", label: "Chef Wages", usageCount: 15 },
    { id: "tag-14", businessId: "biz-restaurant", label: "Packaging Boxes", usageCount: 11 },
    { id: "tag-15", businessId: "biz-restaurant", label: "Cleaning Supplies", usageCount: 7 },
    // Car rental tags
    { id: "tag-16", businessId: "biz-carrental", label: "Diesel / Petrol", usageCount: 30 },
    { id: "tag-17", businessId: "biz-carrental", label: "Car Wash", usageCount: 14 },
    { id: "tag-18", businessId: "biz-carrental", label: "Fastag / Toll", usageCount: 19 },
    { id: "tag-19", businessId: "biz-carrental", label: "Routine Service", usageCount: 8 },
    { id: "tag-20", businessId: "biz-carrental", label: "Driver Bata", usageCount: 16 },
  ],
  transactions: [
    // Plywood
    {
      id: "tx-1",
      businessId: "biz-plywood",
      type: "INCOME",
      amount: 25000,
      title: "Balaji Furniture Advance",
      paymentMode: "ONLINE",
      date: new Date(Date.now() - 86400000),
      note: "UPI transaction received",
      createdAt: new Date(),
    },
    {
      id: "tx-2",
      businessId: "biz-plywood",
      type: "INCOME",
      amount: 4800,
      title: "Retail Counter Sale - 4 Sheets",
      paymentMode: "CASH",
      date: new Date(),
      note: "Cash counter",
      createdAt: new Date(),
    },
    {
      id: "tx-3",
      businessId: "biz-plywood",
      type: "EXPENSE",
      amount: 3200,
      title: "Fevicol & Glue Stock",
      paymentMode: "ONLINE",
      date: new Date(Date.now() - 86400000),
      note: "Shop supplies",
      createdAt: new Date(),
    },
    {
      id: "tx-4",
      businessId: "biz-plywood",
      type: "EXPENSE",
      amount: 1400,
      title: "Labor Wages (Loading)",
      paymentMode: "CASH",
      date: new Date(),
      note: "Evening cash settlement",
      createdAt: new Date(),
    },
    // Restaurant
    {
      id: "tx-5",
      businessId: "biz-restaurant",
      type: "INCOME",
      amount: 18450,
      title: "Lunch Counter UPI Payments",
      paymentMode: "ONLINE",
      date: new Date(),
      note: "QR code scans",
      createdAt: new Date(),
    },
    {
      id: "tx-6",
      businessId: "biz-restaurant",
      type: "EXPENSE",
      amount: 2850,
      title: "Vegetables (Mandi purchase)",
      paymentMode: "CASH",
      date: new Date(),
      note: "Morning market purchase",
      createdAt: new Date(),
    },
    // Car Rental
    {
      id: "tx-7",
      businessId: "biz-carrental",
      type: "INCOME",
      amount: 14500,
      title: "Outstation Ertiga 3-Day Trip",
      paymentMode: "ONLINE",
      date: new Date(),
      note: "Bank transfer",
      createdAt: new Date(),
    },
    {
      id: "tx-8",
      businessId: "biz-carrental",
      type: "EXPENSE",
      amount: 4600,
      title: "Diesel Full Tank (Innova)",
      paymentMode: "ONLINE",
      date: new Date(),
      note: "IOCL pump card swipe",
      createdAt: new Date(),
    },
  ],
  parties: [
    {
      id: "party-1",
      businessId: "biz-plywood",
      name: "Sharma Furniture Works",
      phone: "+91 98765 43210",
      notes: "Wholesale furniture maker",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "party-2",
      businessId: "biz-plywood",
      name: "Greenlam Distributor",
      phone: "+91 98111 22233",
      notes: "Mica laminate supplier",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "party-3",
      businessId: "biz-restaurant",
      name: "Raju Vegetable Mandi",
      phone: "+91 97654 32198",
      notes: "Daily vegetable vendor",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  khataEntries: [
    {
      id: "ke-1",
      partyId: "party-1",
      type: "GAVE",
      amount: 18000,
      description: "Delivered 15 sheets on credit",
      paymentMode: "ONLINE",
      isSettled: false,
      date: new Date(Date.now() - 86400000 * 4),
      createdAt: new Date(),
    },
    {
      id: "ke-2",
      partyId: "party-1",
      type: "GOT",
      amount: 10000,
      description: "UPI advance payment",
      paymentMode: "ONLINE",
      isSettled: false,
      date: new Date(Date.now() - 86400000 * 2),
      createdAt: new Date(),
    },
    {
      id: "ke-3",
      partyId: "party-2",
      type: "GOT",
      amount: 24000,
      description: "Stock laminate sheets received",
      paymentMode: "ONLINE",
      isSettled: false,
      date: new Date(Date.now() - 86400000 * 6),
      createdAt: new Date(),
    },
    {
      id: "ke-4",
      partyId: "party-2",
      type: "GAVE",
      amount: 15000,
      description: "NEFT partial bill settlement",
      paymentMode: "ONLINE",
      isSettled: false,
      date: new Date(Date.now() - 86400000 * 3),
      createdAt: new Date(),
    },
    {
      id: "ke-5",
      partyId: "party-3",
      type: "GOT",
      amount: 4500,
      description: "Vegetables week supply bill",
      paymentMode: "CASH",
      isSettled: false,
      date: new Date(Date.now() - 86400000 * 2),
      createdAt: new Date(),
    },
    {
      id: "ke-6",
      partyId: "party-3",
      type: "GAVE",
      amount: 3000,
      description: "Cash paid on counter",
      paymentMode: "CASH",
      isSettled: false,
      date: new Date(Date.now() - 86400000),
      createdAt: new Date(),
    },
  ],
};

let memStore = { ...defaultMockData };

// Helper to test if Prisma DB is reachable
let isPrismaConnected: boolean | null = null;
let lastConnectionAttempt = 0;

export async function checkDbConnection(): Promise<boolean> {
  const now = Date.now();
  if (isPrismaConnected !== null && now - lastConnectionAttempt < 15000) {
    return isPrismaConnected;
  }
  lastConnectionAttempt = now;

  try {
    // Quick test query with 3s timeout
    const testPromise = prisma.appConfig.findFirst();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 3000)
    );
    await Promise.race([testPromise, timeoutPromise]);
    isPrismaConnected = true;
    return true;
  } catch {
    isPrismaConnected = false;
    return false;
  }
}

// ---------------- PASSCODE & CONFIG ----------------
export async function getPasscode(): Promise<string> {
  const connected = await checkDbConnection();
  if (connected) {
    try {
      let config = await prisma.appConfig.findUnique({ where: { id: "default" } });
      if (!config) {
        config = await prisma.appConfig.create({
          data: { id: "default", passcode: "0000" },
        });
      }
      return config.passcode;
    } catch (e) {
      console.warn("Falling back to memStore for passcode:", e);
    }
  }
  return memStore.config.passcode;
}

export async function setPasscode(newPasscode: string): Promise<boolean> {
  memStore.config.passcode = newPasscode;
  const connected = await checkDbConnection();
  if (connected) {
    try {
      await prisma.appConfig.upsert({
        where: { id: "default" },
        update: { passcode: newPasscode },
        create: { id: "default", passcode: newPasscode },
      });
      return true;
    } catch (e) {
      console.warn("Error updating passcode in DB:", e);
    }
  }
  return true;
}

export async function verifyPasscode(inputPin: string): Promise<boolean> {
  const current = await getPasscode();
  return current.trim() === inputPin.trim();
}

// ---------------- BUSINESS PROFILES ----------------
export async function getBusinesses() {
  const connected = await checkDbConnection();
  if (connected) {
    try {
      const list = await prisma.businessProfile.findMany({
        orderBy: { createdAt: "asc" },
        include: {
          _count: {
            select: { transactions: true, parties: true },
          },
        },
      });
      if (list.length > 0) return list;
    } catch (e) {
      console.warn("Falling back to memStore for businesses:", e);
    }
  }
  return memStore.businesses.map((b) => ({
    ...b,
    _count: {
      transactions: memStore.transactions.filter((t) => t.businessId === b.id).length,
      parties: memStore.parties.filter((p) => p.businessId === b.id).length,
    },
  }));
}

export async function getBusiness(id: string) {
  const businesses = await getBusinesses();
  return businesses.find((b) => b.id === id) || businesses[0] || null;
}

export async function createBusiness(data: {
  name: string;
  category?: string;
  description?: string;
  currency?: string;
  color?: string;
  icon?: string;
}) {
  const connected = await checkDbConnection();
  if (connected) {
    try {
      const created = await prisma.businessProfile.create({
        data: {
          name: data.name,
          category: data.category || "General Business",
          description: data.description || "",
          currency: data.currency || "₹",
          color: data.color || "emerald",
          icon: data.icon || "briefcase",
        },
      });
      // Add default suggestion tags
      const defaultTags = ["General Expense", "Labor", "Rent", "Transport", "Supplies"];
      for (const t of defaultTags) {
        await prisma.frequentExpenseTag.create({
          data: { businessId: created.id, label: t, usageCount: 1 },
        });
      }
      return created;
    } catch (e) {
      console.warn("Falling back to memStore for createBusiness:", e);
    }
  }

  const newBiz = {
    id: `biz-${Date.now()}`,
    name: data.name,
    category: data.category || "General Business",
    description: data.description || "",
    currency: data.currency || "₹",
    color: data.color || "emerald",
    icon: data.icon || "briefcase",
    isDefault: false,
    createdAt: new Date(),
  };
  memStore.businesses.push(newBiz);

  // Add default tags
  ["General Expense", "Labor", "Rent", "Transport", "Supplies"].forEach((t, i) => {
    memStore.frequentTags.push({
      id: `tag-${Date.now()}-${i}`,
      businessId: newBiz.id,
      label: t,
      usageCount: 1,
    });
  });

  return newBiz;
}

export async function updateBusiness(
  id: string,
  data: {
    name?: string;
    category?: string;
    description?: string;
    currency?: string;
    color?: string;
    icon?: string;
  }
) {
  const connected = await checkDbConnection();
  if (connected) {
    try {
      return await prisma.businessProfile.update({
        where: { id },
        data,
      });
    } catch (e) {
      console.warn("DB error in updateBusiness:", e);
    }
  }

  const idx = memStore.businesses.findIndex((b) => b.id === id);
  if (idx !== -1) {
    memStore.businesses[idx] = { ...memStore.businesses[idx], ...data };
    return memStore.businesses[idx];
  }
  return null;
}

export async function deleteBusiness(id: string) {
  const connected = await checkDbConnection();
  if (connected) {
    try {
      await prisma.businessProfile.delete({ where: { id } });
      return true;
    } catch (e) {
      console.warn("DB error in deleteBusiness:", e);
    }
  }

  memStore.businesses = memStore.businesses.filter((b) => b.id !== id);
  memStore.transactions = memStore.transactions.filter((t) => t.businessId !== id);
  memStore.frequentTags = memStore.frequentTags.filter((t) => t.businessId !== id);
  memStore.parties = memStore.parties.filter((p) => p.businessId !== id);
  return true;
}

// ---------------- FREQUENT EXPENSE TAGS ----------------
export async function getFrequentTags(businessId: string) {
  const connected = await checkDbConnection();
  if (connected) {
    try {
      const tags = await prisma.frequentExpenseTag.findMany({
        where: { businessId },
        orderBy: { usageCount: "desc" },
        take: 20,
      });
      if (tags.length > 0) return tags;
    } catch (e) {
      console.warn("Falling back to memStore for tags:", e);
    }
  }

  return memStore.frequentTags
    .filter((t) => t.businessId === businessId)
    .sort((a, b) => b.usageCount - a.usageCount);
}

export async function addOrIncrementFrequentTag(businessId: string, label: string) {
  const cleanLabel = label.trim();
  if (!cleanLabel) return null;

  const connected = await checkDbConnection();
  if (connected) {
    try {
      return await prisma.frequentExpenseTag.upsert({
        where: { businessId_label: { businessId, label: cleanLabel } },
        update: { usageCount: { increment: 1 } },
        create: { businessId, label: cleanLabel, usageCount: 1 },
      });
    } catch (e) {
      console.warn("Error upserting tag in DB:", e);
    }
  }

  const existing = memStore.frequentTags.find(
    (t) => t.businessId === businessId && t.label.toLowerCase() === cleanLabel.toLowerCase()
  );
  if (existing) {
    existing.usageCount++;
    return existing;
  } else {
    const newTag = {
      id: `tag-${Date.now()}`,
      businessId,
      label: cleanLabel,
      usageCount: 1,
    };
    memStore.frequentTags.push(newTag);
    return newTag;
  }
}

export async function deleteFrequentTag(id: string) {
  const connected = await checkDbConnection();
  if (connected) {
    try {
      await prisma.frequentExpenseTag.delete({ where: { id } });
      return true;
    } catch (e) {
      console.warn("DB error deleting tag:", e);
    }
  }
  memStore.frequentTags = memStore.frequentTags.filter((t) => t.id !== id);
  return true;
}

// ---------------- TRANSACTIONS ----------------
export async function getTransactions(
  businessId: string,
  filters: {
    type?: string;
    paymentMode?: string;
    period?: string; // "today" | "week" | "month" | "year" | "all"
    search?: string;
    startDate?: string;
    endDate?: string;
  } = {}
) {
  const connected = await checkDbConnection();

  let dateFilter: { gte?: Date; lte?: Date } | undefined;
  const now = new Date();

  if (filters.startDate || filters.endDate) {
    dateFilter = {};
    if (filters.startDate) dateFilter.gte = new Date(filters.startDate);
    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter.lte = end;
    }
  } else if (filters.period) {
    if (filters.period === "today") {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      dateFilter = { gte: start };
    } else if (filters.period === "week") {
      const start = new Date(now);
      const day = start.getDay();
      const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Monday
      start.setDate(diff);
      start.setHours(0, 0, 0, 0);
      dateFilter = { gte: start };
    } else if (filters.period === "month") {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      dateFilter = { gte: start };
    } else if (filters.period === "year") {
      const start = new Date(now.getFullYear(), 0, 1);
      dateFilter = { gte: start };
    }
  }

  if (connected) {
    try {
      const where: any = { businessId };
      if (filters.type && filters.type !== "ALL") where.type = filters.type;
      if (filters.paymentMode && filters.paymentMode !== "ALL")
        where.paymentMode = filters.paymentMode;
      if (dateFilter) where.date = dateFilter;
      if (filters.search) {
        where.OR = [
          { title: { contains: filters.search, mode: "insensitive" } },
          { note: { contains: filters.search, mode: "insensitive" } },
        ];
      }

      return await prisma.transaction.findMany({
        where,
        orderBy: { date: "desc" },
      });
    } catch (e) {
      console.warn("Falling back to memStore for transactions:", e);
    }
  }

  // Filter memStore
  return memStore.transactions
    .filter((t) => {
      if (t.businessId !== businessId) return false;
      if (filters.type && filters.type !== "ALL" && t.type !== filters.type) return false;
      if (filters.paymentMode && filters.paymentMode !== "ALL" && t.paymentMode !== filters.paymentMode)
        return false;
      if (dateFilter?.gte && new Date(t.date) < dateFilter.gte) return false;
      if (dateFilter?.lte && new Date(t.date) > dateFilter.lte) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesNote = t.note?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesNote) return false;
      }
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function createTransaction(data: {
  businessId: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  title: string;
  paymentMode: "ONLINE" | "CASH" | "OTHER";
  date?: string | Date;
  note?: string;
}) {
  const transactionDate = data.date ? new Date(data.date) : new Date();

  // If expense, increment or add frequent tag
  if (data.type === "EXPENSE" && data.title) {
    addOrIncrementFrequentTag(data.businessId, data.title).catch(() => {});
  }

  const connected = await checkDbConnection();
  if (connected) {
    try {
      return await prisma.transaction.create({
        data: {
          businessId: data.businessId,
          type: data.type,
          amount: Number(data.amount),
          title: data.title,
          paymentMode: data.paymentMode,
          date: transactionDate,
          note: data.note || null,
        },
      });
    } catch (e) {
      console.warn("Falling back to memStore for createTransaction:", e);
    }
  }

  const newTx = {
    id: `tx-${Date.now()}`,
    businessId: data.businessId,
    type: data.type,
    amount: Number(data.amount),
    title: data.title,
    paymentMode: data.paymentMode,
    date: transactionDate,
    note: data.note || "",
    createdAt: new Date(),
  };
  memStore.transactions.unshift(newTx);
  return newTx;
}

export async function updateTransaction(
  id: string,
  data: {
    amount?: number;
    title?: string;
    paymentMode?: "ONLINE" | "CASH" | "OTHER";
    date?: string | Date;
    note?: string;
  }
) {
  const connected = await checkDbConnection();
  if (connected) {
    try {
      return await prisma.transaction.update({
        where: { id },
        data: {
          ...(data.amount !== undefined && { amount: Number(data.amount) }),
          ...(data.title !== undefined && { title: data.title }),
          ...(data.paymentMode !== undefined && { paymentMode: data.paymentMode }),
          ...(data.date !== undefined && { date: new Date(data.date) }),
          ...(data.note !== undefined && { note: data.note }),
        },
      });
    } catch (e) {
      console.warn("Error updating transaction:", e);
    }
  }

  const idx = memStore.transactions.findIndex((t) => t.id === id);
  if (idx !== -1) {
    const existing = memStore.transactions[idx];
    memStore.transactions[idx] = {
      ...existing,
      ...(data.amount !== undefined && { amount: Number(data.amount) }),
      ...(data.title !== undefined && { title: data.title }),
      ...(data.paymentMode !== undefined && { paymentMode: data.paymentMode }),
      ...(data.date !== undefined && { date: new Date(data.date) }),
      ...(data.note !== undefined && { note: data.note }),
    };
    return memStore.transactions[idx];
  }
  return null;
}

export async function deleteTransaction(id: string) {
  const connected = await checkDbConnection();
  if (connected) {
    try {
      await prisma.transaction.delete({ where: { id } });
      return true;
    } catch (e) {
      console.warn("Error deleting transaction in DB:", e);
    }
  }
  memStore.transactions = memStore.transactions.filter((t) => t.id !== id);
  return true;
}

// ---------------- KHATA BOOK / LEDGER ----------------
export async function getKhataParties(businessId: string) {
  const connected = await checkDbConnection();
  if (connected) {
    try {
      const parties = await prisma.khataParty.findMany({
        where: { businessId },
        include: {
          entries: {
            orderBy: { date: "desc" },
          },
        },
        orderBy: { updatedAt: "desc" },
      });

      return parties.map((p) => {
        const totalGave = p.entries
          .filter((e) => e.type === "GAVE" && !e.isSettled)
          .reduce((sum, e) => sum + e.amount, 0);
        const totalGot = p.entries
          .filter((e) => e.type === "GOT" && !e.isSettled)
          .reduce((sum, e) => sum + e.amount, 0);
        return {
          ...p,
          totalGave, // Maine Diye (You will receive)
          totalGot, // Maine Liye (You will pay)
          netBalance: totalGave - totalGot, // Positive: party owes you; Negative: you owe party
          lastEntryDate: p.entries[0]?.date || p.createdAt,
        };
      });
    } catch (e) {
      console.warn("Falling back to memStore for khata parties:", e);
    }
  }

  const parties = memStore.parties.filter((p) => p.businessId === businessId);
  return parties.map((p) => {
    const entries = memStore.khataEntries.filter((e) => e.partyId === p.id);
    const totalGave = entries
      .filter((e) => e.type === "GAVE" && !e.isSettled)
      .reduce((sum, e) => sum + e.amount, 0);
    const totalGot = entries
      .filter((e) => e.type === "GOT" && !e.isSettled)
      .reduce((sum, e) => sum + e.amount, 0);
    return {
      ...p,
      entries,
      totalGave,
      totalGot,
      netBalance: totalGave - totalGot,
      lastEntryDate: entries[0]?.date || p.createdAt,
    };
  });
}

export async function getKhataParty(partyId: string) {
  const connected = await checkDbConnection();
  if (connected) {
    try {
      const party = await prisma.khataParty.findUnique({
        where: { id: partyId },
        include: {
          entries: {
            orderBy: { date: "desc" },
          },
        },
      });
      if (party) {
        const totalGave = party.entries
          .filter((e) => e.type === "GAVE" && !e.isSettled)
          .reduce((sum, e) => sum + e.amount, 0);
        const totalGot = party.entries
          .filter((e) => e.type === "GOT" && !e.isSettled)
          .reduce((sum, e) => sum + e.amount, 0);
        return {
          ...party,
          totalGave,
          totalGot,
          netBalance: totalGave - totalGot,
        };
      }
    } catch (e) {
      console.warn("DB error in getKhataParty:", e);
    }
  }

  const party = memStore.parties.find((p) => p.id === partyId);
  if (!party) return null;
  const entries = memStore.khataEntries
    .filter((e) => e.partyId === partyId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const totalGave = entries
    .filter((e) => e.type === "GAVE" && !e.isSettled)
    .reduce((sum, e) => sum + e.amount, 0);
  const totalGot = entries
    .filter((e) => e.type === "GOT" && !e.isSettled)
    .reduce((sum, e) => sum + e.amount, 0);

  return {
    ...party,
    entries,
    totalGave,
    totalGot,
    netBalance: totalGave - totalGot,
  };
}

export async function createKhataParty(data: {
  businessId: string;
  name: string;
  phone?: string;
  notes?: string;
}) {
  const connected = await checkDbConnection();
  if (connected) {
    try {
      return await prisma.khataParty.create({
        data: {
          businessId: data.businessId,
          name: data.name,
          phone: data.phone || null,
          notes: data.notes || null,
        },
      });
    } catch (e) {
      console.warn("DB error createKhataParty:", e);
    }
  }

  const newParty = {
    id: `party-${Date.now()}`,
    businessId: data.businessId,
    name: data.name,
    phone: data.phone || "",
    notes: data.notes || "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  memStore.parties.unshift(newParty);
  return newParty;
}

export async function updateKhataParty(
  partyId: string,
  data: {
    name?: string;
    phone?: string;
    notes?: string;
  }
) {
  const connected = await checkDbConnection();
  if (connected) {
    try {
      return await prisma.khataParty.update({
        where: { id: partyId },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.phone !== undefined && { phone: data.phone || null }),
          ...(data.notes !== undefined && { notes: data.notes || null }),
        },
      });
    } catch (e) {
      console.warn("DB error updateKhataParty:", e);
    }
  }

  const idx = memStore.parties.findIndex((p) => p.id === partyId);
  if (idx !== -1) {
    memStore.parties[idx] = { ...memStore.parties[idx], ...data, updatedAt: new Date() };
    return memStore.parties[idx];
  }
  return null;
}

export async function deleteKhataParty(partyId: string) {
  const connected = await checkDbConnection();
  if (connected) {
    try {
      await prisma.khataParty.delete({ where: { id: partyId } });
      return true;
    } catch (e) {
      console.warn("DB error deleteKhataParty:", e);
    }
  }

  memStore.parties = memStore.parties.filter((p) => p.id !== partyId);
  memStore.khataEntries = memStore.khataEntries.filter((e) => e.partyId !== partyId);
  return true;
}

export async function addKhataEntry(data: {
  partyId: string;
  type: "GAVE" | "GOT";
  amount: number;
  description?: string;
  paymentMode?: "ONLINE" | "CASH" | "OTHER";
  date?: string | Date;
}) {
  const entryDate = data.date ? new Date(data.date) : new Date();
  const connected = await checkDbConnection();

  if (connected) {
    try {
      const entry = await prisma.khataEntry.create({
        data: {
          partyId: data.partyId,
          type: data.type,
          amount: Number(data.amount),
          description: data.description || null,
          paymentMode: data.paymentMode || "CASH",
          date: entryDate,
        },
      });
      await prisma.khataParty.update({
        where: { id: data.partyId },
        data: { updatedAt: new Date() },
      });
      return entry;
    } catch (e) {
      console.warn("DB error addKhataEntry:", e);
    }
  }

  const newEntry = {
    id: `ke-${Date.now()}`,
    partyId: data.partyId,
    type: data.type,
    amount: Number(data.amount),
    description: data.description || "",
    paymentMode: data.paymentMode || "CASH",
    isSettled: false,
    date: entryDate,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  memStore.khataEntries.unshift(newEntry);
  return newEntry;
}

export async function deleteKhataEntry(entryId: string) {
  const connected = await checkDbConnection();
  if (connected) {
    try {
      await prisma.khataEntry.delete({ where: { id: entryId } });
      return true;
    } catch (e) {
      console.warn("DB error deleteKhataEntry:", e);
    }
  }
  memStore.khataEntries = memStore.khataEntries.filter((e) => e.id !== entryId);
  return true;
}

// ---------------- ANALYTICS & STATS ----------------
export async function getBusinessStats(
  businessId: string,
  period: "today" | "week" | "month" | "year" | "all" = "month"
) {
  const transactions = await getTransactions(businessId, { period });

  let totalIncome = 0;
  let totalExpense = 0;
  let onlineIncome = 0;
  let cashIncome = 0;
  let otherIncome = 0;
  let onlineExpense = 0;
  let cashExpense = 0;
  let otherExpense = 0;

  const expenseCategoriesMap: Record<string, number> = {};

  for (const t of transactions) {
    if (t.type === "INCOME") {
      totalIncome += t.amount;
      if (t.paymentMode === "ONLINE") onlineIncome += t.amount;
      else if (t.paymentMode === "CASH") cashIncome += t.amount;
      else otherIncome += t.amount;
    } else {
      totalExpense += t.amount;
      if (t.paymentMode === "ONLINE") onlineExpense += t.amount;
      else if (t.paymentMode === "CASH") cashExpense += t.amount;
      else otherExpense += t.amount;

      // Group expense title
      const cat = t.title || "Uncategorized";
      expenseCategoriesMap[cat] = (expenseCategoriesMap[cat] || 0) + t.amount;
    }
  }

  // Daily trend
  const dailyMap: Record<string, { income: number; expense: number }> = {};
  for (const t of transactions) {
    const d = new Date(t.date).toISOString().split("T")[0];
    if (!dailyMap[d]) dailyMap[d] = { income: 0, expense: 0 };
    if (t.type === "INCOME") dailyMap[d].income += t.amount;
    else dailyMap[d].expense += t.amount;
  }

  const dailyTrend = Object.keys(dailyMap)
    .sort()
    .slice(-14) // Last 14 active days
    .map((date) => ({
      date,
      income: dailyMap[date].income,
      expense: dailyMap[date].expense,
    }));

  const topExpenseCategories = Object.entries(expenseCategoriesMap)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8);

  return {
    period,
    totalIncome,
    totalExpense,
    netProfit: totalIncome - totalExpense,
    breakdown: {
      income: { online: onlineIncome, cash: cashIncome, other: otherIncome },
      expense: { online: onlineExpense, cash: cashExpense, other: otherExpense },
    },
    topExpenseCategories,
    dailyTrend,
    transactionCount: transactions.length,
  };
}

// ---------------- COMPREHENSIVE DAILY & KHATA SUMMARY ----------------
export async function getComprehensiveSummary(options: {
  businessId?: string; // "all" or specific business id
  dateStr?: string; // YYYY-MM-DD
}) {
  const connected = await checkDbConnection();
  const allBusinesses = await getBusinesses();
  const targetBusinesses =
    !options.businessId || options.businessId === "all"
      ? allBusinesses
      : allBusinesses.filter((b) => b.id === options.businessId);

  // Parse target date
  let startOfDay: Date;
  let endOfDay: Date;
  let effectiveDateStr = options.dateStr;

  if (effectiveDateStr) {
    const parts = effectiveDateStr.split("-").map(Number);
    startOfDay = new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0);
    endOfDay = new Date(parts[0], parts[1] - 1, parts[2], 23, 59, 59, 999);
  } else {
    const now = new Date();
    effectiveDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  }

  const businessSummaries = [];
  let grandTotalIncome = 0;
  let grandTotalExpense = 0;
  let grandTotalLena = 0;
  let grandTotalDena = 0;

  for (const biz of targetBusinesses) {
    // 1. Fetch transactions for this business on this day
    const transactions = await getTransactions(biz.id, {
      startDate: startOfDay.toISOString(),
      endDate: endOfDay.toISOString(),
    });

    let totalIncome = 0;
    let onlineIncome = 0;
    let cashIncome = 0;
    let otherIncome = 0;
    const incomeItems: Array<{ title: string; amount: number; paymentMode: string; note?: string | null }> = [];

    let totalExpense = 0;
    let onlineExpense = 0;
    let cashExpense = 0;
    let otherExpense = 0;
    const expenseItems: Array<{ title: string; amount: number; paymentMode: string; note?: string | null }> = [];

    for (const t of transactions) {
      if (t.type === "INCOME") {
        totalIncome += t.amount;
        if (t.paymentMode === "ONLINE") onlineIncome += t.amount;
        else if (t.paymentMode === "CASH") cashIncome += t.amount;
        else otherIncome += t.amount;
        incomeItems.push({
          title: t.title,
          amount: t.amount,
          paymentMode: t.paymentMode,
          note: t.note,
        });
      } else {
        totalExpense += t.amount;
        if (t.paymentMode === "ONLINE") onlineExpense += t.amount;
        else if (t.paymentMode === "CASH") cashExpense += t.amount;
        else otherExpense += t.amount;
        expenseItems.push({
          title: t.title,
          amount: t.amount,
          paymentMode: t.paymentMode,
          note: t.note,
        });
      }
    }

    // 2. Fetch Khata entries for this business on this day ONLY
    let dayKhataEntries: Array<{
      partyId: string;
      type: string;
      amount: number;
      party: { name: string; phone?: string | null };
    }> = [];

    if (connected) {
      try {
        const dbEntries = await prisma.khataEntry.findMany({
          where: {
            party: { businessId: biz.id },
            date: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
          include: {
            party: {
              select: { name: true, phone: true },
            },
          },
        });
        dayKhataEntries = dbEntries.map((e) => ({
          partyId: e.partyId,
          type: e.type,
          amount: e.amount,
          party: { name: e.party.name, phone: e.party.phone },
        }));
      } catch (e) {
        console.warn("DB error querying day khata entries:", e);
      }
    }

    if (dayKhataEntries.length === 0 && !connected) {
      const bizParties = memStore.parties.filter((p) => p.businessId === biz.id);
      const partyMap = new Map(bizParties.map((p) => [p.id, p]));
      dayKhataEntries = memStore.khataEntries
        .filter((e) => {
          if (!partyMap.has(e.partyId)) return false;
          const d = new Date(e.date);
          return d >= startOfDay && d <= endOfDay;
        })
        .map((e) => ({
          partyId: e.partyId,
          type: e.type,
          amount: e.amount,
          party: {
            name: partyMap.get(e.partyId)!.name,
            phone: partyMap.get(e.partyId)!.phone,
          },
        }));
    }

    const partyGaveMap: Record<string, { id: string; name: string; phone?: string | null; amount: number }> = {};
    const partyGotMap: Record<string, { id: string; name: string; phone?: string | null; amount: number }> = {};

    for (const entry of dayKhataEntries) {
      if (entry.type === "GAVE") {
        // You gave / Lena (लेना बाकी)
        if (!partyGaveMap[entry.partyId]) {
          partyGaveMap[entry.partyId] = {
            id: entry.partyId,
            name: entry.party.name,
            phone: entry.party.phone,
            amount: 0,
          };
        }
        partyGaveMap[entry.partyId].amount += entry.amount;
      } else if (entry.type === "GOT") {
        // You got / Dena (देना बाकी)
        if (!partyGotMap[entry.partyId]) {
          partyGotMap[entry.partyId] = {
            id: entry.partyId,
            name: entry.party.name,
            phone: entry.party.phone,
            amount: 0,
          };
        }
        partyGotMap[entry.partyId].amount += entry.amount;
      }
    }

    const lenaList = Object.values(partyGaveMap).sort((a, b) => b.amount - a.amount);
    const denaList = Object.values(partyGotMap).sort((a, b) => b.amount - a.amount);
    const totalLena = lenaList.reduce((s, p) => s + p.amount, 0);
    const totalDena = denaList.reduce((s, p) => s + p.amount, 0);

    grandTotalIncome += totalIncome;
    grandTotalExpense += totalExpense;
    grandTotalLena += totalLena;
    grandTotalDena += totalDena;

    businessSummaries.push({
      business: {
        id: biz.id,
        name: biz.name,
        category: biz.category,
        currency: biz.currency || "₹",
      },
      income: {
        total: totalIncome,
        online: onlineIncome,
        cash: cashIncome,
        other: otherIncome,
        items: incomeItems,
      },
      expenses: {
        total: totalExpense,
        online: onlineExpense,
        cash: cashExpense,
        other: otherExpense,
        items: expenseItems,
      },
      netBalance: totalIncome - totalExpense,
      khata: {
        lenaList,
        totalLena,
        denaList,
        totalDena,
      },
    });
  }

  return {
    date: effectiveDateStr,
    businesses: businessSummaries,
    grandTotal: {
      totalIncome: grandTotalIncome,
      totalExpense: grandTotalExpense,
      netBalance: grandTotalIncome - grandTotalExpense,
      totalLena: grandTotalLena,
      totalDena: grandTotalDena,
    },
  };
}
