# Eventra mobile

Expo (React Native) app for attendees, running against the same backend as the web client.

```bash
cd mobile
npm install
npm start            # then press i / a, or scan the QR code with Expo Go
npm run typecheck
```

## API

Defaults to the hosted backend (`extra.apiUrl` in `app.json`). To use a local backend set
`EXPO_PUBLIC_API_URL` in `mobile/.env` (see `.env.example`). Use your machine's LAN IP, not
`localhost`, or the phone can't reach it.

## What's in it

Light and dark mode (follows the phone, switch in Profile), a branded Eventra opening screen, featured carousel, full-bleed event pages, ticket-style passes. Browse and search events, event detail, save events, free RSVP, paid checkout (Paystack in
an in-app browser, then the order is polled until paid), tickets with QR code, login,
register and email-OTP verification.

Auth uses the backend's existing session cookie. The native networking stack keeps it, so no
backend changes were needed. Organizer and admin features stay on the web app.

## Known gaps

- Paystack redirects back to the web `CLIENT_URL/checkout/callback`; the app just closes the browser and polls the order. A deep link (`eventra://`) callback would need a backend change.
- Google sign-in, forgot/reset password, guest checkout, refunds and notifications are not built yet.
- Not yet run on a device or simulator; verified by typecheck and a production bundle only.

## Organizer and admin

Log in with an organizer or admin account and the app opens that dashboard (Profile → "Open dashboard" gets you back; More → "Browse events as an attendee" switches to the attendee view).

- **Organizer:** overview and revenue, events list, create event (draft or submit), event management, QR check-in with guest list, payouts.
- **Admin:** overview, approvals (events, organizers), refunds, payouts release, users (suspend / restore).

Organizer onboarding (business profile, bank details, documents), promotions, disputes, reports and admin settings stay on the website for now.
