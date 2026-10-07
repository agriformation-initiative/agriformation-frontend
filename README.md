# AgroNext Agricultural Development Initiative: website

Next.js 15 (App Router) front end for the AgroNext public site, volunteer area and admin dashboard.
It talks to the Express API in `../backend`.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Environment (`.env.local`)

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL, including `/api` (default `http://localhost:5000/api`) |
| `STRIPE_SECRET_KEY` | Server-side Stripe key for `/donate`. Without it the donate form shows a clear "not set up yet" message |

## Structure

- `app/(pages)/` public pages, volunteer area (`volunteer/dashboard`, `volunteer/profile`) and admin (`admin/*`)
- `components/ui/` shared building blocks (Button, Field, Modal, table, dashboard helpers)
- `components/shared/` site chrome and cards (Navbar, Footer, MediaCard)
- `lib/site.ts` site name, contact details and navigation. Change the brand here first
- `lib/programs.ts` program content shared by the home and programs pages
- `app/globals.css` design tokens (`@theme`): brand colours, fonts, shadows

Public pages that load data (gallery, blog, volunteer calls) render on the server. Dashboards are client
components behind `components/Layout/DashboardLayout.tsx`, which checks the signed-in role.
