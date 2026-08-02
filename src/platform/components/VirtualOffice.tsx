import React from 'react';
import { Agent } from '../types';
import { Briefcase, Terminal, BadgeAlert, TrendingUp, Sparkles, HelpCircle, Users, CheckCircle2 } from 'lucide-react';

interface VirtualOfficeProps {
  agents: Agent[];
  selectedAgent: Agent | null;
  onSelectAgent: (agent: Agent) => void;
}

export default function VirtualOffice({ agents, selectedAgent, onSelectAgent }: VirtualOfficeProps) {
  // Group agents by department to structure the visual sections of the office
  const departments = [
    {
      id: 'orquestador',
      name: '🏛️ Dirección General (CEO / Chief of Staff)',
      color: 'border-amber-500/30 bg-amber-500/5',
      glow: 'shadow-amber-500/10',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
    },
    {
      id: 'ventas',
      name: '📞 Sala de Ventas & Prospección',
      color: 'border-emerald-500/30 bg-emerald-500/5',
      glow: 'shadow-emerald-500/10',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    },
    {
      id: 'tecnico',
      name: '💻 Laboratorio de Desarrollo & CTO',
      color: 'border-blue-500/30 bg-blue-500/5',
      glow: 'shadow-blue-500/10',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40'
    },
    {
      id: 'marketing',
      name: '🎨 Oficina de Marketing & SEO',
      color: 'border-purple-500/30 bg-purple-500/5',
      glow: 'shadow-purple-500/10',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40'
    },
    {
      id: 'cs',
      name: '🤝 Customer Success & Soporte',
      color: 'border-pink-500/30 bg-pink-500/5',
      glow: 'shadow-pink-500/10',
      badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/40'
    },
    {
      id: 'operaciones',
      name: '📊 Finanzas & Operaciones (COO)',
      color: 'border-cyan-500/30 bg-cyan-500/5',
      glow: 'shadow-cyan-500/10',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
    }
  ];

  const getAgentEmoji = (role: string) => {
    const roleLower = role.toLowerCase();
    if (roleLower.includes('orquestador')) return '👑';
    if (roleLower.includes('cto')) return '🛰️';
    if (roleLower.includes('infra') || roleLower.includes('backend')) return '⚙️';
    if (roleLower.includes('frontend') || roleLower.includes('ux')) return '🖥️';
    if (roleLower.includes('ia &') || roleLower.includes('automatización')) return '🔮';
    if (roleLower.includes('santi') || roleLower.includes('sdr')) return '🔥';
    if (roleLower.includes('explorador')) return '🧭';
    if (roleLower.includes('marketing')) return '🚀';
    if (roleLower.includes('seo') || roleLower.includes('contenido')) return '✍️';
    if (roleLower.includes('cs manager')) return '🛡️';
    if (roleLower.includes('comercial')) return '💬';
    if (roleLower.includes('coo')) return '📈';
    if (roleLower.includes('finanzas')) return '💰';
    return '🤖';
  };

  return (
    <div id="virtual-office-root" className="flex flex-col h-full bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
      {/* Office Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800/80 gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            Clientum Virtual HQ
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Mapa interactivo 2D del sistema multi-agente en tiempo real. Hacé clic en cualquier estación de trabajo para auditar.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800/60 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>Escuchando</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-violet-500 animate-pulse"></span>
            <span>Pensando / Ejecutando</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Esperando CEO</span>
          </div>
        </div>
      </div>

      {/* Office Grid Layout */}
      <div className="flex-1 overflow-y-auto mt-6 pr-2 space-y-8 scrollbar-thin scrollbar-thumb-slate-800">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {departments.map((dept) => {
            const deptAgents = agents.filter(a => a.department === dept.id);

            return (
              <div 
                key={dept.id} 
                className={`flex flex-col p-5 rounded-2xl border ${dept.color} shadow-lg ${dept.glow} transition-all duration-300 relative`}
              >
                {/* Department Header */}
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/40">
                  <span className="font-semibold text-sm text-slate-200 tracking-tight">
                    {dept.name}
                  </span>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${dept.badgeColor}`}>
                    {deptAgents.length} {deptAgents.length === 1 ? 'Agente' : 'Agentes'}
                  </span>
                </div>

                {/* Agent Desks inside Department */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                  {deptAgents.map((agent) => {
                    const isSelected = selectedAgent?.id === agent.id;
                    const emoji = getAgentEmoji(agent.role);
                    
                    return (
                      <button
                        key={agent.id}
                        id={`agent-desk-${agent.id}`}
                        onClick={() => onSelectAgent(agent)}
                        className={`group flex flex-col p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer outline-none relative overflow-hidden ${
                          isSelected 
                            ? 'bg-slate-900 border-white/30 shadow-xl scale-[1.02]' 
                            : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/70 hover:border-slate-700/60'
                        }`}
                      >
                        {/* Background glowing aura when working */}
                        {agent.status === 'working' && (
                          <span className="absolute inset-0 bg-violet-600/5 animate-pulse" />
                        )}

                        <div className="flex items-start justify-between gap-2 relative z-10">
                          {/* Agent Avatar and Name */}
                          <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-lg shadow-inner group-hover:scale-110 transition-transform ${
                              agent.status === 'working' ? 'border-violet-500 ring-2 ring-violet-500/20' : ''
                            }`}>
                              {emoji}
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
                                {agent.name}
                              </h4>
                              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                                {agent.role}
                              </p>
                            </div>
                          </div>

                          {/* Status indicator */}
                          <div className="flex items-center justify-center">
                            {agent.status === 'working' ? (
                              <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-500"></span>
                              </span>
                            ) : agent.status === 'waiting' ? (
                              <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                              </span>
                            ) : (
                              <span className="h-2 w-2 rounded-full bg-emerald-500/80 border border-slate-950"></span>
                            )}
                          </div>
                        </div>

                        {/* Current action text box */}
                        <div className="mt-3 bg-slate-950/80 border border-slate-900/60 rounded-lg p-2 flex-1 flex items-start gap-1.5 relative z-10 max-h-[52px] overflow-hidden">
                          {agent.status === 'working' ? (
                            <Terminal className="h-3 w-3 text-violet-400 mt-0.5 animate-pulse shrink-0" />
                          ) : agent.status === 'waiting' ? (
                            <BadgeAlert className="h-3 w-3 text-amber-400 mt-0.5 shrink-0" />
                          ) : (
                            <CheckCircle2 className="h-3 w-3 text-emerald-400 mt-0.5 shrink-0" />
                          )}
                          <span className="text-[10px] text-slate-300 font-mono tracking-wide leading-relaxed line-clamp-2">
                            {agent.currentAction}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
