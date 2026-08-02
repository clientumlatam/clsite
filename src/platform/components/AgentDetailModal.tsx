import React from 'react';
import { Agent } from '../types';
import { X, ShieldAlert, Cpu, HeartHandshake, Eye, BookOpen, Layers } from 'lucide-react';

interface AgentDetailModalProps {
  agent: Agent | null;
  onClose: () => void;
}

export default function AgentDetailModal({ agent, onClose }: AgentDetailModalProps) {
  if (!agent) return null;

  return (
    <div id="agent-detail-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Banner with avatar representation */}
        <div className="bg-gradient-to-r from-slate-950 to-slate-900 p-6 border-b border-slate-800/60 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-3xl shadow-inner shadow-slate-950/60">
              {agent.id === 'orquestador' ? '👑' : agent.id === 'cto' ? '🛰️' : agent.id === 'santi_sdr' ? '🔥' : '🤖'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-500 font-mono">
                  {agent.department.toUpperCase()}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500"></span>
                <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded-md border border-slate-700/50">
                  {agent.id}
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-white tracking-tight mt-1">{agent.name}</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{agent.role}</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Core Specs Tabbed/Structured Layout */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          
          {/* Status Bar */}
          <div className="grid grid-cols-3 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800/40 text-center">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">Estado Actual</span>
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold mt-1 capitalize px-2 py-0.5 rounded-full ${
                agent.status === 'working' ? 'text-violet-400 bg-violet-500/10' :
                agent.status === 'waiting' ? 'text-amber-400 bg-amber-500/10' :
                'text-emerald-400 bg-emerald-500/10'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${
                  agent.status === 'working' ? 'bg-violet-400 animate-pulse' :
                  agent.status === 'waiting' ? 'bg-amber-400 animate-pulse' :
                  'bg-emerald-400'
                }`}></span>
                {agent.status}
              </span>
            </div>
            <div className="border-x border-slate-800/80 px-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">Carga de Trabajo</span>
              <span className="text-xs text-slate-300 font-semibold block mt-1.5">
                {agent.status === 'working' ? '95% (Crítica)' : 'Libre (Escuchando)'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">Modelo de IA</span>
              <span className="text-xs text-amber-500 font-mono font-bold block mt-1.5">
                {agent.id === 'orquestador' || agent.id === 'cto' ? 'gemini-3.1-pro-preview' : 'gemini-3.6-flash'}
              </span>
            </div>
          </div>

          {/* 1. Identidad */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-mono">
              <Cpu className="h-3.5 w-3.5 text-amber-500" />
              1. Identidad y Persona
            </h4>
            <div className="bg-slate-950/40 border border-slate-800/40 rounded-xl p-4 text-xs text-slate-300 leading-relaxed font-sans shadow-inner">
              {agent.identity}
            </div>
          </div>

          {/* 2. Procesos (Checklist) */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-mono">
              <Layers className="h-3.5 w-3.5 text-blue-500" />
              2. Proceso de Trabajo (Checklist Operativo)
            </h4>
            <div className="bg-slate-950/40 border border-slate-800/40 rounded-xl p-4 space-y-2.5">
              {agent.process.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <span className="h-5 w-5 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono font-bold text-blue-400 flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed mt-0.5">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Skills */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-mono">
              <BookOpen className="h-3.5 w-3.5 text-purple-500" />
              3. Skills & Herramientas Disponibles
            </h4>
            <div className="flex flex-wrap gap-2">
              {agent.skill.map((skill, idx) => (
                <span 
                  key={idx} 
                  className="text-xs font-mono bg-slate-950 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:border-purple-500/40 hover:text-white transition-colors"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* 4. Memoria */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-mono">
              <HeartHandshake className="h-3.5 w-3.5 text-emerald-500" />
              4. Memoria Permanente (Contexto Acumulado)
            </h4>
            <div className="bg-slate-950/40 border border-slate-800/40 rounded-xl p-4 space-y-3">
              {agent.memory.length > 0 ? (
                agent.memory.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs font-mono text-slate-300">
                    <span className="text-emerald-500 shrink-0 font-bold">»</span>
                    <span className="leading-normal">{log}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic font-mono">No hay registros de memoria previos. Listo para el primer commit.</p>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500 font-mono px-6">
          <span>Última mod: Hoy, {new Date().toLocaleDateString('es-AR')}</span>
          <span>Acceso Directo: OK</span>
        </div>
      </div>
    </div>
  );
}
