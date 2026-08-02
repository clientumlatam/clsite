/**
 * V4 · Agent Roster — Dense Reference Grid
 * Concept: all 14 agents as equal-weight cards in a searchable grid.
 * No hierarchy implied — the org is a team of specialists, not a pyramid.
 * Interaction model: filter by dept + type + status; sort by name/status/dept.
 * IA: optimized for "who does what?" — fast lookup, maximum information density.
 */
import React, { useState, useMemo } from "react";

type Kind = "ai" | "hybrid" | "human";
type Status = "done" | "hermes" | "pending";

interface Agent {
  id: string;
  name: string;
  role: string;
  dept: "tech" | "ventas" | "mkt" | "cs" | "ops" | "ceo";
  kind: Kind;
  status?: Status;
  tools: string[];
  layer: string;
  reports_to: string;
}

const AGENTS: Agent[] = [
  { id: "jonathan", name: "Jonathan", role: "CEO & Fundador", dept: "ceo", kind: "human", tools: ["WhatsApp", "GitHub Issues", "Zoom"], layer: "L4 Humano", reports_to: "—" },
  { id: "orq", name: "Orquestador IA", role: "Chief of Staff AI", dept: "ceo", kind: "ai", status: "done", tools: ["Gemini", "GitHub Actions", "Task Router"], layer: "L3 Multi-Agente", reports_to: "Jonathan" },
  { id: "agente-tech", name: "Agente Técnico", role: "CTO AI", dept: "tech", kind: "ai", status: "done", tools: ["GitHub Actions", "Vercel", "Neon DB"], layer: "L3 Multi-Agente", reports_to: "Orquestador" },
  { id: "backend", name: "Backend / Infra", role: "APIs · Auth · DB · Deploys", dept: "tech", kind: "hybrid", status: "done", tools: ["Express", "Neon Postgres", "Vercel Serverless"], layer: "L1 CRM", reports_to: "Agente Técnico" },
  { id: "frontend", name: "Frontend / UX", role: "CRM Kanban · Dashboard · UI", dept: "tech", kind: "hybrid", status: "done", tools: ["React 19", "Tailwind v4", "Recharts"], layer: "L1 CRM", reports_to: "Agente Técnico" },
  { id: "ia-core", name: "IA & Automatización", role: "Brochures · MEDDIC · Enriquecimiento", dept: "tech", kind: "ai", status: "done", tools: ["Gemini API", "Apify Actors", "Hunter.io"], layer: "L1 CRM", reports_to: "Agente Técnico" },
  { id: "agente-ventas", name: "Agente de Ventas", role: "Sales Manager AI", dept: "ventas", kind: "ai", status: "done", tools: ["CRM Kanban", "MEDDIC", "WhatsApp"], layer: "L3 Multi-Agente", reports_to: "Orquestador" },
  { id: "explorador", name: "Explorador Patagónico", role: "Lead Generation AI", dept: "ventas", kind: "ai", status: "done", tools: ["Google Maps API", "Apify", "Gemini Search"], layer: "L3 Multi-Agente", reports_to: "Ag. Ventas" },
  { id: "santi", name: "Santi SDR", role: "SDR Outbound AI · 15 leads/día", dept: "ventas", kind: "ai", status: "hermes", tools: ["Hermes Agent", "WhatsApp Cloud API", "CRM API"], layer: "L2 Hermes", reports_to: "Ag. Ventas" },
  { id: "closer", name: "Jonathan (Closer)", role: "Account Executive", dept: "ventas", kind: "human", tools: ["Zoom", "WhatsApp personal"], layer: "L4 Humano", reports_to: "Ag. Ventas" },
  { id: "agente-mkt", name: "Agente Marketing", role: "Marketing Manager AI", dept: "mkt", kind: "ai", status: "done", tools: ["Gemini", "WordPress", "Google Analytics"], layer: "L3 Multi-Agente", reports_to: "Orquestador" },
  { id: "seo", name: "SEO & Contenido", role: "Blog · Landing pages · Keywords", dept: "mkt", kind: "ai", status: "pending", tools: ["WordPress plugin", "Gemini", "Search Console"], layer: "L3 Multi-Agente", reports_to: "Ag. Marketing" },
  { id: "agente-cs", name: "Agente CS", role: "CS Manager AI · Churn prevention", dept: "cs", kind: "ai", status: "done", tools: ["CRM", "WhatsApp", "Gemini"], layer: "L3 Multi-Agente", reports_to: "Orquestador" },
  { id: "asesor", name: "Asesor Comercial IA", role: "Inbound Chatbot · Leads webhook", dept: "cs", kind: "ai", status: "done", tools: ["Chatbot widget", "CRM webhook", "Gemini"], layer: "L1 CRM", reports_to: "Ag. CS" },
  { id: "agente-ops", name: "Agente Operaciones", role: "COO AI · Alertas · MRR", dept: "ops", kind: "ai", status: "done", tools: ["Neon DB", "Gemini"], layer: "L3 Multi-Agente", reports_to: "Orquestador" },
  { id: "finanzas", name: "Finanzas & Admin", role: "Reporte semanal · MRR · AFIP", dept: "ops", kind: "hybrid", status: "pending", tools: ["CRM Dashboard", "Neon DB", "AFIP", "MercadoPago"], layer: "L1 CRM", reports_to: "Ag. Ops" },
];

const DEPT_META: Record<string, { label: string; color: string; icon: string }> = {
  ceo:    { label: "Dirección", color: "#6366f1", icon: "🏢" },
  tech:   { label: "Técnico",   color: "#0ea5e9", icon: "⚙️" },
  ventas: { label: "Ventas",    color: "#22c55e", icon: "📈" },
  mkt:    { label: "Marketing", color: "#a855f7", icon: "📣" },
  cs:     { label: "CS",        color: "#f59e0b", icon: "🤝" },
  ops:    { label: "Ops",       color: "#ef4444", icon: "📊" },
};
const KIND_META: Record<Kind, { label: string; bg: string }> = {
  ai:     { label: "🤖 Agente IA", bg: "#4f46e5" },
  hybrid: { label: "⚡ Híbrido",   bg: "#b45309" },
  human:  { label: "👤 Humano",    bg: "#334155" },
};
const STATUS_META: Record<Status, { icon: string; color: string }> = {
  done:    { icon: "✅", color: "#22c55e" },
  hermes:  { icon: "⚠️", color: "#f59e0b" },
  pending: { icon: "🔲", color: "#475569" },
};

type SortKey = "name" | "dept" | "status" | "layer";

export default function OrgVariantRoster() {
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [kindFilter, setKindFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortKey>("dept");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = AGENTS.filter(a => {
      if (deptFilter !== "all" && a.dept !== deptFilter) return false;
      if (kindFilter !== "all" && a.kind !== kindFilter) return false;
      if (statusFilter !== "all") {
        if (statusFilter === "none" && a.status) return false;
        if (statusFilter !== "none" && a.status !== statusFilter) return false;
      }
      if (search && !a.name.toLowerCase().includes(search.toLowerCase()) &&
          !a.role.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "dept") return a.dept.localeCompare(b.dept) || a.name.localeCompare(b.name);
      if (sortBy === "layer") return a.layer.localeCompare(b.layer);
      if (sortBy === "status") {
        const order: Record<string, number> = { done: 0, hermes: 1, pending: 2 };
        return (order[a.status || ""] ?? 3) - (order[b.status || ""] ?? 3);
      }
      return 0;
    });
    return list;
  }, [deptFilter, kindFilter, statusFilter, sortBy, search]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#030712",
      fontFamily: "'Inter', system-ui, sans-serif",
      color: "#f1f5f9",
      display: "flex", flexDirection: "column",
    }}>
      {/* Top bar */}
      <div style={{
        padding: "16px 20px 12px",
        background: "#04090f",
        borderBottom: "1px solid #0f172a",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 9.5, color: "#6366f1", fontWeight: 700, letterSpacing: 1.3, marginBottom: 2 }}>
              ✦ V4 · ROSTER DE AGENTES · QUIÉN HACE QUÉ
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 900, margin: 0, letterSpacing: -0.3 }}>
              Todos los agentes · {filtered.length}/{AGENTS.length}
            </h1>
          </div>

          {/* Search */}
          <div style={{ marginLeft: "auto", position: "relative" }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#334155", fontSize: 12 }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar agente..."
              style={{
                background: "#0a0f1e", border: "1px solid #1e293b",
                borderRadius: 8, padding: "7px 12px 7px 30px",
                color: "#e2e8f0", fontSize: 11.5, outline: "none", width: 180,
              }}
            />
          </div>

          {/* Sort */}
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 9.5, color: "#334155", fontWeight: 600 }}>Ordenar:</span>
            {(["dept", "name", "status", "layer"] as SortKey[]).map(k => (
              <button key={k} onClick={() => setSortBy(k)} style={{
                background: sortBy === k ? "#1e293b" : "transparent",
                border: `1px solid ${sortBy === k ? "#334155" : "#1e293b"}`,
                color: sortBy === k ? "#e2e8f0" : "#475569",
                borderRadius: 5, padding: "4px 9px", fontSize: 9.5,
                cursor: "pointer", fontWeight: 600,
              }}>
                {k === "dept" ? "Dpto" : k === "name" ? "Nombre" : k === "status" ? "Estado" : "Capa"}
              </button>
            ))}
          </div>
        </div>

        {/* Filters row */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {/* Dept filter */}
          <div style={{ display: "flex", gap: 4 }}>
            {["all", ...Object.keys(DEPT_META)].map(d => {
              const meta = d !== "all" ? DEPT_META[d] : null;
              return (
                <button key={d} onClick={() => setDeptFilter(d)} style={{
                  background: deptFilter === d ? ((meta?.color ?? "#1e293b") + "20") : "transparent",
                  border: `1px solid ${deptFilter === d ? (meta?.color ?? "#334155") + "60" : "#1e293b"}`,
                  color: deptFilter === d ? (meta?.color ?? "#e2e8f0") : "#334155",
                  borderRadius: 5, padding: "4px 9px", fontSize: 9.5,
                  cursor: "pointer", fontWeight: 600,
                }}>
                  {meta ? `${meta.icon} ${meta.label}` : "Todos los dptos"}
                </button>
              );
            })}
          </div>

          <div style={{ width: 1, background: "#1e293b", margin: "0 2px" }} />

          {/* Kind filter */}
          {(["all", "ai", "hybrid", "human"] as const).map(k => (
            <button key={k} onClick={() => setKindFilter(k)} style={{
              background: kindFilter === k ? "#1e293b" : "transparent",
              border: `1px solid ${kindFilter === k ? "#334155" : "#1e293b"}`,
              color: kindFilter === k ? "#e2e8f0" : "#334155",
              borderRadius: 5, padding: "4px 9px", fontSize: 9.5,
              cursor: "pointer", fontWeight: 600,
            }}>
              {k === "all" ? "Todos los tipos" : KIND_META[k as Kind].label}
            </button>
          ))}

          <div style={{ width: 1, background: "#1e293b", margin: "0 2px" }} />

          {/* Status filter */}
          {(["all", "done", "hermes", "pending"] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              background: statusFilter === s ? "#1e293b" : "transparent",
              border: `1px solid ${statusFilter === s ? "#334155" : "#1e293b"}`,
              color: statusFilter === s ? "#e2e8f0" : "#334155",
              borderRadius: 5, padding: "4px 9px", fontSize: 9.5,
              cursor: "pointer", fontWeight: 600,
            }}>
              {s === "all" ? "Todos los estados" : s === "done" ? "✅ Activos" : s === "hermes" ? "⚠️ Hermes" : "🔲 Pendientes"}
            </button>
          ))}
        </div>
      </div>

      {/* Roster grid */}
      <div style={{
        flex: 1, padding: "16px 20px",
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10,
        alignContent: "start",
      }}>
        {filtered.map(agent => {
          const dept = DEPT_META[agent.dept];
          const kind = KIND_META[agent.kind];
          return (
            <div key={agent.id} style={{
              background: "#04090f",
              border: `1px solid ${dept.color}22`,
              borderRadius: 11, padding: "12px 13px",
              position: "relative", overflow: "hidden",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = dept.color + "55")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = dept.color + "22")}
            >
              {/* Top accent */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, ${dept.color}80, transparent)`,
              }} />

              {/* Dept + status row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{
                  fontSize: 8, fontWeight: 700,
                  color: dept.color, background: `${dept.color}15`,
                  padding: "1.5px 6px", borderRadius: 20,
                }}>
                  {dept.icon} {dept.label}
                </span>
                <span style={{ fontSize: 12 }}>
                  {agent.status ? STATUS_META[agent.status].icon : ""}
                </span>
              </div>

              {/* Name + role */}
              <div style={{ fontSize: 12.5, fontWeight: 800, color: "#e2e8f0", marginBottom: 2, lineHeight: 1.2 }}>
                {agent.name}
              </div>
              <div style={{ fontSize: 9.5, color: "#475569", marginBottom: 9, lineHeight: 1.4 }}>
                {agent.role}
              </div>

              {/* Kind badge */}
              <div style={{
                fontSize: 8, fontWeight: 700,
                background: kind.bg + "25", color: kind.bg,
                display: "inline-block", padding: "1.5px 7px", borderRadius: 20, marginBottom: 7,
              }}>
                {kind.label}
              </div>

              {/* Tools */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {agent.tools.slice(0, 3).map(t => (
                  <span key={t} style={{
                    fontSize: 7.5, padding: "1px 5px",
                    background: `${dept.color}0c`, border: `1px solid ${dept.color}20`,
                    color: "#475569", borderRadius: 4, fontWeight: 600,
                  }}>{t}</span>
                ))}
              </div>

              {/* Reports to */}
              <div style={{ marginTop: 8, fontSize: 8.5, color: "#334155" }}>
                <span style={{ color: "#1e293b" }}>→ </span>{agent.reports_to}
                <span style={{ float: "right", color: "#1e293b", fontSize: 7.5 }}>{agent.layer}</span>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{
            gridColumn: "1 / -1", textAlign: "center",
            paddingTop: 60, color: "#334155",
          }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>🤷</div>
            <div style={{ fontSize: 13 }}>Ningún agente con esos filtros</div>
          </div>
        )}
      </div>
    </div>
  );
}
