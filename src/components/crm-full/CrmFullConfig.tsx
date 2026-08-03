import React, { useState, useEffect } from 'react';
import { Settings2, CheckCircle2, XCircle, AlertCircle, RefreshCw, Clock, Database, Zap, Mail, Globe, Key, Shield } from 'lucide-react';

interface ServiceCheck {
  key: string;
  label: string;
  category: string;
  status: 'ok' | 'fail' | 'warn' | 'unchecked';
  message?: string;
  latency?: number;
  detail?: string;
}

const STATUS_ICON = {
  ok:        <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
  fail:      <XCircle className="w-4 h-4 text-red-400" />,
  warn:      <AlertCircle className="w-4 h-4 text-amber-400" />,
  unchecked: <Clock className="w-4 h-4 text-slate-500" />,
};

const STATUS_COLORS = {
  ok:        'border-emerald-500/20 bg-emerald-500/5',
  fail:      'border-red-500/20 bg-red-500/5',
  warn:      'border-amber-500/20 bg-amber-500/5',
  unchecked: 'border-[#1E293B] bg-[#0A101F]/40',
};

const CATEGORIES = [
  { id: 'core', label: 'Core', icon: <Shield className="w-4 h-4" /> },
  { id: 'database', label: 'Base de datos', icon: <Database className="w-4 h-4" /> },
  { id: 'ia', label: 'IA / LLMs', icon: <Zap className="w-4 h-4" /> },
  { id: 'prospecting', label: 'Prospección', icon: <Globe className="w-4 h-4" /> },
  { id: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
  { id: 'infra', label: 'Infraestructura', icon: <Key className="w-4 h-4" /> },
];

export default function CrmFullConfig() {
  const [checks, setChecks] = useState<ServiceCheck[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { runChecks(); }, []);

  const runChecks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/health');
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Error ${res.status}`);
      }
      const data = await res.json();
      setChecks(data.checks || []);
      setLastChecked(new Date());
    } catch (err: any) {
      setError(err.message || 'No se pudo conectar con el servidor de salud');
    } finally {
      setLoading(false);
    }
  };

  const grouped = CATEGORIES.reduce<Record<string, ServiceCheck[]>>((acc, cat) => {
    acc[cat.id] = checks.filter(c => c.category === cat.id);
    return acc;
  }, {});

  const summary = {
    ok: checks.filter(c => c.status === 'ok').length,
    fail: checks.filter(c => c.status === 'fail').length,
    warn: checks.filter(c => c.status === 'warn').length,
  };

  return (
    <div className="space-y-6 text-slate-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
            <Settings2 className="w-8 h-8 text-sky-400" />
            Configuración & Estado
          </h1>
          <p className="text-slate-400">Health check de todas las integraciones y servicios</p>
        </div>
        <div className="flex items-center gap-3">
          {lastChecked && (
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {lastChecked.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          )}
          <button
            onClick={runChecks}
            disabled={loading}
            className="flex items-center gap-2 bg-sky-500/20 text-sky-300 border border-sky-500/30 hover:bg-sky-500/30 disabled:opacity-50 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Verificando...' : 'Verificar todo'}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-300">
          <XCircle className="w-4 h-4 flex-shrink-0" />
          {error}
          {error.includes('403') && <span className="text-xs text-red-400">(Requiere rol admin)</span>}
        </div>
      )}

      {/* Summary */}
      {checks.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Servicios OK', value: summary.ok, color: 'text-emerald-400', bg: 'border-emerald-500/20 bg-emerald-500/5' },
            { label: 'Con advertencias', value: summary.warn, color: 'text-amber-400', bg: 'border-amber-500/20 bg-amber-500/5' },
            { label: 'Con errores', value: summary.fail, color: 'text-red-400', bg: 'border-red-500/20 bg-red-500/5' },
          ].map(s => (
            <div key={s.label} className={`border rounded-xl p-4 ${s.bg}`}>
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Checks by category */}
      {loading && checks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <RefreshCw className="w-8 h-8 text-sky-400 animate-spin" />
          <p className="text-slate-400">Verificando servicios...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {CATEGORIES.map(cat => {
            const catChecks = grouped[cat.id] || [];
            if (catChecks.length === 0) return null;
            return (
              <div key={cat.id}>
                <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-slate-300">
                  {cat.icon}
                  {cat.label}
                  <div className="flex-1 h-px bg-[#1E293B]"></div>
                  <span className="text-xs text-slate-500">{catChecks.filter(c => c.status === 'ok').length}/{catChecks.length} OK</span>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {catChecks.map(check => (
                    <div key={check.key} className={`border rounded-xl p-4 ${STATUS_COLORS[check.status]}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          {STATUS_ICON[check.status]}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white text-sm">{check.label}</p>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">{check.key}</p>
                            {check.message && (
                              <p className={`text-xs mt-1 ${
                                check.status === 'ok' ? 'text-emerald-400' :
                                check.status === 'fail' ? 'text-red-400' :
                                check.status === 'warn' ? 'text-amber-400' : 'text-slate-400'
                              }`}>
                                {check.message}
                              </p>
                            )}
                            {check.detail && (
                              <p className="text-xs text-slate-500 mt-0.5">{check.detail}</p>
                            )}
                          </div>
                        </div>
                        {check.latency !== undefined && (
                          <span className="text-xs text-slate-500 flex-shrink-0 flex items-center gap-1">
                            <Clock className="w-3 h-3" />{check.latency}ms
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Env vars reference */}
      <div className="bg-[#0A101F]/60 border border-[#1E293B] rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Key className="w-4 h-4 text-slate-400" />
          Variables de entorno detectadas
          <span className="text-xs text-slate-500 font-normal">(solo se verifica existencia, nunca los valores)</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-2 text-xs">
          {[
            { key: 'NEON_DATABASE_URL', label: 'PostgreSQL (Neon)', required: true },
            { key: 'GEMINI_API_KEY', label: 'Google Gemini (Nativo & Free)', required: true },
            { key: 'SESSION_SECRET', label: 'Auth sessions', required: true },
            { key: 'APIFY_API_TOKEN', label: 'Apify Scraping', required: false },
            { key: 'GOOGLE_MAPS_PLATFORM_KEY', label: 'Google Maps', required: false },
            { key: 'HUNTER_API_KEY', label: 'Hunter.io Enrichment', required: false },
            { key: 'SMTP_USER / SMTP_PASS', label: 'Email SMTP', required: false },
            { key: 'SANTI_API_KEY', label: 'Hermes Agent auth', required: false },
            { key: 'VERCEL_TOKEN', label: 'Deploy Vercel', required: false },
            { key: 'CRM_INTERNAL_TOKEN', label: 'Token interno CRM', required: false },
          ].map(v => (
            <div key={v.key} className="flex items-center gap-2 p-2 bg-[#0A101F]/80 rounded-lg border border-[#1E293B]">
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${v.required ? 'bg-red-400' : 'bg-slate-600'}`}></span>
              <div className="min-w-0">
                <code className="text-sky-300 text-xs block truncate">{v.key}</code>
                <span className="text-slate-500 text-xs">{v.label}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-3">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 mr-1.5 align-middle"></span>Requerido
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-600 ml-3 mr-1.5 align-middle"></span>Opcional
        </p>
      </div>

      {/* CLI doctor */}
      <div className="bg-[#0A101F]/60 border border-[#1E293B] rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-3">Health check desde CLI</h2>
        <div className="bg-black/40 rounded-lg p-4 font-mono text-xs space-y-1 text-slate-300">
          <p className="text-slate-500"># Verificar todos los servicios desde terminal:</p>
          <p><span className="text-emerald-400">$</span> node scripts/doctor.mjs</p>
          <p className="mt-2 text-slate-500"># O con npm:</p>
          <p><span className="text-emerald-400">$</span> npm run doctor</p>
        </div>
        <p className="text-xs text-slate-500 mt-3">El script verifica conectividad real con cada API y muestra latencia. Ver <code className="text-sky-300">scripts/doctor.mjs</code></p>
      </div>
    </div>
  );
}
