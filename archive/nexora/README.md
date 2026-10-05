# Nexora

Nexora is a business analytics workspace for a fictional company. It gives an owner one place to read revenue, customers, orders, and conversion, then ask for a written analysis of those numbers.

This is a portfolio SaaS project. The interface is a working product demo with realistic sample data, not a connected production tenant.

## Features

- Overview with KPI cards, a 12-month revenue chart, category sales, recent orders, and an AI analyst
- Analytics with revenue, orders, customer growth, and conversion across 7 days, 30 days, 90 days, and 12 months
- Customer directory with search, status filter, and pagination
- Revenue view with monthly totals and a category breakdown
- AI Insights that posts the dashboard snapshot to a server route
- Settings for business identity, currency, notifications, and analysis preferences
- Light and dark theme, collapsible sidebar, and layouts for desktop, tablet, and mobile

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Recharts
- Lucide React
- ESLint

## Screenshots

Capture these from a local run and drop them in `docs/screenshots/` if you want them in the repo:

| Screen | What to show |
| --- | --- |
| Overview | KPI row, revenue chart, category chart, and the analyst panel |
| Analytics | Date range set to Last 30 days, with all four charts |
| Customers | Search and status filter above the table |
| AI Insights | A completed analysis with summary, findings, recommendations, and risk |

## Installation

```bash
npm install
cp .env.example .env.local
```

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `OPENAI_API_KEY` | No | Enables live analysis in `/api/analyze`. Leave it empty to use the local fallback. |
| `OPENAI_MODEL` | No | Model name sent to OpenAI. Defaults to `gpt-4o-mini`. |

The key is read only on the server. It is not shipped to the browser.

## Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other checks:

```bash
npm run lint
npm run build
```

## AI analysis

`Analyze my business` sends the current dashboard snapshot and the AI preferences from Settings to `POST /api/analyze`.

- With `OPENAI_API_KEY`, the route asks OpenAI for a summary, findings, recommendations, and one risk.
- Without a key, the route returns a calculated fallback from the same data so the product still runs.

Amounts in the analysis are discussed in euros. Display currency in Settings converts the interface with a fixed demo rate.

## Future improvements

- Sign-in and a real workspace per business
- A warehouse or billing connection in place of the demo dataset
- Saved analyses and a weekly email digest
- CSV export and shared read-only links
- Role-based access for finance and operations
