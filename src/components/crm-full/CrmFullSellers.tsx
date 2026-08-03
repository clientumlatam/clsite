import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Plus, Pencil, Check, X, Shield, Terminal } from 'lucide-react';
import { Seller } from './crmTypes';

const specialties = [
  { value: 'crm', label: 'CRM & Ventas', icon: '💼' },
  { value: 'chatbot', label: 'Chatbot & IA', icon: '🤖' },
  { value: 'ecommerce', label: 'E-Commerce', icon: '🛒' },
  { value: 'marketing', label: 'Marketing Digital', icon: '📣' },
  { value: 'cloud', label: 'Cloud & Infraestructura', icon: '☁️' },
  { value: 'capacitacion', label: 'Capacitación', icon: '🎓' },
  { value: 'general', label: 'General', icon: '📋' },
];

const specialtyColors: Record<string, string> = {
  crm: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  chatbot: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
  ecommerce: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  marketing: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  cloud: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  capacitacion: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  general: 'text-slate-400 bg-[#1E293B] border-[#334155]',
};

interface SellerCardProps { seller: Seller; onEdit: (s: Seller) => void; index: number }
const SellerCard: React.FC<SellerCardProps> = ({ seller, onEdit, index }) => {
  const sp = specialties.find(s => s.value === seller.specialty);
  const colorClass = specialtyColors[seller.specialty] || specialtyColors.general;
  
  return (
    <div className={`cockpit-panel p-5 animate-slide-up group flex flex-col justify-between`} style={{ animationDelay: `${index * 50}ms` }}>
      <div>
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border shadow-inner ${colorClass}`}>
            <span className="text-xl font-display font-bold">{seller.name?.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-bold text-white font-display uppercase tracking-wide truncate">{seller.name}</h3>
            </div>
            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-mono font-bold uppercase tracking-wider ${colorClass}`}>
              <span>{sp?.icon}</span> {sp?.label || seller.specialty}
            </div>
          </div>
        </div>
        
        <div className="space-y-2 mb-5 font-mono text-xs border-t border-[#1E293B] pt-4">
          <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-300 transition-colors">
            <Phone className="w-3.5 h-3.5 text-slate-500" />
            <a href={`https://wa.me/${seller.phone?.replace(/\D/g, '')}`} className="hover:text-sky-400 truncate transition-colors">{seller.phone || 'NO REGISTRADO'}</a>
          </div>
          <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-300 transition-colors">
            <Mail className="w-3.5 h-3.5 text-slate-500" />
            <span className="truncate">{seller.email || 'NO REGISTRADO'}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-300 transition-colors">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span className="truncate">{seller.branch || 'SIN SUCURSAL'}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-[#1E293B]">
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${seller.active ? 'bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)]' : 'bg-red-500'}`} />
          <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${seller.active ? 'text-emerald-400' : 'text-red-500'}`}>
            {seller.active ? 'OPERATIVO' : 'FUERA DE LÍNEA'}
          </span>
        </div>
        <button onClick={() => onEdit(seller)} className="p-1.5 rounded hover:bg-[#1E293B] text-slate-500 hover:text-sky-400 transition-all opacity-0 group-hover:opacity-100">
          <Pencil className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

interface SellerFormProps { seller: Seller | null; onSave: (data: Seller) => void; onCancel: () => void }
const SellerForm = ({ seller, onSave, onCancel }: SellerFormProps) => {
  const [form, setForm] = useState<Seller>(seller || { id: '', name: '', phone: '', email: '', specialty: 'general', branch: '', active: true });
  const set = (k: keyof Seller, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="cockpit-panel p-5 animate-slide-up border-sky-500/30 shadow-[0_0_20px_rgba(14,165,233,0.1)] mb-6">
      <div className="flex items-center gap-2 mb-5 border-b border-[#1E293B] pb-3">
        <Shield className="w-4 h-4 text-sky-400" />
        <h3 className="text-sm font-bold text-white font-display tracking-wide uppercase">
          {seller ? 'ACTUALIZAR PERFIL DE OPERADOR' : 'ALTA DE NUEVO OPERADOR'}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-[10px] font-bold text-slate-400 mb-1.5 block font-mono uppercase tracking-widest">Identificación (Nombre)</label>
          <input className="cockpit-input w-full font-display" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Operador..." />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 mb-1.5 block font-mono uppercase tracking-widest">Especialización</label>
          <select 
            className="cockpit-input w-full font-mono text-xs" 
            value={form.specialty} 
            onChange={e => set('specialty', e.target.value)}
          >
            {specialties.map(s => <option key={s.value} value={s.value}>{s.label.toUpperCase()}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 mb-1.5 block font-mono uppercase tracking-widest">Canal Com. (WhatsApp)</label>
          <input className="cockpit-input w-full font-mono" value={form.phone || ''} onChange={e => set('phone', e.target.value)} placeholder="+54 9..." />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 mb-1.5 block font-mono uppercase tracking-widest">Correo Electrónico</label>
          <input className="cockpit-input w-full font-mono" value={form.email || ''} onChange={e => set('email', e.target.value)} placeholder="op@clientum.com.ar" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 mb-1.5 block font-mono uppercase tracking-widest">Base de Operaciones</label>
          <input className="cockpit-input w-full font-display uppercase" value={form.branch || ''} onChange={e => set('branch', e.target.value)} placeholder="Sede..." />
        </div>
        <div className="flex items-center pt-5">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={form.active} onChange={e => set('active', e.target.checked)} />
              <div className={`w-10 h-5 rounded-full transition-colors ${form.active ? 'bg-emerald-500/50' : 'bg-[#1E293B]'}`}></div>
              <div className={`absolute left-1 top-1 w-3 h-3 rounded-full bg-white transition-transform ${form.active ? 'translate-x-5 shadow-[0_0_10px_#34d399]' : ''}`}></div>
            </div>
            <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest">
              {form.active ? 'ESTADO: OPERATIVO' : 'ESTADO: FUERA DE LÍNEA'}
            </span>
          </label>
        </div>
      </div>
      
      <div className="flex gap-3 pt-4 border-t border-[#1E293B]">
        <button onClick={() => onSave(form)} className="cockpit-button-primary px-6 py-2 flex items-center text-sm font-mono uppercase tracking-wider">
          <Check className="w-4 h-4 mr-2" /> GRABAR PERFIL
        </button>
        <button onClick={onCancel} className="cockpit-button-secondary px-6 py-2 flex items-center text-sm font-mono uppercase tracking-wider">
          <X className="w-4 h-4 mr-2" /> ABORTAR
        </button>
      </div>
    </div>
  );
};

interface Props { sellers: Seller[]; onSave: (s: Seller) => void }
export default function CrmFullSellers({ sellers, onSave }: Props) {
  const [editing, setEditing] = useState<Seller | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filterSpec, setFilterSpec] = useState('all');

  const filtered = filterSpec === 'all' ? sellers : sellers.filter(s => s.specialty === filterSpec);

  const handleSave = (data: Seller) => {
    const toSave: Seller = editing?.id
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
            <Terminal className="w-6 h-6 text-sky-400" />
            OPERADORES DE RED
          </h1>
          <p className="text-xs text-slate-500 font-mono tracking-wider uppercase">
            FUERZA DE VENTAS · {sellers.length} AGENTES REGISTRADOS
          </p>
        </div>
        <button 
          onClick={() => { setEditing(null); setShowForm(true); }} 
          className="cockpit-button-primary px-4 py-2 flex items-center text-sm uppercase tracking-wider font-mono"
        >
          <Plus className="w-4 h-4 mr-2" /> AÑADIR AGENTE
        </button>
      </div>

      {showForm && (
        <SellerForm
          seller={editing}
          onSave={handleSave}
          onCancel={() => { setEditing(null); setShowForm(false); }}
        />
      )}

      <div className="flex flex-wrap gap-2 mb-6 stagger-1 animate-slide-up">
        <button 
          className={`px-3 py-1.5 rounded text-[10px] font-mono font-bold uppercase tracking-widest transition-all ${
            filterSpec === 'all' 
              ? 'bg-sky-500 text-white shadow-[0_0_10px_rgba(14,165,233,0.3)]' 
              : 'bg-[#1E293B] text-slate-400 hover:text-slate-200 hover:bg-[#2D3F5E] border border-[#334155]'
          }`}
          onClick={() => setFilterSpec('all')}
        >
          TODOS [{sellers.length}]
        </button>
        {specialties.map(s => {
          const count = sellers.filter(v => v.specialty === s.value).length;
          if (!count) return null;
          return (
            <button 
              key={s.value} 
              className={`px-3 py-1.5 rounded text-[10px] font-mono font-bold uppercase tracking-widest transition-all flex items-center gap-1.5 ${
                filterSpec === s.value 
                  ? 'bg-sky-500 text-white shadow-[0_0_10px_rgba(14,165,233,0.3)]' 
                  : 'bg-[#1E293B] text-slate-400 hover:text-slate-200 hover:bg-[#2D3F5E] border border-[#334155]'
              }`}
              onClick={() => setFilterSpec(s.value)}
            >
              <span>{s.icon}</span> {s.label} [{count}]
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((s, i) => (
          <SellerCard key={s.id} seller={s} onEdit={(seller) => { setEditing(seller); setShowForm(true); }} index={i} />
        ))}
      </div>
    </div>
  );
}
