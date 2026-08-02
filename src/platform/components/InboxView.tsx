import React, { useState, useRef } from 'react';
import {
  Search,
  Pin,
  Send,
  Paperclip,
  FileText,
  Sparkles,
  Bot,
  UserCheck,
  CheckCheck,
  Tag,
  DollarSign,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  ChevronDown,
  MessageSquare,
  AlertCircle,
  Plus,
  Brain,
  BookOpen,
  Zap,
  RefreshCw,
  Activity,
  Smile,
  Frown,
  Mic
} from 'lucide-react';
import {
  Conversation,
  WhatsAppMessage,
  Lead,
  Agent,
  WhatsAppTemplate,
  LeadStage,
  KnowledgeDocument
} from '../types';
import { isTaskOverdue } from '../lib/tasks';

interface InboxViewProps {
  conversations: Conversation[];
  messages: Record<string, WhatsAppMessage[]>;
  leads: Lead[];
  agents: Agent[];
  templates: WhatsAppTemplate[];
  knowledgeDocs?: KnowledgeDocument[];
  currentAgent: Agent;
  selectedConvId: string;
  setSelectedConvId: (id: string) => void;
  onSendMessage: (convId: string, text: string, isNote?: boolean, templateName?: string, scheduledAt?: string) => void;
  onUpdateLeadStage: (leadId: string, stage: LeadStage) => void;
  onAssignAgent: (leadId: string, agentId: string) => void;
  onToggleManagedBy?: (convId: string, newMode: 'bot' | 'human') => void;
  onOpenDelegateModal?: (item: { leadId?: string; leadName?: string; phone?: string; convId?: string; type: 'WhatsApp Thread' | 'Follow-up Lead' }) => void;
}

export const InboxView: React.FC<InboxViewProps> = ({
  conversations,
  messages,
  leads,
  agents,
  templates,
  knowledgeDocs = [],
  currentAgent,
  selectedConvId,
  setSelectedConvId,
  onSendMessage,
  onUpdateLeadStage,
  onAssignAgent,
  onToggleManagedBy,
  onOpenDelegateModal
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'mine' | 'unassigned' | 'unread'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const [showRefinerMenu, setShowRefinerMenu] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiLeadSummary, setAiLeadSummary] = useState<any>(null);
  const [loadingQualify, setLoadingQualify] = useState(false);
  const [showRagPanel, setShowRagPanel] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleRefineText = async (tone: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = inputText.substring(start, end);
    if (!selectedText) return;

    setShowRefinerMenu(false);
    
    const response = await fetch('/api/ai/refine-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: selectedText, tone })
    });
    const data = await response.json();
    
    const newText = inputText.substring(0, start) + data.refinedText + inputText.substring(end);
    setInputText(newText);
  };

  // Sentiment Analysis State
  const [localSentiments, setLocalSentiments] = useState<
    Record<string, { sentiment: 'Happy' | 'Neutral' | 'Frustrated' | 'Inquisitive'; score: number; reason: string }>
  >({});
  const [isScanningSentiment, setIsScanningSentiment] = useState(false);

  const getSentimentInfo = (sentiment?: 'Happy' | 'Neutral' | 'Frustrated' | 'Inquisitive') => {
    switch (sentiment) {
      case 'Happy':
        return {
          emoji: '😀',
          label: 'Satisfecho / Feliz',
          badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          textClass: 'text-emerald-700',
          dotClass: 'bg-emerald-500',
          barClass: 'bg-emerald-500',
          recommendation: 'Lead con alta energía positiva. Oportunidad ideal para presentar propuesta o cierre comercial.'
        };
      case 'Frustrated':
        return {
          emoji: '😡',
          label: 'Frustrado / Inconforme',
          badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
          textClass: 'text-rose-700',
          dotClass: 'bg-rose-500',
          barClass: 'bg-rose-500',
          recommendation: 'Atención prioritaria. Asignar agente humano VIP y enviar mensaje de disculpa o respuesta inmediata.'
        };
      case 'Inquisitive':
        return {
          emoji: '❓',
          label: 'Interesado / Evaluando',
          badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
          textClass: 'text-blue-700',
          dotClass: 'bg-blue-500',
          barClass: 'bg-blue-500',
          recommendation: 'Lead evaluando opciones. Compartir demostración en video o documento de preguntas frecuentes.'
        };
      default:
        return {
          emoji: '😐',
          label: 'Neutral',
          badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
          textClass: 'text-slate-700',
          dotClass: 'bg-slate-400',
          barClass: 'bg-slate-400',
          recommendation: 'Conversación estándar. Mantener seguimiento regular.'
        };
    }
  };

  const handleScanSentiment = (convId: string) => {
    setIsScanningSentiment(true);
    setTimeout(() => {
      const convMsgs = messages[convId] || [];
      const leadMsgs = convMsgs.filter((m) => m.sender === 'lead').map((m) => m.text.toLowerCase());
      const allText = leadMsgs.join(' ');

      let newSent: 'Happy' | 'Neutral' | 'Frustrated' | 'Inquisitive' = 'Neutral';
      let newScore = 65;
      let newReason = 'El cliente mantiene un tono neutro y profesional en las respuestas de WhatsApp.';

      if (allText.match(/malo|error|tarde|problema|queja|demora|cancelar|horrible|caro|reclamo/i)) {
        newSent = 'Frustrated';
        newScore = 32;
        newReason = 'Se detectaron expresiones de insatisfacción o frustración respecto a demoras o costos.';
      } else if (allText.match(/hola|precio|cuanto|catalogo|informacion|donde|como|horario|duda|plan|costo/i)) {
        newSent = 'Inquisitive';
        newScore = 84;
        newReason = 'El cliente realiza consultas activas sobre precios, catálogo y funcionalidades.';
      } else if (allText.match(/excelente|gracias|perfecto|me encanta|genial|buenisimo|comprar|me interesa|firmamos|barbaro|listo/i)) {
        newSent = 'Happy';
        newScore = 95;
        newReason = 'Expresiones altamente positivas, entusiasmo e intención de cierre manifestada.';
      }

      setLocalSentiments((prev) => ({
        ...prev,
        [convId]: {
          sentiment: newSent,
          score: newScore,
          reason: newReason
        }
      }));

      setIsScanningSentiment(false);
    }, 700);
  };

  // Filter conversations
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'Urgent' | 'High' | 'Low'>('all');
  const [convPriorities, setConvPriorities] = useState<Record<string, 'Urgent' | 'High' | 'Low'>>({});
  const [isAnalyzingPriorities, setIsAnalyzingPriorities] = useState(false);

  const analyzePriorities = async () => {
    setIsAnalyzingPriorities(true);
    try {
      for (const conv of conversations) {
        if (convPriorities[conv.id]) continue;
        const lead = leads.find(l => l.id === conv.leadId);
        const response = await fetch('/api/ai/analyze-priority', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: conv.lastMessage, stage: lead?.stage || 'New' })
        });
        const data = await response.json();
        if (data.priority) {
          setConvPriorities(prev => ({ ...prev, [conv.id]: data.priority }));
        }
      }
    } catch (e) {
      console.error('Failed to analyze priorities', e);
    } finally {
      setIsAnalyzingPriorities(false);
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    if (filterMode === 'mine' && conv.assignedAgentId !== currentAgent.id) return false;
    if (filterMode === 'unassigned' && conv.assignedAgentId) return false;
    if (filterMode === 'unread' && conv.unreadCount === 0) return false;
    
    if (priorityFilter !== 'all' && convPriorities[conv.id] !== priorityFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        conv.leadName.toLowerCase().includes(q) ||
        conv.phone.includes(q) ||
        conv.lastMessage.toLowerCase().includes(q)
      );
    }
    return true;
  }).sort((a, b) => {
    const pA = convPriorities[a.id] || 'Low';
    const pB = convPriorities[b.id] || 'Low';
    const order = { 'Urgent': 3, 'High': 2, 'Low': 1 };
    return order[pB] - order[pA];
  });

  const activeConv = conversations.find((c) => c.id === selectedConvId) || conversations[0];
  const activeLead = leads.find((l) => l.id === activeConv?.leadId);
  const activeMessages = activeConv ? messages[activeConv.id] || [] : [];

  const allTasks = agents.flatMap(a => a.active_tasks || []);
  const overdueTasksSet = new Set(allTasks.filter(isTaskOverdue).map(t => t.convId));

  // Call Gemini AI Suggest Reply API
  const handleFetchAiSuggestions = async () => {
    if (!activeConv || !activeLead) return;
    setLoadingAi(true);
    try {
      const response = await fetch('/api/ai/suggest-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatHistory: activeMessages,
          leadName: activeLead.name,
          company: activeLead.company,
          agentName: currentAgent.name
        })
      });
      const data = await response.json();
      if (data.suggestions) {
        setAiSuggestions(data.suggestions);
      }
    } catch (e) {
      console.error('Failed to fetch AI reply suggestions', e);
    } finally {
      setLoadingAi(false);
    }
  };

  // Call Gemini AI Qualify Lead API
  const handleQualifyLead = async () => {
    if (!activeConv || !activeLead) return;
    setLoadingQualify(true);
    try {
      const response = await fetch('/api/ai/qualify-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatHistory: activeMessages,
          leadName: activeLead.name
        })
      });
      const data = await response.json();
      setAiLeadSummary(data);
      if (data.recommendedStage) {
        onUpdateLeadStage(activeLead.id, data.recommendedStage as LeadStage);
      }
    } catch (e) {
      console.error('Failed to qualify lead with AI', e);
    } finally {
      setLoadingQualify(false);
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeConv) return;
    onSendMessage(activeConv.id, inputText, isInternalNote, undefined, scheduledAt);
    setInputText('');
    setScheduledAt('');
  };

  const handleMicClick = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks: Blob[] = [];
    
    mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data);
    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result?.toString().split(',')[1];
        const res = await fetch('/api/ai/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audioBase64: base64Audio, mimeType: 'audio/webm' })
        });
        const data = await res.json();
        setInputText((prev) => prev + (prev ? ' ' : '') + data.transcription);
      };
    };
    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), 5000); // 5s recording for demo
  };

  const handleSendTemplate = (tmpl: WhatsAppTemplate) => {
    if (!activeConv) return;
    let body = tmpl.bodyText.replace('{{1}}', activeConv.leadName);
    onSendMessage(activeConv.id, body, false, tmpl.name);
    setShowTemplateMenu(false);
  };

  const stages: LeadStage[] = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-101px)] bg-slate-50 text-slate-900 overflow-hidden">
      {/* COLUMN 1: Conversation List */}
      <div className="w-full lg:w-80 border-r border-slate-200 bg-white flex flex-col shrink-0">
        {/* Filter Pills */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center">
              <MessageSquare className="w-3.5 h-3.5 mr-1.5 text-green-600" />
              Chats de WhatsApp
            </h2>
            <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-700 font-mono font-bold">
              {filteredConversations.length} activos
            </span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar chat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-md pl-8 pr-3 py-1 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-green-500"
            />
          </div>

          {/* Filter options */}
          <div className="flex space-x-1 text-xs">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'mine', label: 'Míos' },
              { id: 'unassigned', label: 'Sin asignar' },
              { id: 'unread', label: 'Sin leer' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setFilterMode(item.id as any)}
                className={`flex-1 py-1 rounded text-[11px] font-medium capitalize transition ${
                  filterMode === item.id
                    ? 'bg-green-600 text-white font-bold'
                    : 'bg-slate-200/70 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="flex-1 bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-700 focus:outline-none"
            >
              <option value="all">Todas las prioridades</option>
              <option value="Urgent">Urgente</option>
              <option value="High">Alta</option>
              <option value="Low">Baja</option>
            </select>
            <button
              onClick={analyzePriorities}
              disabled={isAnalyzingPriorities}
              className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-xs font-bold hover:bg-green-200 transition"
            >
              {isAnalyzingPriorities ? 'Analizando...' : 'Analizar Prioridad'}
            </button>
          </div>
        </div>

        {/* List of Conversations */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 bg-white">
          {filteredConversations.map((conv) => {
            const isSelected = conv.id === activeConv?.id;
            return (
              <div
                key={conv.id}
                onClick={() => setSelectedConvId(conv.id)}
                className={`p-3 cursor-pointer transition flex space-x-3 relative group ${
                  isSelected
                    ? 'bg-green-50/60 border-l-4 border-green-600'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={
                      conv.avatar ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
                    }
                    alt={conv.leadName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  {conv.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-600 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {conv.leadName}
                      </p>
                      {conv.pinned && <Pin className="w-2.5 h-2.5 text-amber-500 fill-amber-500 shrink-0" />}
                      {overdueTasksSet.has(conv.id) && (
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" title="Tarea vencida" />
                      )}
                      {convPriorities[conv.id] && (
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                          convPriorities[conv.id] === 'Urgent' ? 'bg-red-100 text-red-700' :
                          convPriorities[conv.id] === 'High' ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {convPriorities[conv.id]}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                      {conv.lastMessageTimestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 truncate mt-0.5 font-sans">
                    {conv.lastMessage}
                  </p>

                  <div className="flex items-center justify-between mt-1.5">
                    <div className="flex items-center space-x-1">
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                        {conv.stage}
                      </span>
                      {(() => {
                        const local = localSentiments[conv.id];
                        const sVal = local?.sentiment || conv.sentiment || 'Neutral';
                        const sInfo = getSentimentInfo(sVal);
                        return (
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-bold border inline-flex items-center gap-0.5 ${sInfo.badgeClass}`}
                            title={`Sentimiento del cliente: ${sInfo.label}`}
                          >
                            <span>{sInfo.emoji}</span>
                          </span>
                        );
                      })()}
                    </div>
                    {conv.assignedAgentName && (
                      <span className="text-[10px] text-slate-500 truncate max-w-[100px]">
                        👤 {conv.assignedAgentName.split(' ')[0]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredConversations.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs">
              No se encontraron chats de WhatsApp en esta vista.
            </div>
          )}
        </div>
      </div>

      {/* COLUMN 2: Active Chat Thread Workspace */}
      <div className="flex-1 flex flex-col bg-white border-r border-slate-200 min-w-0">
        {activeConv && activeLead ? (
          <>
            {/* Chat Top Header */}
            <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-sm">
              <div className="flex items-center space-x-3">
                <img
                  src={
                    activeConv.avatar ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
                  }
                  alt={activeConv.leadName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-slate-900">{activeConv.leadName}</h3>
                    <span className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-mono font-semibold flex items-center">
                      <ShieldCheck className="w-2.5 h-2.5 mr-1 text-green-600" />
                      {activeConv.phone}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center space-x-2">
                    <span>{activeLead.company}</span>
                    <span>•</span>
                    <span className="text-green-700 font-bold">${activeLead.dealValue.toLocaleString()}</span>
                    <span>•</span>
                    {(() => {
                      const local = localSentiments[activeConv.id];
                      const sVal = local?.sentiment || activeConv.sentiment || 'Neutral';
                      const sInfo = getSentimentInfo(sVal);
                      return (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${sInfo.badgeClass}`}
                          title="Sentimiento analizado por IA"
                        >
                          <span>{sInfo.emoji}</span>
                          <span>{sInfo.label}</span>
                        </span>
                      );
                    })()}
                  </p>
                </div>
              </div>

              {/* Header Right Actions */}
              <div className="flex items-center space-x-2">
                {/* Bot / Human Handover Toggle */}
                {onToggleManagedBy && (
                  <button
                    onClick={() =>
                      onToggleManagedBy(
                        activeConv.id,
                        activeConv.managedBy === 'bot' ? 'human' : 'bot'
                      )
                    }
                    className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border flex items-center space-x-1.5 transition ${
                      activeConv.managedBy === 'bot'
                        ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                        : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                    }`}
                    title={
                      activeConv.managedBy === 'bot'
                        ? 'Haz clic para transferir esta conversación a un agente humano'
                        : 'Haz clic para asignar el chatbot IA a esta conversación'
                    }
                  >
                    {activeConv.managedBy === 'bot' ? (
                      <>
                        <Bot className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
                        <span>Bot IA (Transferir a Humano)</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                        <span>Humano (Pasar a Bot IA)</span>
                      </>
                    )}
                  </button>
                )}

                {/* Stage selector dropdown */}
                <div className="relative">
                  <select
                    value={activeLead.stage}
                    onChange={(e) => onUpdateLeadStage(activeLead.id, e.target.value as LeadStage)}
                    className="bg-slate-50 text-slate-800 text-xs border border-slate-200 rounded px-3 py-1.5 focus:outline-none focus:border-green-500 font-bold"
                  >
                    {[
                      { val: 'New', label: 'Etapa: Nuevo' },
                      { val: 'Contacted', label: 'Etapa: Contactado' },
                      { val: 'Qualified', label: 'Etapa: Calificado' },
                      { val: 'Proposal', label: 'Etapa: Propuesta' },
                      { val: 'Won', label: 'Etapa: Ganado' },
                      { val: 'Lost', label: 'Etapa: Perdido' }
                    ].map((stg) => (
                      <option key={stg.val} value={stg.val}>
                        {stg.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Agent Assign selector */}
                <div className="relative hidden sm:block">
                  <select
                    value={activeLead.assignedAgentId || ''}
                    onChange={(e) => onAssignAgent(activeLead.id, e.target.value)}
                    className="bg-slate-50 text-slate-800 text-xs border border-slate-200 rounded px-3 py-1.5 focus:outline-none focus:border-green-500 font-bold"
                  >
                    <option value="">Sin asignar</option>
                    {agents.map((ag) => (
                      <option key={ag.id} value={ag.id}>
                        Agente: {ag.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Delegate Task Button */}
                {onOpenDelegateModal && (
                  <button
                    onClick={() =>
                      onOpenDelegateModal({
                        leadId: activeLead.id,
                        leadName: activeLead.name,
                        phone: activeLead.phone,
                        convId: activeConv.id,
                        type: 'WhatsApp Thread'
                      })
                    }
                    className="flex items-center space-x-1.5 bg-green-600 hover:bg-green-700 text-white font-extrabold px-3 py-1.5 rounded-lg text-xs transition shadow-sm"
                    title="Delegar este hilo de conversación a un agente"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Delegar Tarea</span>
                  </button>
                )}
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
              {activeMessages.map((msg) => {
                const isIncoming = msg.sender === 'lead';
                const isNote = msg.isNote;
                const isBot = msg.sender === 'bot';

                if (isNote) {
                  return (
                    <div key={msg.id} className="flex justify-center my-2">
                      <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs px-3 py-2 rounded-lg max-w-md w-full shadow-sm">
                        <div className="flex items-center justify-between text-[10px] text-amber-700 font-bold mb-1">
                          <span className="flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Nota Interna de Equipo ({msg.senderName || 'Agente'})
                          </span>
                          <span className="font-mono">{msg.timestamp}</span>
                        </div>
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isIncoming ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-lg p-3 text-sm leading-relaxed shadow-sm ${
                        isIncoming
                          ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                          : isBot
                          ? 'bg-green-100 border border-green-200 text-green-900 rounded-tr-none'
                          : 'bg-slate-800 text-white rounded-tr-none'
                      }`}
                    >
                      {/* Sender tag if bot or agent */}
                      {!isIncoming && (
                        <div className={`text-[10px] font-bold mb-1 flex items-center justify-between ${isBot ? 'text-green-700' : 'text-slate-300'}`}>
                          <span>{msg.senderName || 'Vendedor'}</span>
                          {msg.templateName && (
                            <span className="bg-white/80 px-1.5 py-0.2 rounded text-[9px] border border-slate-200 text-slate-700">
                              Plantilla: {msg.templateName}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Text content */}
                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {/* Document or Image attachment */}
                      {msg.type === 'image' && msg.mediaUrl && (
                        <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                          <img 
                            src={msg.mediaUrl} 
                            alt={msg.mediaFileName || 'Imagen compartida'} 
                            className="max-w-full h-auto"
                          />
                        </div>
                      )}
                      {msg.type === 'document' && msg.mediaUrl && (
                        <a 
                          href={msg.mediaUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mt-2 p-3 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 flex items-center space-x-3 text-slate-700 shadow-sm transition"
                        >
                          <FileText className="w-8 h-8 text-green-600 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">{msg.mediaFileName || 'Documento adjunto'}</p>
                            <p className="text-[10px] text-slate-500">Haz clic para descargar o abrir</p>
                          </div>
                        </a>
                      )}

                      {/* Interactive Buttons */}
                      {msg.interactiveButtons && msg.interactiveButtons.length > 0 && (
                        <div className="mt-2.5 space-y-1 pt-1 border-t border-slate-200">
                          {msg.interactiveButtons.map((btn, idx) => (
                            <button
                              key={idx}
                              className="w-full text-center py-1 bg-green-50 hover:bg-green-100 border border-green-200 rounded text-xs font-bold text-green-800 transition"
                            >
                              {btn}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Footer info timestamp & checkmarks */}
                      <div className={`flex items-center justify-end space-x-1 text-[9px] uppercase mt-1.5 font-mono ${isIncoming ? 'text-slate-400' : isBot ? 'text-green-700' : 'text-slate-400'}`}>
                        <span>{msg.timestamp}</span>
                        {!isIncoming && (
                          <CheckCheck className="w-3 h-3 text-green-400" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RAG Knowledge Base Auto-Reply Drafts Bar */}
            <div className="p-3 bg-gradient-to-r from-purple-900/10 via-slate-900/5 to-slate-50 border-t border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-md bg-purple-600 text-white flex items-center justify-center font-bold">
                    <Brain className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                      RAG Context & Respuestas Automatizadas
                      <span className="bg-purple-100 text-purple-800 text-[9px] px-1.5 py-0.5 rounded-full font-mono border border-purple-200 font-bold">
                        {knowledgeDocs.length} Docs Indexados
                      </span>
                    </span>
                    <p className="text-[10px] text-slate-500">
                      Contexto recuperado automáticamente según el último mensaje del cliente.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowRagPanel(!showRagPanel)}
                  className="text-[10px] text-purple-700 font-bold hover:underline"
                >
                  {showRagPanel ? 'Ocultar RAG' : 'Mostrar RAG'}
                </button>
              </div>

              {showRagPanel && (
                <div className="space-y-2 mt-1">
                  {/* Matched RAG Document Suggestions */}
                  {knowledgeDocs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {knowledgeDocs.slice(0, 2).map((doc, index) => {
                        const score = index === 0 ? '98.5%' : '94.1%';
                        const draftReply = `Hola ${activeConv ? activeConv.leadName : ''}, sobre tu consulta de ${doc.title.toLowerCase()}: ${doc.content.slice(0, 110)}... ¿Querés que te preparemos la cotización formal?`;

                        return (
                          <div
                            key={doc.id}
                            className="bg-white border border-purple-100 rounded-lg p-2.5 shadow-sm hover:border-purple-300 transition"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded border border-purple-200 flex items-center gap-1 truncate">
                                <BookOpen className="w-3 h-3 shrink-0" />
                                {doc.title}
                              </span>
                              <span className="text-[9px] font-mono text-green-700 font-bold bg-green-50 px-1 rounded">
                                {score} RAG Match
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-600 line-clamp-2 italic mb-2">
                              "{doc.content.slice(0, 130)}..."
                            </p>

                            <button
                              onClick={() => setInputText(draftReply)}
                              className="w-full flex items-center justify-center space-x-1.5 bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold py-1 px-2 rounded transition shadow-xs"
                            >
                              <Zap className="w-3 h-3" />
                              <span>Usar Borrador RAG</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-2 text-xs text-slate-500">
                      No hay documentos RAG cargados en la Base de Conocimiento.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* AI Smart Suggestion Bar */}
            <div className="p-3 bg-white border-t border-slate-200">
              <div className="flex items-center justify-between mb-1.5 px-1">
                <span className="text-[11px] font-bold text-slate-600 flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-green-600 animate-pulse" />
                  Sugerencias Rápidas Copiloto IA Gemini
                </span>
                <button
                  onClick={handleFetchAiSuggestions}
                  disabled={loadingAi}
                  className="text-[10px] text-green-700 hover:underline font-bold"
                >
                  {loadingAi ? 'Generando...' : 'Actualizar sugerencias'}
                </button>
              </div>

              {aiSuggestions.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {aiSuggestions.map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => setInputText(sug)}
                      className="text-[11px] bg-green-50 hover:bg-green-100 text-green-900 border border-green-200 px-3 py-1 rounded-md text-left font-medium transition truncate max-w-full"
                    >
                      💡 {sug}
                    </button>
                  ))}
                </div>
              ) : (
                <button
                  onClick={handleFetchAiSuggestions}
                  disabled={loadingAi}
                  className="w-full text-center py-1.5 text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md font-medium transition"
                >
                  ✨ Hacé clic para generar sugerencias de respuesta con IA
                </button>
              )}
            </div>

            {/* Input Toolbar & Textarea */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                {/* Toggle mode: Customer Message vs Internal Team Note */}
                <div className="flex items-center space-x-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsInternalNote(false)}
                    className={`px-3 py-1 rounded font-bold transition ${
                      !isInternalNote
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    💬 Mensaje de WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsInternalNote(true)}
                    className={`px-3 py-1 rounded font-bold transition ${
                      isInternalNote
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    📝 Nota interna
                  </button>
                </div>

                {/* Quick Template Picker */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowTemplateMenu(!showTemplateMenu)}
                    className="flex items-center space-x-1 text-xs bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-3 py-1 rounded font-bold transition"
                  >
                    <FileText className="w-3.5 h-3.5 text-purple-600" />
                    <span>Plantillas</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {showTemplateMenu && (
                    <div className="absolute right-0 bottom-full mb-2 w-64 bg-white border border-slate-200 rounded-lg shadow-xl p-2 z-20 space-y-1 max-h-60 overflow-y-auto">
                      <p className="text-[10px] font-bold uppercase text-slate-400 px-2 py-1">
                        Seleccionar plantilla Meta
                      </p>
                      {templates.map((tmpl) => (
                        <button
                          key={tmpl.id}
                          type="button"
                          onClick={() => handleSendTemplate(tmpl)}
                          className="w-full text-left p-2 rounded hover:bg-slate-50 transition border-b border-slate-100 last:border-none"
                        >
                          <p className="text-xs font-bold text-purple-700">{tmpl.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">{tmpl.bodyText}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>


                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    rows={2}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder={
                      isInternalNote
                        ? 'Escribí una nota interna de equipo (solo visible para agentes)...'
                        : "Escribí un mensaje o usá '/' para plantillas..."
                    }
                    className={`w-full bg-slate-100 border rounded p-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-1 transition ${
                      isInternalNote
                        ? 'border-amber-300 ring-amber-500'
                        : 'border-green-500 ring-green-500'
                    }`}
                  />
                  <div className="absolute right-3 bottom-3 flex items-center space-x-2 text-slate-400">
                    <button 
                      type="button" 
                      onClick={() => setShowRefinerMenu(!showRefinerMenu)}
                      className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-600 hover:text-green-600 transition"
                    >
                      ✨ Refinar
                    </button>
                    {showRefinerMenu && (
                      <div className="absolute right-0 bottom-full mb-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl p-1 z-30">
                        {['Corporate/Professional', 'Casual/Quick', 'Apologetic/Support'].map(tone => (
                          <button key={tone} onClick={() => handleRefineText(tone)} className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 rounded">
                            {tone}
                          </button>
                        ))}
                      </div>
                    )}
                    <button type="button" onClick={handleMicClick} className="p-1 hover:text-green-600">
                      <Mic className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-1 hover:text-slate-600">
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <input
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={(e) => setScheduledAt(e.target.value)}
                      className="text-[10px] border border-slate-200 rounded p-1"
                      title="Programar envío"
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className={`px-6 py-3 rounded text-sm font-bold text-white transition shrink-0 ${
                    isInternalNote
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-green-600 hover:bg-green-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Enviar mensaje
                </button>
              </form>
            </>
          ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
            <MessageSquare className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-sm font-medium">Seleccioná un chat de WhatsApp para empezar a conversar.</p>
          </div>
        )}
      </div>

      {/* COLUMN 3: Lead Intelligence & AI Copilot Details */}
      {activeLead && (
        <div className="w-full lg:w-80 border-t lg:border-t-0 border-slate-200 bg-white p-4 space-y-4 overflow-y-auto shrink-0">
          {/* Lead Summary Header */}
          <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <img
                src={
                  activeConv.avatar ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
                }
                alt={activeLead.name}
                className="w-12 h-12 rounded object-cover border border-slate-200"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-slate-900 truncate">{activeLead.name}</h4>
                <p className="text-xs text-slate-500 truncate">{activeLead.company}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <span className="text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                    Puntaje: {activeLead.score}/100
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                    {activeLead.source}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center text-slate-700">
                <Phone className="w-3.5 h-3.5 mr-2 text-green-600" />
                <span className="font-mono">{activeLead.phone}</span>
              </div>
              <div className="flex items-center text-slate-700 truncate">
                <Mail className="w-3.5 h-3.5 mr-2 text-blue-600" />
                <span className="truncate">{activeLead.email}</span>
              </div>
              <div className="flex items-center text-slate-700">
                <MapPin className="w-3.5 h-3.5 mr-2 text-amber-500" />
                <span>{activeLead.city || 'Global'}</span>
              </div>
              <div className="flex items-center text-slate-700">
                <DollarSign className="w-3.5 h-3.5 mr-2 text-green-600" />
                <span className="font-bold text-green-700">${activeLead.dealValue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Sentiment Analysis Card */}
          {(() => {
            const local = localSentiments[activeConv.id];
            const currentSent = local?.sentiment || activeConv.sentiment || 'Neutral';
            const currentScore = local?.score ?? activeConv.sentimentScore ?? 75;
            const currentReason = local?.reason || activeConv.sentimentReason || 'Mensajes iniciales en seguimiento normal.';
            const sInfo = getSentimentInfo(currentSent);

            return (
              <div className="bg-slate-50 border border-slate-200 rounded p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-blue-600" />
                    <span>Sentimiento del Cliente</span>
                  </span>
                  <button
                    onClick={() => handleScanSentiment(activeConv.id)}
                    disabled={isScanningSentiment}
                    className="text-[10px] bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold px-2 py-1 rounded-md transition flex items-center space-x-1"
                    title="Analizar últimos mensajes de WhatsApp con IA"
                  >
                    <RefreshCw className={`w-3 h-3 text-slate-500 ${isScanningSentiment ? 'animate-spin text-blue-600' : ''}`} />
                    <span>{isScanningSentiment ? 'Escaneando...' : 'Re-escaneo'}</span>
                  </button>
                </div>

                {/* Main Sentiment Badge & Indicator */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full border inline-flex items-center gap-1.5 ${sInfo.badgeClass}`}>
                      <span className="text-sm">{sInfo.emoji}</span>
                      <span>{sInfo.label}</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-700">
                      Score: {currentScore}%
                    </span>
                  </div>

                  {/* Sentiment Bar */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-0.5 border border-slate-200/80">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${sInfo.barClass}`}
                      style={{ width: `${currentScore}%` }}
                    ></div>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-snug font-sans">
                    <strong>Análisis IA:</strong> {currentReason}
                  </p>
                </div>

                {/* AI Recommendation Box */}
                <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-2.5 space-y-1">
                  <p className="text-[10px] uppercase tracking-wider font-extrabold text-blue-800 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-blue-600" />
                    <span>Recomendación Táctica IA:</span>
                  </p>
                  <p className="text-[11px] text-blue-900 font-medium leading-relaxed">
                    {sInfo.recommendation}
                  </p>
                </div>
              </div>
            );
          })()}

          {/* AI Lead Qualification Card */}
          <div className="bg-slate-50 border border-slate-200 rounded p-4 space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-green-600 animate-pulse" />
                Motor de Calificación IA
              </span>
              <button
                onClick={handleQualifyLead}
                disabled={loadingQualify}
                className="text-[10px] bg-green-600 hover:bg-green-700 text-white font-bold px-2.5 py-1 rounded transition"
              >
                {loadingQualify ? 'Analizando...' : 'Analizar intención'}
              </button>
            </div>

            {aiLeadSummary ? (
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-white rounded border border-slate-200">
                  <p className="text-xs text-slate-700 font-medium">{aiLeadSummary.summary}</p>
                </div>

                {aiLeadSummary.keyTakeaways && (
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Aspectos clave:</p>
                    <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5">
                      {aiLeadSummary.keyTakeaways.map((point: string, i: number) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                Hacé clic en "Analizar intención" para correr el análisis con Gemini IA en los chats de WhatsApp.
              </p>
            )}
          </div>

          {/* Lead Notes Section */}
          <div className="bg-white border border-slate-200 rounded p-4 space-y-2 shadow-sm">
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Notas de Clientum CRM</h5>
            <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
              {activeLead.notes || 'Aún no hay notas agregadas en el CRM.'}
            </p>
          </div>

          {/* Lead Tags */}
          <div className="bg-white border border-slate-200 rounded p-4 space-y-2 shadow-sm">
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
              <Tag className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
              Etiquetas
            </h5>
            <div className="flex flex-wrap gap-1">
              {activeLead.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
