import React, { useState, useEffect } from "react";
import {
  User,
  TrendingUp,
  CheckSquare,
  Briefcase,
  CheckCircle2,
  Trash2,
  PlusCircle,
  ChevronDown,
} from "lucide-react";
import { addDeal, addActivity } from "../../store/sharedStore";
import { CRMDeal } from "../../types";

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */

type ItemKind = "contact" | "lead" | "activity" | "deal";

interface QuickItem {
  id: number;
  kind: ItemKind;
  label: string;
  sub: string;
  createdAt: string;
  raw?: Record<string, string>;
}

/* ------------------------------------------------------------------ */
/* Config                                                               */
/* ------------------------------------------------------------------ */

const KIND_CONFIG: Record<ItemKind, { label: string; Icon: React.ElementType; color: string; bg: string }> = {
  contact:  { label: "Contacto",  Icon: User,        color: "text-blue-600",   bg: "bg-blue-50 border-blue-200"   },
  lead:     { label: "Lead",      Icon: TrendingUp,  color: "text-violet-600", bg: "bg-violet-50 border-violet-200" },
  activity: { label: "Actividad", Icon: CheckSquare, color: "text-amber-600",  bg: "bg-amber-50 border-amber-200" },
  deal:     { label: "Deal",      Icon: Briefcase,   color: "text-green-600",  bg: "bg-green-50 border-green-200" },
};

const ACTIVITY_TYPES = ["Llamada", "Email", "Reunión", "Tarea", "Nota"];
const LEAD_SOURCES   = ["Sitio web", "Referido", "Redes sociales", "Email", "Llamada en frío", "Otro"];
const DEAL_STAGES    = ["Descubrimiento", "Propuesta", "Negociación", "Contrato", "Ganado"];

const STORAGE_KEY = "clientum_quickcreate_items";

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

function loadItems(): QuickItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as QuickItem[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch { /* ignore */ }
  return [];
}

function saveItems(list: QuickItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);
  if (days > 0)  return `hace ${days}d`;
  if (hours > 0) return `hace ${hours}h`;
  if (mins > 0)  return `hace ${mins} min`;
  return "ahora mismo";
}

/* ------------------------------------------------------------------ */
/* Sub-forms                                                            */
/* ------------------------------------------------------------------ */

function ContactForm({ onSave, onCancel }: { onSave: (item: Omit<QuickItem, "id" | "createdAt">) => void; onCancel: () => void }) {
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [phone,   setPhone]   = useState("");
  const [company, setCompany] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onSave({
      kind: "contact",
      label: name.trim(),
      sub: [email.trim(), company.trim()].filter(Boolean).join(" · "),
      raw: { name: name.trim(), email: email.trim(), phone: phone.trim(), company: company.trim() },
    });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <input required autoFocus placeholder="Nombre completo *" value={name}    onChange={e => setName(e.target.value)}    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-400" />
      <input required type="email" placeholder="Email *"        value={email}   onChange={e => setEmail(e.target.value)}   className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-400" />
      <div className="grid grid-cols-2 gap-2">
        <input placeholder="Teléfono" value={phone}   onChange={e => setPhone(e.target.value)}   className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-400" />
        <input placeholder="Empresa"  value={company} onChange={e => setCompany(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-400" />
      </div>
      <FormActions onCancel={onCancel} />
    </form>
  );
}

function LeadForm({ onSave, onCancel }: { onSave: (item: Omit<QuickItem, "id" | "createdAt">) => void; onCancel: () => void }) {
  const [title,  setTitle]  = useState("");
  const [value,  setValue]  = useState("");
  const [source, setSource] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const parts = [];
    if (value.trim())  parts.push(`${value}`);
    if (source.trim()) parts.push(source);
    onSave({
      kind: "lead",
      label: title.trim(),
      sub: parts.join(" · ") || "Sin datos adicionales",
      raw: { title: title.trim(), value: value.trim(), source: source.trim() },
    });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <input required autoFocus placeholder="Título del lead *" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-400" />
      <div className="grid grid-cols-2 gap-2">
        <input type="number" min="0" placeholder="Valor estimado ($)" value={value} onChange={e => setValue(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-400" />
        <div className="relative">
          <select value={source} onChange={e => setSource(e.target.value)} className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-blue-400 pr-6">
            <option value="">Fuente…</option>
            {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
        </div>
      </div>
      <FormActions onCancel={onCancel} />
    </form>
  );
}

function ActivityForm({ onSave, onCancel }: { onSave: (item: Omit<QuickItem, "id" | "createdAt">) => void; onCancel: () => void }) {
  const [title,   setTitle]   = useState("");
  const [actType, setActType] = useState("Llamada");
  const [notes,   setNotes]   = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      kind: "activity",
      label: title.trim(),
      sub: actType + (notes.trim() ? ` · ${notes.trim()}` : ""),
      raw: { title: title.trim(), actType, notes: notes.trim() },
    });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <input required autoFocus placeholder="Título de la actividad *" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-400" />
      <div className="relative">
        <select value={actType} onChange={e => setActType(e.target.value)} className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-blue-400 pr-6">
          {ACTIVITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
      </div>
      <textarea rows={2} placeholder="Notas opcionales…" value={notes} onChange={e => setNotes(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-400 resize-none" />
      <FormActions onCancel={onCancel} />
    </form>
  );
}

function DealForm({ onSave, onCancel }: { onSave: (item: Omit<QuickItem, "id" | "createdAt">) => void; onCancel: () => void }) {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [stage, setStage] = useState("Descubrimiento");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const parts = [];
    if (value.trim()) parts.push(`${value}`);
    parts.push(stage);
    onSave({
      kind: "deal",
      label: title.trim(),
      sub: parts.join(" · "),
      raw: { title: title.trim(), value: value.trim(), stage },
    });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <input required autoFocus placeholder="Título del deal *" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-400" />
      <div className="grid grid-cols-2 gap-2">
        <input type="number" min="0" placeholder="Valor ($)" value={value} onChange={e => setValue(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-400" />
        <div className="relative">
          <select value={stage} onChange={e => setStage(e.target.value)} className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-blue-400 pr-6">
            {DEAL_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
        </div>
      </div>
      <FormActions onCancel={onCancel} />
    </form>
  );
}

function FormActions({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="flex gap-2 pt-1">
      <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all">
        <CheckCircle2 className="w-3 h-3" />
        Guardar
      </button>
      <button type="button" onClick={onCancel} className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold py-1.5 rounded-lg transition-all">
        Cancelar
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                       */
/* ------------------------------------------------------------------ */

export default function QuickCreateTab() {
  const [items,       setItems]       = useState<QuickItem[]>(() => loadItems());
  const [activeKind,  setActiveKind]  = useState<ItemKind | null>(null);
  const [successMsg,  setSuccessMsg]  = useState<string | null>(null);

  useEffect(() => {
    saveItems(items);
  }, [items]);

  function handleSave(partial: Omit<QuickItem, "id" | "createdAt">) {
    const newItem: QuickItem = { ...partial, id: Date.now(), createdAt: new Date().toISOString() };
    setItems(prev => [newItem, ...prev]);
    setActiveKind(null);
    const label = KIND_CONFIG[partial.kind].label;
    setSuccessMsg(`${label} creado: "${newItem.label}"`);
    setTimeout(() => setSuccessMsg(null), 3000);

    // Real integration: push contacts, leads and deals into the same shared
    // CRM pipeline used by "CRM Pipeline" and "Patagonia Explorer", so they
    // show up there instantly instead of staying isolated in this panel.
    // Activities go straight into the shared activity feed used by "Actividad".
    const raw = partial.raw || {};
    if (partial.kind === "contact") {
      addDeal({
        company: raw.company || raw.name || partial.label,
        contact: raw.name,
        phone: raw.phone || undefined,
        amount: 0,
        stage: "leads",
        industry: "Contacto",
        painPoint: raw.email ? `Email: ${raw.email}` : undefined,
      } as Partial<CRMDeal> & { company: string });
    } else if (partial.kind === "lead") {
      addDeal({
        company: raw.title || partial.label,
        amount: Number(raw.value) || 0,
        stage: "leads",
        industry: raw.source || "Prospección",
      } as Partial<CRMDeal> & { company: string });
    } else if (partial.kind === "deal") {
      const stageMap: Record<string, CRMDeal["stage"]> = {
        "Descubrimiento": "leads",
        "Propuesta": "proposal",
        "Negociación": "proposal",
        "Contrato": "proposal",
        "Ganado": "closed",
      };
      addDeal({
        company: raw.title || partial.label,
        amount: Number(raw.value) || 0,
        stage: stageMap[raw.stage] || "leads",
        industry: "Deal directo",
      } as Partial<CRMDeal> & { company: string });
    } else if (partial.kind === "activity") {
      addActivity({
        type: (["Llamada", "call"].includes(raw.actType) ? "call"
          : raw.actType === "Email" ? "email"
          : raw.actType === "Reunión" ? "meeting"
          : raw.actType === "Tarea" ? "task"
          : "note"),
        title: raw.title || partial.label,
        notes: raw.notes || undefined,
      });
    }
  }

  function handleDelete(id: number) {
    setItems(prev => prev.filter(i => i.id !== id));
  }

  return (
    <div className="flex flex-col gap-4 text-left">
      {/* Header */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1">
          <PlusCircle className="w-3.5 h-3.5 text-blue-500" />
          Creación Rápida
        </h4>
        <p className="text-[10px] text-slate-500 leading-normal">
          Creá contactos, leads, actividades y deals directamente desde el editor. Se guarda en tu navegador.
        </p>
      </div>

      {/* Success banner */}
      {successMsg && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-3 py-2 text-[10px] font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Kind selector buttons */}
      {activeKind === null && (
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(KIND_CONFIG) as ItemKind[]).map((k) => {
            const cfg = KIND_CONFIG[k];
            return (
              <button
                key={k}
                onClick={() => setActiveKind(k)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-semibold transition-all hover:shadow-sm ${cfg.bg} ${cfg.color}`}
              >
                <cfg.Icon className="w-3.5 h-3.5" />
                Nuevo {cfg.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Active form */}
      {activeKind !== null && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col gap-2.5">
          <div className="flex items-center gap-2 mb-1">
            {(() => { const cfg = KIND_CONFIG[activeKind]; return <cfg.Icon className={`w-3.5 h-3.5 ${cfg.color}`} />; })()}
            <span className="text-xs font-bold text-slate-700">Nuevo {KIND_CONFIG[activeKind].label}</span>
          </div>

          {activeKind === "contact"  && <ContactForm  onSave={handleSave} onCancel={() => setActiveKind(null)} />}
          {activeKind === "lead"     && <LeadForm     onSave={handleSave} onCancel={() => setActiveKind(null)} />}
          {activeKind === "activity" && <ActivityForm onSave={handleSave} onCancel={() => setActiveKind(null)} />}
          {activeKind === "deal"     && <DealForm     onSave={handleSave} onCancel={() => setActiveKind(null)} />}
        </div>
      )}

      {/* Items list */}
      {items.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Creados recientemente ({items.length})
          </p>
          {items.map((item) => {
            const cfg = KIND_CONFIG[item.kind];
            return (
              <div key={item.id} className="flex items-start gap-2 bg-white border border-slate-200 rounded-lg px-2.5 py-2">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.bg.split(" ")[0]} border ${cfg.bg.split(" ")[1]}`}>
                  <cfg.Icon className={`w-3 h-3 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">{item.label}</p>
                  <p className="text-[10px] text-slate-400 truncate">{item.sub}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-[9px] text-slate-300">{formatRelative(item.createdAt)}</span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="w-4 h-4 rounded flex items-center justify-center text-slate-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {items.length === 0 && activeKind === null && (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <PlusCircle className="w-7 h-7 text-slate-200" />
          <p className="text-xs text-slate-400">Nada creado aún</p>
          <p className="text-[10px] text-slate-300">Usá los botones de arriba para empezar</p>
        </div>
      )}
    </div>
  );
}
