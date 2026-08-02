import React, { useState } from 'react';
import { Activity, MessageCircle, UserPlus, TrendingUp, CheckCircle2, Bot, MapPin, Mail, Filter, RefreshCw } from 'lucide-react';

type ActivityType = 'lead' | 'mensaje' | 'pipeline' | 'bot' | 'prospector' | 'email';

interface CRMActivity {
  id: string; type: ActivityType; actor: string; action: string;
  detail: string; time: string; ago: string;
}

const TYPE_CONFIG: Record<ActivityType, { icon: React.ReactNode; color: string; bg: string }> = {
  lead:       { icon: <UserPlus className="w-3.5 h-3.5" />,     color: 'text-blue-400',    bg: 'bg-blue-400/10' },
  mensaje:    { icon: <MessageCircle className="w-3.5 h-3.5" />,color: 'text-[#10B981]',   bg: 'bg-[#10B981]/10' },
  pipeline:   { icon: <TrendingUp className="w-3.5 h-3.5" />,   color: 'text-violet-400',  bg: 'bg-violet-400/10' },
  bot:        { icon: <Bot className="w-3.5 h-3.5" />,           color: 'text-amber-400',   bg: 'bg-amber-400/10' },
  prospector: { icon: <MapPin className="w-3.5 h-3.5" />,        color: 'text-sky-400',     bg: 'bg-sky-400/10' },
  email:      { icon: <Mail className="w-3.5 h-3.5" />,          color: 'text-rose-400',    bg: 'bg-rose-400/10' },
};

const ACTIVITIES: CRMActivity[] = [
  { id: '1',  type: 'lead',       actor: 'Chatbot WordPress', action: 'Nuevo lead capturado', detail: 'Marcos Díaz — Ferretería del Centro, Neuquén', time: '10:42', ago: 'Hace 3 min' },
  { id: '2',  type: 'mensaje',    actor: 'Santi SDR',         action: 'WhatsApp enviado',      detail: 'Follow-up a Laura Sosa (Clínica del Valle)', time: '10:38', ago: 'Hace 7 min' },
  { id: '3',  type: 'pipeline',   actor: 'Equipo comercial',  action: 'Deal avanzado',          detail: 'Distribuidora Andina → Propuesta enviada ($180K)', time: '10:21', ago: 'Hace 24 min' },
  { id: '4',  type: 'bot',        actor: 'Orquestador IA',    action: 'Reporte generado',       detail: 'Reporte ejecutivo semanal enviado al equipo', time: '10:00', ago: 'Hace 45 min' },
  { id: '5',  type: 'prospector', actor: 'Explorador Patagónico', action: 'Búsqueda completada', detail: '12 nuevas ferreterías encontradas en Neuquén Capital', time: '09:55', ago: 'Hace 50 min' },
  { id: '6',  type: 'email',      actor: 'AI Marketing Expert', action: 'Campaña enviada',     detail: 'Newsletter julio → 48 suscriptores (apertura 32%)', time: '09:30', ago: 'Hace 1h 15min' },
  { id: '7',  type: 'lead',       actor: 'Patagonia Explorer', action: 'Lead importado al CRM', detail: 'Carlos Vega — Ferretería Centro SRL (score: 87)', time: '09:15', ago: 'Hace 1h 30min' },
  { id: '8',  type: 'mensaje',    actor: 'Santi SDR',          action: 'Respuesta recibida',    detail: 'Diego Romero respondió: "Sí, me interesa, ¿cuándo podemos hablar?"', time: '08:52', ago: 'Hace 1h 53min' },
  { id: '9',  type: 'pipeline',   actor: 'Equipo comercial',   action: 'Deal cerrado ✓',        detail: 'Clínica del Sur → Cliente activo ($120K/mes)', time: '08:30', ago: 'Hace 2h 15min' },
  { id: '10', type: 'bot',        actor: 'Chatbot IA',         action: 'Consulta resuelta',     detail: 'Visitante consultó sobre precios y fue derivado a ventas', time: '07:45', ago: 'Hace 3h' },
  { id: '11', type: 'prospector', actor: 'Explorador Patagónico', action: 'Enriquecimiento completo', detail: '8 leads enriquecidos con email vía Hunter.io', time: 'Ayer 18:20', ago: 'Ayer' },
  { id: '12', type: 'email',      actor: 'SEO & Contenido',    action: 'Post publicado',        detail: '"CRM para distribuidoras: guía completa" — WordPress', time: 'Ayer 16:00', ago: 'Ayer' },
];

const FILTER_TYPES: { id: ActivityType | 'all'; label: string }[] = [
  { id: 'all', label: 'Todo' },
  { id: 'lead', label: 'Leads' },
  { id: 'mensaje', label: 'Mensajes' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'bot', label: 'Bots IA' },
  { id: 'prospector', label: 'Prospector' },
  { id: 'email', label: 'Email' },
];

export default function ActividadCRM() {
  const [filter, setFilter] = useState<ActivityType | 'all'>('all');

  const filtered = filter === 'all' ? ACTIVITIES : ACTIVITIES.filter(a => a.type === filter);

  return (
    <div className="space-y-6 text-slate-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-9 h-9 bg-sky-400/15 border border-sky-400/30 rounded-xl flex items-center justify-center">
            <Activity className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">Actividad</h1>
            <p className="text-slate-400 text-sm mt-1">Feed en tiempo real de todas las acciones del sistema CRM y agentes IA.</p>
          </div>
        </div>
        <button className="w-8 h-8 rounded-lg bg-[#1E293B] hover:bg-slate-700 flex items-center justify-center text-slate-400 transition-all flex-shrink-0">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Summary pills */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {Object.entries(TYPE_CONFIG).map(([type, cfg]) => {
          const count = ACTIVITIES.filter(a => a.type === type).length;
          return (
            <div key={type} className={`${cfg.bg} border border-[#1E293B] rounded-lg p-2.5 text-center`}>
              <div className={`flex justify-center mb-1 ${cfg.color}`}>{cfg.icon}</div>
              <div className="text-lg font-black text-white">{count}</div>
              <div className="text-[10px] text-slate-500 capitalize">{type}</div>
            </div>
          );
        })}
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
        {FILTER_TYPES.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id as ActivityType | 'all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              filter === f.id ? 'bg-[#10B981]/15 border-[#10B981]/40 text-[#10B981]' : 'border-[#1E293B] text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-[22px] top-0 bottom-0 w-px bg-[#1E293B]" />
        <div className="space-y-1">
          {filtered.map((act, idx) => {
            const cfg = TYPE_CONFIG[act.type];
            const isNewDay = idx > 0 && filtered[idx - 1].ago !== act.ago && act.ago === 'Ayer';
            return (
              <React.Fragment key={act.id}>
                {isNewDay && (
                  <div className="flex items-center gap-3 py-2 pl-12">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ayer</div>
                    <div className="flex-1 h-px bg-[#1E293B]" />
                  </div>
                )}
                <div className="flex gap-4 py-2.5 group">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg} border border-[#1E293B] relative z-10`}>
                    <span className={cfg.color}>{cfg.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0 bg-[#0D1424] border border-[#1E293B] rounded-xl px-4 py-3 group-hover:border-slate-700 transition-all">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[10px] font-bold ${cfg.color}`}>{act.actor}</span>
                          <span className="text-[10px] text-slate-600">·</span>
                          <span className="text-xs font-semibold text-slate-300">{act.action}</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed truncate">{act.detail}</p>
                      </div>
                      <span className="text-[10px] text-slate-600 flex-shrink-0 mt-0.5">{act.time}</span>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
