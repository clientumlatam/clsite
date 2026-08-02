import React, { useState } from 'react';
import {
  Activity,
  X,
  FileCheck,
  UserCheck,
  Brain,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  Play,
  Filter,
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { ActivityStreamItem } from '../types';

interface ActivityStreamDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activities: ActivityStreamItem[];
  onTriggerMockAction?: () => void;
}

export const ActivityStreamDrawer: React.FC<ActivityStreamDrawerProps> = ({
  isOpen,
  onClose,
  activities,
  onTriggerMockAction
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');

  if (!isOpen) return null;

  const filteredActivities = activities.filter((act) => {
    if (filterType === 'ALL') return true;
    return act.actionType === filterType;
  });

  const getActionBadge = (type: ActivityStreamItem['actionType']) => {
    switch (type) {
      case 'ERP_INVOICE':
        return {
          icon: FileCheck,
          label: 'Factura ERPNext',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200'
        };
      case 'ERP_SALES_ORDER':
        return {
          icon: TrendingUp,
          label: 'Orden Venta ERP',
          color: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      case 'DELEGATION':
        return {
          icon: UserCheck,
          label: 'Delegación Agente',
          color: 'bg-purple-100 text-purple-800 border-purple-200'
        };
      case 'KNOWLEDGE_INDEX':
        return {
          icon: Brain,
          label: 'Búsqueda RAG AI',
          color: 'bg-amber-100 text-amber-800 border-amber-200'
        };
      case 'LEAD_STAGE':
        return {
          icon: Layers,
          label: 'Etapa CRM',
          color: 'bg-cyan-100 text-cyan-800 border-cyan-200'
        };
      case 'STORE_ORDER':
        return {
          icon: ShoppingBag,
          label: 'Pedido e-Commerce',
          color: 'bg-indigo-100 text-indigo-800 border-indigo-200'
        };
      default:
        return {
          icon: Activity,
          label: 'Acción de Sistema',
          color: 'bg-slate-100 text-slate-800 border-slate-200'
        };
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="relative">
              <Activity className="w-5 h-5 text-green-400" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Stream en Vivo de Acciones</h3>
              <p className="text-[11px] text-slate-400">Auditoría en tiempo real ERPNext & AI Copilot</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar & Actions */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700 flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Filtrar Eventos</span>
            </span>
            {onTriggerMockAction && (
              <button
                onClick={onTriggerMockAction}
                className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white font-extrabold rounded-lg transition flex items-center space-x-1 text-[11px]"
              >
                <Sparkles className="w-3 h-3" />
                <span>Simular Evento AI</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-[11px]">
            {[
              { id: 'ALL', label: 'Todos' },
              { id: 'ERP_INVOICE', label: 'Facturas' },
              { id: 'DELEGATION', label: 'Tareas' },
              { id: 'KNOWLEDGE_INDEX', label: 'RAG AI' },
              { id: 'LEAD_STAGE', label: 'CRM Stage' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-2.5 py-1 rounded-lg font-bold transition whitespace-nowrap ${
                  filterType === f.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Activity List */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3 divide-y divide-slate-100">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Activity className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-bold">No hay eventos en esta categoría</p>
            </div>
          ) : (
            filteredActivities.map((act) => {
              const badge = getActionBadge(act.actionType);
              const BadgeIcon = badge.icon;

              return (
                <div key={act.id} className="pt-3 first:pt-0 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <img
                        src={act.agentAvatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150'}
                        alt={act.agentName}
                        className="w-6 h-6 rounded-full object-cover border border-slate-200"
                      />
                      <span className="font-extrabold text-slate-900 text-xs">
                        {act.agentName}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-300" />
                      <span>{act.timeAgo} ({act.timestamp})</span>
                    </span>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border flex items-center space-x-1 ${badge.color}`}>
                        <BadgeIcon className="w-3 h-3" />
                        <span>{badge.label}</span>
                      </span>
                      <span className="text-[10px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-200 flex items-center space-x-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{act.status}</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-800 font-medium leading-relaxed">
                      {act.description}
                    </p>

                    {act.resourceId && (
                      <span className="inline-block text-[10px] font-mono font-bold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                        REF: {act.resourceId}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <span>{filteredActivities.length} eventos registrados</span>
          <span className="font-mono text-[10px] text-green-600 font-bold">● Stream Conectado (SSE)</span>
        </div>
      </div>
    </div>
  );
};
