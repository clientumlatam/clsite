// ─────────────────────────────────────────────────────────────────────────────
// Clientum AI Sales OS — Agent Registry
// ─────────────────────────────────────────────────────────────────────────────

export { BaseAgent } from "./base";
export { OrchestratorAgent, orchestratorAgent } from "./orchestrator";
export { ProspectorAgent, prospectorAgent } from "./prospector";
export type { ProspectInput, ProspectOutput } from "./prospector";
export { EnricherAgent, enricherAgent } from "./enricher";
export type { EnrichInput, EnrichOutput } from "./enricher";
export type {
  AgentName,
  AgentResult,
  AgentTask,
  AgentLog,
  OrchestratorPlan,
  SystemStatus,
  PipelineFunnel,
  Company,
  EnrichedLead,
  Proposal,
  Campaign,
  CampaignEmail,
  Conversation,
  TaskStatus,
  TaskType,
} from "./types";
