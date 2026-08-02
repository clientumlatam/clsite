import React, { useState } from 'react';
import { MapPin, Phone, Clock, Plus, Pencil, Check, X, Building2, Server } from 'lucide-react';
import { Branch } from './crmTypes';

interface BranchCardProps { branch: Branch; onEdit: (b: Branch) => void; index: number }
const BranchCard: React.FC<BranchCardProps> = ({ branch, onEdit, index }) => (
  <div className={`cockpit-panel overflow-hidden group flex flex-col justify-between animate-slide-up`} style={{ animationDelay: `${index * 50}ms` }}>
    <div>
      <div className="bg-[#0A101F] border-b border-[#1E293B] p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full filter blur-[40px] pointer-events-none group-hover:bg-sky-500/10 transition-colors" />
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-sky-400 opacity-70" />
            <h3 className="text-sm font-bold text-white font-display tracking-wide uppercase">{branch.name}</h3>
          </div>
          <div className="flex gap-1">
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-mono font-bold uppercase tracking-wider ${
              branch.active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${branch.active ? 'bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)]' : 'bg-red-500'}`} />
              {branch.active ? 'EN LÍNEA' : 'OFFLINE'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-5 space-y-4 font-mono text-xs">
        <div className="flex items-start gap-3 text-slate-400 group-hover:text-slate-300 transition-colors">
          <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-slate-300">{branch.address}</p>
            {branch.city && <p className="text-[10px] mt-1 text-slate-500 tracking-widest uppercase">{branch.city}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-300 transition-colors">
          <Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <a href={`tel:${branch.phone}`} className="hover:text-sky-400 transition-colors">{branch.phone}</a>
        </div>
        <div className="flex items-start gap-3 text-slate-400 group-hover:text-slate-300 transition-colors">
          <Clock className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            {branch.schedule?.split('|').map((t, i) => (
              <p key={i} className="text-[10px] tracking-wide uppercase">{t.trim()}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
    
    <div className="p-4 border-t border-[#1E293B] bg-[#0A101F]/50">
      <button 
        className="w-full cockpit-button-secondary py-2 flex items-center justify-center text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 hover:text-sky-400"
        onClick={() => onEdit(branch)}
      >
        <Pencil className="w-3 h-3 mr-2" /> RECONFIGURAR NODO
      </button>
    </div>
  </div>
);

interface BranchFormProps { branch: Branch | null; onSave: (b: Branch) => void; onCancel: () => void }
const BranchForm = ({ branch, onSave, onCancel }: BranchFormProps) => {
  const [form, setForm] = useState<Branch>(branch || { id: '', name: '', address: '', phone: '', schedule: '', city: '', active: true });
  const set = (k: keyof Branch, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="cockpit-panel p-5 animate-slide-up border-sky-500/30 shadow-[0_0_20px_rgba(14,165,233,0.1)] mb-6">
      <div className="flex items-center gap-2 mb-5 border-b border-[#1E293B] pb-3">
        <Server className="w-4 h-4 text-sky-400" />
        <h3 className="text-sm font-bold text-white font-display tracking-wide uppercase">
          {branch ? 'RECONFIGURAR NODO / SUCURSAL' : 'ALTA DE NUEVO NODO / SUCURSAL'}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-[10px] font-bold text-slate-400 mb-1.5 block font-mono uppercase tracking-widest">Identificador de Nodo</label>
          <input className="cockpit-input w-full font-display uppercase" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ej: Nodo Central..." />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 mb-1.5 block font-mono uppercase tracking-widest">Región / Ciudad</label>
          <input className="cockpit-input w-full font-display uppercase" value={form.city || ''} onChange={e => set('city', e.target.value)} placeholder="Ej: Neuquén..." />
        </div>
        <div className="lg:col-span-2">
          <label className="text-[10px] font-bold text-slate-400 mb-1.5 block font-mono uppercase tracking-widest">Coordenadas Físicas (Dirección)</label>
          <input className="cockpit-input w-full font-mono" value={form.address} onChange={e => set('address', e.target.value)} placeholder="Av. Principal 123..." />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 mb-1.5 block font-mono uppercase tracking-widest">Enlace Telefónico</label>
          <input className="cockpit-input w-full font-mono" value={form.phone || ''} onChange={e => set('phone', e.target.value)} placeholder="+54 9..." />
        </div>
        <div className="lg:col-span-2">
          <label className="text-[10px] font-bold text-slate-400 mb-1.5 block font-mono uppercase tracking-widest">Ventana Operativa (Separar con |)</label>
          <input className="cockpit-input w-full font-mono text-xs" value={form.schedule || ''} onChange={e => set('schedule', e.target.value)} placeholder="LUN-VIE 08:00-18:00 | SAB 08:00-13:00" />
        </div>
        <div className="flex items-center pt-5">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={form.active} onChange={e => set('active', e.target.checked)} />
              <div className={`w-10 h-5 rounded-full transition-colors ${form.active ? 'bg-emerald-500/50' : 'bg-[#1E293B]'}`}></div>
              <div className={`absolute left-1 top-1 w-3 h-3 rounded-full bg-white transition-transform ${form.active ? 'translate-x-5 shadow-[0_0_10px_#34d399]' : ''}`}></div>
            </div>
            <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest">
              {form.active ? 'ESTADO: EN LÍNEA' : 'ESTADO: OFFLINE'}
            </span>
          </label>
        </div>
      </div>
      
      <div className="flex gap-3 pt-4 border-t border-[#1E293B]">
        <button onClick={() => onSave(form)} className="cockpit-button-primary px-6 py-2 flex items-center text-sm font-mono uppercase tracking-wider">
          <Check className="w-4 h-4 mr-2" /> GRABAR NODO
        </button>
        <button onClick={onCancel} className="cockpit-button-secondary px-6 py-2 flex items-center text-sm font-mono uppercase tracking-wider">
          <X className="w-4 h-4 mr-2" /> ABORTAR
        </button>
      </div>
    </div>
  );
};

interface Props { branches: Branch[]; onSave: (b: Branch) => void }
export default function CrmFullBranches({ branches, onSave }: Props) {
  const [editing, setEditing] = useState<Branch | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (b: Branch) => { setEditing(b); setShowForm(true); };
  const handleNew = () => { setEditing(null); setShowForm(true); };
  const handleCancel = () => { setEditing(null); setShowForm(false); };

  const handleSave = (data: Branch) => {
    const toSave: Branch = editing?.id
      ? { ...data, id: editing.id }
      : { ...data, id: Date.now().toString() };
    onSave(toSave);
    setEditing(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 font-display tracking-wide flex items-center gap-3">
            <Building2 className="w-6 h-6 text-sky-400" />
            TOPOLOGÍA DE RED
          </h1>
          <p className="text-xs text-slate-500 font-mono tracking-wider uppercase">
            NODOS FÍSICOS / SUCURSALES · {branches.length} NODOS REGISTRADOS
          </p>
        </div>
        <button 
          onClick={handleNew} 
          className="cockpit-button-primary px-4 py-2 flex items-center text-sm uppercase tracking-wider font-mono"
        >
          <Plus className="w-4 h-4 mr-2" /> NUEVO NODO
        </button>
      </div>

      {showForm && (
        <BranchForm branch={editing} onSave={handleSave} onCancel={handleCancel} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {branches.map((b, i) => <BranchCard key={b.id} branch={b} onEdit={handleEdit} index={i} />)}
      </div>
    </div>
  );
}
