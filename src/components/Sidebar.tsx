import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { 
  LayoutDashboard, 
  Sparkles, 
  FileText, 
  Search, 
  Users, 
  MessageSquareCode, 
  Globe2,
  TrendingUp,
  ShieldCheck,
  ListOrdered,
  Send,
  FileCode,
  Workflow,
  ArrowLeftRight,
  Server,
  Settings,
  Target,
  Kanban,
  Layout,
  Compass,
  BarChart3,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Bot,
  Mail,
  Zap,
  Building2,
  FileSpreadsheet
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

interface NavGroup {
  key: string;
  title: string;
  color: string;
  badge?: string;
  items: {
    id: ActiveTab;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }[];
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    core: true,
    sales: true,
    ai_agents: true,
    email: false,
    seo: false,
    system: false
  });

  const toggleSection = (section: string) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setOpenSections({ [section]: true });
    } else {
      setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    }
  };

  const navGroups: NavGroup[] = [
    {
      key: 'core',
      title: 'Principal & Analytics',
      color: 'indigo',
      items: [
        { id: 'overview', label: 'Dashboard General', icon: LayoutDashboard },
        { id: 'analytics_dashboard', label: 'Analytics & ROI', icon: BarChart3, badge: 'ROI' },
        { id: 'chat', label: 'Asistente CMO IA', icon: MessageSquareCode },
      ]
    },
    {
      key: 'sales',
      title: 'Ventas & Prospección',
      color: 'emerald',
      badge: 'Core CRM',
      items: [
        { id: 'geolocated_prospecting', label: 'Prospección Maps IA', icon: Compass, badge: 'IA' },
        { id: 'crm_kanban', label: 'Pipeline Sales CRM', icon: Kanban },
        { id: 'meddic', label: 'Lead Scoring MEDDIC', icon: ShieldCheck },
        { id: 'icp_builder', label: 'Perfil ICP & Personas', icon: Target },
        { id: 'clients', label: 'Fichero Clientes LATAM', icon: Building2 },
      ]
    },
    {
      key: 'ai_agents',
      title: 'IA Hub & Agentes',
      color: 'purple',
      badge: 'Gemini 2.5',
      items: [
        { id: 'ai_hub', label: 'Gemini AI & Voice Hub', icon: Sparkles, badge: 'Voice' },
        { id: 'outreach_agent', label: 'Agente Outreach Auto', icon: Bot },
        { id: 'strategy', label: 'Generador Estrategias', icon: Zap },
        { id: 'copywriter', label: 'AI Ad Copy Studio', icon: FileText },
        { id: 'brochure_generator', label: 'Generador Brochure PDF', icon: FileSpreadsheet },
      ]
    },
    {
      key: 'email',
      title: 'Email Marketing & Drip',
      color: 'amber',
      items: [
        { id: 'email_campaigns', label: 'Campañas Email', icon: Send },
        { id: 'automations', label: 'Flujos Automatizados', icon: Workflow },
        { id: 'contacts', label: 'Contactos y Destinatarios', icon: Users },
        { id: 'lists', label: 'Listas y Segmentos', icon: ListOrdered },
        { id: 'email_template_builder', label: 'Diseñador Plantillas HTML', icon: Layout },
        { id: 'templates', label: 'Biblioteca Plantillas', icon: FileCode },
      ]
    },
    {
      key: 'seo',
      title: 'Suite SEO & Contenidos',
      color: 'cyan',
      items: [
        { id: 'seo', label: 'Visión General SEO', icon: Search },
        { id: 'keyword_research', label: 'Research de Keywords', icon: Search },
        { id: 'topic_map', label: 'Mapa Autoridad Tópica', icon: Globe2 },
        { id: 'on_page_audit', label: 'Auditoría On-Page', icon: ShieldCheck },
        { id: 'content_calendar', label: 'Calendario Editorial', icon: ListOrdered },
        { id: 'rank_tracker', label: 'Rank Tracker Latam', icon: TrendingUp },
        { id: 'seo_automation', label: 'SEO Automations', icon: Workflow },
      ]
    },
    {
      key: 'system',
      title: 'Configuración & Datos',
      color: 'slate',
      items: [
        { id: 'import_export', label: 'Importar / Exportar', icon: ArrowLeftRight },
        { id: 'smtp', label: 'Servidor SMTP / API', icon: Server },
        { id: 'settings', label: 'Ajustes de Sistema', icon: Settings },
      ]
    }
  ];

  const colorStylesMap: Record<string, { bg: string; text: string; border: string; iconBg: string }> = {
    indigo: { bg: 'bg-indigo-500/15', text: 'text-indigo-300 font-semibold', border: 'border-l-indigo-500', iconBg: 'text-indigo-400' },
    emerald: { bg: 'bg-emerald-500/15', text: 'text-emerald-300 font-semibold', border: 'border-l-emerald-500', iconBg: 'text-emerald-400' },
    purple: { bg: 'bg-purple-500/15', text: 'text-purple-300 font-semibold', border: 'border-l-purple-500', iconBg: 'text-purple-400' },
    amber: { bg: 'bg-amber-500/15', text: 'text-amber-300 font-semibold', border: 'border-l-amber-500', iconBg: 'text-amber-400' },
    cyan: { bg: 'bg-cyan-500/15', text: 'text-cyan-300 font-semibold', border: 'border-l-cyan-500', iconBg: 'text-cyan-400' },
    slate: { bg: 'bg-slate-700/50', text: 'text-slate-200 font-semibold', border: 'border-l-slate-400', iconBg: 'text-slate-300' },
  };

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-72'} bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 shrink-0 hidden md:flex transition-all duration-300 select-none`}>
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 h-[72px] flex items-center justify-between">
        <div className={`flex items-center space-x-3 overflow-hidden ${isCollapsed ? 'justify-center w-full' : ''}`}>
          <div className="w-10 h-10 rounded-xl bg-[#0A2558] overflow-hidden flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0 border border-slate-700/50">
            <img src="/favicon.svg" alt="Clientum Logo" className="w-8 h-8" referrerPolicy="no-referrer" />
          </div>
          {!isCollapsed && (
            <div className="whitespace-nowrap">
              <h1 className="font-bold text-base tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                ClientumLatam
              </h1>
              <p className="text-[10px] text-indigo-400 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> CRM & AI Marketing
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Access Buttons */}
      <div className={`p-3 border-b border-slate-800/60 bg-slate-950/25 flex flex-col gap-2 ${isCollapsed ? 'px-2' : 'px-3'}`}>
        <button
          onClick={() => setActiveTab('workflow')}
          className={`w-full flex items-center gap-2.5 py-2 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'workflow'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300'
          } ${isCollapsed ? 'justify-center' : ''}`}
          title="Workflow — Secuencia de uso inicio a fin"
        >
          <Workflow className={`w-4 h-4 ${activeTab === 'workflow' ? 'text-white' : 'text-emerald-400'}`} />
          {!isCollapsed && <span className="text-xs font-bold font-sans">Workflow de Inicio a Fin</span>}
        </button>
        <button
          onClick={() => setActiveTab('public_website')}
          className={`w-full flex items-center gap-2.5 py-2 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'public_website'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300'
          } ${isCollapsed ? 'justify-center' : ''}`}
          title="Ver Sitio Web Público & LMS Academia"
        >
          <Globe2 className={`w-4 h-4 ${activeTab === 'public_website' ? 'text-white' : 'text-indigo-400 animate-pulse'}`} />
          {!isCollapsed && <span className="text-xs font-bold font-sans">Sitio Web & LMS Academia</span>}
        </button>
      </div>

      {/* Navigation Sections */}
      <nav className={`flex-1 ${isCollapsed ? 'px-2' : 'px-3'} py-4 overflow-y-auto custom-scrollbar space-y-3`}>
        {navGroups.map((group) => {
          const isOpen = openSections[group.key];
          const style = colorStylesMap[group.color] || colorStylesMap.indigo;
          const hasActiveChild = group.items.some(item => item.id === activeTab);

          return (
            <div key={group.key} className="rounded-xl bg-slate-800/30 border border-slate-800/60 p-1">
              {!isCollapsed ? (
                <button 
                  onClick={() => toggleSection(group.key)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors rounded-lg ${
                    hasActiveChild ? 'text-indigo-300 bg-slate-800/60' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{group.title}</span>
                    {group.badge && (
                      <span className="text-[9px] lowercase font-semibold px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {group.badge}
                      </span>
                    )}
                  </div>
                  {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              ) : (
                <div className="h-1" />
              )}

              {(isOpen || isCollapsed) && (
                <div className="mt-1 space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        title={isCollapsed ? item.label : undefined}
                        className={`w-full flex items-center justify-between ${
                          isCollapsed ? 'justify-center px-0' : 'px-2.5'
                        } py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                          isActive
                            ? `${style.bg} ${style.text} border-l-3 ${style.border} shadow-2xs`
                            : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200 border-l-3 border-transparent'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 truncate">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? style.iconBg : 'text-slate-400'}`} />
                          {!isCollapsed && <span className="truncate">{item.label}</span>}
                        </div>
                        {!isCollapsed && item.badge && (
                          <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                            isActive ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-700 text-slate-300'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 flex flex-col gap-2 bg-slate-900/90">
        {!isCollapsed && (
          <div className="bg-slate-800/70 rounded-xl p-2.5 border border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-[11px] text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span className="truncate">Motor Gemini 2.5 Activo</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`flex items-center text-slate-400 hover:text-white transition-colors py-1 ${
            isCollapsed ? 'justify-center w-full' : 'justify-between px-2 text-xs font-semibold'
          }`}
        >
          {!isCollapsed && <span>Plegar Menú</span>}
          {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}


