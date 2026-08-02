import React, { useState } from 'react';
import { Layers, ShieldCheck, Database, Server, GitBranch, Cpu, Code2, BookOpen, CheckCircle2, ChevronRight, AlertTriangle } from 'lucide-react';
import { ArchitecturePhase } from '../types';

interface ArchitectureBlueprintViewProps {
  phases: ArchitecturePhase[];
}

export const ArchitectureBlueprintView: React.FC<ArchitectureBlueprintViewProps> = ({ phases }) => {
  const [selectedPhaseNumber, setSelectedPhaseNumber] = useState<number>(1);
  const currentPhase = phases.find((p) => p.phase === selectedPhaseNumber) || phases[0];

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-indigo-400" />
              AI Business OS — Enterprise System Architecture Blueprint
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold border border-indigo-500/30">
              CTO & Solution Architecture Specification
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise multi-tenant operating system design based on Clean Architecture, DDD, CQRS, Frappe/ERPNext System of Record, Model Context Protocol (MCP), and FastAPI AI micro-services.
          </p>
        </div>
      </div>

      {/* Phase Selector Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {phases.map((p) => {
          const isSelected = p.phase === selectedPhaseNumber;
          return (
            <button
              key={p.phase}
              onClick={() => setSelectedPhaseNumber(p.phase)}
              className={`p-4 rounded-xl border text-left space-y-2 transition-all ${
                isSelected
                  ? 'bg-slate-900 border-indigo-500 text-indigo-300 ring-1 ring-indigo-500/30 shadow-lg'
                  : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="font-bold text-indigo-400">FASE {p.phase}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold ${
                    p.status === 'completed'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : p.status === 'in_progress'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {p.status.replace('_', ' ')}
                </span>
              </div>
              <h4 className="font-bold text-white text-xs line-clamp-1">{p.title}</h4>
            </button>
          );
        })}
      </div>

      {/* Phase Detail Viewer */}
      {currentPhase && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Architectural Narrative & Diagram */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
              
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 font-mono text-xs font-bold border border-indigo-500/30">
                    Phase {currentPhase.phase} Architecture Specification
                  </span>
                  <h3 className="text-lg font-bold text-white">{currentPhase.title}</h3>
                </div>
                <p className="text-xs text-indigo-300 font-mono mt-1">{currentPhase.subtitle}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
                {currentPhase.summary}
              </div>

              {/* Mermaid Architecture Topology Diagram Code Block */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase font-mono flex items-center gap-1.5">
                  <GitBranch className="w-4 h-4 text-emerald-400" />
                  System Topology & Dataflow Diagram (Mermaid Specification)
                </span>
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto leading-relaxed">
                  {currentPhase.diagramMermaid.trim()}
                </pre>
              </div>

              {/* Directory Tree Structure */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase font-mono flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-indigo-400" />
                  Target Workspace Folder & Package Structure
                </span>
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-indigo-300 overflow-x-auto leading-relaxed">
                  {currentPhase.directoryTree.trim()}
                </pre>
              </div>

            </div>
          </div>

          {/* Right Column: Architectural Trade-Offs & Decisions */}
          <div className="space-y-6 lg:col-span-1">
            
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5 text-xs">
              
              <div>
                <h4 className="font-bold text-white text-sm flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Key Architectural Decisions
                </h4>
                <ul className="space-y-2">
                  {currentPhase.keyTechnicalDecisions.map((dec, idx) => (
                    <li key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed flex items-start gap-2">
                      <span className="text-emerald-400 font-bold shrink-0">•</span>
                      <span>{dec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  System Advantages
                </h4>
                <ul className="space-y-2">
                  {currentPhase.advantages.map((adv, idx) => (
                    <li key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed flex items-start gap-2">
                      <span className="text-indigo-400 font-bold shrink-0">•</span>
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Risks & Mitigations
                </h4>
                <ul className="space-y-2">
                  {currentPhase.risksAndMitigations.map((risk, idx) => (
                    <li key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed flex items-start gap-2">
                      <span className="text-amber-400 font-bold shrink-0">•</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
