/**
 * V3 · Pipeline Flow — Lead Journey View
 * Concept: show the org through the lens of "how a sale happens."
 * Every agent is mapped to the stage where it fires, not to a reporting line.
 * Interaction model: click any stage to expand the agents active at that moment.
 * IA: tells the story of work as it flows through the company, not the authority tree.
 */
import React, { useState } from "react";

const STAGES = [
  {
    id: "discover",
    step: "01",
    label: "Descubrir",
    icon: "🔍",
    color: "#0ea5e9",
    desc: "Identificar PyMEs en la región con alto fit score.",
    agents: [
      { name: "Explorador Patagónico", role: "Scraping en Google Maps + Apify. Calcula fit score y filtra los mejores leads.", kind: "🤖", tool: "Maps · Apify · Gemini" },
    ],
    output: "Lista de leads calificados con fit score > 7",
  },
  {
    id: "enrich",
    step: "02",
    label: "Enriquecer",
    icon: "🧬",
    color: "#6366f1",
    desc: "Resolver el contacto correcto y generar el brochure.",
    agents: [
      { name: "IA & Automatización", role: "Enriquece el contacto vía Hunter.io, genera brochure personalizado con Gemini.", kind: "🤖", tool: "Hunter · Gemini · Apify" },
    ],
    output: "Lead con email, cargo, brochure HTML y gancho personalizado",
  },
  {
    id: "contact",
    step: "03",
    label: "Contactar",
    icon: "💬",
    color: "#22c55e",
    desc: "Primer contacto WhatsApp y clasificación de respuesta.",
    agents: [
      { name: "Santi SDR", role: "Envía mensaje personalizado con el gancho del brochure. Máximo 15 leads/día. Clasifica: caliente · tibio · frío.", kind: "🤖", tool: "Hermes Agent · WhatsApp" },
    ],
    output: "Lead clasificado: caliente / tibio / frío / agendado",
  },
  {
    id: "qualify",
    step: "04",
    label: "Calificar",
    icon: "🎯",
    color: "#f59e0b",
    desc: "Scoring MEDDIC y decisión de escalar a cierre.",
    agents: [
      { name: "Agente de Ventas", role: "Revisa el pipeline cada 15 min. Decide si el lead califica para reunión con Jonathan según MEDDIC.", kind: "🤖", tool: "CRM Kanban · MEDDIC" },
      { name: "IA & Automatización", role: "Corre scoring MEDDIC automático sobre el lead y lo actualiza en el CRM.", kind: "🤖", tool: "Gemini · CRM API" },
    ],
    output: "MEDDIC score + decisión: agendar reunión o continuar nurturing",
  },
  {
    id: "close",
    step: "05",
    label: "Cerrar",
    icon: "🤝",
    color: "#a855f7",
    desc: "Reunión y firma con el humano en el loop.",
    agents: [
      { name: "Jonathan (Closer)", role: "Toma la reunión agendada. Único autorizado a negociar precio y condiciones. Cierra el contrato.", kind: "👤", tool: "Zoom · WhatsApp personal" },
    ],
    output: "Contrato firmado → cliente activo",
  },
  {
    id: "retain",
    step: "06",
    label: "Retener",
    icon: "💚",
    color: "#06b6d4",
    desc: "Onboarding, salud de cuenta y churn prevention.",
    agents: [
      { name: "Agente Customer Success", role: "Onboarding del cliente nuevo. Monitorea salud de cuenta. Detecta señales de churn antes de que ocurran.", kind: "🤖", tool: "CRM · WhatsApp · Gemini" },
      { name: "Asesor Comercial IA", role: "Chatbot inbound para consultas post-venta. Captura upsells y los pasa a Ventas.", kind: "🤖", tool: "Chatbot widget · CRM webhook" },
    ],
    output: "Cliente retenido, expansión de cuenta detectada",
  },
  {
    id: "report",
    step: "07",
    label: "Reportar",
    icon: "📊",
    color: "#ef4444",
    desc: "Métricas, alertas y reporte ejecutivo semanal.",
    agents: [
      { name: "Agente de Operaciones", role: "Consolida MRR, leads, conversión y churn. Alerta anomalías al Orquestador sin esperar el reporte semanal.", kind: "🤖", tool: "Neon DB · Gemini" },
      { name: "Finanzas & Admin", role: "Reporte ejecutivo semanal: facturación AFIP + MercadoPago + pipeline revenue.", kind: "⚡", tool: "CRM Dashboard · Neon DB" },
    ],
    output: "Dashboard semanal + alertas en tiempo real",
  },
];

export default function OrgVariantPipeline() {
  const [active, setActive] = useState<string | null>("contact");

  const activeStage = STAGES.find(s => s.id === active);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#030712",
      fontFamily: "'Inter', system-ui, sans-serif",
      color: "#f1f5f9",
      padding: "24px 28px 80px",
    }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          fontSize: 9.5, color: "#6366f1", fontWeight: 700, letterSpacing: 1.3, marginBottom: 8,
          display: "inline-block",
          background: "#6366f110", border: "1px solid #6366f125",
          borderRadius: 5, padding: "3px 12px",
        }}>✦ V3 · PIPELINE FLOW · EL VIAJE DE UN LEAD</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 5px", letterSpacing: -0.4 }}>
              Del Lead al Cliente
            </h1>
            <p style={{ color: "#475569", fontSize: 11.5, margin: 0 }}>
              Cada etapa muestra los agentes que se activan. Clic para ver el detalle.
            </p>
          </div>
          <div style={{
            background: "#0a0f1e", border: "1px solid #6366f140",
            borderRadius: 10, padding: "8px 16px", textAlign: "right",
          }}>
            <div style={{ fontSize: 9, color: "#818cf8", fontWeight: 700 }}>ORQUESTADOR IA</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>coordina todas las etapas</div>
            <div style={{ fontSize: 9, color: "#334155" }}>cron 15 min · GitHub Actions</div>
          </div>
        </div>
      </div>

      {/* Stage ribbon */}
      <div style={{
        display: "flex", gap: 0, marginBottom: 28,
        background: "#04090f", border: "1px solid #0f172a",
        borderRadius: 14, overflow: "hidden",
      }}>
        {STAGES.map((stage, i) => {
          const isActive = active === stage.id;
          return (
            <div key={stage.id}
              onClick={() => setActive(stage.id)}
              style={{
                flex: 1, padding: "12px 8px", textAlign: "center",
                cursor: "pointer", position: "relative",
                background: isActive ? `${stage.color}12` : "transparent",
                borderRight: i < STAGES.length - 1 ? "1px solid #0f172a" : "none",
                borderBottom: isActive ? `2px solid ${stage.color}` : "2px solid transparent",
                transition: "all 0.18s",
              }}>
              <div style={{ fontSize: 18, marginBottom: 3 }}>{stage.icon}</div>
              <div style={{
                fontSize: 8, fontWeight: 800,
                color: isActive ? stage.color : "#334155",
                letterSpacing: 0.5,
              }}>
                {stage.step}
              </div>
              <div style={{
                fontSize: 10, fontWeight: 700,
                color: isActive ? "#e2e8f0" : "#475569",
                marginTop: 1,
              }}>
                {stage.label}
              </div>
              {i < STAGES.length - 1 && (
                <div style={{
                  position: "absolute", right: -8, top: "50%",
                  transform: "translateY(-50%)",
                  color: "#1e293b", fontSize: 14, zIndex: 2,
                }}>›</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detail area */}
      {activeStage && (
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: 16,
          animation: "none",
        }}>
          {/* Stage info */}
          <div style={{
            background: "#04090f", border: `1px solid ${activeStage.color}30`,
            borderRadius: 14, padding: "20px 18px",
          }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{activeStage.icon}</div>
            <div style={{ fontSize: 9, color: activeStage.color, fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>
              ETAPA {activeStage.step}
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#e2e8f0", marginBottom: 8 }}>
              {activeStage.label}
            </div>
            <div style={{ fontSize: 11.5, color: "#64748b", lineHeight: 1.6, marginBottom: 16 }}>
              {activeStage.desc}
            </div>
            <div style={{
              background: `${activeStage.color}0a`,
              border: `1px solid ${activeStage.color}20`,
              borderRadius: 8, padding: "10px 12px",
            }}>
              <div style={{ fontSize: 8.5, color: activeStage.color, fontWeight: 700, marginBottom: 5 }}>OUTPUT</div>
              <div style={{ fontSize: 10.5, color: "#94a3b8", lineHeight: 1.5 }}>{activeStage.output}</div>
            </div>
          </div>

          {/* Agents at this stage */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {activeStage.agents.map((ag, i) => (
              <div key={i} style={{
                background: "#04090f",
                border: `1px solid ${activeStage.color}25`,
                borderRadius: 14, padding: "18px 20px",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 3,
                  background: `linear-gradient(90deg, ${activeStage.color}80, ${activeStage.color}20)`,
                }} />
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

          {/* Flow context */}
          <div style={{
            background: "#04090f", border: "1px solid #0f172a",
            borderRadius: 14, padding: "20px 18px",
          }}>
            <div style={{ fontSize: 9.5, color: "#334155", fontWeight: 700, marginBottom: 14 }}>FLUJO COMPLETO</div>
            {STAGES.map((s, i) => (
              <div key={s.id}
                onClick={() => setActive(s.id)}
                style={{
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
                  fontSize: 9, fontWeight: 800, color: s.id === active ? "#fff" : "#334155",
                  flexShrink: 0,
                }}>
                  {s.step}
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: s.id === active ? s.color : "#475569" }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: 8.5, color: "#334155" }}>
                    {s.agents.length} agente{s.agents.length > 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
