import React, { useState } from "react";
import { Layers, Zap } from "lucide-react";
import { SegmentsView } from "../platform/components/SegmentsView";
import { CustomerSegmentsView } from "../platform/components/CustomerSegmentsView";

type SegTab = "simple" | "avanzado";

interface Props {
  segments: any[];
  leads: any[];
  agents: any[];
  onAddSegment: (seg: any) => void;
  onCreateSegment: (seg: any) => void;
  onUpdateSegment: (seg: any) => void;
  onDeleteSegment: (id: string) => void;
  onNavigateToBroadcast: () => void;
}

export default function SegmentosUnificados({
  segments, leads, agents,
  onAddSegment, onCreateSegment, onUpdateSegment, onDeleteSegment,
  onNavigateToBroadcast,
}: Props) {
  const [tab, setTab] = useState<SegTab>("simple");

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-white/10 bg-[#0b1120] shrink-0">
        <button
          onClick={() => setTab("simple")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            tab === "simple"
              ? "bg-blue-600 text-white shadow"
              : "text-white/50 hover:text-white/80 hover:bg-white/5"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Segmentos
        </button>
        <button
          onClick={() => setTab("avanzado")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            tab === "avanzado"
              ? "bg-blue-600 text-white shadow"
              : "text-white/50 hover:text-white/80 hover:bg-white/5"
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          Avanzado
          <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300">CRM</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {tab === "simple" && (
          <SegmentsView
            segments={segments}
            leads={leads}
            onAddSegment={onAddSegment}
          />
        )}
        {tab === "avanzado" && (
          <CustomerSegmentsView
            segments={segments}
            leads={leads}
            agents={agents}
            onCreateSegment={onCreateSegment}
            onUpdateSegment={onUpdateSegment}
            onDeleteSegment={onDeleteSegment}
            onNavigateToBroadcast={onNavigateToBroadcast}
          />
        )}
      </div>
    </div>
  );
}
