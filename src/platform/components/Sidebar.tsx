import React from 'react';
import {
  MessageSquare,
  Columns3,
  Building,
  UtensilsCrossed,
  Store,
  Server,
  Palette,
  Megaphone,
  FileText,
  Bot,
  BarChart3,
  Settings,
  Users,
  Brain,
  ChevronRight,
  Layers,
  Link,
  CreditCard,
  Wifi,
  LayoutDashboard,
  Database,
  Cpu,
  ShieldAlert,
  Network,
  Building2,
  Sparkles
} from 'lucide-react';
import { Agent } from '../types';
import { isTaskOverdue } from '../lib/tasks';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  agents: Agent[];
  currentAgent: Agent;
  setCurrentAgent: (agent: Agent) => void;
  unreadCountTotal: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  agents,
  currentAgent,
  setCurrentAgent,
  unreadCountTotal
}) => {
  const overdueTasksCount = currentAgent.active_tasks?.filter(isTaskOverdue).length || 0;

  const navGroups = [
    {
      category: 'Control Plane ERPNext',
      items: [
        {
          id: 'dashboard',
          label: 'Panel de Telemetría',
          icon: LayoutDashboard,
        },
        {
          id: 'sites',
          label: 'Sitios ERPNext (Tenants)',
          icon: Link,
        },
        {
          id: 'backups',
          label: 'Bóveda Respaldos S3',
          icon: Database,
        },
        {
          id: 'cluster',
          label: 'Clúster K8s & Cuotas',
          icon: Server,
        },
        {
          id: 'benches',
          label: 'Nodos Bench & Workers',
          icon: Cpu,
        },
        {
          id: 'subscriptions',
          label: 'Facturación & Planes',
          icon: CreditCard,
        },
        {
          id: 'theme',
          label: 'SaaS Theme Engine',
          icon: Palette,
        },
      ],
    },
    {
      category: 'Atención & WhatsApp',
      items: [
        {
          id: 'inbox',
          label: 'Chats de WhatsApp',
          icon: MessageSquare,
          badge: unreadCountTotal > 0 ? unreadCountTotal : undefined,
          alertBadge: overdueTasksCount > 0 ? overdueTasksCount : undefined,
        },
        {
          id: 'contacts',
          label: 'Directorio Contactos',
          icon: Users,
        },
        {
          id: 'segments',
          label: 'Segmentación',
          icon: Layers,
        },
        {
          id: 'chatbot',
          label: 'Chatbot IA & Handover',
          icon: Bot,
        },
        {
          id: 'whatsapp',
          label: 'Baileys Gateway',
          icon: Wifi,
        },
      ],
    },
    {
      category: 'Ventas & Marketing',
      items: [
        {
          id: 'pipeline',
          label: 'Embudo Leads CRM',
          icon: Columns3,
        },
        {
          id: 'broadcasts',
          label: 'Difusiones Masivas',
          icon: Megaphone,
        },
        {
          id: 'templates',
          label: 'Plantillas Meta WABA',
          icon: FileText,
        },
        {
          id: 'automation',
          label: 'Automatizaciones',
          icon: Bot,
        },
      ],
    },
    {
      category: 'ERP & Comercio',
      items: [
        {
          id: 'erp',
          label: 'Clientum Sales Hub',
          icon: Building,
        },
        {
          id: 'restaurant',
          label: 'Restaurante & POS',
          icon: UtensilsCrossed,
        },
        {
          id: 'ecommerce',
          label: 'Tienda E-Commerce',
          icon: Store,
        },
      ],
    },
    {
      category: 'Equipos & Oficina Virtual',
      items: [
        {
          id: 'virtual-office',
          label: 'Oficina Virtual',
          icon: Building2,
        },
        {
          id: 'ai-agents',
          label: 'Agentes IA Control Plane',
          icon: Sparkles,
        },
      ],
    },
    {
      category: 'Inteligencia & Auditoría',
      items: [
        {
          id: 'analytics',
          label: 'Métricas & Analíticas',
          icon: BarChart3,
        },
        {
          id: 'knowledge',
          label: 'Base de Conocimiento',
          icon: Brain,
        },
        {
          id: 'logs',
          label: 'Auditoría (Audit Logs)',
          icon: ShieldAlert,
        },
        {
          id: 'blueprint',
          label: 'Arquitectura Clúster',
          icon: Network,
        },
        {
          id: 'settings',
          label: 'Configuración Global',
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <aside className="w-16 md:w-64 bg-slate-900 text-white flex flex-col justify-between shrink-0 select-none border-r border-slate-800">
      {/* Top Nav Items grouped */}
      <nav className="py-3 overflow-y-auto max-h-[calc(100vh-80px)] space-y-4">
        {navGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-6 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest hidden md:block">
              {group.category}
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 md:px-6 py-2 text-xs md:text-sm font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-green-400 md:border-r-4 border-green-500 font-semibold'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition ${
                        isActive ? 'text-green-400' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate hidden md:block">{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className="bg-green-500 text-slate-950 font-bold text-[10px] px-1.5 py-0.5 rounded-full shrink-0 hidden md:block">
                      {item.badge}
                    </span>
                  )}

                  {item.alertBadge !== undefined && (
                    <span className="bg-amber-500 text-slate-950 font-bold text-[10px] px-1.5 py-0.5 rounded-full shrink-0 hidden md:block">
                      ⚠️ {item.alertBadge}
                    </span>
                  )}

                  {(item.badge !== undefined || item.alertBadge !== undefined) && (
                    <span className={`md:hidden absolute top-1 right-1 w-2 h-2 rounded-full border border-slate-900 ${item.alertBadge ? 'bg-amber-500' : 'bg-green-500'}`}></span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom Agent Profile Switcher */}
      <div className="p-4 border-t border-slate-800 bg-slate-900">
        <div className="relative group">
          <div className="flex items-center justify-between p-2 rounded bg-slate-800 border border-slate-700/60">
            <div className="flex items-center space-x-3 min-w-0">
              <img
                src={currentAgent.avatar}
                alt={currentAgent.name}
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0 hidden md:block">
                <p className="text-xs font-medium text-slate-200 truncate">{currentAgent.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{currentAgent.role}</p>
              </div>
            </div>

            {/* Select dropdown */}
            <div className="hidden md:block">
              <select
                value={currentAgent.id}
                onChange={(e) => {
                  const selected = agents.find((a) => a.id === e.target.value);
                  if (selected) setCurrentAgent(selected);
                }}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                title="Switch Active Agent"
              >
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id} className="bg-slate-900 text-slate-200">
                    {agent.name} ({agent.role})
                  </option>
                ))}
              </select>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-200 transition" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
