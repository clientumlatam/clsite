import React, { useState, useEffect, useRef } from 'react';
import { DiscussionMessage, Agent } from '../types';
import { Play, Pause, RotateCcw, AlertTriangle, Send, Sparkles, HelpCircle } from 'lucide-react';

interface AiBoardroomProps {
  onLog: (sender: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  agents: Agent[];
  onAgentWorking: (agentId: string, action: string, isWorking: boolean) => void;
}

export default function AiBoardroom({ onLog, agents, onAgentWorking }: AiBoardroomProps) {
  const [goal, setGoal] = useState('Conseguir 20 reuniones con distribuidoras de alimentos en Neuquén');
  const [messages, setMessages] = useState<DiscussionMessage[]>([]);
  const [isDebating, setIsDebating] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(-1); // -1 means inactive, 0 to 5 corresponds to agents

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Define the 6 boardroom roles & map them to our internal agent IDs
  const BOARDROOM_ROLES = [
    { role: 'Manager' as const, agentId: 'orquestador', name: 'Chief of Staff IA', color: 'border-amber-500/30 text-amber-400 bg-amber-500/5', desc: 'Modera, define objetivos y prioridades comerciales.' },
    { role: 'Researcher' as const, agentId: 'explorador', name: 'Explorador Patagónico', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5', desc: 'Aporta datos reales de mercado, nichos y contactos locales.' },
    { role: 'Analyst' as const, agentId: 'coo', name: 'COO IA Agent', color: 'border-blue-500/30 text-blue-400 bg-blue-500/5', desc: 'Desglosa viabilidad, proyecciones del embudo y conversión.' },
    { role: 'Challenger' as const, agentId: 'santi_sdr', name: 'Santi SDR', color: 'border-pink-500/30 text-pink-400 bg-pink-500/5', desc: 'Detecta debilidades, objeciones y riesgos del outreach frío.' },
    { role: 'Factchecker' as const, agentId: 'cto', name: 'CTO AI Agent', color: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/5', desc: 'Valida límites técnicos, costos de tokens de IA y APIs.' },
    { role: 'Reviewer' as const, agentId: 'finanzas', name: 'Finanzas & Admin', color: 'border-purple-500/30 text-purple-400 bg-purple-500/5', desc: 'Consolida la estrategia y redacta el plan de acción final.' }
  ];

  const suggestedGoals = [
    'Conseguir 20 reuniones con distribuidoras de alimentos en Neuquén',
    'Lanzar campaña de WhatsApp para inmobiliarias de Bariloche',
    'Automatizar el servicio de agendamiento de turnos para talleres mecánicos',
    'Capturar 30 clientes del rubro ferreterías en Cipolletti y Roca'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeStep]);

  // Handle the active stepping debate loop
  useEffect(() => {
    let active = true;

    async function runStep() {
      if (!isDebating || activeStep < 0 || activeStep > 5) return;

      const nextAgentConfig = BOARDROOM_ROLES[activeStep];
      onLog('AI Boardroom', `Iniciando análisis de ${nextAgentConfig.name} (${nextAgentConfig.role})...`, 'info');
      onAgentWorking(nextAgentConfig.agentId, `Analizando objetivo: "${goal}" en Boardroom...`, true);

      try {
        const response = await fetch('/api/boardroom/step', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            goal,
            previousTurns: messages,
            nextAgent: {
              role: nextAgentConfig.role,
              name: nextAgentConfig.name
            }
          })
        });

        if (!active) return;

        if (!response.ok) {
          throw new Error('Error al conectar con la API de Boardroom.');
        }

        const data = await response.json();
        
        const newMessage: DiscussionMessage = {
          id: `msg-${Date.now()}-${activeStep}`,
          agentRole: nextAgentConfig.role,
          agentName: nextAgentConfig.name,
          content: data.content,
          timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newMessage]);
        onLog(nextAgentConfig.role, `Propuesta entregada con éxito.`, 'success');
        onAgentWorking(nextAgentConfig.agentId, 'Escuchando en standby...', false);

        // Move to the next agent if still debating
        if (activeStep < 5) {
          setActiveStep(prev => prev + 1);
        } else {
          // Finished the full boardroom!
          setIsDebating(false);
          setActiveStep(-1);
          onLog('AI Boardroom', 'Estrategia comercial 360° consolidada por el Reviewer.', 'success');
        }

      } catch (err: any) {
        console.error(err);
        onLog('AI Boardroom', `Fallo al ejecutar paso del agente ${nextAgentConfig.role}. Deteniendo debate.`, 'error');
        onAgentWorking(nextAgentConfig.agentId, 'Inactivo debido a error.', false);
        setIsDebating(false);
        setActiveStep(-1);
      }
    }

    if (isDebating) {
      runStep();
    }

    return () => {
      active = false;
    };
  }, [isDebating, activeStep]);

  const handleStartDebate = () => {
    if (!goal.trim()) return;
    setMessages([]);
    setIsDebating(true);
    setActiveStep(0); // Start at Manager
    onLog('AI Boardroom', `Iniciando debate consultivo para: "${goal}"`, 'info');
  };

  const handlePauseDebate = () => {
    setIsDebating(false);
    onLog('AI Boardroom', 'Debate pausado por el usuario.', 'warning');
  };

  const handleResumeDebate = () => {
    if (activeStep === -1) {
      setActiveStep(0);
    }
    setIsDebating(true);
    onLog('AI Boardroom', 'Resumiendo debate consultivo.', 'info');
  };

  const handleResetDebate = () => {
    setIsDebating(false);
    setActiveStep(-1);
    setMessages([]);
    onLog('AI Boardroom', 'Sala de debate reseteada.', 'info');
  };

  return (
    <div id="ai-boardroom-root" className="flex flex-col h-full bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800/80 gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            AI Boardroom (Mesa de Expertos)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Simulación consultiva secuencial de 6 agentes expertos de IA para diseñar estrategias comerciales.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {isDebating ? (
            <button 
              onClick={handlePauseDebate}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-colors cursor-pointer"
            >
              <Pause className="h-3.5 w-3.5" />
              Pausar
            </button>
          ) : (
            <button 
              onClick={messages.length > 0 ? handleResumeDebate : handleStartDebate}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-colors cursor-pointer"
            >
              <Play className="h-3.5 w-3.5" />
              {messages.length > 0 ? 'Reanudar' : 'Iniciar Debate'}
            </button>
          )}

          <button 
            onClick={handleResetDebate}
            disabled={messages.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-bold hover:bg-slate-850 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Resetear
          </button>
        </div>
      </div>

      {/* Suggested goal shortcuts */}
      <div className="py-4 border-b border-slate-900 flex flex-wrap items-center gap-2">
        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono mr-1">Sugerencias:</span>
        {suggestedGoals.map((sg, idx) => (
          <button
            key={idx}
            onClick={() => !isDebating && setGoal(sg)}
            disabled={isDebating}
            className={`text-[10px] px-2.5 py-1.5 rounded-lg border text-left transition-all ${
              goal === sg 
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-medium' 
                : 'bg-slate-900/60 border-slate-800/60 text-slate-400 hover:border-slate-700/60 hover:text-slate-200 disabled:opacity-50'
            }`}
          >
            {sg.length > 42 ? sg.substring(0, 42) + '...' : sg}
          </button>
        ))}
      </div>

      {/* Goal input text box */}
      <div className="py-4 border-b border-slate-900 flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={goal}
            onChange={(e) => !isDebating && setGoal(e.target.value)}
            disabled={isDebating}
            placeholder="Escribí una meta comercial para el debate (ej. Conseguir 15 clientes en Cipolletti)..."
            className="w-full bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500/40 transition-all font-sans disabled:opacity-60"
          />
        </div>
        <button
          onClick={handleStartDebate}
          disabled={isDebating || !goal.trim()}
          className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-400 p-3 rounded-xl transition-all disabled:opacity-40 disabled:hover:text-slate-300 disabled:hover:border-slate-800 shrink-0 cursor-pointer"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

      {/* Discussion message board */}
      <div className="flex-1 overflow-y-auto mt-6 space-y-6 pr-2 scrollbar-thin scrollbar-thumb-slate-800">
        
        {messages.length === 0 && activeStep === -1 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="h-16 w-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-3xl shadow-inner mb-4">
              🏛️
            </div>
            <h3 className="text-sm font-bold text-white tracking-tight">Sala de Juntas Vacía</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
              Definí tu objetivo comercial de B2B arriba y hacé clic en "Iniciar Debate" para ver a los 6 agentes resolverlo secuencialmente.
            </p>
          </div>
        )}

        {/* Conversational thread */}
        <div className="space-y-4">
          {messages.map((msg, idx) => {
            const roleConfig = BOARDROOM_ROLES.find(r => r.role === msg.agentRole);
            return (
              <div 
                key={msg.id} 
                className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-4 space-y-3 relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200"
              >
                {/* Header of message */}
                <div className="flex items-center justify-between gap-4 border-b border-slate-950 pb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border ${roleConfig?.color}`}>
                      {msg.agentRole}
                    </span>
                    <span className="text-xs font-bold text-white">{msg.agentName}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                </div>
                
                {/* Content */}
                <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                  {msg.content}
                </p>
              </div>
            );
          })}

          {/* Active Step thinking animation */}
          {activeStep !== -1 && (
            <div className="bg-slate-900/20 border border-slate-800/30 rounded-xl p-4 space-y-3 animate-pulse">
              <div className="flex items-center gap-2 border-b border-slate-950/40 pb-2">
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border ${BOARDROOM_ROLES[activeStep].color}`}>
                  {BOARDROOM_ROLES[activeStep].role}
                </span>
                <span className="text-xs font-bold text-slate-400">{BOARDROOM_ROLES[activeStep].name}</span>
                <span className="text-[10px] text-slate-600 font-mono ml-auto">Pensando...</span>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-900 rounded w-3/4"></div>
                <div className="h-3 bg-slate-900 rounded w-1/2"></div>
                <div className="h-3 bg-slate-900 rounded w-5/6"></div>
              </div>
            </div>
          )}
        </div>

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
