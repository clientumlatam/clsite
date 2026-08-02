import React, { useState, useEffect } from 'react';
import { ActiveTab } from '../types';
import { 
  Search, 
  LayoutDashboard, 
  Compass, 
  Sparkles, 
  Kanban, 
  ShieldCheck, 
  Target, 
  Users, 
  Send, 
  FileText, 
  Workflow, 
  BarChart3, 
  Globe2, 
  Settings,
  X,
  ArrowRight
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: ActiveTab) => void;
}

interface NavItem {
  id: ActiveTab;
  label: string;
  category: string;
  description: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: 'overview', label: 'Dashboard Principal', category: 'Growth & Core', description: 'Rendimiento comercial y métricas globales', icon: LayoutDashboard },
  { id: 'analytics_dashboard', label: 'Analytics & ROI Dashboard', category: 'Growth & Core', description: 'Gráficos de conversión y retorno de inversión', icon: BarChart3 },
  { id: 'geolocated_prospecting', label: 'Prospección Geolocalizada Maps', category: 'Growth & Core', description: 'Búsqueda en Google Maps y calificación con Gemini AI', icon: Compass },
  { id: 'ai_hub', label: 'Gemini AI & Voice Hub', category: 'Growth & Core', description: 'Herramientas avanzadas de inteligencia artificial y voz', icon: Sparkles },
  { id: 'crm_kanban', label: 'CRM Sales Pipeline', category: 'Growth & Core', description: 'Embudo de ventas Kanban e historial de tratos', icon: Kanban },
  { id: 'meddic', label: 'MEDDIC Lead Scoring', category: 'Growth & Core', description: 'Calificación de oportunidades B2B Enterprise', icon: ShieldCheck },
  { id: 'icp_builder', label: 'ICP & Persona Builder', category: 'Growth & Core', description: 'Definición de Perfil de Cliente Ideal con IA', icon: Target },
  { id: 'brochure_generator', label: 'Brochure PDF Generator', category: 'Growth & Core', description: 'Creación de propuestas y folletos comerciales en PDF', icon: FileText },
  { id: 'outreach_agent', label: 'Agente de Secuencias Outreach', category: 'Growth & Core', description: 'Automatización de prospección multicanal', icon: Send },
  { id: 'clients', label: 'CRM Clientes LATAM', category: 'Growth & Core', description: 'Directorio y ficha completa de clientes', icon: Users },

  { id: 'email_campaigns', label: 'Campañas de Email', category: 'Email Marketing', description: 'Envío de campañas y boletines masivos', icon: Send },
  { id: 'contacts', label: 'Contactos y Suscriptores', category: 'Email Marketing', description: 'Base de datos de destinatarios y etiquetas', icon: Users },
  { id: 'automations', label: 'Automatizaciones & Drip Flows', category: 'Email Marketing', description: 'Flujos automatizados de bienvenida y nutrición', icon: Workflow },
  { id: 'email_template_builder', label: 'Constructor de Plantillas HTML', category: 'Email Marketing', description: 'Diseñador visual de emails responsive', icon: FileText },
  
  { id: 'keyword_research', label: 'Investigación de Palabras Clave SEO', category: 'AI SEO & Tools', description: 'Volúmenes de búsqueda en Latinoamérica', icon: Search },
  { id: 'topic_map', label: 'Mapa de Autoridad Tópica', category: 'AI SEO & Tools', description: 'Arquitectura de contenidos SEO', icon: Globe2 },
  { id: 'settings', label: 'Configuración de Plataforma', category: 'Ajustes', description: 'Claves de API, dominios y preferencias', icon: Settings },
];

export function CommandPalette({ isOpen, onClose, setActiveTab }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredItems = navItems.filter(item => 
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (id: ActiveTab) => {
    setActiveTab(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-indigo-500 mr-3 shrink-0" />
          <input 
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            placeholder="Buscar módulo, cliente, campaña o herramienta... (ej. Prospectar, CRM, Email)"
            className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none"
            autoFocus
          />
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center gap-1"
          >
            <span className="text-[10px] font-mono bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">ESC</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation items list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No se encontraron módulos coincidentes con "<span className="text-slate-200">{query}</span>"
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors ${
                    isSelected 
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 text-indigo-900 dark:text-indigo-200' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div className={`p-2.5 rounded-lg shrink-0 ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm truncate">{item.label}</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.description}</p>
                    </div>
                  </div>
                  <ArrowRight className={`w-4 h-4 shrink-0 ml-2 transition-transform ${isSelected ? 'text-indigo-600 dark:text-indigo-400 translate-x-1' : 'text-slate-400 opacity-0'}`} />
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-3">
            <span><strong className="font-mono text-slate-700 dark:text-slate-300">↑↓</strong> Navegar</span>
            <span><strong className="font-mono text-slate-700 dark:text-slate-300">↵</strong> Seleccionar</span>
          </div>
          <span>Clientum Latam Navigation</span>
        </div>
      </div>
    </div>
  );
}
