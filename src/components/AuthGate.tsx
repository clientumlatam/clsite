import React, { useState, useEffect } from "react";
import { Loader2, Lock, User, ArrowRight, Mail, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";

interface AuthGateProps {
  onAuthenticated: (username: string, role?: string) => void;
}

type Mode = "login" | "register" | "forgot" | "reset";

export default function AuthGate({ onAuthenticated }: AuthGateProps) {
  const [mode, setMode] = useState<Mode>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("reset_token") ? "reset" : "login";
  });
  const [resetToken] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("reset_token") ?? "";
  });

  const [username, setUsername]             = useState("");
  const [email, setEmail]                   = useState("");
  const [password, setPassword]             = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass]             = useState(false);
  const [error, setError]                   = useState<string | null>(null);
  const [success, setSuccess]               = useState<string | null>(null);
  const [loading, setLoading]               = useState(false);

  // Remove reset_token from URL once captured
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

  // ── Login / Register ────────────────────────────────────────────────────────
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (mode === "register") {
      if (password !== confirmPassword) { setError("Las contraseñas no coinciden."); return; }
      if (password.length < 8)          { setError("La contraseña debe tener al menos 8 caracteres."); return; }
    }
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
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

  // ── Forgot password ─────────────────────────────────────────────────────────
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
      setSuccess("Si el email está registrado recibirás un correo con el enlace de reseteo en los próximos minutos.");
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  // ── Reset password ──────────────────────────────────────────────────────────
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

  const inputCls =
    "w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all";
  const inputIconCls =
    "w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all";
  const inputIconRightCls =
    "w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-10 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all";

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0A2558] mb-4 border border-slate-800 shadow-xl shadow-blue-900/10 overflow-hidden">
            <img src="/favicon.svg" alt="Clientum Logo" className="w-10 h-10" referrerPolicy="no-referrer" />
          </div>
          <h1 className="text-2xl font-semibold text-white">Clientum CRM</h1>
          <p className="text-slate-400 text-sm mt-1">
            {mode === "login"    && "Iniciá sesión para acceder al panel."}
            {mode === "register" && "Creá una cuenta para acceder al panel."}
            {mode === "forgot"   && "Recuperar contraseña"}
            {mode === "reset"    && "Crear nueva contraseña"}
          </p>
        </div>

        {/* Login / Register tabs */}
        {(mode === "login" || mode === "register") && (
          <div className="flex bg-slate-900/60 rounded-xl p-1 mb-5 border border-slate-800">
            {(["login", "register"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  mode === m
                    ? "bg-blue-600 text-white shadow"
                    : "text-slate-500 hover:text-slate-300"
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
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver al inicio de sesión
          </button>
        )}

        {/* ── LOGIN / REGISTER ── */}
        {(mode === "login" || mode === "register") && (
          <form onSubmit={handleAuthSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">

            {/* Usuario o Email */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Usuario o Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength={3}
                  maxLength={64}
                  autoComplete="username"
                  placeholder="tu_usuario o vos@email.com"
                  className={inputIconCls}
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-400">Contraseña</label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => switchMode("forgot")}
                    className="text-[11px] text-slate-500 hover:text-blue-400 transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  placeholder="••••••••"
                  className={inputIconRightCls}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirmar contraseña (register only) */}
            {mode === "register" && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Confirmar contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPass ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className={inputIconRightCls}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="text-sm text-red-400 bg-red-950/50 border border-red-900 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <>{mode === "login" ? "Ingresar" : "Crear cuenta"}<ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        )}

        {/* ── FORGOT PASSWORD ── */}
        {mode === "forgot" && (
          <form onSubmit={handleForgotSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            {success ? (
              <div className="text-center py-4">
                <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
                <p className="text-sm text-slate-300 leading-relaxed">{success}</p>
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="mt-5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Volver al inicio de sesión
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Ingresá el email con el que te registraste y te enviaremos un enlace para restablecer tu contraseña.
                </p>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      placeholder="vos@email.com"
                      className={inputIconCls}
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-sm text-red-400 bg-red-950/50 border border-red-900 rounded-lg px-3 py-2">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                    <>Enviar enlace de reseteo<ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </>
            )}
          </form>
        )}

        {/* ── RESET PASSWORD ── */}
        {mode === "reset" && (
          <form onSubmit={handleResetSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            {success ? (
              <div className="text-center py-4">
                <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
                <p className="text-sm text-slate-300 leading-relaxed">{success}</p>
                <p className="text-xs text-slate-500 mt-2">Redirigiendo al login…</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Elegí una nueva contraseña para tu cuenta. Debe tener al menos 8 caracteres.
                </p>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Nueva contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      className={inputIconRightCls}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Confirmar contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type={showPass ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      className={inputIconCls}
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-sm text-red-400 bg-red-950/50 border border-red-900 rounded-lg px-3 py-2">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                    <>Guardar nueva contraseña<ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </>
            )}
          </form>
        )}

        {/* Footer links */}
        <p className="text-center text-sm text-slate-500 mt-4">
          {mode === "login" && (
            <>
              ¿No tenés cuenta?{" "}
              <button type="button" onClick={() => switchMode("register")}
                className="text-blue-400 hover:text-blue-300 font-medium">
                Registrate
              </button>
            </>
          )}
          {mode === "register" && (
            <>
              ¿Ya tenés cuenta?{" "}
              <button type="button" onClick={() => switchMode("login")}
                className="text-blue-400 hover:text-blue-300 font-medium">
                Iniciá sesión
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
