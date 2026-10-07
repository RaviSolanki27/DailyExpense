export interface LanguageStrings {
  income: string;
  expense: string;
  incomeSub: string;
  expenseSub: string;
  cash: string;
  online: string;
  other: string;
  youWillGet: string;
  youWillGive: string;
  maineDiye: string;
  maineLiye: string;
  quickAdd: string;
  reports: string;
  khataBook: string;
  settings: string;
  netBalance: string;
  netProfit: string;
  settled: string;
  frequentExpenses: string;
  tapToAutoFill: string;
  saveIncome: string;
  saveExpense: string;
  addParty: string;
  business: string;
  switchProfile: string;
  recentEntries: string;
  paymentBreakdown: string;
  date: string;
  amount: string;
  description: string;
  phone: string;
  notes: string;
  allTypes: string;
  today: string;
  thisWeek: string;
  thisMonth: string;
  thisYear: string;
  allTime: string;
}

export const getLabels = (showHindi: boolean): LanguageStrings => {
  if (showHindi) {
    return {
      income: "Income (आमदनी)",
      expense: "Expense (खर्चा)",
      incomeSub: "+ Income / आमदनी",
      expenseSub: "- Expense / खर्चा",
      cash: "Cash (रोकड़)",
      online: "Online / UPI",
      other: "Other (अन्य)",
      youWillGet: "You Will Get (लेना है)",
      youWillGive: "You Will Give (देना है)",
      maineDiye: "- Maine Diye (दिए)",
      maineLiye: "+ Maine Liye (लिए)",
      quickAdd: "Quick Add",
      reports: "Reports",
      khataBook: "Khata Book",
      settings: "Settings",
      netBalance: "Net Balance (बाकी)",
      netProfit: "Net Profit (मुनाफा)",
      settled: "Settled (हिसाब बराबर)",
      frequentExpenses: "Frequently Added Expenses (अक्सर होने वाले खर्चे)",
      tapToAutoFill: "(टैप करें)",
      saveIncome: "Save Income (आमदनी जोड़ें)",
      saveExpense: "Save Expense (खर्चा जोड़ें)",
      addParty: "+ Add Party (पार्टी जोड़ें)",
      business: "Business (व्यापार)",
      switchProfile: "Switch Profile (बदलें)",
      recentEntries: "Recent Entries (हाल के लेनदेन)",
      paymentBreakdown: "Payment Mode (भुगतान विवरण)",
      date: "Date (तारीख)",
      amount: "Amount (रुपये)",
      description: "Description (विवरण)",
      phone: "Phone / WhatsApp",
      notes: "Notes / Bill (नोट्स)",
      allTypes: "All Types (सभी)",
      today: "Today (आज)",
      thisWeek: "This Week (इस सप्ताह)",
      thisMonth: "This Month (इस महीने)",
      thisYear: "This Year (इस साल)",
      allTime: "All Time (सब)",
    };
  }

  // Pure English mode
  return {
    income: "Income",
    expense: "Expense",
    incomeSub: "+ Income",
    expenseSub: "- Expense",
    cash: "Cash",
    online: "Online / UPI",
    other: "Other",
    youWillGet: "You Will Get",
    youWillGive: "You Will Give",
    maineDiye: "- Maine Diye (You Gave)",
    maineLiye: "+ Maine Liye (You Got)",
    quickAdd: "Quick Add",
    reports: "Reports",
    khataBook: "Khata Book",
    settings: "Settings",
    netBalance: "Net Balance",
    netProfit: "Net Profit",
    settled: "Settled",
    frequentExpenses: "Frequently Added Expenses",
    tapToAutoFill: "(Tap to auto-fill)",
    saveIncome: "Save Income",
    saveExpense: "Save Expense",
    addParty: "+ Add Party",
    business: "Business",
    switchProfile: "Switch Profile",
    recentEntries: "Recent Entries",
    paymentBreakdown: "Payment Breakdown",
    date: "Date",
    amount: "Amount",
    description: "Description",
    phone: "Phone / WhatsApp",
    notes: "Notes / Bill",
    allTypes: "All Types",
    today: "Today",
    thisWeek: "This Week",
    thisMonth: "This Month",
    thisYear: "This Year",
    allTime: "All Time",
  };
};

