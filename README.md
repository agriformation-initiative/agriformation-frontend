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
| `PAYSTACK_SECRET_KEY` | Server-side Paystack key for `/donate`. Without it the form says online donations are not set up yet |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Public contact address shown across the site (your Zoho address) |
| `NEXT_PUBLIC_REGISTRATION_NUMBER` | Optional. Your CAC number. Shown in the footer and on `/transparency` when set |
| `NEXT_PUBLIC_BANK_NAME`, `NEXT_PUBLIC_BANK_ACCOUNT_NAME`, `NEXT_PUBLIC_BANK_ACCOUNT_NUMBER` | Optional. When all three are set, the donate page shows bank transfer details |

Partners listed on `/transparency` come from `PARTNERS` in `lib/site.ts`.

## Structure

- `app/(pages)/` public pages, volunteer area (`volunteer/dashboard`, `volunteer/profile`) and admin (`admin/*`)
- `components/ui/` shared building blocks (Button, Field, Modal, table, dashboard helpers)
- `components/shared/` site chrome and cards (Navbar, Footer, MediaCard)
- `lib/site.ts` site name, contact details and navigation. Change the brand here first
- `lib/programs.ts` program content shared by the home and programs pages
- `app/globals.css` design tokens (`@theme`): brand colours, fonts, shadows

Public pages that load data (gallery, blog, volunteer calls) render on the server. Dashboards are client
components behind `components/Layout/DashboardLayout.tsx`, which checks the signed-in role.
