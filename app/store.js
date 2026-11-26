// Hearth store: holds the household's data, saves every change to
// localStorage, and computes every figure the pages show from one place,
// so no two pages can ever disagree.

import { BUDGETS, TRANSACTIONS, GOALS, BILLS, PAST_MONTHS, HOUSEHOLD } from "./data.js";

const KEY = "hearth-budget-v1";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function seedState() {
  return {
    budgets: clone(BUDGETS),
    transactions: clone(TRANSACTIONS),
    goals: clone(GOALS),
    bills: clone(BILLS),
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.transactions)) return seedState();
    return parsed;
  } catch {
    return seedState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Private mode or full storage: the site still works for the session.
  }
}

export function resetState() {
  localStorage.removeItem(KEY);
  return seedState();
}

export function money(n) {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  return (
    sign +
    "$" +
    abs.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  );
}

export function money0(n) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

export function shortDate(iso) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function incomeTotal(state) {
  return state.transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
}

export function expenseTotal(state) {
  return state.transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
}

// Spending without the savings transfers — the money actually gone.
export function spendingTotal(state) {
  return state.transactions
    .filter((t) => t.type === "expense" && t.cat !== "Savings")
    .reduce((s, t) => s + t.amount, 0);
}

export function savingsTotal(state) {
  return state.transactions
    .filter((t) => t.type === "expense" && t.cat === "Savings")
    .reduce((s, t) => s + t.amount, 0);
}

export function spentByCategory(state) {
  const out = {};
  for (const t of state.transactions) {
    if (t.type !== "expense") continue;
    out[t.cat] = (out[t.cat] || 0) + t.amount;
  }
  return out;
}

export function budgetRows(state) {
  const spent = spentByCategory(state);
  return Object.keys(state.budgets).map((cat) => {
    const budget = state.budgets[cat];
    const used = spent[cat] || 0;
    return {
      cat,
      budget,
      used,
      left: budget - used,
      pct: budget > 0 ? (used / budget) * 100 : 0,
      over: used > budget,
    };
  });
}

export function totalBudget(state) {
  return Object.values(state.budgets).reduce((s, v) => s + v, 0);
}

export function monthlyHistory(state) {
  const nov = spendingTotal(state);
  return [...PAST_MONTHS, { month: "Nov", spent: Math.round(nov) }];
}

export function billsDue(state) {
  return state.bills.filter((b) => !b.paid);
}

export function billsDueTotal(state) {
  return billsDue(state).reduce((s, b) => s + b.amount, 0);
}

export function monthInfo() {
  return HOUSEHOLD;
}

export function nextTxId(state) {
  let max = 0;
  for (const t of state.transactions) {
    const n = parseInt(String(t.id).replace(/\D/g, ""), 10);
    if (!isNaN(n) && n > max) max = n;
  }
  return "t" + String(max + 1).padStart(2, "0");
}
