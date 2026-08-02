import React, { useState, useEffect } from "react";
import { CRMDeal, BrochureData } from "../types";
import { INITIAL_DEALS } from "../data";
import { loadDeals, saveDeals, addActivity, DEALS_EVENT } from "../store/sharedStore";
import {
  CheckCircle2,
  TrendingUp,
  Users,
  DollarSign,
  Compass,
  Sparkles,
  Search,
  MapPin,
  Phone,
  User,
  AlertTriangle,
  Plus,
  Check,
  RefreshCw,
  Info,
  Trash2,
  ArrowLeft,
  ArrowRight
} from "lucide-react";

interface InteractiveCRMKanbanProps {
  brochureData?: BrochureData;
  onChange?: (newData: BrochureData) => void;
}

const CITIES_RN = [
  "General Roca",
  "Cipolletti",
  "San Carlos de Bariloche",
  "Viedma",
  "Villa Regina",
  "Allen",
  "Cinco Saltos",
  "Catriel",
  "San Antonio Oeste"
];

const CITIES_NQ = [
  "Neuquén Capital",
  "Plottier",
  "Centenario",
  "Zapala",
  "Cutral Co",
  "Plaza Huincul",
  "San Martín de los Andes",
  "Villa La Angostura",
  "Chos Malal"
];

const INDUSTRIES_PRESET = [
  "Distribuidora Mayorista",
  "Bodega de Vinos",
  "Inmobiliaria & Alquileres",
  "Corralón de Construcción",
  "Clínica de Salud / Estética",
  "Empaque de Fruta / Manzana",
  "Gastronomía & Restorán",
  "Ferretería Industrial",
  "Logística & Transporte"
];

export default function InteractiveCRMKanban({ brochureData, onChange }: InteractiveCRMKanbanProps) {
  // Navigation inside the component: "pipeline" or "prospector"
  const [activeTab, setActiveTab] = useState<"pipeline" | "prospector">("pipeline");

  // Load and manage deals synchronized with global state, shared across all
  // tabs (Pipeline, Patagonia Explorer, Creación Rápida, Actividad).
  const [deals, setDeals] = useState<CRMDeal[]>(() => {
    if (brochureData?.crm?.deals && brochureData.crm.deals.length > 0) {
      return brochureData.crm.deals;
    }
    const saved = loadDeals();
    if (saved.length > 0) return saved;
    return INITIAL_DEALS;
  });

  // Track expanded diagnostic details
  const [expandedDealId, setExpandedDealId] = useState<string | null>(null);

  // Sync external changes from brochureData
  useEffect(() => {
    if (brochureData?.crm?.deals) {
      setDeals(brochureData.crm.deals);
    }
  }, [brochureData?.crm?.deals]);

  // Live-sync: pick up deals created/edited from other tabs (e.g. Creación
  // Rápida) without requiring a full page reload.
  useEffect(() => {
    const handleExternalDealsUpdate = (e: Event) => {
      const updated = (e as CustomEvent<CRMDeal[]>).detail ?? loadDeals();
      setDeals((prev) => (JSON.stringify(prev) !== JSON.stringify(updated) ? updated : prev));
    };
    window.addEventListener(DEALS_EVENT, handleExternalDealsUpdate);
    return () => window.removeEventListener(DEALS_EVENT, handleExternalDealsUpdate);
  }, []);

  // Propagate state changes back to parent
  const updateDealsState = (newDeals: CRMDeal[]) => {
    setDeals(newDeals);
    saveDeals(newDeals);
    if (onChange && brochureData) {
      onChange({
        ...brochureData,
        crm: {
          ...brochureData.crm,
          deals: newDeals
        }
      });
    }
  };

  // Simple and accessible stage movement
  const moveDeal = (id: string, direction: "next" | "prev") => {
    const stages: CRMDeal["stage"][] = ["leads", "contacted", "proposal", "closed"];
    let movedDeal: CRMDeal | null = null;
    const updated = deals.map((deal) => {
      if (deal.id !== id) return deal;
      const currentIndex = stages.indexOf(deal.stage);
      let nextIndex = currentIndex;
      if (direction === "next" && currentIndex < stages.length - 1) {
        nextIndex = currentIndex + 1;
      } else if (direction === "prev" && currentIndex > 0) {
        nextIndex = currentIndex - 1;
      }
      movedDeal = { ...deal, stage: stages[nextIndex] };
      return movedDeal;
    });
    updateDealsState(updated);
    if (movedDeal) {
      addActivity({
        type: "stage",
        title: `"${movedDeal.company}" pasó a la etapa "${movedDeal.stage}"`,
      });
    }
  };

  const handleDeleteDeal = (id: string) => {
    const updated = deals.filter((deal) => deal.id !== id);
    updateDealsState(updated);
  };

  // AI Prospector States
  const [prospectProv, setProspectProv] = useState<"RN" | "NQ">("RN");
  const [prospectCity, setProspectCity] = useState("General Roca");
  const [prospectIndustry, setProspectIndustry] = useState("Distribuidora Mayorista");
  const [customIndustry, setCustomIndustry] = useState("");
  const [prospectLoading, setProspectLoading] = useState(false);
  const [prospectError, setProspectError] = useState("");
  const [prospectsResult, setProspectsResult] = useState<any[]>([]);
  const [addedProspectNames, setAddedProspectNames] = useState<string[]>([]);

  // Adjust city default when province changes
  useEffect(() => {
    if (prospectProv === "RN") {
      setProspectCity(CITIES_RN[0]);
    } else {
      setProspectCity(CITIES_NQ[0]);
    }
  }, [prospectProv]);

  // Run AI Prospector search via Gemini API
  const handleProspectLeads = async () => {
    setProspectLoading(true);
    setProspectError("");
    setProspectsResult([]);

    const selectedIndustry = prospectIndustry === "OTRO" ? customIndustry.trim() : prospectIndustry;

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "prospectLeads",
          payload: {
            city: prospectCity,
            industry: selectedIndustry,
          },
        }),
      });

      const resData = await response.json();
      if (resData.error) throw new Error(resData.error);
      if (resData.result && resData.result.prospects) {
        setProspectsResult(resData.result.prospects);
      } else {
        throw new Error("No se pudo obtener la lista de prospectos.");
      }
    } catch (err: any) {
      console.error(err);
      setProspectError(err.message || "Error al conectar con el servidor de prospección.");
    } finally {
      setProspectLoading(false);
    }
  };

  // Add prospected lead to active CRM deals state
  const handleAddProspectedLead = (p: any) => {
    const newDeal: CRMDeal = {
      id: "deal-prospect-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      company: p.company,
      amount: p.amount || 180000,
      industry: p.industry || prospectIndustry,
      stage: "leads",
      city: p.city || prospectCity,
      address: p.address,
      phone: p.phone,
      contact: p.contact,
      painPoint: p.painPoint,
    };

    const updated = [newDeal, ...deals];
    updateDealsState(updated);
    setAddedProspectNames((prev) => [...prev, p.company]);
  };

  // Compute metrics dynamically
  const totalValue = deals
    .filter((d) => d.stage === "closed")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const activeLeadsCount = deals.filter((d) => d.stage !== "closed").length;
  const closedCount = deals.filter((d) => d.stage === "closed").length;
  const conversionRate = deals.length > 0 ? Math.round((closedCount / deals.length) * 100) : 0;

  const getStageLabel = (key: CRMDeal["stage"]) => {
    if (brochureData?.crm?.stageLabels?.[key]) {
      return brochureData.crm.stageLabels[key];
    }
    switch (key) {
      case "leads": return "Nuevos Leads";
      case "contacted": return "Contacto Bot";
      case "proposal": return "Propuesta";
      case "closed": return "Ganado 🎉";
      default: return String(key);
    }
  };

  const stages: { key: CRMDeal["stage"]; label: string; bg: string; text: string; headerBg: string }[] = [
    { key: "leads", label: getStageLabel("leads"), bg: "bg-slate-50/50 border-slate-200", headerBg: "bg-slate-100", text: "text-slate-700" },
    { key: "contacted", label: getStageLabel("contacted"), bg: "bg-emerald-50/30 border-emerald-150", headerBg: "bg-emerald-50", text: "text-emerald-700" },
    { key: "proposal", label: getStageLabel("proposal"), bg: "bg-blue-50/30 border-blue-150", headerBg: "bg-blue-50", text: "text-blue-700" },
    { key: "closed", label: getStageLabel("closed"), bg: "bg-green-50/30 border-green-150", headerBg: "bg-green-50", text: "text-green-700" },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm text-left no-print">
      {/* Tab Switcher at the top of the Kanban card */}
      <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200 gap-1 mb-4">
        <button
          onClick={() => setActiveTab("pipeline")}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "pipeline"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          Mi Embudo de Ventas
        </button>
        <button
          onClick={() => setActiveTab("prospector")}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer relative ${
            activeTab === "prospector"
              ? "bg-slate-900 text-white shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          Buscador Satelital de Prospectos IA
          <span className="absolute top-[-4px] right-2 bg-emerald-500 text-white text-[7px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider font-mono scale-90">
            PRO
          </span>
        </button>
      </div>

      {/* PIPELINE VIEW */}
      {activeTab === "pipeline" ? (
        <div>
          {/* Dynamic Metrics */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-150 flex flex-col justify-center">
              <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold font-mono">Tasa Conversión</span>
              <strong className="text-sm text-slate-800 flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-4 h-4 text-green-500" />
                {conversionRate}%
              </strong>
            </div>
            <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-150 flex flex-col justify-center">
              <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold font-mono">Leads Activos</span>
              <strong className="text-sm text-slate-800 flex items-center gap-1 mt-0.5">
                <Users className="w-4 h-4 text-blue-500" />
                {activeLeadsCount}
              </strong>
            </div>
            <div className="bg-emerald-50/50 rounded-lg p-2.5 border border-emerald-100 flex flex-col justify-center">
              <span className="block text-[8px] uppercase tracking-wider text-emerald-600 font-bold font-mono">Total Cerrado</span>
              <strong className="text-sm text-emerald-800 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ${totalValue.toLocaleString("es-AR")}
              </strong>
            </div>
          </div>

          {/* Kanban Board Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {stages.map((stage) => {
              const stageDeals = deals.filter((d) => d.stage === stage.key);
              return (
                <div
                  key={stage.key}
                  className={`rounded-xl border p-2 flex flex-col gap-2 min-h-[220px] transition-colors ${stage.bg}`}
                >
                  {/* Stage Header */}
                  <div className={`flex items-center justify-between p-1.5 rounded-lg border border-slate-100 ${stage.headerBg}`}>
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider ${stage.text}`}>
                      {stage.label}
                    </span>
                    <span className="bg-white border border-slate-100 px-2 py-0.5 rounded-full text-[9px] font-bold text-slate-500 font-mono">
                      {stageDeals.length}
                    </span>
                  </div>

                  {/* Deals column */}
                  <div className="flex-1 flex flex-col gap-2 overflow-y-auto max-h-[300px] pr-0.5">
                    {stageDeals.length === 0 ? (
                      <div className="flex-1 flex items-center justify-center border border-dashed border-slate-200 rounded-lg py-8 text-[9px] text-slate-400 text-center font-light leading-relaxed px-2">
                        Arrastrá desde la etapa anterior o sumá prospectos de IA
                      </div>
                    ) : (
                      stageDeals.map((deal) => (
                        <div
                          key={deal.id}
                          className="bg-white rounded-lg border border-slate-200 p-2 shadow-xs hover:border-slate-350 transition-all text-xs flex flex-col gap-1.5 border-l-2 border-l-slate-400"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <div className="text-left">
                              <h5 className="font-extrabold text-slate-800 text-[11px] leading-tight truncate max-w-[110px]" title={deal.company}>
                                {deal.company}
                              </h5>
                              <span className="text-[9px] text-slate-400 block font-light mt-0.5 truncate max-w-[110px]" title={deal.industry}>
                                {deal.industry}
                              </span>
                            </div>
                            <button
                              onClick={() => handleDeleteDeal(deal.id)}
                              className="text-slate-300 hover:text-red-500 p-0.5 rounded transition-colors"
                              title="Eliminar lead"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Location Indicator */}
                          {deal.city && (
                            <div className="text-[9px] text-slate-500 font-mono flex items-center gap-0.5 mt-[-2px]">
                              📍 {deal.city}
                            </div>
                          )}

                          {/* Diagnostic toggle */}
                          {deal.painPoint && (
                            <div>
                              <button
                                onClick={() => setExpandedDealId(expandedDealId === deal.id ? null : deal.id)}
                                className="text-[9px] text-blue-600 hover:underline flex items-center gap-0.5 font-bold"
                              >
                                <Info className="w-2.5 h-2.5" />
                                {expandedDealId === deal.id ? "Ocultar dolor IA" : "Ver dolor digital IA"}
                              </button>
                              {expandedDealId === deal.id && (
                                <div className="bg-amber-50/50 border border-amber-100 rounded-md p-1.5 text-[9px] text-slate-600 leading-normal mt-1 text-left">
                                  <strong className="text-amber-800 block text-[8px] font-bold uppercase tracking-wider mb-0.5">Dolor Detectado:</strong>
                                  {deal.painPoint}
                                  {deal.phone && <div className="mt-1 text-[8px] text-slate-400 border-t border-slate-100/50 pt-0.5 font-mono">📞 {deal.phone}</div>}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Amount and controls */}
                          <div className="flex items-center justify-between border-t border-slate-100 pt-1.5 mt-0.5">
                            <span className="font-extrabold text-slate-800 font-mono text-[10px]">
                              ${deal.amount.toLocaleString("es-AR")}
                            </span>
                            <div className="flex items-center gap-0.5">
                              {stage.key !== "leads" && (
                                <button
                                  onClick={() => {
                                    const index = stages.findIndex((s) => s.key === stage.key);
                                    moveDeal(deal.id, "prev");
                                  }}
                                  className="p-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[9px] font-bold w-4 h-4 flex items-center justify-center transition-colors cursor-pointer"
                                  title="Mover a etapa anterior"
                                >
                                  ‹
                                </button>
                              )}
                              {stage.key !== "closed" && (
                                <button
                                  onClick={() => {
                                    const index = stages.findIndex((s) => s.key === stage.key);
                                    moveDeal(deal.id, "next");
                                  }}
                                  className="p-0.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-[9px] font-bold w-4 h-4 flex items-center justify-center transition-colors cursor-pointer"
                                  title="Mover a siguiente etapa"
                                >
                                  ›
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* PROSPECTOR VIEW */
        <div className="animate-fadeIn grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Query Inputs Card */}
          <div className="md:col-span-2 border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex flex-col gap-3.5">
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2.5">
              <h5 className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Inteligencia Patagónica 🛰️
              </h5>
              <p className="text-[10px] text-emerald-700 leading-normal mt-0.5 font-light">
                Escaneá bases locales de Google Maps en Río Negro o Neuquén. Encontraremos negocios reales analizando su dolor digital.
              </p>
            </div>

            {/* Province Toggle */}
            <div className="flex flex-col gap-1 text-left">
              <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono">Provincia</label>
              <div className="grid grid-cols-2 gap-1 bg-white p-1 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setProspectProv("RN")}
                  className={`py-1 text-xs font-bold rounded ${
                    prospectProv === "RN"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Río Negro
                </button>
                <button
                  type="button"
                  onClick={() => setProspectProv("NQ")}
                  className={`py-1 text-xs font-bold rounded ${
                    prospectProv === "NQ"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Neuquén
                </button>
              </div>
            </div>

            {/* City dropdown */}
            <div className="flex flex-col gap-1 text-left">
              <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono">Ciudad</label>
              <select
                value={prospectCity}
                onChange={(e) => setProspectCity(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              >
                {(prospectProv === "RN" ? CITIES_RN : CITIES_NQ).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Rubro dropdown */}
            <div className="flex flex-col gap-1 text-left">
              <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono">Rubro del Negocio</label>
              <select
                value={prospectIndustry}
                onChange={(e) => {
                  setProspectIndustry(e.target.value);
                  setCustomIndustry("");
                }}
                className="bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              >
                {INDUSTRIES_PRESET.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
                <option value="OTRO">Otro rubro personalizado...</option>
              </select>
            </div>

            {/* Custom Industry Input */}
            {prospectIndustry === "OTRO" && (
              <div className="flex flex-col gap-1 text-left">
                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono">Especificar Rubro</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Veterinaria, Taller Mecánico..."
                  value={customIndustry}
                  onChange={(e) => setCustomIndustry(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {/* Action CTA Button */}
            <button
              onClick={handleProspectLeads}
              disabled={prospectLoading || (prospectIndustry === "OTRO" && !customIndustry.trim())}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-xs disabled:opacity-50 cursor-pointer mt-2"
            >
              <Search className="w-3.5 h-3.5" />
              {prospectLoading ? "Escaneando con IA..." : `Buscar Prospectos en ${prospectCity}`}
            </button>
          </div>

          {/* Results Area */}
          <div className="md:col-span-3 border border-slate-200 rounded-xl p-4 bg-white flex flex-col justify-between min-h-[340px]">
            {/* Initial Screen / Loader / Results */}
            {prospectLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 animate-pulse gap-3">
                <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
                <h5 className="text-xs font-extrabold text-slate-700">Analizando Datos Satelitales de Google Search</h5>
                <p className="text-[10px] text-slate-400 max-w-xs leading-relaxed">
                  Buscando comercios locales activos en <strong className="text-slate-600">{prospectCity}</strong>. La IA redactará el dolor comercial identificando la falta de automatización.
                </p>
              </div>
            ) : prospectError ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-red-800 gap-2">
                <AlertTriangle className="w-8 h-8 text-red-500" />
                <h5 className="text-xs font-bold">Error de Radar de Prospección</h5>
                <p className="text-[10px] text-red-600">{prospectError}</p>
              </div>
            ) : prospectsResult.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400 gap-2">
                <div className="text-3xl">🛰️</div>
                <h5 className="text-xs font-bold text-slate-700">Radar Satelital en Espera</h5>
                <p className="text-[10px] text-slate-400 max-w-xs leading-relaxed">
                  Elegí la ciudad y rubro en el panel izquierdo y dale a buscar. El modelo traerá datos reales y diagnosticará su dolor comercial.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[400px] pr-1">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-1">
                  <h5 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    Prospectos detectados en {prospectCity}
                  </h5>
                  <span className="bg-emerald-50 text-emerald-700 text-[9px] font-extrabold px-2 py-0.5 rounded-full font-mono">
                    {prospectsResult.length} ENCONTRADOS
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {prospectsResult.map((p, idx) => {
                    const alreadyAdded = addedProspectNames.includes(p.company) || deals.some(d => d.company === p.company);
                    return (
                      <div
                        key={idx}
                        className="border border-slate-150 rounded-xl p-3 bg-slate-50/40 hover:border-emerald-300 hover:bg-white transition-all flex flex-col gap-2 border-l-4 border-l-emerald-500 text-left"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h6 className="font-extrabold text-xs text-slate-800 leading-tight">{p.company}</h6>
                            <span className="inline-block bg-slate-100 text-slate-600 text-[8px] font-bold px-1.5 py-0.5 rounded-md mt-1 font-mono">
                              📍 {p.city}
                            </span>
                          </div>
                          <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-100/50 px-2 py-1 rounded-lg font-mono">
                            ${p.amount?.toLocaleString("es-AR")}
                          </span>
                        </div>

                        {/* Address & contact details */}
                        <div className="text-[9.5px] text-slate-500 leading-relaxed border-t border-b border-slate-100 py-1.5 my-0.5 grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            <span className="truncate">{p.address}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            <span className="font-mono truncate">{p.phone}</span>
                          </div>
                          <div className="flex items-center gap-1.5 sm:col-span-2">
                            <User className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            <span className="truncate">Contacto: <strong className="font-semibold text-slate-600">{p.contact}</strong></span>
                          </div>
                        </div>

                        {/* Pain point callout */}
                        <div className="bg-amber-50/70 border border-amber-100 rounded-lg p-2 text-[10px] text-slate-700 leading-relaxed text-left">
                          <span className="font-extrabold flex items-center gap-1 text-amber-800 text-[9px] uppercase tracking-wider mb-0.5">
                            <AlertTriangle className="w-3 h-3 text-amber-500" />
                            Dolor Comercial de Atención (IA):
                          </span>
                          <p className="text-[10px] font-sans font-light leading-relaxed text-slate-600">{p.painPoint}</p>
                        </div>

                        {/* Add to pipeline button */}
                        <button
                          onClick={() => handleAddProspectedLead(p)}
                          disabled={alreadyAdded}
                          className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            alreadyAdded
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-slate-900 text-white hover:bg-slate-950 active:bg-black shadow-xs"
                          }`}
                        >
                          {alreadyAdded ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-500" />
                              Lead Cargado con Éxito al CRM
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4" />
                              Sincronizar y Agregar a mi Embudo CRM
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

