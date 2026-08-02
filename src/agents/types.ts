// ─────────────────────────────────────────────────────────────────────────────
// Clientum AI Sales OS — Agent Types
// ─────────────────────────────────────────────────────────────────────────────

export type AgentName =
  | "orchestrator"
  | "strategist"
  | "prospector"
  | "enricher"
  | "web_analyst"
  | "proposal_generator"
  | "copywriter"
  | "campaign_runner"
  | "follow_up"
  | "conversation"
  | "scoring"
  | "observability";

export type TaskStatus = "pending" | "running" | "completed" | "failed" | "retrying" | "cancelled";
export type TaskType =
  | "prospect_companies"
  | "enrich_lead"
  | "analyze_website"
  | "generate_proposal"
  | "generate_copy"
  | "run_campaign"
  | "follow_up_lead"
  | "score_lead"
  | "respond_conversation"
  | "build_icp"
  | "orchestrate";

export interface AgentTask {
  id: string;
  type: TaskType;
  agent_name: AgentName;
  status: TaskStatus;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  retries: number;
  max_retries: number;
  parent_task_id?: string;
  created_at: string;
  started_at?: string;
  finished_at?: string;
}

export interface AgentLog {
  id: string;
  task_id: string;
  agent_name: AgentName;
  action: string;
  detail?: string;
  tokens_in?: number;
  tokens_out?: number;
  api_used?: string;
  cost_usd?: number;
  duration_ms?: number;
  created_at: string;
}

export interface AgentResult<T = Record<string, unknown>> {
  success: boolean;
  data?: T;
  error?: string;
  tokens_used?: number;
  cost_usd?: number;
  duration_ms?: number;
}

export interface OrchestratorPlan {
  objective: string;
  steps: Array<{
    order: number;
    agent: AgentName;
    type: TaskType;
    input: Record<string, unknown>;
    depends_on?: number[];
    description: string;
  }>;
}

export interface SystemStatus {
  active_tasks: number;
  pending_tasks: number;
  failed_tasks_24h: number;
  completed_tasks_24h: number;
  total_cost_usd_24h: number;
  total_tokens_24h: number;
  agents_running: string[];
  last_orchestration?: string;
}

export interface PipelineFunnel {
  companies: number;
  leads_enriched: number;
  proposals_sent: number;
  campaigns_active: number;
  emails_sent: number;
  emails_opened: number;
  replies: number;
  meetings: number;
}

// ── Company & Lead types ──────────────────────────────────────────────────────

export interface Company {
  id: string;
  name: string;
  industry?: string;
  city?: string;
  country?: string;
  address?: string;
  phone?: string;
  website?: string;
  rating?: number;
  source?: string;
  status: "new" | "enriched" | "analyzed" | "proposed" | "in_campaign" | "replied" | "closed" | "discard";
  created_at: string;
}

export interface EnrichedLead {
  id: string;
  company_id: string;
  name?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  whatsapp?: string;
  role?: string;
  source?: string;
  icp_fit?: number;       // 0-100
  meddic_score?: number;  // 0-30
  created_at: string;
}

export interface Proposal {
  id: string;
  company_id: string;
  lead_id?: string;
  content_md: string;
  pdf_url?: string;
  status: "draft" | "sent" | "viewed" | "rejected" | "accepted";
  sent_at?: string;
  created_at: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: "email" | "whatsapp" | "linkedin";
  status: "draft" | "active" | "paused" | "completed";
  icp_filter?: Record<string, unknown>;
  created_at: string;
}

export interface CampaignEmail {
  id: string;
  campaign_id: string;
  lead_id: string;
  email_number: number;  // 1, 2, 3
  subject: string;
  body: string;
  status: "draft" | "scheduled" | "sent" | "opened" | "replied" | "bounced";
  scheduled_at?: string;
  sent_at?: string;
  opened_at?: string;
  replied_at?: string;
}

export interface Conversation {
  id: string;
  lead_id: string;
  channel: "email" | "whatsapp" | "telegram" | "linkedin";
  direction: "inbound" | "outbound";
  message: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}
