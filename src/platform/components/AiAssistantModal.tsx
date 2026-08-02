import React, { useState } from 'react';
import { X, Bot, Send, Sparkles, Terminal, Code, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';
import { Site, BenchNode } from '../types';

interface AiAssistantModalProps {
  sites: Site[];
  benches: BenchNode[];
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const PRESET_PROMPTS = [
  'How do I tune MariaDB max_connections and InnoDB buffer pool for 100 Frappe sites?',
  'Troubleshoot: Bench worker short queue backlog spiking to 500 tasks',
  'Generate an Nginx & Traefik configuration template for custom domain SSL termination',
  'What are best practices for upgrading ERPNext v15 sites to v16 without downtime?',
];

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ sites, benches, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: `Hello! I am your **Control Plane AI Assistant** powered by Gemini 3.6 Flash.
How can I assist you with bench cluster optimization, site migration debugging, database connection pooling, or custom domain Traefik routing today?`,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState<string>('');
  const [selectedBenchId, setSelectedBenchId] = useState<string>('');

  const handleSend = async (queryToSend?: string) => {
    const q = queryToSend || inputQuery;
    if (!q.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const siteContext = sites.find((s) => s.id === selectedSiteId);
      const benchContext = benches.find((b) => b.id === selectedBenchId);

      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          siteContext,
          benchContext,
        }),
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: data.answer || 'No response returned.',
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `⚠️ **AI DevOps Assistant Error:** ${err?.message || 'Failed to communicate with server.'}`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100 my-6 flex flex-col h-[650px] overflow-hidden">
        
        {/* Title Bar */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 p-0.5 flex items-center justify-center shadow-md">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">DevOps AI Copilot</h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Gemini 3.6 Flash
                </span>
              </div>
              <p className="text-xs text-slate-400">
                ERPNext & Frappe Bench infrastructure expert
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Context Selector Bar */}
        <div className="px-6 py-2.5 bg-slate-950/50 border-b border-slate-800/80 flex items-center gap-3 text-xs shrink-0">
          <span className="text-slate-400 font-semibold text-[11px] uppercase">Attach Context:</span>
          
          <select
            value={selectedSiteId}
            onChange={(e) => setSelectedSiteId(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 text-xs focus:outline-none"
          >
            <option value="">-- No Specific Site --</option>
            {sites.map((s) => (
              <option key={s.id} value={s.id}>
                Site: {s.name} ({s.subdomain})
              </option>
            ))}
          </select>

          <select
            value={selectedBenchId}
            onChange={(e) => setSelectedBenchId(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 text-xs focus:outline-none"
          >
            <option value="">-- No Specific Bench --</option>
            {benches.map((b) => (
              <option key={b.id} value={b.id}>
                Bench: {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Chat History Box */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-xl p-4 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white font-medium rounded-tr-none'
                    : 'bg-slate-950/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-md font-sans'
                }`}
              >
                {msg.text}
                <div className="text-[10px] text-slate-400 text-right mt-1 font-mono opacity-60">
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 text-purple-400 animate-pulse text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Analyzing control plane metrics and generating solution...</span>
            </div>
          )}
        </div>

        {/* Quick Preset Prompts */}
        <div className="px-6 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto shrink-0">
          <span className="text-[10px] text-slate-500 font-bold uppercase shrink-0">Presets:</span>
          {PRESET_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-[11px] text-slate-300 whitespace-nowrap border border-slate-700/60 transition-colors shrink-0"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-3 shrink-0">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about bench tuning, site migration, or MariaDB/Redis config..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />

          <button
            onClick={() => handleSend()}
            disabled={isLoading || !inputQuery.trim()}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-purple-950/40 transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </div>

      </div>
    </div>
  );
};
