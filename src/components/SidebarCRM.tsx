import React, { useState, useEffect } from "react";
import { CRMDeal, BrochureData } from "../types";
import { INITIAL_DEALS } from "../data";
import { loadDeals, saveDeals, addActivity, DEALS_EVENT } from "../store/sharedStore";
import {
  Users,
  DollarSign,
  Plus,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Award,
  Search,
  Building2,
  MapPin,
  Phone,
  User,
  Sparkles,
  Check,
  Compass,
  Info,
  RefreshCw,
  FileDown,
  ExternalLink
} from "lucide-react";

interface SidebarCRMProps {
  brochureData: BrochureData;
  hidePrices: boolean;
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

export default function SidebarCRM({ brochureData, hidePrices, onChange }: SidebarCRMProps) {
  // Navigation inside CRM: "pipeline" (Active pipeline) or "prospector" (Find leads in RN/NQ)
  const [crmSubTab, setCrmSubTab] = useState<"pipeline" | "prospector">("pipeline");

  // Load initial deals from brochureData or the shared store (synced across
  // every tab: Pipeline, Patagonia Explorer, Creación Rápida, Actividad).
  const [deals, setDeals] = useState<CRMDeal[]>(() => {
    if (brochureData?.crm?.deals && brochureData.crm.deals.length > 0) {
      return brochureData.crm.deals;
    }
    const saved = loadDeals();
    if (saved.length > 0) return saved;
    return INITIAL_DEALS;
  });

  // Live-sync: pick up deals created/edited from other tabs without a reload.
  useEffect(() => {
    const handleExternalDealsUpdate = (e: Event) => {
      const updated = (e as CustomEvent<CRMDeal[]>).detail ?? loadDeals();
      setDeals((prev) => (JSON.stringify(prev) !== JSON.stringify(updated) ? updated : prev));
    };
    window.addEventListener(DEALS_EVENT, handleExternalDealsUpdate);
    return () => window.removeEventListener(DEALS_EVENT, handleExternalDealsUpdate);
  }, []);

  // Form states (Manual Lead Registration)
  const [showAddForm, setShowAddForm] = useState(false);
  const [company, setCompany] = useState("");
  const [amount, setAmount] = useState("");
  const [industry, setIndustry] = useState("Distribuidora");
  const [stage, setStage] = useState<CRMDeal["stage"]>("leads");

  // Selected stage tab for the sidebar kanban view
  const [selectedStageTab, setSelectedStageTab] = useState<CRMDeal["stage"]>("leads");

  // Expanded card for diagnostic details
  const [expandedDealId, setExpandedDealId] = useState<string | null>(null);

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

  // Sync external changes from brochureData
  useEffect(() => {
    if (brochureData?.crm?.deals) {
      const currentDeals = brochureData.crm.deals;
      if (JSON.stringify(currentDeals) !== JSON.stringify(deals)) {
        setDeals(currentDeals);
      }
    }
  }, [brochureData?.crm?.deals]);

  // Save to the shared store when deals change and propagate to brochureData
  useEffect(() => {
    saveDeals(deals);
    if (onChange) {
      const currentDeals = brochureData?.crm?.deals || [];
      if (JSON.stringify(currentDeals) !== JSON.stringify(deals)) {
        onChange({
          ...brochureData,
          crm: {
            ...brochureData.crm,
            deals: deals
          }
        });
      }
    }
  }, [deals]);

  const handleAddDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim()) return;

    const parsedAmount = parseFloat(amount) || 0;
    const newDeal: CRMDeal = {
      id: "deal-" + Date.now(),
      company: company.trim(),
      amount: parsedAmount,
      industry: industry.trim(),
      stage: stage,
    };

    setDeals((prev) => [newDeal, ...prev]);
    setCompany("");
    setAmount("");
    setShowAddForm(false);
  };

  const handleExportToCSV = () => {
    if (!deals || deals.length === 0) {
      alert("No hay contactos o leads registrados para exportar.");
      return;
    }

    // CSV Headers
    const headers = [
      "ID",
      "Empresa",
      "Monto_ARS",
      "Etapa_CRM",
      "Rubro_Industria",
      "Ciudad",
      "Direccion",
      "Telefono",
      "Contacto",
      "Punto_de_Dolor"
    ];

    // CSV Rows
    const rows = deals.map((deal) => [
      deal.id,
      `"${(deal.company || "").replace(/"/g, '""')}"`,
      deal.amount,
      `"${deal.stage}"`,
      `"${(deal.industry || "").replace(/"/g, '""')}"`,
      `"${(deal.city || "").replace(/"/g, '""')}"`,
      `"${(deal.address || "").replace(/"/g, '""')}"`,
      `"${(deal.phone || "").replace(/"/g, '""')}"`,
      `"${(deal.contact || "").replace(/"/g, '""')}"`,
      `"${(deal.painPoint || "").replace(/"/g, '""')}"`
    ]);

    // Combine headers and rows with UTF-8 BOM
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    
    const companyName = brochureData.testimonial?.company || "Pymes";
    const fileName = `clientum_crm_contactos_${companyName.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.csv`;
    
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteDeal = (id: string) => {
    setDeals((prev) => prev.filter((deal) => deal.id !== id));
  };

  const moveDeal = (id: string, direction: "next" | "prev") => {
    const stages: CRMDeal["stage"][] = ["leads", "contacted", "proposal", "closed"];
    let movedDeal: CRMDeal | null = null;
    setDeals((prev) =>
      prev.map((deal) => {
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
      })
    );
    if (movedDeal) {
      addActivity({ type: "stage", title: `"${movedDeal.company}" pasó a la etapa "${movedDeal.stage}"` });
    }
  };

  // Run AI Prospector search via Gemini API
  const handleProspectLeads = async () => {
    setProspectLoading(true);
    setProspectError("");
    setProspectsResult([]);

    const selectedIndustry = customIndustry.trim() || prospectIndustry;

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

    setDeals((prev) => [newDeal, ...prev]);
    setAddedProspectNames((prev) => [...prev, p.company]);
  };

  // Get metrics
  const totalClosedVal = deals
    .filter((d) => d.stage === "closed")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const activeLeadsCount = deals.filter((d) => d.stage !== "closed").length;
  const closedCount = deals.filter((d) => d.stage === "closed").length;

  // Dynamic recommendations based on brochure state
  const getRecommendations = () => {
    const recs: { id: string; type: "warning" | "info" | "success"; title: string; desc: string }[] = [];

    // 1. Hide prices check
    if (hidePrices) {
      recs.push({
        id: "rec-prices",
        type: "warning",
        title: "Precios Ocultos Activos",
        desc: "Tenés la opción de ocultar precios. En el mercado argentino, la transparencia de precios acelera el avance de tus leads de la etapa 'Contacto Bot' a 'Propuesta' en un 35%. Evaluá mostrarlos.",
      });
    } else {
      recs.push({
        id: "rec-prices-ok",
        type: "success",
        title: "Estrategia de Precios Transparente",
        desc: "¡Excelente! Al mostrar los valores de tus planes abiertamente, generás confianza inmediata y pre-calificás mejor a tus prospectos.",
      });
    }

    // 2. Personalization check
    const isDefault = brochureData.cover.slogan === "Tecnología real para PyMEs reales.";
    if (isDefault) {
      recs.push({
        id: "rec-default-copy",
        type: "info",
        title: "Potenciá la Conversión de Leads",
        desc: "Tu brochure actual usa textos generales. Usá el Copiloto IA en el sidebar para redactar los textos según el rubro de tus leads y convertirlos más rápido.",
      });
    } else {
      recs.push({
        id: "rec-custom-copy",
        type: "success",
        title: "Brochure de Nicho Activo",
        desc: "¡Muy bien! El brochure está optimizado para un nicho de mercado. Esto aumenta un 50% la tasa de cierre en la etapa de 'Propuesta'.",
      });
    }

    // 3. Outreach email generated check
    if (brochureData.outreachEmail) {
      recs.push({
        id: "rec-outreach",
        type: "success",
        title: "Correo de Prospección Listo",
        desc: "Ya tenés un correo comercial personalizado con voseo. Copialo de la pestaña 'Copiloto IA' para contactar a tus prospectos en la etapa 'Nuevos Leads'.",
      });
    } else {
      recs.push({
        id: "rec-no-outreach",
        type: "warning",
        title: "Falta Plantilla de Contacto",
        desc: "No tenés un correo comercial redactado por la IA. Escribí el rubro de tus leads y dale a 'Generar contenido con IA' para que redactemos tu primer mail de contacto.",
      });
    }

    // 4. Funnel-driven recommendations
    const leadCount = deals.filter((d) => d.stage === "leads").length;
    if (leadCount >= 3) {
      recs.push({
        id: "rec-pipeline-leads",
        type: "info",
        title: "Muchos Prospectos Fríos",
        desc: "Tenés bastantes leads en 'Nuevos Leads'. Enviá el correo de prospección voseado o activá el Bot calificador de WhatsApp para que filtremos automáticamente por vos.",
      });
    }

    const closedDealsCount = deals.filter((d) => d.stage === "closed").length;
    if (closedDealsCount > 0) {
      recs.push({
        id: "rec-pipeline-closed",
        type: "success",
        title: "Facturación AFIP Automática",
        desc: `Tenés ${closedDealsCount} venta(s) ganada(s). Clientum ya emitió sus facturas electrónicas Clase A/B en AFIP y les envió el link de pago sin trabajo manual.`,
      });
    }

    return recs;
  };

  const recommendations = getRecommendations();

  const getStageLabel = (key: CRMDeal["stage"]): string => {
    if (brochureData?.crm?.stageLabels?.[key]) {
      return brochureData.crm.stageLabels[key];
    }
    switch (key) {
      case "leads": return "Leads";
      case "contacted": return "WhatsApp Bot";
      case "proposal": return "Propuesta";
      case "closed": return "Ganados";
      default: return String(key);
    }
  };

  // Stages configuration
  const stageTabs: { key: CRMDeal["stage"]; label: string; color: string; badgeColor: string }[] = [
    { key: "leads", label: getStageLabel("leads"), color: "text-slate-700 border-slate-200", badgeColor: "bg-slate-100 text-slate-800" },
    { key: "contacted", label: getStageLabel("contacted"), color: "text-emerald-700 border-emerald-200", badgeColor: "bg-emerald-100 text-emerald-800" },
    { key: "proposal", label: getStageLabel("proposal"), color: "text-blue-700 border-blue-200", badgeColor: "bg-blue-100 text-blue-800" },
    { key: "closed", label: getStageLabel("closed"), color: "text-green-700 border-green-200", badgeColor: "bg-green-100 text-green-800" },
  ];

  const filteredDeals = deals.filter((d) => d.stage === selectedStageTab);

  return (
    <div className="flex flex-col gap-4 text-left no-print">
      {/* Sub tabs to switch between pipeline and prospector */}
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1">
        <button
          onClick={() => setCrmSubTab("pipeline")}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
            crmSubTab === "pipeline"
              ? "bg-white text-slate-800 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-blue-500" />
          Mi Embudo CRM
        </button>
        <button
          onClick={() => setCrmSubTab("prospector")}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
            crmSubTab === "prospector"
              ? "bg-white text-slate-800 shadow-xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          Prospectador IA Patagónico
        </button>
      </div>

      {/* PIPELINE VIEW */}
      {crmSubTab === "pipeline" ? (
        <div className="flex flex-col gap-4">
          {/* Metrics Banner */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Leads Activos</span>
              <strong className="text-base text-slate-800 flex items-center gap-1 mt-0.5">
                <Users className="w-4 h-4 text-blue-500" />
                {activeLeadsCount}
              </strong>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2.5">
              <span className="block text-[9px] font-bold text-emerald-600 uppercase tracking-wider font-mono">Facturado Ganado</span>
              <strong className="text-base text-emerald-800 flex items-center gap-0.5 mt-0.5">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                ${totalClosedVal.toLocaleString("es-AR")}
              </strong>
            </div>
          </div>

          {/* Button to show Add Form and Export to CSV */}
          <div>
            {!showAddForm ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Nuevo Lead
                </button>
                <button
                  onClick={handleExportToCSV}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  title="Exportar la lista completa de contactos y leads a un archivo CSV para integrar con tu CRM"
                >
                  <FileDown className="w-3.5 h-3.5 text-blue-500" />
                  Exportar CSV
                </button>
              </div>
            ) : (
              <form onSubmit={handleAddDeal} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-2.5 animate-fadeIn">
                <h4 className="text-xs font-bold text-slate-800 border-b border-slate-200 pb-1.5">Nuevo Prospecto de Venta</h4>
                
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500">Nombre de la Empresa</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Distribuidora Cuyo"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="bg-white border border-slate-250 rounded-lg p-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500">Monto Estimado (ARS)</label>
                    <input
                      type="number"
                      placeholder="Ej. 180000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-white border border-slate-250 rounded-lg p-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500">Etapa Inicial</label>
                    <select
                      value={stage}
                      onChange={(e) => setStage(e.target.value as any)}
                      className="bg-white border border-slate-250 rounded-lg p-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                    >
                      <option value="leads">Nuevos Leads</option>
                      <option value="contacted">Contacto Bot</option>
                      <option value="proposal">Propuesta</option>
                      <option value="closed">Ganado 🎉</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500">Rubro/Industria</label>
                  <input
                    type="text"
                    placeholder="Ej. Bodega, Corralón, Gastronomía"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="bg-white border border-slate-250 rounded-lg p-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-1.5 mt-1 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] font-bold py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    Guardar Lead
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Compact Pipeline Visualizer - Stage Selector Tabs */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <div className="bg-slate-50 border-b border-slate-200 p-2 text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Embudo de Ventas Interactivo</span>
              <span className="text-[10px] font-medium text-slate-400 font-mono">Totales: {deals.length}</span>
            </div>
            
            {/* Stage selection tabs */}
            <div className="flex border-b border-slate-100 bg-slate-50/50">
              {stageTabs.map((s) => {
                const count = deals.filter((d) => d.stage === s.key).length;
                const isSelected = selectedStageTab === s.key;
                return (
                  <button
                    key={s.key}
                    onClick={() => setSelectedStageTab(s.key)}
                    className={`flex-1 py-2 text-[10px] font-bold text-center border-b-2 flex flex-col items-center justify-center gap-0.5 transition-all ${
                      isSelected
                        ? "border-blue-600 text-blue-600 bg-white"
                        : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>{s.label}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold ${s.badgeColor}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Deals list in selected stage */}
            <div className="p-2.5 max-h-[260px] overflow-y-auto flex flex-col gap-2 min-h-[120px] bg-slate-50/20">
              {filteredDeals.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-8 text-center text-slate-400">
                  <Users className="w-6 h-6 stroke-1 mb-1.5 text-slate-300" />
                  <p className="text-[11px]">No hay leads en esta etapa.</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">¡Registrá un nuevo lead o buscá en el Prospectador IA!</p>
                </div>
              ) : (
                filteredDeals.map((deal) => (
                  <div
                    key={deal.id}
                    className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-xs flex flex-col gap-1.5 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <h5 className="text-xs font-bold text-slate-800 truncate max-w-[190px]">{deal.company}</h5>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="inline-block bg-blue-50 text-blue-700 text-[9px] font-semibold px-1.5 py-0.5 rounded-md font-mono">
                            {deal.industry}
                          </span>
                          {deal.city && (
                            <span className="inline-block bg-slate-100 text-slate-600 text-[9px] font-semibold px-1.5 py-0.5 rounded-md font-mono">
                              📍 {deal.city}
                            </span>
                          )}
  
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteDeal(deal.id)}
                        className="text-slate-300 hover:text-red-500 p-1 rounded-md transition-colors"
                        title="Eliminar lead"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Expand details toggler if has pain point */}
                    {deal.painPoint && (
                      <button
                        onClick={() => setExpandedDealId(expandedDealId === deal.id ? null : deal.id)}
                        className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5 text-left font-semibold mt-0.5"
                      >
                        <Info className="w-3 h-3" />
                        {expandedDealId === deal.id ? "Ocultar diagnóstico comercial" : "Ver diagnóstico comercial IA"}
                      </button>
                    )}

                    {/* Expanded diagnostics details */}
                    {expandedDealId === deal.id && deal.painPoint && (
                      <div className="text-[10px] bg-slate-50 border border-slate-150 rounded-lg p-2 flex flex-col gap-1 mt-0.5 text-slate-600 leading-normal animate-fadeIn">
                        {deal.contact && <div><strong>Dueño/Contacto:</strong> {deal.contact}</div>}
                        {deal.address && <div><strong>Dirección:</strong> {deal.address}</div>}
                        {deal.phone && (
                          <div>
                            <strong>Teléfono:</strong>{" "}
                            <span className="text-slate-800 font-mono">{deal.phone}</span>
                          </div>
                        )}

                          <div>
                            <strong>Directorio:</strong>{" "}
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline inline-flex items-center gap-0.5 font-semibold"
                            >
                              <span>Ver en Guía Cores</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>

                        <div className="text-red-800 bg-red-50/50 p-1.5 rounded-md border border-red-100 mt-1">
                          <strong>Dolor Digital Diagnosticado:</strong>
                          <p className="mt-0.5 font-sans leading-relaxed text-slate-700">{deal.painPoint}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between border-t border-slate-100 pt-1.5 mt-1">
                      <span className="text-xs font-extrabold text-slate-800 font-mono">
                        ${deal.amount.toLocaleString("es-AR")}
                      </span>

                      {/* Micro stage switchers */}
                      <div className="flex items-center gap-1">
                        {selectedStageTab !== "leads" && (
                          <button
                            onClick={() => moveDeal(deal.id, "prev")}
                            className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors flex items-center justify-center cursor-pointer"
                            title="Retroceder etapa"
                          >
                            <ArrowLeft className="w-3 h-3" />
                          </button>
                        )}

                        {selectedStageTab !== "closed" && (
                          <button
                            onClick={() => moveDeal(deal.id, "next")}
                            className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center justify-center cursor-pointer"
                            title="Avanzar etapa"
                          >
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}

                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Dynamic Recommendations Section */}
          <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/40">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Recomendaciones Estratégicas IA
            </h4>
            <div className="flex flex-col gap-2.5">
              {recommendations.slice(0, 3).map((rec) => (
                <div
                  key={rec.id}
                  className={`text-[11px] p-2.5 rounded-lg border flex items-start gap-2 leading-relaxed ${
                    rec.type === "warning"
                      ? "bg-red-50 border-red-100 text-red-800"
                      : rec.type === "success"
                      ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                      : "bg-blue-50 border-blue-100 text-blue-800"
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {rec.type === "warning" ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                    ) : rec.type === "success" ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Lightbulb className="w-3.5 h-3.5 text-blue-500" />
                    )}
                  </div>
                  <div>
                    <strong className="block font-bold mb-0.5">{rec.title}</strong>
                    <span>{rec.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* PROSPECTOR VIEW (SEARCH CITIES IN RIO NEGRO & NEUQUEN) */
        <div className="flex flex-col gap-3 animate-fadeIn">
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
            <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4" />
              Buscador Satelital de Prospectos IA
            </h4>
            <p className="text-[10px] text-emerald-700 leading-relaxed mb-2">
              Ingresá la ciudad de <strong>Río Negro o Neuquén</strong> y el rubro comercial. El modelo buscará e identificará automáticamente 5 prospectos reales o realistas analizando su dolor digital.
            </p>
            <div className="border-t border-emerald-100/75 pt-2 flex items-center justify-between">
              <span className="text-[9px] text-emerald-600 font-mono">Motor de Prospección v2.0</span>
              <a
                href="https://github.com/paulogirto-hub/prospector"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1.5 transition-all hover:underline"
                title="Explorá el código fuente del Prospector en GitHub"
              >
                <svg className="w-3.5 h-3.5 fill-current text-emerald-700" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub Engine
              </a>
            </div>
          </div>

          <div className="border border-slate-200 bg-white rounded-xl p-3 flex flex-col gap-2.5">
            {/* Province Toggle */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500">Provincia Argentina</label>
              <div className="grid grid-cols-2 gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-150">
                <button
                  type="button"
                  onClick={() => setProspectProv("RN")}
                  className={`py-1 text-xs font-bold rounded ${
                    prospectProv === "RN"
                      ? "bg-slate-800 text-white shadow-xs"
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
                      ? "bg-slate-800 text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Neuquén
                </button>
              </div>
            </div>

            {/* City Selection */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500">Ciudad de la Patagonia</label>
              <select
                value={prospectCity}
                onChange={(e) => setProspectCity(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none"
              >
                {(prospectProv === "RN" ? CITIES_RN : CITIES_NQ).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Rubro selection */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500">Rubro del Negocio</label>
              <select
                value={prospectIndustry}
                onChange={(e) => {
                  setProspectIndustry(e.target.value);
                  setCustomIndustry(""); // reset custom input
                }}
                className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none"
              >
                {INDUSTRIES_PRESET.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
                <option value="OTRO">Otro rubro personalizado...</option>
              </select>
            </div>

            {/* Custom Industry Input (if "OTRO" is selected) */}
            {prospectIndustry === "OTRO" && (
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500">Especificar Rubro Personalizado</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Veterinaria, Taller Mecánico..."
                  value={customIndustry}
                  onChange={(e) => setCustomIndustry(e.target.value)}
                  className="bg-slate-50 border border-slate-250 rounded-lg p-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {/* Search CTA button */}
            <button
              onClick={handleProspectLeads}
              disabled={prospectLoading || (prospectIndustry === "OTRO" && !customIndustry.trim())}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              {prospectLoading ? "Prospectando por IA..." : `Buscar Leads en ${prospectCity}`}
            </button>
          </div>

          {/* Loader or Error */}
          {prospectLoading && (
            <div className="bg-slate-50 border border-slate-150 rounded-xl p-6 text-center animate-pulse flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin" />
              <span className="text-xs font-bold text-slate-700">Analizando registros patagónicos</span>
              <p className="text-[10px] text-slate-400">Gemini está identificando comercios reales, obteniendo teléfonos locales y redactando el dolor digital...</p>
            </div>
          )}

          {prospectError && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-red-800 flex items-start gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <strong className="font-bold">Error de búsqueda:</strong>
                <p className="mt-0.5 text-red-700">{prospectError}</p>
              </div>
            </div>
          )}

          {/* PROSPECT RESULTS LIST */}
          {prospectsResult.length > 0 && (
            <div className="flex flex-col gap-2.5 mt-1">
              <h4 className="text-xs font-bold text-slate-800 px-1 border-l-2 border-emerald-500">
                Prospectos Encontrados ({prospectsResult.length})
              </h4>
              <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
                {prospectsResult.map((p, idx) => {
                  const alreadyAdded = addedProspectNames.includes(p.company);
                  return (
                    <div
                      key={idx}
                      className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-col gap-2 hover:border-emerald-300 transition-all border-l-3 border-l-emerald-400 animate-fadeIn"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <h5 className="text-xs font-extrabold text-slate-800">{p.company}</h5>
                          <div className="flex flex-wrap gap-1 mt-1">
                          {p.city && (
                            <span className="inline-block bg-emerald-50 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded-md font-mono">
                              📍 {p.city}
                            </span>
                          )}
                              <a
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded-md font-mono transition-colors border border-blue-100/50"
                                title="Ver ficha o búsqueda en Guía Cores"
                              >
                                <span>Guía Cores</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
    
                          </div>
                        </div>
                        <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg font-mono">
                          ${p.amount?.toLocaleString("es-AR")}
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-500 flex flex-col gap-1 border-t border-b border-slate-100 py-1.5 my-0.5">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span>{p.address}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span className="font-mono">{p.phone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span>Contacto: {p.contact}</span>
                        </div>
                      </div>

                      {/* Diagnostic Pain Point */}
                      <div className="bg-amber-50/70 border border-amber-100 rounded-lg p-2 text-[10px] text-amber-900">
                        <span className="font-bold flex items-center gap-1 text-amber-800">
                          <AlertTriangle className="w-3 h-3 text-amber-500" />
                          Dolor de Atención / Comercial:
                        </span>
                        <p className="mt-0.5 leading-relaxed text-slate-700">{p.painPoint}</p>
                      </div>

                      {/* Add Button */}
                      <button
                        onClick={() => handleAddProspectedLead(p)}
                        disabled={alreadyAdded}
                        className={`w-full py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                          alreadyAdded
                            ? "bg-slate-100 text-slate-400 border border-slate-200"
                            : "bg-slate-800 text-white hover:bg-slate-900 active:bg-black"
                        }`}
                      >
                        {alreadyAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            Lead Agregado al CRM
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            Agregar a mis Leads CRM
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
      )}
    </div>
  );
}
