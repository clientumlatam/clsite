import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Loader2, Copy, CheckCircle2, FileText, Globe, Mail, MessageCircle, BarChart3, RefreshCw } from 'lucide-react';

type ContentType = 'blog' | 'landing' | 'email' | 'whatsapp' | 'reporte';

const CONTENT_TYPES: { id: ContentType; label: string; icon: React.ReactNode; desc: string; color: string }[] = [
  { id: 'blog',      label: 'Artículo Blog',    icon: <FileText className="w-4 h-4" />,     desc: 'SEO-friendly, tono conversacional',   color: 'text-violet-400' },
  { id: 'landing',   label: 'Landing Page',     icon: <Globe className="w-4 h-4" />,        desc: 'Orientada a conversión por industria', color: 'text-blue-400' },
  { id: 'email',     label: 'Email Marketing',  icon: <Mail className="w-4 h-4" />,         desc: 'Newsletter o cold email PyME',         color: 'text-amber-400' },
  { id: 'whatsapp',  label: 'Mensaje WhatsApp', icon: <MessageCircle className="w-4 h-4" />,desc: 'Corto, directo, sin emojis forzados',  color: 'text-[#10B981]' },
  { id: 'reporte',   label: 'Reporte Ejecutivo',icon: <BarChart3 className="w-4 h-4" />,    desc: 'Métricas y resumen semanal',           color: 'text-sky-400' },
];

const QUICK_PROMPTS: Record<ContentType, string[]> = {
  blog:     ['Artículo sobre CRM para ferreterías en Neuquén', 'Guía: cómo organizar vendedores en una PyME', '5 errores que cometen las distribuidoras sin sistema'],
  landing:  ['Landing para distribuidoras mayoristas Patagonia', 'Página de servicios para clínicas de salud', 'Propuesta de valor para talleres mecánicos RN'],
  email:    ['Newsletter mensual con tips de ventas', 'Cold email para inmobiliarias de Bariloche', 'Email de seguimiento post-demo'],
  whatsapp: ['Primer contacto con distribuidor potencial', 'Follow-up 48h sin respuesta', 'Mensaje de cierre con oferta de implementación'],
  reporte:  ['Resumen semanal del pipeline de ventas', 'Reporte de leads capturados este mes', 'Estado de agentes IA y métricas de actividad'],
};

const GENERATED_SAMPLES: Record<ContentType, string> = {
  blog: `# CRM para Ferreterías en la Patagonia: La Guía Definitiva

Si tenés una ferretería en Neuquén, Río Negro o Chubut y todavía manejás tus ventas en Excel (o en un cuaderno), este artículo es para vos.

## El problema real de las ferreterías sin sistema

La mayoría de las ferreterías que vemos en la Patagonia tienen el mismo problema: **vendedores excelentes, pero sin visibilidad de qué está pasando**. Un cliente llama, queda en "le aviso" y nadie le avisa. Otro pide presupuesto y la planilla tiene 47 versiones.

## Qué necesita una ferretería de verdad

No necesitás un ERP de $50.000 dólares. Necesitás:
- Ver qué clientes compraron hace más de 60 días y todavía no volvieron
- Saber qué vendedor cerró más esta semana
- Recibir las consultas de WhatsApp directo al sistema, sin copiar y pegar

## Clientum CRM: pensado para PyMEs patagónicas

Clientum se integra con WhatsApp, capta leads del sitio web y te da un pipeline visual en 5 minutos. Sin instalación, sin IT.

*¿Querés verlo en acción? [Agendá una demo gratuita](https://clientum.com.ar)*`,

  landing: `**CRM para Distribuidoras Mayoristas en la Patagonia**

Organizá tus vendedores. Seguí cada cliente. Cerrá más sin contratar más gente.

→ Sin instalaciones largas
→ Integrado con WhatsApp
→ Tus datos en Patagonia, no en servidores lejanos

[Ver demo gratuita →]`,

  email: `Asunto: Tu ferretería necesita esto (y no es lo que creés)

Hola [Nombre],

Vi que tienen una ferretería en [Ciudad] y quería preguntarte algo directo: ¿cuántos clientes perdieron seguimiento el mes pasado?

La mayoría de las ferreterías con las que hablo me dicen que entre 3 y 8 oportunidades se "pierden" cada mes simplemente porque no hay un sistema para hacer el seguimiento.

Con Clientum, eso se resuelve en una semana.

¿Tenés 20 minutos esta semana para una demo sin compromisos?

Santi
Clientum · Neuquén Capital
+54 299 000-0000`,

  whatsapp: `Hola [Nombre], soy Santi de Clientum. Vi que tienen [Empresa] en [Ciudad].

Trabajo con varias distribuidoras de la zona organizando el seguimiento de clientes y el pipeline de ventas con IA.

¿Les resulta útil hablar esta semana? No es más de 20 minutos.`,

  reporte: `**Reporte Ejecutivo — Semana del 14 al 18 de julio**

**Pipeline:** 8 deals activos · $480K en negociación · 2 cierres proyectados esta semana

**Leads:**
- 12 leads nuevos (6 chatbot, 4 prospector, 2 manual)
- Tasa de calificación: 67% (8 de 12 pasaron filtro MEDDIC)

**Santi SDR:** 28 contactos · 9 respuestas (32%) · 1 demo agendada

**Prioridades sugeridas:**
1. Seguir a Distribuidora Andina (demo pendiente confirmación)
2. Reactivar 3 leads de junio sin respuesta reciente
3. Publicar artículo SEO sobre ferreterías (listo para subir)`,
};

interface Message { role: 'user' | 'assistant'; content: string; }

export default function CopiloIAPanel() {
  const [contentType, setContentType] = useState<ContentType>('blog');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    const sample = GENERATED_SAMPLES[contentType];
    setMessages(prev => [...prev, { role: 'assistant', content: sample }]);
    setLoading(false);
  };

  const copyLast = () => {
    const last = messages.filter(m => m.role === 'assistant').at(-1);
    if (!last) return;
    navigator.clipboard.writeText(last.content).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lastAssistant = messages.filter(m => m.role === 'assistant').at(-1);

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] text-slate-200 gap-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#10B981]/15 border border-[#10B981]/30 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#10B981]" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">Copiloto IA</h1>
            <p className="text-slate-500 text-xs">Generador de contenido · Adaptado a PyMEs patagónicas</p>
          </div>
        </div>
        {lastAssistant && (
          <button onClick={copyLast} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 border border-[#1E293B] px-3 py-2 rounded-lg transition-all">
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copiado' : 'Copiar resultado'}
          </button>
        )}
      </div>

      {/* Content type selector */}
      <div className="flex gap-2 flex-wrap flex-shrink-0">
        {CONTENT_TYPES.map(ct => (
          <button key={ct.id} onClick={() => { setContentType(ct.id); setMessages([]); }}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              contentType === ct.id ? 'bg-[#0D1424] border-[#10B981]/40 text-[#10B981]' : 'border-[#1E293B] text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}>
            <span className={ct.color}>{ct.icon}</span>
            {ct.label}
          </button>
        ))}
      </div>

      {/* Chat area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 min-h-0">
        {messages.length === 0 ? (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 uppercase tracking-widest">Accesos rápidos</p>
            {QUICK_PROMPTS[contentType].map(p => (
              <button key={p} onClick={() => send(p)}
                className="w-full text-left flex items-center gap-3 bg-[#0D1424] border border-[#1E293B] hover:border-slate-600 rounded-xl px-4 py-3 text-sm text-slate-300 transition-all group">
                <Sparkles className="w-4 h-4 text-[#10B981]/50 group-hover:text-[#10B981] flex-shrink-0 transition-all" />
                {p}
              </button>
            ))}
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' ? (
                <div className="bg-[#0D1424] border border-[#1E293B] rounded-2xl rounded-tl-none p-4 max-w-[90%]">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
                    <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-wider">Copiloto IA</span>
                  </div>
                  <pre className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">{m.content}</pre>
                </div>
              ) : (
                <div className="bg-[#10B981]/15 border border-[#10B981]/30 rounded-2xl rounded-tr-none px-4 py-3 max-w-[80%]">
                  <p className="text-sm text-slate-200">{m.content}</p>
                </div>
              )}
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#0D1424] border border-[#1E293B] rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-[#10B981] animate-spin" />
              <span className="text-xs text-slate-400">Generando contenido…</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send(input))}
          placeholder={`Describí qué ${CONTENT_TYPES.find(c => c.id === contentType)?.label.toLowerCase()} necesitás…`}
          className="flex-1 bg-[#0D1424] border border-[#1E293B] focus:border-[#10B981]/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition-all" />
        <button onClick={() => send(input)} disabled={!input.trim() || loading}
          className="w-12 h-12 bg-[#10B981] hover:bg-[#059669] disabled:opacity-40 rounded-xl flex items-center justify-center flex-shrink-0 transition-all">
          {loading ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white" />}
        </button>
      </div>
    </div>
  );
}
