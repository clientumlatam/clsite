// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  Target, Mountain, MessagesSquare, Award, Megaphone, Zap, Activity,
  MessageSquare, Bot, Package, Users, Building2,
  FileText, PenTool, Settings2, Sparkles,
  Globe, Plug, Blocks, UserPlus, LogOut, Download,
  ChevronRight, LayoutDashboard, Network, Cpu, ChevronDown
} from 'lucide-react';

import CrmFullPipeline      from './CrmFullPipeline';
import CrmFullProducts      from './CrmFullProducts';
import CrmFullSellers       from './CrmFullSellers';
import CrmFullBranches      from './CrmFullBranches';
import CrmFullConversations from './CrmFullConversations';
import CrmFullBotConfig     from './CrmFullBotConfig';
import CrmFullConfig        from './CrmFullConfig';
import CrmFullLeads         from './CrmFullLeads';
import CrmFullGoogleMaps    from './CrmFullGoogleMaps';
import WpContenido          from './WpContenido';
import OrquestadorIA        from '../OrquestadorIA';
import WpModulos            from '../wordpress/WpModulos';
import WpSetup              from '../wordpress/WpSetup';
import AgentOSDashboard     from './AgentOSDashboard';
import OrganigramaClientum  from '../OrganigramaClientum';
import OrgVariantRoster     from '../OrgVariantRoster';
import OrgVariantLanes      from '../OrgVariantLanes';
import OrgVariantPipeline   from '../OrgVariantPipeline';
import OrgVariantRadial     from '../OrgVariantRadial';
import IcpBuilder           from './IcpBuilder';
import MeddicCalificacion   from './MeddicCalificacion';
import OutreachCampaigns    from './OutreachCampaigns';
import CreacionRapidaCRM    from './CreacionRapidaCRM';
import ActividadCRM         from './ActividadCRM';
import BrochureCRM          from './BrochureCRM';
import CopiloIAPanel        from './CopiloIAPanel';
import Propuestas           from './Propuestas';

import { Conversation, Seller, Branch, Product } from './crmTypes';
import { initialConversations, initialSellers, initialBranches, initialProducts } from './crmInitialData';

// ─── Types ─────────────────────────────────────────────────────────────────
type SubTab =
  | 'icp'      | 'maps'
  | 'crm'      | 'meddic'   | 'propuestas'
  | 'outreach' | 'rapida'   | 'actividad'
  | 'conversations' | 'bot'
  | 'brochure' | 'contenido' | 'copiloto'
  | 'products' | 'sellers'  | 'branches' | 'config'
  | 'wp_leads' | 'wp_config' | 'wp_modulos'
  | 'orquestador'
  | 'agent_control' | 'org_tree' | 'org_roster' | 'org_lanes' | 'org_pipeline' | 'org_radial';

type SectionId = 'growth_sales' | 'outreach_sec' | 'content_sec' | 'system_sec' | 'agente';

interface NavItem { id: SubTab; label: string; icon: React.ReactNode; desc?: string; }
interface Section { id: SectionId; label: string; icon: React.ReactNode; items: NavItem[]; }

// ─── Navigation structure ──────────────────────────────────────────────────
const SECTIONS: Section[] = [
  {
    id: 'growth_sales', label: 'Growth & Sales', icon: <Target className="w-4 h-4" />,
    items: [
      { id: 'icp',  label: 'ICP Builder',       icon: <Target className="w-4 h-4" />,   desc: 'Definí tu cliente ideal' },
      { id: 'maps', label: 'Patagonia Explorer', icon: <Mountain className="w-4 h-4" />, desc: 'Buscá leads reales' },
      { id: 'crm',       label: 'CRM Pipeline',        icon: <MessagesSquare className="w-4 h-4" />, desc: 'Gestión de oportunidades' },
      { id: 'meddic',    label: 'Score MEDDIC', icon: <Award className="w-4 h-4" />,          desc: 'Calificación de leads' },
      { id: 'propuestas',label: 'Propuestas',           icon: <FileText className="w-4 h-4" />,       desc: 'Propuestas comerciales' },
    ],
  },
  {
    id: 'outreach_sec', label: 'Outreach', icon: <Megaphone className="w-4 h-4" />,
    items: [
      { id: 'outreach', label: 'Campañas',       icon: <Megaphone className="w-4 h-4" />, desc: 'Outreach automatizado' },
      { id: 'rapida',   label: 'Creación Rápida',icon: <Zap className="w-4 h-4" />,       desc: 'Acción sobre leads' },
      { id: 'actividad',label: 'Actividad',      icon: <Activity className="w-4 h-4" />,  desc: 'Feed en tiempo real' },
      { id: 'conversations', label: 'Conversaciones', icon: <MessageSquare className="w-4 h-4" />, desc: 'Historial de chats' },
    ],
  },
  {
    id: 'content_sec', label: 'Content', icon: <PenTool className="w-4 h-4" />,
    items: [
      { id: 'brochure',  label: 'Brochure AI',    icon: <FileText className="w-4 h-4" />,  desc: 'Generador de brochures' },
      { id: 'contenido', label: 'Blog / Web',  icon: <PenTool className="w-4 h-4" />,   desc: 'Artículos WordPress' },
      { id: 'copiloto',  label: 'Copiloto IA', icon: <Sparkles className="w-4 h-4" />,  desc: 'Asistente de copy' },
      { id: 'bot',       label: 'Bot IA',      icon: <Bot className="w-4 h-4" />,       desc: 'Configuración de bot' },
    ],
  },
  {
    id: 'system_sec', label: 'System', icon: <Settings2 className="w-4 h-4" />,
    items: [
      { id: 'products',   label: 'Productos',        icon: <Package className="w-4 h-4" />,   desc: 'Catálogo de servicios' },
      { id: 'sellers',    label: 'Vendedores',        icon: <Users className="w-4 h-4" />,     desc: 'Equipo comercial' },
      { id: 'branches',   label: 'Sucursales',        icon: <Building2 className="w-4 h-4" />, desc: 'Puntos de venta' },
      { id: 'config',     label: 'Configuración',     icon: <Settings2 className="w-4 h-4" />, desc: 'Ajustes del CRM' },
      { id: 'wp_leads',   label: 'Leads WP',   icon: <UserPlus className="w-4 h-4" />,  desc: 'Leads del plugin' },
      { id: 'wp_config',  label: 'Plugin Setup',      icon: <Plug className="w-4 h-4" />,      desc: 'Instalación' },
      { id: 'wp_modulos', label: 'Módulos WP',icon: <Blocks className="w-4 h-4" />,    desc: 'AI Marketing Expert' },
    ],
  },
];

const AGENTE_SECTION: Section = {
  id: 'agente', label: 'Agente OS', icon: <Cpu className="w-4 h-4" />,
  items: [
    { id: 'orquestador',   label: 'Orquestador IA',    icon: <span className="text-base leading-none">🤖</span>, desc: 'Chat con el staff de agentes' },
    { id: 'agent_control', label: 'Centro de Control', icon: <LayoutDashboard className="w-4 h-4" />,           desc: 'Pipeline, tareas y costos del OS' },
    { id: 'org_tree',      label: 'Organigrama General',icon: <Network className="w-4 h-4" />,                  desc: 'Árbol completo de agentes' },
    { id: 'org_roster',    label: 'Roster de Agentes', icon: <Users className="w-4 h-4" />,                     desc: 'Grid de 14 agentes con filtros' },
    { id: 'org_lanes',     label: 'Swimlanes por Dept.',icon: <span className="text-sm leading-none">📊</span>, desc: 'Vista por departamento y estado' },
    { id: 'org_pipeline',  label: 'Pipeline Flow',     icon: <span className="text-sm leading-none">🔄</span>, desc: 'Flujo de valor extremo a extremo' },
    { id: 'org_radial',    label: 'Hub Radial',        icon: <span className="text-sm leading-none">🎯</span>, desc: 'Vista radial centrada en CEO' },
  ],
};

const ALL_SECTIONS = [...SECTIONS, AGENTE_SECTION];

function getSectionForTab(tab: SubTab): SectionId {
  for (const s of ALL_SECTIONS) {
    if (s.items.some(i => i.id === tab)) return s.id;
  }
  return 'agente';
}

// ─── State helpers ─────────────────────────────────────────────────────────
function loadOrDefault<T>(key: string, def: T): T {
  try { const s = localStorage.getItem(key); if (s) return JSON.parse(s) as T; } catch {}
  return def;
}

// ─── Component ─────────────────────────────────────────────────────────────
interface CrmFullAppProps {
  activeTabOverride?: SubTab;
  hideNav?: boolean;
}

export default function CrmFullApp({ activeTabOverride, hideNav = false }: CrmFullAppProps = {}) {
  const [internalActiveTab, setInternalActiveTab] = useState<SubTab>('icp');
  const activeTab = activeTabOverride ?? internalActiveTab;

  const [openSections, setOpenSections] = useState<Record<SectionId, boolean>>(() => {
    const initialActive = getSectionForTab(activeTabOverride ?? 'icp');
    const state = {} as Record<SectionId, boolean>;
    ALL_SECTIONS.forEach(s => state[s.id] = false);
    state[initialActive] = true;
    return state;
  });

  const setActiveTab = (t: SubTab) => {
    setInternalActiveTab(t);
  };

  const toggleSection = (sectionId: SectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Data state
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    loadOrDefault('clientum_crmfull_conversations', initialConversations));
  const [sellers, setSellers] = useState<Seller[]>(() => {
    const s = loadOrDefault('clientum_crmfull_sellers', initialSellers);
    return s.length > 0 ? s : initialSellers;
  });
  const [branches, setBranches] = useState<Branch[]>(() => {
    const s = loadOrDefault('clientum_crmfull_branches', initialBranches);
    return s.length > 0 ? s : initialBranches;
  });
  const [products, setProducts] = useState<Product[]>(() => {
    const s = loadOrDefault('clientum_crmfull_products', initialProducts);
    return s.length > 0 ? s : initialProducts;
  });

  useEffect(() => { localStorage.setItem('clientum_crmfull_conversations', JSON.stringify(conversations)); }, [conversations]);
  useEffect(() => { localStorage.setItem('clientum_crmfull_sellers',       JSON.stringify(sellers));       }, [sellers]);
  useEffect(() => { localStorage.setItem('clientum_crmfull_branches',      JSON.stringify(branches));      }, [branches]);
  useEffect(() => { localStorage.setItem('clientum_crmfull_products',      JSON.stringify(products));      }, [products]);

  const handleUpdateConversation = (id: string, data: Partial<Conversation>) =>
    setConversations(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  const handleSaveSeller  = (s: Seller)  => setSellers(prev =>  { const e = prev.find(x => x.id === s.id); return e ? prev.map(x => x.id === s.id ? s : x)  : [...prev, s];  });
  const handleSaveBranch  = (b: Branch)  => setBranches(prev => { const e = prev.find(x => x.id === b.id); return e ? prev.map(x => x.id === b.id ? b : x)  : [...prev, b];  });
  const handleSaveProduct = (p: Product) => setProducts(prev =>  { const e = prev.find(x => x.id === p.id); return e ? prev.map(x => x.id === p.id ? p : x) : [...prev, p]; });

  const renderContent = () => {
    switch (activeTab) {
      case 'icp':           return <IcpBuilder />;
      case 'maps':          return <CrmFullGoogleMaps />;
      case 'crm':           return <CrmFullPipeline conversations={conversations} sellers={sellers} onUpdateConversation={handleUpdateConversation} />;
      case 'meddic':        return <MeddicCalificacion />;
      case 'outreach':      return <OutreachCampaigns />;
      case 'propuestas':    return <Propuestas />;
      case 'rapida':        return <CreacionRapidaCRM />;
      case 'actividad':     return <ActividadCRM />;
      case 'conversations': return <CrmFullConversations conversations={conversations} />;
      case 'bot':           return <CrmFullBotConfig />;
      case 'products':      return <CrmFullProducts products={products} onSave={handleSaveProduct} />;
      case 'sellers':       return <CrmFullSellers sellers={sellers} onSave={handleSaveSeller} />;
      case 'branches':      return <CrmFullBranches branches={branches} onSave={handleSaveBranch} />;
      case 'brochure':      return <BrochureCRM />;
      case 'contenido':     return <WpContenido />;
      case 'config':        return <CrmFullConfig />;
      case 'copiloto':      return <CopiloIAPanel />;
      case 'wp_leads':      return <CrmFullLeads />;
      case 'wp_config':     return <WpSetup />;
      case 'wp_modulos':    return <WpModulos />;
      case 'orquestador':   return <OrquestadorIA />;
      case 'agent_control': return <AgentOSDashboard />;
      case 'org_tree':      return <OrganigramaClientum />;
      case 'org_roster':    return <OrgVariantRoster />;
      case 'org_lanes':     return <OrgVariantLanes />;
      case 'org_pipeline':  return <OrgVariantPipeline />;
      case 'org_radial':    return <OrgVariantRadial />;
      default:              return null;
    }
  };

  const currentSection = ALL_SECTIONS.find(s => s.items.some(i => i.id === activeTab)) ?? ALL_SECTIONS[0];
  const currentItem = currentSection.items.find(i => i.id === activeTab) ?? currentSection.items[0];

  if (hideNav) {
    return (
      <div className="h-screen overflow-y-auto bg-[#060b14]">
        <div className={`mx-auto px-5 py-6 ${activeTab === 'orquestador' ? 'h-full max-w-5xl' : 'max-w-[1400px]'}`}>
          {renderContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#060b14] font-sans">

      {/* ── TOP BAR ──────────────────────────────────────────────────────── */}
      <header className="flex-shrink-0 h-12 bg-[#08111e] border-b border-[#1A3461]/50 flex items-center gap-0 px-0 z-20 justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-full border-[#1A3461]/40 flex-shrink-0 min-w-[200px]">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
               style={{ background: 'linear-gradient(135deg,#1A3461,#254f8f)' }}>
            <Target className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-black text-white uppercase tracking-tight leading-none">Clientum</div>
            <div className="text-[10px] font-semibold text-[#10B981] leading-none mt-0.5">AI Sales OS</div>
          </div>
          <span className="ml-1 text-[8px] bg-[#1A3461]/80 text-[#10B981] border border-[#10B981]/30 px-1.5 py-0.5 rounded font-bold tracking-wider flex-shrink-0">PRO</span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 px-3 flex-shrink-0 h-full border-l border-[#1A3461]/40">
          <button
            onClick={() => setActiveTab('orquestador')}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-[#10B981] border border-[#1A3461]/50 hover:border-[#10B981]/40 px-2.5 py-1.5 rounded-lg transition-all hover:bg-[#10B981]/5"
          >
            <Bot className="w-3 h-3" /> Asistente IA
          </button>
          <button className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-slate-200 border border-[#1A3461]/50 px-2.5 py-1.5 rounded-lg hover:bg-[#1A3461]/20 transition-all">
            <Download className="w-3 h-3" /> Exportar CSV
          </button>
          <div className="w-px h-5 bg-[#1A3461]/40" />
          <button
            onClick={() => { window.location.href = '/'; }}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-rose-400 border border-transparent hover:border-rose-500/20 px-2.5 py-1.5 rounded-lg hover:bg-rose-500/5 transition-all"
          >
            <LogOut className="w-3 h-3" /> Salir
          </button>
        </div>
      </header>

      {/* ── BODY (sidebar + content) ──────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT SIDEBAR ───────────────────────────────────────────────── */}
        <aside className="w-[260px] flex-shrink-0 bg-[#07101b] border-r border-[#1A3461]/40 flex flex-col overflow-hidden">

          {/* Sub-items with Accordions */}
          <nav className="flex-1 overflow-y-auto py-3 scrollbar-none custom-scrollbar">
            {ALL_SECTIONS.map(section => {
              const isOpen = openSections[section.id];
              const hasActiveChild = section.items.some(item => activeTab === item.id);
              
              return (
                <div key={section.id} className="mb-2">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between px-4 py-2 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`${hasActiveChild ? 'text-[#10B981]' : 'text-slate-500'} group-hover:text-slate-300 transition-colors`}>
                        {section.icon}
                      </span>
                      <span className={`text-[11px] font-black uppercase tracking-widest ${hasActiveChild ? 'text-white' : 'text-slate-400'} group-hover:text-white transition-colors`}>
                        {section.label}
                      </span>
                    </div>
                    {isOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                    )}
                  </button>
                  
                  {isOpen && (
                    <div className="mt-1 space-y-0.5">
                      {section.items.map(item => {
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-start gap-3 pl-10 pr-3 py-2 text-left transition-all duration-150 relative ${
                              isActive
                                ? 'bg-[#1A3461]/40 text-white font-semibold'
                                : 'text-slate-500 hover:text-slate-200 hover:bg-[#1A3461]/20'
                            }`}
                          >
                            {isActive && (
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#10B981] rounded-r-md" />
                            )}
                            <span className={`flex-shrink-0 mt-0.5 ${isActive ? 'text-[#10B981]' : 'text-slate-600'}`}>
                              {item.icon}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className={`text-[12px] leading-tight ${isActive ? '' : 'font-medium'}`}>
                                {item.label}
                              </div>
                              {item.desc && (
                                <div className={`text-[10px] leading-snug mt-0.5 truncate ${isActive ? 'text-[#10B981]/80' : 'text-slate-600'}`}>
                                  {item.desc}
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Bottom: current item breadcrumb */}
          <div className="border-t border-[#1A3461]/40 px-4 py-3 flex-shrink-0 bg-[#08111e]/50">
            <div className="flex items-center gap-2 text-[11px] text-slate-600">
              <span className="text-[#10B981]">{currentSection.icon}</span>
              <span className="text-slate-300 font-bold truncate">{currentSection.label}</span>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span className="text-slate-400 font-medium truncate">{currentItem.label}</span>
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT ───────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto bg-[#060b14]">
          <div className={`mx-auto px-5 py-6 ${activeTab === 'orquestador' ? 'h-full max-w-5xl' : 'max-w-[1400px]'}`}>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
