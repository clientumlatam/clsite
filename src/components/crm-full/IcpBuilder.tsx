import React, { useState, useEffect } from 'react';
import {
  Target, Sparkles, Building2, MapPin, DollarSign, AlertCircle, CheckCircle2,
  ChevronRight, Loader2, RefreshCw, Clock,
} from 'lucide-react';

const INDUSTRIES = [
  'Distribuidora Mayorista', 'Ferretería Industrial', 'Inmobiliaria & Alquileres',
  'Corralón de Construcción', 'Clínica de Salud / Estética', 'Empaque de Fruta',
  'Gastronomía & Restorán', 'Logística & Transporte', 'Estudio Contable',
  'Bodega de Vinos', 'Agropecuaria', 'Concesionaria de Autos',
];
const SIZES = [
  { id: 'micro', label: 'Micro (1-5 emp.)', desc: 'Sin sistema actual' },
  { id: 'small', label: 'Pequeña (6-20 emp.)', desc: 'Excel / WhatsApp' },
  { id: 'medium', label: 'Mediana (21-100 emp.)', desc: 'Quieren escalar' },
  { id: 'large', label: 'Grande (+100 emp.)', desc: 'Reemplazar ERP viejo' },
];
const PAINS = [
  'Pierden leads por falta de seguimiento',
  'No tienen visibilidad del pipeline',
  'Vendedores sin métricas claras',
  'Cobros y facturación desorganizados',
  'Sin automatización de contacto',
  'Sin reportes para tomar decisiones',
];
const REGIONS = [
  'Neuquén Capital', 'General Roca', 'Bariloche', 'Cipolletti',
  'Toda la Patagonia', 'Online (Sin restricción geográfica)',
];

interface ICPResult {
  id?: string;
  industria: string;
  tamaño: string;
  region: string;
  dolores: string[];
  budget: string;
  score: number;
  señales: string[];
  objeciones?: string[];
  propuesta_de_valor?: string;
  criterios_descarte?: string[];
  created_at?: string;
}

function ScorePill({ score }: { score: number }) {
  const color = score >= 80 ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30'
    : score >= 60 ? 'text-amber-400 bg-amber-400/10 border-amber-400/30'
    : 'text-rose-400 bg-rose-400/10 border-rose-400/30';
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${color}`}>
      Fit Score: {score}/100
    </span>
  );
}

export default function IcpBuilder() {
  const [industria, setIndustria] = useState('Distribuidora Mayorista');
  const [tamaño, setTamaño] = useState('small');
  const [region, setRegion] = useState('Neuquén Capital');
  const [dolores, setDolores] = useState<string[]>(['Pierden leads por falta de seguimiento']);
  const [budget, setBudget] = useState('50000-150000');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [icp, setIcp] = useState<ICPResult | null>(null);
  const [history, setHistory] = useState<ICPResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const toggleDolor = (d: string) =>
    setDolores(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch('/api/icp-profiles');
      if (!res.ok) return;
      const data = await res.json() as { profiles: Array<{ id: string; raw_json: ICPResult; created_at: string }> };
      const mapped = data.profiles.map(p => ({ ...p.raw_json, id: p.id, created_at: p.created_at }));
      setHistory(mapped);
      if (mapped.length > 0 && !icp) setIcp(mapped[0]);
    } catch {
      // silently fail
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => { loadHistory(); }, []);

  const generarICP = async () => {
    if (dolores.length === 0) return;
    setLoading(true);
    setError(null);

    const systemPrompt = `Sos el Agente Estratega del Clientum AI Sales OS.
Tu tarea es generar un Ideal Customer Profile (ICP) detallado para una empresa SaaS de CRM + automatización de ventas llamada Clientum, orientada a PyMEs patagónicas.

Devolvé SOLO un JSON válido con esta estructura exacta (sin texto adicional):
{
  "industria": "...",
  "tamaño": "...",
  "region": "...",
  "dolores": [...],
  "budget": "...",
  "score": 0-100,
  "señales": ["señal de compra 1", "señal de compra 2", ...],
  "objeciones": ["objeción típica 1", "objeción típica 2", ...],
  "propuesta_de_valor": "propuesta de valor personalizada en 2-3 oraciones",
  "criterios_descarte": ["criterio que indica que NO es cliente ideal 1", ...]
}`;

    const userPrompt = `Generá el ICP para:
- Industria: ${industria}
- Tamaño: ${SIZES.find(s => s.id === tamaño)?.label}
- Región: ${region}
- Problemas declarados: ${dolores.join(', ')}
- Rango de inversión mensual: ${budget === '0-50000' ? 'Menos de $50.000 ARS' : budget === '50000-150000' ? '$50.000–$150.000 ARS' : budget === '150000-400000' ? '$150.000–$400.000 ARS' : 'Más de $400.000 ARS'}

El score debe reflejar qué tan buen cliente ideal es esta empresa para Clientum (0-100).`;

    try {
      const res = await fetch('/api/agent/ai/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userPrompt,
          system_prompt: systemPrompt,
          model: 'gemini-3.6-flash',
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(err.error ?? `Error ${res.status}`);
      }

      const data = await res.json() as { text: string };
      const jsonMatch = data.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('La IA no devolvió un JSON válido');

      const result = JSON.parse(jsonMatch[0]) as ICPResult;

      // Save to DB
      const saveRes = await fetch('/api/icp-profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${industria} · ${region}`,
          description: result.propuesta_de_valor,
          industry: industria,
          company_size: tamaño,
          pain_points: result.dolores,
          objections: result.objeciones ?? [],
          value_prop: result.propuesta_de_valor,
          score_weights: { fit_score: result.score },
          raw_json: { ...result, industria, tamaño, region, dolores, budget },
        }),
      });

      let savedId: string | undefined;
      if (saveRes.ok) {
        const saved = await saveRes.json() as { id: string };
        savedId = saved.id;
      }

      const finalIcp: ICPResult = { ...result, industria, tamaño, region, dolores, budget, id: savedId };
      setIcp(finalIcp);
      await loadHistory();
    } catch (err: any) {
      setError(err.message ?? 'Error generando ICP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 bg-[#10B981]/15 border border-[#10B981]/30 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-[#10B981]" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">ICP Builder</h1>
              <p className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">Ideal Customer Profile · Gemini IA</p>
            </div>
          </div>
          <p className="text-slate-400 text-sm mt-2 max-w-2xl">
            Definí el perfil exacto de tu cliente ideal. Gemini genera señales de compra, objeciones y propuesta de valor personalizada.
          </p>
        </div>
        {icp && <ScorePill score={icp.score} />}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-sm text-rose-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-5">
          {/* Industria */}
          <div className="bg-[#0D1424] border border-[#1E293B] rounded-xl p-4">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-[#10B981]" /> Industria objetivo
            </label>
            <div className="grid grid-cols-2 gap-2">
              {INDUSTRIES.map(ind => (
                <button key={ind} onClick={() => setIndustria(ind)}
                  className={`text-left px-3 py-2 rounded-lg text-xs transition-all border ${
                    industria === ind ? 'bg-[#10B981]/15 border-[#10B981]/40 text-[#10B981] font-semibold' : 'border-[#1E293B] text-slate-400 hover:border-slate-600 hover:text-slate-200'
                  }`}>
                  {ind}
                </button>
              ))}
            </div>
          </div>

          {/* Tamaño */}
          <div className="bg-[#0D1424] border border-[#1E293B] rounded-xl p-4">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Tamaño de empresa</label>
            <div className="grid grid-cols-2 gap-2">
              {SIZES.map(s => (
                <button key={s.id} onClick={() => setTamaño(s.id)}
                  className={`text-left px-3 py-2.5 rounded-lg text-xs transition-all border ${
                    tamaño === s.id ? 'bg-[#10B981]/15 border-[#10B981]/40 text-[#10B981]' : 'border-[#1E293B] text-slate-400 hover:border-slate-600'
                  }`}>
                  <div className="font-semibold">{s.label}</div>
                  <div className="text-slate-500 text-[10px] mt-0.5">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Región */}
          <div className="bg-[#0D1424] border border-[#1E293B] rounded-xl p-4">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#10B981]" /> Región
            </label>
            <div className="grid grid-cols-2 gap-2">
              {REGIONS.map(r => (
                <button key={r} onClick={() => setRegion(r)}
                  className={`text-left px-3 py-2 rounded-lg text-xs transition-all border ${
                    region === r ? 'bg-[#10B981]/15 border-[#10B981]/40 text-[#10B981] font-semibold' : 'border-[#1E293B] text-slate-400 hover:border-slate-600'
                  }`}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Dolores */}
          <div className="bg-[#0D1424] border border-[#1E293B] rounded-xl p-4">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Problemáticas clave (seleccioná al menos 1)
            </label>
            <div className="space-y-2">
              {PAINS.map(d => (
                <button key={d} onClick={() => toggleDolor(d)}
                  className={`w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-lg text-xs transition-all border ${
                    dolores.includes(d) ? 'bg-amber-400/10 border-amber-400/30 text-amber-300' : 'border-[#1E293B] text-slate-400 hover:border-slate-600'
                  }`}>
                  <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${dolores.includes(d) ? 'bg-amber-400 border-amber-400' : 'border-slate-600'}`}>
                    {dolores.includes(d) && <CheckCircle2 className="w-3 h-3 text-black" />}
                  </div>
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div className="bg-[#0D1424] border border-[#1E293B] rounded-xl p-4">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <DollarSign className="w-3.5 h-3.5 text-[#10B981]" /> Rango de inversión mensual (ARS)
            </label>
            <select value={budget} onChange={e => setBudget(e.target.value)}
              className="w-full bg-[#080C14] border border-[#1E293B] rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-[#10B981]/50">
              <option value="0-50000">Menos de $50.000</option>
              <option value="50000-150000">$50.000 – $150.000</option>
              <option value="150000-400000">$150.000 – $400.000</option>
              <option value="400000+">Más de $400.000</option>
            </select>
          </div>

          <button onClick={generarICP} disabled={loading || dolores.length === 0}
            className="w-full flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#059669] disabled:opacity-50 text-white font-bold text-sm py-3 rounded-xl transition-all">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? 'Gemini generando ICP…' : 'Generar ICP con IA'}
          </button>
        </div>

        {/* Result */}
        <div className="space-y-4">
          {icp ? (
            <>
              <div className="bg-[#0D1424] border border-[#10B981]/30 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-black text-white">Perfil generado</h2>
                  <div className="flex items-center gap-2">
                    <ScorePill score={icp.score} />
                    <button onClick={() => setIcp(null)} className="text-slate-500 hover:text-slate-300">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Industria', value: icp.industria },
                    { label: 'Tamaño', value: SIZES.find(s => s.id === icp.tamaño)?.label ?? icp.tamaño },
                    { label: 'Región', value: icp.region },
                    { label: 'Budget', value: icp.budget === '0-50000' ? '< $50K/mes' : icp.budget === '50000-150000' ? '$50K–$150K/mes' : icp.budget === '150000-400000' ? '$150K–$400K/mes' : '> $400K/mes' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between border-b border-[#1E293B] pb-2">
                      <span className="text-xs text-slate-500 uppercase tracking-wider">{label}</span>
                      <span className="text-sm font-semibold text-slate-200">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {icp.propuesta_de_valor && (
                <div className="bg-[#0D1424] border border-[#10B981]/20 rounded-xl p-5">
                  <h3 className="text-xs font-bold text-[#10B981] uppercase tracking-widest mb-3">Propuesta de Valor</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{icp.propuesta_de_valor}</p>
                </div>
              )}

              <div className="bg-[#0D1424] border border-[#1E293B] rounded-xl p-5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Dolores identificados
                </h3>
                <div className="space-y-2">
                  {icp.dolores.map((d, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-amber-300">
                      <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> {d}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0D1424] border border-[#1E293B] rounded-xl p-5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> Señales de compra
                </h3>
                <div className="space-y-2">
                  {icp.señales.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] flex-shrink-0 mt-1.5" /> {s}
                    </div>
                  ))}
                </div>
              </div>

              {icp.objeciones && icp.objeciones.length > 0 && (
                <div className="bg-[#0D1424] border border-[#1E293B] rounded-xl p-5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400" /> Objeciones típicas
                  </h3>
                  <div className="space-y-2">
                    {icp.objeciones.map((o, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-rose-300/80">
                        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> {o}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-[#10B981]/10 border border-[#10B981]/30 rounded-xl p-4">
                <p className="text-xs text-[#10B981] font-semibold mb-1">✓ ICP guardado — Santi SDR y el Prospector usan este perfil</p>
                <p className="text-[11px] text-slate-400">Se guardó en la base de datos y se aplica automáticamente al pipeline de prospección.</p>
              </div>
            </>
          ) : (
            <>
              <div className="h-[300px] flex flex-col items-center justify-center text-center bg-[#0D1424] border border-[#1E293B] border-dashed rounded-xl p-8">
                <div className="w-14 h-14 bg-[#10B981]/10 rounded-2xl flex items-center justify-center mb-4">
                  <Target className="w-7 h-7 text-[#10B981]/50" />
                </div>
                <h3 className="text-sm font-bold text-slate-400 mb-2">Configurá tu ICP</h3>
                <p className="text-xs text-slate-500 max-w-xs">
                  Completá el formulario y Gemini generará el perfil de cliente ideal con señales de compra y objeciones personalizadas.
                </p>
              </div>

              {/* History */}
              {history.length > 0 && (
                <div className="bg-[#0D1424] border border-[#1E293B] rounded-xl p-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" /> Perfiles anteriores
                  </h3>
                  <div className="space-y-2">
                    {history.slice(0, 5).map((h, i) => (
                      <button key={i} onClick={() => setIcp(h)}
                        className="w-full text-left px-3 py-2.5 bg-[#080C14] hover:bg-[#0A101F] rounded-lg text-xs transition-all border border-[#1E293B] flex items-center justify-between">
                        <div>
                          <span className="text-slate-300 font-semibold">{h.industria}</span>
                          <span className="text-slate-500 ml-2">· {h.region}</span>
                        </div>
                        <ScorePill score={h.score} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
