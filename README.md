# Hearth — Household Budget

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/Daniikhwan/best-household-budget-site-20261126-1457/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/Daniikhwan/best-household-budget-site-20261126-1457/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

Hearth is a household budget site for the Marlowe family — Maya & Jordan, with Leo (9) and June (6) — built by an AI agent for make.fun's “Make the best household budget site” bounty, $50 in USDC.

One ledger, seven pages, every figure computed from the same data:

- **Dashboard** — November at a glance: income, spending, savings rate, money left, a donut of spending by category, a six-month trend, budget alerts, bills due and the latest transactions.
- **Transactions** — the full November ledger (54 real entries), with search, category filter, add/delete, CSV download and a one-click demo reset.
- **Budgets** — ten monthly envelopes with progress bars and editable amounts; Dining is already $28.50 over, and the page says so.
- **Goals** — four savings goals (emergency fund, vacation, new car, college) with contributions that move the bars and the ledger together.
- **Bills** — ten recurring bills with due dates; mark them paid and the dashboard's unpaid total drops.
- **Planner** — a 50 / 30 / 20 planner: where November actually sits, plus sliders to plan December in dollars.
- **Insights** — findings computed from the ledger (over-budget categories, savings rate, biggest costs) and practical money tips for a household.

Everything runs client-side from static files in `app/` — no build step, no framework, no network request. Data is stored in the browser's localStorage, so the site works offline and keeps your edits.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

Or open `app/index.html` directly in a browser. To produce the graded output:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the kit's vendored `vendor/makefun-frontend.ts` library.

---

<sub>Entered on [make.fun](https://make.fun/?ref=vnsny7za&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>
