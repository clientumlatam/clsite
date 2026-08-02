// @ts-nocheck
import React, { useState } from "react";
import { Bot, MessageCircle } from "lucide-react";
import CrmFullBotConfig from "../crm-full/CrmFullBotConfig";
import { ChatbotView } from "../../platform/components/ChatbotView";

type BotTab = "crm" | "whatsapp";

export default function IABotsView() {
  const [tab, setTab] = useState<BotTab>("crm");
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1 px-4 py-2 border-b border-white/10 bg-[#0b1120] shrink-0">
        <span className="text-xs text-white/40 mr-2 font-medium uppercase tracking-wider">Bots conversacionales</span>
        {([
          { id: "crm" as BotTab,      label: "Bot del CRM",       icon: <Bot className="w-3.5 h-3.5" /> },
          { id: "whatsapp" as BotTab, label: "Bot WhatsApp",       icon: <MessageCircle className="w-3.5 h-3.5" /> },
        ] as const).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              tab === t.id ? "bg-emerald-600 text-white shadow" : "text-white/50 hover:text-white/80 hover:bg-white/5"
            }`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        {tab === "crm"      && <CrmFullBotConfig />}
        {tab === "whatsapp" && <ChatbotView />}
      </div>
    </div>
  );
}
