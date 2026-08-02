import React, { useState } from "react";
import { Cpu, Network, Bot } from "lucide-react";
import AgentOSDashboard from "../crm-full/AgentOSDashboard";
import OrganigramaUnificado from "../OrganigramaUnificado";
import { AiAgentsView } from "../../platform/components/AiAgentsView";

type AgentTab = "control" | "org" | "agents";

const TABS = [
  { id: "control" as AgentTab, label: "Centro de Control", icon: <Cpu className="w-3.5 h-3.5" />, desc: "Pipeline, tareas y costos" },
  { id: "org"     as AgentTab, label: "Organigrama",       icon: <Network className="w-3.5 h-3.5" />, desc: "5 vistas en tabs" },
  { id: "agents"  as AgentTab, label: "Agentes & RAG",     icon: <Bot className="w-3.5 h-3.5" />, desc: "MCP, RAG y flujos n8n" },
];

export default function IACentroAgentesView() {
  const [tab, setTab] = useState<AgentTab>("control");
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1 px-4 py-2 border-b border-white/10 bg-[#0b1120] shrink-0">
        <span className="text-xs text-white/40 mr-2 font-medium uppercase tracking-wider">Centro de agentes</span>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              tab === t.id ? "bg-orange-600 text-white shadow" : "text-white/50 hover:text-white/80 hover:bg-white/5"
            }`}
            title={t.desc}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-hidden">
        {tab === "control" && <div className="h-full overflow-y-auto"><AgentOSDashboard /></div>}
        {tab === "org"     && <OrganigramaUnificado />}
        {tab === "agents"  && <div className="h-full overflow-y-auto"><AiAgentsView /></div>}
      </div>
    </div>
  );
}
