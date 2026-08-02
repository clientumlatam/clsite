import React, { useState } from 'react';
import { MessageSquare, User, Clock, Search, ArrowRight, Zap, Target } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import CrmConversationDetail from './CrmConversationDetail';
import { Conversation, Seller } from './crmTypes';

const statusColors: Record<string, string> = {
  activa: 'bg-sky-500/10 text-sky-400 border-sky-500/20 shadow-[0_0_10px_rgba(56,189,248,0.1)]',
  derivada: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.1)]',
  resuelta: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]',
  cerrada: 'bg-slate-800 text-slate-400 border-slate-700',
};

const statusLabels: Record<string, string> = {
  activa: 'Activa',
  derivada: 'Derivada',
  resuelta: 'Resuelta',
  cerrada: 'Cerrada',
};

const typeLabels: Record<string, string> = {
  precios: '💰 Precios',
  horarios: '🕐 Horarios',
  sucursales: '📍 Sucursales',
  derivacion: '👤 Derivación',
  reclamo: '⚠️ Reclamo',
  otro: '❓ Otro',
};

interface Props {
  conversations: Conversation[];
  sellers: Seller[];
  onUpdateConversation: (id: string, data: Partial<Conversation>) => void;
}

export default function CrmFullPipeline({ conversations, sellers, onUpdateConversation }: Props) {
  const [statusFilter, setStatusFilter] = useState('activa');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Conversation | null>(null);

  const filtered = conversations.filter(c => {
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchSearch = !search ||
      c.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.customer_phone?.includes(search);
    return matchStatus && matchSearch;
  });

  const counts = {
    activa: conversations.filter(c => c.status === 'activa').length,
    derivada: conversations.filter(c => c.status === 'derivada').length,
    resuelta: conversations.filter(c => c.status === 'resuelta').length,
    cerrada: conversations.filter(c => c.status === 'cerrada').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 font-display tracking-wide flex items-center gap-3">
            <Target className="w-6 h-6 text-sky-400" />
            CRM PIPELINE
          </h1>
          <p className="text-xs text-slate-500 font-mono tracking-wider uppercase">GESTIÓN DE CONVERSACIONES · {conversations.length} REGISTROS</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar cliente..."
            className="cockpit-input pl-9 w-full md:w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-1 animate-slide-up">
        {(Object.entries(counts) as [string, number][]).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status === statusFilter ? 'all' : status)}
            className={`text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden ${
              statusFilter === status
                ? 'bg-sky-500/10 border-sky-500/30 shadow-[0_0_15px_rgba(14,165,233,0.15)]'
                : 'bg-[#0A101F] border-[#1E293B] hover:bg-[#0f172a] hover:border-[#334155]'
            }`}
          >
            {statusFilter === status && <div className="absolute top-0 left-0 w-full h-1 bg-sky-500" />}
            <p className={`text-2xl font-bold font-display ${statusFilter === status ? 'text-sky-400' : 'text-slate-200'}`}>{count}</p>
            <p className="text-xs text-slate-500 font-mono tracking-wider uppercase mt-1">{statusLabels[status]}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 stagger-2 animate-slide-up">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider font-mono transition-all duration-200 ${
            statusFilter === 'all' 
              ? 'bg-sky-500 text-white shadow-[0_0_10px_rgba(14,165,233,0.3)]' 
              : 'bg-[#1E293B] text-slate-400 hover:text-slate-200 hover:bg-[#2D3F5E]'
          }`}
        >
          Todas ({conversations.length})
        </button>
        {(Object.entries(counts) as [string, number][]).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider font-mono transition-all duration-200 ${
              statusFilter === status 
                ? 'bg-sky-500 text-white shadow-[0_0_10px_rgba(14,165,233,0.3)]' 
                : 'bg-[#1E293B] text-slate-400 hover:text-slate-200 hover:bg-[#2D3F5E]'
            }`}
          >
            {statusLabels[status]} ({count})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="cockpit-panel p-16 text-center stagger-3 animate-slide-up">
          <MessageSquare className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-400 font-medium font-display tracking-wide">SIN CONVERSACIONES ACTIVAS</p>
          <p className="text-xs text-slate-500 font-mono mt-2">
            {search ? 'NO SE ENCONTRARON RESULTADOS PARA LA BÚSQUEDA.' : 'NO HAY REGISTROS CON EL ESTADO SELECCIONADO.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3 stagger-3 animate-slide-up">
          {filtered.map((conv) => (
            <button key={conv.id} onClick={() => setSelected(conv)} className="w-full text-left group">
              <div className={`cockpit-panel p-4 transition-all duration-300 relative overflow-hidden ${
                selected?.id === conv.id 
                  ? 'border-sky-500/50 bg-[#0f172a] shadow-[0_0_15px_rgba(14,165,233,0.1)]' 
                  : 'group-hover:border-[#334155] group-hover:bg-[#0f172a]'
              }`}>
                {selected?.id === conv.id && <div className="absolute left-0 top-0 w-1 h-full bg-sky-500" />}
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#030712] border border-[#1E293B] flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-slate-400 group-hover:text-sky-400 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <p className="font-bold text-slate-200 text-sm font-display tracking-wide">
                          {conv.customer_name || conv.customer_phone}
                        </p>
                        {conv.customer_name && (
                          <span className="text-xs text-slate-500 font-mono">{conv.customer_phone}</span>
                        )}
                        {conv.budget_generated && (
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono uppercase tracking-wider flex items-center gap-1">
                            <Zap className="w-3 h-3" /> Presupuesto
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-mono flex-shrink-0">
                        <Clock className="w-3 h-3" />
                        {conv.created_date ? format(new Date(conv.created_date), "d MMM · HH:mm", { locale: es }).toUpperCase() : '-'}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider font-mono ${statusColors[conv.status]}`}>
                        {statusLabels[conv.status]}
                      </span>
                      <span className="px-2 py-0.5 rounded border border-[#334155] bg-[#1E293B] text-slate-300 text-[10px] font-bold uppercase tracking-wider font-mono">
                        {typeLabels[conv.query_type] || conv.query_type}
                      </span>
                    </div>
                    
                    {conv.assigned_seller && (
                      <p className="text-xs text-slate-500 font-mono">
                        ASIGNADO A: <span className="font-bold text-sky-400">{conv.assigned_seller.toUpperCase()}</span>
                        {conv.assigned_branch && ` // ${conv.assigned_branch.toUpperCase()}`}
                      </p>
                    )}
                    {conv.summary && !conv.assigned_seller && (
                      <p className="text-xs text-slate-400 truncate mt-1 border-l-2 border-[#1E293B] pl-2">{conv.summary}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5 text-sky-500" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <CrmConversationDetail
          conversation={selected}
          sellers={sellers}
          onClose={() => setSelected(null)}
          onUpdated={(id, data) => {
            onUpdateConversation(id, data);
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}
