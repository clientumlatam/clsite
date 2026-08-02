import React, { useState } from 'react';
import { Plus, CheckCircle2, Building2, User, Phone, Mail, Tag, TrendingUp, Loader2, Zap } from 'lucide-react';
import { saveDeals, loadDeals, addActivity, DEALS_EVENT } from '../../store/sharedStore';

const INDUSTRIES = ['Distribuidora', 'Ferretería', 'Clínica / Salud', 'Logística', 'Inmobiliaria', 'Gastronomía', 'Agropecuaria', 'Otro'];
const STAGES: { id: string; label: string; color: string }[] = [
  { id: 'leads',       label: 'Lead',         color: 'text-slate-400' },
  { id: 'contacted',   label: 'Contactado',    color: 'text-blue-400' },
  { id: 'demo',        label: 'Demo agendada', color: 'text-violet-400' },
  { id: 'proposal',    label: 'Propuesta',     color: 'text-amber-400' },
  { id: 'negotiation', label: 'Negociación',   color: 'text-orange-400' },
  { id: 'closed_won',  label: 'Cerrado ✓',    color: 'text-emerald-400' },
];

interface RecentItem { empresa: string; contacto: string; stage: string; ts: string; }

export default function CreacionRapidaCRM() {
  const [empresa, setEmpresa]     = useState('');
  const [contacto, setContacto]   = useState('');
  const [telefono, setTelefono]   = useState('');
  const [email, setEmail]         = useState('');
  const [industria, setIndustria] = useState('Distribuidora');
  const [stage, setStage]         = useState('leads');
  const [monto, setMonto]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [saved, setSaved]         = useState(false);
  const [recent, setRecent]       = useState<RecentItem[]>([]);

  const handleSave = async () => {
    if (!empresa.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));

    const deals = loadDeals();
    const newDeal = {
      id: `crm_${Date.now()}`,
      company: empresa,
      contact: contacto || empresa,
      phone: telefono,
      email,
      industry: industria,
      stage: stage as any,
      amount: monto ? parseInt(monto.replace(/\D/g, '')) : 0,
      score: 50,
      created: new Date().toISOString(),
    };
    saveDeals([...deals, newDeal]);
    addActivity({ type: 'lead', title: `Nuevo lead creado: ${empresa}`, notes: contacto });
    window.dispatchEvent(new CustomEvent(DEALS_EVENT, { detail: [...deals, newDeal] }));

    setRecent(prev => [{ empresa, contacto, stage, ts: 'ahora' }, ...prev.slice(0, 4)]);
    setSaved(true);
    setEmpresa(''); setContacto(''); setTelefono(''); setEmail(''); setMonto('');
    setStage('leads');
    setLoading(false);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 text-slate-200 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-[#10B981]/15 border border-[#10B981]/30 rounded-xl flex items-center justify-center">
          <Zap className="w-5 h-5 text-[#10B981]" />
        </div>
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">Creación Rápida</h1>
          <p className="text-slate-400 text-sm">Cargá un lead o deal al pipeline en segundos.</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-[#0D1424] border border-[#1E293B] rounded-2xl p-6 space-y-5">
        {/* Empresa */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-[#10B981]" /> Empresa *
          </label>
          <input value={empresa} onChange={e => setEmpresa(e.target.value)}
            placeholder="Ej: Distribuidora Andina SA"
            className="w-full bg-[#080C14] border border-[#1E293B] focus:border-[#10B981]/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition-all" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Contacto */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <User className="w-3.5 h-3.5" /> Contacto
            </label>
            <input value={contacto} onChange={e => setContacto(e.target.value)}
              placeholder="Nombre del contacto"
              className="w-full bg-[#080C14] border border-[#1E293B] focus:border-[#10B981]/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition-all" />
          </div>
          {/* Teléfono */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5" /> Teléfono
            </label>
            <input value={telefono} onChange={e => setTelefono(e.target.value)}
              placeholder="+54 299 000-0000"
              className="w-full bg-[#080C14] border border-[#1E293B] focus:border-[#10B981]/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition-all" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" /> Email
            </label>
            <input value={email} onChange={e => setEmail(e.target.value)}
              placeholder="contacto@empresa.com"
              className="w-full bg-[#080C14] border border-[#1E293B] focus:border-[#10B981]/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition-all" />
          </div>
          {/* Monto */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5" /> Valor estimado (ARS)
            </label>
            <input value={monto} onChange={e => setMonto(e.target.value)}
              placeholder="Ej: 120000"
              className="w-full bg-[#080C14] border border-[#1E293B] focus:border-[#10B981]/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition-all" />
          </div>
        </div>

        {/* Industria */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Tag className="w-3.5 h-3.5" /> Industria
          </label>
          <div className="flex flex-wrap gap-2">
            {INDUSTRIES.map(ind => (
              <button key={ind} onClick={() => setIndustria(ind)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  industria === ind ? 'bg-[#10B981]/15 border-[#10B981]/40 text-[#10B981]' : 'border-[#1E293B] text-slate-400 hover:border-slate-600 hover:text-slate-200'
                }`}>
                {ind}
              </button>
            ))}
          </div>
        </div>

        {/* Etapa */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Etapa del pipeline</label>
          <div className="grid grid-cols-3 gap-2">
            {STAGES.map(s => (
              <button key={s.id} onClick={() => setStage(s.id)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all text-center ${
                  stage === s.id ? 'bg-[#10B981]/15 border-[#10B981]/40 text-[#10B981]' : 'border-[#1E293B] text-slate-400 hover:border-slate-600'
                }`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleSave} disabled={!empresa.trim() || loading}
          className={`w-full flex items-center justify-center gap-2 font-bold text-sm py-3.5 rounded-xl transition-all ${
            saved ? 'bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981]'
                  : 'bg-[#10B981] hover:bg-[#059669] disabled:opacity-40 text-white'
          }`}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {loading ? 'Guardando…' : saved ? '¡Guardado en el pipeline!' : 'Agregar al pipeline'}
        </button>
      </div>

      {/* Recent */}
      {recent.length > 0 && (
        <div className="bg-[#0D1424] border border-[#1E293B] rounded-xl p-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Agregados recientemente</h3>
          <div className="space-y-2">
            {recent.map((r, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                  <span className="text-slate-300 font-semibold">{r.empresa}</span>
                  {r.contacto && <span className="text-slate-500">· {r.contacto}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#10B981] text-[10px]">{STAGES.find(s => s.id === r.stage)?.label}</span>
                  <span className="text-slate-600">{r.ts}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
