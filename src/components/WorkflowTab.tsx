import React, { useState } from 'react';
import { ActiveTab } from '../types';
import {
  Settings, Server, ArrowLeftRight,
  Target, Building2, Users, ListOrdered,
  Compass, Kanban, ShieldCheck,
  Zap, FileText, FileSpreadsheet, Sparkles,
  Layout, FileCode, Send, Workflow, Bot,
  Search, Globe2, TrendingUp,
  LayoutDashboard, BarChart3, MessageSquareCode,
  ArrowDown, CheckCircle2, ChevronRight,
} from 'lucide-react';

// Lucide doesn't export SeoAutomationIcon — use Workflow alias
const WorkflowIcon = Workflow;

interface WorkflowTabProps {
  setActiveTab: (tab: ActiveTab) => void;
}

interface Step {
  id: ActiveTab;
  label: string;
  icon: React.ElementType;
  badge?: string;
  desc: string;
}

interface Phase {
  number: number;
  title: string;
  subtitle: string;
  color: string;          // Tailwind color key
  bg: string;
  border: string;
  badgeBg: string;
  badgeText: string;
  iconColor: string;
  steps: Step[];
}

const PHASES: Phase[] = [
  {
    number: 1,
    title: 'Configuración Inicial',
    subtitle: 'Prepará la plataforma antes de arrancar',
    color: 'slate',
    bg: 'bg-slate-800/60',
    border: 'border-slate-600',
    badgeBg: 'bg-slate-700',
    badgeText: 'text-slate-300',
    iconColor: 'text-slate-300',
    steps: [
      { id: 'settings',     label: 'Ajustes de Sistema',    icon: Settings,      desc: 'Nombre, moneda, zona horaria y preferencias' },
      { id: 'smtp',         label: 'Servidor SMTP / API',   icon: Server,        desc: 'Conectá tu proveedor de email y APIs externas' },
      { id: 'import_export',label: 'Importar / Exportar',  icon: ArrowLeftRight, desc: 'Cargá tus contactos y datos históricos' },
    ],
  },
  {
    number: 2,
    title: 'Conocer tu Audiencia',
    subtitle: 'Definí a quién le vendés y organizá tus contactos',
    color: 'indigo',
    bg: 'bg-indigo-900/30',
    border: 'border-indigo-600/60',
    badgeBg: 'bg-indigo-800/60',
    badgeText: 'text-indigo-300',
    iconColor: 'text-indigo-300',
    steps: [
      { id: 'icp_builder',  label: 'Perfil ICP & Personas',       icon: Target,    desc: 'Construí tu cliente ideal con IA' },
      { id: 'clients',      label: 'Fichero Clientes LATAM',       icon: Building2, desc: 'Base de empresas y cuentas clave' },
      { id: 'contacts',     label: 'Contactos y Destinatarios',    icon: Users,     desc: 'Personas, roles y datos de contacto' },
      { id: 'lists',        label: 'Listas y Segmentos',           icon: ListOrdered, desc: 'Segmentá por industria, tamaño y etapa' },
    ],
  },
  {
    number: 3,
    title: 'Prospección & Pipeline',
    subtitle: 'Encontrá nuevos clientes y gestioná el proceso de venta',
    color: 'emerald',
    bg: 'bg-emerald-900/25',
    border: 'border-emerald-600/60',
    badgeBg: 'bg-emerald-800/50',
    badgeText: 'text-emerald-300',
    iconColor: 'text-emerald-300',
    steps: [
      { id: 'geolocated_prospecting', label: 'Prospección Maps IA', icon: Compass,    badge: 'IA', desc: 'Descubrí negocios por zona y rubro' },
      { id: 'crm_kanban',             label: 'Pipeline Sales CRM',  icon: Kanban,     desc: 'Kanban drag & drop de oportunidades' },
      { id: 'meddic',                 label: 'Lead Scoring MEDDIC', icon: ShieldCheck, desc: 'Calificá leads con metodología MEDDIC' },
    ],
  },
  {
    number: 4,
    title: 'IA & Generación de Contenido',
    subtitle: 'Creá materiales de ventas y estrategias con inteligencia artificial',
    color: 'purple',
    bg: 'bg-purple-900/25',
    border: 'border-purple-600/60',
    badgeBg: 'bg-purple-800/50',
    badgeText: 'text-purple-300',
    iconColor: 'text-purple-300',
    steps: [
      { id: 'strategy',          label: 'Generador Estrategias', icon: Zap,           badge: 'Gemini', desc: 'Estrategias go-to-market con IA' },
      { id: 'copywriter',        label: 'AI Ad Copy Studio',      icon: FileText,      desc: 'Copys para anuncios, LinkedIn y email' },
      { id: 'brochure_generator',label: 'Generador Brochure PDF', icon: FileSpreadsheet, desc: 'PDFs personalizados por prospecto e industria' },
      { id: 'ai_hub',            label: 'Gemini AI & Voice Hub',  icon: Sparkles,      badge: 'Voice', desc: 'Hub central de agentes y voz IA' },
    ],
  },
  {
    number: 5,
    title: 'Campañas & Automatización',
    subtitle: 'Ejecutá outreach multicanal y automatizá secuencias de nurturing',
    color: 'amber',
    bg: 'bg-amber-900/25',
    border: 'border-amber-600/60',
    badgeBg: 'bg-amber-800/50',
    badgeText: 'text-amber-300',
    iconColor: 'text-amber-300',
    steps: [
      { id: 'email_template_builder', label: 'Diseñador Plantillas HTML', icon: Layout,    desc: 'Editor visual drag & drop de emails' },
      { id: 'templates',              label: 'Biblioteca Plantillas',     icon: FileCode,  desc: 'Plantillas reutilizables por etapa' },
      { id: 'email_campaigns',        label: 'Campañas Email',            icon: Send,      desc: 'Enviá y agendá campañas masivas' },
      { id: 'automations',            label: 'Flujos Automatizados',      icon: WorkflowIcon, desc: 'Secuencias de drip y triggers' },
      { id: 'outreach_agent',         label: 'Agente Outreach Auto',      icon: Bot,       desc: 'Agente SDR para WhatsApp automatizado' },
    ],
  },
  {
    number: 6,
    title: 'SEO & Contenidos',
    subtitle: 'Posicioná tu marca y generá tráfico orgánico consistente',
    color: 'cyan',
    bg: 'bg-cyan-900/25',
    border: 'border-cyan-600/60',
    badgeBg: 'bg-cyan-800/50',
    badgeText: 'text-cyan-300',
    iconColor: 'text-cyan-300',
    steps: [
      { id: 'keyword_research', label: 'Research de Keywords',    icon: Search,        desc: 'Encontrá las palabras clave de mayor valor' },
      { id: 'topic_map',        label: 'Mapa Autoridad Tópica',   icon: Globe2,        desc: 'Estructura de contenido por clusters' },
      { id: 'on_page_audit',    label: 'Auditoría On-Page',       icon: ShieldCheck,   desc: 'Detectá y corregí errores de SEO técnico' },
      { id: 'content_calendar', label: 'Calendario Editorial',    icon: ListOrdered,   desc: 'Planificá publicaciones y frecuencia' },
      { id: 'rank_tracker',     label: 'Rank Tracker Latam',      icon: TrendingUp,    desc: 'Monitoreá posiciones para keywords clave' },
      { id: 'seo_automation',   label: 'SEO Automations',         icon: WorkflowIcon,  desc: 'Automatizá tareas SEO recurrentes' },
    ],
  },
  {
    number: 7,
    title: 'Analytics & ROI',
    subtitle: 'Medí resultados, ajustá estrategias y escalá lo que funciona',
    color: 'indigo',
    bg: 'bg-indigo-900/30',
    border: 'border-indigo-500/60',
    badgeBg: 'bg-indigo-700/60',
    badgeText: 'text-indigo-200',
    iconColor: 'text-indigo-300',
    steps: [
      { id: 'overview',           label: 'Dashboard General',  icon: LayoutDashboard, desc: 'Vista ejecutiva del negocio en tiempo real' },
      { id: 'analytics_dashboard',label: 'Analytics & ROI',    icon: BarChart3,       badge: 'ROI', desc: 'Métricas de conversión, CAC y LTV' },
      { id: 'chat',               label: 'Asistente CMO IA',   icon: MessageSquareCode, desc: 'Consultá decisiones estratégicas con IA' },
    ],
  },
];

const colorMap: Record<string, { step: string; active: string; connector: string }> = {
  slate:  { step: 'border-slate-600 hover:border-slate-400 hover:bg-slate-700/60',  active: 'border-slate-400 bg-slate-700/80', connector: 'bg-slate-600' },
  indigo: { step: 'border-indigo-600/50 hover:border-indigo-400 hover:bg-indigo-900/40', active: 'border-indigo-400 bg-indigo-900/60', connector: 'bg-indigo-500' },
  emerald:{ step: 'border-emerald-600/50 hover:border-emerald-400 hover:bg-emerald-900/40', active: 'border-emerald-400 bg-emerald-900/60', connector: 'bg-emerald-500' },
  purple: { step: 'border-purple-600/50 hover:border-purple-400 hover:bg-purple-900/40', active: 'border-purple-400 bg-purple-900/60', connector: 'bg-purple-500' },
  amber:  { step: 'border-amber-600/50 hover:border-amber-400 hover:bg-amber-900/40', active: 'border-amber-400 bg-amber-900/60', connector: 'bg-amber-500' },
  cyan:   { step: 'border-cyan-600/50 hover:border-cyan-400 hover:bg-cyan-900/40', active: 'border-cyan-400 bg-cyan-900/60', connector: 'bg-cyan-500' },
};

export function WorkflowTab({ setActiveTab }: WorkflowTabProps) {
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);

  const handleStepClick = (id: ActiveTab) => {
    setActiveTab(id);
  };

  return (
    <div className="max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-1.5 text-xs font-semibold text-indigo-300 mb-4">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Secuencia recomendada de uso — de inicio a fin
        </div>
        <h1 className="text-2xl font-extrabold text-white mb-2 tracking-tight">
          Workflow Clientum CRM
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Seguí esta secuencia para sacar el máximo provecho de la plataforma.
          Hacé clic en cualquier paso para ir directamente al módulo.
        </p>
      </div>

      {/* Phases */}
      <div className="relative flex flex-col gap-0">
        {PHASES.map((phase, phaseIdx) => {
          const colors = colorMap[phase.color] ?? colorMap.indigo;
          const isLast = phaseIdx === PHASES.length - 1;

          return (
            <div key={phase.number} className="relative">
              {/* Phase Card */}
              <div className={`rounded-2xl border ${phase.border} ${phase.bg} backdrop-blur-sm overflow-hidden`}>
                {/* Phase Header */}
                <div className="flex items-center gap-4 px-5 py-4 border-b border-white/5">
                  <div className={`w-9 h-9 rounded-xl ${phase.badgeBg} flex items-center justify-center shrink-0 font-black text-sm ${phase.badgeText} border border-white/10`}>
                    {phase.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-bold text-white leading-tight">{phase.title}</h2>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">{phase.subtitle}</p>
                  </div>
                  <div className={`hidden sm:flex items-center gap-1 text-[10px] font-semibold ${phase.badgeText} ${phase.badgeBg} px-2.5 py-1 rounded-full border border-white/10`}>
                    <span>{phase.steps.length} módulos</span>
                  </div>
                </div>

                {/* Steps Grid */}
                <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
                  {phase.steps.map((step, stepIdx) => {
                    const Icon = step.icon;
                    const key = `${phase.number}-${step.id}`;
                    const isHovered = hoveredStep === key;

                    return (
                      <React.Fragment key={step.id}>
                        <button
                          onClick={() => handleStepClick(step.id)}
                          onMouseEnter={() => setHoveredStep(key)}
                          onMouseLeave={() => setHoveredStep(null)}
                          className={`group relative flex flex-col items-start gap-2 p-3 rounded-xl border transition-all duration-150 cursor-pointer text-left ${
                            isHovered ? colors.active : colors.step
                          } border-white/10`}
                        >
                          {/* Step number bubble */}
                          <div className={`absolute top-2 right-2 w-4 h-4 rounded-full ${phase.badgeBg} flex items-center justify-center text-[9px] font-bold ${phase.badgeText} opacity-60`}>
                            {stepIdx + 1}
                          </div>

                          <div className={`w-7 h-7 rounded-lg ${phase.badgeBg} flex items-center justify-center shrink-0`}>
                            <Icon className={`w-3.5 h-3.5 ${phase.iconColor}`} />
                          </div>

                          <div className="pr-4">
                            <div className="flex items-center gap-1 flex-wrap">
                              <span className="text-[11px] font-semibold text-white leading-tight">{step.label}</span>
                              {step.badge && (
                                <span className={`text-[8px] font-mono font-bold px-1 py-0.2 rounded ${phase.badgeBg} ${phase.badgeText} border border-white/10`}>
                                  {step.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed line-clamp-2">{step.desc}</p>
                          </div>

                          {/* Arrow on hover */}
                          <div className={`absolute bottom-2 right-2 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                            <ChevronRight className={`w-3 h-3 ${phase.iconColor}`} />
                          </div>
                        </button>

                        {/* Horizontal connector between steps (except last in row) */}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Vertical connector to next phase */}
              {!isLast && (
                <div className="flex flex-col items-center py-1.5 gap-0.5 my-0">
                  <div className={`w-0.5 h-4 ${colors.connector} opacity-60`} />
                  <ArrowDown className={`w-4 h-4 ${phase.iconColor} opacity-70`} />
                  <div className={`w-0.5 h-2 ${colorMap[PHASES[phaseIdx + 1].color]?.connector ?? 'bg-slate-600'} opacity-60`} />
                </div>
              )}
            </div>
          );
        })}

        {/* Final completion indicator */}
        <div className="mt-2 flex flex-col items-center gap-2">
          <div className="w-0.5 h-4 bg-emerald-500/60" />
          <div className="flex items-center gap-2.5 bg-emerald-900/30 border border-emerald-600/50 rounded-2xl px-5 py-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-sm font-bold text-emerald-300">¡CRM completamente operativo!</p>
              <p className="text-[11px] text-emerald-500 mt-0.5">Captás, calificás, cerrás y medís — todo desde un solo lugar.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
