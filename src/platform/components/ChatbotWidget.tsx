import React, { useState, useRef, useEffect } from 'react';
import { Lead } from '../types';
import { Send, Sparkles, MessageSquare, Terminal, RefreshCw, X, AlertTriangle } from 'lucide-react';

interface ChatbotWidgetProps {
  onAddLead: (lead: Lead) => void;
  onLog: (sender: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  onAgentWorking: (agentId: string, action: string, isWorking: boolean) => void;
}

export default function ChatbotWidget({ onAddLead, onLog, onAgentWorking }: ChatbotWidgetProps) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: '¡Hola! Qué bueno tenerte por acá. Soy el **Asesor Comercial IA** de Clientum. Atiendo consultas del sitio las 24 horas y te ayudo a calificar prospectos.\n\n¿De qué es tu negocio y cómo te gustaría automatizarlo hoy? Contame y armamos una propuesta rápida.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    onLog('Visitante Web', `Envió consulta inbound: "${userMessage}"`, 'info');
    onAgentWorking('asesor_comercial', 'Respondiendo consulta inbound...', true);

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages
        })
      });

      if (!res.ok) throw new Error('Chatbot API failed');

      const data = await res.json();
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
      onLog('Asesor Comercial IA', 'Respondió consulta de forma exitosa.', 'success');

      // 🏛️ Check if a lead was successfully captured!
      if (data.leadCaptured && data.leadData) {
        const lead: Lead = {
          id: `l-inbound-${Date.now()}`,
          companyName: data.leadData.companyName,
          industry: data.leadData.industry,
          city: data.leadData.city || 'General Roca',
          address: `Dirección Registrada, ${data.leadData.city || 'General Roca'}`,
          contactName: data.leadData.contactName,
          contactPhone: data.leadData.contactPhone,
          contactRole: 'Inbound Prospect',
          painPoint: data.leadData.painPoint || 'Interesado en automatizar chatbot y CRM. Capturado por chatbot.',
          fitScore: 8,
          amountArs: 180000,
          meddicScore: 40,
          status: 'pendiente',
          source: 'inbound_chatbot',
          notes: [`Lead Inbound capturado de forma autónoma por el Asesor Comercial IA en el chat web el ${new Date().toLocaleDateString('es-AR')}.`],
          createdAt: new Date().toISOString()
        };

        onAddLead(lead);
        onLog('Asesor Comercial IA', `🔥 ¡LEAD INBOUND CAPTURADO! Registrado "${lead.companyName}" en columna PENDIENTE.`, 'success');
      }

    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Uff, mil disculpas, se me cortó la conexión un segundo. ¿Me podés repetir qué rubro tiene tu empresa?' }]);
      onLog('Asesor Comercial IA', 'Error al procesar consulta, cargado respuesta de resguardo.', 'error');
    } finally {
      setLoading(false);
      onAgentWorking('asesor_comercial', 'Standby (escuchando)', false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      { role: 'assistant', content: '¡Hola de nuevo! Chat reseteado. Contame qué rubro es tu empresa y te armo una propuesta comercial.' }
    ]);
    onLog('Asesor Comercial IA', 'Historial de chat reseteado.', 'info');
  };

  return (
    <div id="chatbot-widget-root" className="flex flex-col h-full bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              Asesor Comercial IA (Widget Inbound)
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5 font-mono">Captura leads inbound simulando tu web</p>
          </div>
        </div>

        {/* Clear chat button */}
        <button
          onClick={handleResetChat}
          className="p-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-500 hover:text-slate-300 cursor-pointer transition-colors"
          title="Resetear Chat"
        >
          <RefreshCw className="h-3 w-3" />
        </button>
      </div>

      {/* Suggestion buttons inside chat widget */}
      <div className="py-2.5 border-b border-slate-900 flex flex-wrap gap-1.5">
        <button 
          onClick={() => !loading && setInput('Quiero contratar el plan para mi ferretería en Roca')}
          disabled={loading}
          className="text-[9px] font-mono px-2 py-1 rounded bg-slate-900 border border-slate-850 text-slate-400 hover:text-white disabled:opacity-50"
        >
          "Quiero contratar"
        </button>
        <button 
          onClick={() => !loading && setInput('¿Cuáles son los 6 servicios clave de Clientum?')}
          disabled={loading}
          className="text-[9px] font-mono px-2 py-1 rounded bg-slate-900 border border-slate-850 text-slate-400 hover:text-white disabled:opacity-50"
        >
          "6 servicios clave"
        </button>
        <button 
          onClick={() => !loading && setInput('Contame algún caso de éxito de distribuidoras')}
          disabled={loading}
          className="text-[9px] font-mono px-2 py-1 rounded bg-slate-900 border border-slate-850 text-slate-400 hover:text-white disabled:opacity-50"
        >
          "Caso Distribuidoras"
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-1 scrollbar-thin scrollbar-thumb-slate-800 text-[11px] leading-relaxed max-h-[42vh]">
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div 
              key={idx} 
              className={`flex flex-col max-w-[85%] p-3 rounded-xl border ${
                isUser 
                  ? 'bg-slate-900 border-slate-800 text-slate-100 ml-auto rounded-tr-none' 
                  : 'bg-pink-950/20 border-pink-900/30 text-pink-100 mr-auto rounded-tl-none'
              }`}
            >
              <span className={`text-[8px] uppercase tracking-wider font-mono font-bold mb-1 ${
                isUser ? 'text-slate-500' : 'text-pink-400'
              }`}>
                {isUser ? 'Visitante Web' : 'Asesor Comercial IA'}
              </span>
              <p className="whitespace-pre-wrap font-sans">{msg.content}</p>
            </div>
          );
        })}

        {loading && (
          <div className="bg-pink-950/10 border border-pink-900/20 rounded-xl p-3 max-w-[85%] mr-auto rounded-tl-none animate-pulse">
            <div className="flex items-center gap-1.5 mb-1.5 text-[8px] font-mono font-bold text-pink-400">
              <Terminal className="h-3 w-3 animate-spin" />
              <span>Redactando respuesta...</span>
            </div>
            <div className="space-y-1.5">
              <div className="h-2.5 bg-slate-900 rounded w-5/6"></div>
              <div className="h-2.5 bg-slate-900 rounded w-1/2"></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="mt-4 pt-3 border-t border-slate-900 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribí un mensaje..."
          disabled={loading}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-pink-500/40 transition-all disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-slate-900 border border-slate-800 hover:border-pink-500/40 text-slate-400 hover:text-pink-400 p-2.5 rounded-xl transition-all disabled:opacity-40 cursor-pointer shrink-0"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>

    </div>
  );
}
