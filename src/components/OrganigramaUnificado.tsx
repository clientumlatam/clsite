import React, { useState } from "react";
import { Network, Users, LayoutGrid, GitFork, Target } from "lucide-react";
import OrganigramaClientum from "./OrganigramaClientum";
import OrgVariantRoster from "./OrgVariantRoster";
import OrgVariantLanes from "./OrgVariantLanes";
import OrgVariantPipeline from "./OrgVariantPipeline";
import OrgVariantRadial from "./OrgVariantRadial";

type OrgView = "tree" | "roster" | "lanes" | "pipeline" | "radial";

const VIEWS: { id: OrgView; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: "tree",     label: "General",    icon: <Network className="w-4 h-4" />,    desc: "Árbol completo" },
  { id: "roster",   label: "Roster",     icon: <Users className="w-4 h-4" />,      desc: "Grid de agentes" },
  { id: "lanes",    label: "Swimlanes",  icon: <LayoutGrid className="w-4 h-4" />, desc: "Por departamento" },
  { id: "pipeline", label: "Pipeline",   icon: <GitFork className="w-4 h-4" />,    desc: "Flujo de valor" },
  { id: "radial",   label: "Hub Radial", icon: <Target className="w-4 h-4" />,     desc: "Vista radial CEO" },
];

export default function OrganigramaUnificado() {
  const [view, setView] = useState<OrgView>("tree");

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-white/10 bg-[#0b1120] shrink-0">
        <span className="text-xs text-white/40 mr-2 font-medium uppercase tracking-wider">Vista</span>
        {VIEWS.map((v) => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              view === v.id
                ? "bg-indigo-600 text-white shadow"
                : "text-white/50 hover:text-white/80 hover:bg-white/5"
            }`}
            title={v.desc}
          >
            {v.icon}
            {v.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {view === "tree"     && <OrganigramaClientum />}
        {view === "roster"   && <div className="h-full overflow-hidden flex flex-col"><OrgVariantRoster /></div>}
        {view === "lanes"    && <div className="h-full overflow-hidden flex flex-col"><OrgVariantLanes /></div>}
        {view === "pipeline" && <div className="h-full overflow-auto"><OrgVariantPipeline /></div>}
        {view === "radial"   && <div className="h-full overflow-auto"><OrgVariantRadial /></div>}
      </div>
    </div>
  );
}
