import React, { useState, useEffect } from "react";
import {
  User,
  LogOut,
  Key,
  Mail,
  Shield,
  ChevronRight,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface AccountViewProps {
  username: string;
  role: string;
  onLogout: () => void;
  onBack?: () => void;
}

export default function AccountView({
  username,
  role,
  onLogout,
  onBack,
}: AccountViewProps) {
  const [section, setSection] = useState<"profile" | "password">("profile");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [profile, setProfile] = useState<{ email?: string; name?: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) setProfile(data.user);
      })
      .catch(() => {});
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (newPassword !== confirmPassword) {
      setMessage({ type: "err", text: "Las contraseñas no coinciden." });
      return;
    }
    if (newPassword.length < 8) {
      setMessage({ type: "err", text: "La nueva contraseña debe tener al menos 8 caracteres." });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error al cambiar la contraseña.");
      setMessage({ type: "ok", text: "Contraseña actualizada correctamente." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setMessage({ type: "err", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const roleLabel: Record<string, string> = {
    admin: "Administrador",
    user: "Usuario",
    prospector: "Prospector",
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <User className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">{profile?.name || username}</h1>
            <p className="text-sm text-slate-400">
              {roleLabel[role] || role}
            </p>
          </div>
        </div>

        {/* Info card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6 space-y-3">
          {profile?.email && (
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <Mail className="w-4 h-4 text-slate-500 shrink-0" />
              <span>{profile.email}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <User className="w-4 h-4 text-slate-500 shrink-0" />
            <span>@{username}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <Shield className="w-4 h-4 text-slate-500 shrink-0" />
            <span>{roleLabel[role] || role}</span>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 mb-6">
          <button
            onClick={() => setSection("profile")}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              section === "profile"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Perfil
          </button>
          <button
            onClick={() => setSection("password")}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              section === "password"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Contraseña
          </button>
        </div>

        {/* Section: Password change */}
        {section === "password" && (
          <form
            onSubmit={handleChangePassword}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4"
          >
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-400" />
              Cambiar contraseña
            </h2>

            {message && (
              <div
                className={`flex items-start gap-2 rounded-lg px-3 py-2 text-sm ${
                  message.type === "ok"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {message.type === "ok" ? (
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                {message.text}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Contraseña actual</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Nueva contraseña</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Confirmar nueva contraseña</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Actualizar contraseña
            </button>
          </form>
        )}

        {/* Section: Profile info (read-only for now) */}
        {section === "profile" && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mb-4">
            <div className="px-5 py-3 border-b border-slate-800">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Información de cuenta
              </p>
            </div>
            <div className="divide-y divide-slate-800">
              <div className="px-5 py-3 flex items-center justify-between">
                <span className="text-sm text-slate-400">Usuario</span>
                <span className="text-sm text-white font-mono">@{username}</span>
              </div>
              {profile?.email && (
                <div className="px-5 py-3 flex items-center justify-between">
                  <span className="text-sm text-slate-400">Email</span>
                  <span className="text-sm text-white">{profile.email}</span>
                </div>
              )}
              <div className="px-5 py-3 flex items-center justify-between">
                <span className="text-sm text-slate-400">Rol</span>
                <span className="text-sm text-blue-400">{roleLabel[role] || role}</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2 mt-6">
          {onBack && (
            <button
              onClick={onBack}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            >
              <span>Ir al panel</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-900 border border-red-900/40 rounded-xl text-sm text-red-400 hover:bg-red-950/20 hover:border-red-800/60 transition-colors"
          >
            <span className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
