/**
 * V1 · Hub Radial — Concentric rings layout
 * Concept: power flows from the center outward. Jonathan → Orquestador → Depts → Leaf agents.
 * Interaction model: click any ring node to expand its detail panel inline.
 * IA: the visual hierarchy IS the authority hierarchy — closer to center = more strategic.
 */
import React, { useState } from "react";

const DEPTS = [
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

export default function OrgVariantRadial() {
  const [active, setActive] = useState<string | null>(null);
  const activeDept = DEPTS.find(d => d.id === active);

  // Radial positions for 5 dept nodes (pentagon)
  const R = 200; // ring radius
  const cx = 420, cy = 370;
  const deptPositions = DEPTS.map((_, i) => {
    const angle = (i / DEPTS.length) * 2 * Math.PI - Math.PI / 2;
    return { x: cx + R * Math.cos(angle), y: cy + R * Math.sin(angle) };
  });

  // Leaf positions per dept
  function leafPositions(deptIdx: number, count: number) {
    const base = (deptIdx / DEPTS.length) * 2 * Math.PI - Math.PI / 2;
    const dp = deptPositions[deptIdx];
    const spread = 0.45;
    return Array.from({ length: count }, (_, i) => {
      const frac = count === 1 ? 0.5 : i / (count - 1);
      const angle = base + (frac - 0.5) * spread;
      return {
        x: dp.x + 112 * Math.cos(angle),
        y: dp.y + 112 * Math.sin(angle),
      };
    });
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #030712 0%, #0a0f1e 50%, #030a05 100%)",
      fontFamily: "'Inter', system-ui, sans-serif",
      padding: "28px 24px 80px",
      color: "#f1f5f9",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{
          display: "inline-block",
          background: "#6366f110", border: "1px solid #6366f130",
          borderRadius: 6, padding: "3px 14px", marginBottom: 10,
          fontSize: 9.5, color: "#818cf8", fontWeight: 700, letterSpacing: 1.4,
        }}>✦ V1 · HUB RADIAL · AUTORIDAD POR DISTANCIA AL CENTRO</div>
        <h1 style={{ fontSize: 26, fontWeight: 900, margin: "0 0 6px", letterSpacing: -0.5 }}>
          Organigrama Radial
        </h1>
        <p style={{ color: "#475569", fontSize: 11.5, margin: 0 }}>
          Más cerca del centro = más estratégico. Clic en un dept para ver sus agentes.
        </p>
      </div>

      <div style={{ display: "flex", gap: 32, alignItems: "flex-start", justifyContent: "center" }}>
        {/* SVG ring diagram */}
        <svg width={840} height={740} style={{ flexShrink: 0, overflow: "visible" }}>
          <defs>
            {DEPTS.map(d => (
              <radialGradient key={d.id} id={`grd-${d.id}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={d.color} stopOpacity="0.25" />
                <stop offset="100%" stopColor={d.color} stopOpacity="0.05" />
              </radialGradient>
            ))}
            <radialGradient id="grd-ceo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.08" />
            </radialGradient>
          </defs>

          {/* Outer ring guide */}
          <circle cx={cx} cy={cy} r={R + 112} stroke="#1e293b" strokeWidth="1" fill="none" strokeDasharray="4 6" />
          {/* Middle ring guide */}
          <circle cx={cx} cy={cy} r={R} stroke="#1e293b" strokeWidth="1" fill="none" strokeDasharray="4 6" />
          {/* Inner ring guide */}
          <circle cx={cx} cy={cy} r={75} stroke="#6366f122" strokeWidth="1.5" fill="none" />

          {/* Dept → Center spokes */}
          {deptPositions.map((dp, i) => {
            const d = DEPTS[i];
            return (
              <line key={d.id}
                x1={cx} y1={cy} x2={dp.x} y2={dp.y}
                stroke={active === d.id ? d.color : "#1e293b"}
                strokeWidth={active === d.id ? 1.5 : 1}
                strokeDasharray={active === d.id ? "" : "3 5"}
                style={{ transition: "all 0.2s" }}
              />
            );
          })}

          {/* Leaf → Dept spokes */}
          {DEPTS.map((dept, di) => {
            const leaves = leafPositions(di, dept.agents.length);
            return dept.agents.map((ag, ai) => (
              <line key={ag.id}
                x1={deptPositions[di].x} y1={deptPositions[di].y}
                x2={leaves[ai].x} y2={leaves[ai].y}
                stroke={active === dept.id ? `${dept.color}60` : "#1e293b50"}
                strokeWidth="1"
                style={{ transition: "all 0.2s" }}
              />
            ));
          })}

          {/* Leaf agent nodes */}
          {DEPTS.map((dept, di) => {
            const leaves = leafPositions(di, dept.agents.length);
            return dept.agents.map((ag, ai) => {
              const lx = leaves[ai].x, ly = leaves[ai].y;
              const show = active === dept.id;
              return (
                <g key={ag.id} style={{ opacity: show ? 1 : 0.3, transition: "opacity 0.25s" }}>
                  <circle cx={lx} cy={ly} r={34}
                    fill={show ? `${dept.color}18` : "#0f172a"}
                    stroke={show ? dept.color : "#1e293b"}
                    strokeWidth="1"
                  />
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

          {/* Dept ring nodes */}
          {DEPTS.map((dept, i) => {
            const dp = deptPositions[i];
            const isActive = active === dept.id;
            return (
              <g key={dept.id} style={{ cursor: "pointer" }}
                onClick={() => setActive(isActive ? null : dept.id)}>
                <circle cx={dp.x} cy={dp.y} r={50}
                  fill={isActive ? `url(#grd-${dept.id})` : "#0f172a88"}
                  stroke={dept.color}
                  strokeWidth={isActive ? 2 : 1.5}
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

          {/* Orquestador ring */}
          <circle cx={cx} cy={cy} r={75} fill="url(#grd-ceo)" stroke="#6366f1" strokeWidth="1.5"
            style={{ filter: "drop-shadow(0 0 16px #6366f166)" }} />
          <text x={cx} y={cy - 22} textAnchor="middle" fontSize="9" fill="#818cf8" fontWeight="700" letterSpacing="1">🤖 AGENTE IA</text>
          <text x={cx} y={cy - 5} textAnchor="middle" fontSize="15" fill="#a5b4fc" fontWeight="900">Orquestador</text>
          <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fill="#6366f1" fontWeight="600">Chief of Staff AI</text>
          <text x={cx} y={cy + 26} textAnchor="middle" fontSize="8" fill="#475569">Cron 15 min · Gemini</text>

          {/* CEO — outermost ring top anchor */}
          <g>
            <rect x={cx - 70} y={16} width={140} height={56} rx={10}
              fill="#0a0f1e" stroke="#6366f140" strokeWidth="1.5"
              style={{ filter: "drop-shadow(0 2px 8px #6366f133)" }} />
            <text x={cx} y={34} textAnchor="middle" fontSize="9" fill="#818cf8" fontWeight="700">👤 HUMANO</text>
            <text x={cx} y={50} textAnchor="middle" fontSize="14" fill="#e2e8f0" fontWeight="900">Jonathan</text>
            <text x={cx} y={64} textAnchor="middle" fontSize="8.5" fill="#475569">CEO & Fundador</text>
            {/* connector to orq */}
            <line x1={cx} y1={72} x2={cx} y2={cy - 75} stroke="#6366f150" strokeWidth="1.5" strokeDasharray="4 4" />
          </g>
        </svg>

        {/* Detail panel */}
        <div style={{
          width: 260, minHeight: 300,
          background: "#0a0f1e",
          border: `1px solid ${activeDept ? activeDept.color + "40" : "#1e293b"}`,
          borderRadius: 14, padding: "20px 18px",
          transition: "border-color 0.2s",
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
                    background: `${activeDept.color}08`,
                    border: `1px solid ${activeDept.color}20`,
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

      {/* Bottom arch strip */}
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
            borderRadius: 6, padding: "4px 10px",
            fontSize: 9.5, color: "#64748b",
          }}>
            <span>{l.icon}</span>
            <span style={{ color: l.color, fontWeight: 600 }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
