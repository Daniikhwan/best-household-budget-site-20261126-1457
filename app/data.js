// Hearth seed data: one household, one month, real figures.
// Every number on the site is computed from this file, so the dashboard,
// the budgets and the ledger can never disagree with each other.

export const HOUSEHOLD = {
  name: "The Marlowe Family",
  members: "Maya & Jordan, with Leo (9) and June (6)",
  home: "3-bed flat, Willow Creek",
  month: "November 2026",
  currency: "USD",
};

export const INCOME_SOURCES = [
  { source: "Maya — teaching salary", amount: 3400, day: 1 },
  { source: "Jordan — nursing salary", amount: 3150, day: 1 },
  { source: "Weekend market stall", amount: 180, day: 8 },
  { source: "Weekend market stall", amount: 120, day: 15 },
];

// Monthly budget targets per category (USD).
export const BUDGETS = {
  Housing: 1850,
  Groceries: 720,
  Utilities: 420,
  Transport: 380,
  Dining: 260,
  Kids: 340,
  Health: 220,
  Entertainment: 150,
  Shopping: 280,
  Savings: 1200,
};

export const CATEGORY_COLORS = {
  Housing: "#14532d",
  Groceries: "#16a34a",
  Utilities: "#0e7490",
  Transport: "#b45309",
  Dining: "#dc2626",
  Kids: "#7c3aed",
  Health: "#db2777",
  Entertainment: "#ca8a04",
  Shopping: "#475569",
  Savings: "#059669",
};

// Every transaction of November 2026. type: "income" | "expense".
// Savings rows are transfers to the goals on the Goals page.
export const TRANSACTIONS = [
  { id: "t01", date: "2026-11-01", desc: "Maya — teaching salary", cat: "Income", amount: 3400, type: "income" },
  { id: "t02", date: "2026-11-01", desc: "Jordan — nursing salary", cat: "Income", amount: 3150, type: "income" },
  { id: "t03", date: "2026-11-01", desc: "Rent — Willow Creek Apartments", cat: "Housing", amount: 1850, type: "expense" },
  { id: "t04", date: "2026-11-01", desc: "Auto-transfer to emergency fund", cat: "Savings", amount: 600, type: "expense" },
  { id: "t05", date: "2026-11-02", desc: "GreenMart weekly shop", cat: "Groceries", amount: 148.2, type: "expense" },
  { id: "t06", date: "2026-11-02", desc: "Fuel — Shell, Willow Rd", cat: "Transport", amount: 48, type: "expense" },
  { id: "t07", date: "2026-11-03", desc: "Electric bill — City Power", cat: "Utilities", amount: 142, type: "expense" },
  { id: "t08", date: "2026-11-03", desc: "Pizza night — Tony's", cat: "Dining", amount: 34.5, type: "expense" },
  { id: "t09", date: "2026-11-04", desc: "School lunches — Leo & June", cat: "Kids", amount: 45, type: "expense" },
  { id: "t10", date: "2026-11-05", desc: "Pharmacy — cold medicine", cat: "Health", amount: 32.4, type: "expense" },
  { id: "t11", date: "2026-11-05", desc: "Water bill — City Water", cat: "Utilities", amount: 68, type: "expense" },
  { id: "t12", date: "2026-11-06", desc: "GreenMart top-up shop", cat: "Groceries", amount: 62.4, type: "expense" },
  { id: "t13", date: "2026-11-06", desc: "Piano lessons — June", cat: "Kids", amount: 120, type: "expense" },
  { id: "t14", date: "2026-11-07", desc: "Café brunch — Saturday", cat: "Dining", amount: 28.75, type: "expense" },
  { id: "t15", date: "2026-11-07", desc: "Fuel — Shell, Willow Rd", cat: "Transport", amount: 52.5, type: "expense" },
  { id: "t16", date: "2026-11-07", desc: "Streaming bundle — Nov", cat: "Entertainment", amount: 16, type: "expense" },
  { id: "t17", date: "2026-11-08", desc: "Weekend market stall", cat: "Income", amount: 180, type: "income" },
  { id: "t18", date: "2026-11-08", desc: "Internet — Fiber 200", cat: "Utilities", amount: 79, type: "expense" },
  { id: "t19", date: "2026-11-09", desc: "Farmers market — veg & eggs", cat: "Groceries", amount: 48.75, type: "expense" },
  { id: "t20", date: "2026-11-09", desc: "Winter jackets — Leo & June", cat: "Shopping", amount: 89, type: "expense" },
  { id: "t21", date: "2026-11-10", desc: "Dentist check-up — Leo", cat: "Health", amount: 85, type: "expense" },
  { id: "t22", date: "2026-11-10", desc: "Bus passes — kids, monthly", cat: "Transport", amount: 64, type: "expense" },
  { id: "t23", date: "2026-11-11", desc: "Takeaway Thai — weeknight", cat: "Dining", amount: 42.9, type: "expense" },
  { id: "t24", date: "2026-11-12", desc: "Mobile plan — 2 lines", cat: "Utilities", amount: 96, type: "expense" },
  { id: "t25", date: "2026-11-12", desc: "Kids' shoes — June", cat: "Kids", amount: 58.9, type: "expense" },
  { id: "t26", date: "2026-11-13", desc: "GreenMart weekly shop", cat: "Groceries", amount: 152.9, type: "expense" },
  { id: "t27", date: "2026-11-13", desc: "Family movie night", cat: "Entertainment", amount: 28, type: "expense" },
  { id: "t28", date: "2026-11-14", desc: "Fuel — Shell, Willow Rd", cat: "Transport", amount: 47.8, type: "expense" },
  { id: "t29", date: "2026-11-14", desc: "Family movie rental", cat: "Entertainment", amount: 9.99, type: "expense" },
  { id: "t30", date: "2026-11-15", desc: "Weekend market stall", cat: "Income", amount: 120, type: "income" },
  { id: "t31", date: "2026-11-15", desc: "Auto-transfer to vacation fund", cat: "Savings", amount: 300, type: "expense" },
  { id: "t32", date: "2026-11-15", desc: "Auto-transfer to car fund", cat: "Savings", amount: 300, type: "expense" },
  { id: "t33", date: "2026-11-15", desc: "Burger joint — Sunday lunch", cat: "Dining", amount: 31.2, type: "expense" },
  { id: "t34", date: "2026-11-16", desc: "Corner store — milk & bread", cat: "Groceries", amount: 28.3, type: "expense" },
  { id: "t35", date: "2026-11-16", desc: "Vitamins — pharmacy", cat: "Health", amount: 24.8, type: "expense" },
  { id: "t36", date: "2026-11-17", desc: "Homeware — two lamps", cat: "Shopping", amount: 42.5, type: "expense" },
  { id: "t37", date: "2026-11-17", desc: "Car wash + oil top-up", cat: "Transport", amount: 38, type: "expense" },
  { id: "t38", date: "2026-11-18", desc: "Date-night dinner — Maya & Jordan", cat: "Dining", amount: 68, type: "expense" },
  { id: "t39", date: "2026-11-19", desc: "School trip fee — Leo", cat: "Kids", amount: 42, type: "expense" },
  { id: "t40", date: "2026-11-20", desc: "GreenMart weekly shop", cat: "Groceries", amount: 141.55, type: "expense" },
  { id: "t41", date: "2026-11-20", desc: "Board game — family night", cat: "Entertainment", amount: 34.95, type: "expense" },
  { id: "t42", date: "2026-11-21", desc: "New kettle — kitchen", cat: "Shopping", amount: 36.99, type: "expense" },
  { id: "t43", date: "2026-11-21", desc: "Lunch with friends — Maya", cat: "Dining", amount: 24.6, type: "expense" },
  { id: "t44", date: "2026-11-21", desc: "Fuel — Shell, Willow Rd", cat: "Transport", amount: 51.2, type: "expense" },
  { id: "t45", date: "2026-11-22", desc: "Art supplies — June", cat: "Kids", amount: 26.4, type: "expense" },
  { id: "t46", date: "2026-11-23", desc: "Gym membership — Jordan", cat: "Health", amount: 45, type: "expense" },
  { id: "t47", date: "2026-11-23", desc: "Takeaway pizza — Monday", cat: "Dining", amount: 36.4, type: "expense" },
  { id: "t48", date: "2026-11-24", desc: "GreenMart top-up shop", cat: "Groceries", amount: 58.1, type: "expense" },
  { id: "t49", date: "2026-11-24", desc: "Parking — city centre", cat: "Transport", amount: 18.5, type: "expense" },
  { id: "t50", date: "2026-11-24", desc: "eBook bundle — bedtime stories", cat: "Entertainment", amount: 12.99, type: "expense" },
  { id: "t51", date: "2026-11-25", desc: "Bakery & deli — Thanksgiving prep", cat: "Groceries", amount: 24.6, type: "expense" },
  { id: "t52", date: "2026-11-25", desc: "Gift for grandma", cat: "Shopping", amount: 28, type: "expense" },
  { id: "t53", date: "2026-11-25", desc: "Kids' books — Leo", cat: "Kids", amount: 18.75, type: "expense" },
  { id: "t54", date: "2026-11-26", desc: "Coffee & pastries — morning", cat: "Dining", amount: 22.15, type: "expense" },
];

// Savings goals. `saved` is the balance on 26 Nov 2026.
export const GOALS = [
  { id: "g1", name: "Emergency fund", note: "3 months of essentials, for peace of mind", target: 10000, saved: 7250, color: "#059669" },
  { id: "g2", name: "Family vacation", note: "Seaside week in July — flights, stay & food", target: 3200, saved: 1440, color: "#0e7490" },
  { id: "g3", name: "New car — down payment", note: "Replace the 2011 hatchback before winter", target: 8000, saved: 2400, color: "#b45309" },
  { id: "g4", name: "Kids' college fund", note: "A little every month, from birthdays on", target: 25000, saved: 3100, color: "#7c3aed" },
];

// Recurring bills for November. status is the state on 26 Nov 2026.
export const BILLS = [
  { id: "b01", name: "Rent — Willow Creek Apartments", amount: 1850, due: 1, paid: true },
  { id: "b02", name: "Gym membership — Jordan", amount: 45, due: 5, paid: true },
  { id: "b03", name: "Streaming bundle", amount: 16, due: 8, paid: true },
  { id: "b04", name: "Water bill — City Water", amount: 68, due: 12, paid: true },
  { id: "b05", name: "Electric bill — City Power", amount: 142, due: 15, paid: true },
  { id: "b06", name: "Mobile plan — 2 lines", amount: 96, due: 18, paid: true },
  { id: "b07", name: "Internet — Fiber 200", amount: 79, due: 20, paid: true },
  { id: "b08", name: "Piano lessons — June", amount: 120, due: 22, paid: true },
  { id: "b09", name: "Car insurance — monthly", amount: 132, due: 25, paid: false },
  { id: "b10", name: "Home insurance — monthly", amount: 88, due: 28, paid: false },
];

// Total spending (excluding the savings transfers) for the five months
// before November, so the trend chart has honest history.
export const PAST_MONTHS = [
  { month: "Jun", spent: 5120 },
  { month: "Jul", spent: 5480 },
  { month: "Aug", spent: 5930 },
  { month: "Sep", spent: 5240 },
  { month: "Oct", spent: 5610 },
];

// Short, practical money tips written for a household, not a bank.
export const TIPS = [
  { title: "Plan meals before you shop", body: "A 10-minute meal plan each Sunday is the single biggest lever on a grocery bill. This household's grocery spend drops about $40 in weeks it plans ahead." },
  { title: "Pay yourself first", body: "Move savings on payday, before anything else. The Marlowe's $600 emergency-fund transfer leaves on the 1st — it never gets 'spent by accident'." },
  { title: "Audit the small subscriptions", body: "One streaming bundle, one gym, one cloud plan. Check them every three months: a $16-a-month service nobody opens is $192 a year." },
  { title: "The 50 / 30 / 20 rule", body: "Aim for roughly 50% needs, 30% wants and 20% savings. Use the Planner page to see where this household sits and drag the sliders to fit real life." },
  { title: "One takeaway night a week", body: "Dining out is the easiest budget to overspend — this month it ran $28.50 over. A fixed 'takeaway night' keeps the fun and caps the cost." },
  { title: "Keep a $200 buffer", body: "A small buffer in the current account stops a surprise bill from becoming an overdraft fee. Top it up whenever the month ends in the green." },
];
