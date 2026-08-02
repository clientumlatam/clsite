// Neon Auth integration — REST API proxy (no SDK needed)
//
// The @neondatabase/neon-js SDK cannot be installed in Replit because its
// dependency `better-auth` is blocked by the firewall. Instead:
//
//  • Auth calls go to our Express backend (/api/auth/neon-login, /api/auth/neon-register)
//  • The backend proxies server-side to Neon Auth's REST API with the correct
//    Origin header, then creates an Express session on success.
//  • VITE_NEON_AUTH_URL is still used as the base URL for the backend proxy.
//
// This achieves the same result: Neon Auth manages the identity, our DB keeps
// the local user record for CRM role management.

export const NEON_AUTH_URL =
  (import.meta.env.VITE_NEON_AUTH_URL as string) ||
  "https://ep-plain-bread-achv6ed0.neonauth.sa-east-1.aws.neon.tech/neondb/auth";

// No-op stub so any file that imported `authClient` from here still compiles.
export const authClient = {
  baseURL: NEON_AUTH_URL,
};
