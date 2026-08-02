import React, { useState } from 'react';
import { Mail, CheckCircle2, Users, BarChart2, Send, Zap, Clock, Plus, Eye } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  status: 'enviada' | 'programada' | 'borrador';
  suscriptores: number;
  aperturas: number;
  clics: number;
  fecha: string;
  asunto: string;
}

const CAMPAIGNS: Campaign[] = [
  { id: '1', name: 'Bienvenida PyMEs Julio', status: 'enviada', suscriptores: 142, aperturas: 89, clics: 34, fecha: '15 Jul 2026', asunto: '¡Bienvenido a Clientum! Tu CRM ya está listo 🚀' },
  { id: '2', name: 'Promo Plan Corporativo', status: 'enviada', suscriptores: 142, aperturas: 67, clics: 18, fecha: '10 Jul 2026', asunto: '20% OFF en Plan Corporativo — solo hasta el viernes' },
  { id: '3', name: 'Newsletter Agosto — IA Tips', status: 'programada', suscriptores: 149, aperturas: 0, clics: 0, fecha: '1 Ago 2026', asunto: '5 automatizaciones que podés activar esta semana' },
  { id: '4', name: 'Reactivación leads fríos', status: 'borrador', suscriptores: 0, aperturas: 0, clics: 0, fecha: '—', asunto: '¿Seguís buscando una solución para tu negocio?' },
];

const STATUS_CFG = {
  enviada:    { label: 'Enviada',    color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/30' },
  programada: { label: 'Programada', color: 'text-sky-400',     bg: 'bg-sky-400/10 border-sky-400/30' },
  borrador:   { label: 'Borrador',   color: 'text-slate-400',   bg: 'bg-slate-400/10 border-slate-400/30' },
};

const TEMPLATES = [
  { name: 'Bienvenida', desc: 'Para nuevos suscriptores o leads convertidos', icon: '👋' },
  { name: 'Promo flash', desc: 'Oferta con contador de tiempo', icon: '⚡' },
  { name: 'Newsletter mensual', desc: 'Resumen de novedades y consejos', icon: '📰' },
  { name: 'Reactivación', desc: 'Para leads sin actividad en 30+ días', icon: '🔁' },
  { name: 'Caso de éxito', desc: 'Historia de cliente + CTA', icon: '⭐' },
  { name: 'Seguimiento post-demo', desc: 'Después de una reunión de ventas', icon: '🤝' },
];

export default function WpEmailMarketing() {
  const [view, setView] = useState<'campaigns' | 'templates' | 'new'>('campaigns');

  const sent = CAMPAIGNS.filter(c => c.status === 'enviada');
  const avgOpen = sent.length ? Math.round(sent.reduce((a, c) => a + (c.aperturas / c.suscriptores) * 100, 0) / sent.length) : 0;
  const avgClick = sent.length ? Math.round(sent.reduce((a, c) => a + (c.clics / c.suscriptores) * 100, 0) / sent.length) : 0;

  return (
    <div className="space-y-8 text-slate-200">
      {/* Header */}
      <div className="flex items-start gap-4 flex-wrap">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <Mail className="w-7 h-7 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">Email Marketing</h1>
            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Activo
            </span>
          </div>
          <p className="text-slate-400 text-sm max-w-2xl">
            Campañas de email automatizadas con IA. Gestiona suscriptores, diseña newsletters y trackea aperturas y clics.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Suscriptores', value: '149', icon: <Users className="w-5 h-5 text-blue-400" />, border: 'border-blue-500/30', note: 'ilimitados' },
          { label: 'Campañas enviadas', value: '2', icon: <Send className="w-5 h-5 text-emerald-400" />, border: 'border-emerald-500/30', note: `plan free: 10 máx.` },
          { label: 'Tasa apertura promedio', value: `${avgOpen}%`, icon: <Eye className="w-5 h-5 text-amber-400" />, border: 'border-amber-500/30', note: 'benchmark: 22%' },
          { label: 'Tasa de clics', value: `${avgClick}%`, icon: <BarChart2 className="w-5 h-5 text-sky-400" />, border: 'border-sky-500/30', note: 'benchmark: 3%' },
        ].map(s => (
          <div key={s.label} className={`bg-[#0A101F]/60 border ${s.border} rounded-xl p-4`}>
            <div className="flex items-center justify-between mb-1">{s.icon}<span className="text-2xl font-bold text-white">{s.value}</span></div>
            <p className="text-xs text-slate-400">{s.label}</p>
            <p className="text-[10px] text-slate-600 mt-0.5">{s.note}</p>
          </div>
        ))}
      </div>

      {/* Sub-nav */}
      <div className="flex gap-2 border-b border-[#1E293B] pb-0">
        {(['campaigns', 'templates', 'new'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-all -mb-px ${
              view === v
                ? 'border-blue-400 text-blue-300 bg-blue-500/5'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            {v === 'campaigns' ? '📋 Campañas' : v === 'templates' ? '🎨 Templates' : '+ Nueva campaña'}
          </button>
        ))}
      </div>

      {/* Campaigns list */}
      {view === 'campaigns' && (
        <div className="space-y-3">
          {CAMPAIGNS.map(c => {
            const s = STATUS_CFG[c.status];
            const openRate = c.suscriptores > 0 ? Math.round((c.aperturas / c.suscriptores) * 100) : 0;
            const clickRate = c.suscriptores > 0 ? Math.round((c.clics / c.suscriptores) * 100) : 0;
            return (
              <div key={c.id} className="bg-[#0A101F]/60 border border-[#1E293B] rounded-xl p-5 hover:border-blue-500/20 transition-colors">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-semibold text-white text-sm">{c.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${s.bg} ${s.color} font-semibold`}>{s.label}</span>
                    </div>
                    <p className="text-xs text-slate-500 italic mb-3">"{c.asunto}"</p>
                    {c.status === 'enviada' && (
                      <div className="flex gap-6 text-xs">
                        <div><span className="text-slate-500">Suscriptores:</span> <span className="text-white font-semibold">{c.suscriptores}</span></div>
                        <div><span className="text-slate-500">Aperturas:</span> <span className="text-emerald-400 font-semibold">{openRate}%</span></div>
                        <div><span className="text-slate-500">Clics:</span> <span className="text-sky-400 font-semibold">{clickRate}%</span></div>
                      </div>
                    )}
                    {c.status === 'programada' && (
                      <div className="flex items-center gap-1.5 text-xs text-sky-400">
                        <Clock className="w-3.5 h-3.5" /> Envío programado: {c.fecha}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button className="px-3 py-1.5 text-xs border border-[#1E293B] text-slate-400 hover:text-slate-200 rounded-lg transition-colors">Ver</button>
                    {c.status === 'borrador' && (
                      <button className="px-3 py-1.5 text-xs bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors flex items-center gap-1">
                        <Send className="w-3.5 h-3.5" /> Enviar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Templates */}
      {view === 'templates' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEMPLATES.map(t => (
            <div key={t.name} className="bg-[#0A101F]/60 border border-[#1E293B] rounded-xl p-5 hover:border-blue-500/30 transition-all cursor-pointer group">
              <span className="text-2xl mb-3 block">{t.icon}</span>
              <p className="font-semibold text-white text-sm mb-1 group-hover:text-blue-300 transition-colors">{t.name}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{t.desc}</p>
              <p className="text-xs text-blue-400 mt-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                Generar con IA <Zap className="w-3 h-3" />
              </p>
            </div>
          ))}
        </div>
      )}

      {/* New campaign */}
      {view === 'new' && (
        <div className="bg-[#0A101F]/60 border border-[#1E293B] rounded-xl p-6 space-y-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-400" /> Nueva Campaña
          </h2>
          {[
            { label: 'Nombre de la campaña', placeholder: 'Ej: Newsletter Agosto 2026' },
            { label: 'Asunto del email', placeholder: 'Ej: 5 tips de IA para tu negocio este mes' },
          ].map(f => (
            <div key={f.label}>
              <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2 block">{f.label}</label>
              <input placeholder={f.placeholder} className="w-full bg-[#030712] border border-[#1E293B] rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/40" />
            </div>
          ))}
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2 block">Contenido del email</label>
            <textarea rows={6} placeholder="Escribí el cuerpo del email o generalo con IA..." className="w-full bg-[#030712] border border-[#1E293B] rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/40 resize-none" />
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg text-sm font-semibold hover:bg-blue-500/20 transition-all">
              <Zap className="w-4 h-4" /> Generar con IA
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-sm font-semibold hover:bg-emerald-500/20 transition-all">
              <Send className="w-4 h-4" /> Programar envío
            </button>
          </div>
          <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg text-xs text-blue-300">
            <strong>CRM:</strong> Los suscriptores pueden sincronizarse con los leads del <strong>CRM Pipeline</strong>.
            &nbsp;Límite plan free: <strong>10 campañas</strong> · Suscriptores: <strong>ilimitados</strong>.
          </div>
        </div>
      )}
    </div>
  );
}
