// ── Neon Auth UI Components ───────────────────────────────────────────────────
// Shim for @neondatabase/neon-js/auth/react/ui
// Implements: AuthView, AccountView, SignedIn, UserButton, RedirectToSignIn

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, CheckCircle, Eye, EyeOff,
  Lock, LogOut, Mail, Shield, User, Loader2, ChevronDown,
} from "lucide-react";
import { useAuth, useUser } from "./auth-react";

// ── Shared styles ─────────────────────────────────────────────────────────────
const inputBase =
  "w-full bg-[#0B131D] border border-[#1A2733] focus:border-[#10B981]/60 focus:ring-1 focus:ring-[#10B981]/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none transition-all";
const inputIcon = inputBase.replace("px-4", "pl-10 pr-4");
const labelCls = "block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase tracking-wider";
const btnGreen =
  "w-full flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#0ea472] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl py-2.5 text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.25)]";
const errorBox =
  "text-[12px] text-red-400 bg-red-950/40 border border-red-900/50 rounded-xl px-3 py-2.5 leading-relaxed";

// ── AuthView ──────────────────────────────────────────────────────────────────
// pathname: "sign-in" | "sign-up" | "forgot-password" | "reset-password"
type AuthMode = "sign-in" | "sign-up" | "forgot-password" | "reset-password";

interface AuthViewProps {
  pathname?: string;
  onSuccess?: () => void;
}

export function AuthView({ pathname, onSuccess }: AuthViewProps) {
  const navigate = useNavigate();
  const { authClient, onSignIn } = useAuth();

  const resolveMode = (p?: string): AuthMode => {
    if (!p) return "sign-in";
    if (p === "sign-up") return "sign-up";
    if (p === "forgot-password") return "forgot-password";
    if (p === "reset-password") return "reset-password";
    return "sign-in";
  };

  const [mode, setMode] = useState<AuthMode>(() => {
    // Also check URL for reset_token
    const params = new URLSearchParams(window.location.search);
    if (params.get("reset_token")) return "reset-password";
    return resolveMode(pathname);
  });

  const [resetToken] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("reset_token") ?? "";
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const switchMode = (m: AuthMode) => {
    setMode(m);
    setError(null);
    setSuccess(null);
    setPassword("");
    setConfirmPassword("");
    navigate(`/auth/${m}`, { replace: true });
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (mode === "sign-up") {
      if (password !== confirmPassword) { setError("Las contraseñas no coinciden."); return; }
      if (password.length < 8) { setError("Mínimo 8 caracteres."); return; }
    }
    setLoading(true);
    try {
      let result;
      if (mode === "sign-in") {
        result = await authClient.signIn.email({ email, password });
      } else {
        result = await authClient.signUp.email({ email, password, name: name.trim() || undefined });
      }
      if (result.error) throw new Error(result.error.message);
      if (result.data?.user) onSignIn(result.data.user as any);
      onSuccess?.();
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Ocurrió un error.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await authClient.requestPasswordReset({ email });
      if (result.error) throw new Error(result.error.message);
      setSuccess("Si el email está registrado, recibirás un enlace en los próximos minutos.");
    } catch (err: any) {
      setError(err.message || "Ocurrió un error.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) { setError("Las contraseñas no coinciden."); return; }
    if (password.length < 8) { setError("Mínimo 8 caracteres."); return; }
    setLoading(true);
    try {
      const result = await authClient.resetPassword({ token: resetToken, password });
      if (result.error) throw new Error(result.error.message);
      setSuccess("¡Contraseña actualizada! Redirigiendo…");
      setTimeout(() => switchMode("sign-in"), 2500);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0B131D] px-4">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#10B981]/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20 mb-4 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <Shield className="w-7 h-7 text-[#34D399]" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Clientum CRM</h1>
          <p className="text-zinc-500 text-[11px] mt-1 font-mono uppercase tracking-wider">
            {mode === "sign-in" ? "Acceso seguro · Neon Auth"
              : mode === "sign-up" ? "Crear cuenta · Neon Auth"
              : mode === "forgot-password" ? "Recuperar contraseña"
              : "Nueva contraseña"}
          </p>
        </div>

        {/* Sign-in / Sign-up tabs */}
        {(mode === "sign-in" || mode === "sign-up") && (
          <div className="flex bg-[#1A2733]/50 rounded-xl p-1 mb-5 border border-[#1A2733]">
            {(["sign-in", "sign-up"] as AuthMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={`flex-1 py-2 text-[12px] font-bold rounded-lg transition-all ${
                  mode === m
                    ? "bg-[#10B981]/10 text-[#34D399] border border-[#10B981]/20"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {m === "sign-in" ? "Iniciar sesión" : "Registrarse"}
              </button>
            ))}
          </div>
        )}

        {/* Back button */}
        {(mode === "forgot-password" || mode === "reset-password") && (
          <button
            type="button"
            onClick={() => switchMode("sign-in")}
            className="flex items-center gap-1.5 text-[12px] text-zinc-500 hover:text-zinc-300 transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver al inicio de sesión
          </button>
        )}

        {/* ── Sign-in / Sign-up form ── */}
        {(mode === "sign-in" || mode === "sign-up") && (
          <form onSubmit={handleAuthSubmit} className="bg-[#111C28] border border-[#1A2733] rounded-2xl p-6 space-y-4 shadow-2xl">
            {mode === "sign-up" && (
              <div>
                <label className={labelCls}>Nombre</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jonathan García" className={inputBase} />
              </div>
            )}
            <div>
              <label className={labelCls}>Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="vos@clientum.com.ar" className={inputIcon} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete={mode === "sign-in" ? "current-password" : "new-password"} placeholder="••••••••" className="w-full bg-[#0B131D] border border-[#1A2733] focus:border-[#10B981]/60 focus:ring-1 focus:ring-[#10B981]/20 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none transition-all" />
                <button type="button" tabIndex={-1} onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {mode === "sign-in" && (
                <div className="text-right mt-1.5">
                  <button type="button" onClick={() => switchMode("forgot-password")} className="text-[11px] text-zinc-500 hover:text-[#34D399] transition-colors">
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              )}
            </div>
            {mode === "sign-up" && (
              <div>
                <label className={labelCls}>Confirmar contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input type={showPass ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8} autoComplete="new-password" placeholder="••••••••" className={inputIcon} />
                </div>
              </div>
            )}
            {error && <div className={errorBox}>{error}</div>}
            <button type="submit" disabled={loading} className={btnGreen}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <>{mode === "sign-in" ? "Ingresar al CRM" : "Crear cuenta"}<ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        )}

        {/* ── Forgot password form ── */}
        {mode === "forgot-password" && (
          <form onSubmit={handleForgotSubmit} className="bg-[#111C28] border border-[#1A2733] rounded-2xl p-6 space-y-4 shadow-2xl">
            {success ? (
              <div className="text-center py-4">
                <CheckCircle className="w-10 h-10 text-[#34D399] mx-auto mb-3" />
                <p className="text-sm text-zinc-300 leading-relaxed">{success}</p>
                <button type="button" onClick={() => switchMode("sign-in")} className="mt-5 text-[12px] text-[#34D399] hover:text-[#10B981]">
                  Volver al inicio de sesión
                </button>
              </div>
            ) : (
              <>
                <p className="text-[13px] text-zinc-400 leading-relaxed">Ingresá tu email y te enviamos un enlace para restablecer tu contraseña.</p>
                <div>
                  <label className={labelCls}>Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="vos@clientum.com.ar" className={inputIcon} />
                  </div>
                </div>
                {error && <div className={errorBox}>{error}</div>}
                <button type="submit" disabled={loading} className={btnGreen}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Enviar enlace</span><ArrowRight className="w-4 h-4" /></>}
                </button>
              </>
            )}
          </form>
        )}

        {/* ── Reset password form ── */}
        {mode === "reset-password" && (
          <form onSubmit={handleResetSubmit} className="bg-[#111C28] border border-[#1A2733] rounded-2xl p-6 space-y-4 shadow-2xl">
            {success ? (
              <div className="text-center py-4">
                <CheckCircle className="w-10 h-10 text-[#34D399] mx-auto mb-3" />
                <p className="text-sm text-zinc-300 leading-relaxed">{success}</p>
              </div>
            ) : (
              <>
                <p className="text-[13px] text-zinc-400">Elegí una nueva contraseña. Mínimo 8 caracteres.</p>
                <div>
                  <label className={labelCls}>Nueva contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" placeholder="••••••••" className="w-full bg-[#0B131D] border border-[#1A2733] focus:border-[#10B981]/60 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none transition-all" />
                    <button type="button" tabIndex={-1} onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Confirmar contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input type={showPass ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required autoComplete="new-password" placeholder="••••••••" className={inputIcon} />
                  </div>
                </div>
                {error && <div className={errorBox}>{error}</div>}
                <button type="submit" disabled={loading} className={btnGreen}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Guardar contraseña</span><ArrowRight className="w-4 h-4" /></>}
                </button>
              </>
            )}
          </form>
        )}

        <p className="text-center text-[11px] text-zinc-600 mt-5">
          Autenticación gestionada por <span className="text-zinc-500 font-semibold">Neon Auth</span>{" · "}<span className="text-zinc-500 font-semibold">Better Auth</span>
        </p>
      </div>
    </div>
  );
}

// ── AccountView ───────────────────────────────────────────────────────────────
interface AccountViewProps {
  pathname?: string;
}

export function AccountView({ pathname: _pathname }: AccountViewProps) {
  const { user, signOut, authClient } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState<"profile" | "password">("profile");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  if (!user) {
    navigate("/auth/sign-in", { replace: true });
    return null;
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (newPassword !== confirmPassword) { setMessage({ type: "err", text: "Las contraseñas no coinciden." }); return; }
    if (newPassword.length < 8) { setMessage({ type: "err", text: "Mínimo 8 caracteres." }); return; }
    setLoading(true);
    try {
      const result = await authClient.changePassword({ currentPassword, newPassword });
      if (result.error) throw new Error(result.error.message);
      setMessage({ type: "ok", text: "Contraseña actualizada correctamente." });
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err: any) {
      setMessage({ type: "err", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const roleLabel: Record<string, string> = { admin: "Administrador", user: "Usuario", prospector: "Prospector" };

  return (
    <div className="min-h-screen bg-[#0B131D] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center">
            <User className="w-6 h-6 text-[#34D399]" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">{user.name || user.username}</h1>
            <p className="text-sm text-zinc-400">{roleLabel[user.role ?? "user"] || user.role}</p>
          </div>
        </div>

        <div className="bg-[#111C28] border border-[#1A2733] rounded-xl p-5 mb-6 space-y-3">
          {user.email && (
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <Mail className="w-4 h-4 text-zinc-500" />
              <span>{user.email}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm text-zinc-300">
            <User className="w-4 h-4 text-zinc-500" />
            <span>@{user.username}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-zinc-300">
            <Shield className="w-4 h-4 text-zinc-500" />
            <span>{roleLabel[user.role ?? "user"] || user.role}</span>
          </div>
        </div>

        <div className="flex gap-1 bg-[#111C28] border border-[#1A2733] rounded-xl p-1 mb-6">
          {(["profile", "password"] as const).map((s) => (
            <button key={s} onClick={() => setSection(s)} className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${section === s ? "bg-[#10B981]/10 text-[#34D399] border border-[#10B981]/20" : "text-zinc-400 hover:text-white"}`}>
              {s === "profile" ? "Perfil" : "Contraseña"}
            </button>
          ))}
        </div>

        {section === "password" && (
          <form onSubmit={handleChangePassword} className="bg-[#111C28] border border-[#1A2733] rounded-xl p-5 space-y-4 mb-4">
            {message && (
              <div className={`flex items-start gap-2 rounded-lg px-3 py-2 text-sm ${message.type === "ok" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                {message.text}
              </div>
            )}
            {[["Contraseña actual", currentPassword, setCurrentPassword, "current-password"], ["Nueva contraseña", newPassword, setNewPassword, "new-password"], ["Confirmar contraseña", confirmPassword, setConfirmPassword, "new-password"]].map(([label, val, setter, ac]) => (
              <div key={label as string}>
                <label className={labelCls}>{label as string}</label>
                <input type="password" value={val as string} onChange={(e) => (setter as any)(e.target.value)} required autoComplete={ac as string} className="w-full bg-[#0B131D] border border-[#1A2733] focus:border-[#10B981]/60 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors" placeholder="••••••••" />
              </div>
            ))}
            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#0ea472] disabled:opacity-50 text-white text-sm font-bold py-2.5 rounded-xl transition-colors">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Actualizar contraseña
            </button>
          </form>
        )}

        {section === "profile" && (
          <div className="bg-[#111C28] border border-[#1A2733] rounded-xl overflow-hidden mb-4">
            <div className="px-5 py-3 border-b border-[#1A2733]">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Información de cuenta</p>
            </div>
            <div className="divide-y divide-[#1A2733]">
              <div className="px-5 py-3 flex items-center justify-between">
                <span className="text-sm text-zinc-400">Usuario</span>
                <span className="text-sm text-white font-mono">@{user.username}</span>
              </div>
              {user.email && (
                <div className="px-5 py-3 flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Email</span>
                  <span className="text-sm text-white">{user.email}</span>
                </div>
              )}
              <div className="px-5 py-3 flex items-center justify-between">
                <span className="text-sm text-zinc-400">Rol</span>
                <span className="text-sm text-[#34D399]">{roleLabel[user.role ?? "user"] || user.role}</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2 mt-4">
          <button onClick={() => navigate("/")} className="w-full flex items-center justify-between px-4 py-3 bg-[#111C28] border border-[#1A2733] rounded-xl text-sm text-zinc-300 hover:text-white hover:border-[#2D3B48] transition-colors">
            <span>Ir al panel</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={handleSignOut} className="w-full flex items-center justify-between px-4 py-3 bg-[#111C28] border border-red-900/40 rounded-xl text-sm text-red-400 hover:bg-red-950/20 hover:border-red-800/60 transition-colors">
            <span className="flex items-center gap-2"><LogOut className="w-4 h-4" />Cerrar sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── SignedIn ──────────────────────────────────────────────────────────────────
/** Renders children only when the user is authenticated */
export function SignedIn({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) return null;
  if (!isSignedIn) return null;
  return <>{children}</>;
}

// ── SignedOut ─────────────────────────────────────────────────────────────────
/** Renders children only when the user is NOT authenticated */
export function SignedOut({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) return null;
  if (isSignedIn) return null;
  return <>{children}</>;
}

// ── RedirectToSignIn ──────────────────────────────────────────────────────────
/** Redirects to /auth/sign-in if the user is not signed in */
export function RedirectToSignIn() {
  const { isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();
  if (!isLoaded) return null;
  if (!isSignedIn) {
    navigate("/auth/sign-in", { replace: true });
  }
  return null;
}

// ── UserButton ────────────────────────────────────────────────────────────────
/** A compact user avatar/name button with sign-out dropdown */
export function UserButton({ afterSignOutUrl = "/" }: { afterSignOutUrl?: string }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const initial = (user.name || user.username || "U")[0].toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate(afterSignOutUrl, { replace: true });
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 bg-[#111C28] border border-[#1A2733] hover:border-[#2D3B48] rounded-xl px-3 py-2 transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-[12px] font-bold text-[#34D399]">
          {initial}
        </div>
        <span className="text-sm text-zinc-300 max-w-[100px] truncate">{user.name || user.username}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-48 bg-[#111C28] border border-[#1A2733] rounded-xl shadow-2xl overflow-hidden z-50">
          <div className="px-3 py-2.5 border-b border-[#1A2733]">
            <p className="text-[11px] font-bold text-white truncate">{user.name || user.username}</p>
            {user.email && <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>}
          </div>
          <button onClick={() => { setOpen(false); navigate("/account/profile"); }} className="w-full text-left px-3 py-2.5 text-[12px] text-zinc-300 hover:bg-[#1A2733] flex items-center gap-2 transition-colors">
            <User className="w-3.5 h-3.5" /> Mi cuenta
          </button>
          <button onClick={handleSignOut} className="w-full text-left px-3 py-2.5 text-[12px] text-red-400 hover:bg-red-950/20 flex items-center gap-2 transition-colors border-t border-[#1A2733]">
            <LogOut className="w-3.5 h-3.5" /> Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
