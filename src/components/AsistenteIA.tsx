import React, { useState, useRef, useEffect } from "react";
import { X, Sparkles, Send, ChevronDown, Bot, User, Loader2, RefreshCw } from "lucide-react";
import { BrochureData } from "../types";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AsistenteIAProps {
  open: boolean;
  onClose: () => void;
  brochureData?: BrochureData;
  activeSection?: string;
  currentUsername?: string;
}

const SUGGESTED_PROMPTS = [
  "¿Cómo mejoro mi pipeline de ventas?",
  "Redactá un email de apertura para una distribuidora",
  "¿Qué es MEDDIC y cómo lo aplico?",
  "Ayudame a calificar un lead nuevo",
  "Generá un mensaje de seguimiento para WhatsApp",
];

const SECTION_LABELS: Record<string, string> = {
  "pipeline":      "CRM Pipeline",
  "icp":           "ICP Builder",
  "prospector":    "Patagonia Explorer",
  "meddic":        "Calificación MEDDIC",
  "campaigns":     "Outreach Campaigns",
  "activity":      "Actividad",
  "brochure":      "Brochure",
  "config":        "Configuración",
  "ai":            "Copiloto IA",
  "conversations": "Conversaciones",
  "bot":           "Bot",
  "products":      "Productos",
};

export default function AsistenteIA({
  open,
  onClose,
  brochureData,
  activeSection,
  currentUsername,
}: AsistenteIAProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Greet on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      const greeting = currentUsername
        ? `¡Hola, ${currentUsername}! Soy tu Asistente IA de Clientum. Puedo ayudarte con el pipeline, armar emails, calificar leads, redactar copys para el brochure o responder cualquier duda comercial.\n\n¿En qué te ayudo hoy?`
        : "¡Hola! Soy tu Asistente IA de Clientum. Estoy aquí para ayudarte con ventas, pipeline, emails y más. ¿En qué te ayudo?";
      setMessages([
        {
          role: "assistant",
          content: greeting,
          timestamp: new Date(),
        },
      ]);
    }
  }, [open]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  const sendMessage = async (text?: string) => {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;

    setInput("");
    const userMsg: Message = { role: "user", content: userText, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    const contextNote = activeSection
      ? `El usuario está en la sección: "${SECTION_LABELS[activeSection] ?? activeSection}".`
      : "";

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "assistantChat",
          payload: {
            message: userText,
            history,
            contextNote,
            brochureData: brochureData
              ? {
                  industry: brochureData.cover?.industry,
                  slogan: brochureData.cover?.slogan,
                  company: brochureData.cover?.company,
                }
              : undefined,
          },
        }),
      });

      const data = await res.json();
      const reply = data.result || data.error || "No pude generar una respuesta.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply, timestamp: new Date() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Ocurrió un error al conectar con el asistente. Revisá tu conexión e intentá de nuevo.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMessages([]);
    setInput("");
    // Trigger greeting again
    setTimeout(() => {
      const greeting = currentUsername
        ? `¡Hola de nuevo, ${currentUsername}! ¿En qué te ayudo?`
        : "¡Hola! ¿En qué te ayudo?";
      setMessages([{ role: "assistant", content: greeting, timestamp: new Date() }]);
    }, 50);
  };

  return (
    <>
      {/* Backdrop overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 bottom-0 z-50 flex flex-col transition-transform duration-300 ease-in-out will-change-transform
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
        style={{ width: "360px" }}
      >
        {/* Header */}
        <div className="bg-[#0B131D] border-b border-[#1A2733] px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#10B981]/15 border border-[#10B981]/25 rounded flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-[#34D399]" />
            </div>
            <div>
              <div className="text-[12px] font-black text-zinc-100 tracking-wide uppercase">
                Asistente IA
              </div>
              <div className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">
                Clientum · Powered by Gemini
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={resetChat}
              title="Nueva conversación"
              className="w-7 h-7 rounded flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-[#1A2733] transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              title="Cerrar asistente"
              className="w-7 h-7 rounded flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-[#1A2733] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Active section badge */}
        {activeSection && SECTION_LABELS[activeSection] && (
          <div className="bg-[#0F1B27] border-b border-[#1A2733] px-4 py-1.5 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span className="text-[10px] text-zinc-400 font-mono">
              Contexto actual:{" "}
              <span className="text-[#34D399] font-semibold">
                {SECTION_LABELS[activeSection]}
              </span>
            </span>
          </div>
        )}

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto bg-[#0D1825] px-4 py-4 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-[#1A2733] scrollbar-track-transparent"
        >
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              {/* Avatar */}
              <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-0.5
                ${msg.role === "assistant"
                  ? "bg-[#10B981]/15 border border-[#10B981]/20"
                  : "bg-[#1A2733] border border-[#2D3B48]"
                }`}
              >
                {msg.role === "assistant"
                  ? <Sparkles className="w-3 h-3 text-[#34D399]" />
                  : <User className="w-3 h-3 text-zinc-400" />
                }
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[260px] rounded-lg px-3 py-2.5 text-[12px] leading-[1.6] whitespace-pre-wrap
                  ${msg.role === "assistant"
                    ? "bg-[#1A2733] text-zinc-200 rounded-tl-none border border-[#2D3B48]/60"
                    : "bg-[#10B981]/15 text-[#D1FAE5] rounded-tr-none border border-[#10B981]/20"
                  }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="flex gap-2.5">
              <div className="w-6 h-6 rounded flex items-center justify-center bg-[#10B981]/15 border border-[#10B981]/20 flex-shrink-0 mt-0.5">
                <Sparkles className="w-3 h-3 text-[#34D399]" />
              </div>
              <div className="bg-[#1A2733] border border-[#2D3B48]/60 rounded-lg rounded-tl-none px-3 py-2.5 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#34D399]/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-[#34D399]/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-[#34D399]/60 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          {/* Suggested prompts (only when just greeting shown) */}
          {messages.length === 1 && !loading && (
            <div className="flex flex-col gap-1.5 mt-1">
              <span className="text-[9px] text-zinc-600 font-mono uppercase tracking-wider px-0.5">
                Sugerencias
              </span>
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(prompt)}
                  className="text-left text-[11px] text-zinc-400 hover:text-zinc-200 bg-[#1A2733]/50 hover:bg-[#1A2733] border border-[#2D3B48]/40 hover:border-[#2D3B48] rounded px-2.5 py-2 transition-all leading-tight"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="bg-[#0B131D] border-t border-[#1A2733] p-3 flex-shrink-0">
          <div className="flex items-end gap-2 bg-[#1A2733] border border-[#2D3B48] rounded-lg p-1.5 focus-within:border-[#10B981]/40 transition-colors">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                // Auto-resize
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={handleKeyDown}
              placeholder="Preguntale al asistente…"
              disabled={loading}
              className="flex-1 bg-transparent text-zinc-200 placeholder-zinc-600 text-[12px] resize-none outline-none px-1.5 py-1 leading-[1.5] min-h-[24px] max-h-[120px] disabled:opacity-50"
              style={{ height: "24px" }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="w-7 h-7 rounded flex items-center justify-center bg-[#10B981] hover:bg-[#059669] text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3 h-3" />
              )}
            </button>
          </div>
          <p className="text-[9px] text-zinc-700 mt-1.5 text-center font-mono">
            Enter para enviar · Shift+Enter para nueva línea
          </p>
        </div>
      </div>
    </>
  );
}
