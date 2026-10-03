# AGENTS.md: Eventra Client

Loaded at the start of every AI session on this repo. Keep it true: when you change a convention or hit a gotcha, update this file.

## What this is

The web frontend for **Eventra**, an event discovery and ticketing platform. Three audiences share one app: attendees (browse, buy tickets, refunds), organizers (onboarding, create events, check-in, payouts) and admins (approvals, refunds, payouts, platform settings). API: [eventra-backend](https://github.com/Chloetrini/eventra-backend).

## Stack (do not swap without asking)

React 19 + TypeScript (strict) · Vite (React Compiler on) · Tailwind CSS 4 · shadcn/ui (base-nova) + MUI date pickers · React Router 8 (data router, lazy routes) · TanStack Query · Axios · React Hook Form + Zod · Recharts · Leaflet · html5-qrcode · @react-oauth/google · react-toastify.

## Commands

```bash
npm run dev       # http://localhost:4001, proxies /api to http://localhost:4000
npm run build     # tsc -b && vite build
npm run lint      # eslint .
npm run preview
```

There is no test script. Do not assume a test runner exists.

Status today: `build` passes. `lint` reports many existing errors (about 110), so a clean lint is not the bar. The bar is: do not add new errors in files you touch, and `build` passes.

## Environment

Copy `.env.example` to `.env` (git-ignored).

- `VITE_API_URL` is optional. Default is `/api/v1`. `/api/v1` is appended if missing.
- `VITE_GOOGLE_CLIENT_ID` is needed for Google sign-in.
- In production `vercel.json` rewrites `/api/v1/*` to the hosted backend and every other path to `index.html`.

## Mobile app

`mobile/` is a separate Expo (React Native) app for attendees, using the same backend via the session cookie. It has its own `package.json`; run `npm run typecheck` there. It is not part of the Vite build or this repo's lint. See `mobile/README.md`.

## Layout

```
src/app/         app.tsx (providers), router.tsx (route table)
src/api/         one module per backend resource; client.ts is the shared Axios instance
src/routes/      pages, mirroring URLs: main/ auth/ onboarding/ dashboard/ admin/
src/components/  ui/ (shadcn primitives only), form/, layout/, guards/, shared/, skeletons/, dialogs/, <feature>/
src/hooks/       React Query wrappers: admin/ organizer/ events/ shared/
src/context/     auth, auth gate, checkout, theme
src/lib/         helpers; schema.ts holds the Zod schemas
src/types/       shared types
```

## Conventions

- File names are kebab-case; components are PascalCase inside. Imports use the `@/` alias.
- Data flow: raw HTTP in `src/api/`, React Query wrappers in `src/hooks/`, pages consume hooks. No `fetch`/`axios` calls inside components.
- Forms: React Hook Form + `zodResolver`; schemas in `src/lib/schema.ts`.
- Every page is lazy-loaded from `src/app/router.tsx`. List page is `index.tsx`, detail page is `detail.tsx`. Page-only UI lives in `components/<feature>/`, not next to the page.
- Route guards: `RequireOrganizer` for `/dashboard/*`, `RequireAdmin` for `/admin/*`.
- Use `cn()` from `src/lib/utils.ts` to merge classes. Use shadcn components from `src/components/ui/`; add new ones with `npx shadcn@latest add <name>`.

## Adding a page

1. API call in `src/api/<resource>.ts` using the client from `@/api/client`.
2. React Query hook in the matching `src/hooks/<area>/`.
3. Page in `src/routes/<area>/<name>/index.tsx`, UI pieces in `src/components/<feature>/`.
4. Register the route in `src/app/router.tsx` with the same lazy pattern as the others.

## Workflow

Work on feature branches and open PRs into `devbranch`. Do not push straight to it. Do not commit `.env`.

## Commits

Author every commit as `Chloetrini <trinityegbukwu1@gmail.com>`, never as "Claude" or "Claude with Trini". Set it before committing: `git config user.name "Chloetrini" && git config user.email trinityegbukwu1@gmail.com`.

## Gotchas

- The dev server is on **4001** and the backend on **4000**. They were once mixed up so every local call proxied to itself. Check `vite.config.ts` before touching the proxy.
- Payments go through Paystack. The callback page is `/payment/checkout/callback`.
