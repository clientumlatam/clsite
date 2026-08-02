import React, { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle2, Webhook, Copy, RefreshCw, Users, Zap, Shield, ArrowRight, Bot } from 'lucide-react';

const WEBHOOK_URL = '/api/webhooks/chatbot-lead';
const WEBHOOK_TOKEN = 'X-CRM-Token';

interface LeadSample {
  id: string;
  name: string;
  phone: string;
  email: string;
  empresa: string;
  snippet: string;
  ts: string;
}

const SAMPLE_LEADS: LeadSample[] = [
  { id: '1', name: 'Marcos Díaz', phone: '+54 299 411-2233', email: 'marcos@ferreteria.com', empresa: 'Ferretería del Centro', snippet: '"Hola, quiero saber más sobre el CRM para mi ferretería..."', ts: 'Hace 3 min' },
  { id: '2', name: 'Laura Sosa', phone: '+54 298 422-9900', email: 'laura@clinica.com.ar', empresa: 'Clínica del Valle', snippet: '"¿Tienen turnos automáticos por WhatsApp para consultorios?"', ts: 'Hace 18 min' },
  { id: '3', name: 'Diego Romero', phone: '+54 294 477-5512', email: 'diego@logistica.ar', empresa: 'Transporte Patagónico', snippet: '"Necesito un sistema para gestionar mis choferes y rutas."', ts: 'Hace 42 min' },
];

export default function WpChatbotIA() {
  const [copied, setCopied] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [leads, setLeads] = useState<LeadSample[]>(SAMPLE_LEADS);

  const copyWebhook = () => {
    navigator.clipboard.writeText(WEBHOOK_URL).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const testWebhook = async () => {
    setTestStatus('loading');
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CRM-Token': 'test' },
        body: JSON.stringify({ name: 'Test Lead', email: 'test@clientum.com.ar', phone: '+54 299 000-0000', empresa: 'Demo', conversation: 'Prueba de conexión desde el dashboard.' }),
      });
      setTestStatus(res.ok ? 'ok' : 'error');
    } catch {
      setTestStatus('error');
    }
    setTimeout(() => setTestStatus('idle'), 3500);
  };

  return (
    <div className="space-y-8 text-slate-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Bot className="w-7 h-7 text-sky-400" />
            <h1 className="text-2xl font-bold text-white">Chatbot IA</h1>
            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Activo
            </span>
          </div>
          <p className="text-slate-400 text-sm max-w-2xl">
            Asistente conversacional en tu sitio WordPress que captura leads y los envía al CRM en tiempo real vía webhook.
          </p>
        </div>
        <span className="text-xs font-mono text-slate-500 bg-[#0A101F] border border-[#1E293B] px-3 py-1.5 rounded-lg">
          Plugin: AI Marketing Expert v2
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Leads capturados hoy', value: '3', icon: <Users className="w-5 h-5 text-sky-400" />, border: 'border-sky-500/30' },
          { label: 'Webhook activo', value: '✓', icon: <Webhook className="w-5 h-5 text-emerald-400" />, border: 'border-emerald-500/30' },
          { label: 'Módulo estado', value: 'Activo', icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />, border: 'border-emerald-500/30' },
          { label: 'Flujos config.', value: '4', icon: <Zap className="w-5 h-5 text-amber-400" />, border: 'border-amber-500/30' },
        ].map(s => (
          <div key={s.label} className={`bg-[#0A101F]/60 border ${s.border} rounded-xl p-4`}>
            <div className="flex items-center justify-between mb-2">{s.icon}<span className="text-2xl font-bold text-white">{s.value}</span></div>
            <p className="text-xs text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Webhook config */}
      <div className="bg-[#0A101F]/60 border border-[#1E293B] rounded-xl p-6">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Webhook className="w-5 h-5 text-sky-400" /> Configuración del Webhook
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2 block">Endpoint</label>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-[#030712] border border-[#1E293B] rounded-lg px-4 py-2.5 text-sm text-sky-300 font-mono">{WEBHOOK_URL}</code>
              <button onClick={copyWebhook} className="p-2.5 bg-[#0A101F] border border-[#1E293B] rounded-lg hover:border-sky-500/40 transition-colors">
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              </button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2 block">Header de autenticación</label>
              <code className="block bg-[#030712] border border-[#1E293B] rounded-lg px-4 py-2.5 text-sm text-amber-300 font-mono">{WEBHOOK_TOKEN}: {'<tu-token>'}</code>
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2 block">Método</label>
              <code className="block bg-[#030712] border border-[#1E293B] rounded-lg px-4 py-2.5 text-sm text-emerald-300 font-mono">POST · Content-Type: application/json</code>
            </div>
          </div>
          <button
            onClick={testWebhook}
            disabled={testStatus === 'loading'}
            className="flex items-center gap-2 px-4 py-2 bg-sky-500/10 border border-sky-500/30 text-sky-400 rounded-lg text-sm font-semibold hover:bg-sky-500/20 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${testStatus === 'loading' ? 'animate-spin' : ''}`} />
            {testStatus === 'idle' ? 'Probar conexión' : testStatus === 'loading' ? 'Enviando...' : testStatus === 'ok' ? '✓ Conexión OK' : '✗ Error — verificar token'}
          </button>
        </div>
      </div>

      {/* Payload reference */}
      <div className="bg-[#0A101F]/60 border border-[#1E293B] rounded-xl p-6">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-sky-400" /> Payload que envía WordPress
        </h2>
        <pre className="bg-[#030712] border border-[#1E293B] rounded-lg p-4 text-xs text-slate-300 font-mono overflow-x-auto leading-relaxed">{`{
  "name":         "Marcos Díaz",
  "phone":        "+54 299 411-2233",
  "email":        "marcos@ferreteria.com",
  "empresa":      "Ferretería del Centro",
  "conversation": "Hola, quiero saber más sobre el CRM...",
  "source":       "chatbot-wp",
  "timestamp":    "2026-07-17T14:30:00Z"
}`}</pre>
      </div>

      {/* Recent leads */}
      <div className="bg-[#0A101F]/60 border border-[#1E293B] rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-400" /> Últimos leads capturados
          </h2>
          <a href="#" onClick={e => e.preventDefault()} className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1">
            Ver en CRM Pipeline <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
        <div className="space-y-3">
          {leads.map(lead => (
            <div key={lead.id} className="flex items-start gap-4 p-4 bg-[#030712]/60 border border-[#1E293B] rounded-lg hover:border-sky-500/20 transition-colors">
              <div className="w-8 h-8 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-sky-400">
                {lead.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-white">{lead.name}</span>
                  <span className="text-xs text-slate-500">{lead.empresa}</span>
                  <span className="ml-auto text-xs text-slate-600">{lead.ts}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 italic truncate">{lead.snippet}</p>
                <div className="flex gap-3 mt-1.5 text-xs text-slate-500">
                  <span>{lead.phone}</span>
                  <span>{lead.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-[#0A101F]/60 border border-[#1E293B] rounded-xl p-6">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" /> Capacidades del módulo
        </h2>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            'Captura nombre, teléfono, email y empresa',
            'Registra la conversación completa',
            'Envía leads al CRM vía webhook en tiempo real',
            'Personalizable con flujos de preguntas',
          ].map(f => (
            <div key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              {f}
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-sky-500/5 border border-sky-500/20 rounded-lg text-xs text-sky-300">
          <strong>CRM:</strong> Los leads llegan a <code className="text-sky-200">Chatbot Leads</code> → gestionables desde la pestaña <strong>Leads</strong> del dashboard.
        </div>
      </div>
    </div>
  );
}
