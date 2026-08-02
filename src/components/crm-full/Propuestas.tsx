import React, { useState, useEffect } from 'react';
import {
  FileText, Plus, Loader2, AlertCircle, Building2,
  CheckCircle2, Clock, XCircle, ChevronRight, RefreshCw, Send,
} from 'lucide-react';

type ProposalStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected';

interface Proposal {
  id: string;
  company_id: string | null;
  company_name?: string;
  lead_id: string | null;
  content_md: string;
  pdf_url: string | null;
  status: ProposalStatus;
  created_at: string;
}

interface Company { id: string; name: string; industry?: string; }

const STATUS_CONFIG: Record<ProposalStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  draft:    { label: 'Borrador',  color: 'text-slate-400',   bg: 'bg-slate-400/10 border-slate-400/30',    icon: <Clock className="w-3 h-3" /> },
  sent:     { label: 'Enviada',   color: 'text-blue-400',    bg: 'bg-blue-400/10 border-blue-400/30',      icon: <Send className="w-3 h-3" /> },
  viewed:   { label: 'Vista',     color: 'text-amber-400',   bg: 'bg-amber-400/10 border-amber-400/30',    icon: <ChevronRight className="w-3 h-3" /> },
  accepted: { label: 'Aceptada',  color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/30', icon: <CheckCircle2 className="w-3 h-3" /> },
  rejected: { label: 'Rechazada', color: 'text-rose-400',    bg: 'bg-rose-400/10 border-rose-400/30',      icon: <XCircle className="w-3 h-3" /> },
};

export default function Propuestas() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<Proposal | null>(null);

  // Form state
  const [form, setForm] = useState({ company_id: '', content_md: '' });

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true); setError(null);
    try {
      const [pRes, cRes] = await Promise.all([
        fetch('/api/proposals?limit=50', { credentials: 'include' }),
        fetch('/api/companies?limit=100', { credentials: 'include' }),
      ]);
      if (!pRes.ok) throw new Error(`Propuestas: HTTP ${pRes.status}`);
      const pData = await pRes.json();
      setProposals(pData.proposals ?? []);
      if (cRes.ok) {
        const cData = await cRes.json();
        setCompanies(cData.companies ?? []);
      }
    } catch (e: any) {
      setError(e.message ?? 'Error cargando propuestas');
    } finally {
      setLoading(false);
    }
  }

  async function create() {
    if (!form.content_md.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_id: form.company_id || null, content_md: form.content_md }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const row = await res.json();
      // Attach company name locally
      const co = companies.find(c => c.id === form.company_id);
      setProposals(prev => [{ ...row, company_name: co?.name }, ...prev]);
      setForm({ company_id: '', content_md: '' });
      setShowNew(false);
    } catch (e: any) {
      setError(e.message ?? 'Error creando propuesta');
    } finally {
      setSaving(false);
    }
  }

  const byStatus = (s: ProposalStatus) => proposals.filter(p => p.status === s).length;

  return (
    <div className="flex gap-6 h-full text-slate-200">
      {/* Left: list */}
      <div className="flex flex-col gap-4 flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 bg-blue-400/15 border border-blue-400/30 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Propuestas Comerciales</h1>
              <p className="text-slate-400 text-sm mt-1">Propuestas generadas por IA para cada empresa prospectada.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={load} className="w-8 h-8 rounded-lg bg-[#1E293B] hover:bg-slate-700 flex items-center justify-center text-slate-400 transition-all">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={() => setShowNew(true)}
              className="flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all">
              <Plus className="w-4 h-4" /> Nueva propuesta
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 text-xs text-rose-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            <button onClick={load} className="ml-auto underline hover:no-underline">Reintentar</button>
          </div>
        )}

        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {(Object.keys(STATUS_CONFIG) as ProposalStatus[]).map(s => {
            const cfg = STATUS_CONFIG[s];
            return (
              <div key={s} className="bg-[#0D1424] border border-[#1E293B] rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className={cfg.color}>{cfg.icon}</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">{cfg.label}</span>
                </div>
                <div className="text-xl font-black text-white">{loading ? '—' : byStatus(s)}</div>
              </div>
            );
          })}
        </div>

        {/* New proposal form */}
        {showNew && (
          <div className="bg-[#0D1424] border border-blue-400/20 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">Nueva propuesta</h3>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider">Empresa (opcional)</label>
              <select value={form.company_id} onChange={e => setForm(f => ({ ...f, company_id: e.target.value }))}
                className="w-full bg-[#080C14] border border-[#1E293B] rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-400/50">
                <option value="">— Sin empresa asociada —</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}{c.industry ? ` · ${c.industry}` : ''}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider">Contenido (Markdown)</label>
              <textarea value={form.content_md} onChange={e => setForm(f => ({ ...f, content_md: e.target.value }))}
                rows={8} placeholder={`# Propuesta Comercial — [Empresa]\n\n## Problema detectado\n...\n\n## Nuestra solución\n...\n\n## Inversión\n...`}
                className="w-full bg-[#080C14] border border-[#1E293B] rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-700 focus:outline-none focus:border-blue-400/50 font-mono resize-y" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowNew(false)} className="px-4 py-2 text-xs text-slate-400 border border-[#1E293B] rounded-lg hover:text-slate-200 transition-all">Cancelar</button>
              <button onClick={create} disabled={saving || !form.content_md.trim()}
                className="px-4 py-2 text-xs font-bold bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all flex items-center gap-2 disabled:opacity-60">
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Guardar propuesta
              </button>
            </div>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-500 gap-2 text-sm">
            <Loader2 className="w-5 h-5 animate-spin" /> Cargando propuestas…
          </div>
        ) : proposals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500 gap-3">
            <FileText className="w-10 h-10 opacity-30" />
            <p className="text-sm">No hay propuestas todavía.</p>
            <p className="text-xs text-slate-600">Creá una manualmente o generala desde el Brochure CRM.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {proposals.map(p => {
              const st = STATUS_CONFIG[p.status as ProposalStatus] ?? STATUS_CONFIG.draft;
              const preview = p.content_md.slice(0, 120).replace(/[#*\n]/g, ' ').trim();
              const isSelected = selected?.id === p.id;
              return (
                <button key={p.id} onClick={() => setSelected(isSelected ? null : p)}
                  className={`w-full text-left bg-[#0D1424] border rounded-xl p-4 transition-all ${isSelected ? 'border-blue-400/40' : 'border-[#1E293B] hover:border-slate-600'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-400/10 border border-blue-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {p.company_name ? (
                          <span className="flex items-center gap-1 text-xs font-semibold text-white">
                            <Building2 className="w-3 h-3 text-slate-500" /> {p.company_name}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500 italic">Sin empresa</span>
                        )}
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${st.bg} ${st.color}`}>
                          {st.icon} {st.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{preview || '(sin contenido)'}</p>
                    </div>
                    <div className="text-[10px] text-slate-600 flex-shrink-0">
                      {p.created_at?.slice(0, 10)}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="mt-4 pt-4 border-t border-[#1E293B]">
                      <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono leading-relaxed max-h-64 overflow-y-auto">
                        {p.content_md}
                      </pre>
                      {p.pdf_url && (
                        <a href={p.pdf_url} target="_blank" rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 underline">
                          <FileText className="w-3.5 h-3.5" /> Ver PDF
                        </a>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
