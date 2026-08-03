import React, { useState } from "react";
import { AI_PRESETS_CHATS } from "../data";

// Local message type — this component uses sender/text/chartData rather than
// the global AIChatMessage shape (role/content), kept separate to avoid
// breaking the shared type definition.
interface ChatMessage {
  id: string;
  role?: 'user' | 'model';
  sender?: 'user' | 'bot';
  content?: string;
  text?: string;
  timestamp?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chartData?: Array<{ name: string; [key: string]: any }>;
  chartType?: string;
}
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { Bot, Send, Sparkles, MessageSquare, RefreshCw, Download, Globe, ExternalLink } from "lucide-react";

export default function InteractiveAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      role: "model",
      content: "¡Hola! Soy el Asistente Analítico de Clientum. Puedo responder tus dudas comerciales y generar reportes visuales al instante. Haz clic en una de las preguntas de ejemplo para ver cómo analizo tu negocio en tiempo real:",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);

  const handleExportChat = () => {
    try {
      const header = `========= EXPORTACIÓN DE CONVERSACIÓN ANALÍTICA CLIENTUM =========\nFecha: ${new Date().toLocaleDateString("es-AR")}\nAsistente: Asistente Analítico Clientum\n==================================================================\n\n`;
      const body = messages
        .map((m) => {
          const roleName = m.sender === "user" ? "Cliente" : "Asistente Analítico";
          return `[${roleName}]: ${m.text}`;
        })
        .join("\n\n");
      const footer = `\n\n==================================================================\nExportado exitosamente usando Chat-Export por Clientum Latam.\nGitHub: https://github.com/clientumlatam/Chat-Export\n==================================================================`;
      
      const fileContent = header + body + footer;
      const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `clientum-analytical-export-${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setShowExportSuccess(true);
      setTimeout(() => setShowExportSuccess(false), 8000);
    } catch (err) {
      console.error("Error al exportar chat analítico:", err);
    }
  };

  const triggerSampleQuestion = (key: "ventas" | "consultas" | "eficiencia") => {
    setLoading(true);
    let userText = "";
    if (key === "ventas") userText = "¿Cómo progresan nuestras ventas trimestrales?";
    else if (key === "consultas") userText = "¿Qué categorías de consultas atiende el bot de WhatsApp?";
    else if (key === "eficiencia") userText = "¿Cuánto redujo el chatbot el tiempo de respuesta?";

    const newUserMessage: ChatMessage = {
      id: "u-" + Date.now(),
      role: "user",
      content: userText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newUserMessage]);

    setTimeout(() => {
      const presetResponse = AI_PRESETS_CHATS[key];
      setMessages((prev) => [...prev, { ...presetResponse, id: "a-" + Date.now() }]);
      setLoading(false);
    }, 850);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText;
    setInputText("");

    const newUserMessage: ChatMessage = {
      id: "u-" + Date.now(),
      role: "user",
      content: userMsg,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setLoading(true);

    // AI simulation fallback for custom questions
    setTimeout(() => {
      let responseText = `Excelente consulta sobre "${userMsg}". Basado en los logs del CRM de Clientum, detectamos un patrón favorable en tus ventas los días de semana posterior a los envíos de campañas de WhatsApp automáticas.`;
      let chartData = [
        { name: "Lunes", Ventas: 45 },
        { name: "Martes", Ventas: 65 },
        { name: "Miércoles", Ventas: 80 },
        { name: "Jueves", Ventas: 95 },
        { name: "Viernes", Ventas: 110 },
      ];

      setMessages((prev) => [
        ...prev,
        {
          id: "a-" + Date.now(),
          role: "model",
          content: responseText,
          chartType: "bar",
          chartData: chartData,
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  const PIE_COLORS = ["#1A3461", "#25d366", "#2e5299", "#cbd5e1", "#f8fafc"];

  return (
    <div className="bg-slate-900 rounded-xl p-4 text-left text-white border border-slate-800 shadow-xl flex flex-col h-[410px]">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold flex items-center gap-1">
              Asistente IA Analítico <Sparkles className="w-3 h-3 text-emerald-400" />
            </h4>
            <span className="text-[9px] text-emerald-400 font-mono">ONLINE / INTEGRADOR AFIP</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportChat}
            className="text-slate-400 hover:text-emerald-400 p-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 text-[10px] font-bold bg-slate-950 border border-slate-800 hover:border-emerald-900 px-2.5"
            title="Exportar conversación"
          >
            <Download className="w-3 h-3 text-emerald-400" />
            <span>Chat-Export</span>
          </button>
          <button
            onClick={() =>
              setMessages([
                {
                  id: "init",
                  role: "model",
                  content: "¡Hola! Soy el Asistente Analítico de Clientum. Puedo responder tus dudas comerciales y generar reportes visuales al instante. Haz clic en una de las preguntas de ejemplo para ver cómo analizo tu negocio en tiempo real:",
                },
              ])
            }
            className="text-slate-500 hover:text-white p-1.5 rounded-lg transition-colors cursor-pointer"
            title="Reiniciar chat"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 mb-3 scrollbar-thin scrollbar-thumb-slate-800">
        {showExportSuccess && (
          <div className="bg-emerald-950/80 border border-emerald-800/60 rounded-xl p-3 text-xs text-emerald-100 flex flex-col gap-1.5 shrink-0">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                ✓ ¡Reporte exportado con éxito!
              </span>
              <button onClick={() => setShowExportSuccess(false)} className="text-emerald-500 hover:text-emerald-300 text-[10px] font-bold">Cerrar</button>
            </div>
            <p className="text-[10px] leading-relaxed text-emerald-300">
              El reporte de la conversación se descargó en tu equipo. Esta exportación rápida utiliza el componente <strong className="text-emerald-200 font-semibold">Chat-Export</strong>.
            </p>
            <a 
              href="https://github.com/clientumlatam/Chat-Export" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 hover:underline font-mono self-start mt-0.5"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>clientumlatam/Chat-Export</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
            <div
              className={`rounded-lg px-3 py-2 text-xs max-w-[88%] leading-relaxed ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-slate-800 text-slate-100 rounded-bl-none"
              }`}
            >
              {msg.text}

              {/* Embed Dynamic Recharts Inside Message Bubble */}
              {msg.chartData && msg.chartType === "bar" && (
                <div className="mt-3 bg-slate-950 p-2 rounded border border-slate-800 h-40 w-full min-w-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={msg.chartData}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={9} tickLine={false} />
                      <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155" }} />
                      <Bar dataKey="Cierres CRM" fill="#2e5299" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Ventas Chatbot" fill="#25d366" radius={[4, 4, 0, 0]} />
                      {msg.chartData[0].Ventas && <Bar dataKey="Ventas" fill="#1aaa50" radius={[4, 4, 0, 0]} />}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {msg.chartData && msg.chartType === "pie" && (
                <div className="mt-3 bg-slate-950 p-2 rounded border border-slate-800 h-40 w-full min-w-[240px] flex items-center justify-between gap-2">
                  <div className="flex-1 h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={msg.chartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={32}
                        >
                          {msg.chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-[9px] text-slate-400 flex flex-col gap-1 w-24">
                    {msg.chartData.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 truncate">
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: PIE_COLORS[idx] }}
                        />
                        <span className="truncate">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {msg.chartData && msg.chartType === "line" && (
                <div className="mt-3 bg-slate-950 p-2 rounded border border-slate-800 h-40 w-full min-w-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={msg.chartData}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={9} />
                      <YAxis stroke="#64748b" fontSize={9} />
                      <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155" }} />
                      <Line type="monotone" dataKey="Tiempo Anterior (Min)" stroke="#ef4444" strokeWidth={1.5} />
                      <Line type="monotone" dataKey="Con Clientum (Min)" stroke="#25d366" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-850 p-2 rounded self-start animate-pulse">
            <Bot className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
            Asistente IA analizando base de datos...
          </div>
        )}
      </div>

      {/* Prepopulated Fast Queries */}
      <div className="flex flex-wrap gap-1.5 mb-3 border-t border-slate-800 pt-2.5">
        <button
          onClick={() => triggerSampleQuestion("ventas")}
          disabled={loading}
          className="bg-slate-800 hover:bg-slate-700 active:bg-slate-700 text-[10px] text-slate-300 px-2.5 py-1 rounded-full flex items-center gap-1 transition-colors border border-slate-700 disabled:opacity-50"
        >
          <MessageSquare className="w-2.5 h-2.5 text-blue-400" />
          Ventas trimestrales
        </button>
        <button
          onClick={() => triggerSampleQuestion("consultas")}
          disabled={loading}
          className="bg-slate-800 hover:bg-slate-700 active:bg-slate-700 text-[10px] text-slate-300 px-2.5 py-1 rounded-full flex items-center gap-1 transition-colors border border-slate-700 disabled:opacity-50"
        >
          <MessageSquare className="w-2.5 h-2.5 text-emerald-400" />
          Categorías WhatsApp
        </button>
        <button
          onClick={() => triggerSampleQuestion("eficiencia")}
          disabled={loading}
          className="bg-slate-800 hover:bg-slate-700 active:bg-slate-700 text-[10px] text-slate-300 px-2.5 py-1 rounded-full flex items-center gap-1 transition-colors border border-slate-700 disabled:opacity-50"
        >
          <MessageSquare className="w-2.5 h-2.5 text-yellow-400" />
          Tiempo de respuesta
        </button>
      </div>

      {/* Input Box */}
      <form onSubmit={handleSendMessage} className="flex gap-1.5 mt-auto">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Pregúntale a la IA sobre tus ventas..."
          className="flex-1 bg-slate-950 border border-slate-800 text-xs px-3 py-2 rounded-lg text-white focus:outline-none focus:border-emerald-500 placeholder-slate-500"
        />
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-lg flex items-center justify-center transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
