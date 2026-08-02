import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, MessageCircle, Mail, Globe, Play, Pause, BarChart3, Users, CheckCircle2, Clock, AlertCircle, ChevronRight, Loader2 } from 'lucide-react';

type CampaignStatus = 'activa' | 'borrador' | 'pausada' | 'completada';
type CampaignChannel = 'whatsapp' | 'email' | 'linkedin';

interface Campaign {
  id: string; name: string; channel: CampaignChannel; status: CampaignStatus;
  leads: number; sent: number; replies: number; created: string; template: string;
}

// DB uses English status values; UI uses Spanish.
const STATUS_TO_DB: Record<CampaignStatus, string> = {
  activa: 'active', borrador: 'draft', pausada: 'paused', completada: 'completed',
};
const STATUS_FROM_DB: Record<string, CampaignStatus> = {
  active: 'activa', draft: 'borrador', paused: 'pausada', completed: 'completada',
};

function mapFromDb(row: any): Campaign {
  return {
    id: row.id,
    name: row.name,
    channel: (row.type as CampaignChannel) || 'email',
    status: STATUS_FROM_DB[row.status] ?? 'borrador',
    leads: parseInt(row.leads_count ?? '0', 10),
    sent: parseInt(row.sent_count ?? '0', 10),
    replies: parseInt(row.replies_count ?? '0', 10),
    created: row.created_at ? row.created_at.slice(0, 10) : '',
    template: row.template ?? 'intro',
  };
}

const TEMPLATES: Record<CampaignChannel, { id: string; label: string; preview: string }[]> = {
  whatsapp: [
    { id: 'intro', label: 'Presentación inicial', preview: 'Hola [Nombre], soy Santi de Clientum. Vi que tienen una distribuidora en [Ciudad]...' },
    { id: 'followup', label: 'Seguimiento 48h', preview: 'Hola [Nombre], te escribo para ver si pudieron revisar la propuesta que te envié...' },
    { id: 'cierre', label: 'Cierre / Oferta', preview: 'Hola [Nombre], esta semana tenemos un espacio libre para implementación...' },
  ],
  email: [
    { id: 'cold', label: 'Cold email PyME', preview: 'Asunto: Tu distribuidora + CRM = más ventas sin más vendedores...' },
    { id: 'demo', label: 'Invitación a demo', preview: 'Te invito a ver cómo otras distribuidoras de la Patagonia...' },
  ],
  linkedin: [
    { id: 'connect', label: 'Solicitud de conexión', preview: 'Hola [Nombre], vi que liderás [Empresa] en [Ciudad]. Trabajo con PyMEs patagónicas...' },
  ],
};

const CHANNEL_CONFIG: Record<CampaignChannel, { icon: React.ReactNode; label: string; color: string; bg: string }> = {
  whatsapp: { icon: <MessageCircle className="w-3.5 h-3.5" />, label: 'WhatsApp', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/30' },
  email:    { icon: <Mail className="w-3.5 h-3.5" />,          label: 'Email',    color: 'text-blue-400',    bg: 'bg-blue-400/10 border-blue-400/30' },
  linkedin: { icon: <Globe className="w-3.5 h-3.5" />,      label: 'LinkedIn', color: 'text-sky-400',     bg: 'bg-sky-400/10 border-sky-400/30' },
};

const STATUS_CONFIG: Record<CampaignStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  activa:     { label: 'Activa',     color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/30', icon: <Play className="w-3 h-3" /> },
  borrador:   { label: 'Borrador',   color: 'text-slate-400',   bg: 'bg-slate-400/10 border-slate-400/30',    icon: <Clock className="w-3 h-3" /> },
  pausada:    { label: 'Pausada',    color: 'text-amber-400',   bg: 'bg-amber-400/10 border-amber-400/30',    icon: <Pause className="w-3 h-3" /> },
  completada: { label: 'Completada', color: 'text-sky-400',     bg: 'bg-sky-400/10 border-sky-400/30',        icon: <CheckCircle2 className="w-3 h-3" /> },
};

export default function OutreachCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newChannel, setNewChannel] = useState<CampaignChannel>('whatsapp');
  const [newTemplate, setNewTemplate] = useState('intro');
  const [saving, setSaving] = useState(false);

  // ── Load from API ──────────────────────────────────────────────────────────
  useEffect(() => {
    fetchCampaigns();
  }, []);

  async function fetchCampaigns() {
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/campaigns', { credentials: 'include' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const rows: any[] = await res.json();
      setCampaigns(rows.map(mapFromDb));
    } catch (e: any) {
      setError(e.message ?? 'Error cargando campañas');
    } finally {
      setLoading(false);
    }
  }

  async function createCampaign() {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, type: newChannel, template: newTemplate, status: 'draft' }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const row = await res.json();
      setCampaigns(prev => [mapFromDb(row), ...prev]);
      setNewName(''); setShowNew(false);
    } catch (e: any) {
      setError(e.message ?? 'Error creando campaña');
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(id: string, current: CampaignStatus) {
    const next: CampaignStatus = current === 'activa' ? 'pausada' : current === 'pausada' ? 'activa' : current;
    if (next === current) return;
    // Optimistic update
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: next } : c));
    try {
      const res = await fetch(`/api/campaigns/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: STATUS_TO_DB[next] }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch {
      // Revert on failure
      setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: current } : c));
    }
  }

  return (
    <div className="space-y-6 text-slate-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-9 h-9 bg-violet-400/15 border border-violet-400/30 rounded-xl flex items-center justify-center flex-shrink-0">
            <Megaphone className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">Outreach Campaigns</h1>
            <p className="text-slate-400 text-sm mt-1">Campañas de contacto multi-canal coordinadas con Santi SDR.</p>
          </div>
        </div>
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex-shrink-0">
          <Plus className="w-4 h-4" /> Nueva campaña
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 text-xs text-rose-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          <button onClick={fetchCampaigns} className="ml-auto underline hover:no-underline">Reintentar</button>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total campañas', value: loading ? '—' : campaigns.length, icon: <Megaphone className="w-4 h-4 text-violet-400" /> },
          { label: 'Leads alcanzados', value: loading ? '—' : campaigns.reduce((a, c) => a + c.sent, 0), icon: <Users className="w-4 h-4 text-blue-400" /> },
          { label: 'Respuestas', value: loading ? '—' : campaigns.reduce((a, c) => a + c.replies, 0), icon: <MessageCircle className="w-4 h-4 text-[#10B981]" /> },
          {
            label: 'Tasa de respuesta',
            value: loading ? '—' : `${Math.round(campaigns.reduce((a, c) => a + c.replies, 0) / Math.max(campaigns.reduce((a, c) => a + c.sent, 0), 1) * 100)}%`,
            icon: <BarChart3 className="w-4 h-4 text-amber-400" />,
          },
        ].map(s => (
          <div key={s.label} className="bg-[#0D1424] border border-[#1E293B] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">{s.icon}<span className="text-xs text-slate-500">{s.label}</span></div>
            <div className="text-2xl font-black text-white">{s.value}</div>
          </div>
        ))}
      </div>

      {/* New campaign form */}
      {showNew && (
        <div className="bg-[#0D1424] border border-[#10B981]/30 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Nueva campaña de outreach</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider">Nombre</label>
              <input value={newName} onChange={e => setNewName(e.target.value)}
                placeholder="Ej: Distribuidoras Neuquén julio"
                className="w-full bg-[#080C14] border border-[#1E293B] rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#10B981]/50" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5 uppercase tracking-wider">Canal</label>
              <div className="flex gap-2">
                {(Object.keys(CHANNEL_CONFIG) as CampaignChannel[]).map(ch => (
                  <button key={ch} onClick={() => { setNewChannel(ch); setNewTemplate(TEMPLATES[ch][0].id); }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${newChannel === ch ? CHANNEL_CONFIG[ch].bg + ' ' + CHANNEL_CONFIG[ch].color : 'border-[#1E293B] text-slate-500 hover:text-slate-300'}`}>
                    {CHANNEL_CONFIG[ch].icon} {CHANNEL_CONFIG[ch].label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-2 uppercase tracking-wider">Template de mensajes</label>
            <div className="space-y-2">
              {TEMPLATES[newChannel].map(t => (
                <button key={t.id} onClick={() => setNewTemplate(t.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${newTemplate === t.id ? 'border-[#10B981]/40 bg-[#10B981]/10' : 'border-[#1E293B] hover:border-slate-600'}`}>
                  <div className="text-xs font-semibold text-slate-300 mb-1">{t.label}</div>
                  <div className="text-[11px] text-slate-500 leading-relaxed truncate">{t.preview}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowNew(false)} className="px-4 py-2 text-xs text-slate-400 border border-[#1E293B] rounded-lg hover:text-slate-200 transition-all">Cancelar</button>
            <button onClick={createCampaign} disabled={saving}
              className="px-4 py-2 text-xs font-bold bg-[#10B981] hover:bg-[#059669] text-white rounded-lg transition-all flex items-center gap-2 disabled:opacity-60">
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Crear campaña
            </button>
          </div>
        </div>
      )}

      {/* Campaign list */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500 gap-2 text-sm">
          <Loader2 className="w-5 h-5 animate-spin" /> Cargando campañas…
        </div>
      ) : campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500 gap-3">
          <Megaphone className="w-10 h-10 opacity-30" />
          <p className="text-sm">No hay campañas todavía. Creá la primera.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map(c => {
            const ch = CHANNEL_CONFIG[c.channel];
            const st = STATUS_CONFIG[c.status];
            const replyRate = c.sent > 0 ? Math.round(c.replies / c.sent * 100) : 0;
            return (
              <div key={c.id} className="bg-[#0D1424] border border-[#1E293B] rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-2">
                      <h3 className="font-bold text-white text-sm">{c.name}</h3>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${ch.bg} ${ch.color}`}>
                        {ch.icon} {ch.label}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${st.bg} ${st.color}`}>
                        {st.icon} {st.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span><span className="text-slate-300 font-semibold">{c.leads}</span> leads</span>
                      <span><span className="text-slate-300 font-semibold">{c.sent}</span> enviados</span>
                      <span><span className="text-[#10B981] font-semibold">{c.replies}</span> respuestas</span>
                      <span>Tasa: <span className={replyRate > 25 ? 'text-emerald-400 font-bold' : replyRate > 10 ? 'text-amber-400 font-bold' : 'text-rose-400 font-bold'}>{replyRate}%</span></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {(c.status === 'activa' || c.status === 'pausada') && (
                      <button onClick={() => toggleStatus(c.id, c.status)}
                        className="w-8 h-8 rounded-lg bg-[#1E293B] hover:bg-slate-700 flex items-center justify-center text-slate-400 transition-all">
                        {c.status === 'activa' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                    )}
                    <button className="w-8 h-8 rounded-lg bg-[#1E293B] hover:bg-slate-700 flex items-center justify-center text-slate-400 transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {c.status === 'activa' && c.sent > 0 && c.leads > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                      <span>Progreso</span><span>{c.sent}/{c.leads}</span>
                    </div>
                    <div className="h-1 bg-[#1E293B] rounded-full overflow-hidden">
                      <div className="h-full bg-[#10B981] rounded-full transition-all" style={{ width: `${Math.min(Math.round(c.sent / c.leads * 100), 100)}%` }} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
