// Hearth insights: short, specific findings computed from the household's
// own numbers — never generic advice. Each insight names the figure it
// comes from, so a reader can check it against the ledger.

import {
  budgetRows,
  expenseTotal,
  incomeTotal,
  savingsTotal,
  spendingTotal,
  spentByCategory,
  money,
} from "./store.js";

function biggestExpense(state) {
  let best = null;
  for (const t of state.transactions) {
    if (t.type === "expense" && t.cat !== "Savings" && (!best || t.amount > best.amount)) best = t;
  }
  return best;
}

function diningTakeaway(state) {
  return state.transactions
    .filter((t) => t.cat === "Dining")
    .reduce((s, t) => s + t.amount, 0);
}

export function buildInsights(state) {
  const out = [];
  const income = incomeTotal(state);
  const spent = spendingTotal(state);
  const saved = savingsTotal(state);
  const rows = budgetRows(state);
  const over = rows.filter((r) => r.over);
  const under = rows.filter((r) => !r.over && r.cat !== "Savings").sort((a, b) => b.left - a.left);

  if (over.length) {
    const r = over[0];
    out.push({
      tone: "warn",
      title: `${r.cat} is over budget`,
      body: `You have spent ${money(r.used)} of a ${money(r.budget)} ${r.cat.toLowerCase()} budget — ${money(r.used - r.budget)} over, with 4 days of November left. The culprit is mostly small, repeated spending: ${money(diningTakeaway(state))} on dining out this month.`,
    });
  }

  const rate = income > 0 ? (saved / income) * 100 : 0;
  out.push({
    tone: rate >= 20 ? "good" : "info",
    title: `Savings rate is ${rate.toFixed(1)}%`,
    body: `You saved ${money(saved)} of ${money(income)} income. The 50 / 30 / 20 rule suggests 20% — ${rate >= 20 ? "you are already there, keep it up." : `another ${money(income * 0.2 - saved)} this month would get you to 20%.`}`,
  });

  const big = biggestExpense(state);
  if (big) {
    out.push({
      tone: "info",
      title: `Biggest single cost: ${big.desc}`,
      body: `At ${money(big.amount)} it is ${(big.amount / Math.max(spent, 1) * 100).toFixed(0)}% of all November spending. Fixed costs like this are the first thing to check when money feels tight — they move the total more than any coffee.`,
    });
  }

  if (under.length) {
    const r = under[0];
    out.push({
      tone: "good",
      title: `${r.cat} has ${money(r.left)} left`,
      body: `${r.cat} is the best-controlled budget this month: ${money(r.used)} spent of ${money(r.budget)}. If it stays that way, move the leftover to the emergency fund on the 30th instead of letting it drift.`,
    });
  }

  const total = expenseTotal(state);
  const left = income - total;
  out.push({
    tone: left >= 0 ? "good" : "warn",
    title: left >= 0 ? `${money(left)} still unspent` : `${money(-left)} over income`,
    body: `Income ${money(income)} minus everything out, ${money(total)}, leaves ${money(left)}. ${left >= 0 ? "That is the month's breathing room — decide where it goes before December starts." : "Spending passed income this month. The Budgets page shows which categories pushed it over."}`,
  });

  const cats = spentByCategory(state);
  const top = Object.entries(cats)
    .filter(([c]) => c !== "Savings")
    .sort((a, b) => b[1] - a[1])[0];
  if (top) {
    out.push({
      tone: "info",
      title: `${top[0]} is your biggest spending category`,
      body: `${money(top[1])} went to ${top[0].toLowerCase()} in November — ${((top[1] / Math.max(spent, 1)) * 100).toFixed(0)}% of all spending. Housing aside, groceries are usually the next lever: a weekly shop with a list beats three top-up trips.`,
    });
  }

  return out;
}
