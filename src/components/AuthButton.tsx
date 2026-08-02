import React, { useState, useEffect } from 'react';
import { LogIn, LogOut, User as UserIcon, Shield, X, Loader2, KeyRound, Mail, UserPlus } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SessionUser {
  id: number;
  username: string;
  role: string;
}

export function AuthButton() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Form states
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.user) {
          setUser(data.user);
          return;
        }
      }
      setUser(null);
    } catch (err) {
      console.warn('[AuthButton] Session check failed:', err);
      setUser(null);
    } finally {
      setCheckingSession(false);
    }
  };

  useEffect(() => {
    fetchSession();

    const handleAuthChange = () => {
      fetchSession();
    };

    window.addEventListener('auth-changed', handleAuthChange);
    return () => {
      window.removeEventListener('auth-changed', handleAuthChange);
    };
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'register') {
        if (password.length < 8) {
          throw new Error('La contraseña debe tener al menos 8 caracteres.');
        }
        if (password !== confirmPassword) {
          throw new Error('Las contraseñas no coinciden.');
        }
      }

      const isEmail = usernameOrEmail.includes('@');

      // Forgot password via Supabase (email only)
      if (mode === 'forgot') {
        if (!isEmail) throw new Error('Ingrese un correo válido para reestablecer la contraseña.');
        const { error } = await supabase.auth.resetPasswordForEmail(usernameOrEmail, {
          redirectTo: process.env.APP_URL || window.location.origin,
        } as any);
        if (error) throw new Error(error.message);
        setError('Correo enviado: revisá tu bandeja para reestablecer la contraseña.');
        return;
      }

      // Use Supabase for email-based auth; keep server endpoints for username flows
      if (isEmail) {
        if (mode === 'register') {
          const { data, error } = await supabase.auth.signUp({ email: usernameOrEmail, password });
          if (error) throw new Error(error.message);
          const u = data.user;
          setUser(u ? { id: 0, username: u.email || usernameOrEmail, role: 'user' } : null);
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({ email: usernameOrEmail, password } as any);
          if (error) throw new Error(error.message);
          const u = data.user;
          setUser(u ? { id: 0, username: u.email || usernameOrEmail, role: 'user' } : null);
        }
      } else {
        // non-email fallback: call existing server endpoints
        let endpoint = '/api/auth/login';
        let payload: Record<string, string> = { username: usernameOrEmail, password };
        if (mode === 'register') {
          endpoint = '/api/auth/register';
          payload = { username: usernameOrEmail, password };
        }

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || 'Error al autenticar la cuenta.');
        }
        setUser(data.user);
      }
      setShowModal(false);
      setPassword('');
      setConfirmPassword('');
      window.dispatchEvent(new Event('auth-changed'));
    } catch (err: any) {
      setError(err.message || 'Error al procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      try {
        await supabase.auth.signOut();
      } catch (e) {
        // ignore
      }
      setUser(null);
      window.dispatchEvent(new Event('auth-changed'));
    } catch (err) {
      console.error('[AuthButton] Error logging out:', err);
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-slate-400">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
        <span>Verificando...</span>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
        <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div className="hidden md:block text-left">
          <div className="text-xs font-bold text-slate-900 truncate max-w-[130px] flex items-center gap-1.5">
            {user.username}
            {user.role === 'admin' && (
              <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase">
                Admin
              </span>
            )}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <Shield className="w-3 h-3 text-emerald-500" /> Sesión Activa
          </div>
        </div>
        <button
          onClick={handleSignOut}
          disabled={loading}
          title="Cerrar sesión"
          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => {
          setError(null);
          setShowModal(true);
        }}
        className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm shadow-indigo-600/30 cursor-pointer"
      >
        <LogIn className="w-3.5 h-3.5" />
        <span>Iniciar sesión</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl p-6 shadow-2xl relative text-left">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-200 transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 mb-3 border border-indigo-500/30">
                <Shield className="w-6 h-6 text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Clientum CRM</h2>
              <p className="text-xs text-slate-400 mt-1">
                {mode === 'login' ? 'Accedé a tu sesión express' : 'Creá tu cuenta en el sistema'}
              </p>
            </div>

            {/* Mode Switch Tabs */}
            <div className="flex bg-slate-950 rounded-xl p-1 mb-5 border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  mode === 'login' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Iniciar sesión
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  mode === 'register' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Registrarse
              </button>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Usuario o Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    placeholder="usuario o vos@email.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required={mode !== 'forgot'}
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div className="text-right">
                  <button type="button" onClick={() => { setMode('forgot'); setError(null); }} className="text-xs text-indigo-400 hover:underline">¿Olvidaste tu contraseña?</button>
                </div>
              )}

              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-rose-950/60 border border-rose-800/80 rounded-xl p-2.5 text-xs text-rose-300 leading-snug">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    {mode === 'forgot' ? <Mail className="w-4 h-4" /> : (mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />)}
                    <span>{mode === 'forgot' ? 'Enviar enlace de restablecimiento' : (mode === 'login' ? 'Ingresar al sistema' : 'Crear mi cuenta')}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
