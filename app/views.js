// Hearth views: one render function per page. Each returns HTML; main.js
// puts it into #app and wires the controls. Every figure comes from the
// store, so the pages always agree with each other.

import {
  money,
  money0,
  shortDate,
  incomeTotal,
  expenseTotal,
  spendingTotal,
  savingsTotal,
  spentByCategory,
  budgetRows,
  totalBudget,
  monthlyHistory,
  billsDue,
  billsDueTotal,
} from "./store.js";
import { donutChart, legendItems, barChart, categoryColor } from "./charts.js";
import { buildInsights } from "./insights.js";
import { CATEGORY_COLORS, TIPS, HOUSEHOLD } from "./data.js";

function statCard(label, value, sub, tone = "") {
  return `<div class="stat ${tone}"><p class="stat-label">${label}</p><p class="stat-value">${value}</p><p class="stat-sub">${sub}</p></div>`;
}

function progressBar(pct, color) {
  const capped = Math.min(pct, 100);
  return `<div class="bar" role="progressbar" aria-valuenow="${Math.round(pct)}" aria-valuemin="0" aria-valuemax="100"><span style="width:${capped}%;background:${color}"></span></div>`;
}

export function viewDashboard(state) {
  const income = incomeTotal(state);
  const spent = spendingTotal(state);
  const saved = savingsTotal(state);
  const left = income - expenseTotal(state);
  const rows = budgetRows(state);
  const over = rows.filter((r) => r.over);
  const cats = {};
  for (const t of state.transactions) {
    if (t.type === "expense" && t.cat !== "Savings") cats[t.cat] = (cats[t.cat] || 0) + t.amount;
  }
  const slices = Object.entries(cats)
    .map(([label, value]) => ({ label, value, color: CATEGORY_COLORS[label] || "#475569" }))
    .sort((a, b) => b.value - a.value);
  slices.push({ label: "Savings", value: saved, color: CATEGORY_COLORS.Savings });
  const recent = [...state.transactions]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 6);
  const due = billsDue(state);
  const history = monthlyHistory(state);

  return `
  <section class="hero">
    <div>
      <p class="eyebrow">${HOUSEHOLD.month} · ${HOUSEHOLD.name}</p>
      <h1>Your household's money, in one calm place.</h1>
      <p class="lede">Income, spending, budgets, bills and savings goals for ${HOUSEHOLD.members} — updated the moment you add a transaction. Nothing here is a sample: every figure is computed from your ledger.</p>
      <p class="hero-cta"><a class="btn primary" href="#/transactions">Add a transaction</a> <a class="btn" href="#/plan">Try the 50 / 30 / 20 planner</a></p>
    </div>
    <div class="hero-card">
      <p class="stat-label">Left to spend in November</p>
      <p class="hero-left">${money(left)}</p>
      <p class="stat-sub">of ${money(income)} income · ${money(spent)} spent · ${money(saved)} saved</p>
      ${progressBar((spent / Math.max(income, 1)) * 100, "#f5b942")}
      <p class="stat-sub">${Math.round((spent / Math.max(income, 1)) * 100)}% of income spent so far</p>
    </div>
  </section>

  <section class="stats">
    ${statCard("Income", money(income), "2 salaries + market stall")}
    ${statCard("Spent", money(spent), "excludes savings transfers")}
    ${statCard("Saved", money(saved), `${((saved / Math.max(income, 1)) * 100).toFixed(1)}% savings rate`, "good")}
    ${statCard("Unpaid bills", money(billsDueTotal(state)), `${due.length} bill${due.length === 1 ? "" : "s"} still due`, due.length ? "warn" : "good")}
  </section>

  <section class="grid-2">
    <div class="card">
      <h2>Where the money went</h2>
      <p class="muted">November spending by category, savings included.</p>
      <div class="donut-wrap">${donutChart(slices)}<ul class="legend">${legendItems(slices)}</ul></div>
    </div>
    <div class="card">
      <h2>Spending trend — last 6 months</h2>
      <p class="muted">August spiked with back-to-school shopping; November is tracking below October.</p>
      ${barChart(history)}
    </div>
  </section>

  <section class="grid-2">
    <div class="card">
      <h2>Budget watch</h2>
      ${over.length
        ? over.map((r) => `<p class="alert warn"><strong>${r.cat} is over budget</strong> — ${money(r.used)} of ${money(r.budget)} (${money(r.used - r.budget)} over).</p>`).join("")
        : `<p class="alert good">Every category is inside its budget. Nice work.</p>`}
      ${rows
        .filter((r) => !r.over)
        .sort((a, b) => b.pct - a.pct)
        .slice(0, 3)
        .map((r) => `<div class="mini-row"><span>${r.cat}</span>${progressBar(r.pct, categoryColor(r.cat))}<span>${money(r.used)} / ${money(r.budget)}</span></div>`)
        .join("")}
      <p><a class="btn small" href="#/budgets">See all budgets</a></p>
    </div>
    <div class="card">
      <h2>Bills coming up</h2>
      ${due.length
        ? `<ul class="bill-list">${due.map((b) => `<li><span>${b.name}</span><span><strong>${money(b.amount)}</strong> · due Nov ${b.due}</span></li>`).join("")}</ul>`
        : `<p class="alert good">All November bills are paid.</p>`}
      <h2 class="mt">Recent transactions</h2>
      <ul class="tx-mini">${recent.map((t) => `<li><span class="dot" style="background:${t.type === "income" ? "#059669" : categoryColor(t.cat)}"></span><span>${t.desc}</span><span>${shortDate(t.date)}</span><span class="${t.type}">${t.type === "income" ? "+" : "−"}${money(t.amount)}</span></li>`).join("")}</ul>
      <p><a class="btn small" href="#/transactions">Full ledger</a></p>
    </div>
  </section>`;
}

export function txRowsHtml(state, filter) {
  const q = (filter.q || "").trim().toLowerCase();
  const cat = filter.cat || "all";
  const rows = [...state.transactions]
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.id < b.id ? 1 : -1))
    .filter((t) => (cat === "all" ? true : t.cat === cat))
    .filter((t) => !q || t.desc.toLowerCase().includes(q) || t.cat.toLowerCase().includes(q));
  if (!rows.length) return `<tr><td colspan="5" class="empty">No transactions match. Try clearing the search or the category filter.</td></tr>`;
  return rows
    .map(
      (t) => `<tr>
        <td>${shortDate(t.date)}</td>
        <td><span class="dot" style="background:${t.type === "income" ? "#059669" : categoryColor(t.cat)}"></span>${t.desc}</td>
        <td><span class="chip">${t.cat}</span></td>
        <td class="${t.type}">${t.type === "income" ? "+" : "−"}${money(t.amount)}</td>
        <td><button class="linklike" data-action="del-tx" data-id="${t.id}" aria-label="Delete ${t.desc}">Delete</button></td>
      </tr>`
    )
    .join("");
}

export function viewTransactions(state, filter) {
  const cats = ["all", ...Object.keys(CATEGORY_COLORS)];
  const count = state.transactions.length;
  return `
  <section class="page-head">
    <div><p class="eyebrow">Ledger</p><h1>Transactions</h1>
    <p class="lede">${count} transactions in November 2026. Add one below and every page updates at once — the dashboard, the budgets and the charts all read this same ledger.</p></div>
  </section>

  <section class="card">
    <h2>Add a transaction</h2>
    <form id="tx-form" class="form-grid">
      <label>Description<input name="desc" required maxlength="80" placeholder="e.g. GreenMart weekly shop"></label>
      <label>Amount (USD)<input name="amount" type="number" min="0.01" step="0.01" required placeholder="0.00"></label>
      <label>Category<select name="cat">${Object.keys(CATEGORY_COLORS).map((c) => `<option>${c}</option>`).join("")}</select></label>
      <label>Date<input name="date" type="date" value="2026-11-26" min="2026-11-01" max="2026-11-30" required></label>
      <label>Type<select name="type"><option value="expense">Expense</option><option value="income">Income</option></select></label>
      <div class="form-actions"><button class="btn primary" type="submit">Add transaction</button>
      <button class="btn" type="button" data-action="export-csv">Download CSV</button>
      <button class="btn danger-ghost" type="button" data-action="reset-data">Reset demo data</button></div>
    </form>
    <p class="muted small">Saved in this browser only. Reset demo data restores the Marlowe family's original November ledger.</p>
  </section>

  <section class="card">
    <h2>All transactions</h2>
    <div class="filters">
      <label>Search <input id="tx-search" type="search" placeholder="Search description or category" value="${filter.q || ""}"></label>
      <label>Category <select id="tx-cat">${cats.map((c) => `<option value="${c}" ${c === (filter.cat || "all") ? "selected" : ""}>${c === "all" ? "All categories" : c}</option>`).join("")}</select></label>
    </div>
    <div class="table-wrap"><table class="tx-table">
      <thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Amount</th><th></th></tr></thead>
      <tbody id="tx-rows">${txRowsHtml(state, filter)}</tbody>
    </table></div>
  </section>`;
}

export function viewBudgets(state) {
  const rows = budgetRows(state);
  const total = totalBudget(state);
  const used = rows.reduce((s, r) => s + r.used, 0);
  return `
  <section class="page-head">
    <div><p class="eyebrow">Monthly plan</p><h1>Budgets</h1>
    <p class="lede">Ten envelopes for November. ${money(used)} of ${money(total)} planned spending is used — ${money(total - used)} is still in the envelopes. Change any amount and the dashboard follows.</p></div>
  </section>
  <section class="budget-grid">
    ${rows
      .map(
        (r) => `<article class="card budget-card ${r.over ? "over" : ""}">
        <div class="budget-top"><span class="dot" style="background:${categoryColor(r.cat)}"></span><h2>${r.cat}</h2>${r.over ? `<span class="badge warn">Over by ${money(r.used - r.budget)}</span>` : `<span class="badge good">${money(r.left)} left</span>`}</div>
        ${progressBar(r.pct, r.over ? "#dc2626" : categoryColor(r.cat))}
        <p class="budget-nums"><strong>${money(r.used)}</strong> of ${money(r.budget)} · ${Math.round(r.pct)}%</p>
        <label class="budget-edit">Monthly budget $<input type="number" min="0" step="10" value="${r.budget}" data-budget-cat="${r.cat}" aria-label="${r.cat} monthly budget"> <button class="btn small" data-action="save-budget" data-cat="${r.cat}">Save</button></label>
      </article>`
      )
      .join("")}
  </section>
  <section class="card">
    <h2>How the envelopes work</h2>
    <p>Each category gets a fixed amount on the 1st. Spend from the envelope, not from the account balance — when an envelope is empty, the category waits until next month. Dining out is the one envelope most households blow: small, frequent, and easy to forget. This month it is already ${money((rows.find((r) => r.cat === "Dining") || { used: 0 }).used - (rows.find((r) => r.cat === "Dining") || { budget: 0 }).budget)} over.</p>
  </section>`;
}

export function viewGoals(state) {
  const totalSaved = state.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = state.goals.reduce((s, g) => s + g.target, 0);
  return `
  <section class="page-head">
    <div><p class="eyebrow">Saving for later</p><h1>Goals</h1>
    <p class="lede">${money(totalSaved)} saved toward ${money(totalTarget)} of goals — ${Math.round((totalSaved / totalTarget) * 100)}% of the way there. Add a contribution to any goal and its bar moves right away.</p></div>
  </section>
  <section class="goal-grid">
    ${state.goals
      .map((g) => {
        const pct = (g.saved / g.target) * 100;
        const left = g.target - g.saved;
        return `<article class="card goal-card">
        <h2>${g.name}</h2>
        <p class="muted">${g.note}</p>
        ${progressBar(pct, g.color)}
        <p class="budget-nums"><strong>${money(g.saved)}</strong> of ${money(g.target)} · ${Math.round(pct)}%${left > 0 ? ` · <span class="muted">${money(left)} to go</span>` : ` · <span class="badge good">Reached</span>`}</p>
        <label class="goal-add">Add $<input type="number" min="1" step="5" value="50" data-goal-amt="${g.id}" aria-label="Amount to add to ${g.name}"> <button class="btn small primary" data-action="add-goal" data-id="${g.id}">Add to goal</button></label>
      </article>`;
      })
      .join("")}
  </section>
  <section class="card">
    <h2>Why goals come before spending</h2>
    <p>Money with a name gets saved; money without one gets spent. The emergency fund is the first goal for a reason — three months of essentials means a broken car or a sick week never becomes debt. Once it hits ${money(10000)}, the same $600 a month rolls into the vacation and the car.</p>
  </section>`;
}

export function viewBills(state) {
  const due = billsDue(state);
  const paid = state.bills.filter((b) => b.paid);
  const dueTotal = billsDueTotal(state);
  return `
  <section class="page-head">
    <div><p class="eyebrow">Never miss one</p><h1>Bills</h1>
    <p class="lede">${due.length ? `${money(dueTotal)} is still due in November across ${due.length} bill${due.length === 1 ? "" : "s"}.` : "Every November bill is paid."} Tap “Mark paid” as each one clears and the dashboard's unpaid total drops.</p></div>
  </section>
  <section class="grid-2">
    <div class="card">
      <h2>Still to pay</h2>
      ${due.length
        ? `<ul class="bill-list big">${due.map((b) => `<li><div><strong>${b.name}</strong><span class="muted">Due Nov ${b.due}</span></div><div class="bill-right"><strong>${money(b.amount)}</strong><button class="btn small primary" data-action="toggle-bill" data-id="${b.id}">Mark paid</button></div></li>`).join("")}</ul>`
        : `<p class="alert good">Nothing left to pay this month.</p>`}
    </div>
    <div class="card">
      <h2>Paid in November</h2>
      <ul class="bill-list big">${paid.map((b) => `<li><div><strong>${b.name}</strong><span class="muted">Paid · due Nov ${b.due}</span></div><div class="bill-right"><strong>${money(b.amount)}</strong><span class="badge good">Paid</span> <button class="linklike" data-action="toggle-bill" data-id="${b.id}">Undo</button></div></li>`).join("")}</ul>
    </div>
  </section>
  <section class="card">
    <h2>Make bills boring</h2>
    <p>Put every recurring bill on autopay for the day after payday, and keep a $200 buffer in the current account. A bill that pays itself on time is one less thing to remember — and late fees are the most expensive way to buy nothing.</p>
  </section>`;
}

export function viewPlan(state) {
  const income = incomeTotal(state);
  const needs = spendingTotal(state) - (spentByCategory(state).Dining || 0) - (spentByCategory(state).Entertainment || 0) - (spentByCategory(state).Shopping || 0);
  const wants = (spentByCategory(state).Dining || 0) + (spentByCategory(state).Entertainment || 0) + (spentByCategory(state).Shopping || 0);
  const saved = savingsTotal(state);
  const pct = (v) => Math.round((v / Math.max(income, 1)) * 100);
  return `
  <section class="page-head">
    <div><p class="eyebrow">50 / 30 / 20</p><h1>Planner</h1>
    <p class="lede">The classic split: about 50% of take-home pay for needs, 30% for wants, 20% for savings. This is where the Marlowe family actually sits in November — drag the sliders to plan December.</p></div>
  </section>
  <section class="grid-2">
    <div class="card">
      <h2>Where November actually sits</h2>
      <div class="plan-row"><span>Needs — housing, groceries, utilities, transport, kids, health</span><strong>${pct(needs)}% · ${money(needs)}</strong></div>
      ${progressBar((needs / Math.max(income, 1)) * 100, "#14532d")}
      <div class="plan-row"><span>Wants — dining out, entertainment, shopping</span><strong>${pct(wants)}% · ${money(wants)}</strong></div>
      ${progressBar((wants / Math.max(income, 1)) * 100, "#d97706")}
      <div class="plan-row"><span>Savings — emergency, vacation &amp; car funds</span><strong>${pct(saved)}% · ${money(saved)}</strong></div>
      ${progressBar((saved / Math.max(income, 1)) * 100, "#059669")}
      <p class="muted">Needs are running high because rent is a big share of a teacher-and-nurse income. That is normal — the rule is a compass, not a court. The remaining ${money(income - needs - wants - saved)} (${100 - pct(needs) - pct(wants) - pct(saved)}% of income) is still unassigned: decide where it goes before December starts.</p>
    </div>
    <div class="card">
      <h2>Plan December</h2>
      <p class="muted">Drag the sliders. They must add to 100% — the planner tells you the moment they don't.</p>
      <label class="slider-row">Needs <input type="range" id="plan-needs" min="30" max="70" value="50"> <output id="plan-needs-out">50%</output></label>
      <label class="slider-row">Wants <input type="range" id="plan-wants" min="10" max="50" value="30"> <output id="plan-wants-out">30%</output></label>
      <label class="slider-row">Savings <input type="range" id="plan-save" min="5" max="40" value="20"> <output id="plan-save-out">20%</output></label>
      <p id="plan-total" class="alert good">Total: 100% — that plan works.</p>
      <div id="plan-amounts" class="plan-amounts"></div>
      <p><button class="btn small" data-action="plan-reset">Reset to 50 / 30 / 20</button></p>
    </div>
  </section>
  <section class="card">
    <h2>What if…</h2>
    <p>Cutting takeaway to one night a week saves about $120 a month here — that is $1,440 a year, nearly half the vacation fund. Small, repeated choices are where a household budget is actually won.</p>
  </section>`;
}

export function viewInsights(state) {
  const insights = buildInsights(state);
  const toneIcon = { good: "✓", warn: "!", info: "i" };
  return `
  <section class="page-head">
    <div><p class="eyebrow">Computed from your ledger</p><h1>Insights</h1>
    <p class="lede">What November's numbers actually say. Each finding names the figure it comes from — check any of them against the ledger.</p></div>
  </section>
  <section class="insight-list">
    ${insights.map((x) => `<article class="card insight ${x.tone}"><span class="insight-icon">${toneIcon[x.tone]}</span><div><h2>${x.title}</h2><p>${x.body}</p></div></article>`).join("")}
  </section>
  <section class="card">
    <h2>Money tips that actually help a household</h2>
    <div class="tips-grid">
      ${TIPS.map((t) => `<article><h3>${t.title}</h3><p>${t.body}</p></article>`).join("")}
    </div>
  </section>`;
}
