import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Bot, User, Phone, Search, RefreshCw, ToggleLeft, ToggleRight, Zap, Clock, AlertCircle, CheckCheck } from 'lucide-react';

interface WaConversation {
  id: number;
  phone: string;
  contact_name?: string;
  lead_id?: number;
  bot_active: boolean;
  last_message_at?: string;
  last_message?: string;
  unread?: number;
}

interface WaMessage {
  id: number;
  conversation_id: number;
  direction: 'inbound' | 'outbound';
  content: string;
  sent_by: 'bot' | 'human' | 'ai_suggestion';
  created_at: string;
}

const DEMO_CONVS: WaConversation[] = [
  { id: 1, phone: '+54 298 xxx-0001', contact_name: 'Ferretería El Tornillo', bot_active: true, last_message_at: new Date().toISOString(), last_message: 'Hola, me interesa el CRM', unread: 2 },
  { id: 2, phone: '+54 299 xxx-0002', contact_name: 'Distribuidora Norte', bot_active: false, last_message_at: new Date(Date.now() - 3600000).toISOString(), last_message: 'Gracias, quedamos en contacto' },
  { id: 3, phone: '+54 298 xxx-0003', contact_name: 'Clínica San Martín', bot_active: true, last_message_at: new Date(Date.now() - 7200000).toISOString(), last_message: '¿Cuánto cuesta el plan básico?' },
];

const DEMO_MESSAGES: Record<number, WaMessage[]> = {
  1: [
    { id: 1, conversation_id: 1, direction: 'inbound', content: 'Hola, me interesa el CRM para mi ferretería', sent_by: 'human', created_at: new Date(Date.now() - 600000).toISOString() },
    { id: 2, conversation_id: 1, direction: 'outbound', content: '¡Hola! Soy Santi de Clientum. Trabajamos con muchas ferreterías en la Patagonia. ¿Cuántos vendedores tenés en tu equipo?', sent_by: 'bot', created_at: new Date(Date.now() - 300000).toISOString() },
    { id: 3, conversation_id: 1, direction: 'inbound', content: 'Somos 3 vendedores y necesitamos organizar mejor los presupuestos', sent_by: 'human', created_at: new Date(Date.now() - 60000).toISOString() },
  ],
  2: [
    { id: 4, conversation_id: 2, direction: 'outbound', content: 'Hola, soy Santi de Clientum. Te contacto porque vi que tu distribuidora podría beneficiarse con nuestro sistema de seguimiento de clientes.', sent_by: 'bot', created_at: new Date(Date.now() - 7800000).toISOString() },
    { id: 5, conversation_id: 2, direction: 'inbound', content: 'Sí, andamos buscando algo así. Gracias, quedamos en contacto', sent_by: 'human', created_at: new Date(Date.now() - 3600000).toISOString() },
  ],
  3: [
    { id: 6, conversation_id: 3, direction: 'inbound', content: '¿Cuánto cuesta el plan básico?', sent_by: 'human', created_at: new Date(Date.now() - 7200000).toISOString() },
  ],
};

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return 'ahora';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min`;
  if (diff < 86400000) return d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
}

export default function CrmFullWhatsApp() {
  const [conversations, setConversations] = useState<WaConversation[]>([]);
  const [selected, setSelected] = useState<WaConversation | null>(null);
  const [messages, setMessages] = useState<WaMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sending, setSending] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { loadConversations(); }, []);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/whatsapp/conversations');
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
        setBackendAvailable(true);
      } else {
        throw new Error('Backend no disponible');
      }
    } catch {
      // Use demo data when Hermes Agent isn't connected yet
      setConversations(DEMO_CONVS);
      setBackendAvailable(false);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conv: WaConversation) => {
    setSelected(conv);
    setSuggestion(null);
    setLoadingMsgs(true);
    try {
      const res = await fetch(`/api/whatsapp/conversations/${conv.id}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      } else throw new Error();
    } catch {
      setMessages(DEMO_MESSAGES[conv.id] || []);
    } finally {
      setLoadingMsgs(false);
    }
  };

  const handleSend = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || !selected || sending) return;
    setSending(true);
    setSuggestion(null);
    const optimistic: WaMessage = {
      id: Date.now(),
      conversation_id: selected.id,
      direction: 'outbound',
      content,
      sent_by: 'human',
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimistic]);
    setInput('');
    try {
      await fetch(`/api/whatsapp/conversations/${selected.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
    } catch {}
    setSending(false);
  };

  const handleSuggest = async () => {
    if (!selected || suggesting) return;
    setSuggesting(true);
    setSuggestion(null);
    try {
      const res = await fetch(`/api/whatsapp/conversations/${selected.id}/suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });
      const data = await res.json();
      setSuggestion(data.suggestion || null);
    } catch {
      // Demo suggestion
      setSuggestion('Entendido. Para 3 vendedores, nuestro plan PyME es ideal. Incluye pipeline visual, brochures automáticos y seguimiento de clientes. ¿Querés que coordine una demo de 20 minutos esta semana?');
    } finally {
      setSuggesting(false);
    }
  };

  const handleToggleBot = async (conv: WaConversation) => {
    const updated = { ...conv, bot_active: !conv.bot_active };
    setConversations(prev => prev.map(c => c.id === conv.id ? updated : c));
    if (selected?.id === conv.id) setSelected(updated);
    try {
      await fetch(`/api/whatsapp/conversations/${conv.id}/bot`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bot_active: updated.bot_active }),
      });
    } catch {}
  };

  const filtered = conversations.filter(c =>
    !searchTerm || c.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm)
  );

  return (
    <div className="text-slate-200" style={{ height: 'calc(100vh - 160px)', minHeight: 480 }}>
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-emerald-400" />
          WhatsApp AI
        </h1>
        <div className="flex items-center gap-3">
          <p className="text-slate-400">Bandeja de conversaciones · Copilot IA · Hermes Agent</p>
          {backendAvailable === false && (
            <span className="text-xs px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">
              Modo demo — Hermes Agent no conectado
            </span>
          )}
          {backendAvailable === true && (
            <span className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
              ● Conectado
            </span>
          )}
        </div>
      </div>

      {/* Main layout */}
      <div className="flex gap-4 h-[calc(100%-80px)]">
        {/* Conversations panel */}
        <div className="w-72 flex-shrink-0 bg-[#0A101F]/60 border border-[#1E293B] rounded-xl flex flex-col overflow-hidden">
          <div className="p-3 border-b border-[#1E293B]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar contacto..."
                className="w-full bg-[#0A101F] border border-[#1E293B] rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/50"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <RefreshCw className="w-5 h-5 text-slate-500 animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">Sin conversaciones</div>
            ) : (
              filtered.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => loadMessages(conv)}
                  className={`w-full text-left p-3 border-b border-[#1E293B]/50 hover:bg-white/[0.03] transition-colors ${selected?.id === conv.id ? 'bg-sky-500/10 border-l-2 border-l-sky-500' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 text-emerald-400 text-sm font-bold">
                        {(conv.contact_name || conv.phone)[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{conv.contact_name || conv.phone}</p>
                        <p className="text-xs text-slate-500 truncate">{conv.last_message || conv.phone}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      {conv.last_message_at && (
                        <span className="text-xs text-slate-500">{formatTime(conv.last_message_at)}</span>
                      )}
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${conv.bot_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-600/30 text-slate-500'}`}>
                        {conv.bot_active ? '🤖 bot' : '👤 manual'}
                      </span>
                      {conv.unread ? <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center font-bold">{conv.unread}</span> : null}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
          <div className="p-3 border-t border-[#1E293B]">
            <button onClick={loadConversations} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors">
              <RefreshCw className="w-3 h-3" /> Actualizar
            </button>
          </div>
        </div>

        {/* Messages panel */}
        <div className="flex-1 bg-[#0A101F]/60 border border-[#1E293B] rounded-xl flex flex-col overflow-hidden">
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
              <MessageSquare className="w-12 h-12 opacity-20 mb-3" />
              <p className="text-sm">Seleccioná una conversación</p>
            </div>
          ) : (
            <>
              {/* Conversation header */}
              <div className="p-4 border-b border-[#1E293B] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                    {(selected.contact_name || selected.phone)[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{selected.contact_name || selected.phone}</p>
                    <p className="text-xs text-slate-500">{selected.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleBot(selected)}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${selected.bot_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' : 'bg-slate-600/20 text-slate-400 border-slate-600/30 hover:bg-slate-600/30'}`}
                  >
                    {selected.bot_active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    Bot {selected.bot_active ? 'activo' : 'pausado'}
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loadingMsgs ? (
                  <div className="flex items-center justify-center h-full">
                    <RefreshCw className="w-5 h-5 text-slate-500 animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-slate-500 text-sm py-12">Sin mensajes aún</div>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} className={`flex gap-2 ${msg.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}>
                      {msg.direction === 'inbound' && (
                        <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 mt-1">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      )}
                      <div className={`max-w-xs lg:max-w-md ${msg.direction === 'outbound' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                        <div className={`px-3 py-2 rounded-2xl text-sm ${
                          msg.direction === 'outbound'
                            ? msg.sent_by === 'bot'
                              ? 'bg-emerald-600/70 text-white rounded-tr-sm'
                              : 'bg-sky-600/70 text-white rounded-tr-sm'
                            : 'bg-[#1E293B] text-slate-200 rounded-tl-sm'
                        }`}>
                          {msg.content}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          {msg.direction === 'outbound' && (
                            msg.sent_by === 'bot' ? (
                              <span className="flex items-center gap-1"><Bot className="w-3 h-3 text-emerald-400" /> Bot</span>
                            ) : (
                              <span className="flex items-center gap-1"><User className="w-3 h-3 text-sky-400" /> Manual</span>
                            )
                          )}
                          <Clock className="w-3 h-3" />
                          {formatTime(msg.created_at)}
                          {msg.direction === 'outbound' && <CheckCheck className="w-3 h-3 text-slate-600" />}
                        </div>
                      </div>
                      {msg.direction === 'outbound' && (
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${msg.sent_by === 'bot' ? 'bg-emerald-500/20' : 'bg-sky-500/20'}`}>
                          {msg.sent_by === 'bot' ? <Bot className="w-3.5 h-3.5 text-emerald-400" /> : <User className="w-3.5 h-3.5 text-sky-400" />}
                        </div>
                      )}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* AI Suggestion */}
              {suggestion && (
                <div className="mx-4 mb-2 p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2 flex-1">
                      <Zap className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-300">{suggestion}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => { setInput(suggestion); setSuggestion(null); }}
                        className="text-xs text-purple-300 hover:text-purple-200 border border-purple-500/30 px-2 py-1 rounded-lg transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => { handleSend(suggestion); setSuggestion(null); }}
                        className="text-xs bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/30 px-2 py-1 rounded-lg transition-colors"
                      >
                        Enviar
                      </button>
                      <button onClick={() => setSuggestion(null)} className="text-xs text-slate-500 hover:text-slate-300 px-1">✕</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-[#1E293B]">
                <div className="flex items-end gap-2">
                  <button
                    onClick={handleSuggest}
                    disabled={suggesting || messages.length === 0}
                    className="flex items-center gap-1.5 text-xs px-3 py-2.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-xl hover:bg-purple-500/30 disabled:opacity-50 transition-colors flex-shrink-0"
                  >
                    {suggesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                    IA
                  </button>
                  <div className="flex-1 relative">
                    <textarea
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                      placeholder="Escribí tu mensaje... (Enter para enviar)"
                      rows={1}
                      className="w-full bg-[#0A101F] border border-[#1E293B] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/50 resize-none"
                    />
                  </div>
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || sending}
                    className="p-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors flex-shrink-0"
                  >
                    {sending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
                {backendAvailable === false && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-400">
                    <AlertCircle className="w-3 h-3" />
                    Modo demo — configurá el Hermes Agent para envíos reales
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
