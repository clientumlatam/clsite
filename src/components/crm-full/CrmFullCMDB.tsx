import React, { useState, useMemo } from 'react';
import {
  Server, Download, Search, Filter, Globe, Code2, ExternalLink,
  CheckCircle2, AlertCircle, Clock, FileText, Database, Terminal
} from 'lucide-react';

/* ── Types ─────────────────────────────────────────────────────────────── */
type Ambiente = 'Producción' | 'Desarrollo' | 'Externo';
type Estado   = 'Activo' | 'En revisión' | 'Inactivo';

interface CMDBEntry {
  id: string;
  servicio: string;
  url: string;
  ambiente: Ambiente;
  tecnologia: string;
  funcion: string;
  estado: Estado;
  responsable: string;
  dependencias: string;
  observaciones: string;
}

/* ── Data ───────────────────────────────────────────────────────────────── */
const initialData: CMDBEntry[] = [
  // ── Producción ──────────────────────────────────────────────────────────
  {
    id: 'p-01', servicio: 'Clientum (Sitio Principal)', url: 'https://clientum.com.ar/',
    ambiente: 'Producción', tecnologia: 'WordPress + cPanel', funcion: 'Sitio web principal de marketing y ventas',
    estado: 'Activo', responsable: 'Equipo Clientum', dependencias: 'Wiroos, Cloudflare',
    observaciones: 'Hosted en Wiroos (cPanel)',
  },
  {
    id: 'p-02', servicio: 'AI Copilot (Prod)', url: 'https://clientum.com.ar/ai-copilot/',
    ambiente: 'Producción', tecnologia: 'WordPress', funcion: 'Página de producto AI Copilot',
    estado: 'Activo', responsable: 'Equipo Clientum', dependencias: 'Clientum WP',
    observaciones: '',
  },
  {
    id: 'p-03', servicio: 'API Gateway (Prod)', url: 'https://clientum.com.ar/api-gateway-2/',
    ambiente: 'Producción', tecnologia: 'WordPress', funcion: 'Página de producto API Gateway',
    estado: 'Activo', responsable: 'Equipo Clientum', dependencias: 'Clientum WP',
    observaciones: '',
  },
  {
    id: 'p-04', servicio: 'Consultoría (Prod)', url: 'https://clientum.com.ar/consultoria/',
    ambiente: 'Producción', tecnologia: 'WordPress', funcion: 'Página de servicios de consultoría',
    estado: 'Activo', responsable: 'Equipo Clientum', dependencias: 'Clientum WP',
    observaciones: '',
  },
  {
    id: 'p-05', servicio: 'Discussions (Prod)', url: 'https://clientum.com.ar/discussions/',
    ambiente: 'Producción', tecnologia: 'WordPress', funcion: 'Foro / comunidad',
    estado: 'Activo', responsable: 'Equipo Clientum', dependencias: 'Clientum WP',
    observaciones: '',
  },
  {
    id: 'p-06', servicio: 'Inicio-2 (Prod)', url: 'https://clientum.com.ar/inicio-2/',
    ambiente: 'Producción', tecnologia: 'WordPress', funcion: 'Landing alternativa de inicio',
    estado: 'En revisión', responsable: 'Equipo Clientum', dependencias: 'Clientum WP',
    observaciones: 'Posible duplicado de home',
  },
  // ── Desarrollo – Replit principal ────────────────────────────────────
  ...[
    ['/', 'Home CRM App'],
    ['/academia/', 'Academia'],
    ['/academia-cursos/', 'Academia – Cursos'],
    ['/ai-copilot/', 'AI Copilot'],
    ['/api-gateway/', 'API Gateway'],
    ['/automatizacion/', 'Automatización'],
    ['/blog/', 'Blog'],
    ['/casos/', 'Casos de uso'],
    ['/catalogo-servicios/', 'Catálogo de servicios'],
    ['/clientum-ai-prospector/', 'AI Prospector'],
    ['/comparativa/', 'Comparativa'],
    ['/comparativa-erp/', 'Comparativa ERP'],
    ['/comparativa-servicios/', 'Comparativa Servicios'],
    ['/comparativa-servicios-2/', 'Comparativa Servicios 2'],
    ['/consultoria/', 'Consultoría'],
    ['/contacto/', 'Contacto'],
    ['/crm/', 'CRM'],
    ['/desarrollo-web/', 'Desarrollo Web'],
    ['/desarrollo-web-personalizado/', 'Desarrollo Web Personalizado'],
    ['/discussions/', 'Discussions'],
    ['/erp/', 'ERP'],
    ['/faq/', 'FAQ'],
    ['/ia/', 'IA'],
    ['/implementacion/', 'Implementación'],
    ['/implementacion-2/', 'Implementación 2'],
    ['/inicio/', 'Inicio'],
    ['/integracion/', 'Integración'],
    ['/marketing/', 'Marketing'],
    ['/portal/', 'Portal'],
    ['/precios/', 'Precios'],
    ['/privacidad/', 'Privacidad'],
    ['/recursos/', 'Recursos'],
    ['/reportes/', 'Reportes'],
    ['/servicios/', 'Servicios'],
    ['/servicios-generales/', 'Servicios Generales'],
    ['/sobre-nosotros/', 'Sobre Nosotros'],
    ['/socios/', 'Socios'],
    ['/socios-2/', 'Socios 2'],
    ['/whatsapp/', 'WhatsApp'],
  ].map(([path, label], i) => ({
    id: `d1-${String(i + 1).padStart(2, '0')}`,
    servicio: `Dev 1 – ${label}`,
    url: `https://36f6531a-bf05-4de9-8e88-70f328fddd84-00-2mkpr9yd2f9z4.worf.replit.dev${path}`,
    ambiente: 'Desarrollo' as Ambiente,
    tecnologia: 'React + Vite + Express',
    funcion: `Ruta de desarrollo: ${label}`,
    estado: 'Activo' as Estado,
    responsable: 'Equipo Dev',
    dependencias: 'Gemini API, Hunter.io API',
    observaciones: 'Entorno Replit principal',
  })),
  // ── Desarrollo – Replit secundario ──────────────────────────────────
  ...([
    ['/', 'Home'],
    ['/catalogo-servicios/', 'Catálogo de Servicios'],
    ['/register/', 'Registro'],
  ] as [string, string][]).map(([path, label], i) => ({
    id: `d2-${String(i + 1).padStart(2, '0')}`,
    servicio: `Dev 2 – ${label}`,
    url: `https://bbe371f2-6c4e-4c70-9c23-b0d941a3131d-00-232wexuylg1ly.worf.replit.dev${path}`,
    ambiente: 'Desarrollo' as Ambiente,
    tecnologia: 'React + Vite',
    funcion: `Ruta de segundo entorno: ${label}`,
    estado: 'Activo' as Estado,
    responsable: 'Equipo Dev',
    dependencias: '',
    observaciones: 'Entorno Replit secundario',
  })),
  // ── Externos ────────────────────────────────────────────────────────
  {
    id: 'e-01', servicio: 'Cloudflare', url: 'https://dash.cloudflare.com',
    ambiente: 'Externo', tecnologia: 'Cloudflare (CDN / DNS)', funcion: 'Dashboard, Email Routing, CDN y protección DNS',
    estado: 'Activo', responsable: 'Equipo Clientum', dependencias: 'DNS clientum.com.ar',
    observaciones: 'Gestiona email routing del dominio',
  },
  {
    id: 'e-02', servicio: 'Gmail', url: 'https://mail.google.com',
    ambiente: 'Externo', tecnologia: 'Google Workspace', funcion: 'Bandeja de entrada y comunicaciones',
    estado: 'Activo', responsable: 'Equipo Clientum', dependencias: 'Cloudflare Email Routing',
    observaciones: '',
  },
  {
    id: 'e-03', servicio: 'Hunter.io', url: 'https://hunter.io',
    ambiente: 'Externo', tecnologia: 'API REST', funcion: 'Búsqueda y verificación de emails para prospección',
    estado: 'Activo', responsable: 'Equipo Dev', dependencias: 'HUNTER_API_KEY (secret)',
    observaciones: 'Clave gestionada en Replit Secrets',
  },
  {
    id: 'e-04', servicio: 'Google Cloud Console', url: 'https://console.cloud.google.com',
    ambiente: 'Externo', tecnologia: 'Google Cloud Platform', funcion: 'API Credentials y servicios cloud',
    estado: 'Activo', responsable: 'Equipo Dev', dependencias: 'Google Maps API',
    observaciones: '',
  },
  {
    id: 'e-05', servicio: 'OpenRouter', url: 'https://openrouter.ai',
    ambiente: 'Externo', tecnologia: 'API REST (LLM proxy)', funcion: 'Workspace API Keys para modelos de IA alternativos',
    estado: 'En revisión', responsable: 'Equipo Dev', dependencias: '',
    observaciones: 'Evaluando uso vs Gemini directo',
  },
  {
    id: 'e-06', servicio: 'Google AI Studio', url: 'https://aistudio.google.com',
    ambiente: 'Externo', tecnologia: 'Google Gemini', funcion: 'Gestión de API Keys de Gemini',
    estado: 'Activo', responsable: 'Equipo Dev', dependencias: 'GEMINI_API_KEY (secret)',
    observaciones: 'Clave gestionada en Replit Secrets',
  },
  {
    id: 'e-07', servicio: 'Wiroos cPanel', url: 'https://wo52.wiroos.host:2083',
    ambiente: 'Externo', tecnologia: 'cPanel / Softaculous', funcion: 'Hosting producción: File Manager, BD, SSL',
    estado: 'Activo', responsable: 'Equipo Clientum', dependencias: 'Clientum Prod',
    observaciones: 'Acceso admin restringido',
  },
  {
    id: 'e-08', servicio: 'WordPress Plugin (repo)', url: 'https://es.wordpress.org/plugins/ai-marketing-expert/',
    ambiente: 'Externo', tecnologia: 'WordPress.org', funcion: 'Repositorio oficial del plugin AI Marketing Expert',
    estado: 'Activo', responsable: 'Equipo Dev', dependencias: 'WordPress.org',
    observaciones: '',
  },
  {
    id: 'e-09', servicio: 'Facebook Marketplace', url: 'https://www.facebook.com/marketplace',
    ambiente: 'Externo', tecnologia: 'Meta / Facebook', funcion: 'Canal de captación de leads',
    estado: 'Activo', responsable: 'Equipo Marketing', dependencias: '',
    observaciones: '',
  },
  {
    id: 'e-10', servicio: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs',
    ambiente: 'Externo', tecnologia: 'LinkedIn', funcion: 'Canal de prospección y empleo',
    estado: 'Activo', responsable: 'Equipo Marketing', dependencias: '',
    observaciones: '',
  },
  {
    id: 'e-11', servicio: 'Hotmart Marketplace', url: 'https://hotmart.com/es/marketplace',
    ambiente: 'Externo', tecnologia: 'Hotmart', funcion: 'Marketplace de productos digitales',
    estado: 'Activo', responsable: 'Equipo Marketing', dependencias: '',
    observaciones: '',
  },
];

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const AMBIENTES: Ambiente[] = ['Producción', 'Desarrollo', 'Externo'];

const ambienteStyle: Record<Ambiente, string> = {
  'Producción': 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.15)]',
  'Desarrollo': 'bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-[0_0_8px_rgba(14,165,233,0.15)]',
  'Externo':    'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_8px_rgba(99,102,241,0.15)]',
};

const estadoIcon: Record<Estado, React.ReactNode> = {
  'Activo':      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
  'En revisión': <Clock className="w-3.5 h-3.5 text-amber-400" />,
  'Inactivo':    <AlertCircle className="w-3.5 h-3.5 text-red-400" />,
};

const estadoTextStyle: Record<Estado, string> = {
  'Activo':      'text-emerald-400',
  'En revisión': 'text-amber-400',
  'Inactivo':    'text-red-400',
};

/* ── Export helpers ──────────────────────────────────────────────────────── */
function toCSV(rows: CMDBEntry[]): string {
  const headers = ['Servicio','URL','Ambiente','Tecnología','Función','Estado','Responsable','Dependencias','Observaciones'];
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = [
    headers.map(escape).join(','),
    ...rows.map(r => [
      r.servicio, r.url, r.ambiente, r.tecnologia, r.funcion,
      r.estado, r.responsable, r.dependencias, r.observaciones,
    ].map(escape).join(',')),
  ];
  return lines.join('\r\n');
}

function toMarkdown(rows: CMDBEntry[]): string {
  const cols = ['Servicio','URL','Ambiente','Tecnología','Función','Estado','Responsable','Dependencias','Observaciones'];
  const sep  = cols.map(() => '---').join(' | ');
  const keys: (keyof CMDBEntry)[] = ['servicio','url','ambiente','tecnologia','funcion','estado','responsable','dependencias','observaciones'];
  const lines = [
    `# Inventario de Infraestructura – Clientum\n`,
    `_Generado: ${new Date().toLocaleDateString('es-AR', { dateStyle: 'long' })}_\n`,
    `| ${cols.join(' | ')} |`,
    `| ${sep} |`,
    ...rows.map(r => `| ${keys.map(k => String(r[k]).replace(/\|/g, '\\|')).join(' | ')} |`),
  ];
  return lines.join('\n');
}

function download(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

/* ── Component ───────────────────────────────────────────────────────────── */
export default function CrmFullCMDB() {
  const [search, setSearch]           = useState('');
  const [filterAmbiente, setFilterAmbiente] = useState<Ambiente | 'Todos'>('Todos');
  const [filterEstado, setFilterEstado]     = useState<Estado | 'Todos'>('Todos');
  const [data, setData] = useState<CMDBEntry[]>(initialData);
  const [editingId, setEditingId]     = useState<string | null>(null);
  const [editRow, setEditRow]         = useState<CMDBEntry | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter(r =>
      (filterAmbiente === 'Todos' || r.ambiente === filterAmbiente) &&
      (filterEstado   === 'Todos' || r.estado   === filterEstado)   &&
      (q === '' ||
        r.servicio.toLowerCase().includes(q) ||
        r.url.toLowerCase().includes(q) ||
        r.tecnologia.toLowerCase().includes(q) ||
        r.funcion.toLowerCase().includes(q) ||
        r.responsable.toLowerCase().includes(q))
    );
  }, [data, search, filterAmbiente, filterEstado]);

  const counts = useMemo(() =>
    AMBIENTES.reduce((acc, a) => ({ ...acc, [a]: data.filter(r => r.ambiente === a).length }), {} as Record<string,number>)
  , [data]);

  function startEdit(row: CMDBEntry) { setEditingId(row.id); setEditRow({ ...row }); }
  function cancelEdit() { setEditingId(null); setEditRow(null); }
  function saveEdit() {
    if (!editRow) return;
    setData(prev => prev.map(r => r.id === editRow.id ? editRow : r));
    setEditingId(null); setEditRow(null);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 font-display tracking-wide flex items-center gap-3">
            <Database className="w-6 h-6 text-sky-400" />
            TOPOLOGÍA CMDB
          </h1>
          <p className="text-xs text-slate-500 font-mono tracking-wider uppercase">
            REGISTRO DE INFRAESTRUCTURA · {data.length} NODOS ACTIVOS
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => download(toCSV(filtered), 'clientum-infraestructura.csv', 'text/csv')}
            className="cockpit-button-secondary px-3 py-1.5 flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" /> CSV DUMP
          </button>
          <button
            onClick={() => download(toMarkdown(filtered), 'clientum-infraestructura.md', 'text/markdown')}
            className="cockpit-button-secondary px-3 py-1.5 flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" /> MD EXPORT
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-1 animate-slide-up">
        {([
          { label: 'TOTAL NODOS', value: data.length, color: 'text-slate-200 border-slate-700 bg-[#0A101F]', icon: <Server className="w-5 h-5 text-slate-400" /> },
          { label: 'PRODUCCIÓN', value: counts['Producción'] ?? 0, color: 'text-emerald-400 border-emerald-500/30 bg-[#0f172a] shadow-[0_0_15px_rgba(16,185,129,0.05)]', icon: <Globe className="w-5 h-5 text-emerald-400" /> },
          { label: 'DESARROLLO', value: counts['Desarrollo'] ?? 0, color: 'text-sky-400 border-sky-500/30 bg-[#0f172a] shadow-[0_0_15px_rgba(14,165,233,0.05)]', icon: <Code2 className="w-5 h-5 text-sky-400" /> },
          { label: 'EXTERNAL', value: counts['Externo'] ?? 0, color: 'text-indigo-400 border-indigo-500/30 bg-[#0f172a] shadow-[0_0_15px_rgba(99,102,241,0.05)]', icon: <ExternalLink className="w-5 h-5 text-indigo-400" /> },
        ] as const).map(({ label, value, color, icon }) => (
          <div key={label} className={`rounded-xl p-4 flex items-center gap-4 border ${color}`}>
            <div className="bg-[#030712] p-2 rounded-lg border border-[#1E293B]">
              {icon}
            </div>
            <div>
              <div className="text-2xl font-bold font-display tracking-wide">{value}</div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 stagger-2 animate-slide-up bg-[#0A101F] p-4 rounded-xl border border-[#1E293B]">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-500/50" />
          <input
            type="text"
            placeholder="CONSULTA GREP: URL, TECNOLOGÍA, SERVICIO..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="cockpit-input w-full pl-9 bg-[#030712] border-[#1E293B] focus:border-sky-500/50 text-xs font-mono uppercase tracking-wide"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-[#030712] border border-[#1E293B] p-2 rounded flex items-center justify-center">
            <Filter className="w-4 h-4 text-slate-500" />
          </div>
          <select
            value={filterAmbiente}
            onChange={e => setFilterAmbiente(e.target.value as Ambiente | 'Todos')}
            className="cockpit-input bg-[#030712] border-[#1E293B] text-[10px] font-mono uppercase tracking-widest"
          >
            <option value="Todos">ENV: TODOS</option>
            {AMBIENTES.map(a => <option key={a} value={a}>ENV: {a.toUpperCase()}</option>)}
          </select>
          <select
            value={filterEstado}
            onChange={e => setFilterEstado(e.target.value as Estado | 'Todos')}
            className="cockpit-input bg-[#030712] border-[#1E293B] text-[10px] font-mono uppercase tracking-widest"
          >
            <option value="Todos">STAT: TODOS</option>
            {(['Activo','En revisión','Inactivo'] as Estado[]).map(s => <option key={s} value={s}>STAT: {s.toUpperCase()}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="cockpit-panel overflow-hidden stagger-3 animate-slide-up">
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[1000px]">
            <thead>
              <tr className="border-b border-[#1E293B] bg-[#030712]">
                {['ID NODO','ENLACE DSN','ENV','STACK','OPERACIÓN','STAT','OWNER','DEP','NOTAS',''].map((h, i) => (
                  <th key={i} className="text-left px-4 py-3 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/50 font-mono text-[11px]">
              {filtered.map(row => {
                const isEditing = editingId === row.id;
                return (
                  <tr key={row.id} className="hover:bg-sky-500/5 transition-colors group">
                    {isEditing && editRow ? (
                      <>
                        <td className="px-4 py-2">
                          <input className="cockpit-input w-full p-1" value={editRow.servicio} onChange={e => setEditRow({ ...editRow, servicio: e.target.value })} />
                        </td>
                        <td className="px-2 py-2">
                          <input className="cockpit-input w-full p-1" value={editRow.url} onChange={e => setEditRow({ ...editRow, url: e.target.value })} />
                        </td>
                        <td className="px-2 py-2">
                          <select className="cockpit-input w-full p-1" value={editRow.ambiente} onChange={e => setEditRow({ ...editRow, ambiente: e.target.value as Ambiente })}>
                            {AMBIENTES.map(a => <option key={a}>{a.toUpperCase()}</option>)}
                          </select>
                        </td>
                        <td className="px-2 py-2">
                          <input className="cockpit-input w-full p-1" value={editRow.tecnologia} onChange={e => setEditRow({ ...editRow, tecnologia: e.target.value })} />
                        </td>
                        <td className="px-2 py-2">
                          <input className="cockpit-input w-full p-1" value={editRow.funcion} onChange={e => setEditRow({ ...editRow, funcion: e.target.value })} />
                        </td>
                        <td className="px-2 py-2">
                          <select className="cockpit-input w-full p-1" value={editRow.estado} onChange={e => setEditRow({ ...editRow, estado: e.target.value as Estado })}>
                            {(['Activo','En revisión','Inactivo'] as Estado[]).map(s => <option key={s}>{s.toUpperCase()}</option>)}
                          </select>
                        </td>
                        <td className="px-2 py-2">
                          <input className="cockpit-input w-full p-1" value={editRow.responsable} onChange={e => setEditRow({ ...editRow, responsable: e.target.value })} />
                        </td>
                        <td className="px-2 py-2">
                          <input className="cockpit-input w-full p-1" value={editRow.dependencias} onChange={e => setEditRow({ ...editRow, dependencias: e.target.value })} />
                        </td>
                        <td className="px-2 py-2">
                          <input className="cockpit-input w-full p-1" value={editRow.observaciones} onChange={e => setEditRow({ ...editRow, observaciones: e.target.value })} />
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex gap-2 justify-end">
                            <button onClick={saveEdit} className="p-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors"><CheckCircle2 className="w-4 h-4" /></button>
                            <button onClick={cancelEdit} className="p-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors"><AlertCircle className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 font-medium text-slate-300 font-display uppercase whitespace-nowrap max-w-[160px] truncate" title={row.servicio}>
                          <div className="flex items-center gap-2">
                            <Terminal className="w-3.5 h-3.5 text-slate-500 opacity-50" />
                            {row.servicio}
                          </div>
                        </td>
                        <td className="px-2 py-3 max-w-[200px]">
                          <a href={row.url} target="_blank" rel="noreferrer" className="text-sky-400 hover:text-sky-300 hover:underline truncate block" title={row.url}>
                            {row.url.replace(/^https?:\/\//, '')}
                          </a>
                        </td>
                        <td className="px-2 py-3">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest whitespace-nowrap ${ambienteStyle[row.ambiente]}`}>
                            {row.ambiente}
                          </span>
                        </td>
                        <td className="px-2 py-3 text-slate-400 max-w-[140px] truncate uppercase" title={row.tecnologia}>{row.tecnologia}</td>
                        <td className="px-2 py-3 text-slate-500 max-w-[180px] truncate" title={row.funcion}>{row.funcion}</td>
                        <td className="px-2 py-3">
                          <div className={`flex items-center gap-1.5 whitespace-nowrap font-bold uppercase tracking-widest text-[9px] ${estadoTextStyle[row.estado]}`}>
                            {estadoIcon[row.estado]} {row.estado}
                          </div>
                        </td>
                        <td className="px-2 py-3 text-slate-400 whitespace-nowrap uppercase">{row.responsable}</td>
                        <td className="px-2 py-3 text-slate-500 max-w-[160px] truncate uppercase" title={row.dependencias}>{row.dependencias || '—'}</td>
                        <td className="px-2 py-3 text-slate-500 max-w-[160px] truncate uppercase" title={row.observaciones}>{row.observaciones || '—'}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => startEdit(row)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded bg-[#030712] border border-[#1E293B] text-sky-400 hover:border-sky-500/50 hover:bg-sky-500/10"
                          >
                            MOD
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-12">
                    <p className="text-slate-500 font-display tracking-widest uppercase">RESULTADO DE CONSULTA: NULL</p>
                    <p className="text-[10px] text-slate-600 mt-2">NO SE ENCONTRARON NODOS QUE COINCIDAN CON LOS PARÁMETROS ESPECIFICADOS.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex justify-between items-center px-2">
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          SISTEMA EN LÍNEA Y ACTUALIZADO
        </p>
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          {filtered.length} / {data.length} REGISTROS RENDERIZADOS
        </p>
      </div>
    </div>
  );
}
