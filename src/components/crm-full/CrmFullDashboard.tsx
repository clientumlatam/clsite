import React, { useState } from 'react';
import { Sparkles, Quote, Bot, Zap, Clock, TrendingUp, Layers, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const automationData = [
  { name: 'Resueltas por IA', value: 80, color: '#38bdf8' },
  { name: 'Derivadas a Humanos', value: 20, color: '#1e293b' },
];

const timeData = [
  { label: 'Antes', carga: 8, liberadas: 0 },
  { label: 'Con Clientum', carga: 5, liberadas: 3 },
];

const problems = [
  { id: 'sol-crm', icon: <Clock className="w-6 h-6 text-amber-400" />, title: 'Tareas Repetitivas', desc: 'Presupuestos, seguimientos y respuestas manuales que consumen horas invaluables del equipo.' },
  { id: 'sol-chat', icon: <Zap className="w-6 h-6 text-sky-400" />, title: 'Respuestas Lentas', desc: 'Mientras el equipo se demora, la competencia responde al instante y se lleva al cliente.' },
  { id: 'sol-bi', icon: <Layers className="w-6 h-6 text-indigo-400" />, title: 'Datos Dispersos', desc: 'Información vital perdida entre WhatsApp, Excel y correos sin un sistema central de control.' },
  { id: 'sol-erp', icon: <TrendingUp className="w-6 h-6 text-emerald-400" />, title: 'Dificultad para Escalar', desc: 'Sin automatización, crecer significa inevitablemente contratar más gente para hacer lo mismo.' },
];

const solutions = [
  { id: 'sol-crm', title: 'CRM + Automatización', items: ['Scoring automático de leads', 'Pipeline visual e intuitivo', 'Follow-up inteligente con IA'] },
  { id: 'sol-chat', title: 'Chatbot Inteligente 24/7', items: ['Atención ininterrumpida en WhatsApp', 'Aprende de las dinámicas del negocio', 'Deriva casos complejos al equipo'] },
  { id: 'sol-bi', title: 'Reportes y Dashboards', items: ['Datos unificados en tiempo real', 'Alertas proactivas por WhatsApp', 'Predicciones de ventas con IA'] },
  { id: 'sol-erp', title: 'ERP Integrado con IA', desc: 'Plataforma unificada para la gestión empresarial que absorbe la carga operativa, permitiendo escalar ventas sin aumentar el equipo administrativo.' },
];

const pitches: Record<string, { text: string; tip: string; label: string }> = {
  estandar: { text: 'Clientum ayuda a PyMEs a crecer con IA, ahorrando hasta 3 horas diarias y resolviendo el 80% de las consultas automáticamente. Con CRM inteligente, chatbot 24/7, reportes en tiempo real y ERP integrado, tu negocio escala sin sumar más carga operativa.', tip: 'Usa este mensaje para dar un resumen completo y estructurado de la plataforma en unos pocos segundos.', label: 'Presentación General' },
  elevator: { text: 'Clientum potencia tu PyME con IA, ahorrando horas de trabajo y resolviendo el 80% de las consultas automáticamente, para que escales sin esfuerzo.', tip: 'Ideal para cruces rápidos de pasillo, eventos de networking o intros de menos de 10 segundos.', label: 'Reunión Rápida (1 frase)' },
  comercial: { text: 'Hoy tu competencia ya está respondiendo en segundos y escalando con IA; con Clientum, tu PyME puede ahorrar horas, vender más y crecer sin sumar costos.', tip: 'Excelente para iniciar una llamada en frío o captar la atención en los primeros minutos de una demostración.', label: 'Apertura de Ventas (Gancho)' },
  aspiracional: { text: 'Imaginá tu PyME funcionando como una gran empresa: procesos automáticos, clientes atendidos al instante y decisiones basadas en datos. Con Clientum, la IA deja de ser un lujo y se convierte en tu ventaja competitiva.', tip: 'Perfecto para reuniones de planificación estratégica o presentación a posibles inversores y socios clave.', label: 'Visión a Inversores/Socios' },
  emocional: { text: 'Sabemos lo agotador que es responder clientes a toda hora y sentir que no alcanza el tiempo. La IA de Clientum libera a tu equipo de tareas repetitivas y te devuelve la tranquilidad de enfocarte en hacer crecer tu negocio.', tip: 'Úsalo cuando el prospecto exprese estrés operativo, cansancio o cuellos de botella en la atención al cliente.', label: 'Dueño de PyME Agotado' },
  motivacional: { text: 'Cada hora que antes se perdía en tareas manuales ahora es tiempo para innovar y vender más. La IA no reemplaza a tu equipo: lo potencia, lo libera y lo convierte en protagonista del futuro de la empresa.', tip: 'El mensaje ideal para calmar incertidumbres internas y fomentar la adopción de la herramienta en el equipo de la PyME.', label: 'Kick-off con Equipo Interno' },
  competitivo: { text: 'Mientras otros siguen atados a procesos manuales y respuestas lentas, tu PyME destaca con Clientum: IA que responde en segundos, centraliza datos y te da la ventaja para crecer más rápido que el resto.', tip: 'Útil en mercados saturados donde la velocidad de respuesta frente a un lead define quién cierra la venta.', label: 'Enfoque Anti-Competencia' },
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#030712] border border-[#1E293B] text-slate-200 text-xs rounded-lg px-3 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color || p.payload?.color }} />
          <span className="font-mono">{p.name}: {p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function CrmFullDashboard() {
  const [active, setActive] = useState<string | null>(null);
  const [pitchKey, setPitchKey] = useState('estandar');
  const pitch = pitches[pitchKey];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* PlaybookHero */}
      <section className="cockpit-panel relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-sky-500/10 rounded-full mix-blend-screen filter blur-[80px] pointer-events-none transition-all duration-1000 group-hover:bg-sky-500/20" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-indigo-500/10 rounded-full mix-blend-screen filter blur-[80px] pointer-events-none transition-all duration-1000 group-hover:bg-indigo-500/20" />
        <div className="relative z-10 p-8 md:p-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Playbook Interno de Ventas
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight leading-[1.1] mb-4">
            Tu PyME merece trabajar con IA.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">Dejá de hacerlo todo a mano.</span>
          </h1>
          <p className="text-base text-slate-400 leading-relaxed max-w-2xl font-mono">
            ESTADO DEL SISTEMA: OPTIMIZADO. ESTA HERRAMIENTA CENTRALIZA LOS DATOS DE IMPACTO, EL MAPEO DE SOLUCIONES Y LOS MENSAJES CLAVE PARA COMUNICAR EL VALOR DE CLIENTUM.
          </p>
        </div>
      </section>

      {/* ImpactMetrics */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="cockpit-panel p-6 flex flex-col stagger-1 animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">Resolución Automática</h3>
              <p className="text-xs text-slate-500 font-mono">PROPORCIÓN DE CONSULTAS (S/HUMANOS)</p>
            </div>
          </div>
          <div className="flex-1 min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={automationData} dataKey="value" nameKey="name" innerRadius="65%" outerRadius="90%" stroke="none" paddingAngle={2}>
                  {automationData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="cockpit-panel p-6 flex flex-col stagger-2 animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">Ahorro de Tiempo Diario</h3>
              <p className="text-xs text-slate-500 font-mono">IMPACTO EN LA JORNADA LABORAL (HS)</p>
            </div>
          </div>
          <div className="flex-1 min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#0f172a' }} content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                <Bar dataKey="carga" name="Carga Operativa (hs)" fill="#1e293b" radius={[4, 4, 0, 0]} barSize={40} stackId="a" />
                <Bar dataKey="liberadas" name="Horas Liberadas (hs)" fill="#38bdf8" radius={[4, 4, 0, 0]} barSize={40} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* ProblemSolutionMap */}
      <section className="cockpit-panel p-6 stagger-3 animate-slide-up">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-white mb-1 font-display tracking-wide uppercase">Mapeo del Problema a la Solución</h2>
          <p className="text-xs text-slate-500 font-mono">SELECCIONA UN PROBLEMA PARA DESCUBRIR LA SOLUCIÓN RECOMENDADA.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4 font-mono">
              <span className="w-4 h-px bg-slate-600" /> Anomalía Detectada
            </h3>
            {problems.map((p) => (
              <button
                key={p.id}
                onClick={() => setActive(p.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                  active === p.id 
                    ? 'bg-slate-800/80 border-slate-500 shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                    : 'bg-[#0A101F] border-[#1E293B] hover:bg-[#0f172a] hover:border-[#334155]'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-[#030712] p-2 rounded-lg border border-[#1E293B]">{p.icon}</div>
                  <div>
                    <h4 className="font-bold text-slate-200 text-sm font-display tracking-wide">{p.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-sky-400 uppercase tracking-widest flex items-center gap-2 mb-4 font-mono">
              <span className="w-4 h-px bg-sky-500/50" /> Solución Sugerida
            </h3>
            {solutions.map((s) => {
              const isActive = active === s.id;
              return (
                <div
                  key={s.id}
                  className={`p-4 rounded-xl border transition-all duration-500 relative overflow-hidden ${
                    isActive 
                      ? 'bg-sky-500/5 border-sky-500/30 shadow-[0_0_20px_rgba(14,165,233,0.1)]' 
                      : 'bg-[#0A101F] border-[#1E293B] opacity-40 scale-[0.98]'
                  }`}
                >
                  <div className={`absolute top-0 left-0 w-1 h-full bg-sky-400 transition-transform duration-300 ${isActive ? 'scale-y-100' : 'scale-y-0'}`} />
                  <div className="flex items-start gap-4 pl-2">
                    <div className="mt-1">
                      <ArrowRight className={`w-5 h-5 transition-colors ${isActive ? 'text-sky-400' : 'text-slate-600'}`} />
                    </div>
                    <div>
                      <h4 className={`font-bold text-sm font-display tracking-wide transition-colors ${isActive ? 'text-sky-300' : 'text-slate-400'}`}>{s.title}</h4>
                      {s.items ? (
                        <ul className="text-xs text-slate-400 mt-3 space-y-2">
                          {s.items.map((it) => (
                            <li key={it} className="flex items-center gap-2">
                              <span className="w-1 h-1 bg-sky-500/50 rounded-full" /> {it}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">{s.desc}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PitchEngine */}
      <section className="cockpit-panel overflow-hidden flex flex-col md:flex-row stagger-4 animate-slide-up">
        <div className="bg-[#0f172a] p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-[#1E293B] flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white mb-1 font-display tracking-wide uppercase">Motor de Ventas</h2>
            <p className="text-xs text-slate-500 font-mono">SELECCIONA EL CONTEXTO.</p>
          </div>
          <div className="flex-1">
            <select
              value={pitchKey}
              onChange={(e) => setPitchKey(e.target.value)}
              className="w-full bg-[#030712] border border-[#1E293B] text-slate-200 text-sm rounded-lg p-3 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 cursor-pointer mb-6"
            >
              {Object.entries(pitches).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
            <div className="p-4 bg-sky-500/5 border border-sky-500/10 rounded-lg">
              <div className="text-sky-400 text-[10px] font-bold uppercase tracking-wider mb-2 font-mono flex items-center gap-2">
                <Zap className="w-3 h-3" /> Objetivo
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{pitch.tip}</p>
            </div>
          </div>
        </div>
        <div className="p-8 md:p-10 md:w-2/3 flex flex-col justify-center min-h-[250px] relative bg-[#0A101F]">
          <Quote className="absolute top-6 left-6 w-16 h-16 text-slate-800/30" />
          <p className="text-lg md:text-xl text-slate-300 font-medium relative z-10 leading-relaxed font-display">
            {pitch.text}
          </p>
          <Quote className="absolute bottom-6 right-6 w-16 h-16 text-slate-800/30 rotate-180" />
        </div>
      </section>
    </div>
  );
}
