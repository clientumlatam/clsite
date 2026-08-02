// Shared, event-synchronized data layer used across all dashboard tabs
// (CRM Pipeline, Patagonia Explorer, Creación Rápida, Actividad) so that an
// action taken in one tab is immediately reflected in every other tab that
// reads the same entities, instead of each tab keeping an isolated copy.
import { CRMDeal } from "../types";

export const DEALS_KEY = "clientum_sim_deals";
export const ACTIVITY_KEY = "clientum_activity_log";
export const DEALS_EVENT = "clientum:deals-updated";
export const ACTIVITY_EVENT = "clientum:activity-updated";

export type ActivityType = "call" | "email" | "meeting" | "task" | "note" | "lead" | "deal" | "contact" | "stage";

export interface ActivityLogItem {
  id: number;
  type: ActivityType;
  title: string;
  date: string;
  notes?: string;
  completed: boolean;
}

/* ------------------------------------------------------------------ */
/* Deals (CRM Pipeline / Patagonia Explorer)                           */
/* ------------------------------------------------------------------ */

export function loadDeals(): CRMDeal[] {
  try {
    const raw = localStorage.getItem(DEALS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as CRMDeal[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return [];
}

export function saveDeals(deals: CRMDeal[]) {
  localStorage.setItem(DEALS_KEY, JSON.stringify(deals));
  window.dispatchEvent(new CustomEvent<CRMDeal[]>(DEALS_EVENT, { detail: deals }));
}

/** Adds a new deal/lead to the shared pipeline and logs the action in the shared activity feed. */
export function addDeal(partial: Partial<CRMDeal> & { company: string }): CRMDeal {
  const deals = loadDeals();
  const deal: CRMDeal = {
    id: partial.id || `deal_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    amount: 0,
    stage: "leads",
    industry: "General",
    ...partial,
  };
  saveDeals([deal, ...deals]);
  addActivity({
    type: deal.stage === "leads" ? "lead" : "deal",
    title: `Nuevo lead en Pipeline: "${deal.company}"`,
    notes: partial.painPoint,
  });
  return deal;
}

/* ------------------------------------------------------------------ */
/* Activity log (shared by Actividad, Creación Rápida, CRM Pipeline)   */
/* ------------------------------------------------------------------ */

export function loadActivities(): ActivityLogItem[] {
  try {
    const raw = localStorage.getItem(ACTIVITY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ActivityLogItem[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return [];
}

export function saveActivities(list: ActivityLogItem[]) {
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent<ActivityLogItem[]>(ACTIVITY_EVENT, { detail: list }));
}

export function addActivity(
  partial: Pick<ActivityLogItem, "type" | "title"> & Partial<Pick<ActivityLogItem, "notes" | "date" | "completed">>
): ActivityLogItem {
  const list = loadActivities();
  const item: ActivityLogItem = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    date: partial.date || new Date().toISOString(),
    completed: partial.completed ?? false,
    type: partial.type,
    title: partial.title,
    notes: partial.notes,
  };
  saveActivities([item, ...list]);
  return item;
}
