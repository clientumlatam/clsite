import React, { useState } from "react";
import {
  Bot, FileText, Mail, Search, Share2, Map,
  ChevronRight, ExternalLink, Zap, AlertCircle, CheckCircle2,
  BarChart3, Users, Globe, MessageSquare,
} from "lucide-react";

interface Modulo {
  id: string;
  icon: React.ReactNode;
  nombre: string;
  descripcion: string;
  color: string;
  bg: string;
  badge: string;
  badgeText: string;
  estado: "activo" | "config" | "inactivo";
  features: string[];
  crm_integracion: string;
  stats?: { label: string; value: string }[];
}

const MODULOS: Modulo[] = [
  {
    id: "chatbot",
    icon: <Bot className="w-5 h-5" />,
    nombre: "Chatbot IA",
    descripcion: "Asistente conversacional que captura leads en tu sitio WordPress. Cuando un visitante interactúa con el chat, sus datos llegan automáticamente al CRM de Clientum.",
    color: "#059669",
    bg: "#f0fdf4",
    badge: "#d1fae5",
    badgeText: "#065f46",
    estado: "activo",
    features: [
      "Captura nombre, teléfono, email y empresa",
      "Registra la conversación completa",
      "Envía leads al CRM via webhook en tiempo real",
      "Personalizable con flujos de preguntas",
    ],
    crm_integracion: "Los leads llegan a Chatbot Leads → gestionables desde el dashboard",
    stats: [
      { label: "Webhook", value: "/api/webhooks/chatbot-lead" },
      { label: "Auth", value: "X-CRM-Token" },
    ],
  },
  {
    id: "content-generator",
    icon: <FileText className="w-5 h-5" />,
    nombre: "Generador de Contenido",
    descripcion: "Genera artículos de blog, copies de landing, descripciones de productos y posts para redes sociales con IA. Optimizado para PyMEs de la Patagonia.",
    color: "#7c3aed",
    bg: "#faf5ff",
    badge: "#ede9fe",
    badgeText: "#4c1d95",
    estado: "activo",
    features: [
      "Artículos de blog optimizados para SEO",
      "Copies de landing pages por industria",
      "Descripciones de productos WooCommerce",
      "Adaptación al español rioplatense",
    ],
    crm_integracion: "Generá contenido directamente desde Clientum con el módulo Copiloto IA",
  },
  {
    id: "email-marketing",
    icon: <Mail className="w-5 h-5" />,
    nombre: "Email Marketing",
    descripcion: "Campañas de email automatizadas con IA. Gestiona suscriptores, diseña newsletters y trackea aperturas y clics directamente desde WordPress.",
    color: "#0284c7",
    bg: "#f0f9ff",
    badge: "#dbeafe",
    badgeText: "#1e40af",
    estado: "activo",
    features: [
      "Campañas automatizadas con triggers",
      "Segmentación por comportamiento",
      "Templates generados con IA",
      "Reportes de apertura y conversión",
    ],
    crm_integracion: "Los suscriptores pueden sincronizarse con los leads del CRM Pipeline",
    stats: [
      { label: "Límite free", value: "10 campañas" },
      { label: "Suscriptores", value: "Ilimitado" },
    ],
  },
  {
    id: "seo",
    icon: <Search className="w-5 h-5" />,
    nombre: "SEO con IA",
    descripcion: "Análisis y optimización SEO impulsado por IA. Audita páginas, sugiere keywords y genera meta-tags optimizados para posicionar en Google.",
    color: "#b45309",
    bg: "#fffbeb",
    badge: "#fef3c7",
    badgeText: "#78350f",
    estado: "config",
    features: [
      "Auditoría de páginas en tiempo real",
      "Sugerencias de keywords por industria",
      "Meta-tags y descripciones con IA",
      "Score de legibilidad y densidad",
    ],
    crm_integracion: "Las keywords estratégicas se pueden usar para el ICP Builder de Clientum",
  },
  {
    id: "social-media",
    icon: <Share2 className="w-5 h-5" />,
    nombre: "Redes Sociales",
    descripcion: "Generá y programá posts para Globe, Facebook y LinkedIn con IA. Reutilizá el contenido del blog automáticamente para cada red social.",
    color: "#db2777",
    bg: "#fdf2f8",
    badge: "#fce7f3",
    badgeText: "#831843",
    estado: "config",
    features: [
      "Generación de copies para cada red",
      "Programación de publicaciones",
      "Hashtags sugeridos por IA",
      "Reutilización automática del blog",
    ],
    crm_integracion: "Los posts sobre servicios se pueden coordinar con las campañas de Outreach del CRM",
  },
  {
    id: "prospector",
    icon: <Map className="w-5 h-5" />,
    nombre: "Prospector de Leads",
    descripcion: "Descubrimiento de prospectos locales integrado con el Explorador Patagónico de Clientum. Busca empresas por rubro y zona geográfica.",
    color: "#0f766e",
    bg: "#f0fdfa",
    badge: "#ccfbf1",
    badgeText: "#134e4a",
    estado: "activo",
    features: [
      "Búsqueda por rubro y ciudad",
      "Integración con Google Maps API",
      "Calificación automática MEDDIC",
      "Exportación directa al CRM Pipeline",
    ],
    crm_integracion: "Los leads se exportan directo al CRM Pipeline → Patagonia Explorer",
  },
];

const ESTADO_CONFIG = {
  activo:   { label: "Activo", color: "#059669", bg: "#d1fae5", icon: <CheckCircle2 className="w-3 h-3" /> },
  config:   { label: "Por configurar", color: "#b45309", bg: "#fef3c7", icon: <AlertCircle className="w-3 h-3" /> },
  inactivo: { label: "Inactivo", color: "#6b7280", bg: "#f3f4f6", icon: <AlertCircle className="w-3 h-3" /> },
};

function ModuloCard({ mod }: { mod: Modulo; key?: React.Key }) {
  const [open, setOpen] = useState(false);
  const estado = ESTADO_CONFIG[mod.estado];

  return (
    <div
      className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden transition-shadow hover:shadow-md"
      style={{ borderLeft: `4px solid ${mod.color}` }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: mod.bg, color: mod.color }}
            >
              {mod.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-black text-zinc-800 text-[14px]">{mod.nombre}</h3>
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: estado.bg, color: estado.color }}
                >
                  {estado.icon}
                  {estado.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-zinc-500 text-[12.5px] leading-relaxed mb-3">{mod.descripcion}</p>

        {/* CRM integration tag */}
        <div
          className="flex items-start gap-2 rounded-lg p-2.5 mb-3"
          style={{ background: mod.bg }}
        >
          <Zap className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: mod.color }} />
          <p className="text-[11.5px] font-medium leading-relaxed" style={{ color: mod.color }}>
            <strong>CRM:</strong> {mod.crm_integracion}
          </p>
        </div>

        {/* Stats */}
        {mod.stats && (
          <div className="flex flex-wrap gap-2 mb-3">
            {mod.stats.map(s => (
              <div key={s.label} className="bg-zinc-50 border border-zinc-200 rounded px-2 py-1">
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">{s.label}</span>
                <span className="text-[11px] font-mono text-zinc-600">{s.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Toggle features */}
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1 text-[11px] font-semibold transition-colors"
          style={{ color: mod.color }}
        >
          <ChevronRight
            className="w-3.5 h-3.5 transition-transform"
            style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
          />
          {open ? "Ocultar funciones" : `Ver ${mod.features.length} funciones`}
        </button>

        {open && (
          <ul className="mt-3 space-y-1.5 pl-2 border-l-2" style={{ borderColor: mod.color + "44" }}>
            {mod.features.map(f => (
              <li key={f} className="flex items-center gap-2 text-[12px] text-zinc-600">
                <CheckCircle2 className="w-3 h-3 flex-shrink-0" style={{ color: mod.color }} />
                {f}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function WpModulos() {
  const activos = MODULOS.filter(m => m.estado === "activo").length;
  const porConfig = MODULOS.filter(m => m.estado === "config").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-zinc-800 tracking-tight flex items-center gap-2 mb-1">
            <Globe className="w-6 h-6 text-[#10B981]" />
            Módulos del Plugin
          </h1>
          <p className="text-zinc-500 text-[12.5px]">
            AI Marketing Expert v2 · {activos} activos · {porConfig} por configurar
          </p>
        </div>
        <a
          href="https://es.wordpress.org/plugins/ai-marketing-expert/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-white border border-zinc-200 hover:border-[#10B981]/50 hover:text-[#059669] text-zinc-600 px-3 py-2 rounded-lg transition-all shadow-sm"
        >
          <ExternalLink className="w-3 h-3" />
          Ver en WordPress.org
        </a>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: <Bot className="w-4 h-4" />, label: "Módulos totales", value: "6", color: "#10B981" },
          { icon: <CheckCircle2 className="w-4 h-4" />, label: "Activos", value: String(activos), color: "#059669" },
          { icon: <AlertCircle className="w-4 h-4" />, label: "Por configurar", value: String(porConfig), color: "#b45309" },
          { icon: <MessageSquare className="w-4 h-4" />, label: "Webhook activo", value: "Pendiente", color: "#dc2626" },
        ].map(s => (
          <div key={s.label} className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: s.color + "18", color: s.color }}>
              {s.icon}
            </div>
            <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold mb-0.5">{s.label}</p>
            <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Module grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {MODULOS.map(mod => (
          <ModuloCard key={mod.id} mod={mod} />
        ))}
      </div>

      {/* Footer note */}
      <div className="flex gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <BarChart3 className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[12px] font-bold text-blue-800 mb-0.5">Flujo de datos</p>
          <p className="text-[11.5px] text-blue-700 leading-relaxed">
            Los módulos de WordPress se comunican con Clientum CRM via webhook REST. El módulo <strong>Chatbot</strong> envía leads en tiempo real. Los módulos <strong>SEO</strong>, <strong>Contenido</strong> y <strong>Redes</strong> operan de forma autónoma en WordPress y pueden coordinarse manualmente desde el Orquestador IA.
          </p>
        </div>
      </div>
    </div>
  );
}
