import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Sparkles, Bot, HelpCircle, ArrowRight, RefreshCw, MessageCircle } from "lucide-react";
import { BrochureData } from "../types";

interface Message {
  id: string;
  sender: "user" | "advisor";
  text: string;
  timestamp: Date;
}

interface SalesAssistantChatProps {
  brochureData: BrochureData;
  preset: string;
}

export default function SalesAssistantChat({ brochureData, preset }: SalesAssistantChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "advisor",
      text: `¡Hola! Soy tu **Asesor de Ventas & Conversión de Clientum**. 🚀\n\n¿Querés saber cómo perfeccionar tu brochure de **${preset === "default" ? "Pymes" : preset}** para conseguir más clientes? \n\nPreguntame lo que quieras, por ejemplo cómo estructurar tus ofertas, qué secciones priorizar para vender más, o cómo mejorar tus llamados a la acción (CTA).`,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setLoading(true);

    try {
      // Build history for API
      const history = messages.slice(-6).map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      }));

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "salesAdvisorAnswer",
          payload: {
            industry: preset === "default" ? "Pymes" : preset,
            brochureData,
            message: textToSend,
            history,
          },
        }),
      });

      const resData = await response.json();
      if (resData.error) throw new Error(resData.error);

      const advisorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "advisor",
        text: resData.result || "¡Hola! Estoy analizando tu consulta. Por favor, volvé a intentar.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, advisorMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "advisor",
        text: "Disculpame, tuvimos un pequeño inconveniente de conexión. Te sugiero que revises tu propuesta de valor, enfocando los beneficios en el ahorro de tiempo y el aumento de ventas de tus prospectos.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    "¿Cómo aumento la conversión en mi rubro?",
    "¿Qué secciones debería priorizar?",
    "¿Cómo redactar testimonios persuasivos?",
    "¿Cómo mejorar mi llamado a la acción?",
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 no-print font-sans">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-slate-900 hover:bg-blue-650 text-white p-4 rounded-full shadow-2xl flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer relative border border-slate-700/50 group"
          id="btn-sales-chat-open"
          title="Asesor de Ventas Clientum"
        >
          <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
          <Bot className="w-6 h-6 text-blue-300 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-black tracking-wide pr-1 hidden sm:inline-block">Asesor de Ventas</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl border border-slate-200 w-[360px] sm:w-[380px] h-[520px] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
              </div>
              <div className="text-left">
                <h3 className="text-xs font-bold leading-tight flex items-center gap-1">
                  Asesor Comercial Clientum
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <p className="text-[10px] text-slate-400 font-mono">Estratega de Conversión IA</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-slate-800"
              title="Cerrar ventana"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                {msg.sender === "advisor" ? (
                  <div className="w-7 h-7 bg-slate-900 text-blue-300 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold border border-slate-800">
                    B
                  </div>
                ) : (
                  <div className="w-7 h-7 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-black uppercase">
                    U
                  </div>
                )}

                {/* Message bubble */}
                <div className="max-w-[75%] flex flex-col gap-0.5">
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed text-left whitespace-pre-line shadow-xs ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-400 px-1 font-mono self-start">
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center text-slate-400">
                <div className="w-7 h-7 bg-slate-900 text-blue-300 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">
                  B
                </div>
                <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1 shadow-xs">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick recommendations / preset questions */}
          <div className="p-3 bg-white border-t border-slate-100 flex flex-wrap gap-1.5 justify-start">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider w-full mb-1 text-left font-mono flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-slate-400" /> Consultas Rápidas:
            </span>
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                disabled={loading}
                onClick={() => handleSendMessage(q)}
                className="text-[10px] text-slate-600 hover:text-blue-700 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-full px-2.5 py-1 text-left flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{q}</span>
                <ArrowRight className="w-2.5 h-2.5 text-slate-400 flex-shrink-0" />
              </button>
            ))}
          </div>

          {/* Footer input form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Preguntame sobre optimización y conversión..."
              disabled={loading}
              className="flex-1 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs focus:outline-none transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="bg-slate-900 hover:bg-blue-600 text-white p-2 rounded-xl transition-all disabled:opacity-30 disabled:hover:bg-slate-900 cursor-pointer flex-shrink-0"
              title="Enviar pregunta"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
