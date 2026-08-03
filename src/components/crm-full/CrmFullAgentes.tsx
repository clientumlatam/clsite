import React, { useState } from 'react';
import { Bot, Zap, TrendingUp, Users, Wrench, Megaphone, HeartHandshake, Settings2, ChevronDown, ChevronUp, CheckCircle2, Clock, AlertCircle, GitBranch, MessageSquare, MapPin, Brain } from 'lucide-react';

interface Agente {
  id: string;
  name: string;
  role: string;
  emoji: string;
  description: string;
  skills: string[];
  status: 'real' | 'simulation' | 'pending';
  department: string;
  departmentColor: string;
  children?: string[];
}

const AGENTES: Agente[] = [
  {
    id: 'orquestador',
    name: 'Orquestador IA',
    role: 'Chief of Staff',
    emoji: '🤖',
    description: 'Único punto de contacto ejecutivo que delega y coordina tareas entre los 5 departamentos. Enruta Issues según label, ejecuta con Gemini y commitea respuestas automáticamente.',
    skills: ['Gemini 1.5 Flash', 'Task Router', 'GitHub Issues', 'Memoria automática'],
    status: 'simulation',
    department: 'Dirección',
    departmentColor: '#6366f1',
    children: ['ventas', 'tecnico', 'marketing', 'cs', 'ops'],
  },
  {
    id: 'santi',
    name: 'Santi SDR',
    role: 'SDR Outbound AI',
    emoji: '📱',
    description: 'Contacta leads por WhatsApp y califica respuestas (caliente/tibio/frío). Hermes Agent corriendo en Ubuntu local, 15 contactos/día máximo, guardrails de opt-out.',
    skills: ['Hermes Agent', 'WhatsApp Cloud API', 'CRM API (/api/leads)', 'Follow-up MEDDIC'],
    status: 'real',
    department: 'Ventas',
    departmentColor: '#f59e0b',
    children: [],
  },
  {
    id: 'explorador',
    name: 'Explorador Patagónico',
    role: 'Lead Generation AI',
    emoji: '🏔️',
    description: 'Prospección metódica en Google Maps y Apify centrada en la Patagonia. Calcula fit score con Gemini para identificar PyMEs con alto potencial de compra.',
    skills: ['Google Maps API', 'Apify Scraping', 'Gemini Scoring', 'Hunter.io Enrichment'],
    status: 'real',
    department: 'Ventas',
    departmentColor: '#f59e0b',
    children: [],
  },
  {
    id: 'backend',
    name: 'Backend / Infra',
    role: 'CTO AI — Backend',
    emoji: '⚙️',
    description: 'Responsable de APIs, bases de datos Neon y deploys en Vercel/Replit. Prioriza estabilidad y monitorea health de todos los servicios integrados.',
    skills: ['Node.js + Express', 'Neon PostgreSQL', 'Vercel Serverless', 'Auth + Sessions'],
    status: 'real',
    department: 'Técnico',
    departmentColor: '#0ea5e9',
    children: [],
  },
  {
    id: 'frontend',
    name: 'Frontend / UX',
    role: 'CTO AI — Frontend',
    emoji: '🎨',
    description: 'Desarrolla la interfaz del CRM, dashboards y brochures visuales. Mantiene paleta navy/gold y consistencia en componentes React 19 + Tailwind v4.',
    skills: ['React 19', 'Vite 6', 'Tailwind CSS v4', 'jsPDF + html2canvas'],
    status: 'real',
    department: 'Técnico',
    departmentColor: '#0ea5e9',
    children: [],
  },
  {
    id: 'ia_auto',
    name: 'IA & Automatización',
    role: 'CTO AI — IA',
    emoji: '🧠',
    description: 'Especialista en enriquecimiento de datos, scoring MEDDIC y generación de brochures personalizados mediante Google Gemini AI.',
    skills: ['Gemini API', 'Apify Actors', 'Hunter.io', 'MEDDIC Scoring'],
    status: 'simulation',
    department: 'Técnico',
    departmentColor: '#0ea5e9',
    children: [],
  },
  {
    id: 'seo',
    name: 'SEO & Contenido',
    role: 'Content AI',
    emoji: '📝',
    description: 'Redacta blog posts y landing pages industriales con enfoque en conversión PyME. Estilo directo ("en criollo") y optimización on-page automatizada.',
    skills: ['WordPress Plugin', 'Gemini Redacción', 'Google Search Console', 'SEO On-page'],
    status: 'simulation',
    department: 'Marketing',
    departmentColor: '#10b981',
    children: [],
  },
  {
    id: 'asesor',
    name: 'Asesor Comercial IA',
    role: 'Inbound Chatbot',
    emoji: '💬',
    description: 'Captura y califica leads inbound desde el sitio web de Clientum. Responde consultas frecuentes y carga contactos interesados directamente al CRM.',
    skills: ['Chatbot Widget', 'CRM Webhook', 'Gemini', 'Lead Qualification'],
    status: 'real',
    department: 'Customer Success',
    departmentColor: '#8b5cf6',
    children: [],
  },
  {
    id: 'finanzas',
    name: 'Finanzas & Admin',
    role: 'COO AI',
    emoji: '📊',
    description: 'Gestiona reportes semanales de MRR y facturación. Cruza datos de AFIP y MercadoPago con el pipeline de ventas para proyectar ingresos y alertar anomalías.',
    skills: ['CRM Dashboard', 'Neon DB Reports', 'AFIP Integration (futuro)', 'Revenue Projection'],
    status: 'simulation',
    department: 'Operaciones',
    departmentColor: '#f43f5e',
    children: [],
  },
];

const DEPARTMENTS = [
  { id: 'ventas', label: 'Ventas', icon: <TrendingUp className="w-4 h-4" />, color: '#f59e0b', agents: ['santi', 'explorador'] },
  { id: 'tecnico', label: 'Técnico', icon: <Wrench className="w-4 h-4" />, color: '#0ea5e9', agents: ['backend', 'frontend', 'ia_auto'] },
  { id: 'marketing', label: 'Marketing', icon: <Megaphone className="w-4 h-4" />, color: '#10b981', agents: ['seo'] },
  { id: 'cs', label: 'Customer Success', icon: <HeartHandshake className="w-4 h-4" />, color: '#8b5cf6', agents: ['asesor'] },
  { id: 'ops', label: 'Operaciones', icon: <Settings2 className="w-4 h-4" />, color: '#f43f5e', agents: ['finanzas'] },
];

const STATUS_CONFIG = {
  real: { label: 'Activo', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/30', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  simulation: { label: 'Simulación', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/30', icon: <Clock className="w-3.5 h-3.5" /> },
  pending: { label: 'Pendiente', color: 'text-slate-400', bg: 'bg-slate-400/10 border-slate-400/30', icon: <AlertCircle className="w-3.5 h-3.5" /> },
};

const AgenteCard: React.FC<{ agente: Agente }> = ({ agente }) => {
  const [expanded, setExpanded] = useState(false);
  const statusCfg = STATUS_CONFIG[agente.status];

  return (
    <div className="bg-[#0A101F]/60 border border-[#1E293B] rounded-xl p-4 hover:border-sky-500/30 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="text-2xl flex-shrink-0">{agente.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <p className="font-semibold text-white text-sm">{agente.name}</p>
              <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${statusCfg.bg} ${statusCfg.color}`}>
                {statusCfg.icon}
                {statusCfg.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-2">{agente.role}</p>
            {expanded && (
              <>
                <p className="text-xs text-slate-300 mb-3 leading-relaxed">{agente.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {agente.skills.map(skill => (
                    <span key={skill} className="text-xs px-2 py-0.5 bg-sky-500/10 text-sky-300 rounded-md border border-sky-500/20">
                      {skill}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <button
          onClick={() => setExpanded(e => !e)}
          className="text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0 mt-0.5"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

export default function CrmFullAgentes() {
  const realCount = AGENTES.filter(a => a.status === 'real').length;
  const simCount = AGENTES.filter(a => a.status === 'simulation').length;

  return (
    <div className="space-y-8 text-slate-200">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
          <Bot className="w-8 h-8 text-sky-400" />
          Sistema de Agentes IA
        </h1>
        <p className="text-slate-400">Arquitectura Hermes Prime · {AGENTES.length} agentes · Jonathan CEO como director</p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Agentes totales', value: AGENTES.length, icon: <Bot className="w-5 h-5 text-sky-400" />, color: 'border-sky-500/30' },
          { label: 'Activos (real)', value: realCount, icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />, color: 'border-emerald-500/30' },
          { label: 'En simulación', value: simCount, icon: <Clock className="w-5 h-5 text-amber-400" />, color: 'border-amber-500/30' },
          { label: 'Departamentos', value: DEPARTMENTS.length, icon: <Users className="w-5 h-5 text-purple-400" />, color: 'border-purple-500/30' },
        ].map(stat => (
          <div key={stat.label} className={`bg-[#0A101F]/60 border ${stat.color} rounded-xl p-4`}>
            <div className="flex items-center justify-between mb-2">
              {stat.icon}
              <span className="text-2xl font-bold text-white">{stat.value}</span>
            </div>
            <p className="text-xs text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Arquitectura Hermes Prime */}
      <div className="bg-[#0A101F]/60 border border-[#1E293B] rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-sky-400" />
          Arquitectura Hermes Prime
        </h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          {/* CRM */}
          <div className="bg-sky-500/5 border border-sky-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-sky-400"></div>
              <span className="font-semibold text-sky-300">clientum.com.ar (Vercel)</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-400">
              <p>→ <code className="text-sky-300">/api/generate</code> (Google Gemini AI Nativo)</p>
              <p>→ <code className="text-sky-300">/api/santi/*</code> (SANTI_API_KEY)</p>
              <p>→ <code className="text-sky-300">/api/leads</code> (6 endpoints CRUD)</p>
              <p>→ <code className="text-sky-300">/api/places/*</code> (Google Maps IA)</p>
              <p>→ <code className="text-sky-300">/api/whatsapp/*</code> (bandeja WA)</p>
            </div>
          </div>
          {/* Hermes Agent */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
              <span className="font-semibold text-amber-300">Hermes Agent (Ubuntu)</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-400">
              <p className="text-amber-300 font-medium">▸ Santi SDR — ACTIVO</p>
              <p>→ Lee leads del CRM</p>
              <p>→ Envía WhatsApp (15/día max)</p>
              <p>→ Clasifica: caliente/tibio/frío</p>
              <p>→ Actualiza pipeline automático</p>
            </div>
          </div>
          {/* GitHub Actions */}
          <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              <span className="font-semibold text-purple-300">GitHub Actions (cron)</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-400">
              <p>→ Cron cada 15 minutos</p>
              <p>→ Lee Issues abiertos</p>
              <p>→ Enruta al agente por label</p>
              <p>→ Ejecuta con Gemini</p>
              <p>→ Commitea memoria.md</p>
            </div>
          </div>
        </div>
        {/* Flow arrow */}
        <div className="mt-4 p-3 bg-[#0A101F]/80 rounded-lg border border-[#1E293B] text-xs text-slate-400 font-mono">
          <span className="text-slate-500">Flujo:</span>{' '}
          <span className="text-white">Jonathan</span>{' '}
          <span className="text-slate-500">→</span>{' '}
          <span className="text-sky-300">CRM Issue</span>{' '}
          <span className="text-slate-500">→</span>{' '}
          <span className="text-purple-300">Orquestador IA</span>{' '}
          <span className="text-slate-500">→</span>{' '}
          <span className="text-amber-300">Agente Departamento</span>{' '}
          <span className="text-slate-500">→</span>{' '}
          <span className="text-emerald-300">Acción real / Hermes</span>
        </div>
      </div>

      {/* Orquestador */}
      <div>
        <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
          <span className="text-lg">🤖</span> Orquestador (Chief of Staff)
        </h2>
        <AgenteCard agente={AGENTES[0]} />
      </div>

      {/* Departamentos */}
      <div className="space-y-6">
        {DEPARTMENTS.map(dept => {
          const deptAgents = AGENTES.filter(a => dept.agents.includes(a.id));
          return (
            <div key={dept.id}>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold"
                  style={{ color: dept.color, borderColor: `${dept.color}40`, background: `${dept.color}10` }}>
                  {dept.icon}
                  Dpto. {dept.label}
                </div>
                <div className="flex-1 h-px bg-[#1E293B]"></div>
                <span className="text-xs text-slate-500">{deptAgents.length} agente{deptAgents.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 pl-2">
                {deptAgents.map(a => <AgenteCard key={a.id} agente={a} />)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cómo usar */}
      <div className="bg-[#0A101F]/60 border border-[#1E293B] rounded-xl p-6">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Cómo dar trabajo a los agentes
        </h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sky-300 font-semibold">
              <MessageSquare className="w-4 h-4" />
              1. Crear Issue en GitHub
            </div>
            <p className="text-slate-400 text-xs">Creá un Issue con label <code className="text-sky-300">agente:orquestador</code> y escribí la instrucción en texto libre. El Orquestador enruta automáticamente.</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-semibold">
              <Bot className="w-4 h-4" />
              2. El agente ejecuta
            </div>
            <p className="text-slate-400 text-xs">GitHub Actions corre cada 15 min. El agente lee su ficha (identidad + memoria + proceso), ejecuta con Gemini y postea la respuesta como comentario.</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              3. Cierre automático
            </div>
            <p className="text-slate-400 text-xs">Cuando el agente escribe <code className="text-emerald-300">ESTADO: DONE</code>, el Issue se cierra y la memoria del agente se actualiza con el aprendizaje.</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg text-xs text-amber-300">
          <strong>⚠️ Nota importante:</strong> El loop de Issues es simulación de texto para departamentos no-ventas. Santi SDR es el único agente con ejecución real (WhatsApp). Ver <code>docs/referencia-tecnica/agentes/README.md</code> para contexto completo.
        </div>
      </div>

      {/* Skills integradas */}
      <div className="bg-[#0A101F]/60 border border-[#1E293B] rounded-xl p-6">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          Integraciones activas del sistema
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'Gemini 1.5', desc: 'IA principal', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' },
            { name: 'Apify', desc: 'Scraping leads', color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/20' },
            { name: 'Hunter.io', desc: 'Email enrichment', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20' },
            { name: 'Google Maps', desc: 'Prospección', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20' },
            { name: 'Neon PostgreSQL', desc: 'Base de datos', color: 'text-teal-400', bg: 'bg-teal-400/10 border-teal-400/20' },
            { name: 'WhatsApp API', desc: 'Outbound Santi', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
            { name: 'Vercel', desc: 'Deploy producción', color: 'text-slate-300', bg: 'bg-slate-400/10 border-slate-400/20' },
            { name: 'GitHub Actions', desc: 'Cron agentes', color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/20' },
          ].map(item => (
            <div key={item.name} className={`border rounded-lg p-3 ${item.bg}`}>
              <p className={`text-xs font-semibold ${item.color}`}>{item.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Links a docs */}
      <div className="bg-[#0A101F]/40 border border-[#1E293B] rounded-xl p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-slate-400" />
          Documentación de referencia
        </h3>
        <div className="grid md:grid-cols-2 gap-2 text-xs text-slate-400">
          {[
            'docs/referencia-tecnica/agentes/organigrama-y-arquitectura.md',
            'docs/referencia-tecnica/agentes/fichas/ (14 fichas de agentes)',
            'docs/referencia-tecnica/implementacion-santi-hermes.md',
            'docs/referencia-tecnica/agentes/scripts/run-agentes.mjs',
            'docs/roadmap-modulos-nuevos.md',
            '.github/workflows/agentes-clientum.yml',
          ].map(doc => (
            <div key={doc} className="flex items-start gap-2">
              <span className="text-slate-600 mt-0.5">→</span>
              <code className="text-slate-400 break-all">{doc}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
