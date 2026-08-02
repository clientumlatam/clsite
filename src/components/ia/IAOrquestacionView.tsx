import React, { useState } from "react";
import { Sparkles, LayoutDashboard } from "lucide-react";
import OrquestadorIA from "../OrquestadorIA";
import AiBoardroom from "../../platform/components/AiBoardroom";

type OrqTab = "orquestador" | "boardroom";

export default function IAOrquestacionView({ currentUsername }: { currentUsername?: string }) {
  const [tab, setTab] = useState<OrqTab>("orquestador");
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1 px-4 py-2 border-b border-white/10 bg-[#0b1120] shrink-0">
        <span className="text-xs text-white/40 mr-2 font-medium uppercase tracking-wider">Orquestación</span>
        {([
          { id: "orquestador" as OrqTab, label: "Orquestador IA",  icon: <Sparkles className="w-3.5 h-3.5" /> },
          { id: "boardroom"   as OrqTab, label: "Boardroom IA",    icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
        ] as const).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              tab === t.id ? "bg-violet-600 text-white shadow" : "text-white/50 hover:text-white/80 hover:bg-white/5"
            }`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-hidden">
        {tab === "orquestador" && (
          <div className="flex flex-col h-full overflow-hidden">
            <OrquestadorIA currentUsername={currentUsername} />
          </div>
        )}
        {tab === "boardroom" && (
          <div className="h-full overflow-y-auto">
            <AiBoardroom onLog={() => {}} agents={[]} onAgentWorking={() => {}} />
          </div>
        )}
      </div>
    </div>
  );
}
