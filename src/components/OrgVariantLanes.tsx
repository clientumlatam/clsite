/**
 * V2 · Department Swimlanes
 * Concept: instead of hierarchy, show agents by WHAT THEY OWN (dept),
 * with status-first information architecture. Like a kanban but for team structure.
 * Interaction model: filter by status (running/pending/hermes); column = ownership domain.
 * IA: optimized for operational awareness — "what's running right now?"
 */
import React, { useState } from "react";

type StatusFilter = "all" | "done" | "hermes" | "pending";

const LANES = [
  {
    id: "tech", label: "Técnico", icon: "⚙️", color: "#0ea5e9", textColor: "#7dd3fc",
    manager: { title: "Agente Técnico", sub: "CTO AI", status: "done" as const },
    agents: [
      { id: "backend", title: "Backend / Infra", sub: "Express · Neon · Vercel", kind: "hybrid" as const, status: "done" as const, tools: ["Express", "Neon Postgres"] },
      { id: "frontend", title: "Frontend / UX", sub: "React 19 · Vite · Tailwind", kind: "hybrid" as const, status: "done" as const, tools: ["React 19", "Recharts"] },
      { id: "ia", title: "IA & Automatización", sub: "Brochures · MEDDIC", kind: "ai" as const, status: "done" as const, tools: ["Gemini", "Apify", "Hunter"] },
    ],
  },
  {
    id: "ventas", label: "Ventas", icon: "📈", color: "#22c55e", textColor: "#86efac",
    manager: { title: "Agente de Ventas", sub: "Sales Manager AI", status: "done" as const },
    agents: [
      { id: "explorador", title: "Explorador Patagónico", sub: "Lead Gen · Maps · Apify", kind: "ai" as const, status: "done" as const, tools: ["Google Maps", "Apify"] },
      { id: "santi", title: "Santi SDR", sub: "15 leads/día · WhatsApp", kind: "ai" as const, status: "hermes" as const, tools: ["Hermes", "WhatsApp Cloud"] },
      { id: "closer", title: "Jonathan (Closer)", sub: "Reuniones · Cierre", kind: "human" as const, status: undefined, tools: ["Zoom", "WhatsApp personal"] },
    ],
  },
  {
    id: "mkt", label: "Marketing", icon: "📣", color: "#a855f7", textColor: "#d8b4fe",
    manager: { title: "Agente Marketing", sub: "Marketing Manager AI", status: "done" as const },
    agents: [
      { id: "seo", title: "SEO & Contenido", sub: "Blog · Landing pages", kind: "ai" as const, status: "pending" as const, tools: ["WordPress", "Gemini", "Search Console"] },
    ],
  },
  {
    id: "cs", label: "Customer Success", icon: "🤝", color: "#f59e0b", textColor: "#fde68a",
    manager: { title: "Agente CS", sub: "CS Manager AI", status: "done" as const },
    agents: [
      { id: "asesor", title: "Asesor Comercial IA", sub: "Chatbot inbound · CRM webhook", kind: "ai" as const, status: "done" as const, tools: ["Chatbot widget", "CRM webhook", "Gemini"] },
    ],
  },
  {
    id: "ops", label: "Operaciones", icon: "📊", color: "#ef4444", textColor: "#fca5a5",
    manager: { title: "Agente Operaciones", sub: "COO AI", status: "done" as const },
    agents: [
      { id: "finanzas", title: "Finanzas & Admin", sub: "MRR · AFIP · MercadoPago", kind: "hybrid" as const, status: "pending" as const, tools: ["CRM Dashboard", "Neon DB", "AFIP"] },
    ],
  },
];

const STATUS_META = {
  done:    { icon: "✅", label: "Running", dot: "#22c55e" },
  hermes:  { icon: "⚠️", label: "Hermes",  dot: "#f59e0b" },
  pending: { icon: "🔲", label: "Pending", dot: "#475569" },
};
const KIND_META = {
  ai:     { label: "Agente IA", bg: "#4f46e5" },
  hybrid: { label: "Híbrido",   bg: "#b45309" },
  human:  { label: "Humano",    bg: "#475569" },
};

function StatusPill({ status }: { status?: keyof typeof STATUS_META }) {
  if (!status) return null;
  const m = STATUS_META[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      fontSize: 9, fontWeight: 700, padding: "2px 7px",
      background: `${m.dot}18`, border: `1px solid ${m.dot}40`,
      borderRadius: 20, color: m.dot,
    }}>{m.icon} {m.label}</span>
  );
}

export default function OrgVariantLanes() {
  const [filter, setFilter] = useState<StatusFilter>("all");

  return (
    <div style={{
      minHeight: "100vh",
      background: "#040c18",
      fontFamily: "'Inter', system-ui, sans-serif",
      color: "#f1f5f9",
      display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        padding: "20px 24px 14px",
        borderBottom: "1px solid #1e293b",
        background: "#04090f",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 9.5, color: "#6366f1", fontWeight: 700, letterSpacing: 1.3, marginBottom: 4 }}>
              ✦ V2 · SWIMLANES POR DEPARTAMENTO
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0, letterSpacing: -0.4 }}>
              Organigrama por Ownership
            </h1>
          </div>

          {/* CEO + Orq inline */}
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{
              background: "#0a0f1e", border: "1px solid #6366f140",
              borderRadius: 10, padding: "8px 16px", textAlign: "center",
            }}>
              <div style={{ fontSize: 8.5, color: "#818cf8", fontWeight: 700, marginBottom: 1 }}>👤 HUMANO</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#e2e8f0" }}>Jonathan</div>
              <div style={{ fontSize: 9, color: "#475569" }}>CEO & Fundador</div>
            </div>
            <div style={{ color: "#6366f150", fontSize: 16 }}>→</div>
            <div style={{
              background: "#0a0f1e", border: "1px solid #6366f160",
              borderRadius: 10, padding: "8px 16px", textAlign: "center",
              boxShadow: "0 0 16px #6366f130",
            }}>
              <div style={{ fontSize: 8.5, color: "#818cf8", fontWeight: 700, marginBottom: 1 }}>🤖 AGENTE IA</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#a5b4fc" }}>Orquestador IA</div>
              <div style={{ fontSize: 9, color: "#6366f1" }}>Chief of Staff · Cron 15 min</div>
            </div>
          </div>

          {/* Status filter */}
          <div style={{ display: "flex", gap: 6 }}>
            {(["all", "done", "hermes", "pending"] as StatusFilter[]).map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                background: filter === f ? "#1e293b" : "transparent",
                border: `1px solid ${filter === f ? "#334155" : "#1e293b"}`,
                color: filter === f ? "#e2e8f0" : "#475569",
                borderRadius: 6, padding: "5px 12px", fontSize: 10.5,
                cursor: "pointer", fontWeight: 600, transition: "all 0.15s",
              }}>
                {f === "all" ? "Todos" : f === "done" ? "✅ Activos" : f === "hermes" ? "⚠️ Hermes" : "🔲 Pendientes"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Swimlane columns */}
      <div style={{
        flex: 1, display: "flex", gap: 0, overflowX: "auto",
        padding: "0",
      }}>
        {LANES.map((lane, li) => {
          const agents = lane.agents.filter(ag =>
            filter === "all" || ag.status === filter
          );
          return (
            <div key={lane.id} style={{
              flex: 1, minWidth: 190,
              borderRight: li < LANES.length - 1 ? "1px solid #0f172a" : "none",
              display: "flex", flexDirection: "column",
            }}>
              {/* Lane header */}
              <div style={{
                padding: "14px 14px 10px",
                background: `${lane.color}08`,
                borderBottom: `2px solid ${lane.color}30`,
              }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{lane.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: lane.textColor }}>{lane.label}</div>
                <div style={{ fontSize: 9.5, color: "#475569", marginTop: 2 }}>{lane.agents.length} agentes</div>
              </div>

              {/* Manager card */}
              <div style={{
                margin: "10px 10px 6px",
                background: `${lane.color}12`,
                border: `1px solid ${lane.color}35`,
                borderRadius: 10, padding: "10px 12px",
              }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: lane.textColor, marginBottom: 4 }}>
                  🤖 MANAGER
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>{lane.manager.title}</div>
                <div style={{ fontSize: 9.5, color: "#64748b", marginTop: 2 }}>{lane.manager.sub}</div>
                <div style={{ marginTop: 6 }}>
                  <StatusPill status={lane.manager.status} />
                </div>
              </div>

              {/* Connector line */}
              <div style={{ width: 1, height: 12, background: `${lane.color}30`, margin: "0 auto" }} />

              {/* Agent cards */}
              <div style={{ flex: 1, padding: "0 10px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                {agents.length === 0 && (
                  <div style={{ textAlign: "center", color: "#334155", fontSize: 11, paddingTop: 20 }}>
                    Sin agentes en este filtro
                  </div>
                )}
                {agents.map(ag => (
                  <div key={ag.id} style={{
                    background: "#0a0f1e",
                    border: `1px solid ${ag.status === "done" ? lane.color + "25" : "#1e293b"}`,
                    borderRadius: 10, padding: "10px 12px",
                    opacity: filter !== "all" && ag.status !== filter ? 0.3 : 1,
                    transition: "opacity 0.2s",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5 }}>
                      <span style={{
                        fontSize: 8, fontWeight: 700,
                        background: KIND_META[ag.kind].bg + "30",
                        color: KIND_META[ag.kind].bg,
                        padding: "1.5px 6px", borderRadius: 20,
                      }}>
                        {KIND_META[ag.kind].label}
                      </span>
                      <StatusPill status={ag.status} />
                    </div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: "#e2e8f0", marginBottom: 2 }}>{ag.title}</div>
                    <div style={{ fontSize: 9.5, color: "#475569", marginBottom: 7 }}>{ag.sub}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                      {ag.tools.slice(0, 2).map(t => (
                        <span key={t} style={{
                          fontSize: 8, padding: "1.5px 5px",
                          background: `${lane.color}10`, border: `1px solid ${lane.color}25`,
                          color: lane.textColor, borderRadius: 4, fontWeight: 600,
                        }}>{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{
        padding: "10px 24px", borderTop: "1px solid #0f172a",
        background: "#04090f", display: "flex", gap: 16, alignItems: "center",
        fontSize: 10, color: "#334155",
      }}>
        <span>14 nodos totales</span>
        <span>·</span>
        <span style={{ color: "#22c55e" }}>✅ 11 implementados</span>
        <span>·</span>
        <span style={{ color: "#f59e0b" }}>⚠️ 1 en Hermes</span>
        <span>·</span>
        <span style={{ color: "#475569" }}>🔲 2 pendientes</span>
      </div>
    </div>
  );
}
