import React, { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  Users,
  CheckSquare,
  FileText,
  Check,
  X,
  ListChecks,
  Plus,
  Clock,
  TrendingUp,
  Briefcase,
} from "lucide-react";
import { loadActivities, saveActivities, addActivity, ActivityLogItem, ACTIVITY_EVENT } from "../../store/sharedStore";

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */

type ActivityType = ActivityLogItem["type"];
type Activity = ActivityLogItem;

/* ------------------------------------------------------------------ */
/* Activity type config                                                 */
/* ------------------------------------------------------------------ */

const ACTIVITY_TYPES: {
  id: ActivityType;
  label: string;
  Icon: React.ElementType;
  color: string;
}[] = [
  { id: "call",     label: "Llamada",  Icon: Phone,       color: "bg-blue-100 text-blue-600"     },
  { id: "email",    label: "Email",    Icon: Mail,        color: "bg-violet-100 text-violet-600" },
  { id: "meeting",  label: "Reunión",  Icon: Users,       color: "bg-amber-100 text-amber-600"   },
  { id: "task",     label: "Tarea",    Icon: CheckSquare, color: "bg-green-100 text-green-600"   },
  { id: "note",     label: "Nota",     Icon: FileText,    color: "bg-gray-100 text-gray-600"     },
  { id: "lead",     label: "Lead",     Icon: TrendingUp,  color: "bg-fuchsia-100 text-fuchsia-600" },
  { id: "deal",     label: "Deal",     Icon: Briefcase,   color: "bg-teal-100 text-teal-600"     },
  { id: "contact",  label: "Contacto", Icon: Users,       color: "bg-blue-100 text-blue-600"     },
  { id: "stage",    label: "Cambio de etapa", Icon: TrendingUp, color: "bg-indigo-100 text-indigo-600" },
];

function activityConfig(type: string) {
  return ACTIVITY_TYPES.find((t) => t.id === type) ?? ACTIVITY_TYPES[4];
}

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

function formatDate(iso: string): string {
  const d = new Date(iso);
  const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}, ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

export default function ActivityTab() {
  const [activities, setActivities] = useState<Activity[]>(() => loadActivities());
  const [adding, setAdding] = useState(false);
  const [type, setType] = useState<ActivityType>("call");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 16));
  const [actNotes, setActNotes] = useState("");

  useEffect(() => {
    saveActivities(activities);
  }, [activities]);

  // Live-sync: reflect activities logged automatically from other tabs
  // (Creación Rápida, CRM Pipeline stage changes) without a reload.
  useEffect(() => {
    const handleExternalUpdate = (e: Event) => {
      const updated = (e as CustomEvent<Activity[]>).detail ?? loadActivities();
      setActivities((prev) => (JSON.stringify(prev) !== JSON.stringify(updated) ? updated : prev));
    };
    window.addEventListener(ACTIVITY_EVENT, handleExternalUpdate);
    return () => window.removeEventListener(ACTIVITY_EVENT, handleExternalUpdate);
  }, []);

  const sorted = [...activities].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  function handleAdd() {
    if (!title.trim()) return;
    const newActivity: Activity = {
      id: Date.now(),
      type,
      title: title.trim(),
      date: new Date(date).toISOString(),
      notes: actNotes.trim() || undefined,
      completed: false,
    };
    setActivities((prev) => [newActivity, ...prev]);
    setTitle("");
    setActNotes("");
    setDate(new Date().toISOString().slice(0, 16));
    setAdding(false);
  }

  function handleToggle(id: number) {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
    );
  }

  function handleDelete(id: number) {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="flex flex-col gap-4 text-left">
      {/* Header */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1">
          <Clock className="w-3.5 h-3.5 text-blue-500" />
          Timeline de Actividades
        </h4>
        <p className="text-[10px] text-slate-500 leading-normal">
          Registrá llamadas, emails, reuniones, tareas y notas del CRM. Se guarda en tu navegador.
        </p>
      </div>

      {/* Add form / button */}
      {adding ? (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col gap-2.5">
          {/* Type selector — manual entries only; lead/deal/contact/stage are logged automatically */}
          <div className="flex gap-1.5 flex-wrap">
            {ACTIVITY_TYPES.filter((t) => ["call", "email", "meeting", "task", "note"].includes(t.id)).map((t) => (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-colors ${
                  type === t.id
                    ? t.color + " border-transparent"
                    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-100"
                }`}
              >
                <t.Icon className="w-3 h-3" />
                {t.label}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Título de la actividad…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-400"
          />

          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-400"
          />

          <textarea
            placeholder="Notas opcionales…"
            value={actNotes}
            onChange={(e) => setActNotes(e.target.value)}
            rows={2}
            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-400 resize-none"
          />

          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={!title.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all disabled:opacity-50"
            >
              <Check className="w-3 h-3" />
              Guardar
            </button>
            <button
              onClick={() => { setAdding(false); setTitle(""); setActNotes(""); }}
              className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all"
            >
              <X className="w-3 h-3" />
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-600 hover:text-blue-700 text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          Registrar actividad
        </button>
      )}

      {/* Timeline */}
      {sorted.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <ListChecks className="w-7 h-7 text-slate-200" />
          <p className="text-xs text-slate-400">Sin actividades todavía</p>
          <p className="text-[10px] text-slate-300">Registrá llamadas, reuniones, emails…</p>
        </div>
      ) : (
        <div className="relative flex flex-col gap-0">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-100" />

          {sorted.map((activity) => {
            const cfg = activityConfig(activity.type);
            return (
              <div key={activity.id} className="relative flex gap-3 pl-10 pb-2">
                {/* Icon bubble */}
                <div
                  className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${cfg.color}`}
                >
                  <cfg.Icon className="w-3.5 h-3.5" />
                </div>

                {/* Card */}
                <div
                  className={`flex-1 bg-white border border-slate-200 rounded-lg p-2.5 transition-opacity ${
                    activity.completed ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-medium leading-snug ${
                          activity.completed
                            ? "line-through text-slate-400"
                            : "text-slate-800"
                        }`}
                      >
                        {activity.title}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {formatDate(activity.date)}
                      </p>
                      {activity.notes && (
                        <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                          {activity.notes}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleToggle(activity.id)}
                        title={activity.completed ? "Marcar pendiente" : "Marcar completo"}
                        className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                          activity.completed
                            ? "bg-green-100 text-green-600 hover:bg-green-200"
                            : "bg-slate-100 text-slate-400 hover:bg-green-100 hover:text-green-600"
                        }`}
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(activity.id)}
                        className="w-5 h-5 rounded flex items-center justify-center bg-slate-100 text-slate-400 hover:bg-red-100 hover:text-red-500 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
