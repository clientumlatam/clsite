import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { 
  Bot, 
  User, 
  Send, 
  Trash2, 
  Sparkles, 
  Zap, 
  Brain, 
  RefreshCw, 
  Sliders, 
  Briefcase, 
  FileText, 
  CheckCircle2,
  Loader2,
  MessageSquareCode
} from 'lucide-react';

interface Persona {
  id: string;
  name: string;
  title: string;
  icon: React.ReactNode;
  instruction: string;
  suggestion: string;
  description: string;
}

export function ChatTab() {
  const personas: Persona[] = [
    {
      id: 'cmo',
      name: 'AI CMO Latam',
      title: 'Growth Director',
      icon: <Briefcase className="w-5 h-5 text-indigo-600" />,
      description: 'Especialista en reducción de CAC, ROI de pautas (Meta/Google), y optimización de funnels.',
      instruction: 'Actúas como el Director Ejecutivo de Marketing (CMO) de Clientum para Latinoamérica. Tu objetivo es ayudar a las pymes a reducir su costo de adquisición de clientes (CAC), maximizar el retorno de inversión (ROI) en publicidad digital (Google/Facebook Ads), y estructurar funnels de conversión altamente efectivos adaptados a mercados de habla hispana.',
      suggestion: '¿Cómo puedo estructurar una pauta digital para reducir mi CAC de $15 a $8 USD?'
    },
    {
      id: 'sdr',
      name: 'Santi SDR',
      title: 'Sales Specialist',
      icon: <Sparkles className="w-5 h-5 text-amber-500" />,
      description: 'Especialista en calificación con MEDDIC, discursos de venta y prospección por WhatsApp.',
      instruction: 'Actúas como Santi, el SDR y especialista en ventas estelares de Clientum. Sos experto en la metodología de calificación de ventas MEDDIC, estructurar discursos de ventas persuasivos, resolver objeciones difíciles de clientes, y automatizar campañas de alcance (outreach) por WhatsApp o correo electrónico.',
      suggestion: '¿Qué preguntas MEDDIC puedo hacerle a una pyme interesada en automatizar su WhatsApp?'
    },
    {
      id: 'copywriter',
      name: 'SEO & Copywriter',
      title: 'Content Strategist',
      icon: <FileText className="w-5 h-5 text-emerald-500" />,
      description: 'Estructuración de arquitecturas de contenido (pillar/cluster) y copys persuasivos.',
      instruction: 'Actúas como un redactor de contenidos SEO senior y experto en posicionamiento web para el mercado latinoamericano. Sos experto en encontrar intenciones de búsqueda de alto valor, mapear arquitecturas de contenido (pillar y clusters) y redactar copys de venta altamente persuasivos o artículos de blog optimizados para SEO.',
      suggestion: 'Escribí un copy de 3 párrafos usando el framework AIDA para vender Clientum CRM.'
    },
    {
      id: 'architect',
      name: 'Automatizaciones',
      title: 'CRM Architect',
      icon: <Brain className="w-5 h-5 text-purple-500" />,
      description: 'Arquitectura de pipelines de ventas, automatización de flujos y facturación AFIP.',
      instruction: 'Actúas como el Arquitecto de Automatizaciones y CRM de Clientum. Sos experto en diseñar flujos automatizados de email y WhatsApp, sugerir integraciones con AFIP o pasarelas de pago, y optimizar pipelines de ventas visuales.',
      suggestion: '¿Cómo puedo estructurar una automatización de bienvenida al registrarse un prospecto?'
    }
  ];

  const models = [
    { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro', speed: 'Complejidad Alta / Razonamiento Profundo', icon: <Brain className="w-4 h-4 text-purple-600" /> },
    { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash', speed: 'Velocidad Media / General', icon: <Zap className="w-4 h-4 text-amber-500" /> },
    { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash Lite', speed: 'Baja Latencia / Respuestas Ultra-Rápidas', icon: <Zap className="w-4 h-4 text-emerald-500" /> }
  ];

  const [activePersona, setActivePersona] = useState<Persona>(personas[0]);
  const [selectedModel, setSelectedModel] = useState(models[1]); // gemini-3.5-flash as default
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from LocalStorage if available for this specific persona
  useEffect(() => {
    const key = `clientum_chat_history_${activePersona.id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      // Set default initial message
      setMessages([
        {
          id: 'initial',
          role: 'model',
          content: `¡Hola! Soy tu asesor especializado: **${activePersona.name}** (${activePersona.title}).\n\n${activePersona.description}\n\n¿En qué te puedo ayudar hoy?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    }
  }, [activePersona]);

  // Scroll to bottom whenever messages list changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const saveHistory = (updated: ChatMessage[]) => {
    setMessages(updated);
    localStorage.setItem(`clientum_chat_history_${activePersona.id}`, JSON.stringify(updated));
  };

  const handleSend = async (textToSend?: string) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || loading) return;

    if (!textToSend) {
      setInput('');
    }

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    saveHistory(updatedMessages);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: updatedMessages,
          model: selectedModel.id,
          systemInstruction: activePersona.instruction
        }),
      });
      const data = await res.json();
      if (data.success) {
        const modelMsg: ChatMessage = {
          id: `model_${Date.now()}`,
          role: 'model',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        saveHistory([...updatedMessages, modelMsg]);
      } else {
        throw new Error(data.error || 'Chat failed');
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'model',
        content: `Ups, no pudimos conectar con Gemini AI: ${err.message || 'Por favor, intentá de nuevo.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      saveHistory([...updatedMessages, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (confirm('¿Estás seguro de que querés limpiar el historial de conversación con este agente?')) {
      const key = `clientum_chat_history_${activePersona.id}`;
      localStorage.removeItem(key);
      setMessages([
        {
          id: 'initial',
          role: 'model',
          content: `¡Hola! Soy tu asesor especializado: **${activePersona.name}** (${activePersona.title}).\n\n${activePersona.description}\n\n¿En qué te puedo ayudar hoy?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    }
  };

  return (
    <div id="gemini-chatbot-container-root" className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-11rem)]">
      {/* Side Control panel for Agents and Models */}
      <div id="chatbot-sidebar-settings" className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-5 flex flex-col space-y-5 shadow-xs overflow-y-auto">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Seleccioná tu Agente AI
          </h3>
          <div className="space-y-2 flex flex-col">
            {personas.map((p) => (
              <button
                key={p.id}
                id={`persona-btn-${p.id}`}
                onClick={() => setActivePersona(p)}
                className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all border text-left cursor-pointer ${
                  activePersona.id === p.id 
                    ? 'bg-indigo-50/70 border-indigo-200 ring-2 ring-indigo-600/5 shadow-xs' 
                    : 'bg-white border-slate-150 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${activePersona.id === p.id ? 'bg-indigo-100' : 'bg-slate-100 text-slate-500'}`}>
                  {p.icon}
                </div>
                <div>
                  <h4 className={`text-xs font-bold ${activePersona.id === p.id ? 'text-indigo-900' : 'text-slate-800'}`}>
                    {p.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">{p.title}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Modelo de Inteligencia
          </h3>
          <div className="space-y-2 flex flex-col">
            {models.map((m) => (
              <button
                key={m.id}
                id={`model-btn-${m.id}`}
                onClick={() => setSelectedModel(m)}
                className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg text-left border text-xs cursor-pointer transition-all ${
                  selectedModel.id === m.id 
                    ? 'bg-indigo-50/40 border-indigo-200 text-slate-800 font-bold' 
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="shrink-0">{m.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{m.name}</div>
                  <div className="text-[9px] text-slate-400 font-normal truncate mt-0.5">{m.speed}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 mt-auto">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-150 text-center">
            <h4 className="text-[11px] font-bold text-slate-700">Estado de Conexión</h4>
            <p className="text-[10px] text-emerald-600 font-medium flex items-center justify-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              En línea • Gemini 3.5 Ready
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div id="chatbot-main-chat" className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-full overflow-hidden">
        {/* Chat header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              {activePersona.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">{activePersona.name}</h2>
                <span className="px-2 py-0.5 rounded bg-indigo-50 text-[9px] font-bold text-indigo-600 uppercase">
                  {selectedModel.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">{activePersona.description}</p>
            </div>
          </div>
          <button
            id="clear-chat-history-btn"
            onClick={handleClearChat}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Limpiar conversación"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div key={msg.id} className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-xs text-xs font-bold ${
                  isUser ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-white'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4.5 h-4.5" />}
                </div>
                <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  isUser 
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-sm' 
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-xs'
                }`}>
                  <p className="whitespace-pre-line font-medium">{msg.content}</p>
                  <span className={`block text-[9px] mt-1 text-right ${isUser ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4.5 h-4.5" />
              </div>
              <div className="bg-white text-slate-600 rounded-2xl rounded-tl-none px-4 py-3 text-xs flex items-center space-x-2 border border-slate-200 shadow-xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span className="font-semibold">Formulando estrategia comercial...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Dynamic prompt suggestion helper */}
        <div className="px-4 pt-3 pb-1 border-t border-slate-100 bg-white">
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Sugerencia de Práctica:</span>
          <button
            id="suggestion-prompt-chip"
            onClick={() => handleSend(activePersona.suggestion)}
            className="text-left w-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl transition-all cursor-pointer truncate font-medium flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
            <span className="truncate">{activePersona.suggestion}</span>
          </button>
        </div>

        {/* Input area */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-4 bg-white flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder={`Hacé una consulta a tu ${activePersona.name}...`}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-slate-50 hover:bg-white focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="inline-flex items-center justify-center p-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50 cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
