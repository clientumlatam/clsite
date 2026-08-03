import React from 'react';
import { ActiveTab } from '../types';
import { Globe2, ChevronDown, Bell, Search, Sparkles, Menu } from 'lucide-react';
import { AuthButton } from './AuthButton';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currency: string;
  setCurrency: (curr: string) => void;
  region: string;
  setRegion: (reg: string) => void;
  onOpenCommandPalette?: () => void;
}

export function Header({ activeTab, setActiveTab, currency, setCurrency, region, setRegion, onOpenCommandPalette }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const tabTitles: Record<ActiveTab, { title: string; subtitle: string }> = {
    overview: { title: 'Marketing Dashboard', subtitle: 'Real-time performance across LATAM markets' },
    strategy: { title: 'AI Strategy Generator', subtitle: 'Automated multi-channel campaign planner powered by Gemini' },
    copywriter: { title: 'AI Ad Copy Studio', subtitle: 'High-converting ad copy & creative asset prompts' },
    seo: { title: 'AI SEO & Content Audit', subtitle: 'Organic keyword opportunities and on-page optimization' },
    clients: { title: 'LATAM Clients CRM', subtitle: 'Manage regional accounts, budgets, and campaigns' },
    chat: { title: 'AI CMO Chat Advisor', subtitle: 'Your 24/7 expert marketing consultant' },
    contacts: { title: 'Email Contacts', subtitle: 'Manage subscriber databases, tags, and audience health' },
    lists: { title: 'Lists & Tags', subtitle: 'Segment audiences for targeted email sequences' },
    email_campaigns: { title: 'Email Campaigns', subtitle: 'Broadcast newsletters, promotional offers, and digests' },
    templates: { title: 'Email Templates & AI Generator', subtitle: 'Design high-converting HTML emails with Gemini' },
    automations: { title: 'Automations & Drip Flows', subtitle: 'Automated welcome series, abandoned cart, and re-engagement' },
    import_export: { title: 'Import / Export Subscribers', subtitle: 'CSV upload & audience data portability' },
    smtp: { title: 'SMTP Configuration', subtitle: 'Connect SendGrid, Amazon SES, or custom SMTP servers' },
    settings: { title: 'Ajustes de Plataforma', subtitle: 'Gestioná claves de API, dominios de remitente y accesos de equipo' },
    keyword_research: { title: 'AI Keyword Research', subtitle: 'Discover high-intent search volumes across LATAM markets' },
    keyword_vault: { title: 'Keyword Vault', subtitle: 'Manage and monitor your target keyword portfolio' },
    topic_map: { title: 'Topical Authority Map', subtitle: 'Semantic clustering and pillar-cluster architecture' },
    on_page_audit: { title: 'On-Page SEO & Technical Audit', subtitle: 'Analyze meta tags, page speed, and schema markup' },
    content_calendar: { title: 'SEO Content Calendar', subtitle: 'Plan and schedule AI-optimized blog posts' },
    link_building: { title: 'AI Link Building & Outreach', subtitle: 'Monitor backlinks and automate outreach campaigns' },
    rank_tracker: { title: 'Rank Tracker', subtitle: 'Track daily SERP rankings across regional search engines' },
    seo_automation: { title: 'SEO Automations & Workflows', subtitle: 'Configure automated SEO maintenance and reporting' },
    ai_hub: { title: 'Gemini AI & Voice Hub', subtitle: 'Grounding, High Thinking, Live Voice API, & Database Cloud Sync' },
    meddic: { title: 'MEDDIC Lead Scoring', subtitle: 'Evaluate Enterprise B2B deals across Metrics, Economic Buyer, and Decision Process' },
    icp_builder: { title: 'Ideal Customer Profile (ICP) Builder', subtitle: 'Generate target firmographics and demographics with Gemini AI' },
    crm_kanban: { title: 'CRM Sales Pipeline', subtitle: 'Kanban board for drag-and-drop lead and deal management' },
    email_template_builder: { title: 'HTML Email Template Builder', subtitle: 'Drag-and-drop modular email layouts with dynamic variable placeholders' },
    geolocated_prospecting: { title: 'Geolocated Prospecting & AI', subtitle: 'Scrape Google Maps by region/category, enrich with Gemini AI, and execute multi-channel outreach' },
    analytics_dashboard: { title: 'Analytics & ROI Dashboard', subtitle: 'Real-time performance trends and multi-channel ROI aggregation using Recharts' },
    brochure_generator: { title: 'Brochure PDF Generator', subtitle: 'Create and export customized industry-specific marketing materials with CRM variables' },
    outreach_agent: { title: 'Outreach Agent Sequences', subtitle: 'Automated personalized follow-up sequences, scheduling, and tracking' },
    public_website: { title: 'Sitio Web de la Agencia & LMS', subtitle: 'Ver portal público de Clientum, catálogo de soluciones y Academia LMS' },
    workflow: { title: 'Workflow de Inicio a Fin', subtitle: 'Secuencia recomendada de uso — de configuración hasta analytics & ROI' },
  };

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs gap-4">
      <div className="flex items-center space-x-4 min-w-0">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="min-w-0 hidden md:block">
          <h1 className="text-xl font-bold text-slate-900 truncate">{tabTitles[activeTab].title}</h1>
          <p className="text-xs text-slate-500 truncate">{tabTitles[activeTab].subtitle}</p>
        </div>
      </div>

      <div className="flex-1 max-w-md hidden lg:flex items-center">
        <button 
          onClick={onOpenCommandPalette}
          className="w-full relative flex items-center bg-slate-50 hover:bg-slate-100 border border-slate-200 text-sm rounded-full pl-9 pr-4 py-2 text-left text-slate-500 transition-colors shadow-2xs group cursor-pointer"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 absolute left-3 top-1/2 -translate-y-1/2 transition-colors" />
          <span className="truncate">Buscar leads, campañas o módulos...</span>
          <kbd className="ml-auto hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono font-medium text-slate-500 bg-slate-200 px-2 py-0.5 rounded-md border border-slate-300">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="flex items-center space-x-3 shrink-0">
        {/* Region Selector */}
        <div className="hidden sm:flex items-center space-x-1.5 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 text-xs font-medium text-slate-300">
          <Globe2 className="w-3.5 h-3.5 text-indigo-400" />
          <select 
            value={region} 
            onChange={(e) => setRegion(e.target.value)}
            className="bg-transparent border-none text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="LATAM (All)" className="text-slate-800">LATAM (All)</option>
            <option value="Mexico" className="text-slate-800">Mexico (MX)</option>
            <option value="Colombia" className="text-slate-800">Colombia (CO)</option>
            <option value="Brazil" className="text-slate-800">Brazil (BR)</option>
            <option value="Chile" className="text-slate-800">Chile (CL)</option>
            <option value="Argentina" className="text-slate-800">Argentina (AR)</option>
          </select>
        </div>

        {/* Currency Selector */}
        <div className="flex items-center space-x-1.5 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 text-xs font-medium text-slate-300">
          <span className="font-bold text-emerald-400">💱</span>
          <select 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-transparent border-none text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="USD" className="text-slate-800">USD ($)</option>
            <option value="MXN" className="text-slate-800">MXN ($)</option>
            <option value="BRL" className="text-slate-800">BRL (R$)</option>
            <option value="COP" className="text-slate-800">COP ($)</option>
          </select>
        </div>

        {/* Cloud Sync Status */}
        <div className="hidden lg:flex items-center space-x-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 text-xs font-medium text-emerald-600">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span>Synced</span>
        </div>

        <div className="h-6 w-[1px] bg-slate-200 hidden sm:block mx-2"></div>

        {/* Fused split-pill: Sitio Web | Auth */}
        <div className="hidden sm:inline-flex items-stretch rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden divide-x divide-slate-200">
          <button
            onClick={() => setActiveTab('public_website')}
            title="Ver Sitio Web de la Agencia"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
          >
            <Globe2 className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            <span className="hidden xl:inline">Sitio Web & LMS</span>
            <span className="xl:hidden">Sitio Web</span>
          </button>
          <AuthButton compact />
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-slate-900 text-white p-4 shadow-xl md:hidden z-50 flex flex-col space-y-2 border-t border-slate-800">
          <button 
            onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
            className="text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-sm font-medium"
          >
            📊 Dashboard
          </button>
          <button 
            onClick={() => { setActiveTab('strategy'); setMobileMenuOpen(false); }}
            className="text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-sm font-medium"
          >
            ✨ AI Strategy Generator
          </button>
          <button 
            onClick={() => { setActiveTab('copywriter'); setMobileMenuOpen(false); }}
            className="text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-sm font-medium"
          >
            📝 AI Ad Copy Studio
          </button>
          <button 
            onClick={() => { setActiveTab('seo'); setMobileMenuOpen(false); }}
            className="text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-sm font-medium"
          >
            🔍 AI SEO & Content
          </button>
          <button 
            onClick={() => { setActiveTab('clients'); setMobileMenuOpen(false); }}
            className="text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-sm font-medium"
          >
            👥 LATAM Clients CRM
          </button>
          <button 
            onClick={() => { setActiveTab('chat'); setMobileMenuOpen(false); }}
            className="text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-sm font-medium"
          >
            💬 AI CMO Chat
          </button>
        </div>
      )}
    </header>
  );
}
