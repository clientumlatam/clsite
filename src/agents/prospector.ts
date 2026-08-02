/**
 * ProspectorAgent — Fase 2
 * Busca empresas en Google Places / Apify y las guarda en la tabla `companies`.
 * La lógica de API keys vive en el runner server-side: POST /api/agent/run/prospect
 */

import { BaseAgent } from "./base";
import type { AgentResult } from "./types";

export interface ProspectInput {
  industry: string;
  city: string;
  country?: string;
  limit?: number;
  source?: "google_places" | "apify" | "auto";
}

export interface ProspectOutput {
  [key: string]: unknown;
  companies_found: number;
  new_companies: number;
  company_ids: string[];
  errors: string[];
}

export class ProspectorAgent extends BaseAgent {
  readonly name = "prospector" as const;
  readonly taskType = "prospect_companies" as const;

  protected async execute(
    input: Record<string, unknown>,
    log: (action: string, detail?: string) => Promise<void>
  ): Promise<AgentResult> {
    const { industry, city, country = "Argentina", limit = 20, source = "auto" } = input as ProspectInput & Record<string, unknown>;

    if (!industry || !city) throw new Error("industry y city son requeridos");

    await log("call_runner", `Llamando runner: ${industry} en ${city} (source: ${source})`);

    // Delegate to server-side runner that has access to GOOGLE_MAPS_PLATFORM_KEY / APIFY_API_TOKEN
    const res = await fetch("/api/agent/run/prospect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ industry, city, country, limit, source }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` })) as { error?: string };
      throw new Error(err.error ?? `Runner falló: HTTP ${res.status}`);
    }

    const data = (await res.json()) as ProspectOutput;
    await log("done", `${data.companies_found} empresas encontradas, ${data.new_companies} nuevas`);

    await this.trackApiUsage({
      apiName: source === "google_places" ? "google_places" : "apify",
      endpoint: source,
      costUsd: 0.001 * (data.companies_found || 0),
    });

    return {
      success: true,
      data,
      tokens_used: 0,
      cost_usd: 0.001 * (data.companies_found || 0),
    };
  }
}

export const prospectorAgent = new ProspectorAgent();
