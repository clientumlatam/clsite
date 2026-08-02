// ─────────────────────────────────────────────────────────────────────────────
// Clientum AI Sales OS — BaseAgent
// All agents extend this class. It handles: task lifecycle, logging, retries,
// cost tracking, and communication with the Neon DB via the /api/agent/* routes.
// ─────────────────────────────────────────────────────────────────────────────

import type { AgentName, AgentResult, TaskType } from "./types";

const API_BASE = typeof window !== "undefined" ? "" : "http://localhost:5000";

export interface AgentRunOptions {
  taskId?: string;        // Pre-assigned task ID (from orchestrator)
  parentTaskId?: string;  // Parent orchestration task
  maxRetries?: number;
  timeoutMs?: number;
}

export abstract class BaseAgent {
  abstract readonly name: AgentName;
  abstract readonly taskType: TaskType;

  protected taskId: string | null = null;

  // ── Subclasses implement this ──────────────────────────────────────────────
  protected abstract execute(
    input: Record<string, unknown>,
    log: (action: string, detail?: string) => Promise<void>
  ): Promise<AgentResult>;

  // ── Public entry point ────────────────────────────────────────────────────
  async run(
    input: Record<string, unknown>,
    options: AgentRunOptions = {}
  ): Promise<AgentResult> {
    const { taskId, parentTaskId, maxRetries = 2 } = options;
    const start = Date.now();

    // Create or update task record
    const task = await this.createTask(input, { taskId, parentTaskId, maxRetries });
    this.taskId = task.id;

    let attempt = 0;
    let lastError: string | undefined;

    while (attempt <= maxRetries) {
      try {
        await this.updateTaskStatus("running");

        const logFn = async (action: string, detail?: string) => {
          await this.log(action, detail);
        };

        const result = await this.execute(input, logFn);
        const duration = Date.now() - start;

        await this.completeTask(result, duration);
        return { ...result, duration_ms: duration };
      } catch (err: unknown) {
        attempt++;
        lastError = err instanceof Error ? err.message : String(err);
        await this.log("retry", `Attempt ${attempt}/${maxRetries}: ${lastError}`);

        if (attempt > maxRetries) break;

        await this.updateTaskStatus("retrying");
        await sleep(1000 * attempt); // exponential backoff
      }
    }

    const duration = Date.now() - start;
    await this.failTask(lastError ?? "Unknown error", duration);
    return { success: false, error: lastError, duration_ms: duration };
  }

  // ── Task lifecycle helpers ────────────────────────────────────────────────
  private async createTask(
    input: Record<string, unknown>,
    opts: { taskId?: string; parentTaskId?: string; maxRetries: number }
  ) {
    const res = await fetch(`${API_BASE}/api/agent/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: opts.taskId,
        type: this.taskType,
        agent_name: this.name,
        input,
        parent_task_id: opts.parentTaskId,
        max_retries: opts.maxRetries,
      }),
    });
    if (!res.ok) throw new Error(`Failed to create task: ${res.status}`);
    return res.json() as Promise<{ id: string }>;
  }

  private async updateTaskStatus(status: string) {
    if (!this.taskId) return;
    await fetch(`${API_BASE}/api/agent/tasks/${this.taskId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).catch(() => {});
  }

  private async completeTask(result: AgentResult, durationMs: number) {
    if (!this.taskId) return;
    await fetch(`${API_BASE}/api/agent/tasks/${this.taskId}/complete`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        output: result.data,
        tokens_used: result.tokens_used,
        cost_usd: result.cost_usd,
        duration_ms: durationMs,
      }),
    }).catch(() => {});
  }

  private async failTask(error: string, durationMs: number) {
    if (!this.taskId) return;
    await fetch(`${API_BASE}/api/agent/tasks/${this.taskId}/fail`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error, duration_ms: durationMs }),
    }).catch(() => {});
  }

  // ── Logging helper ────────────────────────────────────────────────────────
  protected async log(
    action: string,
    detail?: string,
    meta?: {
      tokensIn?: number;
      tokensOut?: number;
      apiUsed?: string;
      costUsd?: number;
      durationMs?: number;
    }
  ) {
    if (!this.taskId) return;
    await fetch(`${API_BASE}/api/agent/logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task_id: this.taskId,
        agent_name: this.name,
        action,
        detail,
        tokens_in: meta?.tokensIn,
        tokens_out: meta?.tokensOut,
        api_used: meta?.apiUsed,
        cost_usd: meta?.costUsd,
        duration_ms: meta?.durationMs,
      }),
    }).catch(() => {});
  }

  // ── API usage tracker ─────────────────────────────────────────────────────
  protected async trackApiUsage(opts: {
    apiName: string;
    endpoint?: string;
    costUsd?: number;
    tokensIn?: number;
    tokensOut?: number;
  }) {
    await fetch(`${API_BASE}/api/agent/api-usage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(opts),
    }).catch(() => {});
  }

  // ── Gemini helper (shared across agents) ─────────────────────────────────
  protected async callGemini(
    prompt: string,
    opts: { model?: string; systemPrompt?: string } = {}
  ): Promise<{ text: string; tokensIn: number; tokensOut: number; costUsd: number }> {
    const res = await fetch(`${API_BASE}/api/agent/ai/gemini`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        model: opts.model ?? "gemini-3.6-flash",
        system_prompt: opts.systemPrompt,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({})) as { error?: string };
      throw new Error(err.error ?? `Gemini error ${res.status}`);
    }
    return res.json();
  }
}

// ── Utilities ─────────────────────────────────────────────────────────────────
function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
