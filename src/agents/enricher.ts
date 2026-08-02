/**
 * EnricherAgent — Fase 2
 * Para cada empresa encontrada por el Prospector:
 *   1. Hunter.io  → busca emails / contactos por dominio
 *   2. Firecrawl  → extrae texto de la web (si hay)
 *   3. Gemini     → analiza pain-point personalizado
 * La lógica de API keys vive en el runner server-side: POST /api/agent/run/enrich
 */

import { BaseAgent } from "./base";
import type { AgentResult } from "./types";

export interface EnrichInput {
  company_id: string;
  company_name: string;
  website?: string;
  domain?: string;
  city?: string;
  industry?: string;
}

export interface EnrichOutput {
  [key: string]: unknown;
  company_id: string;
  emails_found: number;
  contacts: Array<{ name: string; email: string; role?: string; confidence?: number }>;
  web_summary?: string;
  pain_point?: string;
  lead_id?: string;
}

export class EnricherAgent extends BaseAgent {
  readonly name = "enricher" as const;
  readonly taskType = "enrich_lead" as const;

  protected async execute(
    input: Record<string, unknown>,
    log: (action: string, detail?: string) => Promise<void>
  ): Promise<AgentResult> {
    const { company_id, company_name, website, domain, city, industry } = input as EnrichInput & Record<string, unknown>;

    if (!company_id || !company_name) throw new Error("company_id y company_name son requeridos");

    await log("call_runner", `Enriqueciendo ${company_name} (${website ?? "sin web"})`);

    const res = await fetch("/api/agent/run/enrich", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company_id, company_name, website, domain, city, industry }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` })) as { error?: string };
      throw new Error(err.error ?? `Enricher runner falló: HTTP ${res.status}`);
    }

    const data = (await res.json()) as EnrichOutput;
    await log("done", `${data.emails_found} emails encontrados, pain-point: ${data.pain_point ? "✓" : "—"}`);

    await this.trackApiUsage({
      apiName: "hunter_io",
      costUsd: 0.005,
    });

    return {
      success: true,
      data,
      tokens_used: 0,
      cost_usd: 0.005,
    };
  }
}

export const enricherAgent = new EnricherAgent();
