import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BrochureData } from "../types";
import InteractiveCRMKanban from "./InteractiveCRMKanban";
import InteractiveAIChat from "./InteractiveAIChat";
import {
  Shield, CheckCircle, Smartphone, Users, MapPin, Mail, Phone, Globe,
  Check, Star, Clock, FileText, ArrowRight, TrendingUp, AlertCircle, Sparkles
} from "lucide-react";

interface BrochurePreviewProps {
  data: BrochureData;
  colorTheme: string;
  contactInfo: {
    website: string;
    email: string;
    phone: string;
    address: string;
    github?: string;
  };
  selectedPage: number;
  showAllPages: boolean;
  hidePrices?: boolean;
  hideChatbot?: boolean;
  preset?: string;
  onChange?: (newData: BrochureData) => void;
}

export default function BrochurePreview({
  data,
  colorTheme,
  contactInfo,
  selectedPage,
  showAllPages,
  hidePrices = false,
  hideChatbot = false,
  preset = "default",
  onChange,
}: BrochurePreviewProps) {
  const activePages = hideChatbot ? [1, 2, 4, 6, 7, 8] : [1, 2, 3, 4, 5, 6, 7, 8];
  const getPageFooterNumber = (p: number) => {
    const idx = activePages.indexOf(p);
    return idx >= 0 ? idx + 1 : p;
  };

  // Pricing interactive calculator state local to preview
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [currency, setCurrency] = useState<"ARS" | "USD">("ARS");

  // Services estimator local state
  const [selectedServices, setSelectedServices] = useState<boolean[]>([true, false, true, false, false, true]);

  useEffect(() => {
    if (data.services) {
      setSelectedServices(prev => {
        if (prev.length === data.services.length) return prev;
        const next = [...prev];
        if (next.length < data.services.length) {
          while (next.length < data.services.length) {
            next.push(true); // new ones are active by default
          }
        } else {
          next.splice(data.services.length);
        }
        return next;
      });
    }
  }, [data.services]);

  // Theme maps
  const getThemeClasses = () => {
    switch (colorTheme) {
      case "forest":
        return {
          primaryBg: "bg-gradient-to-br from-teal-950 via-emerald-900 to-emerald-800",
          accentColor: "text-emerald-400",
          accentBg: "bg-emerald-500/10",
          accentBorder: "border-emerald-500/30",
          pillBg: "bg-emerald-50 text-emerald-800",
          featuredCardBg: "bg-gradient-to-br from-emerald-950 to-teal-900 border-emerald-500",
          brandColor: "text-emerald-500",
          btnBg: "bg-emerald-600 hover:bg-emerald-700",
        };
      case "amber":
        return {
          primaryBg: "bg-gradient-to-br from-orange-950 via-amber-900 to-yellow-800",
          accentColor: "text-amber-400",
          accentBg: "bg-amber-500/10",
          accentBorder: "border-amber-500/30",
          pillBg: "bg-amber-50 text-amber-800",
          featuredCardBg: "bg-gradient-to-br from-amber-950 to-orange-900 border-amber-500",
          brandColor: "text-amber-500",
          btnBg: "bg-amber-600 hover:bg-amber-700",
        };
      case "charcoal":
        return {
          primaryBg: "bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-700",
          accentColor: "text-zinc-400",
          accentBg: "bg-zinc-500/10",
          accentBorder: "border-zinc-500/30",
          pillBg: "bg-zinc-100 text-zinc-800",
          featuredCardBg: "bg-gradient-to-br from-slate-950 to-zinc-900 border-zinc-500",
          brandColor: "text-zinc-400",
          btnBg: "bg-zinc-600 hover:bg-zinc-700",
        };
      case "navy":
      default:
        return {
          primaryBg: "bg-gradient-to-br from-[#0a1628] via-[#1A3461] to-[#1e4480]",
          accentColor: "text-green-400",
          accentBg: "bg-emerald-500/10",
          accentBorder: "border-emerald-500/30",
          pillBg: "bg-blue-50 text-blue-800",
          featuredCardBg: "bg-gradient-to-br from-[#0d1f3c] to-[#1A3461] border-blue-500",
          brandColor: "text-[#1A3461]",
          btnBg: "bg-[#1A3461] hover:bg-[#0d1f3c]",
        };
    }
  };

  const theme = getThemeClasses();

  // Pricing math helper
  const calculatePrice = (baseArs: number) => {
    let finalPrice = baseArs;
    if (billingPeriod === "yearly") {
      finalPrice = baseArs * 0.84; // 16% off
    }
    if (currency === "USD") {
      finalPrice = Math.round(finalPrice / 1000); // mock exchange rate 1:1000
    }
    return finalPrice;
  };

  // Estimate total setup & cost based on checked items
  const baseServicePrices = [120000, 180000, 150000, 95000, 110000, 60000];
  const serviceTimes = [15, 20, 10, 7, 5, 3]; // days
  
  const estimatedCost = selectedServices.reduce((sum, current, idx) => {
    if (!current) return sum;
    const customPrice = data.services[idx]?.price;
    return sum + (customPrice !== undefined ? customPrice : (baseServicePrices[idx] || 0));
  }, 0);

  const estimatedSetupTime = selectedServices.reduce((max, current, idx) => {
    if (!current) return max;
    const customTime = data.services[idx]?.time;
    return Math.max(max, customTime !== undefined ? customTime : (serviceTimes[idx] || 0));
  }, 0);

  const activeServicesCount = selectedServices.filter(Boolean).length;

  const renderPageContent = (pageNumber: number) => {
    switch (pageNumber) {
      case 1:
        return (
          /* PAGE 1: COVER */
          <div className={`print-page w-full min-h-[297mm] ${theme.primaryBg} text-white flex flex-col justify-between p-12 relative overflow-hidden text-left shadow-lg border border-slate-800`}>
            {/* Custom AI generated background image overlay if exists */}
            {data.images?.[1] && (
              <div
                className="absolute inset-0 z-0 opacity-15 bg-cover bg-center mix-blend-overlay pointer-events-none"
                style={{ backgroundImage: `url(${data.images[1]})` }}
              />
            )}
            {/* Glow effects */}
            <div className="absolute top-[-80px] right-[-80px] w-[500px] height-[500px] rounded-full bg-radial from-emerald-500/10 to-transparent pointer-events-none" />
            <div className="absolute bottom-[-120px] left-[-60px] w-[400px] height-[400px] rounded-full bg-radial from-blue-500/20 to-transparent pointer-events-none" />

            {/* Header / Logo */}
            <div className="flex items-center gap-3 z-10">
              {data.logoUrl ? (
                <img
                  src={data.logoUrl}
                  alt="Clientum Logo"
                  className="w-11 h-11 object-cover rounded-xl border border-white/20"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-11 h-11 bg-[#0A2558] rounded-xl flex items-center justify-center border border-white/20 overflow-hidden">
                  <img src="/favicon.svg" alt="Clientum Logo" className="w-8 h-8" referrerPolicy="no-referrer" />
                </div>
              )}
              <span className="font-display font-extrabold text-2xl tracking-tight text-white">Clientum</span>
            </div>

            {/* Body */}
            <div className="my-auto max-w-[580px] z-10 py-8">
              <span className="inline-block bg-white/10 border border-white/20 text-white font-mono text-[10px] uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-6 font-bold">
                Brochure Corporativo 2026
              </span>
              <h1 className="font-display font-black text-4xl sm:text-5xl tracking-tight text-white leading-tight mb-6">
                {data.cover.slogan}
              </h1>
              <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed mb-8 font-light">
                {data.cover.sub}
              </p>

              {/* Dynamic Stats Banner */}
              <div className="grid grid-cols-4 gap-2 border border-white/10 bg-white/5 backdrop-blur-xs rounded-xl p-4 overflow-hidden">
                <div className="text-center border-r border-white/5 pr-2">
                  <span className="block text-xl font-extrabold text-white">1.750+</span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block mt-0.5">PyMEs</span>
                </div>
                <div className="text-center border-r border-white/5 px-1">
                  <span className="block text-xl font-extrabold text-white">12+</span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block mt-0.5">Años Exp.</span>
                </div>
                <div className="text-center border-r border-white/5 px-1">
                  <span className="block text-xl font-extrabold text-white">4.8/5</span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block mt-0.5">Opiniones</span>
                </div>
                <div className="text-center pl-1">
                  <span className="block text-xl font-extrabold text-emerald-400">99.9%</span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block mt-0.5">SLA Real</span>
                </div>
              </div>
            </div>

            {/* Footer with custom contact */}
            <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-10">
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-slate-400 text-xs font-light">
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <strong>{contactInfo.website}</strong>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <strong>{contactInfo.email}</strong>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <strong>{contactInfo.phone}</strong>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  <strong>{contactInfo.address}</strong>
                </div>
              </div>
              <span className="text-xs text-white/40 font-mono">© 2026 Clientum CRM</span>
            </div>
          </div>
        );

      case 2:
        return (
          /* PAGE 2: QUIÉNES SOMOS */
          <div className="print-page w-full min-h-[297mm] bg-white text-slate-900 flex flex-col justify-between p-12 text-left shadow-lg border border-slate-200">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className={`inline-block ${theme.pillBg} font-mono text-[9px] uppercase tracking-wider px-3 py-1 rounded-full font-bold`}>
                  Quiénes somos
                </span>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="flex flex-col gap-4">
                  <h2 className={`font-display font-extrabold text-3xl tracking-tight ${theme.brandColor} leading-tight`}>
                    Nacimos en la Patagonia para digitalizar la Argentina.
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed font-light">
                    Hace más de 12 años acompañamos a PyMEs de todo el país en su transformación digital. Conocemos la realidad argentina: limitaciones de tiempo, presupuesto y equipo de IT.
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed font-light">
                    Por eso construimos una plataforma que no requiere conocimientos técnicos, funciona en pesos y tiene soporte humano en español rioplatense.
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed font-light">
                    Desde General Roca, Río Negro, llegamos a empresas de todos los rubros y rincones del país.
                  </p>

                  {/* Custom AI generated image for Page 2 */}
                  {data.images?.[2] && (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200/60 shadow-xs h-36 my-2">
                      <img src={data.images[2]} alt="Clientum Quiénes Somos" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-center">
                      <strong className="block text-2xl font-black text-[#1A3461] tracking-tight">1.750+</strong>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">PyMEs Activas</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-center">
                      <strong className="block text-2xl font-black text-[#1A3461] tracking-tight">12+</strong>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Años de Exp.</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-center">
                      <strong className="block text-2xl font-black text-[#1A3461] tracking-tight">4.8/5</strong>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Satisfacción</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-center">
                      <strong className="block text-2xl font-black text-emerald-600 tracking-tight">100%</strong>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Desarrollo Local</span>
                    </div>
                  </div>
                </div>

                {/* Right block with core values */}
                <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between h-full border border-slate-800">
                  <div>
                    <h3 className="font-display font-bold text-lg mb-4 text-white">Nuestra misión</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-6 font-light">
                      Nivelar la cancha para las empresas argentinas. Que una PyME de Neuquén tenga las mismas herramientas que una multinacional, sin el costo ni la complejidad.
                    </p>

                    <div className="flex flex-col gap-4">
                      <div className="flex gap-3">
                        <span className="text-xl">🇦🇷</span>
                        <div>
                          <strong className="block text-xs font-semibold text-white">100% argentino</strong>
                          <span className="text-[10px] text-slate-500">Precios en pesos, soporte local, integrador AFIP.</span>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-xl">⚡</span>
                        <div>
                          <strong className="block text-xs font-semibold text-white">Implementación rápida</strong>
                          <span className="text-[10px] text-slate-500">Operativo en menos de una semana, sin IT interno.</span>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-xl">🤝</span>
                        <div>
                          <strong className="block text-xs font-semibold text-white">Soporte humano real</strong>
                          <span className="text-[10px] text-slate-500">Respuestas rápidas en menos de 4 horas vía WhatsApp.</span>
                        </div>
                      </div>
                      {contactInfo.github && (
                        <div className="flex gap-3">
                          <span className="text-xl">💻</span>
                          <div>
                            <strong className="block text-xs font-semibold text-white">Soberanía y Código Abierto</strong>
                            <span className="text-[10px] text-slate-500">Código disponible públicamente en nuestro repositorio de GitHub.</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-xs">
                    <p className="italic text-slate-300 font-light">
                      "Implementamos Clientum en 5 días. El bot de WhatsApp nos generó 40% más de consultas en el primer mes sin contratar nadie."
                    </p>
                    <cite className="block text-[10px] text-emerald-400 font-semibold mt-2 not-italic">
                      — Martín R., Distribuidora del Sur S.A.
                    </cite>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-4 flex justify-between text-[10px] text-slate-400">
              <span>{contactInfo.website} · Quiénes somos</span>
              <span>Pág. {getPageFooterNumber(2)}</span>
            </div>
          </div>
        );

      case 3:
        return (
          /* PAGE 3: LA PLATAFORMA (6 MODULES OVERVIEW) */
          <div className="print-page w-full min-h-[297mm] bg-white text-slate-900 flex flex-col justify-between p-12 text-left shadow-lg border border-slate-200">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className={`inline-block ${theme.pillBg} font-mono text-[9px] uppercase tracking-wider px-3 py-1 rounded-full font-bold`}>
                  La plataforma
                </span>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

              <div className="max-w-[540px] mb-8">
                <h2 className={`font-display font-extrabold text-3xl tracking-tight ${theme.brandColor} leading-tight mb-3`}>
                  Todo lo que tu PyME necesita,<br />en un solo lugar.
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed font-light">
                  Seis módulos integrados que trabajan juntos. Cada cliente, cada venta, cada conversación y cada factura de AFIP conectados en tiempo real.
                </p>
              </div>

              {/* Grid of 6 modules */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors flex flex-col justify-between">
                  <div>
                    <span className="text-xl block mb-2">💬</span>
                    <h3 className="font-display font-bold text-xs text-slate-800 mb-1">Chatbot WhatsApp 24/7</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-light">
                      Atiende solo, califica leads, agenda citas y responde a cualquier hora sin intervenciones humanas.
                    </p>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider text-emerald-600 font-bold block mt-3 font-mono">Sin pausas</span>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors flex flex-col justify-between">
                  <div>
                    <span className="text-xl block mb-2">📊</span>
                    <h3 className="font-display font-bold text-xs text-slate-800 mb-1">CRM Inteligente</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-light">
                      Pipeline visual drag & drop, seguimiento automático de clientes y gestión comercial unificada.
                    </p>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider text-blue-600 font-bold block mt-3 font-mono">+35% cierre</span>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors flex flex-col justify-between">
                  <div>
                    <span className="text-xl block mb-2">🤖</span>
                    <h3 className="font-display font-bold text-xs text-slate-800 mb-1">Asistente IA</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-light">
                      Tu analista de negocio por inteligencia artificial. Haz preguntas en castellano y obtené tendencias.
                    </p>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider text-purple-600 font-bold block mt-3 font-monoAnálisis instantáneo">Insight Real-Time</span>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors flex flex-col justify-between">
                  <div>
                    <span className="text-xl block mb-2">⚙️</span>
                    <h3 className="font-display font-bold text-xs text-slate-800 mb-1">Automatización</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-light">
                      Reglas y flujos de trabajo sin código. Tareas, re-asignaciones y alertas automáticas.
                    </p>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-600 font-bold block mt-3 font-mono">Sin código</span>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors flex flex-col justify-between">
                  <div>
                    <span className="text-xl block mb-2">📈</span>
                    <h3 className="font-display font-bold text-xs text-slate-800 mb-1">Reportes Automáticos</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-light">
                      8+ plantillas de reportes de actividad, conversión comercial y facturación directo a tu email.
                    </p>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-600 font-bold block mt-3 font-mono">Formato PDF/XLS</span>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors flex flex-col justify-between">
                  <div>
                    <span className="text-xl block mb-2">🏪</span>
                    <h3 className="font-display font-bold text-xs text-slate-800 mb-1">Portal del Cliente</h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-light">
                      Tus clientes se autoatienden: ven facturas AFIP, saldos corrientes e historial de pedidos.
                    </p>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-600 font-bold block mt-3 font-mono">Marca Blanca</span>
                </div>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-4 flex justify-between text-[10px] text-slate-400">
              <span>{contactInfo.website} · Plataforma Integrada</span>
              <span>Pág. {getPageFooterNumber(3)}</span>
            </div>
          </div>
        );

      case 4:
        return (
          /* PAGE 4: INTERACTIVE CRM BOARD & DETAIL WHATSAPP */
          <div className="print-page w-full min-h-[297mm] bg-white text-slate-900 flex flex-col justify-between p-12 text-left shadow-lg border border-slate-200">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className={`inline-block ${theme.pillBg} font-mono text-[9px] uppercase tracking-wider px-3 py-1 rounded-full font-bold`}>
                  Módulo WhatsApp & CRM
                </span>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mb-6">
                <div>
                  <h3 className={`font-display font-extrabold text-2xl tracking-tight ${theme.brandColor} leading-tight mb-3`}>
                    {data.chatbot.title}
                  </h3>
                  <div className="flex flex-col gap-3 mt-4">
                    {data.chatbot.features.slice(0, 3).map((feat: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 flex-shrink-0 mt-0.5">
                          ✓
                        </div>
                        <div>
                          <strong className="font-semibold text-slate-800 block text-xs">{feat.title}</strong>
                          <span className="text-[11px] text-slate-500">{feat.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Custom AI generated image for Page 4 */}
                  {data.images?.[4] && (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200/60 shadow-xs h-32 mt-4">
                      <img src={data.images[4]} alt="WhatsApp Bot & CRM" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-3 font-mono">Paso a paso del flujo</span>
                  <div className="flex flex-col gap-3">
                    {data.chatbot.flowSteps.map((step: any, idx: number) => (
                      <div key={idx} className="flex gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#1A3461] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                          {idx + 1}
                        </span>
                        <p className="text-[11px] text-slate-600 leading-snug">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-200 pt-6">
                {/* Embed fully interactive Kanban pipeline board */}
                <InteractiveCRMKanban brochureData={data} onChange={onChange} />
              </div>
            </div>
            <div className="border-t border-slate-100 pt-4 flex justify-between text-[10px] text-slate-400">
              <span>{contactInfo.website} · CRM & Automatizaciones</span>
              <span>Pág. {getPageFooterNumber(4)}</span>
            </div>
          </div>
        );

      case 5:
        return (
          /* PAGE 5: ASISTENTE IA & INTERACTIVE CHAT SIMULATOR */
          <div className="print-page w-full min-h-[297mm] bg-white text-slate-900 flex flex-col justify-between p-12 text-left shadow-lg border border-slate-200">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className={`inline-block ${theme.pillBg} font-mono text-[9px] uppercase tracking-wider px-3 py-1 rounded-full font-bold`}>
                  Módulo Inteligencia Artificial
                </span>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mb-6">
                <div>
                  <h3 className={`font-display font-extrabold text-2xl tracking-tight ${theme.brandColor} leading-tight mb-3`}>
                    {data.crm.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-light mb-4 leading-relaxed">
                    Nuestra inteligencia artificial se conecta directamente con tu cuenta corriente de WhatsApp y facturación AFIP para darte reportes instantáneos con análisis en lenguaje natural.
                  </p>
                  <div className="flex flex-col gap-3 mt-2">
                    {data.crm.features.slice(0, 3).map((feat: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
                          ✓
                        </div>
                        <div>
                          <strong className="font-semibold text-slate-800 block text-xs">{feat.title}</strong>
                          <span className="text-[11px] text-slate-500">{feat.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Info Card on AFIP integration */}
                <div className="bg-gradient-to-br from-[#0d1f3c] to-[#1A3461] text-white rounded-xl p-4 flex flex-col gap-3 border border-slate-800 shadow-sm text-xs">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    <strong className="font-display font-bold text-xs text-white">Seguridad y AFIP</strong>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-light">
                    Clientum está homologado oficialmente ante AFIP como emisor de factura electrónica nacional. Los datos se encriptan bajo claves bancarias y se almacenan en servidores nacionales de alta disponibilidad.
                  </p>
                  <div className="flex items-center gap-3 border-t border-white/5 pt-2.5 mt-1 text-[10px] text-slate-400">
                    <span className="bg-white/10 px-2 py-0.5 rounded text-white font-mono font-semibold">CAE Automático</span>
                    <span className="bg-white/10 px-2 py-0.5 rounded text-white font-mono font-semibold">CBU Directo</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-200 pt-6">
                {/* Embed fully interactive AI chat dashboard simulator */}
                <InteractiveAIChat />
              </div>
            </div>
            <div className="border-t border-slate-100 pt-4 flex justify-between text-[10px] text-slate-400">
              <span>{contactInfo.website} · Análisis Inteligente</span>
              <span>Pág. {getPageFooterNumber(5)}</span>
            </div>
          </div>
        );

      case 6:
        return (
          /* PAGE 6: SERVICIOS PROFESIONALES & CALCULATOR */
          <div className="print-page w-full min-h-[297mm] bg-white text-slate-900 flex flex-col justify-between p-12 text-left shadow-lg border border-slate-200">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className={`inline-block ${theme.pillBg} font-mono text-[9px] uppercase tracking-wider px-3 py-1 rounded-full font-bold`}>
                  Servicios Profesionales
                </span>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

              <div className="max-w-[540px] mb-6">
                <h2 className={`font-display font-extrabold text-2xl tracking-tight ${theme.brandColor} leading-tight mb-2`}>
                  Más allá de la plataforma.
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed font-light">
                  Acompañamos el crecimiento de tu empresa con ingenieros y consultores capacitados en procesos de PyMEs. Selecciona servicios para proyectar tu hoja de ruta:
                </p>
              </div>

              {/* Custom AI generated image for Page 6 */}
              {data.images?.[6] && (
                <div className="relative rounded-xl overflow-hidden border border-slate-200/60 shadow-xs h-32 mb-4">
                  <img src={data.images[6]} alt="Servicios Profesionales" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              )}

              {/* Bento Grid of Services with Interactive Checkboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {data.services.map((serv: any, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => {
                      const updated = [...selectedServices];
                      updated[idx] = !updated[idx];
                      setSelectedServices(updated);
                    }}
                    className={`border rounded-xl p-3.5 cursor-pointer flex gap-3 transition-all ${
                      selectedServices[idx]
                        ? "border-[#1A3461] bg-blue-50/20 shadow-xs"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={!!selectedServices[idx]}
                      onChange={() => {}} // handled by div click
                      className="mt-1 h-3.5 w-3.5 text-[#1A3461] rounded border-slate-300"
                    />
                    <div className="text-left flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <h3 className="font-display font-extrabold text-xs text-slate-800">{serv.title}</h3>
                        {!hidePrices && (serv.price !== undefined || serv.monthly !== undefined) && (
                          <span className="text-[9px] font-mono font-bold text-slate-500">
                            {serv.price !== undefined && `Setup: $${serv.price.toLocaleString("es-AR")}`}
                            {serv.price !== undefined && serv.monthly !== undefined && " | "}
                            {serv.monthly !== undefined && `Abono: $${serv.monthly.toLocaleString("es-AR")}/mes`}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-light mb-2">{serv.desc}</p>
                      <div className="flex flex-col gap-0.5">
                        {serv.bullets.slice(0, 2).map((b: any, bIdx: number) => (
                          <span key={bIdx} className="text-[9px] text-slate-600 flex items-center gap-1 font-light">
                            <span className="text-[#1A3461] font-bold">✓</span> {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Services Dynamic Calculator Result */}
              <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 shadow-md">
                <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">Estimación de Implementación</span>
                  </div>
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[9px] px-2 py-0.5 rounded font-bold">
                    {activeServicesCount} Módulos Activos
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
                  <div className="border-r border-white/5 pr-4">
                    <span className="text-[9px] text-slate-400 font-bold block mb-0.5 uppercase tracking-wider">Costo Estimado</span>
                    <strong className="text-xl font-black text-white">
                      {hidePrices ? "Presupuesto a medida" : (estimatedCost === 0 ? "Selecciona módulos" : `$${estimatedCost.toLocaleString("es-AR")} ARS`)}
                    </strong>
                    <span className="text-[9px] text-slate-500 block mt-0.5">
                      {hidePrices ? "Consulte con un asesor" : "Inversión única de setup"}
                    </span>
                  </div>
                  <div className="border-r border-white/5 px-0 sm:px-4">
                    <span className="text-[9px] text-slate-400 font-bold block mb-0.5 uppercase tracking-wider">Tiempo Estimado</span>
                    <strong className="text-xl font-black text-white">
                      {estimatedSetupTime === 0 ? "0 días" : `< ${estimatedSetupTime} días hábiles`}
                    </strong>
                    <span className="text-[9px] text-slate-500 block mt-0.5">Llave en mano operativo</span>
                  </div>
                  <div className="pl-0 sm:pl-4">
                    <span className="text-[9px] text-slate-400 font-bold block mb-0.5 uppercase tracking-wider">Retorno de Inversión (ROI)</span>
                    <strong className="text-xl font-black text-emerald-400">
                      {activeServicesCount === 0 ? "-" : "≈ 3 a 5 meses"}
                    </strong>
                    <span className="text-[9px] text-slate-500 block mt-0.5">En base al ahorro de horas</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-4 flex justify-between text-[10px] text-slate-400">
              <span>{contactInfo.website} · Soluciones Digitales</span>
              <span>Pág. {getPageFooterNumber(6)}</span>
            </div>
          </div>
        );

      case 7:
        return (
          /* PAGE 7: PRECIOS & DYNAMIC PLANS */
          <div className="print-page w-full min-h-[297mm] bg-white text-slate-900 flex flex-col justify-between p-12 text-left shadow-lg border border-slate-200">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className={`inline-block ${theme.pillBg} font-mono text-[9px] uppercase tracking-wider px-3 py-1 rounded-full font-bold`}>
                  {hidePrices ? "Planes y Cotizaciones" : "Planes y Precios"}
                </span>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

              {/* Dynamic Toggle Panel or Consultation Banner */}
              {hidePrices ? (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 text-left">
                  <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Cotizaciones Flexibles para la Realidad Local
                  </h3>
                  <p className="text-[10px] text-slate-500 leading-normal mt-1.5 font-light">
                    En Clientum entendemos la realidad económica cambiante de las PyMEs argentinas. Adaptamos nuestras propuestas comerciales al volumen de tu negocio y la complejidad de tus integraciones, garantizando el mejor retorno de inversión en pesos sin costos fijos rígidos.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <div className="text-left">
                    <h3 className="text-xs font-bold text-slate-800">Calculadora de Planes Clientum</h3>
                    <p className="text-[9px] text-slate-400 leading-none">Ajusta los plazos de facturación y moneda de pago.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Monthly vs Yearly */}
                    <div className="bg-white border border-slate-200 rounded-lg p-0.5 flex gap-0.5">
                      <button
                        onClick={() => setBillingPeriod("monthly")}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                          billingPeriod === "monthly" ? "bg-[#1A3461] text-white" : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        Mensual
                      </button>
                      <button
                        onClick={() => setBillingPeriod("yearly")}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all flex items-center gap-1 ${
                          billingPeriod === "yearly" ? "bg-[#1A3461] text-white" : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        Anual <span className="text-[8px] bg-green-500 text-white px-1 py-0.2 rounded-full font-black">16% off</span>
                      </button>
                    </div>

                    {/* Currency ARS vs USD */}
                    <div className="bg-white border border-slate-200 rounded-lg p-0.5 flex gap-0.5">
                      <button
                        onClick={() => setCurrency("ARS")}
                        className={`px-2 py-1 rounded text-[10px] font-bold ${
                          currency === "ARS" ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        ARS
                      </button>
                      <button
                        onClick={() => setCurrency("USD")}
                        className={`px-2 py-1 rounded text-[10px] font-bold ${
                          currency === "USD" ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        USD
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Pricing Cards — one per service. Column count adapts so cards wrap into even
                  rows instead of leaving an orphan row with a single item (e.g. 8 services
                  now fills two full rows of 4 instead of 5 + 3). */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-stretch">
                {data.services[0]?.price !== undefined ? (
                  data.services.map((serv: any, idx: number) => {
                    const hasSetup = serv.price !== undefined;
                    const hasMonthly = serv.monthly !== undefined;
                    const setupPrice = hasSetup ? calculatePrice(serv.price) : 0;
                    const monthlyPrice = hasMonthly ? calculatePrice(serv.monthly) : 0;

                    return (
                      <div
                        key={idx}
                        className={`rounded-xl p-3.5 flex flex-col justify-between text-left relative overflow-hidden transition-all ${
                          idx === 2
                            ? `text-white ${theme.primaryBg} shadow-md`
                            : "bg-white border border-slate-200"
                        }`}
                      >
                        {idx === 2 && (
                          <div className="absolute top-1.5 right-1.5 bg-emerald-500 text-white font-extrabold text-[7px] uppercase px-1.5 py-0.2 rounded-full tracking-wider font-mono">
                            Recomendado
                          </div>
                        )}
                        <div>
                          <span
                            className={`text-[8px] font-bold uppercase tracking-wider block mb-0.5 font-mono ${
                              idx === 2 ? "text-slate-300" : "text-slate-400"
                            }`}
                          >
                            {serv.title.includes(":") ? serv.title.split(":")[0] : `Etapa ${idx + 1}`}
                          </span>
                          <h4
                            className={`text-xs font-black mb-2 leading-tight ${
                              idx === 2 ? "text-white" : "text-slate-800"
                            }`}
                          >
                            {serv.title.includes(":") ? serv.title.split(":")[1].trim() : serv.title}
                          </h4>

                          <div className="mb-3">
                            {hidePrices ? (
                              <strong
                                className={`text-xs font-black block min-h-[24px] flex items-center ${
                                  idx === 2 ? "text-white" : "text-slate-800"
                                }`}
                              >
                                A medida
                              </strong>
                            ) : (
                              <div className="flex flex-col gap-1 text-left">
                                {hasSetup && (
                                  <div>
                                    <span
                                      className={`text-[8px] font-bold uppercase font-mono block ${
                                        idx === 2 ? "text-slate-300" : "text-slate-400"
                                      }`}
                                    >
                                      Setup Único
                                    </span>
                                    <strong
                                      className={`text-sm font-black ${
                                        idx === 2 ? "text-white" : "text-slate-800"
                                      }`}
                                    >
                                      {currency === "USD" ? "U$S " : "$"}
                                      {setupPrice.toLocaleString("es-AR")}
                                    </strong>
                                  </div>
                                )}
                                {hasMonthly && (
                                  <div>
                                    <span
                                      className={`text-[8px] font-bold uppercase font-mono block ${
                                        idx === 2 ? "text-slate-300" : "text-slate-400"
                                      }`}
                                    >
                                      Abono Mensual
                                    </span>
                                    <strong
                                      className={`text-sm font-black ${
                                        idx === 2 ? "text-emerald-300" : "text-emerald-600"
                                      }`}
                                    >
                                      {currency === "USD" ? "U$S " : "$"}
                                      {monthlyPrice.toLocaleString("es-AR")}
                                    </strong>
                                    <span
                                      className={`text-[8px] font-medium ${
                                        idx === 2 ? "text-slate-300" : "text-slate-500"
                                      }`}
                                    >
                                      {" "}/ mes
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <div className={`h-px my-2.5 ${idx === 2 ? "bg-white/10" : "bg-slate-150"}`} />

                          <ul
                            className={`flex flex-col gap-1.5 text-[8px] ${
                              idx === 2 ? "text-slate-200" : "text-slate-600"
                            }`}
                          >
                            {serv.bullets.map((b: any, bIdx: number) => (
                              <li key={bIdx} className="flex items-start gap-1">
                                <Check
                                  className={`w-2.5 h-2.5 flex-shrink-0 mt-0.5 ${
                                    idx === 2 ? "text-emerald-300" : "text-emerald-500"
                                  }`}
                                />
                                <span className="leading-tight">{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <span
                          className={`text-[8px] block mt-4 font-light font-mono ${
                            idx === 2 ? "text-slate-300" : "text-slate-400"
                          }`}
                        >
                          {serv.time ? `Plazo: ~${serv.time} días hábiles` : "Soporte regional"}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <>
                    {/* PLAN 1: STARTER */}
                    <div className="border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between text-left bg-slate-50/50">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1 font-mono">Plan Inicial</span>
                        <div className="mb-1.5">
                          {hidePrices ? (
                            <strong className="text-sm font-black text-slate-800 tracking-tight block min-h-[24px] flex items-center">Inicial</strong>
                          ) : (
                            <>
                              <strong className="text-lg font-black text-slate-800 tracking-tight">
                                {currency === "USD" ? "U$S" : "$"}
                                {calculatePrice(59990).toLocaleString("es-AR")}
                              </strong>
                              <span className="text-[8px] text-slate-500 font-medium"> / {billingPeriod === "monthly" ? "mes" : "año"}</span>
                            </>
                          )}
                        </div>
                        <p className="text-[8px] text-slate-500 leading-normal mb-3 font-light min-h-[32px]">
                          Solución ágil para emprendedores e iniciativas iniciales.
                        </p>
                        <div className="h-px bg-slate-150 my-3" />
                        <ul className="flex flex-col gap-1.5 text-slate-600 text-[8.5px]">
                          <li className="flex items-start gap-1"><Check className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" /> <span><strong>Web:</strong> Landing page responsiva</span></li>
                          <li className="flex items-start gap-1"><Check className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" /> <span><strong>CRM:</strong> Pipeline básico (200 cont.)</span></li>
                          <li className="flex items-start gap-1"><Check className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" /> <span><strong>Seguridad:</strong> Respaldos mensuales</span></li>
                          <li className="flex items-start gap-1"><Check className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" /> <span><strong>IA & BI:</strong> Bot de bienvenida fijo</span></li>
                        </ul>
                      </div>
                      <span className="text-[8px] text-slate-400 block mt-4 font-light font-mono">CBU / MercadoPago</span>
                    </div>

                    {/* PLAN 2: GROWTH */}
                    <div className="border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between text-left bg-white">
                      <div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1 font-mono">Plan PyME</span>
                        <div className="mb-1.5">
                          {hidePrices ? (
                            <strong className="text-sm font-black text-slate-800 tracking-tight block min-h-[24px] flex items-center">Crecimiento</strong>
                          ) : (
                            <>
                              <strong className="text-lg font-black text-slate-800 tracking-tight">
                                {currency === "USD" ? "U$S" : "$"}
                                {calculatePrice(119990).toLocaleString("es-AR")}
                              </strong>
                              <span className="text-[8px] text-slate-500 font-medium"> / {billingPeriod === "monthly" ? "mes" : "año"}</span>
                            </>
                          )}
                        </div>
                        <p className="text-[8px] text-slate-500 leading-normal mb-3 font-light min-h-[32px]">
                          Para PyMEs regionales con ventas diarias activas.
                        </p>
                        <div className="h-px bg-slate-150 my-3" />
                        <ul className="flex flex-col gap-1.5 text-slate-600 text-[8.5px]">
                          <li className="flex items-start gap-1"><Check className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" /> <span><strong>Web:</strong> Tienda online estándar</span></li>
                          <li className="flex items-start gap-1"><Check className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" /> <span><strong>CRM:</strong> Stock + AFIP (1.000 cont.)</span></li>
                          <li className="flex items-start gap-1"><Check className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" /> <span><strong>Seguridad:</strong> Cifrado de datos</span></li>
                          <li className="flex items-start gap-1"><Check className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" /> <span><strong>IA & BI:</strong> Bot con FAQs entrenadas</span></li>
                        </ul>
                      </div>
                      <span className="text-[8px] text-slate-400 block mt-4 font-light font-mono">2 meses gratis anual</span>
                    </div>

                    {/* PLAN 3: PRO (FEATURED) */}
                    <div className={`rounded-xl p-3.5 flex flex-col justify-between text-left relative overflow-hidden shadow-md text-white ${theme.primaryBg}`}>
                      <div className="absolute top-1.5 right-1.5 bg-emerald-500 text-white font-extrabold text-[7px] uppercase px-1.5 py-0.2 rounded-full tracking-wider font-mono">
                        Popular
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block mb-1 font-mono">Plan Pro</span>
                        <div className="mb-1.5">
                          {hidePrices ? (
                            <strong className="text-sm font-black text-white tracking-tight block min-h-[24px] flex items-center">A medida</strong>
                          ) : (
                            <>
                              <strong className="text-lg font-black text-white tracking-tight">
                                {currency === "USD" ? "U$S" : "$"}
                                {calculatePrice(199990).toLocaleString("es-AR")}
                              </strong>
                              <span className="text-[8px] text-slate-300 font-medium"> / {billingPeriod === "monthly" ? "mes" : "año"}</span>
                            </>
                          )}
                        </div>
                        <p className="text-[8px] text-slate-300 leading-normal mb-3 font-light min-h-[32px]">
                          El elegido para automatizar con IA, bots y facturación AFIP.
                        </p>
                        <div className="h-px bg-white/10 my-3" />
                        <ul className="flex flex-col gap-1.5 text-slate-200 text-[8.5px]">
                          <li className="flex items-start gap-1"><Check className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" /> <span><strong>Web:</strong> E-Commerce premium total</span></li>
                          <li className="flex items-start gap-1"><Check className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" /> <span><strong>CRM:</strong> Multi-embudo ilimitado</span></li>
                          <li className="flex items-start gap-1"><Check className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" /> <span><strong>Seguridad:</strong> Auditorías de software</span></li>
                          <li className="flex items-start gap-1"><Check className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" /> <span><strong>IA & BI:</strong> Agente IA & BI avanzado</span></li>
                        </ul>
                      </div>
                      <span className="text-[8px] text-slate-300 block mt-4 font-light font-mono">Soporte prioritario</span>
                    </div>

                    {/* PLAN 4: PREMIUM */}
                    <div className="border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between text-left bg-white">
                      <div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1 font-mono">Corporativo</span>
                        <div className="mb-1.5">
                          {hidePrices ? (
                            <strong className="text-sm font-black text-slate-800 tracking-tight block min-h-[24px] flex items-center">Premium</strong>
                          ) : (
                            <>
                              <strong className="text-lg font-black text-slate-800 tracking-tight">
                                {currency === "USD" ? "U$S" : "$"}
                                {calculatePrice(349990).toLocaleString("es-AR")}
                              </strong>
                              <span className="text-[8px] text-slate-500 font-medium"> / {billingPeriod === "monthly" ? "mes" : "año"}</span>
                            </>
                          )}
                        </div>
                        <p className="text-[8px] text-slate-500 leading-normal mb-3 font-light min-h-[32px]">
                          Para empresas en expansión con múltiples canales de venta.
                        </p>
                        <div className="h-px bg-slate-150 my-3" />
                        <ul className="flex flex-col gap-1.5 text-slate-600 text-[8.5px]">
                          <li className="flex items-start gap-1"><Check className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" /> <span><strong>Web:</strong> Portal B2B + Web integrada</span></li>
                          <li className="flex items-start gap-1"><Check className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" /> <span><strong>CRM:</strong> Pipeline multi-sucursal</span></li>
                          <li className="flex items-start gap-1"><Check className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" /> <span><strong>Seguridad:</strong> Hardening y firewall</span></li>
                          <li className="flex items-start gap-1"><Check className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" /> <span><strong>IA & BI:</strong> Analítica predictiva & bots</span></li>
                        </ul>
                      </div>
                      <span className="text-[8px] text-slate-400 block mt-4 font-light font-mono">SLA 99.9% por contrato</span>
                    </div>

                    {/* PLAN 5: ENTERPRISE */}
                    <div className="border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between text-left bg-slate-50/50">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1 font-mono">Especializado</span>
                        <div className="mb-1.5">
                          <strong className="text-sm font-black text-slate-800 tracking-tight block min-h-[24px] flex items-center">Customizada</strong>
                        </div>
                        <p className="text-[8px] text-slate-500 leading-normal mb-3 font-light min-h-[32px]">
                          Infraestructura dedicada y desarrollo a medida absoluto.
                        </p>
                        <div className="h-px bg-slate-150 my-3" />
                        <ul className="flex flex-col gap-1.5 text-slate-600 text-[8.5px]">
                          <li className="flex items-start gap-1"><Check className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" /> <span><strong>Web:</strong> Apps web & mobile infinitas</span></li>
                          <li className="flex items-start gap-1"><Check className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" /> <span><strong>CRM:</strong> Integraciones ERP legacy</span></li>
                          <li className="flex items-start gap-1"><Check className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" /> <span><strong>Seguridad:</strong> SOC activo 24/7 dedicado</span></li>
                          <li className="flex items-start gap-1"><Check className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" /> <span><strong>IA & BI:</strong> Modelos LLM corporativos</span></li>
                        </ul>
                      </div>
                      <span className="text-[8px] text-slate-400 block mt-4 font-light font-mono">Gerente de cuenta exclusivo</span>
                    </div>
                  </>
                )}
              </div>

              {/* pricing disclaimer */}
              <p className="text-[9px] text-slate-400 font-light text-center mt-6">
                {hidePrices
                  ? "Las cotizaciones se realizan de forma personalizada y sin compromiso de compra en menos de 2 horas hábiles · Soporte técnico local."
                  : "Todos los valores incluyen IVA oficial · Alta de cuenta inmediata en 14 minutos · 14 días gratis de prueba sin tarjeta."}
              </p>
            </div>
            <div className="border-t border-slate-100 pt-4 flex justify-between text-[10px] text-slate-400">
              <span>{contactInfo.website} · Transparencia Comercial</span>
              <span>Pág. {getPageFooterNumber(7)}</span>
            </div>
          </div>
        );

      case 8:
        return (
          /* PAGE 8: TESTIMONIALS & CONTACT FOOTER */
          <div className="print-page w-full min-h-[297mm] bg-white text-slate-900 flex flex-col justify-between p-12 text-left shadow-lg border border-slate-200">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className={`inline-block ${theme.pillBg} font-mono text-[9px] uppercase tracking-wider px-3 py-1 rounded-full font-bold`}>
                  Garantías y Resultados
                </span>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="flex flex-col gap-4">
                  <h2 className={`font-display font-extrabold text-2xl tracking-tight ${theme.brandColor} leading-tight`}>
                    La diferencia que sentís desde el primer día.
                  </h2>
                  <div className="flex flex-col gap-3 mt-2">
                    <div className="flex gap-3">
                      <span className="text-xl">🇦🇷</span>
                      <div>
                        <strong className="block text-xs font-semibold text-slate-800">100% argentino y en pesos</strong>
                        <span className="text-[10px] text-slate-500">Servidores nacionales, soporte y precios fijos en pesos.</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-xl">⚡</span>
                      <div>
                        <strong className="block text-xs font-semibold text-slate-800">Setup completo en una semana</strong>
                        <span className="text-[10px] text-slate-500">Cargamos contactos, bot e integraciones de inmediato.</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-xl">🤝</span>
                      <div>
                        <strong className="block text-xs font-semibold text-slate-800">Soporte real menor a 4 horas</strong>
                        <span className="text-[10px] text-slate-500">Un asesor comercial dedicado de carne y hueso asignado.</span>
                      </div>
                    </div>
                  </div>

                  {/* Stat Grid Results */}
                  <div className="grid grid-cols-2 gap-2.5 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="text-center">
                      <strong className="text-lg font-extrabold text-slate-800 block leading-none">+35%</strong>
                      <span className="text-[9px] text-slate-400 font-bold block mt-1 uppercase font-mono">Cierre Comercial</span>
                    </div>
                    <div className="text-center">
                      <strong className="text-lg font-extrabold text-slate-800 block leading-none">-40%</strong>
                      <span className="text-[9px] text-slate-400 font-bold block mt-1 uppercase font-mono">Costo por Lead</span>
                    </div>
                    <div className="text-center border-t border-slate-200 pt-2">
                      <strong className="text-lg font-extrabold text-slate-800 block leading-none">-90%</strong>
                      <span className="text-[9px] text-slate-400 font-bold block mt-1 uppercase font-mono">Espera Chatbot</span>
                    </div>
                    <div className="text-center border-t border-slate-200 pt-2">
                      <strong className="text-lg font-extrabold text-slate-800 block leading-none">+60%</strong>
                      <span className="text-[9px] text-slate-400 font-bold block mt-1 uppercase font-mono">ROI Publicidad</span>
                    </div>
                  </div>
                </div>

                {/* Right side with testimonial */}
                <div className="flex flex-col gap-4">
                  <div className="bg-[#1A3461] text-white rounded-2xl p-5 border border-slate-800 flex flex-col gap-3">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="italic text-xs text-slate-200 leading-relaxed font-light">
                      "{data.testimonial.text}"
                    </p>
                    <div className="flex items-center gap-3 border-t border-white/5 pt-3 mt-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold font-sans text-xs">
                        {data.testimonial.author[0]}
                      </div>
                      <div className="text-left">
                        <strong className="block text-xs font-semibold text-white">{data.testimonial.author}</strong>
                        <span className="text-[9px] text-slate-400">{data.testimonial.company}</span>
                      </div>
                    </div>
                  </div>

                  {/* Starter card invitation */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between gap-3 text-xs">
                    <div>
                      <strong className="block text-xs font-bold text-slate-800">Empezá gratis hoy mismo</strong>
                      <p className="text-[11px] text-slate-500 leading-normal font-light">
                        Prueba 14 días del plan Pro completo sin compromisos comerciales ni tarjetas.
                      </p>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                      <span className="text-emerald-600 font-bold">clientum.com.ar</span>
                      <span>Crear cuenta →</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer with branding */}
            <div className={`mt-8 ${theme.primaryBg} text-white rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4`}>
              <div className="flex items-center gap-2">
                {data.logoUrl ? (
                  <img
                    src={data.logoUrl}
                    alt="Clientum Logo"
                    className="w-8 h-8 object-cover rounded-lg border border-white/20"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-6 h-6 bg-[#0A2558] rounded-lg overflow-hidden flex items-center justify-center border border-white/20">
                    <img src="/favicon.svg" alt="Clientum Logo" className="w-5 h-5" referrerPolicy="no-referrer" />
                  </div>
                )}
                <span className="font-display font-extrabold text-sm tracking-tight">Clientum</span>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-300 font-light font-mono items-center">
                <span>{contactInfo.website}</span>
                <span>{contactInfo.email}</span>
                <span>{contactInfo.phone}</span>
                {contactInfo.github && (
                  <a
                    href={contactInfo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return <div>Página {pageNumber} no disponible.</div>;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center gap-6 bg-slate-100 max-h-full scrollbar-thin scrollbar-thumb-slate-300">
      {showAllPages ? (
        /* Render all active pages stacked (Perfect for Print view) */
        <motion.div
          key={preset}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col gap-6 w-full max-w-[210mm] shadow-xs"
        >
          {activePages.map((page) => (
            <div key={page} id={`print-page-${page}`} className="w-full">
              {renderPageContent(page)}
            </div>
          ))}
        </motion.div>
      ) : (
        /* Render only single selected page */
        <AnimatePresence mode="wait">
          <motion.div
            key={preset + "-" + selectedPage}
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -15 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="w-full max-w-[210mm]"
          >
            {renderPageContent(selectedPage)}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
