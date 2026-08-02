import React, { useState, useEffect } from "react";
import { BrochureData, CustomTemplate } from "../types";
import { Sliders, Edit3, Sparkles, RefreshCw, Send, CheckCircle2, AlertTriangle, Languages, Users, Globe, Image, Eye, X, Check, Save, Trash2, FolderHeart, Plus, Clock, PlusCircle } from "lucide-react";
import SidebarCRM from "./SidebarCRM";
import ChatbotSim from "./ChatbotSim";
import { INITIAL_DEALS } from "../data";
import ActivityTab from "./sidebar-tabs/ActivityTab";
import QuickCreateTab from "./sidebar-tabs/QuickCreateTab";

interface SidebarEditorProps {
  data: BrochureData;
  onChange: (newData: BrochureData) => void;
  preset: string;
  onPresetChange: (presetKey: string) => void;
  colorTheme: string;
  onThemeChange: (theme: string) => void;
  contactInfo: {
    website: string;
    email: string;
    phone: string;
    address: string;
    github?: string;
  };
  onContactChange: (info: any) => void;
  hidePrices: boolean;
  onHidePricesChange: (hide: boolean) => void;
  hideChatbot?: boolean;
  onHideChatbotChange?: (hide: boolean) => void;
  customTemplates?: CustomTemplate[];
  onSaveTemplate?: (name: string) => void;
  onDeleteTemplate?: (id: string) => void;
  /** When provided, the tab shown is controlled externally (e.g. by a unified top-level nav) instead of internal state. */
  activeTabOverride?: "config" | "pages" | "ai" | "crm" | "activity" | "quickcreate";
  /** Hides this component's own tab bar — used when a parent nav already exposes these tabs. */
  hideTabs?: boolean;
}

export default function SidebarEditor({
  data,
  onChange,
  preset,
  onPresetChange,
  colorTheme,
  onThemeChange,
  contactInfo,
  onContactChange,
  hidePrices,
  onHidePricesChange,
  hideChatbot = false,
  onHideChatbotChange,
  customTemplates = [],
  onSaveTemplate,
  onDeleteTemplate,
  activeTabOverride,
  hideTabs = false,
}: SidebarEditorProps) {
  const [internalActiveTab, setInternalActiveTab] = useState<"config" | "pages" | "ai" | "crm" | "activity" | "quickcreate">("config");
  const activeTab = activeTabOverride ?? internalActiveTab;
  const setActiveTab = setInternalActiveTab;
  const [selectedPageEdit, setSelectedPageEdit] = useState<number>(1);
  const [aiIndustry, setAiIndustry] = useState("Bodega de Vinos");
  const [aiGoal, setAiGoal] = useState("Más persuasivo y cercano");
  const [textToOptimize, setTextToOptimize] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [optimizedResult, setOptimizedResult] = useState("");
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  // AI Image generator states
  const [selectedImagePage, setSelectedImagePage] = useState<number>(1);
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageGenerating, setImageGenerating] = useState(false);
  const [imageError, setImageError] = useState("");

  // Save status indicator state
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "idle">("saved");

  useEffect(() => {
    setSaveStatus("saving");
    const timer = setTimeout(() => {
      setSaveStatus("saved");
    }, 600);
    return () => clearTimeout(timer);
  }, [data, preset, colorTheme, contactInfo, hidePrices, hideChatbot]);

  // Logo Preview Modal state
  const [showLogoModal, setShowLogoModal] = useState(false);

  // New Custom Template states
  const [newTemplateName, setNewTemplateName] = useState("");
  const [templateError, setTemplateError] = useState("");

  const handleContactFieldChange = (field: string, value: string) => {
    onContactChange({ ...contactInfo, [field]: value });
  };

  const handleFieldChange = (section: string, field: string, value: any) => {
    const updated = { ...data } as any;
    if (updated[section]) {
      updated[section][field] = value;
      onChange(updated);
    }
  };

  const handleFeatureChange = (section: string, index: number, field: string, value: string) => {
    const updated = { ...data } as any;
    if (updated[section] && updated[section].features) {
      updated[section].features[index][field] = value;
      onChange(updated);
    }
  };

  const handleServiceChange = (index: number, field: string, value: string) => {
    const updated = { ...data };
    updated.services[index] = { ...updated.services[index], [field]: value };
    onChange(updated);
  };

  const handleServiceBulletChange = (serviceIndex: number, bulletIndex: number, value: string) => {
    const updated = { ...data };
    const updatedBullets = [...updated.services[serviceIndex].bullets];
    updatedBullets[bulletIndex] = value;
    updated.services[serviceIndex].bullets = updatedBullets;
    onChange(updated);
  };

  const handleStageLabelChange = (key: "leads" | "bot_contact" | "proposed" | "closed", val: string) => {
    const updated = { ...data };
    if (!updated.crm.stageLabels) {
      updated.crm.stageLabels = {
        leads: "Nuevos Leads",
        bot_contact: "Contacto Bot",
        proposed: "Propuesta",
        closed: "Ganado 🎉"
      };
    }
    updated.crm.stageLabels[key] = val;
    onChange(updated);
  };

  const handleDealChange = (index: number, field: string, val: any) => {
    const updated = { ...data };
    if (!updated.crm.deals) {
      updated.crm.deals = JSON.parse(JSON.stringify(INITIAL_DEALS));
    }
    const deals = [...updated.crm.deals];
    deals[index] = { ...deals[index], [field]: val };
    updated.crm.deals = deals;
    onChange(updated);
  };

  // Backend Gemini calls
  const handleAiIndustryGenerate = async () => {
    if (!aiIndustry.trim()) return;
    setAiLoading(true);
    setAiError("");
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generateIndustryCopy",
          payload: { industry: aiIndustry },
        }),
      });
      const resData = await response.json();
      if (resData.error) throw new Error(resData.error);
      if (resData.result) {
        onChange(resData.result);
        alert(`¡Brochure personalizado exitosamente para el rubro: ${aiIndustry}!`);
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "No se pudo conectar con el servidor de IA.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleAiPresetGenerate = async () => {
    const getPresetLabel = (key: string) => {
      switch (key) {
        case "agro": return "Agropecuaria & Logística de Granos";
        case "inmobiliaria": return "Inmobiliaria & Administradora de Inmuebles";
        case "distribuidora": return "Distribuidora de Alimentos & Mayorista";
        case "gastronomia": return "Gastronomía & Restoranes/Catering";
        case "salud": return "Clínicas, Salud & Estética";
        case "construccion": return "Construcción & Corralones";
        case "profesionales": return "Estudios Contables & Jurídicos";
        case "educacion": return "Academias & Colegios";
        default: return "Tecnología & Software SaaS";
      }
    };

    const targetIndustryName = getPresetLabel(preset);
    setAiLoading(true);
    setAiError("");
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generateIndustryCopy",
          payload: { industry: targetIndustryName },
        }),
      });
      const resData = await response.json();
      if (resData.error) throw new Error(resData.error);
      if (resData.result) {
        onChange(resData.result);
        alert(`¡Brochure personalizado exitosamente para el rubro: ${targetIndustryName}!`);
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "No se pudo conectar con el servidor de IA.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleAiOptimizeText = async () => {
    if (!textToOptimize.trim()) return;
    setAiLoading(true);
    setAiError("");
    setOptimizedResult("");
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "optimizeCopy",
          payload: { text: textToOptimize, goal: aiGoal },
        }),
      });
      const resData = await response.json();
      if (resData.error) throw new Error(resData.error);
      if (resData.result) {
        setOptimizedResult(resData.result);
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "Error al optimizar el texto con IA.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    setImageGenerating(true);
    setImageError("");
    try {
      let activeIndustry = aiIndustry;
      if (!activeIndustry || activeIndustry.trim() === "") {
        activeIndustry = preset === "default" ? "Pymes" : preset;
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generateImage",
          payload: {
            industry: activeIndustry,
            pageNumber: selectedImagePage,
            customPrompt: imagePrompt.trim() || undefined,
          },
        }),
      });

      const resData = await response.json();
      if (resData.error) throw new Error(resData.error);

      if (resData.result && resData.result.imageUrl) {
        const updated = { ...data };
        if (!updated.images) updated.images = {};
        updated.images[selectedImagePage] = resData.result.imageUrl;
        onChange(updated);
        setImagePrompt("");
        alert(`¡Imagen generada exitosamente para la página ${selectedImagePage}!`);
      } else {
        throw new Error("No se recibió una imagen válida de la IA.");
      }
    } catch (err: any) {
      console.error(err);
      setImageError(err.message || "Error al conectar con el servidor de imágenes.");
    } finally {
      setImageGenerating(false);
    }
  };

  const handleTranslate = async (lang: "English" | "Portuguese") => {
    setAiLoading(true);
    setAiError("");
    try {
      // Create a batch of texts to translate
      const sourceTexts = {
        coverSlogan: data.cover.slogan,
        coverSub: data.cover.sub,
        chatbotTitle: data.chatbot.title,
        crmTitle: data.crm.title,
        testimonialText: data.testimonial.text,
      };

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "translateBrochure",
          payload: { texts: sourceTexts, targetLanguage: lang },
        }),
      });
      const resData = await response.json();
      if (resData.error) throw new Error(resData.error);
      if (resData.result) {
        const trans = resData.result;
        const updated = {
          ...data,
          cover: { ...data.cover, slogan: trans.coverSlogan || data.cover.slogan, sub: trans.coverSub || data.cover.sub },
          chatbot: { ...data.chatbot, title: trans.chatbotTitle || data.chatbot.title },
          crm: { ...data.crm, title: trans.crmTitle || data.crm.title },
          testimonial: { ...data.testimonial, text: trans.testimonialText || data.testimonial.text },
        };
        onChange(updated);
        alert(`¡Brochure traducido exitosamente al ${lang === "English" ? "Inglés" : "Portugués"}!`);
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "Error al traducir con IA.");
    } finally {
      setAiLoading(false);
    }
  };

  const themes = [
    { key: "navy", label: "Azul y Verde (Clientum)", bg: "bg-[#1A3461]" },
    { key: "forest", label: "Verde Bosque Silvestre", bg: "bg-emerald-800" },
    { key: "amber", label: "Terracota & Ámbar", bg: "bg-amber-700" },
    { key: "charcoal", label: "Negro Carbón & Plata", bg: "bg-slate-800" },
  ];

  const getThemePalette = () => {
    switch (colorTheme) {
      case "forest":
        return {
          title: "PALETA BOSQUE SILVESTRE",
          colors: [
            { hex: "#022C22", textClass: "text-white" },
            { hex: "#064E3B", textClass: "text-white" },
            { hex: "#A7F3D0", textClass: "text-[#022C22]" },
            { hex: "#F0FDF4", textClass: "text-[#022C22]" },
            { hex: "#FFFFFF", textClass: "text-[#022C22]", border: "border border-slate-200" },
          ],
        };
      case "amber":
        return {
          title: "PALETA TERRACOTA & ÁMBAR",
          colors: [
            { hex: "#451A03", textClass: "text-white" },
            { hex: "#78350F", textClass: "text-white" },
            { hex: "#FDE68A", textClass: "text-[#451A03]" },
            { hex: "#FFFBEB", textClass: "text-[#451A03]" },
            { hex: "#FFFFFF", textClass: "text-[#451A03]", border: "border border-slate-200" },
          ],
        };
      case "charcoal":
        return {
          title: "PALETA NEGRO CARBÓN",
          colors: [
            { hex: "#0F172A", textClass: "text-white" },
            { hex: "#1E293B", textClass: "text-white" },
            { hex: "#CBD5E1", textClass: "text-[#0F172A]" },
            { hex: "#F8FAFC", textClass: "text-[#0F172A]" },
            { hex: "#FFFFFF", textClass: "text-[#0F172A]", border: "border border-slate-200" },
          ],
        };
      case "navy":
      default:
        return {
          title: "PALETA OFICIAL DE CLIENTUM",
          colors: [
            { hex: "#0A1628", textClass: "text-white" },
            { hex: "#1A3461", textClass: "text-white" },
            { hex: "#CBD5E1", textClass: "text-[#0A1628]" },
            { hex: "#F1F5F9", textClass: "text-[#0A1628]" },
            { hex: "#FFFFFF", textClass: "text-[#0A1628]", border: "border border-slate-200" },
          ],
        };
    }
  };

  const palette = getThemePalette();

  return (
    <div className="bg-white border-r border-slate-200 w-full md:w-[380px] flex flex-col h-full overflow-hidden no-print flex-shrink-0">
      {/* Synchronization Indicator */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-[10px] text-slate-500 font-mono">
        <span className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Sincronización local
        </span>
        {saveStatus === "saving" ? (
          <span className="text-amber-600 font-bold flex items-center gap-1 animate-pulse">
            <RefreshCw className="w-3 h-3 animate-spin" />
            Sincronizando...
          </span>
        ) : (
          <span className="text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Sincronizado
          </span>
        )}
      </div>

      {/* Editor Tabs */}
      {!hideTabs && (
      <div className="flex border-b border-slate-200 bg-slate-50">
        <button
          onClick={() => setActiveTab("config")}
          className={`flex-1 py-3 text-[11px] font-semibold flex items-center justify-center gap-1 border-b-2 transition-all ${
            activeTab === "config"
              ? "border-blue-600 text-blue-600 bg-white"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          Configuración
        </button>
        <button
          onClick={() => setActiveTab("pages")}
          className={`flex-1 py-3 text-[11px] font-semibold flex items-center justify-center gap-1 border-b-2 transition-all ${
            activeTab === "pages"
              ? "border-blue-600 text-blue-600 bg-white"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          Contenido
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          className={`flex-1 py-3 text-[11px] font-semibold flex items-center justify-center gap-1 border-b-2 transition-all ${
            activeTab === "ai"
              ? "border-blue-600 text-blue-600 bg-white"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Sparkles className="w-3 h-3 text-emerald-500 animate-pulse" />
          Copiloto IA
        </button>
        <button
          onClick={() => setActiveTab("crm")}
          className={`flex-1 py-3 text-[11px] font-semibold flex items-center justify-center gap-1 border-b-2 transition-all ${
            activeTab === "crm"
              ? "border-blue-600 text-blue-600 bg-white"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Users className="w-3.5 h-3.5 text-blue-500" />
          CRM Sim
        </button>
        <button
          onClick={() => setActiveTab("activity")}
          className={`flex-1 py-3 text-[11px] font-semibold flex items-center justify-center gap-1 border-b-2 transition-all ${
            activeTab === "activity"
              ? "border-blue-600 text-blue-600 bg-white"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Actividad
        </button>
        <button
          onClick={() => setActiveTab("quickcreate")}
          className={`flex-1 py-3 text-[11px] font-semibold flex items-center justify-center gap-1 border-b-2 transition-all ${
            activeTab === "quickcreate"
              ? "border-blue-600 text-blue-600 bg-white"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Crear Rápido
        </button>
      </div>
      )}

      {/* Tab Contents Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
        {/* TAB 1: CONFIGURATION */}
        {activeTab === "config" && (
          <div className="flex flex-col gap-4 text-left">
            {/* Presets dropdown */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Plantilla Industrial de Partida
              </label>
              <select
                value={preset}
                onChange={(e) => onPresetChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500"
              >
                <optgroup label="Plantillas de Industria">
                  <option value="clientum_completo">🚀 Clientum — Catálogo Completo de Soluciones</option>
                  <option value="gaman">🛠️ GAMAN — E-Commerce & ERP (5 Etapas)</option>
                  <option value="default">Default Clientum (Servicios)</option>
                  <option value="agro">Agropecuaria & Logística de Granos</option>
                  <option value="inmobiliaria">Inmobiliaria & Administradora de Inmuebles</option>
                  <option value="distribuidora">Distribuidora de Alimentos & Mayorista</option>
                  <option value="gastronomia">Gastronomía & Restoranes/Catering</option>
                  <option value="salud">Clínicas, Salud & Estética</option>
                  <option value="construccion">Construcción & Corralones</option>
                  <option value="profesionales">Estudios Contables & Jurídicos</option>
                  <option value="educacion">Academias & Colegios</option>
                </optgroup>
                {customTemplates && customTemplates.length > 0 && (
                  <optgroup label="Mis Plantillas Personalizadas">
                    {customTemplates.map((t) => (
                      <option key={t.id} value={`custom_${t.id}`}>
                        📁 {t.name}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
              <p className="text-[10px] text-slate-400 mt-1">Carga automáticamente una plantilla industrial adaptada en pesos.</p>
              
              <button
                onClick={handleAiPresetGenerate}
                disabled={aiLoading}
                className="mt-2.5 w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Generar contenido con IA
              </button>
            </div>

            {/* Custom Templates Section */}
            <div className="border-t border-slate-100 pt-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                <FolderHeart className="w-3.5 h-3.5 text-pink-500" />
                Mis Plantillas Guardadas
              </label>
              
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-3">
                {/* Form to Save Current Configuration */}
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTemplateName}
                      onChange={(e) => {
                        setNewTemplateName(e.target.value);
                        if (templateError) setTemplateError("");
                      }}
                      placeholder="Nombre de plantilla... (ej: Inmuebles Premium)"
                      className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-pink-500 font-medium"
                    />
                    <button
                      onClick={() => {
                        if (!newTemplateName.trim()) {
                          setTemplateError("Por favor ingresá un nombre");
                          return;
                        }
                        if (onSaveTemplate) {
                          onSaveTemplate(newTemplateName.trim());
                          setNewTemplateName("");
                          setTemplateError("");
                        }
                      }}
                      className="bg-pink-600 hover:bg-pink-700 active:bg-pink-800 text-white font-bold text-xs py-1.5 px-3 rounded-lg flex items-center gap-1 transition-colors cursor-pointer shrink-0 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Guardar
                    </button>
                  </div>
                  {templateError && (
                    <p className="text-[10px] text-red-500 mt-1 font-semibold">{templateError}</p>
                  )}
                </div>

                {/* List of Saved Templates */}
                {customTemplates.length === 0 ? (
                  <p className="text-[10px] text-slate-400 font-light leading-normal py-1 text-center">
                    No tenés plantillas guardadas. Ingresá un nombre arriba para guardar tu configuración actual (textos, tema, opciones).
                  </p>
                ) : (
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                    {customTemplates.map((template) => {
                      const isSelected = preset === `custom_${template.id}`;
                      return (
                        <div
                          key={template.id}
                          className={`flex items-center justify-between p-2 rounded-lg border text-left transition-all ${
                            isSelected
                              ? "bg-pink-50/40 border-pink-200 ring-1 ring-pink-500/10"
                              : "bg-white border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex flex-col gap-0.5 truncate mr-2">
                            <span className="text-xs font-bold text-slate-700 truncate block">
                              {template.name}
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono">
                              {template.createdAt} · {template.colorTheme}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => onPresetChange(`custom_${template.id}`)}
                              className={`text-[9px] font-black px-2 py-1 rounded-md transition-colors cursor-pointer ${
                                isSelected
                                  ? "bg-pink-100 text-pink-700 font-bold cursor-default"
                                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900"
                              }`}
                              disabled={isSelected}
                            >
                              {isSelected ? "Activo" : "Cargar"}
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`¿Estás seguro de que querés eliminar la plantilla "${template.name}"?`)) {
                                  if (onDeleteTemplate) {
                                    onDeleteTemplate(template.id);
                                  }
                                }
                              }}
                              className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Eliminar plantilla"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {data.outreachEmail && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-left flex flex-col gap-2">
                <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-md text-[9px] font-bold">📧 Correo Personalizado</span>
                  Propuesta para Enviar
                </h4>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Este correo se redactó con IA con voseo argentino, adaptado exactamente al rubro seleccionado.
                </p>
                <div className="bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700 max-h-48 overflow-y-auto whitespace-pre-wrap font-sans select-all leading-relaxed">
                  {data.outreachEmail}
                </div>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(data.outreachEmail || "");
                      alert("¡Correo copiado al portapapeles exitosamente!");
                    }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[10px] py-2 px-2.5 rounded-lg border border-slate-200 flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    Copiar Correo
                  </button>
                  <a
                    href={`mailto:?subject=${encodeURIComponent(
                      data.outreachEmail?.split("\n")[0]?.replace("Asunto:", "")?.trim() || "Propuesta de Automatización Clientum"
                    )}&body=${encodeURIComponent(
                      data.outreachEmail?.split("\n")?.slice(1)?.join("\n")?.trim() || ""
                    )}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] py-2 px-2.5 rounded-lg flex items-center justify-center gap-1 transition-all text-center cursor-pointer"
                  >
                    Enviar por Mail
                  </a>
                </div>
              </div>
            )}

            {/* Themes Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Paleta de Colores de Marca
              </label>
              <div className="grid grid-cols-2 gap-2">
                {themes.map((theme) => (
                  <button
                    key={theme.key}
                    onClick={() => onThemeChange(theme.key)}
                    className={`border p-2 rounded-lg text-left flex items-center gap-2 transition-all ${
                      colorTheme === theme.key
                        ? "border-blue-600 bg-blue-50/50 font-semibold"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded ${theme.bg} border border-white shadow-sm flex-shrink-0`} />
                    <span className="text-[10px] truncate text-slate-700">{theme.label}</span>
                  </button>
                ))}
              </div>

              {/* Dynamic brand colors official palette (Matches uploaded image exactly) */}
              <div className="mt-3.5 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
                <span className="text-[10px] font-black text-slate-700 tracking-wider text-center uppercase font-sans">
                  {palette.title}
                </span>
                <div className="flex justify-between items-center gap-1.5 px-0.5">
                  {palette.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        navigator.clipboard.writeText(color.hex);
                        setCopiedColor(color.hex);
                        setTimeout(() => setCopiedColor(null), 1500);
                      }}
                      style={{ backgroundColor: color.hex }}
                      className={`flex-1 h-11 rounded-xl flex items-center justify-center font-bold text-[9px] shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer relative group ${color.textClass} ${color.border || "border border-transparent"}`}
                      title={`Hacé clic para copiar ${color.hex}`}
                    >
                      <span className="font-sans font-bold">
                        {copiedColor === color.hex ? "✓" : "HEX"}
                      </span>
                      {/* Tooltip to show hex code on hover */}
                      <span className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-sm font-mono">
                        {color.hex}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 text-center leading-normal">
                  Hacé clic sobre cualquier color para copiar su código HEX oficial.
                </p>
              </div>
            </div>

            {/* Price Visibility Toggler */}
            <div className="border-t border-slate-100 pt-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Precios y Cotizaciones
              </label>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">Modo Sin Precios (Modo Consulta)</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hidePrices}
                      onChange={(e) => onHidePricesChange(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Al activar este modo, se ocultarán los precios fijos en pesos/dólares del brochure. Serán reemplazados por cotizaciones personalizadas y llamados a la consulta, ideal para economías cambiantes o propuestas a medida.
                </p>
              </div>
            </div>

            {/* Chatbot Toggle */}
            <div className="border-t border-slate-100 pt-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Canales y Funcionalidades
              </label>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">Modo Sin Chatbot</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hideChatbot}
                      onChange={(e) => {
                        onHideChatbotChange?.(e.target.checked);
                        if (e.target.checked && (selectedPageEdit === 3 || selectedPageEdit === 5)) {
                          setSelectedPageEdit(4);
                        }
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Desactiva la demostración del Chatbot de WhatsApp de Clientum en el brochure y el simulador de chat. El brochure se enfocará exclusivamente en el CRM de ventas y el Prospector Inteligente de Leads en la Patagonia.
                </p>
              </div>
            </div>

            {/* Minimalist Logo Options for Clientum 2026 */}
            <div className="border-t border-slate-100 pt-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
                <span>Logotipo Clientum 2026</span>
                <button
                  onClick={() => setShowLogoModal(true)}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3 h-3" />
                  Previsualizar Variantes
                </button>
              </label>
              
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-3">
                <p className="text-[10px] text-slate-500 leading-normal">
                  Elegí una variante de logotipo minimalista oficial para insertarla en el encabezado del brochure.
                </p>
                
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      name: "Variante 1",
                      url: "/src/assets/images/clientum-logo-1.jpg"
                    },
                    {
                      name: "Variante 2",
                      url: "/src/assets/images/clientum-logo-2.jpg"
                    },
                    {
                      name: "Variante 3",
                      url: "/src/assets/images/clientum-logo-3.jpg"
                    }
                  ].map((logo, idx) => {
                    const isSelected = data.logoUrl === logo.url;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          const updated = { ...data, logoUrl: logo.url };
                          onChange(updated);
                        }}
                        className={`flex flex-col items-center bg-white border rounded-xl p-1.5 transition-all relative overflow-hidden group cursor-pointer ${
                          isSelected ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10" : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="relative w-full aspect-square bg-slate-950 rounded-lg overflow-hidden mb-1 flex items-center justify-center">
                          <img
                            src={logo.url}
                            alt={logo.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <span className="text-[9px] font-bold text-slate-700">{logo.name}</span>
                        {isSelected && (
                          <span className="absolute top-1.5 right-1.5 bg-emerald-500 text-white rounded-full p-0.5 text-[7px] shadow-sm">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {data.logoUrl && (
                  <button
                    onClick={() => {
                      const updated = { ...data, logoUrl: undefined };
                      onChange(updated);
                    }}
                    className="w-full bg-white hover:bg-slate-100 text-slate-600 font-semibold text-[9px] py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                  >
                    Restablecer logo SVG predeterminado
                  </button>
                )}
              </div>
            </div>

            {/* Custom Contact Info */}
            <div className="border-t border-slate-100 pt-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Información de Contacto del Brochure
              </label>
              <div className="flex flex-col gap-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400">Sitio Web</span>
                  <input
                    type="text"
                    value={contactInfo.website}
                    onChange={(e) => handleContactFieldChange("website", e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none"
                    placeholder="clientum.com.ar"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400">Email Comercial</span>
                  <input
                    type="text"
                    value={contactInfo.email}
                    onChange={(e) => handleContactFieldChange("email", e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none"
                    placeholder="info@clientum.com.ar"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400">Teléfono / WhatsApp</span>
                  <input
                    type="text"
                    value={contactInfo.phone}
                    onChange={(e) => handleContactFieldChange("phone", e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none"
                    placeholder="+54 298 451-0883"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400">Dirección Física</span>
                  <input
                    type="text"
                    value={contactInfo.address}
                    onChange={(e) => handleContactFieldChange("address", e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none"
                    placeholder="General Roca, Río Negro"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400">Repositorio GitHub</span>
                  <input
                    type="text"
                    value={contactInfo.github || ""}
                    onChange={(e) => handleContactFieldChange("github", e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none font-mono"
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PAGE EDITOR */}
        {activeTab === "pages" && (
          <div className="flex flex-col gap-4 text-left">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Seleccionar página a modificar
              </label>
              <select
                value={selectedPageEdit}
                onChange={(e) => setSelectedPageEdit(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-medium focus:outline-none"
              >
                <option value={1}>Página 1: Portada</option>
                <option value={2}>Página 2: Quiénes Somos / Misión</option>
                {!hideChatbot && <option value={3}>Página 3: Resumen de Plataforma</option>}
                <option value={4}>{hideChatbot ? "Página 3: Detalle CRM y Ventas" : "Página 4: Detalle WhatsApp & CRM"}</option>
                {!hideChatbot && <option value={5}>Página 5: Asistente IA & Reportes</option>}
                <option value={6}>{hideChatbot ? "Página 4: Servicios Profesionales" : "Página 6: Servicios Profesionales"}</option>
                <option value={8}>{hideChatbot ? "Página 5: Testimonios & Garantías" : "Página 8: Testimonios & Garantías"}</option>
              </select>
            </div>

            <div className="border-t border-slate-100 pt-3 flex flex-col gap-3">
              {/* PAGE 1 COVERS */}
              {selectedPageEdit === 1 && (
                <>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400">Slogan Portada</span>
                    <input
                      type="text"
                      value={data.cover.slogan}
                      onChange={(e) => handleFieldChange("cover", "slogan", e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400">Bajada de Portada</span>
                    <textarea
                      rows={3}
                      value={data.cover.sub}
                      onChange={(e) => handleFieldChange("cover", "sub", e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* PAGE 3: PLATFORM CHATBOT */}
              {selectedPageEdit === 3 && (
                <>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400">Título Módulo Bot</span>
                    <input
                      type="text"
                      value={data.chatbot.title}
                      onChange={(e) => handleFieldChange("chatbot", "title", e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                  {data.chatbot.features.map((feat, idx) => (
                    <div key={idx} className="border border-slate-100 p-2 rounded-lg bg-slate-50/50 flex flex-col gap-1">
                      <span className="text-[9px] font-bold text-slate-400">Función Bot #{idx + 1}</span>
                      <input
                        type="text"
                        value={feat.title}
                        onChange={(e) => handleFeatureChange("chatbot", idx, "title", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-800 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={feat.desc}
                        onChange={(e) => handleFeatureChange("chatbot", idx, "desc", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs text-slate-600 focus:outline-none"
                      />
                    </div>
                  ))}
                </>
              )}

              {/* PAGE 4: DETAIL CRM */}
              {selectedPageEdit === 4 && (
                <>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400">Título Módulo CRM</span>
                    <input
                      type="text"
                      value={data.crm.title}
                      onChange={(e) => handleFieldChange("crm", "title", e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none font-semibold"
                    />
                  </div>
                  {data.crm.features.map((feat, idx) => (
                    <div key={idx} className="border border-slate-100 p-2 rounded-lg bg-slate-50/50 flex flex-col gap-1">
                      <span className="text-[9px] font-bold text-slate-400">Función CRM #{idx + 1}</span>
                      <input
                        type="text"
                        value={feat.title}
                        onChange={(e) => handleFeatureChange("crm", idx, "title", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-800 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={feat.desc}
                        onChange={(e) => handleFeatureChange("crm", idx, "desc", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs text-slate-600 focus:outline-none"
                      />
                    </div>
                  ))}

                  {/* Pipeline Stage Renaming Panel */}
                  <div className="border-t border-slate-100 pt-3 mt-2">
                    <span className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Estados del Funnel de Ventas (Pipeline)
                    </span>
                    <p className="text-[10px] text-slate-400 mb-2 leading-relaxed">
                      Editá el nombre simulado de cada columna que aparece en el Kanban del brochure y el CRM.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block mb-0.5">Estado 1 (Leads)</span>
                        <input
                          type="text"
                          value={data.crm.stageLabels?.leads || "Nuevos Leads"}
                          onChange={(e) => handleStageLabelChange("leads", e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                          placeholder="Nuevos Leads"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block mb-0.5">Estado 2 (Bot)</span>
                        <input
                          type="text"
                          value={data.crm.stageLabels?.bot_contact || "Contacto Bot"}
                          onChange={(e) => handleStageLabelChange("bot_contact", e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                          placeholder="Contacto Bot"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block mb-0.5">Estado 3 (Propuesta)</span>
                        <input
                          type="text"
                          value={data.crm.stageLabels?.proposed || "Propuesta"}
                          onChange={(e) => handleStageLabelChange("proposed", e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                          placeholder="Propuesta"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block mb-0.5">Estado 4 (Ganado)</span>
                        <input
                          type="text"
                          value={data.crm.stageLabels?.closed || "Ganado 🎉"}
                          onChange={(e) => handleStageLabelChange("closed", e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                          placeholder="Ganado 🎉"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Deals Customization Panel */}
                  <div className="border-t border-slate-100 pt-3 mt-3">
                    <span className="block text-xs font-bold text-slate-700 uppercase mb-2">
                      Editar Tarjetas de Leads Sim (Brochure)
                    </span>
                    <p className="text-[10px] text-slate-400 mb-2 leading-relaxed">
                      Modificá las empresas, rubros y montos de los prospectos que se muestran en el Kanban.
                    </p>
                    <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
                      {(data.crm.deals || INITIAL_DEALS).map((deal, idx) => (
                        <div key={deal.id || idx} className="border border-slate-200 p-2 rounded-lg bg-slate-50/50 flex flex-col gap-1 text-[11px]">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-slate-500 text-[10px]">Lead #{idx + 1}</span>
                            <span className="text-[9px] bg-blue-50 text-blue-600 px-1 py-0.2 rounded font-medium">
                              {deal.stage === "leads" ? (data.crm.stageLabels?.leads || "Nuevos Leads") :
                               deal.stage === "bot_contact" ? (data.crm.stageLabels?.bot_contact || "Contacto Bot") :
                               deal.stage === "proposed" ? (data.crm.stageLabels?.proposed || "Propuesta") :
                               (data.crm.stageLabels?.closed || "Ganado 🎉")}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <div>
                              <span className="text-[9px] font-semibold text-slate-400 block">Empresa</span>
                              <input
                                type="text"
                                value={deal.company}
                                onChange={(e) => handleDealChange(idx, "company", e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded p-1 text-[11px] font-medium text-slate-800 focus:outline-none"
                              />
                            </div>
                            <div>
                              <span className="text-[9px] font-semibold text-slate-400 block">Rubro</span>
                              <input
                                type="text"
                                value={deal.industry}
                                onChange={(e) => handleDealChange(idx, "industry", e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded p-1 text-[11px] font-medium text-slate-800 focus:outline-none"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-1 mt-1">
                            <div>
                              <span className="text-[9px] font-semibold text-slate-400 block">Monto ($)</span>
                              <input
                                type="number"
                                value={deal.amount}
                                onChange={(e) => handleDealChange(idx, "amount", parseFloat(e.target.value) || 0)}
                                className="w-full bg-white border border-slate-200 rounded p-1 text-[11px] font-medium text-slate-800 focus:outline-none"
                              />
                            </div>
                            <div>
                              <span className="text-[9px] font-semibold text-slate-400 block">Ubicación</span>
                              <input
                                type="text"
                                value={deal.city || ""}
                                onChange={(e) => handleDealChange(idx, "city", e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded p-1 text-[11px] font-medium text-slate-800 focus:outline-none"
                                placeholder="Ciudad, Prov"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* PAGE 6: SERVICES */}
              {selectedPageEdit === 6 && (
                <div className="flex flex-col gap-3">
                  {data.services.slice(0, 4).map((serv, sIdx) => (
                    <div key={sIdx} className="border border-slate-200 p-2 rounded-lg bg-slate-50/50 flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-blue-600">Servicio #{sIdx + 1}</span>
                      <input
                        type="text"
                        value={serv.title}
                        onChange={(e) => handleServiceChange(sIdx, "title", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs font-bold focus:outline-none"
                      />
                      <textarea
                        rows={2}
                        value={serv.desc}
                        onChange={(e) => handleServiceChange(sIdx, "desc", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs text-slate-600 focus:outline-none"
                      />
                      <span className="text-[9px] font-semibold text-slate-400">Bullets de Resultados</span>
                      <div className="flex flex-col gap-1">
                        {serv.bullets.map((b, bIdx) => (
                          <input
                            key={bIdx}
                            type="text"
                            value={b}
                            onChange={(e) => handleServiceBulletChange(sIdx, bIdx, e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded p-1 text-[10px] text-slate-500 focus:outline-none"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* PAGE 8: TESTIMONIALS */}
              {selectedPageEdit === 8 && (
                <>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400">Testimonio del Cliente</span>
                    <textarea
                      rows={3}
                      value={data.testimonial.text}
                      onChange={(e) => handleFieldChange("testimonial", "text", e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400">Autor</span>
                    <input
                      type="text"
                      value={data.testimonial.author}
                      onChange={(e) => handleFieldChange("testimonial", "author", e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400">Empresa / Ciudad</span>
                    <input
                      type="text"
                      value={data.testimonial.company}
                      onChange={(e) => handleFieldChange("testimonial", "company", e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: GEMINI CO-PILOT */}
        {activeTab === "ai" && (
          <div className="flex flex-col gap-4 text-left">
            {/* Industry Customizer */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
              <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Creador de Brochure por Rubro
              </h4>
              <p className="text-[10px] text-emerald-700 leading-normal mb-3">
                Usa el modelo Gemini para redactar un brochure especializado. Completará de inmediato textos, características, flujo de chatbot y testimonio adecuados a tu negocio.
              </p>

              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={aiIndustry}
                  onChange={(e) => setAiIndustry(e.target.value)}
                  placeholder="Ej. Inmobiliaria, Bodega, Veterinaria..."
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                />
                <button
                  onClick={handleAiIndustryGenerate}
                  disabled={aiLoading || !aiIndustry.trim()}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Redactar Brochure con IA
                </button>
              </div>
            </div>

            {/* Generador de Imágenes por IA */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 text-left">
              <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Generador de Imágenes por IA
              </h4>
              <p className="text-[10px] text-blue-700 leading-normal mb-3">
                Crea imágenes de alta calidad con Gemini para ilustrar tu brochure comercial. La imagen se adaptará automáticamente a la página y al rubro seleccionado.
              </p>

              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1 font-mono">Seleccionar Sección / Página</label>
                  <select
                    value={selectedImagePage}
                    onChange={(e) => setSelectedImagePage(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value={1}>Pág 1: Portada (Banner horizontal 16:9)</option>
                    <option value={2}>Pág 2: Quiénes Somos (Imagen corporativa 4:3)</option>
                    <option value={4}>Pág 4: WhatsApp & CRM (Dashboard móvil 4:3)</option>
                    <option value={6}>Pág 6: Servicios (Ilustración conceptual 1:1)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1 font-mono">Instrucciones Personalizadas (Opcional)</label>
                  <input
                    type="text"
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="Ej. 'Un viñedo moderno en Mendoza, estilo fotográfico plano'..."
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                  />
                  <p className="text-[9px] text-slate-400 mt-1">
                    Si se deja en blanco, la IA generará una imagen perfecta basada en el rubro del brochure.
                  </p>
                </div>

                {/* Preview of current image if exists */}
                {data.images?.[selectedImagePage] && (
                  <div className="border border-slate-200 bg-white rounded-lg p-1.5">
                    <div className="text-[9px] font-semibold text-slate-500 mb-1 flex items-center justify-between">
                      <span>Imagen actual en página {selectedImagePage}:</span>
                      <button
                        onClick={() => {
                          const updated = { ...data };
                          if (updated.images) {
                            delete updated.images[selectedImagePage];
                          }
                          onChange(updated);
                        }}
                        className="text-[9px] text-red-600 hover:underline cursor-pointer"
                      >
                        Revertir a original
                      </button>
                    </div>
                    <div className="aspect-video w-full rounded overflow-hidden bg-slate-100 border border-slate-200">
                      <img
                        src={data.images[selectedImagePage]}
                        alt="Vista previa"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                )}

                {imageError && (
                  <div className="text-[10px] text-red-600 bg-red-50 border border-red-100 p-2 rounded-lg font-medium leading-relaxed">
                    {imageError}
                  </div>
                )}

                <button
                  onClick={handleGenerateImage}
                  disabled={imageGenerating || aiLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {imageGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Generando Imagen con Gemini...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Generar Imagen de Alta Calidad
                    </>
                  )}
                </button>
              </div>
            </div>

            {data.outreachEmail && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-left flex flex-col gap-2 mt-1">
                <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-md text-[9px] font-bold">📧 Correo Personalizado</span>
                  Propuesta para Enviar
                </h4>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Este correo se redactó con IA con voseo argentino, adaptado exactamente al rubro seleccionado.
                </p>
                <div className="bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700 max-h-48 overflow-y-auto whitespace-pre-wrap font-sans select-all leading-relaxed">
                  {data.outreachEmail}
                </div>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(data.outreachEmail || "");
                      alert("¡Correo copiado al portapapeles exitosamente!");
                    }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[10px] py-2 px-2.5 rounded-lg border border-slate-200 flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    Copiar Correo
                  </button>
                  <a
                    href={`mailto:?subject=${encodeURIComponent(
                      data.outreachEmail?.split("\n")[0]?.replace("Asunto:", "")?.trim() || "Propuesta de Automatización Clientum"
                    )}&body=${encodeURIComponent(
                      data.outreachEmail?.split("\n")?.slice(1)?.join("\n")?.trim() || ""
                    )}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] py-2 px-2.5 rounded-lg flex items-center justify-center gap-1 transition-all text-center cursor-pointer"
                  >
                    Enviar por Mail
                  </a>
                </div>
              </div>
            )}

            {/* Rephrase Tool */}
            <div className="border-t border-slate-100 pt-3 flex flex-col gap-3">
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1">
                Optimizar un Párrafo por IA
              </h4>
              <p className="text-[10px] text-slate-500">
                Pega cualquier texto que quieras re-escribir y selecciona un objetivo.
              </p>

              <textarea
                rows={3}
                value={textToOptimize}
                onChange={(e) => setTextToOptimize(e.target.value)}
                placeholder="Pega un fragmento del brochure aquí..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:outline-none text-slate-700 placeholder-slate-400"
              />

              <div className="flex gap-2">
                <select
                  value={aiGoal}
                  onChange={(e) => setAiGoal(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[11px] text-slate-800 focus:outline-none"
                >
                  <option value="Más persuasivo y comercial">Más persuasivo</option>
                  <option value="Tono más formal y corporativo">Más formal</option>
                  <option value="Corto, directo y agresivo en ventas">Corto y directo</option>
                  <option value="Español neutro sin voseo">Español neutro</option>
                </select>

                <button
                  onClick={handleAiOptimizeText}
                  disabled={aiLoading || !textToOptimize.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all disabled:opacity-50"
                >
                  <Send className="w-3 h-3" />
                  Optimizar
                </button>
              </div>

              {optimizedResult && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-2.5 text-xs text-blue-900 mt-1">
                  <div className="font-bold mb-1 flex items-center justify-between">
                    <span>Resultado Optimizado:</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(optimizedResult);
                        alert("Copiado al portapapeles. Ahora puedes pegarlo en el editor.");
                      }}
                      className="text-[10px] text-blue-600 hover:underline"
                    >
                      Copiar
                    </button>
                  </div>
                  <p className="italic leading-relaxed">{optimizedResult}</p>
                </div>
              )}
            </div>

            {/* Translation Fast panel */}
            <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1">
                Traducción Express por IA
              </h4>
              <p className="text-[10px] text-slate-500">
                Traduce instantáneamente el brochure completo con un solo clic.
              </p>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  onClick={() => handleTranslate("English")}
                  disabled={aiLoading}
                  className="border border-slate-200 hover:bg-slate-50 active:bg-slate-50 rounded-lg py-2 px-3 text-xs font-medium text-slate-700 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Languages className="w-3.5 h-3.5 text-slate-500" />
                  Traducir al Inglés
                </button>
                <button
                  onClick={() => handleTranslate("Portuguese")}
                  disabled={aiLoading}
                  className="border border-slate-200 hover:bg-slate-50 active:bg-slate-50 rounded-lg py-2 px-3 text-xs font-medium text-slate-700 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Languages className="w-3.5 h-3.5 text-slate-500" />
                  Traducir al Portugués
                </button>
              </div>
            </div>

            {/* Interactive Advisor Chatbot */}
            {!hideChatbot ? (
              <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
                <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  Asesor Comercial IA (ChatbotSim)
                </h4>
                <p className="text-[10px] text-slate-500">
                  Che, sacate las dudas sobre el brochure de Clientum 2026 conversando directamente con nuestro asesor entrenado.
                </p>
                <ChatbotSim brochureData={data} />
              </div>
            ) : (
              <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
                <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  Prospección en Río Negro y Neuquén
                </h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Para buscar prospectos en la Patagonia y agregarlos directamente a tu pipeline, abrí la pestaña de <strong className="text-blue-600 font-semibold cursor-pointer hover:underline" onClick={() => setActiveTab("crm")}>CRM Sim</strong> arriba. ¡Ahí tenés el buscador satelital de leads por ciudad y rubro!
                </p>
              </div>
            )}

            {/* Loading Indicator */}
            {aiLoading && (
              <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-100 no-print">
                <div className="bg-white rounded-xl p-6 shadow-xl max-w-xs text-center border border-slate-100">
                  <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
                  <h4 className="text-sm font-semibold text-slate-800">Conectando con Gemini API</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Nuestros agentes están analizando los textos para redactar con voseo y adaptabilidad comercial...
                  </p>
                </div>
              </div>
            )}

            {aiError && (
              <div className="bg-red-50 border border-red-100 rounded-lg p-2.5 text-xs text-red-700 flex items-start gap-1.5 mt-2">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Error de IA:</span>
                  <p className="mt-0.5 leading-relaxed">{aiError}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CRM PIPELINE SIMULATOR */}
        {activeTab === "crm" && (
          <SidebarCRM brochureData={data} onChange={onChange} hidePrices={hidePrices} />
        )}

        {/* TAB 5: ACTIVITY TIMELINE */}
        {activeTab === "activity" && (
          <ActivityTab />
        )}

        {/* TAB 6: QUICK CREATE */}
        {activeTab === "quickcreate" && (
          <QuickCreateTab />
        )}
      </div>

      {/* Editor Footer */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
        <CheckCircle2 className="w-3 h-3 text-green-500" />
        Editor activo · Servidor Local Argentino v2.6
      </div>

      {/* Premium Minimalist Logo Modal */}
      {showLogoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fadeIn">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image className="w-5 h-5 text-emerald-400" />
                <div className="text-left">
                  <h3 className="font-bold text-sm tracking-tight">Variantes de Logotipo Minimalista 2026</h3>
                  <p className="text-[10px] text-slate-400 font-light font-mono">Clientum 2026 Brand Assets</p>
                </div>
              </div>
              <button
                onClick={() => setShowLogoModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex flex-col gap-5 text-left">
              <p className="text-xs text-slate-600 leading-relaxed">
                Hemos diseñado y generado tres variantes conceptuales para la identidad visual de <strong className="text-slate-800">Clientum 2026</strong>. 
                Cada opción representa un pilar comercial diferente. Puedes previsualizarlas a gran tamaño e insertar tu favorita directamente en el brochure en tiempo real.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    name: "Variante 1: Crecimiento",
                    url: "/src/assets/images/clientum-logo-1.jpg",
                    concept: "Abstracción C y Flecha",
                    desc: "Simboliza la 'C' de Clientum integrada con una flecha de crecimiento ascendente en degradé esmeralda. Transmite escalabilidad, automatización y superación de cuotas de ventas."
                  },
                  {
                    name: "Variante 2: Conectividad",
                    url: "/src/assets/images/clientum-logo-2.jpg",
                    concept: "Origami de Diamante",
                    desc: "Un emblema en forma de diamante facetado que representa la red de contactos, la sincronización de leads en tiempo real y la elegancia tecnológica de una plataforma Premium."
                  },
                  {
                    name: "Variante 3: Inteligencia",
                    url: "/src/assets/images/clientum-logo-3.jpg",
                    concept: "Anillos Concéntricos",
                    desc: "Anillos de órbita concéntrica y destellos estelares que representan la inteligencia comercial basada en datos, el ruteo geolocalizado GPS en la Patagonia y la automatización inteligente."
                  }
                ].map((logo, idx) => {
                  const isSelected = data.logoUrl === logo.url;
                  return (
                    <div
                      key={idx}
                      className={`border rounded-2xl overflow-hidden bg-slate-50 flex flex-col h-full transition-all ${
                        isSelected
                          ? "border-emerald-500 ring-4 ring-emerald-500/10 bg-white"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {/* Logo Aspect */}
                      <div className="bg-slate-950 p-6 flex items-center justify-center aspect-square relative group">
                        <img
                          src={logo.url}
                          alt={logo.name}
                          className="w-32 h-32 object-contain rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-emerald-600 text-white rounded-full p-1 shadow-sm">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      {/* Info block */}
                      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider font-mono">
                            {logo.concept}
                          </span>
                          <h4 className="font-bold text-xs text-slate-800">{logo.name}</h4>
                          <p className="text-[10px] text-slate-500 leading-normal font-light">{logo.desc}</p>
                        </div>

                        <button
                          onClick={() => {
                            const updated = { ...data, logoUrl: logo.url };
                            onChange(updated);
                            setShowLogoModal(false);
                          }}
                          className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default"
                              : "bg-slate-950 text-white hover:bg-black shadow-sm"
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              Logotipo Insertado
                            </>
                          ) : (
                            <>
                              <Image className="w-3.5 h-3.5" />
                              Insertar en Brochure
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-between items-center text-[10px] text-slate-400 font-mono">
              <span>Clientum 2026 · IA Assets</span>
              <button
                onClick={() => setShowLogoModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Cerrar Previsualización
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
