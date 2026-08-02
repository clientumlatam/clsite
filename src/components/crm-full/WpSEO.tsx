import React, { useState, useCallback } from 'react';
import {
  Search, AlertCircle, TrendingUp, FileSearch, Tag, BarChart2,
  CheckCircle2, Zap, Loader2, Copy, RefreshCw, ExternalLink, Sparkles
} from 'lucide-react';

// ── Tipos ─────────────────────────────────────────────────────────────────────

interface PageAudit {
  url: string;
  title: string;
  score: number;
  issues: string[];
  keywords: string[];
  meta_title?: string;
  meta_description?: string;
  h1_sugerido?: string;
  recomendaciones?: string[];
  isAI?: boolean;
}

interface Keyword {
  kw: string;
  vol: number;
  dif: number;
  intent: string;
}

// ── Datos iniciales (demostración) ────────────────────────────────────────────

const INITIAL_PAGES: PageAudit[] = [
  {
    url: '/servicios/crm',
    title: 'CRM para PyMEs | Clientum',
    score: 78,
    issues: ['Meta description muy corta (82 chars)', 'H2 sin keyword principal'],
    keywords: ['crm pyme argentina', 'software crm', 'crm whatsapp'],
  },
  {
    url: '/servicios/ecommerce',
    title: 'E-Commerce WooCommerce | Clientum',
    score: 62,
    issues: ['Imagen hero sin atributo alt', 'Tiempo de carga > 3.2s', 'Sin schema markup de producto'],
    keywords: ['tienda online argentina', 'woocommerce patagonia', 'ecommerce pyme'],
  },
  {
    url: '/industrias/ferreteria',
    title: 'CRM para Ferreterías',
    score: 91,
    issues: [],
    keywords: ['crm ferreteria', 'software ferreteria argentina', 'gestion ferreteria'],
  },
  {
    url: '/planes',
    title: 'Planes y Precios | Clientum',
    score: 55,
    issues: ['Falta H1 optimizado', 'Sin preguntas frecuentes (FAQ schema)', 'Densidad keyword muy baja (0.4%)'],
    keywords: ['crm precio argentina', 'software gestion precio', 'plan crm mensual'],
  },
];

const INITIAL_KEYWORDS: Keyword[] = [
  { kw: 'crm para pymes argentina',              vol: 480,  dif: 32, intent: 'Comercial' },
  { kw: 'chatbot whatsapp negocio',              vol: 1200, dif: 45, intent: 'Informacional' },
  { kw: 'software gestion comercial patagonia',  vol: 110,  dif: 18, intent: 'Comercial' },
  { kw: 'ecommerce woocommerce argentina',       vol: 2400, dif: 58, intent: 'Comercial' },
  { kw: 'facturacion electronica afip integrada',vol: 890,  dif: 40, intent: 'Transaccional' },
  { kw: 'automatizar whatsapp empresa',          vol: 3100, dif: 52, intent: 'Comercial' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

async function apiFetch(action: string, payload: Record<string, unknown>) {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ action, payload }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
  return data;
}

const scoreColor = (s: number) => s >= 80 ? 'text-emerald-400' : s >= 60 ? 'text-amber-400' : 'text-red-400';
const scoreBg   = (s: number) => s >= 80 ? 'border-emerald-500/30 bg-emerald-500/5' : s >= 60 ? 'border-amber-500/30 bg-amber-500/5' : 'border-red-500/30 bg-red-500/5';

function copyText(text: string) {
  navigator.clipboard.writeText(text).catch(() => {});
}

// ── Componente ────────────────────────────────────────────────────────────────

export default function WpSEO() {
  const [pages, setPages]             = useState<PageAudit[]>(INITIAL_PAGES);
  const [keywords, setKeywords]       = useState<Keyword[]>(INITIAL_KEYWORDS);
  const [activeUrl, setActiveUrl]     = useState<string | null>(null);
  const [tab, setTab]                 = useState<'audit' | 'keywords'>('audit');

  // Auditor de URL
  const [scanUrl, setScanUrl]         = useState('');
  const [scanTitle, setScanTitle]     = useState('');
  const [scanning, setScanning]       = useState(false);
  const [scanError, setScanError]     = useState<string | null>(null);

  // Generador de keywords
  const [kwDomain, setKwDomain]       = useState('clientum.com.ar');
  const [kwIndustry, setKwIndustry]   = useState('CRM y software de gestión');
  const [kwLoading, setKwLoading]     = useState(false);

  const runScan = useCallback(async () => {
    if (!scanUrl.trim()) return;
    setScanning(true);
    setScanError(null);
    try {
      const data = await apiFetch('generateSEOAudit', {
        url: scanUrl.trim(),
        title: scanTitle.trim() || undefined,
      });
      const result: PageAudit = {
        url: scanUrl.trim(),
        title: scanTitle.trim() || scanUrl.trim(),
        score: data.result?.score ?? 50,
        issues: data.result?.issues ?? [],
        keywords: data.result?.keywords ?? [],
        meta_title: data.result?.meta_title,
        meta_description: data.result?.meta_description,
        h1_sugerido: data.result?.h1_sugerido,
        recomendaciones: data.result?.recomendaciones,
        isAI: !data.isFallback,
      };
      setPages(prev => [result, ...prev.filter(p => p.url !== result.url)]);
      setActiveUrl(result.url);
      setScanUrl('');
      setScanTitle('');
    } catch (e: any) {
      setScanError(e.message ?? 'Error al auditar la URL');
    } finally {
      setScanning(false);
    }
  }, [scanUrl, scanTitle]);

  const generateKeywords = useCallback(async () => {
    setKwLoading(true);
    try {
      const data = await apiFetch('generateSEOKeywords', {
        domain: kwDomain,
        industry: kwIndustry,
        location: 'Patagonia, Argentina',
      });
      if (data.result?.keywords?.length) {
        setKeywords(data.result.keywords);
      }
    } catch {}
    finally { setKwLoading(false); }
  }, [kwDomain, kwIndustry]);

  const generateFixes = useCallback(async (page: PageAudit) => {
    setPages(prev => prev.map(p => p.url === page.url ? { ...p, _loading: true } as any : p));
    try {
      const data = await apiFetch('generateSEOAudit', {
        url: page.url,
        title: page.title,
        content: page.keywords.join(', '),
      });
      setPages(prev => prev.map(p =>
        p.url === page.url
          ? { ...p,
              score: data.result?.score ?? p.score,
              issues: data.result?.issues ?? p.issues,
              keywords: data.result?.keywords ?? p.keywords,
              meta_title: data.result?.meta_title,
              meta_description: data.result?.meta_description,
              h1_sugerido: data.result?.h1_sugerido,
              recomendaciones: data.result?.recomendaciones,
              isAI: !data.isFallback,
              _loading: false } as any
          : p
      ));
    } catch {
      setPages(prev => prev.map(p => p.url === page.url ? { ...p, _loading: false } as any : p));
    }
  }, []);

  const activePage = pages.find(p => p.url === activeUrl);
  const avgScore   = Math.round(pages.reduce((a, p) => a + p.score, 0) / pages.length);

  return (
    <div className="space-y-8 text-slate-200">

      {/* Header */}
      <div className="flex items-start gap-4 flex-wrap">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <Search className="w-7 h-7 text-violet-400" />
            <h1 className="text-2xl font-bold text-white">SEO con IA</h1>
            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Activo
            </span>
          </div>
          <p className="text-slate-400 text-sm max-w-2xl">
            Análisis y optimización SEO impulsado por IA. Audita páginas, sugiere keywords y genera meta-tags para posicionar en Google.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Páginas auditadas',  value: pages.length,                                       icon: <FileSearch className="w-5 h-5 text-violet-400" />, border: 'border-violet-500/30' },
          { label: 'Score promedio',     value: avgScore,                                            icon: <BarChart2  className="w-5 h-5 text-amber-400" />,  border: 'border-amber-500/30' },
          { label: 'Issues detectados', value: pages.reduce((a, p) => a + p.issues.length, 0),      icon: <AlertCircle className="w-5 h-5 text-red-400" />,   border: 'border-red-500/30' },
          { label: 'Keywords sugeridas',value: keywords.length,                                     icon: <Tag        className="w-5 h-5 text-emerald-400" />, border: 'border-emerald-500/30' },
        ].map(s => (
          <div key={s.label} className={`bg-[#0A101F]/60 border ${s.border} rounded-xl p-4`}>
            <div className="flex items-center justify-between mb-2">{s.icon}<span className="text-2xl font-bold text-white">{s.value}</span></div>
            <p className="text-xs text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Sub-nav */}
      <div className="flex gap-2 border-b border-[#1E293B]">
        {(['audit', 'keywords'] as const).map(v => (
          <button key={v} onClick={() => setTab(v)}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-all -mb-px ${
              tab === v ? 'border-violet-400 text-violet-300 bg-violet-500/5' : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}>
            {v === 'audit' ? '🔍 Auditoría de páginas' : '🏷️ Keywords sugeridas'}
          </button>
        ))}
      </div>

      {/* ── TAB: Auditoría ────────────────────────────────────────────────────── */}
      {tab === 'audit' && (
        <div className="space-y-4">

          {/* URL Scanner */}
          <div className="bg-[#0A101F]/60 border border-[#1E293B] rounded-xl p-5 space-y-3">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Auditar nueva URL con IA</p>
            <div className="grid md:grid-cols-2 gap-3">
              <input
                value={scanUrl}
                onChange={e => setScanUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && runScan()}
                placeholder="https://clientum.com.ar/servicios/crm"
                className="bg-[#030712] border border-[#1E293B] rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/40"
              />
              <input
                value={scanTitle}
                onChange={e => setScanTitle(e.target.value)}
                placeholder="Título de la página (opcional)"
                className="bg-[#030712] border border-[#1E293B] rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/40"
              />
            </div>
            {scanError && (
              <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{scanError}</p>
            )}
            <button
              onClick={runScan}
              disabled={scanning || !scanUrl.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/30 text-violet-400 rounded-lg text-sm font-semibold hover:bg-violet-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {scanning ? 'Auditando con IA…' : 'Auditar con IA'}
            </button>
          </div>

          {/* Page list */}
          <div className="space-y-3">
            {pages.map(p => {
              const loading = (p as any)._loading;
              return (
                <div key={p.url}
                  onClick={() => !loading && setActiveUrl(activeUrl === p.url ? null : p.url)}
                  className={`bg-[#0A101F]/60 border rounded-xl p-5 cursor-pointer transition-all ${activeUrl === p.url ? 'border-violet-500/40' : 'border-[#1E293B] hover:border-violet-500/20'}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white text-sm">{p.title}</p>
                        {p.isAI && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded font-mono">IA</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{p.url}</p>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      {p.issues.length > 0 && (
                        <span className="text-xs text-red-400 font-semibold">{p.issues.length} issue{p.issues.length > 1 ? 's' : ''}</span>
                      )}
                      {loading
                        ? <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
                        : <div className={`text-xl font-black ${scoreColor(p.score)}`}>{p.score}</div>
                      }
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="mt-3 h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${p.score >= 80 ? 'bg-emerald-500' : p.score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${p.score}%` }}
                    />
                  </div>

                  {/* Expanded detail */}
                  {activeUrl === p.url && (
                    <div className="mt-4 pt-4 border-t border-[#1E293B] space-y-5">

                      {/* Issues */}
                      {p.issues.length > 0 && (
                        <div>
                          <p className="text-xs text-red-400 uppercase tracking-wider font-semibold mb-2">Issues a corregir</p>
                          <div className="space-y-1.5">
                            {p.issues.map(i => (
                              <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                                <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />{i}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Keywords */}
                      <div>
                        <p className="text-xs text-emerald-400 uppercase tracking-wider font-semibold mb-2">Keywords objetivo</p>
                        <div className="flex flex-wrap gap-2">
                          {p.keywords.map(k => (
                            <span key={k} className="text-xs px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full">{k}</span>
                          ))}
                        </div>
                      </div>

                      {/* AI-generated meta & H1 */}
                      {(p.meta_title || p.meta_description || p.h1_sugerido) && (
                        <div className="space-y-3">
                          <p className="text-xs text-violet-400 uppercase tracking-wider font-semibold">Meta-tags generados por IA</p>
                          {p.meta_title && (
                            <div className="bg-[#030712] border border-[#1E293B] rounded-lg p-3 space-y-1">
                              <p className="text-[10px] text-slate-500 font-mono uppercase">Title tag</p>
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-xs text-slate-200">{p.meta_title}</p>
                                <button onClick={e => { e.stopPropagation(); copyText(p.meta_title!); }} className="text-slate-500 hover:text-slate-300 shrink-0">
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <p className="text-[10px] text-slate-600">{p.meta_title.length} / 60 chars</p>
                            </div>
                          )}
                          {p.meta_description && (
                            <div className="bg-[#030712] border border-[#1E293B] rounded-lg p-3 space-y-1">
                              <p className="text-[10px] text-slate-500 font-mono uppercase">Meta description</p>
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-xs text-slate-200">{p.meta_description}</p>
                                <button onClick={e => { e.stopPropagation(); copyText(p.meta_description!); }} className="text-slate-500 hover:text-slate-300 shrink-0">
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <p className="text-[10px] text-slate-600">{p.meta_description.length} / 155 chars</p>
                            </div>
                          )}
                          {p.h1_sugerido && (
                            <div className="bg-[#030712] border border-[#1E293B] rounded-lg p-3 space-y-1">
                              <p className="text-[10px] text-slate-500 font-mono uppercase">H1 sugerido</p>
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-xs text-slate-200 font-semibold">{p.h1_sugerido}</p>
                                <button onClick={e => { e.stopPropagation(); copyText(p.h1_sugerido!); }} className="text-slate-500 hover:text-slate-300 shrink-0">
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Recomendaciones */}
                      {p.recomendaciones && p.recomendaciones.length > 0 && (
                        <div>
                          <p className="text-xs text-sky-400 uppercase tracking-wider font-semibold mb-2">Recomendaciones IA</p>
                          <div className="space-y-1.5">
                            {p.recomendaciones.map((r, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 flex-shrink-0 mt-0.5" />{r}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex gap-3 flex-wrap">
                        <button
                          onClick={e => { e.stopPropagation(); generateFixes(p); }}
                          className="flex items-center gap-2 text-xs text-violet-400 hover:text-violet-300 font-semibold transition-colors border border-violet-500/20 px-3 py-1.5 rounded-lg hover:bg-violet-500/5"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Regenerar con IA
                        </button>
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 font-semibold transition-colors border border-[#1E293B] px-3 py-1.5 rounded-lg hover:bg-[#1E293B]"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Ver página
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB: Keywords ─────────────────────────────────────────────────────── */}
      {tab === 'keywords' && (
        <div className="space-y-4">

          {/* Generador de keywords */}
          <div className="bg-[#0A101F]/60 border border-[#1E293B] rounded-xl p-5 space-y-3">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Generar keywords con IA</p>
            <div className="grid md:grid-cols-2 gap-3">
              <input
                value={kwDomain}
                onChange={e => setKwDomain(e.target.value)}
                placeholder="Dominio o nombre del negocio"
                className="bg-[#030712] border border-[#1E293B] rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/40"
              />
              <input
                value={kwIndustry}
                onChange={e => setKwIndustry(e.target.value)}
                placeholder="Industria (ej: ferretería, inmobiliaria)"
                className="bg-[#030712] border border-[#1E293B] rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/40"
              />
            </div>
            <button
              onClick={generateKeywords}
              disabled={kwLoading}
              className="flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/30 text-violet-400 rounded-lg text-sm font-semibold hover:bg-violet-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {kwLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {kwLoading ? 'Generando con IA…' : 'Generar keywords con IA'}
            </button>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 uppercase tracking-wider border-b border-[#1E293B]">
                  <th className="text-left pb-3 font-semibold">Keyword</th>
                  <th className="text-center pb-3 font-semibold">Volumen/mes</th>
                  <th className="text-center pb-3 font-semibold">Dificultad</th>
                  <th className="text-center pb-3 font-semibold">Intención</th>
                  <th className="text-center pb-3 font-semibold">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]">
                {keywords.map(k => (
                  <tr key={k.kw} className="hover:bg-[#0A101F]/40 transition-colors">
                    <td className="py-3 text-slate-200 font-mono text-xs">{k.kw}</td>
                    <td className="py-3 text-center text-white font-semibold">{k.vol.toLocaleString('es-AR')}</td>
                    <td className="py-3 text-center">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${k.dif < 35 ? 'bg-emerald-400/10 text-emerald-400' : k.dif < 50 ? 'bg-amber-400/10 text-amber-400' : 'bg-red-400/10 text-red-400'}`}>
                        {k.dif}
                      </span>
                    </td>
                    <td className="py-3 text-center text-xs text-slate-400">{k.intent}</td>
                    <td className="py-3 text-center">
                      <button
                        onClick={() => copyText(k.kw)}
                        className="text-xs text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1 mx-auto"
                      >
                        <Copy className="w-3 h-3" /> Copiar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-violet-500/5 border border-violet-500/20 rounded-lg text-xs text-violet-300">
            <strong>CRM:</strong> Las keywords estratégicas se pueden usar para el <strong>ICP Builder</strong> de Clientum para afinar el perfil de cliente ideal.
          </div>
        </div>
      )}
    </div>
  );
}
