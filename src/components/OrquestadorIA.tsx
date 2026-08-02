import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2, RefreshCw, ChevronRight, Network } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  agent?: string;
  timestamp: Date;
}

// Paleta: light content (#F8FAFC), dark header (#0B131D), accent emerald (#10B981 / #34D399)
const AGENT_CONFIG: Record<string, {
  color: string;      // texto / border
  bg: string;         // fondo de la burbuja (light)
  badge: string;      // fondo del badge
  badgeText: string;  // texto del badge
  dot: string;        // color del dot avatar
  emoji: string;
}> = {
  "Ventas": {
    color: "#059669",
    bg: "#f0fdf4",
    badge: "#d1fae5",
    badgeText: "#065f46",
    dot: "#10b981",
    emoji: "📈",
  },
  "Técnico": {
    color: "#0284c7",
    bg: "#f0f9ff",
    badge: "#dbeafe",
    badgeText: "#1e40af",
    dot: "#0ea5e9",
    emoji: "⚙️",
  },
  "Marketing": {
    color: "#7c3aed",
    bg: "#faf5ff",
    badge: "#ede9fe",
    badgeText: "#4c1d95",
    dot: "#8b5cf6",
    emoji: "📣",
  },
  "Customer Success": {
    color: "#b45309",
    bg: "#fffbeb",
    badge: "#fef3c7",
    badgeText: "#78350f",
    dot: "#f59e0b",
    emoji: "🤝",
  },
  "Operaciones": {
    color: "#dc2626",
    bg: "#fff5f5",
    badge: "#fee2e2",
    badgeText: "#7f1d1d",
    dot: "#ef4444",
    emoji: "📊",
  },
  "Orquestador": {
    color: "#059669",
    bg: "#f0fdf4",
    badge: "#d1fae5",
    badgeText: "#065f46",
    dot: "#10b981",
    emoji: "✦",
  },
};

const AGENT_DEPT_MAP: Array<[string, string]> = [
  ["ventas", "Ventas"],
  ["técnico", "Técnico"],
  ["tecnico", "Técnico"],
  ["marketing", "Marketing"],
  ["customer success", "Customer Success"],
  ["operaciones", "Operaciones"],
  ["ops", "Operaciones"],
];

function resolveAgent(raw?: string): string {
  if (!raw) return "Orquestador";
  const lower = raw.toLowerCase();
  for (const [key, name] of AGENT_DEPT_MAP) {
    if (lower.includes(key)) return name;
  }
  return raw;
}

const SUGGESTED_PROMPTS = [
  { label: "📊 Estado del pipeline",    prompt: "Dame un resumen del estado actual del pipeline de ventas con todos los números" },
  { label: "🤖 Reporte de Santi",       prompt: "¿Cómo está funcionando Santi? ¿Cuántos leads contactó y cómo están respondiendo?" },
  { label: "💬 Chatbot leads",          prompt: "¿Cuántos leads nuevos llegaron por el chatbot y qué tendría que hacer con ellos?" },
  { label: "📈 Reporte ejecutivo",      prompt: "Generame un reporte ejecutivo completo con métricas y recomendaciones de hoy" },
  { label: "🎯 Prioridades de hoy",     prompt: "¿Cuáles son las 3 acciones más importantes que debería hacer hoy para hacer crecer Clientum?" },
  { label: "💡 Ideas marketing",        prompt: "¿Qué acciones de marketing podemos hacer para conseguir más leads esta semana en la Patagonia?" },
  { label: "🔧 Estado técnico",         prompt: "¿Hay algo técnico que debería revisar o mejorar en el producto esta semana?" },
  { label: "💰 Valor del pipeline",     prompt: "¿Cuánto vale el pipeline en ARS y cuál es el potencial de cierre estimado este mes?" },
];

function renderContent(text: string) {
  return text.split(/(\*\*[^*\n]+\*\*)/).map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i} style={{ color: "#111827", fontWeight: 700 }}>{part.slice(2, -2)}</strong>
      : <span key={i}>{part}</span>
  );
}

interface OrquestadorIAProps {
  currentUsername?: string;
}

export default function OrquestadorIA({ currentUsername }: OrquestadorIAProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const name = currentUsername ? `, **${currentUsername}**` : "";
    setMessages([{
      role: "assistant",
      content: `¡Hola${name}! Soy el **Orquestador IA de Clientum**.\n\nTengo acceso en tiempo real a la base de datos:\n- 📊 **Pipeline SDR Santi** — leads por estado, valor total, MEDDIC\n- 💬 **Chatbot leads** — inbound del sitio web\n- 📈 **Métricas del negocio** — conversión, fit scores\n\nEscribime cualquier cosa y el sistema va a encontrar el agente correcto: Ventas, Técnico, Marketing, Customer Success u Operaciones.`,
      agent: "Orquestador",
      timestamp: new Date(),
    }]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const resetChat = () => {
    setMessages([{
      role: "assistant",
      content: "¡Nueva conversación! ¿En qué te ayudo?",
      agent: "Orquestador",
      timestamp: new Date(),
    }]);
  };

  const sendMessage = async (text?: string) => {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;

    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";

    setMessages(prev => [...prev, { role: "user", content: userText, timestamp: new Date() }]);
    setLoading(true);

    const history = messages.slice(-14).map(m => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("/api/orchestrator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, history }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Error ${res.status}`);

      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.response,
        agent: resolveAgent(data.agent),
        timestamp: new Date(),
      }]);
    } catch (e: any) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `❌ **Error:** ${e.message}`,
        agent: "Orquestador",
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const showSuggestions = messages.length <= 1;

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] font-sans overflow-hidden">

      {/* ── Header — misma paleta que el dashboard ── */}
      <div className="bg-[#0B131D] border-b border-[#1A2733] px-5 py-3 flex items-center gap-3 flex-shrink-0">
        {/* Logo/icon */}
        <div className="w-8 h-8 bg-[#10B981]/10 border border-[#10B981]/20 rounded flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.15)] flex-shrink-0">
          <Network className="w-4 h-4 text-[#34D399]" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-[13px] font-black tracking-wide text-zinc-100 uppercase">
              Orquestador IA
            </h2>
            <span className="bg-[#10B981]/10 text-[#34D399] border border-[#10B981]/20 text-[9px] font-bold px-1.5 py-0.5 rounded-sm font-mono uppercase tracking-widest">
              Chief of Staff AI
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            <span className="text-zinc-400 font-semibold">5 agentes activos</span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-500">Datos en tiempo real</span>
          </div>
        </div>

        {/* Agent dots */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {[
            { color: "#10b981", label: "Ventas" },
            { color: "#0ea5e9", label: "Técnico" },
            { color: "#8b5cf6", label: "Marketing" },
            { color: "#f59e0b", label: "CS" },
            { color: "#ef4444", label: "Ops" },
          ].map(a => (
            <div
              key={a.label}
              title={a.label}
              className="w-2 h-2 rounded-full"
              style={{ background: a.color, boxShadow: `0 0 6px ${a.color}88` }}
            />
          ))}
        </div>

        <button
          onClick={resetChat}
          className="bg-[#1A2733]/50 hover:bg-[#1A2733] border border-[#2D3B48]/50 text-[10px] font-semibold px-2.5 py-1.5 rounded flex items-center gap-1.5 transition-all text-zinc-400 hover:text-zinc-200 flex-shrink-0"
        >
          <RefreshCw className="w-3 h-3" />
          Nueva conversación
        </button>
      </div>

      {/* ── Messages ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4"
        style={{ background: "#F8FAFC" }}
      >
        {messages.map((msg, i) => {
          /* ── Usuario ── */
          if (msg.role === "user") {
            return (
              <div key={i} className="flex justify-end items-end gap-2.5">
                <div
                  className="px-4 py-2.5 rounded-2xl rounded-br-sm text-[13.5px] leading-relaxed max-w-[68%] break-words"
                  style={{
                    background: "#0B131D",
                    color: "#e4e4e7",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.content}
                </div>
                {/* Avatar */}
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-black text-white"
                  style={{ background: "#10B981" }}
                >
                  {currentUsername?.[0]?.toUpperCase() ?? "J"}
                </div>
              </div>
            );
          }

          /* ── Agente ── */
          const agentKey = resolveAgent(msg.agent);
          const cfg = AGENT_CONFIG[agentKey] ?? AGENT_CONFIG["Orquestador"];

          return (
            <div key={i} className="flex items-start gap-2.5">
              {/* Avatar */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[13px] border"
                style={{
                  background: cfg.bg,
                  borderColor: cfg.color + "44",
                  color: cfg.color,
                }}
              >
                {cfg.emoji}
              </div>

              <div className="flex flex-col gap-1 max-w-[75%]">
                {/* Badge agente */}
                <div className="flex items-center gap-2">
                  <span
                    className="text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ background: cfg.badge, color: cfg.badgeText }}
                  >
                    Agente · {agentKey}
                  </span>
                  <span className="text-[9px] text-zinc-400">
                    {msg.timestamp.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                {/* Burbuja */}
                <div
                  className="px-4 py-3 rounded-2xl rounded-tl-sm text-[13.5px] leading-relaxed break-words border-l-[3px]"
                  style={{
                    background: "white",
                    borderColor: cfg.color,
                    color: "#374151",
                    whiteSpace: "pre-wrap",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  }}
                >
                  {renderContent(msg.content)}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing */}
        {loading && (
          <div className="flex items-start gap-2.5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[13px] border"
              style={{ background: "#f0fdf4", borderColor: "#10b98144", color: "#10b981" }}
            >
              ✦
            </div>
            <div
              className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2 border-l-[3px]"
              style={{ background: "white", borderColor: "#10b981", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
            >
              <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: "#10b981" }} />
              <span className="text-[12px] text-zinc-400">Consultando agentes y datos reales...</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Prompts sugeridos ── */}
      {showSuggestions && (
        <div className="px-6 pb-3 flex flex-wrap gap-1.5 flex-shrink-0" style={{ background: "#F8FAFC" }}>
          {SUGGESTED_PROMPTS.map(p => (
            <button
              key={p.prompt}
              onClick={() => sendMessage(p.prompt)}
              disabled={loading}
              className="bg-white border border-zinc-200 hover:border-[#10B981]/50 hover:bg-[#f0fdf4] text-zinc-500 hover:text-[#065f46] text-[11px] font-medium px-3 py-1.5 rounded-full flex items-center gap-1 transition-all shadow-sm"
            >
              {p.label}
              <ChevronRight className="w-3 h-3 opacity-50" />
            </button>
          ))}
        </div>
      )}

      {/* ── Input ── */}
      <div className="px-5 py-3 border-t border-zinc-200 bg-white flex-shrink-0">
        <div className="flex gap-2 items-end bg-white border border-zinc-200 focus-within:border-[#10B981] focus-within:ring-1 focus-within:ring-[#10B981]/20 rounded-xl px-3 py-2 transition-all">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribile al orquestador… (Enter envía · Shift+Enter nueva línea)"
            rows={1}
            className="flex-1 bg-transparent border-none outline-none text-zinc-800 placeholder-zinc-400 text-[13px] resize-none leading-relaxed"
            style={{ maxHeight: 110, overflowY: "auto", fontFamily: "inherit" }}
            onInput={e => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = Math.min(el.scrollHeight, 110) + "px";
            }}
            autoFocus
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
            style={{
              background: input.trim() && !loading ? "#10B981" : "#f4f4f5",
              color: input.trim() && !loading ? "white" : "#a1a1aa",
              cursor: input.trim() && !loading ? "pointer" : "default",
              boxShadow: input.trim() && !loading ? "0 0 12px rgba(16,185,129,0.3)" : "none",
            }}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-[10px] text-zinc-400 text-center mt-1.5">
          Los agentes consultan la base de datos de Clientum en tiempo real
        </p>
      </div>
    </div>
  );
}
