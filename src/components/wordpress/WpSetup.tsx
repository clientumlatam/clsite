import React, { useState } from "react";
import {
  Globe, Key, Webhook, CheckCircle2, Copy, ExternalLink,
  AlertTriangle, Info, Plug, RefreshCw, ShieldCheck,
} from "lucide-react";

const WEBHOOK_PATH = "/api/webhooks/chatbot-lead";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1 text-[10px] font-semibold text-zinc-400 hover:text-[#10B981] transition-colors px-2 py-1 rounded hover:bg-[#10B981]/10"
    >
      {copied ? <CheckCircle2 className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}

function CodeLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2.5">
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-[12px] font-mono text-zinc-700 break-all">{value}</p>
      </div>
      <CopyButton text={value} />
    </div>
  );
}

function Step({
  num, title, desc, done, children,
}: {
  num: number; title: string; desc: string; done?: boolean; children?: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 flex flex-col items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black border-2 ${
            done
              ? "bg-[#10B981]/10 border-[#10B981] text-[#059669]"
              : "bg-white border-zinc-300 text-zinc-500"
          }`}
        >
          {done ? <CheckCircle2 className="w-4 h-4" /> : num}
        </div>
        <div className="w-0.5 flex-1 bg-zinc-200 mt-2 min-h-[20px]" />
      </div>
      <div className="pb-6 flex-1 min-w-0">
        <p className="font-bold text-zinc-800 text-[13px] mb-0.5">{title}</p>
        <p className="text-zinc-500 text-[12px] leading-relaxed mb-3">{desc}</p>
        {children}
      </div>
    </div>
  );
}

export default function WpSetup() {
  const appUrl = window.location.origin;
  const webhookUrl = `${appUrl}${WEBHOOK_PATH}`;

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-2">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 bg-[#10B981]/10 border border-[#10B981]/20 rounded-lg flex items-center justify-center">
            <Plug className="w-4.5 h-4.5 text-[#10B981]" />
          </div>
          <div>
            <h1 className="text-xl font-black text-zinc-800 tracking-tight">
              Configuración del Plugin de WordPress
            </h1>
            <p className="text-[11px] text-zinc-500 font-mono uppercase tracking-wider">
              AI Marketing Expert · Integración con Clientum CRM
            </p>
          </div>
        </div>
      </div>

      {/* Alert token */}
      <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[12px] font-bold text-amber-800 mb-0.5">CRM_INTERNAL_TOKEN no configurado</p>
          <p className="text-[11.5px] text-amber-700 leading-relaxed">
            El webhook de WordPress requiere que el secret <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">CRM_INTERNAL_TOKEN</code> esté
            configurado en Replit Secrets con un token seguro. Sin él, los leads del plugin no pueden llegar al CRM.
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-[13px] font-black text-zinc-700 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Webhook className="w-4 h-4 text-[#10B981]" />
          Guía de instalación
        </h2>

        <div>
          <Step
            num={1}
            title='Instalá el plugin "AI Marketing Expert" en WordPress'
            desc="Buscalo en el repositorio oficial o subilo manualmente desde el archivo ZIP."
          >
            <a
              href="https://es.wordpress.org/plugins/ai-marketing-expert/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#059669] hover:text-[#047857] transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              wordpress.org/plugins/ai-marketing-expert
            </a>
          </Step>

          <Step
            num={2}
            title="Configurá la URL del webhook en WordPress"
            desc="En el panel de WordPress → AI Marketing Expert → Configuración → CRM Integration, pegá esta URL:"
          >
            <CodeLine label="Webhook URL" value={webhookUrl} />
          </Step>

          <Step
            num={3}
            title="Configurá el token de autenticación"
            desc="Generá un token seguro y configuralo en dos lugares: Replit Secrets como CRM_INTERNAL_TOKEN, y en WordPress en el campo X-CRM-Token."
          >
            <div className="space-y-2">
              <div className="flex gap-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <Info className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-[11.5px] text-blue-700">
                  <strong>En Replit:</strong> Secrets → <code className="bg-blue-100 px-1 rounded font-mono">CRM_INTERNAL_TOKEN</code> = tu token<br />
                  <strong>En WordPress:</strong> AI Marketing Expert → CRM Integration → Header Token = el mismo token
                </div>
              </div>
              <CodeLine label="Header esperado por Clientum" value="X-CRM-Token: <tu_token>" />
            </div>
          </Step>

          <Step
            num={4}
            title="Activá el módulo Chatbot en WordPress"
            desc="Habilitá el módulo de Chatbot en el plugin. Cuando un visitante complete el formulario, el lead va a llegar automáticamente a Clientum CRM → Leads del Chatbot."
          />

          <Step
            num={5}
            title="Verificá la conexión"
            desc="Enviá un lead de prueba desde el chatbot en WordPress y verificá que aparezca en la sección Leads del Chatbot de este dashboard."
          >
            <a
              href="/api/chatbot-leads"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#059669] hover:text-[#047857] transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Ver leads actuales (API)
            </a>
          </Step>
        </div>
      </div>

      {/* Technical reference */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-[13px] font-black text-zinc-700 uppercase tracking-widest mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#10B981]" />
          Referencia técnica del webhook
        </h2>

        <div className="space-y-3">
          <CodeLine label="Endpoint" value={`POST ${WEBHOOK_PATH}`} />
          <CodeLine label="Header de autenticación" value="X-CRM-Token: <CRM_INTERNAL_TOKEN>" />
          <CodeLine label="Content-Type" value="application/json" />

          <div className="bg-zinc-900 rounded-lg p-4 font-mono text-[11px] text-zinc-300 leading-relaxed overflow-auto">
            <p className="text-zinc-500 mb-2">{"// Body JSON esperado"}</p>
            <pre>{JSON.stringify({
  email: "contacto@empresa.com",
  first_name: "Martín",
  last_name: "Rodríguez",
  phone: "+54 299 4000000",
  company: "Ferretería Sur",
  source: "chatbot-wordpress",
  tags: ["wordpress", "chatbot"],
  metadata: { page: "/servicios", utm_source: "google" }
}, null, 2)}</pre>
          </div>

          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3">
            <p className="text-[11px] font-bold text-zinc-600 mb-1">Respuesta exitosa (201)</p>
            <pre className="text-[11px] font-mono text-zinc-500">{`{ "ok": true, "lead": { "id": "uuid", "name": "...", "status": "nuevo" } }`}</pre>
          </div>
        </div>
      </div>

      {/* Plugin info */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-[13px] font-black text-zinc-700 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#10B981]" />
          Información del plugin
        </h2>
        <div className="grid grid-cols-2 gap-3 text-[12px]">
          {[
            { label: "Nombre", value: "AI Marketing Expert" },
            { label: "Versión", value: "v2.0" },
            { label: "WordPress mínimo", value: "6.2" },
            { label: "PHP mínimo", value: "8.0" },
            { label: "Repositorio", value: "WordPress.org (oficial)" },
            { label: "Soporte", value: "Equipo Clientum" },
          ].map(({ label, value }) => (
            <div key={label} className="bg-zinc-50 rounded-lg p-3">
              <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold mb-0.5">{label}</p>
              <p className="text-zinc-700 font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
