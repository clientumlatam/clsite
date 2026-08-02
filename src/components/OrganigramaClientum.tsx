import React, { useState, useMemo } from "react";

// ─── Shared types ────────────────────────────────────────────────────────────

type NodeKind = "human" | "ai" | "hybrid";
type NodeStatus = "done" | "hermes" | "pending";

// ─── TAB SWITCHER ─────────────────────────────────────────────────────────────

type OrgTab = "tree" | "radial" | "lanes" | "pipeline" | "roster";

const TABS: { id: OrgTab; label: string; desc: string }[] = [
  { id: "tree",     label: "🌲 Árbol Clásico",  desc: "Jerarquía colapsable" },
  { id: "radial",   label: "🎯 Hub Radial",      desc: "Autoridad por distancia" },
  { id: "lanes",    label: "📊 Swimlanes",        desc: "Por departamento" },
  { id: "pipeline", label: "🔄 Pipeline Flow",   desc: "Viaje del lead" },
  { id: "roster",   label: "📋 Roster",           desc: "Grilla de agentes" },
];

// ─── ÁRBOL CLÁSICO (vista original) ──────────────────────────────────────────

interface OrgNode {
  id: string;
  title: string;
  subtitle: string;
  kind: NodeKind;
  dept: string;
  description: string;
  tools?: string[];
  status?: NodeStatus;
  children?: OrgNode[];
}

const DEPT_COLORS: Record<string, { bg: string; border: string; accent: string; glow: string }> = {
  ceo:       { bg: "#0a0f1e", border: "#6366f1", accent: "#a5b4fc", glow: "#6366f133" },
  tech:      { bg: "#0b1525", border: "#0ea5e9", accent: "#7dd3fc", glow: "#0ea5e933" },
  ventas:    { bg: "#0c1c0c", border: "#22c55e", accent: "#86efac", glow: "#22c55e33" },
  marketing: { bg: "#180f24", border: "#a855f7", accent: "#d8b4fe", glow: "#a855f733" },
  cs:        { bg: "#1c1400", border: "#f59e0b", accent: "#fde68a", glow: "#f59e0b33" },
  ops:       { bg: "#1a0a0a", border: "#ef4444", accent: "#fca5a5", glow: "#ef444433" },
};

const KIND_BADGE: Record<NodeKind, { label: string; color: string }> = {
  human:  { label: "👤 Humano",    color: "#475569" },
  ai:     { label: "🤖 Agente IA", color: "#4f46e5" },
  hybrid: { label: "⚡ Híbrido",   color: "#b45309" },
};

const STATUS_BADGE: Record<NodeStatus, { icon: string; label: string; color: string }> = {
  done:    { icon: "✅", label: "Implementado",      color: "#16a34a" },
  hermes:  { icon: "⚠️", label: "Delega a Hermes",  color: "#d97706" },
  pending: { icon: "🔲", label: "Pendiente",         color: "#6b7280" },
};

const ORG: OrgNode = {
  id: "ceo",
  title: "Jonathan",
  subtitle: "CEO & Fundador",
  kind: "human",
  dept: "ceo",
  description: "Dueño de Clientum. Toma decisiones estratégicas, cierra deals y supervisa agentes vía chat.",
  children: [
    {
      id: "orquestador",
      title: "Orquestador IA",
      subtitle: "Chief of Staff AI",
      kind: "ai",
      dept: "ceo",
      status: "done",
      description: "Recibe instrucciones de Jonathan vía GitHub Issue y delega a los 5 agentes departamentales. Cron cada 15 min.",
      tools: ["Gemini", "GitHub Issues", "Task router"],
      children: [
        {
          id: "agente-tech",
          title: "Agente Técnico",
          subtitle: "CTO AI",
          kind: "ai",
          dept: "tech",
          status: "done",
          description: "Coordina Backend/Infra, Frontend/UX e IA & Automatización. Verifica CI y deploy en Vercel antes de marcar una tarea como lista.",
          tools: ["GitHub Actions", "Vercel", "Neon DB"],
          children: [
            {
              id: "backend",
              title: "Backend / Infra",
              subtitle: "Node.js · Express · Neon",
              kind: "hybrid",
              dept: "tech",
              status: "done",
              description: "APIs, autenticación, DB schema, bugs y deploys. Modo propuesta — sugiere cambios al Agente Técnico.",
              tools: ["Express", "Neon Postgres", "Vercel Serverless"],
            },
            {
              id: "frontend",
              title: "Frontend / UX",
              subtitle: "React 19 · Vite · Tailwind v4",
              kind: "hybrid",
              dept: "tech",
              status: "done",
              description: "CRM Kanban, brochures, dashboard y UI. Paleta navy/gold. Modo propuesta — valida con Agente Técnico.",
              tools: ["React 19", "Tailwind v4", "Recharts"],
            },
            {
              id: "ia-core",
              title: "IA & Automatización",
              subtitle: "Gemini · Apify · Hunter",
              kind: "ai",
              dept: "tech",
              status: "done",
              description: "Generación de brochures personalizados, MEDDIC scoring automático, enriquecimiento de contactos vía Hunter/Apify.",
              tools: ["Gemini API", "Apify Actors", "Hunter.io"],
            },
          ],
        },
        {
          id: "agente-ventas",
          title: "Agente de Ventas",
          subtitle: "Sales Manager AI",
          kind: "ai",
          dept: "ventas",
          status: "done",
          description: "Pipeline completo: prospección → outreach → calificación MEDDIC → cierre. Revisa CRM Kanban cada 15 min.",
          tools: ["CRM Kanban", "MEDDIC", "WhatsApp"],
          children: [
            {
              id: "explorador",
              title: "Explorador Patagónico",
              subtitle: "Lead Generator AI",
              kind: "ai",
              dept: "ventas",
              status: "done",
              description: "Prospección en Google Maps, Guía Oleo y Apify. Calcula fit score y nunca repite prospectos ya contactados.",
              tools: ["Google Maps API", "Apify", "Gemini Search"],
            },
            {
              id: "santi",
              title: "Santi SDR",
              subtitle: "SDR Outbound AI",
              kind: "ai",
              dept: "ventas",
              status: "hermes",
              description: "Contacta hasta 15 leads/día vía WhatsApp. Clasifica: caliente → escala a Jonathan, tibio → 2 follow-ups, frío → descarta.",
              tools: ["Hermes Agent", "WhatsApp Cloud API", "CRM API"],
            },
            {
              id: "closer",
              title: "Jonathan (Closer)",
              subtitle: "Account Executive",
              kind: "human",
              dept: "ventas",
              description: "Toma las reuniones agendadas por Santi. Único autorizado a negociar precios y cerrar contratos.",
              tools: ["Zoom", "WhatsApp personal"],
            },
          ],
        },
        {
          id: "agente-marketing",
          title: "Agente de Marketing",
          subtitle: "Marketing Manager AI",
          kind: "ai",
          dept: "marketing",
          status: "done",
          description: "Genera contenido, gestiona SEO y campañas. Paleta navy/gold, foco en keywords Patagonia.",
          tools: ["Gemini", "WordPress", "Google Analytics"],
          children: [
            {
              id: "seo",
              title: "SEO & Contenido",
              subtitle: "Content AI",
              kind: "ai",
              dept: "marketing",
              status: "pending",
              description: "Blog posts y landing pages por industria. Keywords Patagonia. Escribe en criollo, orientado a conversión.",
              tools: ["WordPress plugin", "Gemini", "Search Console"],
            },
          ],
        },
        {
          id: "agente-cs",
          title: "Agente Customer Success",
          subtitle: "CS Manager AI",
          kind: "ai",
          dept: "cs",
          status: "done",
          description: "Monitorea salud de clientes activos, gestiona onboarding y detecta riesgo de churn antes de que el cliente se queje.",
          tools: ["CRM", "WhatsApp", "Gemini"],
          children: [
            {
              id: "asesor",
              title: "Asesor Comercial IA",
              subtitle: "Inbound Chatbot",
              kind: "ai",
              dept: "cs",
              status: "done",
              description: "Captura leads inbound desde el sitio. Responde consultas, califica interés y carga en CRM vía webhook.",
              tools: ["Chatbot widget", "CRM webhook", "Gemini"],
            },
          ],
        },
        {
          id: "agente-ops",
          title: "Agente de Operaciones",
          subtitle: "COO AI",
          kind: "ai",
          dept: "ops",
          status: "done",
          description: "Reportes semanales, monitoreo de MRR/leads/conversión/churn. Alerta anomalías inmediatamente.",
          tools: ["Neon DB", "Retool", "Gemini"],
          children: [
            {
              id: "finanzas",
              title: "Finanzas & Admin",
              subtitle: "Reportes & Métricas",
              kind: "hybrid",
              dept: "ops",
              status: "pending",
              description: "MRR, facturación AFIP, suscripciones MercadoPago, pipeline revenue. Dashboard ejecutivo semanal en formato fijo.",
              tools: ["CRM Dashboard", "Neon DB", "AFIP", "MercadoPago"],
            },
          ],
        },
      ],
    },
  ],
};

function StatusDot({ status }: { status?: NodeStatus }) {
  if (!status) return null;
  const s = STATUS_BADGE[status];
  return (
    <span
      style={{ position: "absolute", top: 6, right: 8, fontSize: 10, lineHeight: 1 }}
      title={s.label}
    >
      {s.icon}
    </span>
  );
}

function NodeCard({ node, depth = 0 }: { node: OrgNode; depth?: number }) {
  const [expanded, setExpanded] = useState(true);
  const [hovered, setHovered] = useState(false);
  const colors = DEPT_COLORS[node.dept];
  const badge = KIND_BADGE[node.kind];
  const hasChildren = node.children && node.children.length > 0;
  const cardW = depth === 0 ? 256 : depth === 1 ? 210 : 182;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered
            ? `linear-gradient(145deg, ${colors.bg}f0, ${colors.bg}cc)`
            : `linear-gradient(145deg, ${colors.bg}, ${colors.bg}dd)`,
          border: `1.5px solid ${hovered ? colors.accent : colors.border}`,
          borderRadius: 14,
          padding: depth === 0 ? "22px 26px 18px" : depth === 1 ? "16px 16px 14px" : "12px 14px 10px",
          width: cardW,
          cursor: hasChildren ? "pointer" : "default",
          transition: "all 0.18s ease",
          boxShadow: hovered
            ? `0 0 28px ${colors.glow}, 0 6px 24px #00000066`
            : `0 2px 14px #00000044`,
          position: "relative",
        }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        <StatusDot status={node.status} />
        <div style={{
          position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
          background: badge.color,
          color: "#fff", fontSize: 9.5, fontWeight: 700,
          padding: "2px 9px", borderRadius: 20, whiteSpace: "nowrap", letterSpacing: 0.4,
        }}>
          {badge.label}
        </div>
        <div style={{
          color: colors.accent, fontWeight: 800,
          fontSize: depth === 0 ? 19 : depth === 1 ? 14 : 12.5,
          lineHeight: 1.2, marginBottom: 2, marginTop: 4,
          letterSpacing: depth === 0 ? -0.3 : 0,
        }}>
          {node.title}
        </div>
        <div style={{
          color: "#94a3b8",
          fontSize: depth === 0 ? 11.5 : 10.5,
          fontWeight: 500, marginBottom: 7, letterSpacing: 0.2,
        }}>
          {node.subtitle}
        </div>
        <div style={{ height: 1, background: `${colors.border}33`, marginBottom: 7 }} />
        <div style={{ color: "#cbd5e1", fontSize: depth === 0 ? 11 : 10, lineHeight: 1.55 }}>
          {node.description}
        </div>
        {node.tools && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 8 }}>
            {node.tools.map(t => (
              <span key={t} style={{
                background: `${colors.border}18`,
                border: `1px solid ${colors.border}40`,
                color: colors.accent,
                fontSize: 8.5, padding: "1.5px 5px",
                borderRadius: 4, fontWeight: 600, letterSpacing: 0.1,
              }}>
                {t}
              </span>
            ))}
          </div>
        )}
        {hasChildren && (
          <div style={{
            position: "absolute", bottom: -11, left: "50%", transform: "translateX(-50%)",
            background: colors.border, color: "#fff", width: 20, height: 20,
            borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 900, zIndex: 2, lineHeight: 1,
            boxShadow: `0 0 8px ${colors.glow}`,
          }}>
            {expanded ? "−" : "+"}
          </div>
        )}
      </div>

      {hasChildren && expanded && (
        <div style={{ marginTop: 30, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 2, height: 18, background: `${colors.border}66` }} />
          <div style={{ position: "relative", display: "flex", alignItems: "flex-start", gap: 12 }}>
            {node.children!.length > 1 && (
              <div style={{
                position: "absolute",
                top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, transparent 5%, ${colors.border}40 20%, ${colors.border}40 80%, transparent 95%)`,
              }} />
            )}
            {node.children!.map((child) => (
              <div key={child.id} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 2, height: 18, background: `${DEPT_COLORS[child.dept].border}66` }} />
                <NodeCard node={child} depth={depth + 1} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TreeView() {
  return (
    <div style={{ padding: "36px 28px 56px", overflowX: "auto" }}>
      <div style={{ textAlign: "center", marginBottom: 44 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "#6366f115", border: "1px solid #6366f130",
          borderRadius: 8, padding: "5px 16px", marginBottom: 14,
          fontSize: 10.5, color: "#818cf8", fontWeight: 700, letterSpacing: 1.2,
        }}>
          ✦ CLIENTUM · ORGANIGRAMA IDEAL · JULIO 2026
        </div>
        <h2 style={{
          color: "#f1f5f9", fontSize: 26, fontWeight: 900, margin: "0 0 10px",
          letterSpacing: -0.8, lineHeight: 1.1,
        }}>
          Estructura Organizacional + Agentes IA
        </h2>
        <p style={{ color: "#64748b", fontSize: 12.5, maxWidth: 580, margin: "0 auto 20px", lineHeight: 1.6 }}>
          Cada nodo del organigrama es un agente de IA independiente coordinado por el Orquestador Central.
          Jonathan gestiona toda la empresa vía chat con el Orquestador.
        </p>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 16,
          background: "#0f172a88", border: "1px solid #1e293b",
          borderRadius: 10, padding: "8px 18px", flexWrap: "wrap", justifyContent: "center",
        }}>
          {(Object.entries(KIND_BADGE) as [NodeKind, { label: string; color: string }][]).map(([, b]) => (
            <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 9, height: 9, borderRadius: 2, background: b.color }} />
              <span style={{ color: "#94a3b8", fontSize: 10.5 }}>{b.label}</span>
            </div>
          ))}
          <div style={{ width: 1, height: 14, background: "#1e293b" }} />
          {(Object.entries(STATUS_BADGE) as [NodeStatus, { icon: string; label: string; color: string }][]).map(([, s]) => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 11 }}>{s.icon}</span>
              <span style={{ color: "#94a3b8", fontSize: 10.5 }}>{s.label}</span>
            </div>
          ))}
          <div style={{ width: 1, height: 14, background: "#1e293b" }} />
          <span style={{ color: "#475569", fontSize: 10.5 }}>Clic en nodo para colapsar</span>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", overflowX: "auto", paddingBottom: 20 }}>
        <NodeCard node={ORG} depth={0} />
      </div>

      <div style={{
        maxWidth: 860, margin: "52px auto 0",
        background: "#0a0f1e88", border: "1px solid #1e293b",
        borderRadius: 14, padding: "20px 26px",
      }}>
        <div style={{ color: "#818cf8", fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>
          ⚡ HERMES PRIME — CAPAS DE ARQUITECTURA
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {[
            { capa: "CAPA 4 — HUMANO",         desc: "Jonathan (CEO) vía WhatsApp / GitHub Issues",                                                             color: "#6366f1" },
            { capa: "CAPA 3 — MULTI-AGENTE",   desc: "GitHub Actions cron 15 min · Orquestador + 13 agentes · repo clientum-agentes",                           color: "#0ea5e9" },
            { capa: "CAPA 2 — HERMES AGENT",   desc: "Santi SDR (Nous Research) · WhatsApp Cloud API · 15 contactos/día · Ubuntu server",                      color: "#22c55e" },
            { capa: "CAPA 1 — CLIENTUM CRM",   desc: "Express + React 19 + Neon PostgreSQL · clientum.com.ar (Vercel) · API 6 endpoints",                       color: "#f59e0b" },
            { capa: "CAPA 0 — NEON POSTGRESQL", desc: "users · session · chatbot_leads · santi_leads · santi_brochures · santi_notes",                          color: "#ef4444" },
          ].map((l) => (
            <div key={l.capa} style={{
              display: "flex", alignItems: "center", gap: 12,
              background: `${l.color}08`, border: `1px solid ${l.color}20`,
              borderRadius: 8, padding: "7px 13px",
            }}>
              <span style={{ color: l.color, fontSize: 10, fontWeight: 700, whiteSpace: "nowrap", minWidth: 160 }}>{l.capa}</span>
              <span style={{ color: "#64748b", fontSize: 10.5 }}>{l.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── V1 · HUB RADIAL ─────────────────────────────────────────────────────────

const RADIAL_DEPTS = [
  {
    id: "tech", label: "Técnico", icon: "⚙️", color: "#0ea5e9", glow: "#0ea5e920",
    subtitle: "CTO AI",
    agents: [
      { id: "backend", label: "Backend/Infra", kind: "⚡", status: "✅" },
      { id: "frontend", label: "Frontend/UX", kind: "⚡", status: "✅" },
      { id: "ia", label: "IA & Automatización", kind: "🤖", status: "✅" },
    ],
  },
  {
    id: "ventas", label: "Ventas", icon: "📈", color: "#22c55e", glow: "#22c55e20",
    subtitle: "Sales Manager AI",
    agents: [
      { id: "explorador", label: "Explorador Patagónico", kind: "🤖", status: "✅" },
      { id: "santi", label: "Santi SDR", kind: "🤖", status: "⚠️" },
      { id: "closer", label: "Jonathan (Closer)", kind: "👤", status: "" },
    ],
  },
  {
    id: "mkt", label: "Marketing", icon: "📣", color: "#a855f7", glow: "#a855f720",
    subtitle: "Marketing Manager AI",
    agents: [
      { id: "seo", label: "SEO & Contenido", kind: "🤖", status: "🔲" },
    ],
  },
  {
    id: "cs", label: "Customer Success", icon: "🤝", color: "#f59e0b", glow: "#f59e0b20",
    subtitle: "CS Manager AI",
    agents: [
      { id: "asesor", label: "Asesor Comercial IA", kind: "🤖", status: "✅" },
    ],
  },
  {
    id: "ops", label: "Operaciones", icon: "📊", color: "#ef4444", glow: "#ef444420",
    subtitle: "COO AI",
    agents: [
      { id: "finanzas", label: "Finanzas & Admin", kind: "⚡", status: "🔲" },
    ],
  },
];

function RadialView() {
  const [active, setActive] = useState<string | null>(null);
  const activeDept = RADIAL_DEPTS.find(d => d.id === active);
  const R = 200;
  const cx = 420, cy = 370;
  const deptPositions = RADIAL_DEPTS.map((_, i) => {
    const angle = (i / RADIAL_DEPTS.length) * 2 * Math.PI - Math.PI / 2;
    return { x: cx + R * Math.cos(angle), y: cy + R * Math.sin(angle) };
  });
  function leafPositions(deptIdx: number, count: number) {
    const base = (deptIdx / RADIAL_DEPTS.length) * 2 * Math.PI - Math.PI / 2;
    const dp = deptPositions[deptIdx];
    const spread = 0.45;
    return Array.from({ length: count }, (_, i) => {
      const frac = count === 1 ? 0.5 : i / (count - 1);
      const angle = base + (frac - 0.5) * spread;
      return { x: dp.x + 112 * Math.cos(angle), y: dp.y + 112 * Math.sin(angle) };
    });
  }

  return (
    <div style={{ padding: "28px 24px 80px", color: "#f1f5f9" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{
          display: "inline-block",
          background: "#6366f110", border: "1px solid #6366f130",
          borderRadius: 6, padding: "3px 14px", marginBottom: 10,
          fontSize: 9.5, color: "#818cf8", fontWeight: 700, letterSpacing: 1.4,
        }}>✦ V1 · HUB RADIAL · AUTORIDAD POR DISTANCIA AL CENTRO</div>
        <h1 style={{ fontSize: 26, fontWeight: 900, margin: "0 0 6px", letterSpacing: -0.5, color: "#f1f5f9" }}>
          Organigrama Radial
        </h1>
        <p style={{ color: "#475569", fontSize: 11.5, margin: 0 }}>
          Más cerca del centro = más estratégico. Clic en un dept para ver sus agentes.
        </p>
      </div>

      <div style={{ display: "flex", gap: 32, alignItems: "flex-start", justifyContent: "center" }}>
        <svg width={840} height={740} style={{ flexShrink: 0, overflow: "visible" }}>
          <defs>
            {RADIAL_DEPTS.map(d => (
              <radialGradient key={d.id} id={`grd-r-${d.id}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={d.color} stopOpacity="0.25" />
                <stop offset="100%" stopColor={d.color} stopOpacity="0.05" />
              </radialGradient>
            ))}
            <radialGradient id="grd-r-ceo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.08" />
            </radialGradient>
          </defs>
          <circle cx={cx} cy={cy} r={R + 112} stroke="#1e293b" strokeWidth="1" fill="none" strokeDasharray="4 6" />
          <circle cx={cx} cy={cy} r={R} stroke="#1e293b" strokeWidth="1" fill="none" strokeDasharray="4 6" />
          <circle cx={cx} cy={cy} r={75} stroke="#6366f122" strokeWidth="1.5" fill="none" />
          {deptPositions.map((dp, i) => {
            const d = RADIAL_DEPTS[i];
            return (
              <line key={d.id} x1={cx} y1={cy} x2={dp.x} y2={dp.y}
                stroke={active === d.id ? d.color : "#1e293b"}
                strokeWidth={active === d.id ? 1.5 : 1}
                strokeDasharray={active === d.id ? "" : "3 5"}
                style={{ transition: "all 0.2s" }}
              />
            );
          })}
          {RADIAL_DEPTS.map((dept, di) => {
            const leaves = leafPositions(di, dept.agents.length);
            return dept.agents.map((ag, ai) => (
              <line key={ag.id}
                x1={deptPositions[di].x} y1={deptPositions[di].y}
                x2={leaves[ai].x} y2={leaves[ai].y}
                stroke={active === dept.id ? `${dept.color}60` : "#1e293b50"}
                strokeWidth="1" style={{ transition: "all 0.2s" }}
              />
            ));
          })}
          {RADIAL_DEPTS.map((dept, di) => {
            const leaves = leafPositions(di, dept.agents.length);
            return dept.agents.map((ag, ai) => {
              const lx = leaves[ai].x, ly = leaves[ai].y;
              const show = active === dept.id;
              return (
                <g key={ag.id} style={{ opacity: show ? 1 : 0.3, transition: "opacity 0.25s" }}>
                  <circle cx={lx} cy={ly} r={34}
                    fill={show ? `${dept.color}18` : "#0f172a"}
                    stroke={show ? dept.color : "#1e293b"} strokeWidth="1" />
                  <text x={lx} y={ly - 6} textAnchor="middle" fontSize="14" dominantBaseline="middle">{ag.kind}</text>
                  <text x={lx} y={ly + 9} textAnchor="middle" fontSize="7.5" fill={show ? dept.color : "#475569"} fontWeight="600">
                    {ag.label.split(" ").slice(0, 2).join(" ")}
                  </text>
                  {ag.status && (
                    <text x={lx + 26} y={ly - 22} fontSize="10">{ag.status}</text>
                  )}
                </g>
              );
            });
          })}
          {RADIAL_DEPTS.map((dept, i) => {
            const dp = deptPositions[i];
            const isActive = active === dept.id;
            return (
              <g key={dept.id} style={{ cursor: "pointer" }}
                onClick={() => setActive(isActive ? null : dept.id)}>
                <circle cx={dp.x} cy={dp.y} r={50}
                  fill={isActive ? `url(#grd-r-${dept.id})` : "#0f172a88"}
                  stroke={dept.color} strokeWidth={isActive ? 2 : 1.5}
                  style={{ filter: isActive ? `drop-shadow(0 0 12px ${dept.color}66)` : "none", transition: "all 0.2s" }}
                />
                <text x={dp.x} y={dp.y - 9} textAnchor="middle" fontSize="20" dominantBaseline="middle">{dept.icon}</text>
                <text x={dp.x} y={dp.y + 9} textAnchor="middle" fontSize="9" fill={isActive ? dept.color : "#94a3b8"} fontWeight="700" letterSpacing="0.3">
                  {dept.label.toUpperCase()}
                </text>
                <text x={dp.x} y={dp.y + 21} textAnchor="middle" fontSize="7.5" fill="#475569">
                  {dept.agents.length} agentes
                </text>
              </g>
            );
          })}
          <circle cx={cx} cy={cy} r={75} fill="url(#grd-r-ceo)" stroke="#6366f1" strokeWidth="1.5"
            style={{ filter: "drop-shadow(0 0 16px #6366f166)" }} />
          <text x={cx} y={cy - 22} textAnchor="middle" fontSize="9" fill="#818cf8" fontWeight="700" letterSpacing="1">🤖 AGENTE IA</text>
          <text x={cx} y={cy - 5} textAnchor="middle" fontSize="15" fill="#a5b4fc" fontWeight="900">Orquestador</text>
          <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fill="#6366f1" fontWeight="600">Chief of Staff AI</text>
          <text x={cx} y={cy + 26} textAnchor="middle" fontSize="8" fill="#475569">Cron 15 min · Gemini</text>
          <g>
            <rect x={cx - 70} y={16} width={140} height={56} rx={10}
              fill="#0a0f1e" stroke="#6366f140" strokeWidth="1.5"
              style={{ filter: "drop-shadow(0 2px 8px #6366f133)" }} />
            <text x={cx} y={34} textAnchor="middle" fontSize="9" fill="#818cf8" fontWeight="700">👤 HUMANO</text>
            <text x={cx} y={50} textAnchor="middle" fontSize="14" fill="#e2e8f0" fontWeight="900">Jonathan</text>
            <text x={cx} y={64} textAnchor="middle" fontSize="8.5" fill="#475569">CEO & Fundador</text>
            <line x1={cx} y1={72} x2={cx} y2={cy - 75} stroke="#6366f150" strokeWidth="1.5" strokeDasharray="4 4" />
          </g>
        </svg>

        <div style={{
          width: 260, minHeight: 300, background: "#0a0f1e",
          border: `1px solid ${activeDept ? activeDept.color + "40" : "#1e293b"}`,
          borderRadius: 14, padding: "20px 18px", transition: "border-color 0.2s",
        }}>
          {!activeDept ? (
            <div style={{ textAlign: "center", paddingTop: 60 }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🎯</div>
              <div style={{ color: "#475569", fontSize: 12, lineHeight: 1.6 }}>
                Seleccioná un departamento en el diagrama para ver sus agentes en detalle.
              </div>
            </div>
          ) : (
            <>
              <div style={{
                display: "flex", alignItems: "center", gap: 10, marginBottom: 16,
                paddingBottom: 14, borderBottom: `1px solid ${activeDept.color}25`,
              }}>
                <span style={{ fontSize: 24 }}>{activeDept.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: activeDept.color }}>{activeDept.label}</div>
                  <div style={{ fontSize: 10, color: "#64748b" }}>{activeDept.subtitle}</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {activeDept.agents.map(ag => (
                  <div key={ag.id} style={{
                    background: `${activeDept.color}08`, border: `1px solid ${activeDept.color}20`,
                    borderRadius: 10, padding: "10px 13px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <span style={{ fontSize: 14 }}>{ag.kind}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#e2e8f0" }}>{ag.label}</span>
                    </div>
                    <span style={{ fontSize: 13 }}>{ag.status}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: "40px auto 0", display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
        {[
          { label: "HUMANO", color: "#475569", icon: "👤" },
          { label: "AGENTE IA", color: "#4f46e5", icon: "🤖" },
          { label: "HÍBRIDO", color: "#b45309", icon: "⚡" },
          { label: "Implementado", color: "#16a34a", icon: "✅" },
          { label: "Hermes", color: "#d97706", icon: "⚠️" },
          { label: "Pendiente", color: "#6b7280", icon: "🔲" },
        ].map(l => (
          <div key={l.label} style={{
            display: "flex", alignItems: "center", gap: 5,
            background: "#0f172a", border: "1px solid #1e293b",
            borderRadius: 6, padding: "4px 10px", fontSize: 9.5, color: "#64748b",
          }}>
            <span>{l.icon}</span>
            <span style={{ color: l.color, fontWeight: 600 }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── V2 · SWIMLANES ───────────────────────────────────────────────────────────

type SwimStatus = "done" | "hermes" | "pending";
const SWIM_STATUS_META = {
  done:    { icon: "✅", label: "Running", dot: "#22c55e" },
  hermes:  { icon: "⚠️", label: "Hermes",  dot: "#f59e0b" },
  pending: { icon: "🔲", label: "Pending", dot: "#475569" },
};
const SWIM_KIND_META = {
  ai:     { label: "Agente IA", bg: "#4f46e5" },
  hybrid: { label: "Híbrido",   bg: "#b45309" },
  human:  { label: "Humano",    bg: "#475569" },
};

const SWIM_LANES = [
  {
    id: "tech", label: "Técnico", icon: "⚙️", color: "#0ea5e9", textColor: "#7dd3fc",
    manager: { title: "Agente Técnico", sub: "CTO AI", status: "done" as SwimStatus },
    agents: [
      { id: "backend", title: "Backend / Infra", sub: "Express · Neon · Vercel", kind: "hybrid" as const, status: "done" as SwimStatus, tools: ["Express", "Neon Postgres"] },
      { id: "frontend", title: "Frontend / UX", sub: "React 19 · Vite · Tailwind", kind: "hybrid" as const, status: "done" as SwimStatus, tools: ["React 19", "Recharts"] },
      { id: "ia", title: "IA & Automatización", sub: "Brochures · MEDDIC", kind: "ai" as const, status: "done" as SwimStatus, tools: ["Gemini", "Apify", "Hunter"] },
    ],
  },
  {
    id: "ventas", label: "Ventas", icon: "📈", color: "#22c55e", textColor: "#86efac",
    manager: { title: "Agente de Ventas", sub: "Sales Manager AI", status: "done" as SwimStatus },
    agents: [
      { id: "explorador", title: "Explorador Patagónico", sub: "Lead Gen · Maps · Apify", kind: "ai" as const, status: "done" as SwimStatus, tools: ["Google Maps", "Apify"] },
      { id: "santi", title: "Santi SDR", sub: "15 leads/día · WhatsApp", kind: "ai" as const, status: "hermes" as SwimStatus, tools: ["Hermes", "WhatsApp Cloud"] },
      { id: "closer", title: "Jonathan (Closer)", sub: "Reuniones · Cierre", kind: "human" as const, status: undefined as SwimStatus | undefined, tools: ["Zoom", "WhatsApp personal"] },
    ],
  },
  {
    id: "mkt", label: "Marketing", icon: "📣", color: "#a855f7", textColor: "#d8b4fe",
    manager: { title: "Agente Marketing", sub: "Marketing Manager AI", status: "done" as SwimStatus },
    agents: [
      { id: "seo", title: "SEO & Contenido", sub: "Blog · Landing pages", kind: "ai" as const, status: "pending" as SwimStatus, tools: ["WordPress", "Gemini", "Search Console"] },
    ],
  },
  {
    id: "cs", label: "Customer Success", icon: "🤝", color: "#f59e0b", textColor: "#fde68a",
    manager: { title: "Agente CS", sub: "CS Manager AI", status: "done" as SwimStatus },
    agents: [
      { id: "asesor", title: "Asesor Comercial IA", sub: "Chatbot inbound · CRM webhook", kind: "ai" as const, status: "done" as SwimStatus, tools: ["Chatbot widget", "CRM webhook", "Gemini"] },
    ],
  },
  {
    id: "ops", label: "Operaciones", icon: "📊", color: "#ef4444", textColor: "#fca5a5",
    manager: { title: "Agente Operaciones", sub: "COO AI", status: "done" as SwimStatus },
    agents: [
      { id: "finanzas", title: "Finanzas & Admin", sub: "MRR · AFIP · MercadoPago", kind: "hybrid" as const, status: "pending" as SwimStatus, tools: ["CRM Dashboard", "Neon DB", "AFIP"] },
    ],
  },
];

type SwimFilter = "all" | "done" | "hermes" | "pending";

function StatusPill({ status }: { status?: SwimStatus }) {
  if (!status) return null;
  const m = SWIM_STATUS_META[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      fontSize: 9, fontWeight: 700, padding: "2px 7px",
      background: `${m.dot}18`, border: `1px solid ${m.dot}40`,
      borderRadius: 20, color: m.dot,
    }}>{m.icon} {m.label}</span>
  );
}

function LanesView() {
  const [filter, setFilter] = useState<SwimFilter>("all");
  return (
    <div style={{ minHeight: 600, background: "#040c18", color: "#f1f5f9", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "20px 24px 14px", borderBottom: "1px solid #1e293b", background: "#04090f" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 9.5, color: "#6366f1", fontWeight: 700, letterSpacing: 1.3, marginBottom: 4 }}>
              ✦ V2 · SWIMLANES POR DEPARTAMENTO
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0, letterSpacing: -0.4 }}>
              Organigrama por Ownership
            </h1>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ background: "#0a0f1e", border: "1px solid #6366f140", borderRadius: 10, padding: "8px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 8.5, color: "#818cf8", fontWeight: 700, marginBottom: 1 }}>👤 HUMANO</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#e2e8f0" }}>Jonathan</div>
              <div style={{ fontSize: 9, color: "#475569" }}>CEO & Fundador</div>
            </div>
            <div style={{ color: "#6366f150", fontSize: 16 }}>→</div>
            <div style={{ background: "#0a0f1e", border: "1px solid #6366f160", borderRadius: 10, padding: "8px 16px", textAlign: "center", boxShadow: "0 0 16px #6366f130" }}>
              <div style={{ fontSize: 8.5, color: "#818cf8", fontWeight: 700, marginBottom: 1 }}>🤖 AGENTE IA</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#a5b4fc" }}>Orquestador IA</div>
              <div style={{ fontSize: 9, color: "#6366f1" }}>Chief of Staff · Cron 15 min</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {(["all", "done", "hermes", "pending"] as SwimFilter[]).map(f => (
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
      <div style={{ flex: 1, display: "flex", gap: 0, overflowX: "auto" }}>
        {SWIM_LANES.map((lane, li) => {
          const agents = lane.agents.filter(ag => filter === "all" || ag.status === filter);
          return (
            <div key={lane.id} style={{
              flex: 1, minWidth: 190,
              borderRight: li < SWIM_LANES.length - 1 ? "1px solid #0f172a" : "none",
              display: "flex", flexDirection: "column",
            }}>
              <div style={{ padding: "14px 14px 10px", background: `${lane.color}08`, borderBottom: `2px solid ${lane.color}30` }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{lane.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: lane.textColor }}>{lane.label}</div>
                <div style={{ fontSize: 9.5, color: "#475569", marginTop: 2 }}>{lane.agents.length} agentes</div>
              </div>
              <div style={{ margin: "10px 10px 6px", background: `${lane.color}12`, border: `1px solid ${lane.color}35`, borderRadius: 10, padding: "10px 12px" }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: lane.textColor, marginBottom: 4 }}>🤖 MANAGER</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>{lane.manager.title}</div>
                <div style={{ fontSize: 9.5, color: "#64748b", marginTop: 2 }}>{lane.manager.sub}</div>
                <div style={{ marginTop: 6 }}><StatusPill status={lane.manager.status} /></div>
              </div>
              <div style={{ width: 1, height: 12, background: `${lane.color}30`, margin: "0 auto" }} />
              <div style={{ flex: 1, padding: "0 10px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                {agents.length === 0 && (
                  <div style={{ textAlign: "center", color: "#334155", fontSize: 11, paddingTop: 20 }}>Sin agentes en este filtro</div>
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
                      <span style={{ fontSize: 8, fontWeight: 700, background: SWIM_KIND_META[ag.kind].bg + "30", color: SWIM_KIND_META[ag.kind].bg, padding: "1.5px 6px", borderRadius: 20 }}>
                        {SWIM_KIND_META[ag.kind].label}
                      </span>
                      <StatusPill status={ag.status} />
                    </div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: "#e2e8f0", marginBottom: 2 }}>{ag.title}</div>
                    <div style={{ fontSize: 9.5, color: "#475569", marginBottom: 7 }}>{ag.sub}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                      {ag.tools.slice(0, 2).map(t => (
                        <span key={t} style={{ fontSize: 8, padding: "1.5px 5px", background: `${lane.color}10`, border: `1px solid ${lane.color}25`, color: lane.textColor, borderRadius: 4, fontWeight: 600 }}>{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ padding: "10px 24px", borderTop: "1px solid #0f172a", background: "#04090f", display: "flex", gap: 16, alignItems: "center", fontSize: 10, color: "#334155" }}>
        <span>14 nodos totales</span><span>·</span>
        <span style={{ color: "#22c55e" }}>✅ 11 implementados</span><span>·</span>
        <span style={{ color: "#f59e0b" }}>⚠️ 1 en Hermes</span><span>·</span>
        <span style={{ color: "#475569" }}>🔲 2 pendientes</span>
      </div>
    </div>
  );
}

// ─── V3 · PIPELINE FLOW ──────────────────────────────────────────────────────

const PIPE_STAGES = [
  {
    id: "discover", step: "01", label: "Descubrir", icon: "🔍", color: "#0ea5e9",
    desc: "Identificar PyMEs en la región con alto fit score.",
    agents: [{ name: "Explorador Patagónico", role: "Scraping en Google Maps + Apify. Calcula fit score y filtra los mejores leads.", kind: "🤖", tool: "Maps · Apify · Gemini" }],
    output: "Lista de leads calificados con fit score > 7",
  },
  {
    id: "enrich", step: "02", label: "Enriquecer", icon: "🧬", color: "#6366f1",
    desc: "Resolver el contacto correcto y generar el brochure.",
    agents: [{ name: "IA & Automatización", role: "Enriquece el contacto vía Hunter.io, genera brochure personalizado con Gemini.", kind: "🤖", tool: "Hunter · Gemini · Apify" }],
    output: "Lead con email, cargo, brochure HTML y gancho personalizado",
  },
  {
    id: "contact", step: "03", label: "Contactar", icon: "💬", color: "#22c55e",
    desc: "Primer contacto WhatsApp y clasificación de respuesta.",
    agents: [{ name: "Santi SDR", role: "Envía mensaje personalizado con el gancho del brochure. Máximo 15 leads/día. Clasifica: caliente · tibio · frío.", kind: "🤖", tool: "Hermes Agent · WhatsApp" }],
    output: "Lead clasificado: caliente / tibio / frío / agendado",
  },
  {
    id: "qualify", step: "04", label: "Calificar", icon: "🎯", color: "#f59e0b",
    desc: "Scoring MEDDIC y decisión de escalar a cierre.",
    agents: [
      { name: "Agente de Ventas", role: "Revisa el pipeline cada 15 min. Decide si el lead califica para reunión con Jonathan según MEDDIC.", kind: "🤖", tool: "CRM Kanban · MEDDIC" },
      { name: "IA & Automatización", role: "Corre scoring MEDDIC automático sobre el lead y lo actualiza en el CRM.", kind: "🤖", tool: "Gemini · CRM API" },
    ],
    output: "MEDDIC score + decisión: agendar reunión o continuar nurturing",
  },
  {
    id: "close", step: "05", label: "Cerrar", icon: "🤝", color: "#a855f7",
    desc: "Reunión y firma con el humano en el loop.",
    agents: [{ name: "Jonathan (Closer)", role: "Toma la reunión agendada. Único autorizado a negociar precio y condiciones. Cierra el contrato.", kind: "👤", tool: "Zoom · WhatsApp personal" }],
    output: "Contrato firmado → cliente activo",
  },
  {
    id: "retain", step: "06", label: "Retener", icon: "💚", color: "#06b6d4",
    desc: "Onboarding, salud de cuenta y churn prevention.",
    agents: [
      { name: "Agente Customer Success", role: "Onboarding del cliente nuevo. Monitorea salud de cuenta. Detecta señales de churn antes de que ocurran.", kind: "🤖", tool: "CRM · WhatsApp · Gemini" },
      { name: "Asesor Comercial IA", role: "Chatbot inbound para consultas post-venta. Captura upsells y los pasa a Ventas.", kind: "🤖", tool: "Chatbot widget · CRM webhook" },
    ],
    output: "Cliente retenido, expansión de cuenta detectada",
  },
  {
    id: "report", step: "07", label: "Reportar", icon: "📊", color: "#ef4444",
    desc: "Métricas, alertas y reporte ejecutivo semanal.",
    agents: [
      { name: "Agente de Operaciones", role: "Consolida MRR, leads, conversión y churn. Alerta anomalías al Orquestador sin esperar el reporte semanal.", kind: "🤖", tool: "Neon DB · Gemini" },
      { name: "Finanzas & Admin", role: "Reporte ejecutivo semanal: facturación AFIP + MercadoPago + pipeline revenue.", kind: "⚡", tool: "CRM Dashboard · Neon DB" },
    ],
    output: "Dashboard semanal + alertas en tiempo real",
  },
];

function PipelineView() {
  const [active, setActive] = useState<string>("contact");
  const activeStage = PIPE_STAGES.find(s => s.id === active);
  return (
    <div style={{ padding: "24px 28px 80px", color: "#f1f5f9" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 9.5, color: "#6366f1", fontWeight: 700, letterSpacing: 1.3, marginBottom: 8, display: "inline-block", background: "#6366f110", border: "1px solid #6366f125", borderRadius: 5, padding: "3px 12px" }}>
          ✦ V3 · PIPELINE FLOW · EL VIAJE DE UN LEAD
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 5px", letterSpacing: -0.4, color: "#f1f5f9" }}>Del Lead al Cliente</h1>
            <p style={{ color: "#475569", fontSize: 11.5, margin: 0 }}>Cada etapa muestra los agentes que se activan. Clic para ver el detalle.</p>
          </div>
          <div style={{ background: "#0a0f1e", border: "1px solid #6366f140", borderRadius: 10, padding: "8px 16px", textAlign: "right" }}>
            <div style={{ fontSize: 9, color: "#818cf8", fontWeight: 700 }}>ORQUESTADOR IA</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>coordina todas las etapas</div>
            <div style={{ fontSize: 9, color: "#334155" }}>cron 15 min · GitHub Actions</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 0, marginBottom: 28, background: "#04090f", border: "1px solid #0f172a", borderRadius: 14, overflow: "hidden" }}>
        {PIPE_STAGES.map((stage, i) => {
          const isActive = active === stage.id;
          return (
            <div key={stage.id} onClick={() => setActive(stage.id)} style={{
              flex: 1, padding: "12px 8px", textAlign: "center", cursor: "pointer", position: "relative",
              background: isActive ? `${stage.color}12` : "transparent",
              borderRight: i < PIPE_STAGES.length - 1 ? "1px solid #0f172a" : "none",
              borderBottom: isActive ? `2px solid ${stage.color}` : "2px solid transparent",
              transition: "all 0.18s",
            }}>
              <div style={{ fontSize: 18, marginBottom: 3 }}>{stage.icon}</div>
              <div style={{ fontSize: 8, fontWeight: 800, color: isActive ? stage.color : "#334155", letterSpacing: 0.5 }}>{stage.step}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: isActive ? "#e2e8f0" : "#475569", marginTop: 1 }}>{stage.label}</div>
              {i < PIPE_STAGES.length - 1 && (
                <div style={{ position: "absolute", right: -8, top: "50%", transform: "translateY(-50%)", color: "#1e293b", fontSize: 14, zIndex: 2 }}>›</div>
              )}
            </div>
          );
        })}
      </div>

      {activeStage && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: 16 }}>
          <div style={{ background: "#04090f", border: `1px solid ${activeStage.color}30`, borderRadius: 14, padding: "20px 18px" }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{activeStage.icon}</div>
            <div style={{ fontSize: 9, color: activeStage.color, fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>ETAPA {activeStage.step}</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#e2e8f0", marginBottom: 8 }}>{activeStage.label}</div>
            <div style={{ fontSize: 11.5, color: "#64748b", lineHeight: 1.6, marginBottom: 16 }}>{activeStage.desc}</div>
            <div style={{ background: `${activeStage.color}0a`, border: `1px solid ${activeStage.color}20`, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 8.5, color: activeStage.color, fontWeight: 700, marginBottom: 5 }}>OUTPUT</div>
              <div style={{ fontSize: 10.5, color: "#94a3b8", lineHeight: 1.5 }}>{activeStage.output}</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {activeStage.agents.map((ag, i) => (
              <div key={i} style={{ background: "#04090f", border: `1px solid ${activeStage.color}25`, borderRadius: 14, padding: "18px 20px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${activeStage.color}80, ${activeStage.color}20)` }} />
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 22 }}>{ag.kind}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#e2e8f0" }}>{ag.name}</div>
                    <div style={{ fontSize: 9, color: "#475569" }}>{ag.tool}</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.65 }}>{ag.role}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "#04090f", border: "1px solid #0f172a", borderRadius: 14, padding: "20px 18px" }}>
            <div style={{ fontSize: 9.5, color: "#334155", fontWeight: 700, marginBottom: 14 }}>FLUJO COMPLETO</div>
            {PIPE_STAGES.map((s) => (
              <div key={s.id} onClick={() => setActive(s.id)} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "6px 8px", borderRadius: 7, cursor: "pointer",
                background: s.id === active ? `${s.color}15` : "transparent",
                marginBottom: 2, transition: "background 0.15s",
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%",
                  background: s.id === active ? s.color : "#0f172a",
                  border: `1px solid ${s.id === active ? s.color : "#1e293b"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 800, color: s.id === active ? "#fff" : "#334155", flexShrink: 0,
                }}>{s.step}</div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: s.id === active ? s.color : "#475569" }}>{s.label}</div>
                  <div style={{ fontSize: 8.5, color: "#334155" }}>{s.agents.length} agente{s.agents.length > 1 ? "s" : ""}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── V4 · AGENT ROSTER ────────────────────────────────────────────────────────

type RosterKind = "ai" | "hybrid" | "human";
type RosterStatus = "done" | "hermes" | "pending";
type SortKey = "name" | "dept" | "status" | "layer";

interface RosterAgent {
  id: string; name: string; role: string;
  dept: "tech" | "ventas" | "mkt" | "cs" | "ops" | "ceo";
  kind: RosterKind; status?: RosterStatus; tools: string[];
  layer: string; reports_to: string;
}

const ROSTER_AGENTS: RosterAgent[] = [
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

const ROSTER_DEPT_META: Record<string, { label: string; color: string; icon: string }> = {
  ceo:    { label: "Dirección", color: "#6366f1", icon: "🏢" },
  tech:   { label: "Técnico",   color: "#0ea5e9", icon: "⚙️" },
  ventas: { label: "Ventas",    color: "#22c55e", icon: "📈" },
  mkt:    { label: "Marketing", color: "#a855f7", icon: "📣" },
  cs:     { label: "CS",        color: "#f59e0b", icon: "🤝" },
  ops:    { label: "Ops",       color: "#ef4444", icon: "📊" },
};
const ROSTER_KIND_META: Record<RosterKind, { label: string; bg: string }> = {
  ai:     { label: "🤖 Agente IA", bg: "#4f46e5" },
  hybrid: { label: "⚡ Híbrido",   bg: "#b45309" },
  human:  { label: "👤 Humano",    bg: "#334155" },
};
const ROSTER_STATUS_META: Record<RosterStatus, { icon: string; color: string }> = {
  done:    { icon: "✅", color: "#22c55e" },
  hermes:  { icon: "⚠️", color: "#f59e0b" },
  pending: { icon: "🔲", color: "#475569" },
};

function RosterView() {
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [kindFilter, setKindFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortKey>("dept");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = ROSTER_AGENTS.filter(a => {
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
    <div style={{ minHeight: 600, background: "#030712", color: "#f1f5f9", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "16px 20px 12px", background: "#04090f", borderBottom: "1px solid #0f172a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 9.5, color: "#6366f1", fontWeight: 700, letterSpacing: 1.3, marginBottom: 2 }}>✦ V4 · ROSTER DE AGENTES · QUIÉN HACE QUÉ</div>
            <h1 style={{ fontSize: 20, fontWeight: 900, margin: 0, letterSpacing: -0.3 }}>Todos los agentes · {filtered.length}/{ROSTER_AGENTS.length}</h1>
          </div>
          <div style={{ marginLeft: "auto", position: "relative" }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#334155", fontSize: 12 }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar agente..."
              style={{ background: "#0a0f1e", border: "1px solid #1e293b", borderRadius: 8, padding: "7px 12px 7px 30px", color: "#e2e8f0", fontSize: 11.5, outline: "none", width: 180 }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 9.5, color: "#334155", fontWeight: 600 }}>Ordenar:</span>
            {(["dept", "name", "status", "layer"] as SortKey[]).map(k => (
              <button key={k} onClick={() => setSortBy(k)} style={{
                background: sortBy === k ? "#1e293b" : "transparent",
                border: `1px solid ${sortBy === k ? "#334155" : "#1e293b"}`,
                color: sortBy === k ? "#e2e8f0" : "#475569",
                borderRadius: 5, padding: "4px 9px", fontSize: 9.5, cursor: "pointer", fontWeight: 600,
              }}>
                {k === "dept" ? "Dpto" : k === "name" ? "Nombre" : k === "status" ? "Estado" : "Capa"}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 4 }}>
            {["all", ...Object.keys(ROSTER_DEPT_META)].map(d => {
              const meta = d !== "all" ? ROSTER_DEPT_META[d] : null;
              return (
                <button key={d} onClick={() => setDeptFilter(d)} style={{
                  background: deptFilter === d ? ((meta?.color ?? "#1e293b") + "20") : "transparent",
                  border: `1px solid ${deptFilter === d ? (meta?.color ?? "#334155") + "60" : "#1e293b"}`,
                  color: deptFilter === d ? (meta?.color ?? "#e2e8f0") : "#334155",
                  borderRadius: 5, padding: "4px 9px", fontSize: 9.5, cursor: "pointer", fontWeight: 600,
                }}>
                  {meta ? `${meta.icon} ${meta.label}` : "Todos los dptos"}
                </button>
              );
            })}
          </div>
          <div style={{ width: 1, background: "#1e293b", margin: "0 2px" }} />
          {(["all", "ai", "hybrid", "human"] as const).map(k => (
            <button key={k} onClick={() => setKindFilter(k)} style={{
              background: kindFilter === k ? "#1e293b" : "transparent",
              border: `1px solid ${kindFilter === k ? "#334155" : "#1e293b"}`,
              color: kindFilter === k ? "#e2e8f0" : "#334155",
              borderRadius: 5, padding: "4px 9px", fontSize: 9.5, cursor: "pointer", fontWeight: 600,
            }}>
              {k === "all" ? "Todos los tipos" : ROSTER_KIND_META[k as RosterKind].label}
            </button>
          ))}
          <div style={{ width: 1, background: "#1e293b", margin: "0 2px" }} />
          {(["all", "done", "hermes", "pending"] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              background: statusFilter === s ? "#1e293b" : "transparent",
              border: `1px solid ${statusFilter === s ? "#334155" : "#1e293b"}`,
              color: statusFilter === s ? "#e2e8f0" : "#334155",
              borderRadius: 5, padding: "4px 9px", fontSize: 9.5, cursor: "pointer", fontWeight: 600,
            }}>
              {s === "all" ? "Todos los estados" : s === "done" ? "✅ Activos" : s === "hermes" ? "⚠️ Hermes" : "🔲 Pendientes"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, padding: "16px 20px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, alignContent: "start" }}>
        {filtered.map(agent => {
          const dept = ROSTER_DEPT_META[agent.dept];
          const kind = ROSTER_KIND_META[agent.kind];
          return (
            <div key={agent.id} style={{
              background: "#04090f", border: `1px solid ${dept.color}22`,
              borderRadius: 11, padding: "12px 13px",
              position: "relative", overflow: "hidden", transition: "border-color 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = dept.color + "55")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = dept.color + "22")}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${dept.color}80, transparent)` }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 8, fontWeight: 700, color: dept.color, background: `${dept.color}15`, padding: "1.5px 6px", borderRadius: 20 }}>
                  {dept.icon} {dept.label}
                </span>
                <span style={{ fontSize: 12 }}>{agent.status ? ROSTER_STATUS_META[agent.status].icon : ""}</span>
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: "#e2e8f0", marginBottom: 2, lineHeight: 1.2 }}>{agent.name}</div>
              <div style={{ fontSize: 9.5, color: "#475569", marginBottom: 9, lineHeight: 1.4 }}>{agent.role}</div>
              <div style={{ fontSize: 8, fontWeight: 700, background: kind.bg + "25", color: kind.bg, display: "inline-block", padding: "1.5px 7px", borderRadius: 20, marginBottom: 7 }}>
                {kind.label}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {agent.tools.slice(0, 3).map(t => (
                  <span key={t} style={{ fontSize: 7.5, padding: "1px 5px", background: `${dept.color}0c`, border: `1px solid ${dept.color}20`, color: "#475569", borderRadius: 4, fontWeight: 600 }}>{t}</span>
                ))}
              </div>
              <div style={{ marginTop: 8, fontSize: 8.5, color: "#334155" }}>
                <span style={{ color: "#1e293b" }}>→ </span>{agent.reports_to}
                <span style={{ float: "right", color: "#1e293b", fontSize: 7.5 }}>{agent.layer}</span>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", paddingTop: 60, color: "#334155" }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>🤷</div>
            <div style={{ fontSize: 13 }}>Ningún agente con esos filtros</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────

export default function OrganigramaClientum() {
  const [activeTab, setActiveTab] = useState<OrgTab>("tree");

  return (
    <div style={{
      background: "linear-gradient(160deg, #040c18 0%, #06091a 40%, #040e08 100%)",
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      borderRadius: 20,
      overflow: "hidden",
    }}>
      {/* Tab bar */}
      <div style={{
        display: "flex", borderBottom: "1px solid #1e293b",
        background: "#04090f", overflowX: "auto",
      }}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: "none",
                padding: "12px 20px",
                background: isActive ? "#0f172a" : "transparent",
                border: "none",
                borderBottom: isActive ? "2px solid #6366f1" : "2px solid transparent",
                color: isActive ? "#e2e8f0" : "#475569",
                cursor: "pointer",
                fontSize: 12.5,
                fontWeight: isActive ? 700 : 500,
                whiteSpace: "nowrap",
                transition: "all 0.15s",
                fontFamily: "inherit",
              }}
              title={tab.desc}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ overflowX: "auto" }}>
        {activeTab === "tree"     && <TreeView />}
        {activeTab === "radial"   && <RadialView />}
        {activeTab === "lanes"    && <LanesView />}
        {activeTab === "pipeline" && <PipelineView />}
        {activeTab === "roster"   && <RosterView />}
      </div>
    </div>
  );
}
