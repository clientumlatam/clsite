// ─────────────────────────────────────────────────────────────────────────────
// Clientum AI Sales OS — Orchestrator Agent
// The Orchestrator is the only agent the user talks to directly.
// It parses a natural-language objective → builds a plan → dispatches agents.
// ─────────────────────────────────────────────────────────────────────────────

import { BaseAgent } from "./base";
import type { AgentName, AgentResult, OrchestratorPlan, TaskType } from "./types";

export class OrchestratorAgent extends BaseAgent {
  readonly name: AgentName = "orchestrator";
  readonly taskType: TaskType = "orchestrate";

  protected async execute(
    input: Record<string, unknown>,
    log: (action: string, detail?: string) => Promise<void>
  ): Promise<AgentResult> {
    const { objective } = input as { objective: string };

    await log("parse_objective", `Objective: ${objective}`);

    // 1. Use Gemini to build an execution plan
    const plan = await this.buildPlan(objective, log);

    await log("plan_ready", `${plan.steps.length} steps planned`);

    // 2. Persist the orchestration plan
    const orchestrationId = await this.saveOrchestration(objective, plan);

    // 3. Dispatch steps sequentially (respecting depends_on)
    const results: Array<{ step: number; agent: string; success: boolean; taskId?: string }> = [];

    for (const step of plan.steps) {
      // Check dependencies
      if (step.depends_on?.length) {
        const deps = results.filter((r) => step.depends_on!.includes(r.step));
        const allOk = deps.every((d) => d.success);
        if (!allOk) {
          await log("skip_step", `Step ${step.order} skipped — dependency failed`);
          results.push({ step: step.order, agent: step.agent, success: false });
          continue;
        }
      }

      await log("dispatch", `Step ${step.order}: ${step.description} → ${step.agent}`);

      try {
        const taskRes = await this.dispatchAgent({
          type: step.type,
          agentName: step.agent,
          input: {
            ...step.input,
            orchestration_id: orchestrationId,
          },
        });
        results.push({ step: step.order, agent: step.agent, success: true, taskId: taskRes.taskId });
        await log("dispatched", `Task ${taskRes.taskId} created for ${step.agent}`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        await log("dispatch_error", `Step ${step.order} failed: ${msg}`);
        results.push({ step: step.order, agent: step.agent, success: false });
      }
    }

    return {
      success: true,
      data: {
        orchestration_id: orchestrationId,
        objective,
        plan,
        results,
        completed: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length,
      },
    };
  }

  // ── Build plan via Gemini ─────────────────────────────────────────────────
  private async buildPlan(objective: string, log: (a: string, d?: string) => Promise<void>): Promise<OrchestratorPlan> {
    const systemPrompt = `Eres el Orquestador del Clientum AI Sales OS.
Tu tarea es convertir un objetivo comercial en un plan de ejecución estructurado.

Agentes disponibles y sus tipos de tarea:
- strategist → build_icp
- prospector → prospect_companies  
- enricher → enrich_lead
- web_analyst → analyze_website
- proposal_generator → generate_proposal
- copywriter → generate_copy
- campaign_runner → run_campaign
- follow_up → follow_up_lead
- scoring → score_lead

Responde SOLO con JSON válido (sin texto adicional) con esta estructura:
{
  "objective": "...",
  "steps": [
    {
      "order": 1,
      "agent": "prospector",
      "type": "prospect_companies",
      "input": { "industry": "...", "city": "...", "limit": 20 },
      "depends_on": [],
      "description": "Buscar empresas de X en Y"
    }
  ]
}`;

    await log("call_gemini", "Building execution plan");
    const result = await this.callGemini(
      `Objetivo del usuario: "${objective}"\n\nCrea el plan de ejecución.`,
      { systemPrompt, model: "gemini-3.6-flash" }
    );

    try {
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in Gemini response");
      return JSON.parse(jsonMatch[0]) as OrchestratorPlan;
    } catch {
      // Fallback: simple prospecting plan
      await log("plan_fallback", "Using default plan structure");
      return {
        objective,
        steps: [
          {
            order: 1,
            agent: "strategist",
            type: "build_icp",
            input: { objective },
            depends_on: [],
            description: "Definir ICP y estrategia comercial",
          },
          {
            order: 2,
            agent: "prospector",
            type: "prospect_companies",
            input: { objective, limit: 20 },
            depends_on: [1],
            description: "Prospectar empresas objetivo",
          },
        ],
      };
    }
  }

  // ── Persist orchestration to DB ───────────────────────────────────────────
  private async saveOrchestration(objective: string, plan: OrchestratorPlan): Promise<string> {
    const res = await fetch("/api/orchestrator/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ objective, plan }),
    });
    if (!res.ok) return `local_${Date.now()}`;
    const data = await res.json() as { id: string };
    return data.id;
  }

  // ── Dispatch a single agent task ──────────────────────────────────────────
  private async dispatchAgent(opts: {
    type: TaskType;
    agentName: AgentName;
    input: Record<string, unknown>;
  }): Promise<{ taskId: string }> {
    const res = await fetch("/api/agent/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: opts.type,
        agent_name: opts.agentName,
        input: opts.input,
        parent_task_id: this.taskId,
      }),
    });
    if (!res.ok) throw new Error(`Failed to dispatch ${opts.agentName}: ${res.status}`);
    const task = await res.json() as { id: string };
    return { taskId: task.id };
  }
}

export const orchestratorAgent = new OrchestratorAgent();
