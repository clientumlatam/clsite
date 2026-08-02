// ── Neon Auth SDK shim ────────────────────────────────────────────────────────
// Implements the same API surface as @neondatabase/neon-js/auth
// All calls go through the Express proxy endpoints (server.ts) which talk to
// the Neon Auth REST API and manage Express sessions.

export interface NeonUser {
  id: string | number;
  username: string;
  email?: string;
  name?: string;
  role?: string;
}

export interface NeonSession {
  token: string;
  expiresAt?: string;
}

export type AuthClient = ReturnType<typeof createAuthClient>;

export function createAuthClient(_neonAuthUrl: string | undefined) {
  // _neonAuthUrl is accepted for interface compatibility but the actual
  // Neon Auth calls happen server-side (Express proxy handles origin/CORS).

  return {
    /** Sign in with email + password */
    signIn: {
      email: async ({ email, password }: { email: string; password: string }) => {
        const res = await fetch("/api/auth/neon-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) return { data: null, error: { message: data.error || "Error al iniciar sesión." } };
        return { data: { user: data.user as NeonUser, session: { token: "session" } as NeonSession }, error: null };
      },
    },

    /** Create a new account with email + password */
    signUp: {
      email: async ({ email, password, name }: { email: string; password: string; name?: string }) => {
        const res = await fetch("/api/auth/neon-register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });
        const data = await res.json();
        if (!res.ok) return { data: null, error: { message: data.error || "Error al registrarse." } };
        return { data: { user: data.user as NeonUser, session: { token: "session" } as NeonSession }, error: null };
      },
    },

    /** Sign out — destroys the Express session */
    signOut: async () => {
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch { /* ignore */ }
      return { data: null, error: null };
    },

    /** Get the currently active session + user */
    getSession: async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) return { data: { session: null, user: null }, error: null };
        const data = await res.json();
        if (!data?.user?.username) return { data: { session: null, user: null }, error: null };
        return {
          data: {
            session: { token: "session" } as NeonSession,
            user: data.user as NeonUser,
          },
          error: null,
        };
      } catch {
        return { data: { session: null, user: null }, error: null };
      }
    },

    /** Send a password-reset email */
    requestPasswordReset: async ({ email }: { email: string }) => {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) return { data: null, error: { message: data.error || "Error al enviar email." } };
      return { data: { ok: true }, error: null };
    },

    /** Reset password using a token from the reset email */
    resetPassword: async ({ token, password }: { token: string; password: string }) => {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) return { data: null, error: { message: data.error || "Error al resetear contraseña." } };
      return { data: { ok: true }, error: null };
    },

    /** Change password for the signed-in user */
    changePassword: async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) return { data: null, error: { message: data.error || "Error al cambiar contraseña." } };
      return { data: { ok: true }, error: null };
    },
  };
}
