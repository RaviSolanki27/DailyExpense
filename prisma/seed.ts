import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // 1. Ensure AppConfig with default 4-digit passcode "0000"
  await prisma.appConfig.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      passcode: "0000",
      appName: "Daily Business Expense & Khata",
    },
  });
  console.log("🔒 AppConfig initialized with default passcode '0000'");

  // 2. Default Business Profiles
  const businesses = [
    {
      name: "Plywood Business",
      category: "Manufacturing & Retail",
      description: "Timber, laminates, and wood trade",
      currency: "₹",
      color: "amber",
      icon: "box",
      isDefault: true,
      tags: [
        "Plywood Sheets",
        "Timber Wood",
        "Laminate Mica",
        "Fevicol & Glue",
        "Hardware & Screws",
        "Transport / Freight",
        "Labor Wages",
        "Shop Electricity",
        "Tea & Snacks",
      ],
      sampleIncome: [
        { title: "Counter Sales - Laminates", amount: 14500, paymentMode: "ONLINE", date: new Date(Date.now() - 86400000 * 2) },
        { title: "Balaji Furniture Advance", amount: 25000, paymentMode: "ONLINE", date: new Date(Date.now() - 86400000) },
        { title: "Retail Cash Sale - 4 Sheets", amount: 4800, paymentMode: "CASH", date: new Date() },
      ],
      sampleExpenses: [
        { title: "Transport / Freight", amount: 1800, paymentMode: "CASH", date: new Date(Date.now() - 86400000 * 2) },
        { title: "Fevicol & Glue Stock", amount: 3200, paymentMode: "ONLINE", date: new Date(Date.now() - 86400000) },
        { title: "Labor Loading Wages", amount: 1200, paymentMode: "CASH", date: new Date() },
      ],
      parties: [
        {
          name: "Sharma Furniture Works",
          phone: "+91 98765 43210",
          notes: "Regular client for marine plywood",
          entries: [
            { type: "GAVE", amount: 18000, description: "Delivered 15 sheets on credit", date: new Date(Date.now() - 86400000 * 5) },
            { type: "GOT", amount: 10000, description: "UPI advance received", date: new Date(Date.now() - 86400000 * 2) },
          ],
        },
        {
          name: "Greenlam Distributor",
          phone: "+91 98111 22233",
          notes: "Wholesale vendor for laminates",
          entries: [
            { type: "GOT", amount: 24000, description: "Stock purchased on credit", date: new Date(Date.now() - 86400000 * 7) },
            { type: "GAVE", amount: 15000, description: "Cheque / NEFT payment", date: new Date(Date.now() - 86400000 * 3) },
          ],
        },
      ],
    },
    {
      name: "Restaurant",
      category: "Food & Dining",
      description: "Daily food, ingredients, and cafe counter",
      currency: "₹",
      color: "rose",
      icon: "utensils",
      isDefault: false,
      tags: [
        "Vegetables",
        "Dairy & Milk",
        "Cooking Oil",
        "Spices & Grocery",
        "Gas Cylinder",
        "Chef Wages",
        "Packaging & Boxes",
        "Cleaning & Disposables",
        "Ice & Beverages",
      ],
      sampleIncome: [
        { title: "Lunch Hour Counter UPI", amount: 18450, paymentMode: "ONLINE", date: new Date(Date.now() - 86400000) },
        { title: "Dinner Cash Collections", amount: 14200, paymentMode: "CASH", date: new Date(Date.now() - 86400000) },
        { title: "Zomato / Swiggy Payout", amount: 8900, paymentMode: "ONLINE", date: new Date() },
      ],
      sampleExpenses: [
        { title: "Mandi Vegetables (Sabzi)", amount: 2850, paymentMode: "CASH", date: new Date() },
        { title: "Amul Milk & Paneer", amount: 1720, paymentMode: "ONLINE", date: new Date() },
        { title: "Gas Cylinder Refill", amount: 2100, paymentMode: "ONLINE", date: new Date(Date.now() - 86400000 * 3) },
      ],
      parties: [
        {
          name: "Mandi Sabzi Wala (Raju)",
          phone: "+91 97654 32198",
          notes: "Vegetables vendor",
          entries: [
            { type: "GOT", amount: 4500, description: "Vegetable supply bill", date: new Date(Date.now() - 86400000 * 3) },
            { type: "GAVE", amount: 3000, description: "Cash paid on counter", date: new Date(Date.now() - 86400000) },
          ],
        },
      ],
    },
    {
      name: "Car Rental Business",
      category: "Transport & Logistics",
      description: "Fleet, cabs, bookings, and fleet maintenance",
      currency: "₹",
      color: "blue",
      icon: "car",
      isDefault: false,
      tags: [
        "Diesel / Petrol",
        "Car Wash & Polish",
        "Fastag / Toll Charges",
        "Routine Service & Oil",
        "Driver Bata / Allowance",
        "Tyre Puncture & Air",
        "Parking Charges",
        "Insurance EMI",
      ],
      sampleIncome: [
        { title: "Airport Drop Booking (Innova)", amount: 3200, paymentMode: "ONLINE", date: new Date(Date.now() - 86400000 * 2) },
        { title: "Outstation 3-day Trip (Ertiga)", amount: 14500, paymentMode: "ONLINE", date: new Date(Date.now() - 86400000) },
        { title: "City Rental Cash", amount: 2400, paymentMode: "CASH", date: new Date() },
      ],
      sampleExpenses: [
        { title: "Diesel (Innova Full Tank)", amount: 4600, paymentMode: "ONLINE", date: new Date() },
        { title: "Fastag Recharge", amount: 1000, paymentMode: "ONLINE", date: new Date(Date.now() - 86400000 * 2) },
        { title: "Driver Bata Allowance", amount: 800, paymentMode: "CASH", date: new Date(Date.now() - 86400000) },
      ],
      parties: [
        {
          name: "Amit Travel Agency",
          phone: "+91 99887 76655",
          notes: "B2B bookings partner",
          entries: [
            { type: "GAVE", amount: 12000, description: "3 trips completed invoice", date: new Date(Date.now() - 86400000 * 4) },
            { type: "GOT", amount: 5000, description: "Partial bank transfer", date: new Date(Date.now() - 86400000) },
          ],
        },
      ],
    },
  ];

  for (const b of businesses) {
    let profile = await prisma.businessProfile.findFirst({
      where: { name: b.name },
    });

    if (!profile) {
      profile = await prisma.businessProfile.create({
        data: {
          name: b.name,
          category: b.category,
          description: b.description,
          currency: b.currency,
          color: b.color,
          icon: b.icon,
          isDefault: b.isDefault,
        },
      });
      console.log(`✅ Created business profile: ${b.name}`);
    }

    // Add tags
    for (const tag of b.tags) {
      await prisma.frequentExpenseTag.upsert({
        where: {
          businessId_label: {
            businessId: profile.id,
            label: tag,
          },
        },
        update: {},
        create: {
          businessId: profile.id,
          label: tag,
          usageCount: 5,
        },
      });
    }

    // Add sample income
    const existingTx = await prisma.transaction.count({
      where: { businessId: profile.id },
    });

    if (existingTx === 0) {
      for (const inc of b.sampleIncome) {
        await prisma.transaction.create({
          data: {
            businessId: profile.id,
            type: "INCOME",
            title: inc.title,
            amount: inc.amount,
            paymentMode: inc.paymentMode,
            date: inc.date,
          },
        });
      }
      for (const exp of b.sampleExpenses) {
        await prisma.transaction.create({
          data: {
            businessId: profile.id,
            type: "EXPENSE",
            title: exp.title,
            amount: exp.amount,
            paymentMode: exp.paymentMode,
            date: exp.date,
          },
        });
      }
    }

    // Add parties
    const existingParties = await prisma.khataParty.count({
      where: { businessId: profile.id },
    });

    if (existingParties === 0) {
      for (const p of b.parties) {
        const party = await prisma.khataParty.create({
          data: {
            businessId: profile.id,
            name: p.name,
            phone: p.phone,
            notes: p.notes,
          },
        });

        for (const e of p.entries) {
          await prisma.khataEntry.create({
            data: {
              partyId: party.id,
              type: e.type,
              amount: e.amount,
              description: e.description,
              date: e.date,
            },
          });
        }
      }
    }
  }

  console.log("🎉 Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

