import React, { useState, useEffect } from 'react';
import { MapPin, Search, Star, Phone, Globe, TrendingUp, Download, RefreshCw, CheckSquare, Square, Zap, Clock, AlertCircle, ChevronDown, ChevronUp, History } from 'lucide-react';
import { useGooglePlacesKey, GooglePlacesKeyBanner, GooglePlacesKeyModal } from '../shared/GooglePlacesKeyConfig';

interface PlaceResult {
  id: string;
  name: string;
  address: string;
  rating: number;
  review_count: number;
  phone?: string;
  website?: string;
  category?: string;
  score?: number;
  score_reason?: string;
  score_action?: 'llamar' | 'whatsapp' | 'email' | 'ignorar';
  scoring?: boolean;
  imported?: boolean;
}

interface SearchHistory {
  id: number;
  query: { rubro: string; ciudad: string; radio: number; timestamp: string };
  results_count: number;
  created_at: string;
}

const ACTION_CONFIG: Record<string, { label: string; color: string }> = {
  llamar:    { label: '📞 Llamar',    color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  whatsapp:  { label: '💬 WhatsApp',  color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  email:     { label: '✉️ Email',     color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  ignorar:   { label: '🚫 Ignorar',   color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
};

function ScoreBadge({ score, action }: { score?: number; action?: string }) {
  if (score === undefined) return null;
  const color = score >= 70 ? 'text-emerald-400' : score >= 40 ? 'text-amber-400' : 'text-red-400';
  const bg = score >= 70 ? 'bg-emerald-400/10 border-emerald-400/30' : score >= 40 ? 'bg-amber-400/10 border-amber-400/30' : 'bg-red-400/10 border-red-400/30';
  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs font-bold ${bg} ${color}`}>
      <TrendingUp className="w-3 h-3" />
      {score}%
      {action && ACTION_CONFIG[action] && (
        <span className={`ml-1 px-1.5 py-0.5 rounded text-xs border ${ACTION_CONFIG[action].color}`}>
          {ACTION_CONFIG[action].label}
        </span>
      )}
    </div>
  );
}

export default function CrmFullGoogleMaps() {
  const { apiKey, save: saveKey, remove: removeKey } = useGooglePlacesKey();
  const [showKeyModal, setShowKeyModal] = useState(false);

  const [rubro, setRubro] = useState('');
  const [ciudad, setCiudad] = useState('Roca');
  const [radio, setRadio] = useState(10);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [expandedScore, setExpandedScore] = useState<Record<string, boolean>>({});

  useEffect(() => { loadHistory(); }, []);

  const loadHistory = async () => {
    try {
      const res = await fetch('/api/places/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data.history || []);
      }
    } catch {}
  };

  const handleSearch = async () => {
    if (!rubro.trim() || !ciudad.trim()) return;
    setLoading(true);
    setError(null);
    setResults([]);
    setSelected(new Set());
    setImportResult(null);

    console.log('[CrmFullGoogleMaps Debug] Initiating search with configuration:');
    console.log(` - Rubro: "${rubro.trim()}"`);
    console.log(` - Ciudad: "${ciudad.trim()}"`);
    console.log(` - Radio: ${radio} km`);
    console.log(` - Custom Client-Side API Key present: ${Boolean(apiKey)} ${apiKey ? `(length: ${apiKey.length}, preview: ${apiKey.substring(0, 6)}...)` : '(relying on server-side GOOGLE_MAPS_PLATFORM_KEY)'}`);

    try {
      console.log('[CrmFullGoogleMaps Debug] Sending POST request to /api/places/search...');
      const res = await fetch('/api/places/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rubro: rubro.trim(), ciudad: ciudad.trim(), radio, googlePlacesKey: apiKey || undefined }),
      });
      
      const data = await res.json();
      console.log('[CrmFullGoogleMaps Debug] Search API response metadata:', { status: res.status, ok: res.ok });
      console.log('[CrmFullGoogleMaps Debug] Search API response data:', data);

      if (!res.ok) {
        console.error('[CrmFullGoogleMaps Debug] Search failed on backend:', data.error);
        throw new Error(data.error || 'Error al buscar en Google Maps');
      }

      setResults((data.results || []).map((r: any, i: number) => ({ ...r, id: r.id || String(i) })));
      console.log(`[CrmFullGoogleMaps Debug] Successfully loaded ${data.results?.length || 0} business results (Simulated: ${Boolean(data.simulated)}).`);
      loadHistory();
    } catch (err: any) {
      console.error('[CrmFullGoogleMaps Search Error]', err);
      setError(err.message || 'Error al realizar la búsqueda');
    } finally {
      setLoading(false);
    }
  };

  const handleScore = async (place: PlaceResult) => {
    setResults(prev => prev.map(p => p.id === place.id ? { ...p, scoring: true } : p));
    try {
      const res = await fetch(`/api/places/${encodeURIComponent(place.id)}/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(place),
      });
      const data = await res.json();
      setResults(prev => prev.map(p =>
        p.id === place.id
          ? { ...p, scoring: false, score: data.score, score_reason: data.reason, score_action: data.action }
          : p
      ));
    } catch {
      setResults(prev => prev.map(p => p.id === place.id ? { ...p, scoring: false } : p));
    }
  };

  const handleScoreAll = async () => {
    for (const place of results.filter(r => r.score === undefined)) {
      await handleScore(place);
    }
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === results.length) setSelected(new Set());
    else setSelected(new Set(results.map(r => r.id)));
  };

  const handleImport = async () => {
    if (selected.size === 0) return;
    setImporting(true);
    setImportResult(null);
    try {
      const toImport = results.filter(r => selected.has(r.id));
      const res = await fetch('/api/places/bulk-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ places: toImport }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al importar');
      setImportResult(`✅ ${data.imported} prospecto${data.imported !== 1 ? 's' : ''} importado${data.imported !== 1 ? 's' : ''} al CRM.`);
      setResults(prev => prev.map(r => selected.has(r.id) ? { ...r, imported: true } : r));
      setSelected(new Set());
    } catch (err: any) {
      setImportResult(`❌ ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  const rubrosFrec = ['Distribuidora', 'Ferretería', 'Constructora', 'Agencia de viajes', 'Clínica', 'Farmacia', 'Supermercado', 'Concesionaria', 'Taller mecánico', 'Estudio contable'];
  const ciudadesFrec = ['Roca', 'Neuquén', 'Bariloche', 'Cipolletti', 'Viedma', 'Allen', 'Plottier'];

  return (
    <div className="space-y-6 text-slate-200">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
          <MapPin className="w-8 h-8 text-sky-400" />
          Google Maps Intelligence
        </h1>
        <p className="text-slate-400">Motor de prospección IA · Scoring automático con Gemini · Importación directa al CRM</p>
      </div>

      {/* API Key banner */}
      <GooglePlacesKeyBanner apiKey={apiKey} onOpenModal={() => setShowKeyModal(true)} />
      <GooglePlacesKeyModal
        open={showKeyModal}
        onClose={() => setShowKeyModal(false)}
        currentKey={apiKey}
        onSave={saveKey}
        onRemove={removeKey}
      />

      {/* Search form */}
      <div className="bg-[#0A101F]/60 border border-[#1E293B] rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-4">Nueva búsqueda</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Rubro / tipo de negocio</label>
            <input
              type="text"
              value={rubro}
              onChange={e => setRubro(e.target.value)}
              placeholder="ej: Ferretería, Distribuidora..."
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="w-full bg-[#0A101F] border border-[#1E293B] rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/50"
            />
            <div className="flex flex-wrap gap-1 mt-2">
              {rubrosFrec.map(r => (
                <button key={r} onClick={() => setRubro(r)} className="text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded hover:bg-slate-700 hover:text-slate-200 transition-colors">
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Ciudad</label>
            <input
              type="text"
              value={ciudad}
              onChange={e => setCiudad(e.target.value)}
              placeholder="ej: Roca, Neuquén..."
              className="w-full bg-[#0A101F] border border-[#1E293B] rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/50"
            />
            <div className="flex flex-wrap gap-1 mt-2">
              {ciudadesFrec.map(c => (
                <button key={c} onClick={() => setCiudad(c)} className="text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded hover:bg-slate-700 hover:text-slate-200 transition-colors">
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Radio de búsqueda: <span className="text-white font-semibold">{radio} km</span></label>
            <input
              type="range"
              min={1} max={50} value={radio}
              onChange={e => setRadio(Number(e.target.value))}
              className="w-full accent-sky-500 mt-2"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>1 km</span><span>25 km</span><span>50 km</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleSearch}
          disabled={loading || !rubro.trim() || !ciudad.trim()}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {loading ? 'Buscando...' : 'Explorar'}
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {importResult && (
        <div className={`p-4 rounded-xl text-sm font-medium border ${importResult.startsWith('✅') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border-red-500/30 text-red-300'}`}>
          {importResult}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-[#0A101F]/60 border border-[#1E293B] rounded-xl">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 p-4 border-b border-[#1E293B]">
            <div className="flex items-center gap-3">
              <button onClick={toggleAll} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
                {selected.size === results.length ? <CheckSquare className="w-4 h-4 text-sky-400" /> : <Square className="w-4 h-4" />}
                {selected.size > 0 ? `${selected.size} seleccionados` : 'Seleccionar todos'}
              </button>
              <span className="text-xs text-slate-500">{results.length} resultados</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleScoreAll}
                className="flex items-center gap-1.5 text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Zap className="w-3.5 h-3.5" />
                Score IA a todos
              </button>
              {selected.size > 0 && (
                <button
                  onClick={handleImport}
                  disabled={importing}
                  className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 disabled:opacity-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  {importing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  Importar al CRM ({selected.size})
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1E293B]">
                  <th className="p-3 w-8"></th>
                  <th className="p-3 text-left text-xs text-slate-400 font-medium">Negocio</th>
                  <th className="p-3 text-left text-xs text-slate-400 font-medium">Categoría</th>
                  <th className="p-3 text-left text-xs text-slate-400 font-medium">Rating</th>
                  <th className="p-3 text-left text-xs text-slate-400 font-medium">Contacto</th>
                  <th className="p-3 text-left text-xs text-slate-400 font-medium">Score IA</th>
                  <th className="p-3 w-20"></th>
                </tr>
              </thead>
              <tbody>
                {results.map(place => (
                  <React.Fragment key={place.id}>
                    <tr className={`border-b border-[#1E293B]/50 hover:bg-white/[0.02] transition-colors ${place.imported ? 'opacity-50' : ''}`}>
                      <td className="p-3">
                        <button onClick={() => toggleSelect(place.id)} disabled={place.imported}>
                          {selected.has(place.id) ? <CheckSquare className="w-4 h-4 text-sky-400" /> : <Square className="w-4 h-4 text-slate-600" />}
                        </button>
                      </td>
                      <td className="p-3">
                        <p className="font-medium text-white text-sm">{place.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{place.address}</p>
                        {place.imported && <span className="text-xs text-emerald-400">✓ Importado</span>}
                      </td>
                      <td className="p-3">
                        <span className="text-xs px-2 py-0.5 bg-sky-500/10 text-sky-300 rounded border border-sky-500/20">
                          {place.category || '—'}
                        </span>
                      </td>
                      <td className="p-3">
                        {place.rating ? (
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span className="text-white font-medium">{place.rating}</span>
                            <span className="text-slate-500 text-xs">({place.review_count})</span>
                          </div>
                        ) : <span className="text-slate-500 text-xs">—</span>}
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col gap-1">
                          {place.phone && (
                            <span className="flex items-center gap-1 text-xs text-slate-400">
                              <Phone className="w-3 h-3" />{place.phone}
                            </span>
                          )}
                          {place.website && (
                            <a href={place.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-sky-400 hover:underline">
                              <Globe className="w-3 h-3" />web
                            </a>
                          )}
                          {!place.phone && !place.website && <span className="text-slate-600 text-xs">—</span>}
                        </div>
                      </td>
                      <td className="p-3">
                        {place.scoring ? (
                          <RefreshCw className="w-4 h-4 text-purple-400 animate-spin" />
                        ) : place.score !== undefined ? (
                          <ScoreBadge score={place.score} action={place.score_action} />
                        ) : (
                          <button
                            onClick={() => handleScore(place)}
                            className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
                          >
                            <Zap className="w-3 h-3" /> Calcular
                          </button>
                        )}
                      </td>
                      <td className="p-3">
                        {place.score_reason && (
                          <button
                            onClick={() => setExpandedScore(e => ({ ...e, [place.id]: !e[place.id] }))}
                            className="text-slate-500 hover:text-slate-300 transition-colors"
                          >
                            {expandedScore[place.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        )}
                      </td>
                    </tr>
                    {expandedScore[place.id] && place.score_reason && (
                      <tr className="border-b border-[#1E293B]/30">
                        <td colSpan={7} className="px-4 pb-3">
                          <div className="ml-8 p-3 bg-purple-500/5 border border-purple-500/20 rounded-lg text-xs text-slate-300">
                            <span className="text-purple-400 font-medium">Análisis IA:</span> {place.score_reason}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="bg-[#0A101F]/60 border border-[#1E293B] rounded-xl">
          <button
            onClick={() => setShowHistory(h => !h)}
            className="flex items-center justify-between w-full p-4 text-left"
          >
            <span className="flex items-center gap-2 text-sm font-semibold text-slate-300">
              <History className="w-4 h-4 text-slate-400" />
              Historial de búsquedas ({history.length})
            </span>
            {showHistory ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </button>
          {showHistory && (
            <div className="border-t border-[#1E293B] p-4 space-y-2">
              {history.map(h => (
                <div key={h.id} className="flex items-center justify-between text-xs text-slate-400 py-2 border-b border-[#1E293B]/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <Search className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-200 font-medium">{h.query.rubro}</span>
                    <span>en {h.query.ciudad}</span>
                    <span>({h.query.radio} km)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sky-400">{h.results_count} resultados</span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3 h-3" />
                      {new Date(h.created_at).toLocaleDateString('es-AR')}
                    </span>
                    <button
                      onClick={() => { setRubro(h.query.rubro); setCiudad(h.query.ciudad); setRadio(h.query.radio); }}
                      className="text-sky-400 hover:text-sky-300 transition-colors"
                    >
                      Repetir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
