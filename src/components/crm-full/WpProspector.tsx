import React, { useState, useEffect, useCallback } from 'react';
import { Target, CheckCircle2, MapPin, Search, Loader2, ArrowRight, Star, Zap, Filter, RefreshCw, AlertCircle } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  industry: string | null;
  city: string | null;
  phone: string | null;
  website: string | null;
  rating: number | null;
  status: string;
  source: string | null;
  leads_count?: number;
  metadata?: { pain_point?: string; score?: number } | null;
}

const RUBROS = [
  'Ferretería', 'Salud', 'Inmobiliaria', 'Automotriz', 'Distribución',
  'Retail', 'Logística', 'Agroindustria', 'Gastronomía', 'Industrial',
  'Construcción', 'Estudio Contable',
];
const CIUDADES = [
  'General Roca', 'Neuquén Capital', 'Cipolletti', 'Allen', 'Bariloche',
  'Villa Regina', 'Centenario', 'Plottier', 'Roca', 'Zapala',
];

function FitBadge({ score }: { score: number }) {
  const color = score >= 4 ? 'text-emerald-400 border-emerald-500/30 bg-emerald-400/10'
    : score >= 3 ? 'text-amber-400 border-amber-500/30 bg-amber-400/10'
    : 'text-slate-400 border-slate-500/30 bg-slate-400/10';
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-bold ${color}`}>
      <Star className="w-3 h-3" /> {score > 0 ? `${score}/5` : '—'}
    </span>
  );
}

export default function WpProspector() {
  const [rubro, setRubro] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'enriched' | 'discard'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [runResult, setRunResult] = useState<{ found: number; new: number } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '100' });
      if (rubro) params.set('industry', rubro);
      if (ciudad) params.set('city', ciudad);
      const res = await fetch(`/api/companies?${params}`);
      if (!res.ok) throw new Error('Error cargando empresas');
      const data = await res.json() as { companies: Company[] };
      setCompanies(data.companies);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [rubro, ciudad]);

  useEffect(() => { loadCompanies(); }, []);

  const runProspect = async () => {
    if (!rubro && !ciudad) {
      showToast('Seleccioná al menos rubro o ciudad', 'error');
      return;
    }
    setScanning(true);
    setRunResult(null);
    try {
      const res = await fetch('/api/agent/run/prospect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industry: rubro || 'Empresa local',
          city: ciudad || 'Neuquén Capital',
          country: 'Argentina',
          limit: 20,
          source: 'auto',
        }),
      });
      const data = await res.json() as { companies_found: number; new_companies: number; error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Error en prospección');
      setRunResult({ found: data.companies_found, new: data.new_companies });
      showToast(`${data.companies_found} empresas encontradas · ${data.new_companies} nuevas`);
      await loadCompanies();
    } catch (err: any) {
      showToast(err.message ?? 'Error de prospección', 'error');
    } finally {
      setScanning(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/companies/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setCompanies(prev => prev.map(c => c.id === id ? { ...c, status } : c));
      if (status === 'enriched') showToast(`Empresa exportada al CRM ✓`);
      if (status === 'discard') showToast(`Empresa descartada`);
    } catch {
      showToast('Error actualizando estado', 'error');
    }
  };

  const filtered = statusFilter === 'all' ? companies
    : statusFilter === 'new' ? companies.filter(c => c.status === 'new')
    : statusFilter === 'enriched' ? companies.filter(c => ['enriched', 'analyzed', 'proposed', 'in_campaign'].includes(c.status))
    : companies.filter(c => c.status === 'discard');

  const newCount = companies.filter(c => c.status === 'new').length;
  const exportedCount = companies.filter(c => ['enriched', 'analyzed', 'proposed', 'in_campaign', 'replied', 'closed'].includes(c.status)).length;
  const avgRating = companies.length > 0
    ? Math.round(companies.filter(c => c.rating).reduce((a, c) => a + (c.rating ?? 0), 0) / (companies.filter(c => c.rating).length || 1) * 10) / 10
    : 0;

  return (
    <div className="space-y-8 text-slate-200">
      {/* Header */}
      <div className="flex items-start gap-4 flex-wrap">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <Target className="w-7 h-7 text-orange-400" />
            <h1 className="text-2xl font-bold text-white">Prospector de Leads</h1>
            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Conectado
            </span>
          </div>
          <p className="text-slate-400 text-sm max-w-2xl">
            Prospección real vía Google Maps API y Apify. Los resultados se guardan en la base de datos y se pueden enriquecer con Hunter.io.
          </p>
        </div>
        <button onClick={loadCompanies} disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-[#1E293B] text-slate-400 rounded-lg text-xs hover:text-slate-200 hover:border-slate-500 transition-all">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Actualizar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Empresas en DB', value: companies.length, icon: <Target className="w-5 h-5 text-orange-400" />, border: 'border-orange-500/30' },
          { label: 'Sin procesar', value: newCount, icon: <Filter className="w-5 h-5 text-sky-400" />, border: 'border-sky-500/30' },
          { label: 'En pipeline', value: exportedCount, icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />, border: 'border-emerald-500/30' },
          { label: 'Rating promedio', value: avgRating || '—', icon: <Star className="w-5 h-5 text-amber-400" />, border: 'border-amber-500/30' },
        ].map(s => (
          <div key={s.label} className={`bg-[#0A101F]/60 border ${s.border} rounded-xl p-4`}>
            <div className="flex items-center justify-between mb-2">{s.icon}<span className="text-2xl font-bold text-white">{s.value}</span></div>
            <p className="text-xs text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-semibold border ${
          toast.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Run result summary */}
      {runResult && (
        <div className="p-4 bg-sky-500/5 border border-sky-500/20 rounded-xl text-xs text-sky-300">
          ✓ Prospección completada: <strong>{runResult.found}</strong> empresas encontradas · <strong>{runResult.new}</strong> nuevas guardadas en la base de datos
        </div>
      )}

      {/* Search form */}
      <div className="bg-[#0A101F]/60 border border-[#1E293B] rounded-xl p-6">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-orange-400" /> Buscar prospectos con IA
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2 block">Rubro</label>
            <select value={rubro} onChange={e => setRubro(e.target.value)}
              className="w-full bg-[#030712] border border-[#1E293B] rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-orange-500/40">
              <option value="">Todos los rubros</option>
              {RUBROS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2 block">Ciudad / Zona</label>
            <select value={ciudad} onChange={e => setCiudad(e.target.value)}
              className="w-full bg-[#030712] border border-[#1E293B] rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-orange-500/40">
              <option value="">Toda la Patagonia</option>
              {CIUDADES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={runProspect} disabled={scanning}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500/10 border border-orange-500/30 text-orange-400 rounded-lg text-sm font-semibold hover:bg-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
              {scanning ? 'Buscando en Google Maps…' : 'Prospectar'}
            </button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-400" /> Google Maps API</span>
          <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-sky-400" /> Apify fallback</span>
          <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-orange-400" /> Guardado en Neon DB</span>
        </div>
      </div>

      {/* Companies list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-base font-bold text-white">
            Empresas prospectadas {loading && <Loader2 className="inline w-4 h-4 animate-spin text-slate-500 ml-1" />}
          </h2>
          <div className="flex gap-2 flex-wrap">
            {([
              { val: 'all', label: 'Todas' },
              { val: 'new', label: `🔵 Sin procesar (${newCount})` },
              { val: 'enriched', label: `✅ En pipeline (${exportedCount})` },
              { val: 'discard', label: '⬜ Descartadas' },
            ] as const).map(f => (
              <button key={f.val} onClick={() => setStatusFilter(f.val)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  statusFilter === f.val
                    ? 'bg-[#1E293B] border-slate-500 text-white'
                    : 'bg-transparent border-[#1E293B] text-slate-500 hover:text-slate-300'
                }`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No hay empresas aún. Usá el formulario para prospectar.</p>
          </div>
        )}

        <div className="space-y-3">
          {filtered.map(c => {
            const isNew = c.status === 'new';
            const isExported = ['enriched', 'analyzed', 'proposed', 'in_campaign', 'replied', 'closed'].includes(c.status);
            const isDiscarded = c.status === 'discard';

            return (
              <div key={c.id}
                className={`bg-[#0A101F]/60 border rounded-xl overflow-hidden transition-all ${
                  expanded === c.id ? 'border-orange-500/30' : 'border-[#1E293B] hover:border-orange-500/20'
                }`}>
                <div className="p-5 flex items-start gap-4 cursor-pointer"
                  onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <p className="font-semibold text-white text-sm">{c.name}</p>
                      <FitBadge score={c.rating ?? 0} />
                      {isExported && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 font-semibold">En pipeline</span>
                      )}
                      {isDiscarded && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-400/10 border border-slate-400/30 text-slate-400 font-semibold">Descartada</span>
                      )}
                      {c.source && (
                        <span className="text-[10px] text-slate-600">{c.source}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                      {c.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.city}</span>}
                      {c.industry && <span>{c.industry}</span>}
                      {c.phone && <span>{c.phone}</span>}
                      {c.website && <span className="text-sky-400 truncate max-w-[180px]">{c.website}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isNew && (
                      <button
                        onClick={e => { e.stopPropagation(); updateStatus(c.id, 'enriched'); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-semibold hover:bg-emerald-500/20 transition-all">
                        <ArrowRight className="w-3.5 h-3.5" /> Exportar al CRM
                      </button>
                    )}
                  </div>
                </div>

                {expanded === c.id && (
                  <div className="px-5 pb-5 border-t border-[#1E293B] pt-4 grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">Datos de contacto</p>
                      <div className="space-y-1.5 text-xs text-slate-300">
                        {c.phone && <p>📞 {c.phone}</p>}
                        {c.website && <p>🌐 <a href={`https://${c.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">{c.website}</a></p>}
                        {c.city && <p>📍 {c.city}, Patagonia</p>}
                        {c.industry && <p>🏭 {c.industry}</p>}
                        {(c.leads_count ?? 0) > 0 && <p className="text-emerald-400">👤 {c.leads_count} contacto{c.leads_count !== 1 ? 's' : ''} enriquecido{c.leads_count !== 1 ? 's' : ''}</p>}
                      </div>
                    </div>
                    <div className="md:col-span-1">
                      {c.metadata?.pain_point && (
                        <>
                          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">Pain Point (IA)</p>
                          <p className="text-xs text-slate-300 leading-relaxed">{c.metadata.pain_point}</p>
                        </>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Acciones</p>
                      {isNew && (
                        <button onClick={() => updateStatus(c.id, 'enriched')}
                          className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-semibold hover:bg-emerald-500/20 transition-all">
                          <ArrowRight className="w-3.5 h-3.5" /> Exportar al CRM Pipeline
                        </button>
                      )}
                      {!isDiscarded && (
                        <button onClick={() => updateStatus(c.id, 'discard')}
                          className="flex items-center gap-2 px-3 py-2 bg-[#030712] border border-[#1E293B] text-slate-400 rounded-lg text-xs font-semibold hover:text-slate-200 transition-all">
                          Descartar empresa
                        </button>
                      )}
                      {isDiscarded && (
                        <button onClick={() => updateStatus(c.id, 'new')}
                          className="flex items-center gap-2 px-3 py-2 bg-[#030712] border border-[#1E293B] text-slate-400 rounded-lg text-xs font-semibold hover:text-slate-200 transition-all">
                          Restaurar
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer note */}
      <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl text-xs text-orange-300">
        <strong>CRM:</strong> Las empresas exportadas pasan al pipeline. Usá <strong>Leads</strong> para enriquecer contactos con Hunter.io y generar propuestas personalizadas.
      </div>
    </div>
  );
}
