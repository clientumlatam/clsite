/**
 * AgentOSDashboard — Centro de Control del Sales OS
 * Muestra en tiempo real: estado del sistema, pipeline, cola de tareas, costos, logs.
 * Fuente de datos: /api/orchestrator/status + /api/pipeline/funnel + /api/agent/tasks
 */
import React, { useState, useEffect, useCallback } from "react";
import {
  Activity, AlertCircle, CheckCircle2, Clock, Cpu, DollarSign,
  Loader2, RefreshCw, TrendingUp, Zap, ChevronRight, Play,
  BarChart3, Target, Users, Mail, MessageSquare, Building2,
  XCircle, RotateCcw, ArrowRight, Layers,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

interface SystemStatus {
  active_tasks: number;
  pending_tasks: number;
  failed_tasks_24h: number;
  completed_tasks_24h: number;
  agents_running: string[];
  total_cost_usd_24h: number;
  total_tokens_24h: number;
  api_usage: Array<{ api_name: string; calls: number; cost_usd: number }>;
  recent_logs: Array<{ id: string; agent_name: string; action: string; detail: string; created_at: string }>;
}

interface Funnel {
  companies: number;
  leads_enriched: number;
  proposals_sent: number;
  campaigns_active: number;
  emails_sent: number;
  replies: number;
}

interface AgentTask {
  id: string;
  type: string;
  agent_name: string;
  status: string;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  retries: number;
  created_at: string;
  started_at?: string;
  finished_at?: string;
  duration_ms?: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const AGENT_LABELS: Record<string, string> = {
  orchestrator: "Orquestador",
  prospector: "Prospector",
  enricher: "Enriquecedor",
  web_analyst: "Analista Web",
  strategist: "Estratega",
  proposal_generator: "Generador de Propuestas",
  copywriter: "Copywriter",
  campaign_runner: "Campañas",
  follow_up: "Seguimiento",
  conversation: "Conversaciones",
  scoring: "Scoring",
  observability: "Observabilidad",
};

const STATUS_COLOR: Record<string, string> = {
  running: "text-sky-400 bg-sky-400/10 border-sky-400/30",
  pending: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  completed: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  failed: "text-rose-400 bg-rose-400/10 border-rose-400/30",
  retrying: "text-orange-400 bg-orange-400/10 border-orange-400/30",
  cancelled: "text-slate-400 bg-slate-400/10 border-slate-400/30",
};

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "ahora";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

function fmtCost(n: number) {
  if (n < 0.01) return "< $0.01";
  return `$${n.toFixed(3)}`;
}

function fmtTokens(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return `${n}`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, icon, border = "border-[#1E293B]", accent = "text-white",
}: {
  label: string; value: string | number; sub?: string;
  icon: React.ReactNode; border?: string; accent?: string;
}) {
  return (
    <div className={`bg-[#0A101F]/70 border ${border} rounded-xl p-4`}>
      <div className="flex items-center justify-between mb-2">
        {icon}
        <span className={`text-2xl font-black ${accent}`}>{value}</span>
      </div>
      <p className="text-xs text-slate-400">{label}</p>
      {sub && <p className="text-[10px] text-slate-600 mt-0.5">{sub}</p>}
    </div>
  );
}

function FunnelStep({
  label, value, icon, prev, accent,
}: {
  label: string; value: number; icon: React.ReactNode; prev?: number; accent: string;
}) {
  const pct = prev && prev > 0 ? Math.round((value / prev) * 100) : null;
  return (
    <div className="flex-1 min-w-0">
      <div className={`bg-[#0A101F]/70 border border-[#1E293B] rounded-xl p-4 flex flex-col items-center text-center gap-2`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${accent}`}>{icon}</div>
        <div className="text-2xl font-black text-white">{value.toLocaleString()}</div>
        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{label}</div>
        {pct !== null && (
          <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${pct > 0 ? "text-emerald-400 bg-emerald-400/10" : "text-slate-500"}`}>
            {pct}% conv.
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AgentOSDashboard() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [funnel, setFunnel] = useState<Funnel | null>(null);
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [runObjective, setRunObjective] = useState("");
  const [runningOrch, setRunningOrch] = useState(false);
  const [orchResult, setOrchResult] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [sRes, fRes, tRes] = await Promise.all([
        fetch("/api/orchestrator/status"),
        fetch("/api/pipeline/funnel"),
        fetch("/api/agent/tasks?limit=15"),
      ]);
      if (!sRes.ok || !fRes.ok || !tRes.ok) throw new Error("Error cargando datos del OS");
      const [s, f, t] = await Promise.all([sRes.json(), fRes.json(), tRes.json()]);
      setStatus(s as SystemStatus);
      setFunnel(f as Funnel);
      setTasks((t.tasks ?? []) as AgentTask[]);
      setLastRefresh(new Date());
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!autoRefresh) return;
    const iv = setInterval(load, 15_000);
    return () => clearInterval(iv);
  }, [autoRefresh, load]);

  const dispatchObjective = async () => {
    if (!runObjective.trim()) return;
    setRunningOrch(true);
    setOrchResult(null);
    try {
      const res = await fetch("/api/orchestrator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: runObjective, history: [] }),
      });
      const data = await res.json() as { reply?: string; error?: string };
      setOrchResult(data.reply ?? data.error ?? "Objetivo enviado al Orquestador");
      setRunObjective("");
      setTimeout(load, 2000);
    } catch (err: unknown) {
      setOrchResult(err instanceof Error ? err.message : "Error enviando objetivo");
    } finally {
      setRunningOrch(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-24 text-slate-500">
      <Loader2 className="w-6 h-6 animate-spin mr-2" /> Cargando Sales OS...
    </div>
  );

  if (error) return (
    <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm m-6">
      <AlertCircle className="w-5 h-5 flex-shrink-0" />
      <span>{error}</span>
      <button onClick={load} className="ml-auto text-xs underline">Reintentar</button>
    </div>
  );

  const s = status!;
  const f = funnel!;

  return (
    <div className="space-y-6 text-slate-200 p-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 bg-[#10B981]/15 border border-[#10B981]/30 rounded-xl flex items-center justify-center">
              <Cpu className="w-5 h-5 text-[#10B981]" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Sales OS — Centro de Control</h1>
              <p className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">
                Clientum AI Sales Operating System
              </p>
            </div>
          </div>
          {lastRefresh && (
            <p className="text-xs text-slate-600 mt-1">
              Última actualización: {lastRefresh.toLocaleTimeString("es-AR")}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRefresh(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              autoRefresh
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "border-[#1E293B] text-slate-500 hover:text-slate-200"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            {autoRefresh ? "Live" : "Paused"}
          </button>
          <button onClick={load}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#1E293B] text-slate-400 rounded-lg text-xs hover:text-slate-200 transition-all">
            <RefreshCw className="w-3.5 h-3.5" /> Actualizar
          </button>
        </div>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Tareas activas"
          value={s.active_tasks}
          icon={<Loader2 className={`w-5 h-5 text-sky-400 ${s.active_tasks > 0 ? "animate-spin" : ""}`} />}
          border="border-sky-500/30"
          accent="text-sky-400"
        />
        <StatCard
          label="Pendientes"
          value={s.pending_tasks}
          icon={<Clock className="w-5 h-5 text-amber-400" />}
          border="border-amber-500/30"
          accent="text-amber-400"
        />
        <StatCard
          label="Completadas (24h)"
          value={s.completed_tasks_24h}
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          border="border-emerald-500/30"
          accent="text-emerald-400"
        />
        <StatCard
          label="Errores (24h)"
          value={s.failed_tasks_24h}
          icon={<XCircle className="w-5 h-5 text-rose-400" />}
          border={s.failed_tasks_24h > 0 ? "border-rose-500/40" : "border-[#1E293B]"}
          accent={s.failed_tasks_24h > 0 ? "text-rose-400" : "text-white"}
        />
      </div>

      {/* Agents Running */}
      {s.agents_running.length > 0 && (
        <div className="bg-sky-500/5 border border-sky-500/20 rounded-xl p-4">
          <p className="text-xs text-sky-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 animate-pulse" /> Agentes ejecutándose ahora
          </p>
          <div className="flex flex-wrap gap-2">
            {s.agents_running.map(a => (
              <span key={a} className="inline-flex items-center gap-1 px-3 py-1 bg-sky-400/10 border border-sky-400/30 text-sky-300 text-xs font-semibold rounded-full">
                <Cpu className="w-3 h-3" /> {AGENT_LABELS[a] ?? a}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Dispatch Objective */}
      <div className="bg-[#0A101F]/70 border border-[#1E293B] rounded-xl p-5">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Play className="w-3.5 h-3.5 text-[#10B981]" /> Enviar objetivo al Orquestador
        </p>
        <div className="flex gap-3">
          <input
            value={runObjective}
            onChange={e => setRunObjective(e.target.value)}
            onKeyDown={e => e.key === "Enter" && dispatchObjective()}
            placeholder='Ej: "Prospectar 20 distribuidoras en Neuquén y enriquecer sus contactos"'
            className="flex-1 bg-[#030712] border border-[#1E293B] rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#10B981]/40"
          />
          <button
            onClick={dispatchObjective}
            disabled={runningOrch || !runObjective.trim()}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#10B981] hover:bg-[#059669] disabled:opacity-50 text-white font-bold text-sm rounded-lg transition-all"
          >
            {runningOrch ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {runningOrch ? "Procesando…" : "Ejecutar"}
          </button>
        </div>
        {orchResult && (
          <div className="mt-3 p-3 bg-[#10B981]/5 border border-[#10B981]/20 rounded-lg text-xs text-slate-300 leading-relaxed">
            {orchResult}
          </div>
        )}
      </div>

      {/* Pipeline Funnel */}
      <div className="bg-[#0A101F]/70 border border-[#1E293B] rounded-xl p-5">
        <h2 className="text-sm font-black text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#10B981]" /> Pipeline Comercial
        </h2>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <FunnelStep label="Empresas" value={f.companies} icon={<Building2 className="w-5 h-5" />} accent="bg-orange-400/15 text-orange-400" />
          <ArrowRight className="w-4 h-4 text-slate-600 flex-shrink-0" />
          <FunnelStep label="Leads" value={f.leads_enriched} prev={f.companies} icon={<Users className="w-5 h-5" />} accent="bg-sky-400/15 text-sky-400" />
          <ArrowRight className="w-4 h-4 text-slate-600 flex-shrink-0" />
          <FunnelStep label="Propuestas" value={f.proposals_sent} prev={f.leads_enriched} icon={<Layers className="w-5 h-5" />} accent="bg-violet-400/15 text-violet-400" />
          <ArrowRight className="w-4 h-4 text-slate-600 flex-shrink-0" />
          <FunnelStep label="Campañas" value={f.campaigns_active} prev={f.proposals_sent} icon={<Target className="w-5 h-5" />} accent="bg-amber-400/15 text-amber-400" />
          <ArrowRight className="w-4 h-4 text-slate-600 flex-shrink-0" />
          <FunnelStep label="Emails enviados" value={f.emails_sent} prev={f.campaigns_active} icon={<Mail className="w-5 h-5" />} accent="bg-teal-400/15 text-teal-400" />
          <ArrowRight className="w-4 h-4 text-slate-600 flex-shrink-0" />
          <FunnelStep label="Respuestas" value={f.replies} prev={f.emails_sent} icon={<MessageSquare className="w-5 h-5" />} accent="bg-emerald-400/15 text-emerald-400" />
        </div>
      </div>

      {/* Costs + Task Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* IA Costs */}
        <div className="bg-[#0A101F]/70 border border-[#1E293B] rounded-xl p-5">
          <h2 className="text-sm font-black text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-400" /> Costos de IA (últimas 24h)
          </h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-[#030712] rounded-lg p-3 text-center">
              <div className="text-xl font-black text-amber-400">{fmtCost(s.total_cost_usd_24h)}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">USD total</div>
            </div>
            <div className="bg-[#030712] rounded-lg p-3 text-center">
              <div className="text-xl font-black text-sky-400">{fmtTokens(s.total_tokens_24h)}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">tokens</div>
            </div>
          </div>
          {s.api_usage.length > 0 ? (
            <div className="space-y-2">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Por API</p>
              {s.api_usage.map(a => (
                <div key={a.api_name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span className="text-slate-300">{a.api_name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500">
                    <span>{a.calls} llamadas</span>
                    <span className="text-amber-400 font-semibold">{fmtCost(a.cost_usd)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-600 text-center py-4">Sin uso de API en las últimas 24h</p>
          )}
        </div>

        {/* Task Queue */}
        <div className="bg-[#0A101F]/70 border border-[#1E293B] rounded-xl p-5">
          <h2 className="text-sm font-black text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-sky-400" /> Cola de Tareas (últimas 15)
          </h2>
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Clock className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-xs">No hay tareas. Enviá un objetivo al Orquestador para empezar.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
              {tasks.map(t => (
                <div key={t.id} className="flex items-start gap-3 bg-[#030712] rounded-lg p-2.5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold text-slate-200">{AGENT_LABELS[t.agent_name] ?? t.agent_name}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${STATUS_COLOR[t.status] ?? "text-slate-400"}`}>
                        {t.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">{t.type}</p>
                    {t.error && <p className="text-[10px] text-rose-400 truncate mt-0.5">⚠ {t.error}</p>}
                  </div>
                  <div className="text-[10px] text-slate-600 flex-shrink-0">{timeAgo(t.created_at)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Agent Logs */}
      {s.recent_logs.length > 0 && (
        <div className="bg-[#0A101F]/70 border border-[#1E293B] rounded-xl p-5">
          <h2 className="text-sm font-black text-white mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-violet-400" /> Historial de Decisiones (últimas 20 acciones)
          </h2>
          <div className="space-y-1.5 max-h-64 overflow-y-auto custom-scrollbar pr-1 font-mono">
            {s.recent_logs.map(l => (
              <div key={l.id} className="flex items-start gap-3 text-[11px]">
                <span className="text-slate-600 flex-shrink-0 mt-0.5">{timeAgo(l.created_at)}</span>
                <span className="text-violet-400 flex-shrink-0 font-bold w-28 truncate">[{AGENT_LABELS[l.agent_name] ?? l.agent_name}]</span>
                <span className="text-sky-400 flex-shrink-0 font-semibold">{l.action}</span>
                {l.detail && <span className="text-slate-500 truncate">{l.detail}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Architecture Overview */}
      <div className="bg-[#0A101F]/70 border border-[#1E293B] rounded-xl p-5">
        <h2 className="text-sm font-black text-white mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-400" /> Arquitectura del Sistema
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { phase: "Fase 1", label: "Cimientos", items: ["BaseAgent", "Orchestrator", "DB Schema"], done: true },
            { phase: "Fase 2", label: "Datos", items: ["Prospector", "Enriquecedor"], done: true },
            { phase: "Fase 3", label: "Inteligencia", items: ["Estratega", "Analista Web", "Propuestas", "Copywriter"], done: false },
            { phase: "Fase 4", label: "Campañas", items: ["CampaignRunner", "Seguimiento", "Conversaciones"], done: false },
          ].map(p => (
            <div key={p.phase} className={`rounded-xl p-4 border ${p.done ? "bg-emerald-500/5 border-emerald-500/20" : "bg-[#030712] border-[#1E293B]"}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-black uppercase tracking-wider ${p.done ? "text-emerald-400" : "text-slate-500"}`}>{p.phase}</span>
                {p.done && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                {!p.done && <RotateCcw className="w-3 h-3 text-slate-600" />}
              </div>
              <p className={`text-xs font-bold mb-2 ${p.done ? "text-emerald-300" : "text-slate-300"}`}>{p.label}</p>
              <div className="space-y-1">
                {p.items.map(i => (
                  <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <ChevronRight className="w-2.5 h-2.5 flex-shrink-0" />{i}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-[#10B981]/5 border border-[#10B981]/20 rounded-lg">
          <p className="text-[11px] text-[#10B981] font-semibold">Stack: Replit → GitHub → Vercel → Neon PostgreSQL</p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            APIs: Google Places · Hunter.io · Gemini · OpenRouter · Apify · Firecrawl · Gmail
          </p>
        </div>
      </div>

    </div>
  );
}
