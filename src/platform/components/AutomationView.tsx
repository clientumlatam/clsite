import React, { useState } from 'react';
import {
  Bot,
  Plus,
  Zap,
  CheckCircle2,
  AlertCircle,
  Play,
  ArrowRight,
  UserCheck,
  FileText,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  X,
  MessageSquare,
  Search,
  Filter,
  Tag,
  Hash,
  Edit2,
  Trash2,
  Copy,
  Info
} from 'lucide-react';
import { AutomationRule, WhatsAppTemplate, Agent } from '../types';

interface AutomationViewProps {
  rules: AutomationRule[];
  templates: WhatsAppTemplate[];
  agents: Agent[];
  onCreateRule: (rule: AutomationRule) => void;
  onToggleRule: (ruleId: string) => void;
}

export const AutomationView: React.FC<AutomationViewProps> = ({
  rules,
  templates,
  agents,
  onCreateRule,
  onToggleRule
}) => {
  const [showModal, setShowModal] = useState(false);
  const [testInput, setTestInput] = useState('');
  const [testResult, setTestResult] = useState<{
    matchedRule: AutomationRule | null;
    replyMessage: string | null;
  } | null>(null);

  const [activeFilter, setActiveFilter] = useState<'all' | 'direct_text' | 'template' | 'agent' | 'ai'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // New Rule Form
  const [name, setName] = useState('');
  const [triggerKeyword, setTriggerKeyword] = useState('');
  const [matchType, setMatchType] = useState<'contains' | 'exact' | 'any'>('contains');
  const [actionType, setActionType] = useState<'direct_text' | 'send_template' | 'assign_agent' | 'update_stage' | 'ai_reply'>('direct_text');
  const [actionValue, setActionValue] = useState('');
  const [replyText, setReplyText] = useState('');

  // Fast preset keywords
  const keywordPresets = [
    {
      keyword: 'precio',
      label: '🏷️ Precio / Planes',
      defaultName: 'Autorespuesta a Consulta de Precios',
      defaultReply: '¡Hola! 🏷️ Nuestros planes SaaS van desde $49 USD/mes. Podés ver nuestro catálogo de precios en https://frappecrm.io/precios'
    },
    {
      keyword: 'demo',
      label: '🚀 Demo / Prueba',
      defaultName: 'Agendamiento de Demo en Vivo',
      defaultReply: '¡Excelente! 🚀 Podés agendar una demostración interactiva con nuestro equipo aquí: https://cal.frappecrm.io/demo'
    },
    {
      keyword: 'contacto',
      label: '📞 Contacto / Asesor',
      defaultName: 'Atención Directa y Contacto',
      defaultReply: '📞 Un asesor comercial se pondrá en contacto a la brevedad. Nuestro teléfono oficial es +54 11 5555-0199.'
    },
    {
      keyword: 'horario',
      label: '⏰ Horarios de Atención',
      defaultName: 'Consulta de Horarios Comerciales',
      defaultReply: '⏰ Nuestro horario de atención es de Lunes a Viernes de 9:00 a 18:00 hs (ART / EST).'
    },
    {
      keyword: 'soporte',
      label: '🛠️ Soporte Técnico',
      defaultName: 'Soporte y Mesa de Ayuda',
      defaultReply: '🛠️ Para soporte técnico podés escribirnos a soporte@frappecrm.io o ingresar a nuestro portal de ayuda.'
    }
  ];

  const handleApplyPreset = (preset: typeof keywordPresets[0]) => {
    setTriggerKeyword(preset.keyword);
    setName(preset.defaultName);
    setActionType('direct_text');
    setReplyText(preset.defaultReply);
    setActionValue(preset.defaultReply);
    setShowModal(true);
  };

  const handleTestTrigger = () => {
    if (!testInput.trim()) return;

    const lowerInput = testInput.toLowerCase();
    const matched = rules.find((r) => {
      if (!r.isEnabled) return false;
      const kw = r.triggerKeyword.toLowerCase();
      if (r.matchType === 'exact') return lowerInput.trim() === kw;
      if (r.matchType === 'any') return lowerInput.startsWith(kw);
      return lowerInput.includes(kw); // contains default
    });

    if (matched) {
      let reply = matched.replyText || matched.actionValueName || matched.actionValue;
      if (matched.actionType === 'send_template') {
        reply = `[Plantilla WABA enviada]: ${matched.actionValueName || 'Plantilla de WhatsApp'}`;
      } else if (matched.actionType === 'assign_agent') {
        reply = `[Lead Asignado]: Se notificó al agente ${matched.actionValueName || 'seleccionado'}`;
      } else if (matched.actionType === 'ai_reply') {
        reply = `🤖 [Gemini IA Copilot]: "Hola! Gracias por consultar sobre ${matched.triggerKeyword}. ¿Te gustaría que coordinemos una llamada?"`;
      }

      setTestResult({
        matchedRule: matched,
        replyMessage: reply
      });
    } else {
      setTestResult({
        matchedRule: null,
        replyMessage: `🤖 Ninguna regla coincidente. El Bot Inteligente Gemini IA procesará el mensaje automáticamente.`
      });
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !triggerKeyword) return;

    let valueName = actionValue;
    if (actionType === 'send_template') {
      valueName = templates.find((t) => t.id === actionValue)?.name || actionValue;
    } else if (actionType === 'assign_agent') {
      valueName = agents.find((a) => a.id === actionValue)?.name || actionValue;
    } else if (actionType === 'direct_text') {
      valueName = replyText.slice(0, 40) + '...';
    }

    const newRule: AutomationRule = {
      id: `rule_${Date.now()}`,
      name,
      triggerKeyword: triggerKeyword.trim().toLowerCase(),
      matchType,
      actionType,
      actionValue: actionType === 'direct_text' ? replyText : actionValue,
      actionValueName: valueName,
      replyText: actionType === 'direct_text' ? replyText : undefined,
      isEnabled: true
    };

    onCreateRule(newRule);
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setTriggerKeyword('');
    setMatchType('contains');
    setActionType('direct_text');
    setActionValue('');
    setReplyText('');
  };

  const filteredRules = rules.filter((rule) => {
    const matchesSearch =
      rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.triggerKeyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rule.replyText && rule.replyText.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeFilter === 'direct_text') return rule.actionType === 'direct_text';
    if (activeFilter === 'template') return rule.actionType === 'send_template';
    if (activeFilter === 'agent') return rule.actionType === 'assign_agent';
    if (activeFilter === 'ai') return rule.actionType === 'ai_reply';

    return true;
  });

  const getActionBadge = (actionType: string) => {
    switch (actionType) {
      case 'direct_text':
        return <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px] border border-emerald-200">Autorespuesta Texto</span>;
      case 'send_template':
        return <span className="bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded text-[10px] border border-purple-200">Plantilla WABA</span>;
      case 'assign_agent':
        return <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-[10px] border border-blue-200">Asignar Agente</span>;
      case 'ai_reply':
        return <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px] border border-amber-200 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Gemini IA</span>;
      case 'update_stage':
        return <span className="bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded text-[10px] border border-indigo-200">Avanzar Embudo</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded text-[10px]">{actionType}</span>;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-101px)] bg-slate-50 text-slate-900 overflow-y-auto">
      {/* Top Banner */}
      <div className="p-4 md:p-6 bg-white border-b border-slate-200 space-y-4 shrink-0 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-green-600" />
              <h1 className="text-lg font-bold text-slate-900">
                Autorespuestas por Palabras Clave & Bot de WhatsApp
              </h1>
              <span className="text-xs bg-green-100 text-green-800 font-mono font-bold px-2 py-0.5 rounded border border-green-200">
                WABA Auto-Reply Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Configurá respuestas automáticas instantáneas para palabras clave comunes como <code className="bg-slate-100 px-1 py-0.5 rounded text-green-700 font-bold">precio</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-green-700 font-bold">demo</code> o <code className="bg-slate-100 px-1 py-0.5 rounded text-green-700 font-bold">contacto</code>.
            </p>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center space-x-1.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Autorespuesta de Palabra Clave</span>
          </button>
        </div>

        {/* Quick Preset Keyword Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-500 font-medium flex items-center mr-1">
            <Zap className="w-3.5 h-3.5 mr-1 text-amber-500" />
            Plantillas Rápidas:
          </span>
          {keywordPresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(preset)}
              className="text-xs bg-slate-100 hover:bg-green-50 hover:text-green-800 hover:border-green-300 border border-slate-200 rounded-full px-3 py-1 font-semibold text-slate-700 transition"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Test Simulator Bar */}
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-2 text-xs">
          <div className="flex items-center space-x-2 font-bold text-slate-700">
            <MessageSquare className="w-4 h-4 text-green-600" />
            <span>Simulador de Prueba de Mensajes de Clientes</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              placeholder="Escribí un mensaje simulado ej. 'Hola, cuál es el precio de la demo?'..."
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 w-full focus:outline-none focus:border-green-500 font-medium text-xs"
            />
            <button
              onClick={handleTestTrigger}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-1.5 rounded-lg shrink-0 transition text-xs shadow-xs"
            >
              Probar Disparador
            </button>
          </div>

          {testResult && (
            <div className="mt-2 p-3 bg-white border border-green-200 rounded-lg text-xs space-y-1">
              <div className="flex justify-between items-center text-[11px] text-slate-500 font-bold">
                <span>
                  {testResult.matchedRule
                    ? `✅ Regla Activada: "${testResult.matchedRule.name}" (Palabra: "${testResult.matchedRule.triggerKeyword}")`
                    : 'ℹ️ Respuesta por Defecto'}
                </span>
                {testResult.matchedRule && (
                  <span className="font-mono text-green-700">Coincidencia: {testResult.matchedRule.matchType}</span>
                )}
              </div>
              <div className="bg-green-50 border border-green-100 text-slate-800 p-2.5 rounded font-mono text-[11px]">
                {testResult.replyMessage}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="px-4 md:px-6 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0 text-xs font-semibold">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeFilter === 'all' ? 'bg-slate-900 text-white font-bold' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Todas ({rules.length})
          </button>
          <button
            onClick={() => setActiveFilter('direct_text')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeFilter === 'direct_text' ? 'bg-emerald-600 text-white font-bold' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Autorespuestas de Texto ({rules.filter(r => r.actionType === 'direct_text').length})
          </button>
          <button
            onClick={() => setActiveFilter('template')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeFilter === 'template' ? 'bg-purple-600 text-white font-bold' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Plantillas WABA ({rules.filter(r => r.actionType === 'send_template').length})
          </button>
          <button
            onClick={() => setActiveFilter('agent')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeFilter === 'agent' ? 'bg-blue-600 text-white font-bold' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Asignar Agente ({rules.filter(r => r.actionType === 'assign_agent').length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por palabra clave o nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-green-500"
          />
        </div>
      </div>

      {/* Rules Grid */}
      <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRules.map((rule) => (
          <div
            key={rule.id}
            className={`bg-white border rounded-2xl p-5 flex flex-col justify-between shadow-xs space-y-4 transition ${
              rule.isEnabled ? 'border-slate-200 hover:border-green-300' : 'border-slate-200 opacity-60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{rule.name}</h3>
                  <div className="mt-1 flex items-center space-x-1.5">
                    {getActionBadge(rule.actionType)}
                  </div>
                </div>

                <button
                  onClick={() => onToggleRule(rule.id)}
                  className="text-green-600 hover:scale-105 transition shrink-0"
                  title="Activar / Desactivar regla"
                >
                  {rule.isEnabled ? (
                    <ToggleRight className="w-6 h-6 text-green-600" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-slate-400" />
                  )}
                </button>
              </div>

              {/* Trigger Keyword badge */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[10px] font-bold uppercase">Palabra Clave Disparadora</span>
                  <span className="bg-green-100 text-green-800 font-mono font-extrabold px-2 py-0.5 rounded text-[11px] border border-green-200">
                    "{rule.triggerKeyword}"
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Coincidencia:</span>
                  <span className="font-semibold text-slate-700">
                    {rule.matchType === 'contains' ? 'Contiene la palabra' : rule.matchType === 'exact' ? 'Palabra exacta' : 'Comienza con'}
                  </span>
                </div>

                {/* Auto-Reply Message Box */}
                {(rule.replyText || rule.actionType === 'direct_text') && (
                  <div className="mt-2 pt-2 border-t border-slate-200 space-y-1">
                    <span className="text-slate-400 text-[10px] font-bold uppercase block">Mensaje de Autorespuesta:</span>
                    <p className="bg-white p-2.5 rounded-lg border border-slate-200 text-slate-800 font-medium text-[11px] leading-relaxed">
                      {rule.replyText || rule.actionValue}
                    </p>
                  </div>
                )}

                {rule.actionType !== 'direct_text' && rule.actionValueName && (
                  <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Destino / Valor:</span>
                    <span className="font-mono text-purple-700 font-bold">{rule.actionValueName}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-3 border-t border-slate-100">
              <span className="flex items-center space-x-1">
                <span className={`w-2 h-2 rounded-full ${rule.isEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                <span>{rule.isEnabled ? 'Activa y Monitoreando' : 'Desactivada'}</span>
              </span>
              <span className="font-mono text-slate-500">ID: {rule.id}</span>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: Create Keyword Auto-Reply Rule */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-green-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Configurar Autorespuesta por Palabra Clave
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nombre Descriptivo de la Regla *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Autorespuesta a consulta de Precios"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-green-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Palabra Clave (Keyword) *</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. precio, demo, contacto"
                    value={triggerKeyword}
                    onChange={(e) => setTriggerKeyword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-green-700 font-mono font-bold focus:outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tipo de Coincidencia</label>
                  <select
                    value={matchType}
                    onChange={(e) => setMatchType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none font-medium"
                  >
                    <option value="contains">Contiene la palabra (Recomendado)</option>
                    <option value="exact">Coincidencia exacta</option>
                    <option value="any">Comienza con la palabra</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Acción de Respuesta</label>
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none font-medium"
                >
                  <option value="direct_text">Enviar Mensaje de Texto Directo</option>
                  <option value="send_template">Enviar Plantilla de WhatsApp WABA</option>
                  <option value="assign_agent">Asignar Conversación a Agente</option>
                  <option value="ai_reply">Generar Respuesta Inteligente con Gemini IA</option>
                  <option value="update_stage">Mover Lead a Etapa de Embudo</option>
                </select>
              </div>

              {actionType === 'direct_text' && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-slate-700 font-semibold">Mensaje de Autorespuesta Instantáneo *</label>
                    <span className="text-[10px] text-slate-400">Soporta emojis y enlaces HTTP</span>
                  </div>
                  <textarea
                    required
                    rows={4}
                    placeholder="Escribí el texto que se enviará automáticamente al cliente cuando incluya esta palabra clave..."
                    value={replyText}
                    onChange={(e) => {
                      setReplyText(e.target.value);
                      setActionValue(e.target.value);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 focus:outline-none focus:border-green-500 font-medium text-xs leading-relaxed"
                  />
                </div>
              )}

              {actionType === 'send_template' && (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Seleccionar Plantilla WABA Aprobada</label>
                  <select
                    value={actionValue}
                    onChange={(e) => setActionValue(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-purple-700 font-mono font-bold focus:outline-none"
                  >
                    {templates.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.category})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {actionType === 'assign_agent' && (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Seleccionar Agente de Soporte / Ventas</label>
                  <select
                    value={actionValue}
                    onChange={(e) => setActionValue(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none font-medium"
                  >
                    {agents.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.role})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-xs"
                >
                  Guardar Autorespuesta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
