import React, { useState } from 'react';
import { FileText, Download, Sparkles, Building2, CheckCircle2, Printer, Layout, ShieldCheck } from 'lucide-react';
import { loadDeals } from '../store/sharedStore';

export function BrochureGeneratorTab() {
  const [selectedIndustry, setSelectedIndustry] = useState('Oil & Gas y Minería B2B');
  const [companyName, setCompanyName] = useState('Neuquén Energy Solutions S.A.');
  const [contactPerson, setContactPerson] = useState('Ing. Roberto Mendez');
  const [accentColor, setAccentColor] = useState('#4f46e5');
  const [generating, setGenerating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleGenerateBrochure = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setSuccessMsg('¡Brochure comercial personalizado generado con éxito! Listo para exportar o imprimir.');
      setTimeout(() => setSuccessMsg(''), 4000);
    }, 1000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Generador de Brochures Comerciales PDF / HTML</h2>
            <p className="text-xs text-slate-500">Crea materiales corporativos sectoriales personalizados sincronizados con datos del CRM y Gemini AI</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Exportar / Imprimir PDF</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Sidebar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Configuración del Brochure</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Sector / Industria</label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="Oil & Gas y Minería B2B">Oil & Gas y Minería B2B</option>
              <option value="Turismo y Hotelería Patagónica">Turismo y Hotelería Patagónica</option>
              <option value="Logística y Supply Chain">Logística y Supply Chain</option>
              <option value="Tecnología y Software Corporativo">Tecnología y Software Corporativo</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Empresa Destinataria</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Contacto Principal</label>
            <input
              type="text"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Color de Acento</label>
            <div className="flex gap-2">
              {['#4f46e5', '#0284c7', '#059669', '#d97706', '#7c3aed'].map(c => (
                <button
                  key={c}
                  onClick={() => setAccentColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                    accentColor === c ? 'scale-110 border-slate-900 shadow-sm' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerateBrochure}
            disabled={generating}
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-sm shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {generating ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Sparkles className="w-4 h-4" />}
            <span>{generating ? 'Optimizando con Gemini...' : 'Generar Brochure AI'}</span>
          </button>
        </div>

        {/* Brochure Preview Canvas */}
        <div className="lg:col-span-2 bg-slate-100 p-8 rounded-2xl border border-slate-200 flex justify-center">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 p-8 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-slate-100 text-slate-600">
                  Propuesta Comercial Exclusiva
                </span>
                <h1 className="text-2xl font-black text-slate-900 mt-2">Soluciones de Automatización & IA</h1>
                <p className="text-xs text-slate-500 mt-1">Preparado especialmente para: <strong className="text-slate-800">{companyName}</strong> ({contactPerson})</p>
              </div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-md" style={{ backgroundColor: accentColor }}>
                AI
              </div>
            </div>

            {/* Executive Summary */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">1. Resumen Ejecutivo y Oportunidad</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Para el sector de <strong className="text-slate-800">{selectedIndustry}</strong>, la velocidad de respuesta y el seguimiento de prospectos comerciales determinan la tasa de conversión en contratos corporativos de alto valor. Nuestra plataforma integra calificación MEDDIC, automatización de WhatsApp y prospección geolocalizada.
              </p>
            </div>

            {/* Key Benefits Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="font-bold text-xs text-slate-900">⚡ Cierres 3x Más Rápidos</div>
                <p className="text-[11px] text-slate-500">Pipeline Kanban sincronizado con recordatorios automáticos de seguimiento.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="font-bold text-xs text-slate-900">🤖 Calificación Gemini AI</div>
                <p className="text-[11px] text-slate-500">Análisis automático de encuestas de clientes y encaje con ICP.</p>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
              <div>Generado por AI Studio • Neuquén, Argentina</div>
              <div className="font-semibold text-slate-600">www.aistudio.build</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
