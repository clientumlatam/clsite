import React, { useState, useRef } from 'react';
import {
  Bot,
  HelpCircle,
  UserCheck,
  ShieldCheck,
  Plus,
  Search,
  Trash2,
  Edit2,
  Send,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  UserPlus,
  RefreshCw,
  Zap,
  Settings,
  MessageSquare,
  ArrowRight,
  User,
  Building,
  Mail,
  Phone,
  Check,
  X,
  Play,
  RotateCcw,
  Mic
} from 'lucide-react';
// Firebase removed — using local state only in this context.

import {
  ChatbotConfig,
  FaqItem,
  ChatbotHandoverRule,
  Agent,
  LeadCollectedData
} from '../types';

interface ChatbotViewProps {
  config: ChatbotConfig;
  agents: Agent[];
  onUpdateConfig: (newConfig: ChatbotConfig) => void;
}

interface TestChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  timestamp: string;
  matchedFaq?: string;
  extractedData?: Partial<LeadCollectedData>;
  handoverTriggered?: boolean;
  handoverReason?: string;
}

export const ChatbotView: React.FC<ChatbotViewProps> = ({
  config,
  agents,
  onUpdateConfig
}) => {
  const [activeTab, setActiveTab] = useState<'faqs' | 'handover' | 'collector' | 'simulator'>('simulator');
  const [searchFaq, setSearchFaq] = useState('');

  // Simulator State
  const [simulatorInput, setSimulatorInput] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [chatHistory, setChatHistory] = useState<TestChatMessage[]>([
    {
      id: 'msg_0',
      sender: 'bot',
      text: config.welcomeMessage || '¡Hola! 👋 Soy el Asistente Virtual Inteligente de Clientum CRM. ¿En qué te puedo asesorar hoy?',
      timestamp: '10:00 AM'
    }
  ]);
  const [collectedLeadData, setCollectedLeadData] = useState<Partial<LeadCollectedData>>({});

  // Modal States
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqCategory, setFaqCategory] = useState('CRM Features');
  const [faqKeywords, setFaqKeywords] = useState('');

  const [showRuleModal, setShowRuleModal] = useState(false);
  const [editingRule, setEditingRule] = useState<ChatbotHandoverRule | null>(null);
  const [ruleName, setRuleName] = useState('');
  const [ruleCondition, setRuleCondition] = useState<ChatbotHandoverRule['condition']>('explicit_agent_request');
  const [ruleThreshold, setRuleThreshold] = useState<number>(5000);
  const [ruleAgentId, setRuleAgentId] = useState<string>(agents[0]?.id || 'agent_1');
  const [ruleDescription, setRuleDescription] = useState('');

  // Handler: Toggle Bot Main Switch
  const handleToggleBot = () => {
    onUpdateConfig({
      ...config,
      isEnabled: !config.isEnabled
    });
  };

  // Handler: Send Message in Chat
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isSimulating) return;

    const userMsgText = text.trim();
    setSimulatorInput('');

    const userMsg: TestChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setIsSimulating(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsgText,
          history: chatHistory,
          model: 'gemini-3.6-flash',
          systemInstruction: "You are a helpful assistant for Clientum CRM."
        })
      });

      const data = await res.json();
      const botMsg: TestChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: data.response || '...',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatHistory((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleMicClick = async () => {
    // Basic Mic handling (assuming browser API)
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
        handleSendMessage(data.transcription);
      };
    };
    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), 5000); // 5s recording for demo
  };

  const handleResetSimulator = () => {
    setChatHistory([
      {
        id: 'msg_0',
        sender: 'bot',
        text: config.welcomeMessage || '¡Hola! 👋 Soy el Asistente Virtual Inteligente de Clientum CRM. ¿En qué te puedo asesorar hoy?',
        timestamp: '10:00 AM'
      }
    ]);
    setCollectedLeadData({});
  };

  // FAQ Modal Handlers
  const handleOpenAddFaq = () => {
    setEditingFaq(null);
    setFaqQuestion('');
    setFaqAnswer('');
    setFaqCategory('CRM Features');
    setFaqKeywords('');
    setShowFaqModal(true);
  };

  const handleOpenEditFaq = (faq: FaqItem) => {
    setEditingFaq(faq);
    setFaqQuestion(faq.question);
    setFaqAnswer(faq.answer);
    setFaqCategory(faq.category);
    setFaqKeywords(faq.keywords ? faq.keywords.join(', ') : '');
    setShowFaqModal(true);
  };

  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuestion.trim() || !faqAnswer.trim()) return;

    const keywordsArray = faqKeywords
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    let updatedFaqs = [...config.faqs];

    if (editingFaq) {
      updatedFaqs = updatedFaqs.map((f) =>
        f.id === editingFaq.id
          ? { ...f, question: faqQuestion, answer: faqAnswer, category: faqCategory, keywords: keywordsArray }
          : f
      );
    } else {
      const newFaq: FaqItem = {
        id: `faq_${Date.now()}`,
        question: faqQuestion,
        answer: faqAnswer,
        category: faqCategory,
        keywords: keywordsArray
      };
      updatedFaqs.push(newFaq);
    }

    onUpdateConfig({ ...config, faqs: updatedFaqs });
    setShowFaqModal(false);
  };

  const handleDeleteFaq = (id: string) => {
    const updated = config.faqs.filter((f) => f.id !== id);
    onUpdateConfig({ ...config, faqs: updated });
  };

  // Rule Modal Handlers
  const handleOpenAddRule = () => {
    setEditingRule(null);
    setRuleName('');
    setRuleCondition('explicit_agent_request');
    setRuleThreshold(5000);
    setRuleAgentId(agents[0]?.id || 'agent_1');
    setRuleDescription('');
    setShowRuleModal(true);
  };

  const handleOpenEditRule = (rule: ChatbotHandoverRule) => {
    setEditingRule(rule);
    setRuleName(rule.name);
    setRuleCondition(rule.condition);
    setRuleThreshold(rule.threshold || 5000);
    setRuleAgentId(rule.defaultAgentId || agents[0]?.id || 'agent_1');
    setRuleDescription(rule.description);
    setShowRuleModal(true);
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim()) return;

    let updatedRules = [...config.handoverRules];

    if (editingRule) {
      updatedRules = updatedRules.map((r) =>
        r.id === editingRule.id
          ? {
              ...r,
              name: ruleName,
              condition: ruleCondition,
              threshold: ruleThreshold,
              defaultAgentId: ruleAgentId,
              description: ruleDescription
            }
          : r
      );
    } else {
      const newRule: ChatbotHandoverRule = {
        id: `hr_${Date.now()}`,
        name: ruleName,
        condition: ruleCondition,
        threshold: ruleThreshold,
        defaultAgentId: ruleAgentId,
        action: 'assign_human_agent',
        isEnabled: true,
        description: ruleDescription
      };
      updatedRules.push(newRule);
    }

    onUpdateConfig({ ...config, handoverRules: updatedRules });
    setShowRuleModal(false);
  };

  const handleDeleteRule = (id: string) => {
    const updated = config.handoverRules.filter((r) => r.id !== id);
    onUpdateConfig({ ...config, handoverRules: updated });
  };

  const filteredFaqs = config.faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(searchFaq.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchFaq.toLowerCase()) ||
      f.category.toLowerCase().includes(searchFaq.toLowerCase())
  );

  return (
    <div className="flex-1 bg-slate-50 min-h-screen p-4 lg:p-6 overflow-y-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <span className="bg-green-100 text-green-800 p-2.5 rounded-xl">
              <Bot className="w-6 h-6 text-green-700" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Chatbot IA & Transición Fluida a Humano</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Responde preguntas frecuentes (FAQs), recolecta datos clave de prospectos y transfiere llamadas a agentes en vivo.
              </p>
            </div>
          </div>
        </div>

        {/* Master Bot Switch */}
        <div className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200 shrink-0">
          <div className="text-right">
            <span className="text-xs font-bold text-slate-800 block">
              Status del Chatbot IA
            </span>
            <span className={`text-[10px] font-bold ${config.isEnabled ? 'text-green-600' : 'text-slate-400'}`}>
              {config.isEnabled ? '● Activo en Canales WABA' : '○ Pausado'}
            </span>
          </div>

          <button
            onClick={handleToggleBot}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              config.isEnabled ? 'bg-green-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                config.isEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">FAQs Predefinidas</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{config.faqs.length}</p>
            <span className="text-[10px] text-green-600 font-medium">Respuestas Automatizadas</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
            <HelpCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Reglas de Derivación</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{config.handoverRules.length}</p>
            <span className="text-[10px] text-blue-600 font-medium">Handover Configurado</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Traspasos a Humanos</p>
            <p className="text-2xl font-black text-purple-700 mt-1">{config.handoverCountTotal || 18}</p>
            <span className="text-[10px] text-purple-600 font-medium">Sin Fricción en Chat</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Leads Capturados por Bot</p>
            <p className="text-2xl font-black text-emerald-700 mt-1">{config.infoCollectedTotal || 42}</p>
            <span className="text-[10px] text-emerald-600 font-medium">Nombre, Email & Empresa</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <UserPlus className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 mb-6 bg-white rounded-t-xl px-4 pt-2">
        <button
          onClick={() => setActiveTab('simulator')}
          className={`pb-3 px-4 font-bold text-xs flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'simulator'
              ? 'border-green-600 text-green-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>Simulador & Prueba en Vivo</span>
        </button>

        <button
          onClick={() => setActiveTab('faqs')}
          className={`pb-3 px-4 font-bold text-xs flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'faqs'
              ? 'border-green-600 text-green-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Preguntas Frecuentes ({config.faqs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('handover')}
          className={`pb-3 px-4 font-bold text-xs flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'handover'
              ? 'border-green-600 text-green-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Reglas de Traspaso a Humano ({config.handoverRules.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('collector')}
          className={`pb-3 px-4 font-bold text-xs flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'collector'
              ? 'border-green-600 text-green-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Campos de Captura de Prospectos</span>
        </button>
      </div>

      {/* TAB 1: SIMULATOR & TEST BENCH */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Simulated WhatsApp Chat Phone Interface */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
            {/* Chat Phone Header */}
            <div className="bg-slate-900 text-white p-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xs shadow-inner">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="w-2.5 h-2.5 bg-green-400 border-2 border-slate-900 rounded-full absolute bottom-0 right-0" />
                </div>

                <div>
                  <h3 className="text-xs font-bold">{config.botName}</h3>
                  <p className="text-[10px] text-green-400">● En línea | Gemini 3.6 Flash Engine</p>
                </div>
              </div>

              <button
                onClick={handleResetSimulator}
                className="text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg transition flex items-center space-x-1"
                title="Reiniciar Simulación"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reiniciar</span>
              </button>
            </div>

            {/* Chat Messages Stream */}
            <div className="flex-1 bg-[#efeae2] p-4 overflow-y-auto space-y-3">
              {chatHistory.map((msg) => {
                if (msg.sender === 'system') {
                  return (
                    <div key={msg.id} className="flex justify-center my-2">
                      <div className="bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-semibold px-3 py-1.5 rounded-xl shadow-xs max-w-md text-center">
                        {msg.text}
                      </div>
                    </div>
                  );
                }

                const isUser = msg.sender === 'user';
                return (
                  <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-xl p-3 shadow-xs relative text-xs leading-relaxed ${
                        isUser
                          ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-none'
                          : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>

                      {/* Badge annotations for debug info */}
                      {msg.matchedFaq && (
                        <div className="mt-2 pt-1.5 border-t border-slate-200/60 flex items-center text-[10px] text-green-700 font-medium">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          <span>FAQ Coincidente: "{msg.matchedFaq}"</span>
                        </div>
                      )}

                      {msg.extractedData && Object.keys(msg.extractedData).length > 0 && (
                        <div className="mt-1.5 pt-1 border-t border-slate-200/60 text-[10px] text-purple-700 font-mono">
                          ✨ Datos extraídos: {JSON.stringify(msg.extractedData)}
                        </div>
                      )}

                      <span className="text-[9px] text-slate-400 block text-right mt-1 font-mono">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isSimulating && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-xs text-xs text-slate-400 flex items-center space-x-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-green-600" />
                    <span>El bot está pensando la respuesta...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(simulatorInput);
              }}
              className="bg-slate-100 p-2.5 border-t border-slate-200 flex items-center space-x-2 shrink-0"
            >
              <button
                type="button"
                onClick={handleMicClick}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 p-2.5 rounded-xl transition"
              >
                <Mic className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={simulatorInput}
                onChange={(e) => setSimulatorInput(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-green-600"
              />

              <button
                type="submit"
                disabled={!simulatorInput.trim() || isSimulating}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Real-time Extracted Lead Info & Handover Triggers Inspector */}
          <div className="lg:col-span-5 space-y-4">
            {/* Captured Info Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center mb-3">
                <UserPlus className="w-4 h-4 mr-1.5 text-emerald-600" />
                Información de Prospecto Capturada
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500 font-medium flex items-center">
                    <User className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Nombre:
                  </span>
                  <span className="font-bold text-slate-900 font-mono">
                    {collectedLeadData.name || <span className="text-slate-400 italic">No detectado</span>}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500 font-medium flex items-center">
                    <Mail className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Correo:
                  </span>
                  <span className="font-bold text-slate-900 font-mono">
                    {collectedLeadData.email || <span className="text-slate-400 italic">No detectado</span>}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500 font-medium flex items-center">
                    <Building className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Empresa:
                  </span>
                  <span className="font-bold text-slate-900 font-mono">
                    {collectedLeadData.company || <span className="text-slate-400 italic">No detectado</span>}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500 font-medium flex items-center">
                    <Phone className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Teléfono:
                  </span>
                  <span className="font-bold text-slate-900 font-mono">
                    {collectedLeadData.phone || <span className="text-slate-400 italic">No detectado</span>}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Test Prompts */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Frases de Prueba Rápidas
              </h3>
              <p className="text-[11px] text-slate-500 mb-3">Haz clic en cualquiera para simular respuestas del chatbot:</p>

              <div className="space-y-1.5">
                {[
                  '¿Cuáles son los precios de los planes WABA?',
                  '¿Cómo me conecto con la API de WhatsApp Meta?',
                  'Quiero hablar con un agente humano ahora mismo',
                  'Mi nombre es Lucas de la empresa TecnoMarket',
                  '¿Puedo emitir facturas electrónicas con ERPNext?'
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSimulatorInput(sample)}
                    className="w-full text-left bg-slate-50 hover:bg-green-50 hover:border-green-300 border border-slate-200 rounded-lg p-2 text-xs text-slate-700 transition flex items-center justify-between group"
                  >
                    <span className="truncate pr-2">{sample}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-green-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FAQ PREDEFINED KNOWLEDGE BASE */}
      {activeTab === 'faqs' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Preguntas Frecuentes Predefinidas (FAQs)</h2>
              <p className="text-xs text-slate-500">
                Define pares de pregunta y respuesta con palabras clave para que el chatbot responda con exactitud.
              </p>
            </div>

            <button
              onClick={handleOpenAddFaq}
              className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition flex items-center space-x-1.5 shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Nueva FAQ</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrar por pregunta, respuesta o categoría..."
              value={searchFaq}
              onChange={(e) => setSearchFaq(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-green-500"
            />
          </div>

          {/* FAQs List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFaqs.map((faq) => (
              <div key={faq.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between space-y-3 hover:border-slate-300 transition">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-100 text-green-800 border border-green-200">
                      {faq.category}
                    </span>
                    {faq.isLeadCollectTrigger && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
                        Trigger Captura Prospecto
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs font-bold text-slate-900">{faq.question}</h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{faq.answer}</p>
                </div>

                {/* Keywords list */}
                {faq.keywords && faq.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-200/60">
                    <span className="text-[10px] text-slate-400 font-medium mr-1">Palabras clave:</span>
                    {faq.keywords.map((kw, i) => (
                      <span key={i} className="text-[9px] bg-white border border-slate-200 px-1.5 py-0.5 rounded font-mono text-slate-600">
                        {kw}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200/60">
                  <button
                    onClick={() => handleOpenEditFaq(faq)}
                    className="p-1 hover:bg-slate-200 rounded text-slate-600 transition"
                    title="Editar FAQ"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteFaq(faq.id)}
                    className="p-1 hover:bg-red-100 text-red-600 rounded transition"
                    title="Eliminar FAQ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: HUMAN HANDOVER RULES */}
      {activeTab === 'handover' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Reglas de Traspaso a Humano (Handover Rules)</h2>
              <p className="text-xs text-slate-500">
                Garantiza que consultas complejas o de alto valor pasen de inmediato a un agente de ventas real.
              </p>
            </div>

            <button
              onClick={handleOpenAddRule}
              className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition flex items-center space-x-1.5 shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Regla de Traspaso</span>
            </button>
          </div>

          <div className="space-y-3">
            {config.handoverRules.map((rule) => {
              const assignedAgent = agents.find((a) => a.id === rule.defaultAgentId) || agents[0];

              return (
                <div key={rule.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start space-x-3">
                    <span className="bg-blue-100 text-blue-700 p-2 rounded-lg mt-0.5">
                      <UserCheck className="w-5 h-5" />
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xs font-bold text-slate-900">{rule.name}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                          {rule.condition === 'explicit_agent_request' ? 'Solicitud Explícita' : rule.condition === 'high_value_lead' ? 'Valor Alto' : 'Insatisfacción'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{rule.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="text-right text-xs">
                      <span className="text-[10px] text-slate-400 font-medium block">Agente Asignado</span>
                      <span className="font-bold text-slate-800">{assignedAgent?.name || 'Sofia Rossi'}</span>
                    </div>

                    <div className="flex items-center space-x-1 pl-2 border-l border-slate-200">
                      <button
                        onClick={() => handleOpenEditRule(rule)}
                        className="p-1 hover:bg-slate-200 rounded text-slate-600 transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteRule(rule.id)}
                        className="p-1 hover:bg-red-100 text-red-600 rounded transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: LEAD COLLECTOR SETTINGS */}
      {activeTab === 'collector' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Campos de Recolección de Prospectos</h2>
            <p className="text-xs text-slate-500">
              Selecciona qué información solicitará el chatbot durante las conversaciones iniciales.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { id: 'name', label: 'Nombre Completo', desc: 'Indispensable para personalizar las conversaciones' },
              { id: 'email', label: 'Correo Electrónico', desc: 'Para enviar cotizaciones y propuestas en PDF' },
              { id: 'company', label: 'Nombre de Empresa', desc: 'Para catalogar oportunidades B2B' },
              { id: 'phone', label: 'Teléfono / WhatsApp', desc: 'Validación del número de contacto' },
              { id: 'interest', label: 'Interés / Necesidad Principal', desc: 'Categorización rápida de la consulta' }
            ].map((f) => {
              const isChecked = config.leadFields.includes(f.id);
              return (
                <div key={f.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {
                      const newFields = isChecked
                        ? config.leadFields.filter((id) => id !== f.id)
                        : [...config.leadFields, f.id];
                      onUpdateConfig({ ...config, leadFields: newFields });
                    }}
                    className="mt-1 rounded text-green-600 focus:ring-green-500"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{f.label}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FAQ MODAL */}
      {showFaqModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {editingFaq ? 'Editar Pregunta Frecuente (FAQ)' : 'Agregar Nueva FAQ'}
              </h3>
              <button onClick={() => setShowFaqModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Pregunta del Cliente</label>
                <input
                  type="text"
                  required
                  placeholder="ej. ¿Cómo conecto mi número WABA?"
                  value={faqQuestion}
                  onChange={(e) => setFaqQuestion(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Respuesta del Chatbot</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Texto explicativo para responder automáticamente..."
                  value={faqAnswer}
                  onChange={(e) => setFaqAnswer(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Categoría</label>
                <select
                  value={faqCategory}
                  onChange={(e) => setFaqCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-green-500"
                >
                  <option value="CRM Features">Funcionalidades CRM</option>
                  <option value="WABA & WhatsApp">WABA & WhatsApp API</option>
                  <option value="Precios & Facturación">Precios & Facturación</option>
                  <option value="Integraciones ERP">Integraciones ERP</option>
                  <option value="Soporte General">Soporte General</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Palabras Clave (separadas por coma)</label>
                <input
                  type="text"
                  placeholder="ej. precios, planes, costo, tarifas"
                  value={faqKeywords}
                  onChange={(e) => setFaqKeywords(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-green-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowFaqModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-1.5 rounded-lg transition"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RULE MODAL */}
      {showRuleModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {editingRule ? 'Editar Regla de Traspaso' : 'Nueva Regla de Traspaso a Humano'}
              </h3>
              <button onClick={() => setShowRuleModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRule} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre de la Regla</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Derivación por Oportunidad Enterprise"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Condición Gatillo</label>
                <select
                  value={ruleCondition}
                  onChange={(e) => setRuleCondition(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-green-500"
                >
                  <option value="explicit_agent_request">Solicitud explícita ("hablar con humano")</option>
                  <option value="high_value_lead">Valor de trato superior a umbral ($)</option>
                  <option value="unanswered_faq_count">Preguntas no resueltas consecutivas</option>
                </select>
              </div>

              {ruleCondition === 'high_value_lead' && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Umbral de Valor ($ USD)</label>
                  <input
                    type="number"
                    value={ruleThreshold}
                    onChange={(e) => setRuleThreshold(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-green-500"
                  />
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Asignar a Agente Humano</label>
                <select
                  value={ruleAgentId}
                  onChange={(e) => setRuleAgentId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-green-500"
                >
                  {agents.map((ag) => (
                    <option key={ag.id} value={ag.id}>
                      {ag.name} ({ag.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Descripción explicativa</label>
                <input
                  type="text"
                  placeholder="Escribe brevemente por qué se gatilla..."
                  value={ruleDescription}
                  onChange={(e) => setRuleDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-green-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowRuleModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-1.5 rounded-lg transition"
                >
                  Guardar Regla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
