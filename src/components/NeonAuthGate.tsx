import React, { useState, useEffect } from "react";
import { Loader2, Mail, Lock, ArrowRight, Shield, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";

interface NeonAuthGateProps {
  onAuthenticated: (username: string, role?: string) => void;
}

type Mode = "login" | "register" | "forgot" | "reset";

export default function NeonAuthGate({ onAuthenticated }: NeonAuthGateProps) {
  // Detect reset token in URL on mount
  const [mode, setMode] = useState<Mode>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("reset_token") ? "reset" : "login";
  });
  const [resetToken] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("reset_token") ?? "";
  });

  const [email, setEmail]                   = useState("");
  const [password, setPassword]             = useState("");
  const [name, setName]                     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass]             = useState(false);
  const [error, setError]                   = useState<string | null>(null);
  const [success, setSuccess]               = useState<string | null>(null);
  const [loading, setLoading]               = useState(false);

  // Clear token from URL once detected so it doesn't persist on refresh
  useEffect(() => {
    if (resetToken) {
      const url = new URL(window.location.href);
      url.searchParams.delete("reset_token");
      window.history.replaceState({}, "", url.toString());
    }
  }, [resetToken]);

  const switchMode = (m: Mode) => {
    setMode(m);
    setError(null);
    setSuccess(null);
    setPassword("");
    setConfirmPassword("");
  };

  // ── Login / Register ──────────────────────────────────────────────────────
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (mode === "register") {
      if (password !== confirmPassword) { setError("Las contraseñas no coinciden."); return; }
      if (password.length < 8)          { setError("La contraseña debe tener al menos 8 caracteres."); return; }
    }
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/neon-login" : "/api/auth/neon-register";
      const body: Record<string, string> = { email, password };
      if (mode === "register" && name.trim()) body.name = name.trim();
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Ocurrió un error inesperado.");
      onAuthenticated(data.user.username, data.user.role);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot password ───────────────────────────────────────────────────────
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Ocurrió un error inesperado.");
      setSuccess("Si el email está registrado, recibirás un correo con el enlace de reseteo en los próximos minutos.");
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  // ── Reset password ────────────────────────────────────────────────────────
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) { setError("Las contraseñas no coinciden."); return; }
    if (password.length < 8)          { setError("La contraseña debe tener al menos 8 caracteres."); return; }
    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, newPassword: password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Ocurrió un error inesperado.");
      setSuccess("¡Contraseña actualizada! Ya podés iniciar sesión con tu nueva contraseña.");
      setTimeout(() => switchMode("login"), 3000);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  // ── Shared field styles ───────────────────────────────────────────────────
  const inputCls =
    "w-full bg-[#0B131D] border border-[#1A2733] focus:border-[#10B981]/60 focus:ring-1 focus:ring-[#10B981]/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none transition-all";
  const inputWithIconCls = inputCls.replace("px-4", "pl-10 pr-4");

  const modeTitle: Record<Mode, string> = {
    login:    "Acceso seguro · Neon Auth",
    register: "Crear cuenta · Neon Auth",
    forgot:   "Recuperar contraseña",
    reset:    "Nueva contraseña",
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0B131D] px-4">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#10B981]/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0A2558] border border-slate-800 mb-4 shadow-[0_0_30px_rgba(10,37,88,0.15)] overflow-hidden">
            <img src="/favicon.svg" alt="Clientum Logo" className="w-10 h-10" referrerPolicy="no-referrer" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Clientum CRM</h1>
          <p className="text-zinc-500 text-sm mt-1 font-mono uppercase tracking-wider text-[11px]">
            {modeTitle[mode]}
          </p>
        </div>

        {/* Login / Register tabs (only for those two modes) */}
        {(mode === "login" || mode === "register") && (
          <div className="flex bg-[#1A2733]/50 rounded-xl p-1 mb-5 border border-[#1A2733]">
            {(["login", "register"] as Mode[]).map((m) => (
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
                {m === "login" ? "Iniciar sesión" : "Registrarse"}
              </button>
            ))}
          </div>
        )}

        {/* Back button for forgot / reset */}
        {(mode === "forgot" || mode === "reset") && (
          <button
            type="button"
            onClick={() => switchMode("login")}
            className="flex items-center gap-1.5 text-[12px] text-zinc-500 hover:text-zinc-300 transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver al inicio de sesión
          </button>
        )}

        {/* ── LOGIN / REGISTER form ── */}
        {(mode === "login" || mode === "register") && (
          <form onSubmit={handleAuthSubmit} className="bg-[#111C28] border border-[#1A2733] rounded-2xl p-6 space-y-4 shadow-2xl">
            {/* Name (register only) */}
            {mode === "register" && (
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">Nombre</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Jonathan García" className={inputCls} />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  required autoComplete="email" placeholder="vos@clientum.com.ar"
                  className={inputWithIconCls} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input type={showPass ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)} required minLength={8}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  placeholder="••••••••"
                  className="w-full bg-[#0B131D] border border-[#1A2733] focus:border-[#10B981]/60 focus:ring-1 focus:ring-[#10B981]/20 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none transition-all" />
                <button type="button" tabIndex={-1} onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Forgot password link */}
              {mode === "login" && (
                <div className="text-right mt-1.5">
                  <button type="button" onClick={() => switchMode("forgot")}
                    className="text-[11px] text-zinc-500 hover:text-[#34D399] transition-colors">
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              )}
            </div>

            {/* Confirm Password (register only) */}
            {mode === "register" && (
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">Confirmar contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input type={showPass ? "text" : "password"} value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8}
                    autoComplete="new-password" placeholder="••••••••" className={inputWithIconCls} />
                </div>
              </div>
            )}

            {error && (
              <div className="text-[12px] text-red-400 bg-red-950/40 border border-red-900/50 rounded-xl px-3 py-2.5 leading-relaxed">{error}</div>
            )}

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#0ea472] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl py-2.5 text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <>{mode === "login" ? "Ingresar al CRM" : "Crear cuenta"}<ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        )}

        {/* ── FORGOT PASSWORD form ── */}
        {mode === "forgot" && (
          <form onSubmit={handleForgotSubmit} className="bg-[#111C28] border border-[#1A2733] rounded-2xl p-6 space-y-4 shadow-2xl">
            {success ? (
              <div className="text-center py-4">
                <CheckCircle className="w-10 h-10 text-[#34D399] mx-auto mb-3" />
                <p className="text-sm text-zinc-300 leading-relaxed">{success}</p>
                <button type="button" onClick={() => switchMode("login")}
                  className="mt-5 text-[12px] text-[#34D399] hover:text-[#10B981] transition-colors">
                  Volver al inicio de sesión
                </button>
              </div>
            ) : (
              <>
                <p className="text-[13px] text-zinc-400 leading-relaxed">
                  Ingresá tu email y te enviaremos un enlace para restablecer tu contraseña.
                </p>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      required autoComplete="email" placeholder="vos@clientum.com.ar"
                      className={inputWithIconCls} />
                  </div>
                </div>

                {error && (
                  <div className="text-[12px] text-red-400 bg-red-950/40 border border-red-900/50 rounded-xl px-3 py-2.5 leading-relaxed">{error}</div>
                )}

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#0ea472] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl py-2.5 text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.25)]">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                    <>Enviar enlace de reseteo<ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </>
            )}
          </form>
        )}

        {/* ── RESET PASSWORD form ── */}
        {mode === "reset" && (
          <form onSubmit={handleResetSubmit} className="bg-[#111C28] border border-[#1A2733] rounded-2xl p-6 space-y-4 shadow-2xl">
            {success ? (
              <div className="text-center py-4">
                <CheckCircle className="w-10 h-10 text-[#34D399] mx-auto mb-3" />
                <p className="text-sm text-zinc-300 leading-relaxed">{success}</p>
                <p className="text-[11px] text-zinc-500 mt-2">Redirigiendo al login…</p>
              </div>
            ) : (
              <>
                <p className="text-[13px] text-zinc-400 leading-relaxed">
                  Elegí una nueva contraseña para tu cuenta. Debe tener al menos 8 caracteres.
                </p>

                {/* New Password */}
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">Nueva contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input type={showPass ? "text" : "password"} value={password}
                      onChange={(e) => setPassword(e.target.value)} required minLength={8}
                      autoComplete="new-password" placeholder="••••••••"
                      className="w-full bg-[#0B131D] border border-[#1A2733] focus:border-[#10B981]/60 focus:ring-1 focus:ring-[#10B981]/20 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none transition-all" />
                    <button type="button" tabIndex={-1} onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">Confirmar contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input type={showPass ? "text" : "password"} value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8}
                      autoComplete="new-password" placeholder="••••••••" className={inputWithIconCls} />
                  </div>
                </div>

                {error && (
                  <div className="text-[12px] text-red-400 bg-red-950/40 border border-red-900/50 rounded-xl px-3 py-2.5 leading-relaxed">{error}</div>
                )}

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#0ea472] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl py-2.5 text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.25)]">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                    <>Guardar nueva contraseña<ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </>
            )}
          </form>
        )}

        {/* Footer */}
        <p className="text-center text-[11px] text-zinc-600 mt-5">
          Autenticación gestionada por{" "}
          <span className="text-zinc-500 font-semibold">Neon Auth</span>
          {" · "}
          <span className="text-zinc-500 font-semibold">Better Auth</span>
        </p>
      </div>
    </div>
  );
}
