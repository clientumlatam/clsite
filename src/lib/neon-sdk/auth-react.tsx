// ── NeonAuthUIProvider + hooks ────────────────────────────────────────────────
// Shim for @neondatabase/neon-js/auth/react
// Provides auth context, useAuth(), and useUser() hooks compatible with the SDK.

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { AuthClient, NeonUser } from "./auth";

// ── Context ───────────────────────────────────────────────────────────────────
interface AuthContextValue {
  user: NeonUser | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  authClient: AuthClient;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  /** Called after a successful sign-in/sign-up to sync context */
  onSignIn: (user: NeonUser) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────
interface NeonAuthUIProviderProps {
  authClient: AuthClient;
  children: React.ReactNode;
  /** Accepted for SDK API compatibility; not used in the shim */
  emailOTP?: boolean;
}

export function NeonAuthUIProvider({ authClient, children }: NeonAuthUIProviderProps) {
  const [user, setUser] = useState<NeonUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const refreshSession = useCallback(async () => {
    const result = await authClient.getSession();
    const u = result.data?.user ?? null;
    setUser(u as NeonUser | null);
  }, [authClient]);

  // Check session on mount
  useEffect(() => {
    refreshSession().finally(() => setIsLoaded(true));
  }, [refreshSession]);

  const signOut = useCallback(async () => {
    await authClient.signOut();
    setUser(null);
  }, [authClient]);

  const onSignIn = useCallback((u: NeonUser) => {
    setUser(u);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoaded, isSignedIn: !!user, authClient, signOut, refreshSession, onSignIn }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hooks ─────────────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <NeonAuthUIProvider>");
  return ctx;
}

export function useUser() {
  const { user, isLoaded, isSignedIn } = useAuth();
  return { user, isLoaded, isSignedIn };
}
