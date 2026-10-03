# Eventra desktop

Electron shell around the web client (attendee, organizer and admin screens). A tiny local
server serves the built `dist/` and proxies `/api/v1` to the backend, like `vercel.json`
does, so login cookies behave the same as in the browser.

```bash
cd desktop
npm install
npm start     # builds the web app, then opens the window
npm run dist  # installers for the current OS (dmg / exe / AppImage)
```

Set `EVENTRA_API_ORIGIN` to use a different backend. Payment pages open in the system browser,
after which the user returns to the app; the Paystack callback lands on the web `CLIENT_URL`.
Not yet run on a real desktop; verified by syntax check only. Google sign-in may be blocked on
the `127.0.0.1` origin until it's added to the Google client's authorised origins.
