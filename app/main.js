// Hearth bootstrap: renders the current page, keeps the filter state for
// the ledger, and wires every control the views offer. All changes save
// to localStorage and re-render, so the whole site always agrees.

import { loadState, saveState, resetState, nextTxId, incomeTotal, money } from "./store.js";
import { currentRoute, navHtml } from "./router.js";
import {
  viewDashboard,
  viewTransactions,
  viewBudgets,
  viewGoals,
  viewBills,
  viewPlan,
  viewInsights,
  txRowsHtml,
} from "./views.js";
import { HOUSEHOLD } from "./data.js";

const VIEWS = {
  dashboard: viewDashboard,
  transactions: viewTransactions,
  budgets: viewBudgets,
  goals: viewGoals,
  bills: viewBills,
  plan: viewPlan,
  insights: viewInsights,
};

let state = loadState();
let txFilter = { q: "", cat: "all" };

const app = document.getElementById("app");
const nav = document.getElementById("nav");

function render() {
  const route = currentRoute();
  nav.innerHTML = navHtml(route.path);
  const fn = VIEWS[route.view] || viewDashboard;
  app.innerHTML = fn(state, txFilter);
  document.title = `${route.label} · Hearth — Household Budget`;
  if (route.view === "transactions") wireTxFilters();
  if (route.view === "plan") wirePlanner();
  window.scrollTo(0, 0);
}

function rerender() {
  saveState(state);
  render();
}

function wireTxFilters() {
  const search = document.getElementById("tx-search");
  const cat = document.getElementById("tx-cat");
  if (!search || !cat) return;
  search.addEventListener("input", () => {
    txFilter.q = search.value;
    const rows = document.getElementById("tx-rows");
    if (rows) rows.innerHTML = txRowsHtml(state, txFilter);
  });
  cat.addEventListener("change", () => {
    txFilter.cat = cat.value;
    const rows = document.getElementById("tx-rows");
    if (rows) rows.innerHTML = txRowsHtml(state, txFilter);
  });
}

function plannerReadout() {
  const n = document.getElementById("plan-needs");
  const w = document.getElementById("plan-wants");
  const s = document.getElementById("plan-save");
  if (!n || !w || !s) return;
  const total = +n.value + +w.value + +s.value;
  document.getElementById("plan-needs-out").textContent = n.value + "%";
  document.getElementById("plan-wants-out").textContent = w.value + "%";
  document.getElementById("plan-save-out").textContent = s.value + "%";
  const note = document.getElementById("plan-total");
  if (note) {
    if (total === 100) {
      note.className = "alert good";
      note.textContent = "Total: 100% — that plan works.";
    } else {
      note.className = "alert warn";
      note.textContent = `Total: ${total}% — needs, wants and savings must add to 100%.`;
    }
  }
  const income = incomeTotal(state);
  const amounts = document.getElementById("plan-amounts");
  if (amounts) {
    amounts.innerHTML = `
      <p>On ${money(income)} take-home pay, that plan means:</p>
      <ul>
        <li>Needs: <strong>${money((income * +n.value) / 100)}</strong> a month</li>
        <li>Wants: <strong>${money((income * +w.value) / 100)}</strong> a month</li>
        <li>Savings: <strong>${money((income * +s.value) / 100)}</strong> a month — ${money((income * +s.value * 12) / 100)} a year</li>
      </ul>`;
  }
}

function wirePlanner() {
  for (const id of ["plan-needs", "plan-wants", "plan-save"]) {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", plannerReadout);
  }
  plannerReadout();
}

function downloadCsv() {
  const head = "Date,Description,Category,Type,Amount (USD)\n";
  const lines = [...state.transactions]
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .map((t) => `${t.date},"${t.desc.replace(/"/g, '""')}",${t.cat},${t.type},${t.amount.toFixed(2)}`)
    .join("\n");
  const blob = new Blob([head + lines + "\n"], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "hearth-transactions-november-2026.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

app.addEventListener("submit", (e) => {
  if (e.target.id !== "tx-form") return;
  e.preventDefault();
  const fd = new FormData(e.target);
  const desc = String(fd.get("desc") || "").trim();
  const amount = parseFloat(String(fd.get("amount")));
  const cat = String(fd.get("cat"));
  const date = String(fd.get("date"));
  const type = String(fd.get("type"));
  if (!desc || !isFinite(amount) || amount <= 0 || !date) return;
  state.transactions.push({ id: nextTxId(state), date, desc, cat, amount: Math.round(amount * 100) / 100, type });
  rerender();
});

app.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const action = btn.dataset.action;

  if (action === "del-tx") {
    state.transactions = state.transactions.filter((t) => t.id !== btn.dataset.id);
    rerender();
  }

  if (action === "save-budget") {
    const cat = btn.dataset.cat;
    const input = app.querySelector(`input[data-budget-cat="${cat}"]`);
    if (!input) return;
    const value = parseFloat(input.value);
    if (isFinite(value) && value >= 0) {
      state.budgets[cat] = Math.round(value);
      rerender();
    }
  }

  if (action === "add-goal") {
    const id = btn.dataset.id;
    const input = app.querySelector(`input[data-goal-amt="${id}"]`);
    if (!input) return;
    const value = parseFloat(input.value);
    const goal = state.goals.find((g) => g.id === id);
    if (goal && isFinite(value) && value > 0) {
      goal.saved = Math.min(goal.target, Math.round((goal.saved + value) * 100) / 100);
      state.transactions.push({
        id: nextTxId(state),
        date: "2026-11-26",
        desc: `Contribution — ${goal.name}`,
        cat: "Savings",
        amount: Math.round(value * 100) / 100,
        type: "expense",
      });
      rerender();
    }
  }

  if (action === "toggle-bill") {
    const bill = state.bills.find((b) => b.id === btn.dataset.id);
    if (bill) {
      bill.paid = !bill.paid;
      rerender();
    }
  }

  if (action === "plan-reset") {
    document.getElementById("plan-needs").value = 50;
    document.getElementById("plan-wants").value = 30;
    document.getElementById("plan-save").value = 20;
    plannerReadout();
  }

  if (action === "export-csv") downloadCsv();

  if (action === "reset-data") {
    if (window.confirm("Restore the Marlowe family's original November data? Your changes will be lost.")) {
      state = resetState();
      txFilter = { q: "", cat: "all" };
      rerender();
    }
  }
});

document.getElementById("year").textContent = String(new Date().getFullYear());
document.getElementById("household-name").textContent = HOUSEHOLD.name;

window.addEventListener("hashchange", render);
render();
