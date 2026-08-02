import React from 'react';
import { Bot, MessageCircle, Zap, ExternalLink, CheckCircle, Info, Activity, Terminal } from 'lucide-react';

const steps = [
  { num: 1, title: 'Enlace WhatsApp Business', desc: 'Escanea el código QR desde el módulo de configuración para emparejar el terminal.', done: false },
  { num: 2, title: 'Prueba de Sistema', desc: 'Transmite un paquete de prueba al nodo para verificar la recepción y respuesta.', done: false },
  { num: 3, title: 'Calibración de IA', desc: 'Ajusta los umbrales de confianza y las respuestas programadas del LLM.', done: false },
  { num: 4, title: 'Despliegue a Producción', desc: 'Habilita el enrutamiento público para procesar solicitudes de clientes.', done: false },
];

const menuItems = [
  { key: '1', icon: '💰', label: 'Consultar precios', desc: 'Busca por nombre o código en el catálogo' },
  { key: '2', icon: '🕐', label: 'Ver horarios', desc: 'Horarios de cada sucursal' },
  { key: '3', icon: '📍', label: 'Ubicar sucursal', desc: 'Dirección y teléfono de las 4 sucursales' },
  { key: '4', icon: '👤', label: 'Hablar con vendedor', desc: 'Derivación inteligente por especialidad' },
  { key: '5', icon: '❓', label: 'Otra consulta', desc: 'Asistencia general' },
];

const derivationRules = [
  { trigger: 'Caños, accesorios PP/SIGAS, válvulas', specialist: '🔧 Plomería' },
  { trigger: 'Cables, enchufes, térmicas, llaves de luz', specialist: '⚡ Electricidad' },
  { trigger: 'Pinturas, aerosoles, rodillos, barniz', specialist: '🎨 Pintura' },
  { trigger: 'Cemento, ladrillos, hierros, mallas', specialist: '🏗️ Construcción' },
  { trigger: 'Cerámicos, porcellanatos', specialist: '🪟 Cerámicos' },
  { trigger: 'Herramientas manuales y eléctricas', specialist: '🛠️ Herramientas' },
  { trigger: 'Consultas generales', specialist: '📋 General' },
];

export default function CrmFullBotConfig() {
  const whatsappURL = 'https://wa.me/5492994510883';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 font-display tracking-wide flex items-center gap-3">
            <Bot className="w-6 h-6 text-emerald-400" />
            NÚCLEO IA WA
          </h1>
          <p className="text-xs text-slate-500 font-mono tracking-wider uppercase">
            CONFIGURACIÓN DE ASISTENTE AUTÓNOMO · ESTADO DEL MÓDULO
          </p>
        </div>
        <a href={whatsappURL} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded py-2 px-4 text-[10px] font-bold tracking-widest uppercase font-mono transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] flex items-center">
            <MessageCircle className="w-4 h-4 mr-2" />
            ENLAZAR WHATSAPP
            <ExternalLink className="w-3 h-3 ml-2 opacity-70" />
          </button>
        </a>
      </div>

      <div className="cockpit-panel border-emerald-500/30 bg-[#0f172a] overflow-hidden relative stagger-1 animate-slide-up">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full filter blur-[60px] pointer-events-none" />
        <div className="p-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-16 h-16 rounded-xl bg-[#030712] border border-[#1E293B] shadow-[inset_0_0_20px_rgba(16,185,129,0.1)] flex items-center justify-center flex-shrink-0 relative">
              <Bot className="w-8 h-8 text-emerald-400" />
              <div className="absolute top-0 left-0 w-full h-full border border-emerald-500/50 rounded-xl animate-[pulse_2s_ease-in-out_infinite]" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                <h3 className="font-bold text-lg text-white font-display tracking-widest uppercase">ASISTENTE VIRTUAL GAMAN</h3>
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400">SISTEMA OPERATIVO 24/7</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 font-mono tracking-wide leading-relaxed">
                NODO: GAMAN FERRETERÍA Y CORRALÓN // UBICACIÓN: NEUQUÉN CAPITAL // RADIO: 4 SUCURSALES // MOTOR: CLIENTUM LLM
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 stagger-2 animate-slide-up">
        <div className="cockpit-panel p-5 relative overflow-hidden group">
          <div className="flex items-center gap-2 mb-5 border-b border-[#1E293B] pb-3">
            <Terminal className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white font-display tracking-wide uppercase">
              ÁRBOL DE NAVEGACIÓN (MENÚ)
            </h3>
          </div>
          
          <div className="space-y-3">
            {menuItems.map(item => (
              <div key={item.key} className="flex items-start gap-4 p-3 bg-[#030712] border border-[#1E293B] rounded hover:border-[#334155] transition-colors group-hover:bg-[#0A101F]">
                <div className="w-8 h-8 rounded bg-[#1E293B] border border-[#334155] flex items-center justify-center flex-shrink-0 text-sm font-bold text-sky-400 font-mono shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                  {item.key}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200 font-display tracking-wide uppercase flex items-center gap-2">
                    <span className="text-base">{item.icon}</span> {item.label}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono mt-1 tracking-widest uppercase">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cockpit-panel p-5 relative overflow-hidden group">
          <div className="flex items-center gap-2 mb-5 border-b border-[#1E293B] pb-3">
            <Zap className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white font-display tracking-wide uppercase">
              REGLAS DE ENRUTAMIENTO (NLP)
            </h3>
          </div>
          
          <div className="space-y-2.5">
            {derivationRules.map((rule, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-[#030712] border border-[#1E293B] rounded hover:border-[#334155] transition-colors">
                <div className="flex-1">
                  <p className="text-[10px] text-slate-400 font-mono tracking-wide leading-relaxed">
                    <span className="text-indigo-500 mr-1">IF</span> "{rule.trigger}"
                  </p>
                </div>
                <div className="bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-400 whitespace-nowrap self-start sm:self-auto">
                  <span className="text-indigo-500/50 mr-1">THEN</span> {rule.specialist}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="cockpit-panel p-5 stagger-3 animate-slide-up">
        <div className="flex items-center gap-2 mb-5 border-b border-[#1E293B] pb-3">
          <Activity className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white font-display tracking-wide uppercase">
            SECUENCIA DE INICIALIZACIÓN
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step) => (
            <div key={step.num} className={`p-4 rounded border ${step.done ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-[#030712] border-[#1E293B]'}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-mono font-bold shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] flex-shrink-0 ${
                  step.done ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-[#1E293B] text-slate-400 border border-[#334155]'
                }`}>
                  {step.done ? <CheckCircle className="w-4 h-4" /> : `S${step.num}`}
                </div>
                <p className={`text-xs font-bold font-display uppercase tracking-widest ${step.done ? 'text-emerald-400' : 'text-slate-300'}`}>
                  {step.title}
                </p>
              </div>
              <p className="text-[10px] text-slate-500 font-mono tracking-wide leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-5 p-4 bg-sky-500/10 border border-sky-500/20 rounded flex items-start gap-3">
          <Info className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-sky-400 font-display tracking-widest uppercase mb-1">TELEMETRÍA DE ASISTENCIA</p>
            <p className="text-[10px] text-slate-400 font-mono leading-relaxed">
              EJECUTA LA RUTINA "ENLAZAR WHATSAPP" PARA SINCRONIZAR EL TERMINAL. UNA VEZ ESTABLECIDA LA CONEXIÓN (HANDSHAKE OK), EL SUBSISTEMA IA TOMARÁ CONTROL DEL CANAL ENTRANTE.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
