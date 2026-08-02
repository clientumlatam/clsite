import React from 'react';
import { ActiveTab } from '../types';
import { ChevronRight, Home, Sparkles, Command } from 'lucide-react';

interface BreadcrumbsProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenCommandPalette?: () => void;
}

const tabCategoryMap: Record<ActiveTab, { category: string; label: string }> = {
  overview: { category: 'Growth & Core', label: 'Dashboard Principal' },
  analytics_dashboard: { category: 'Growth & Core', label: 'Analytics & ROI Dashboard' },
  geolocated_prospecting: { category: 'Growth & Core', label: 'Prospección Maps' },
  ai_hub: { category: 'Growth & Core', label: 'Gemini AI & Voice Hub' },
  meddic: { category: 'Growth & Core', label: 'MEDDIC Lead Scoring' },
  icp_builder: { category: 'Growth & Core', label: 'ICP & Persona Builder' },
  crm_kanban: { category: 'Growth & Core', label: 'CRM Sales Pipeline' },
  brochure_generator: { category: 'Growth & Core', label: 'Brochure PDF' },
  outreach_agent: { category: 'Growth & Core', label: 'Agente Outreach' },
  strategy: { category: 'Growth & Core', label: 'Estrategia IA' },
  copywriter: { category: 'Growth & Core', label: 'Ad Copy Studio' },
  seo: { category: 'Growth & Core', label: 'SEO & Contenidos' },
  clients: { category: 'Growth & Core', label: 'Clientes LATAM' },
  chat: { category: 'Growth & Core', label: 'Chat CMO IA' },

  contacts: { category: 'Email Marketing', label: 'Contactos' },
  lists: { category: 'Email Marketing', label: 'Listas y Etiquetas' },
  email_campaigns: { category: 'Email Marketing', label: 'Campañas Email' },
  templates: { category: 'Email Marketing', label: 'Plantillas Email' },
  email_template_builder: { category: 'Email Marketing', label: 'Constructor HTML' },
  automations: { category: 'Email Marketing', label: 'Automatizaciones' },
  import_export: { category: 'Email Marketing', label: 'Importar / Exportar' },
  smtp: { category: 'Email Marketing', label: 'Servidor SMTP' },
  settings: { category: 'Ajustes', label: 'Configuración' },

  keyword_research: { category: 'AI SEO & Tools', label: 'Investigación Keywords' },
  keyword_vault: { category: 'AI SEO & Tools', label: 'Keyword Vault' },
  topic_map: { category: 'AI SEO & Tools', label: 'Mapa Tópico' },
  on_page_audit: { category: 'AI SEO & Tools', label: 'Auditoría On-Page' },
  content_calendar: { category: 'AI SEO & Tools', label: 'Calendario SEO' },
  link_building: { category: 'AI SEO & Tools', label: 'Link Building' },
  rank_tracker: { category: 'AI SEO & Tools', label: 'Rank Tracker' },
  seo_automation: { category: 'AI SEO & Tools', label: 'SEO Automation' },
  public_website: { category: 'Portal Público', label: 'Sitio Web & Academia' },
};

export function Breadcrumbs({ activeTab, setActiveTab, onOpenCommandPalette }: BreadcrumbsProps) {
  const current = tabCategoryMap[activeTab] || { category: 'Módulo', label: activeTab };

  return (
    <nav className="flex items-center justify-between text-xs text-slate-500 mb-4 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xs">
      <div className="flex items-center space-x-2 min-w-0 overflow-x-auto custom-scrollbar">
        <button 
          onClick={() => setActiveTab('overview')}
          className="flex items-center space-x-1 text-slate-600 hover:text-indigo-600 font-medium transition-colors shrink-0"
        >
          <Home className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Inicio</span>
        </button>

        <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

        <span className="text-slate-400 font-medium shrink-0">{current.category}</span>

        <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

        <span className="text-indigo-600 dark:text-indigo-400 font-semibold truncate bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
          {current.label}
        </span>
      </div>

      {onOpenCommandPalette && (
        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center space-x-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ml-4 shrink-0 font-medium text-[11px]"
        >
          <Command className="w-3.5 h-3.5" />
          <span>Atajo de teclado <kbd className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-[10px]">⌘K</kbd></span>
        </button>
      )}
    </nav>
  );
}
