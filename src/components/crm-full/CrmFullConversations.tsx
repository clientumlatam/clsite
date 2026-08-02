import React, { useState } from 'react';
import { MessageSquare, User, Clock, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Conversation } from './crmTypes';

const statusColors: Record<string, string> = {
  activa: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  derivada: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  resuelta: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  cerrada: 'bg-slate-800 text-slate-400 border-slate-700',
};

const typeLabels: Record<string, string> = {
  precios: '💰 Precios',
  horarios: '🕐 Horarios',
  sucursales: '📍 Sucursales',
  derivacion: '👤 Derivación',
  reclamo: '⚠️ Reclamo',
  otro: '❓ Otro',
};

interface Props { conversations: Conversation[] }

export default function CrmFullConversations({ conversations }: Props) {
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = statusFilter === 'all'
    ? conversations
    : conversations.filter(c => c.status === statusFilter);

  const counts = {
    activa: conversations.filter(c => c.status === 'activa').length,
    derivada: conversations.filter(c => c.status === 'derivada').length,
    resuelta: conversations.filter(c => c.status === 'resuelta').length,
    cerrada: conversations.filter(c => c.status === 'cerrada').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 font-display tracking-wide flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-sky-400" />
            LOG DE TRANSMISIONES
          </h1>
          <p className="text-xs text-slate-500 font-mono tracking-wider uppercase">
            HISTORIAL DE CONSULTAS · {conversations.length} PAQUETES TOTALES
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 stagger-1 animate-slide-up">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded text-[10px] font-mono font-bold uppercase tracking-widest transition-all ${
            statusFilter === 'all' 
              ? 'bg-sky-500 text-white shadow-[0_0_10px_rgba(14,165,233,0.3)]' 
              : 'bg-[#1E293B] text-slate-400 hover:text-slate-200 hover:bg-[#2D3F5E] border border-[#334155]'
          }`}
        >
          TODAS [{conversations.length}]
        </button>
        {(Object.entries(counts) as [string, number][]).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded text-[10px] font-mono font-bold uppercase tracking-widest transition-all ${
              statusFilter === status 
                ? 'bg-sky-500 text-white shadow-[0_0_10px_rgba(14,165,233,0.3)]' 
                : 'bg-[#1E293B] text-slate-400 hover:text-slate-200 hover:bg-[#2D3F5E] border border-[#334155]'
            }`}
          >
            {status} [{count}]
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="cockpit-panel p-16 text-center stagger-2 animate-slide-up">
          <Filter className="w-12 h-12 text-[#1E293B] mx-auto mb-4" />
          <p className="text-slate-400 font-display tracking-wide uppercase">
            SIN REGISTROS {statusFilter !== 'all' ? `EN ESTADO "${statusFilter.toUpperCase()}"` : 'AÚN'}
          </p>
          <p className="text-xs text-slate-500 font-mono mt-2">LOS LOGS DEL BOT APARECERÁN AQUÍ AUTOMÁTICAMENTE.</p>
        </div>
      ) : (
        <div className="space-y-3 stagger-2 animate-slide-up">
          {filtered.map((conv, i) => (
            <div key={conv.id} className="cockpit-panel p-5 hover:bg-[#0f172a] transition-colors border-[#1E293B]/50 hover:border-[#334155]" style={{ animationDelay: `${i * 30}ms` }}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded bg-[#030712] border border-[#1E293B] flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-slate-500" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="font-bold text-slate-200 text-sm font-display tracking-wide uppercase">
                          {conv.customer_name || conv.customer_phone}
                        </p>
                        {conv.customer_name && (
                          <span className="text-xs text-slate-500 font-mono">{conv.customer_phone}</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider font-mono ${statusColors[conv.status]}`}>
                          {conv.status}
                        </span>
                        <span className="px-2 py-0.5 rounded border border-[#334155] bg-[#1E293B] text-slate-300 text-[10px] font-bold uppercase tracking-wider font-mono">
                          {typeLabels[conv.query_type] || conv.query_type}
                        </span>
                        {conv.channel === 'whatsapp' && (
                          <span className="px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider font-mono">
                            WHATSAPP
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono flex-shrink-0 bg-[#030712] px-2 py-1 rounded border border-[#1E293B]">
                      <Clock className="w-3 h-3 text-sky-500/50" />
                      {conv.created_date ? format(new Date(conv.created_date), "dd/MM/yyyy HH:mm:ss").toUpperCase() : '--/--/-- --:--:--'}
                    </div>
                  </div>
                  
                  {conv.summary && (
                    <div className="mt-3 bg-[#030712] border border-[#1E293B]/50 p-3 rounded text-xs text-slate-400 font-mono leading-relaxed">
                      <span className="text-sky-500/50 mr-2">{'>'}</span> {conv.summary}
                    </div>
                  )}
                  
                  {conv.assigned_seller && (
                    <p className="text-[10px] text-slate-500 font-mono mt-3 uppercase tracking-widest flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      ENRUTADO A: <span className="text-indigo-400 font-bold">{conv.assigned_seller}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
