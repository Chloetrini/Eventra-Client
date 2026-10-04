// Extends app.json with the Google sign-in settings. None of these are secrets
// (they're public OAuth client ids), but they differ per environment, so they
// come from EXPO_PUBLIC_* variables (set in EAS or a local .env).
module.exports = ({ config })
