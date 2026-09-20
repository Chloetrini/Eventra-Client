# Eventra Client

The web frontend for **Eventra**, an event management and ticketing platform. Attendees discover and buy tickets, organizers create and run events, and admins oversee the whole platform.

## Who uses it

| Role | What they can do |
| --- | --- |
| **Attendee** | Browse and filter events, save events, follow organizers, buy free or paid tickets (Paystack checkout), view tickets and QR codes, request refunds, report events, manage their profile |
| **Organizer** | Sign up and complete onboarding (organisation details, bank account, verification documents), create events through a step-by-step wizard, track sales, attendees, revenue and payouts, check attendees in by QR scan or manual lookup, run promotions, manage settings |
| **Admin** (`owner`, `admin`, `support` tiers) | Approve organizers, moderate events and promotions, handle refunds and disputes, review flags and audit logs, manage payouts, revenue, users and enquiries, configure platform settings and admin team roles |

## Tech stack

- **React 19** and **TypeScript**, built with **Vite** (React Compiler enabled)
- **Tailwind CSS 4**, **shadcn/ui** (base-nova style), **MUI** date pickers, **Framer Motion**
- **React Router 8** (data router with lazy-loaded routes)
- **TanStack React Query** for server state, **Axios** for HTTP
- **React Hook Form** and **Zod** for forms and validation
- **Recharts** for charts, **Leaflet** for maps, **html5-qrcode** for QR scanning
- **@react-oauth/google** for Google sign-in, **react-toastify** for notifications

## Getting started

Requirements: Node 20.19+ (or 22+) and npm.

```bash
npm install
npm run dev
```

The dev server runs on http://localhost:4001 and proxies `/api` to a backend on http://localhost:4000.

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Typecheck (`tsc -b`) and create a production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

### Environment variables

Create a `.env` file in the project root (it is git-ignored).

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_URL` | No | Base URL of the backend. `/api/v1` is appended if missing. Defaults to `/api/v1`, which the dev server proxies to `localhost:4000` |
| `VITE_GOOGLE_CLIENT_ID` | For Google sign-in | Google OAuth client ID |

## Project structure

```
src/
├── app/            App shell: app.tsx (providers) and router.tsx (route table)
├── api/            One module per backend resource; client.ts is the shared Axios instance
├── assets/         brand/  icons/  illustrations/  images/
├── components/
│   ├── ui/         shadcn/ui primitives only
│   ├── form/       Form inputs built on the primitives (date and time pickers, uploaders, ...)
│   ├── layout/     Navbar, Footer, PageWrapper
│   ├── guards/     Route guards (RequireAdmin, RequireOrganizer)
│   ├── shared/     Cross-feature pieces (error boundary, SEO, avatars, buttons, ...)
│   ├── skeletons/  Loading skeletons
│   ├── dialogs/    Confirmation and action dialogs
│   └── <feature>/  admin, organizer-dashboard, create-event, onboarding, events,
│                   event-details, tickets, payouts, check-in, ...
├── constants/      Static data (Nigerian states, home page and organizer content)
├── context/        React context (auth, auth gate, checkout, theme)
├── hooks/          admin/  organizer/  events/  shared/
├── lib/            Framework-agnostic helpers (utils, Zod schemas, calendar, CSV export, ...)
├── routes/         Page components, mirroring the URL structure
└── types/          Shared TypeScript types
```

## Routes

Routes are declared in `src/app/router.tsx` and every page is lazy-loaded from `src/routes/`.

| Area | URLs | Access |
| --- | --- | --- |
| Public | `/`, `/explore`, `/events/:slug`, `/events/:slug/report`, `/organizers`, `/about`, `/contact`, `/privacy`, `/terms` | Anyone |
| Attendee | `/saved-events`, `/tickets`, `/profile`, `/refund-request`, `/payment/checkout`, `/payment/ticket-confirmation`, `/payment/checkout/callback` | Attendee account |
| Auth | `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/check-email`, `/auth/verify-otp`, the same under `/auth/organizer/*`, and `/auth/admin/login`, `/auth/admin/set-password` | Anyone |
| Onboarding | `/onboarding/organisation`, `/onboarding/bank-account`, `/onboarding/verification`, `/onboarding/review`, `/onboarding/success` | Organizer |
| Organizer dashboard | `/dashboard/overview`, `/dashboard/events`, `/dashboard/events/:eventId`, `/dashboard/create-event/*`, `/dashboard/attendees`, `/dashboard/check-in`, `/dashboard/promotion`, `/dashboard/payouts`, `/dashboard/settings` | Organizer (`RequireOrganizer`) |
| Admin | `/admin/overview`, `/admin/approvals`, `/admin/events`, `/admin/promotions`, `/admin/organizers`, `/admin/refunds`, `/admin/reports`, `/admin/enquiries`, `/admin/users`, `/admin/revenue`, `/admin/payouts`, `/admin/settings` | Admin (`RequireAdmin`) |

## Conventions

- **File names are kebab-case** (`event-card.tsx`, `use-admin-events.ts`). Components are still PascalCase inside the file.
- **Imports use the `@/` alias** (`@/components/...`), not long relative paths.
- **Pages live in `routes/`**: one folder per URL segment, `index.tsx` for the list page and `detail.tsx` for the `:id` page. Page-specific UI goes in `components/<feature>/`, not next to the page.
- **Data flow**: raw HTTP calls in `api/`, React Query wrappers in `hooks/`, pages consume the hooks.
- **Validation** schemas live in `lib/schema.ts`; types in `types/`.
- **Assets** are used through `UI_ASSETS` (`lib/assets.ts`), where `man-with-hand-up.svg` becomes `UI_ASSETS.manWithHandUp`, or imported directly from `@/assets/...`.

### Adding a new page

1. Add the API call in `src/api/<resource>.ts` (use `api` from `@/api/client`).
2. Wrap it in a React Query hook in the matching `src/hooks/<area>/` folder.
3. Create the page in `src/routes/<area>/<name>/index.tsx` and put its UI pieces in `src/components/<feature>/`.
4. Register the route in `src/app/router.tsx` using the lazy-import pattern used by the other routes.

### Adding a shadcn/ui component

```bash
npx shadcn@latest add <component>
```

Components are installed into `src/components/ui/` (see `components.json`).

## Deployment

The app is deployed on **Vercel**. `vercel.json` does two things: it proxies `/api/v1/*` to the hosted backend, and rewrites every other path to `index.html` so client-side routing works on refresh.

Build command: `npm run build`. Output directory: `dist`.