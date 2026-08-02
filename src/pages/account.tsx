// Account management page — session info and logout
// (replaces the Neon Auth SDK AccountView which cannot be installed)
import { useState } from "react";
import { LogOut, User, Shield, RefreshCw } from "lucide-react";

interface AccountPageProps {
  username?: string;
  role?: string;
  onLogout?: () => void;
}

export function AccountPage({ username, role, onLogout }: AccountPageProps) {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      onLogout?.();
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0B131D] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20 mb-4">
            <User className="w-7 h-7 text-[#34D399]" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Mi cuenta</h1>
          <p className="text-zinc-500 text-[11px] mt-1 font-mono uppercase tracking-wider">
            Clientum CRM · Neon Auth
          </p>
        </div>

        <div className="bg-[#111C28] border border-[#1A2733] rounded-2xl p-6 space-y-4 shadow-2xl">
          <div>
            <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">
              Usuario
            </label>
            <div className="flex items-center gap-2 bg-[#0B131D] border border-[#1A2733] rounded-xl px-4 py-2.5">
              <User className="w-4 h-4 text-zinc-600" />
              <span className="text-sm text-white">{username || "—"}</span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">
              Rol
            </label>
            <div className="flex items-center gap-2 bg-[#0B131D] border border-[#1A2733] rounded-xl px-4 py-2.5">
              <Shield className="w-4 h-4 text-zinc-600" />
              <span
                className="text-sm font-semibold"
                style={{ color: role === "admin" ? "#34D399" : "#a1a1aa" }}
              >
                {role || "user"}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-red-900/30 hover:bg-red-900/50 disabled:opacity-60 border border-red-900/50 text-red-400 font-bold rounded-xl py-2.5 text-sm transition-all"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
