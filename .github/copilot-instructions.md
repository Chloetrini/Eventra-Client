# Copilot Instructions for Eventra

- This is a Vite + React + TypeScript app using React Router v8, React Query, Tailwind v4, and shadcn-style UI primitives.
- `src/routes/index.tsx` is the routing entrypoint. Route metadata lives in `handle.seo`, and the root layout in `src/routes/root/layout.tsx` reads that to render page titles with `react-helmet-async`.
- UI components are under `src/components/ui/`. Reusable buttons, form fields, and input wrappers follow a shadcn-like pattern with `cn()` merging from `src/lib/utils.ts`.
- Forms use `react-hook-form` with `zodResolver`. Validation schemas are defined in `src/lib/schema.ts`, and form fields are rendered through `src/components/ui/form-box.tsx`.
- API calls go through `src/lib/api.ts`. The base URL is `VITE_API_URL || '/api/v1'` and all requests are JSON with credentials enabled.
- App root is `src/App.tsx`: `ToastContainer` + `QueryClientProvider` wrap `RouterProvider`.
- `src/components/error-boundary.tsx` is the route error boundary and must remain mounted on top-level route config.
- `vite.config.ts` uses path alias `@ -> src`, so imports should use `@/...` consistently.
- The dev server proxies `/api` to `http://localhost:4001` in `vite.config.ts`.

Build / run commands:
- `npm run dev` — start Vite dev server
- `npm run build` — run `tsc -b` then `vite build`
- `npm run lint` — run `eslint .`

Project-specific notes:
- There is no test script configured, so avoid assuming a test harness exists.
- The `src/routes/main/register/index.tsx` page already uses `useMutation` from React Query and central API helper pattern.
- The project currently has lightweight layout shells: `src/routes/main/layout.tsx` and `src/routes/auth/layout.tsx` are minimal wrappers around `<Outlet />`.
- CSS is managed in `src/index.css` with Tailwind imports and custom CSS variables for theme colors.

When extending the app:
- Add new pages under `src/routes/` and lazy-load them from `src/routes/index.tsx`.
- Use `handle.seo` metadata for page title/description.
- Keep API requests inside `src/lib/api.ts` and use React Query for server mutations or fetching.
- Use the shared `FormBox` + `ActionBtn`/`Button` primitives for consistent form styling.
