import React, { useState } from 'react';
import {
  FileText,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  Smartphone,
  Sparkles,
  Layers,
  Tag,
  Trash2,
  Check,
  X
} from 'lucide-react';
import { WhatsAppTemplate, TemplateCategory, TemplateStatus, TemplateButton } from '../types';

interface TemplateViewProps {
  templates: WhatsAppTemplate[];
  onCreateTemplate: (template: WhatsAppTemplate) => void;
}

export const TemplateView: React.FC<TemplateViewProps> = ({ templates, onCreateTemplate }) => {
  const [filterStatus, setFilterStatus] = useState<TemplateStatus | 'ALL'>('ALL');
  const [showBuilder, setShowBuilder] = useState(false);

  // Template Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<TemplateCategory>('MARKETING');
  const [headerType, setHeaderType] = useState<'NONE' | 'TEXT' | 'IMAGE' | 'DOCUMENT'>('TEXT');
  const [headerText, setHeaderText] = useState('Exclusive Welcome Offer 👋');
  const [bodyText, setBodyText] = useState('Hi {{1}}, thanks for choosing Acme Clientum CRM. Tap below to get started with your 14-day free trial.');
  const [footerText, setFooterText] = useState('Acme SaaS Customer Care');
  const [buttons, setButtons] = useState<TemplateButton[]>([
    { type: 'QUICK_REPLY', text: 'Get Started' },
    { type: 'URL', text: 'Visit Website', value: 'https://clientum.com.ar' }
  ]);

  const filteredTemplates = templates.filter((t) => {
    if (filterStatus !== 'ALL' && t.status !== filterStatus) return false;
    return true;
  });

  const handleInsertVariable = () => {
    const nextVarNum = (bodyText.match(/\{\{\d+\}\}/g) || []).length + 1;
    setBodyText((prev) => `${prev} {{${nextVarNum}}}`);
  };

  const handleAddButton = () => {
    if (buttons.length < 3) {
      setButtons((prev) => [...prev, { type: 'QUICK_REPLY', text: 'Quick Reply' }]);
    }
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newTmpl: WhatsAppTemplate = {
      id: `tmpl_${Date.now()}`,
      name: name.toLowerCase().replace(/\s+/g, '_'),
      language: 'en_US',
      category,
      status: 'APPROVED', // Instant Meta auto-approval simulation
      headerType,
      headerText,
      bodyText,
      footerText,
      buttons,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onCreateTemplate(newTmpl);
    setShowBuilder(false);
    setName('');
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-101px)] bg-slate-50 text-slate-900 overflow-y-auto">
      {/* Top Banner */}
      <div className="p-4 bg-white border-b border-slate-200 space-y-3 shrink-0 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-slate-900 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-purple-600" />
              Plantillas de Mensajes de WhatsApp Meta
            </h1>
            <p className="text-xs text-slate-500">
              Creá y gestioná plantillas de mensajes aprobadas por Meta para campañas masivas y disparadores automáticos.
            </p>
          </div>

          <button
            onClick={() => setShowBuilder(true)}
            className="flex items-center space-x-1.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-4 py-2 rounded transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Plantilla</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex space-x-2 text-xs">
          {[
            { id: 'ALL', label: 'TODOS' },
            { id: 'APPROVED', label: 'APROBADOS' },
            { id: 'PENDING', label: 'PENDIENTES' },
            { id: 'REJECTED', label: 'RECHAZADOS' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterStatus(item.id as any)}
              className={`px-3 py-1 rounded font-bold transition ${
                filterStatus === item.id
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-200/70 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((tmpl) => {
          const statusBadge =
            tmpl.status === 'APPROVED'
              ? 'bg-green-50 text-green-800 border-green-200'
              : tmpl.status === 'PENDING'
              ? 'bg-amber-50 text-amber-800 border-amber-200'
              : 'bg-rose-50 text-rose-800 border-rose-200';

          const statusText =
            tmpl.status === 'APPROVED'
              ? 'APROBADO'
              : tmpl.status === 'PENDING'
              ? 'PENDIENTE'
              : 'RECHAZADO';

          return (
            <div
              key={tmpl.id}
              className="bg-white border border-slate-200 rounded p-4 flex flex-col justify-between shadow-xs space-y-3 hover:border-green-500/60 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-purple-700 truncate">{tmpl.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${statusBadge}`}>
                    {statusText}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono">
                  <span className="bg-slate-100 px-1.5 py-0.2 rounded font-semibold text-slate-700">{tmpl.category}</span>
                  <span>Idioma: {tmpl.language}</span>
                </div>

                {/* Body Preview */}
                <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs text-slate-800 space-y-1 font-sans">
                  {tmpl.headerText && <p className="font-bold text-slate-900">{tmpl.headerText}</p>}
                  <p className="whitespace-pre-wrap">{tmpl.bodyText}</p>
                  {tmpl.footerText && <p className="text-[10px] text-slate-400">{tmpl.footerText}</p>}
                </div>

                {/* Buttons */}
                {tmpl.buttons && tmpl.buttons.length > 0 && (
                  <div className="space-y-1">
                    {tmpl.buttons.map((btn, i) => (
                      <div
                        key={i}
                        className="text-center py-1 bg-green-50 border border-green-200 rounded text-[11px] font-bold text-green-800"
                      >
                        {btn.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span>Creada el {tmpl.createdAt}</span>
                <span className="text-green-700 font-bold">Lista para Meta WABA</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Builder Modal with Live Phone Preview */}
      {showBuilder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-4xl w-full p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Left: Form Builder */}
            <form onSubmit={handleSaveTemplate} className="space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-purple-600" />
                  Crear Plantilla de WhatsApp Meta
                </h3>
                <button type="button" onClick={() => setShowBuilder(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nombre de Plantilla *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. oferta_lanzamiento_2026"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 font-mono focus:outline-none focus:border-green-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Categoría</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:outline-none font-medium"
                  >
                    <option value="MARKETING">MARKETING</option>
                    <option value="UTILITY">UTILIDAD</option>
                    <option value="AUTHENTICATION">AUTENTICACIÓN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tipo de Encabezado</label>
                  <select
                    value={headerType}
                    onChange={(e) => setHeaderType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:outline-none font-medium"
                  >
                    <option value="TEXT">TEXTO</option>
                    <option value="IMAGE">IMAGEN</option>
                    <option value="DOCUMENT">DOCUMENTO</option>
                    <option value="NONE">NINGUNO</option>
                  </select>
                </div>
              </div>

              {headerType === 'TEXT' && (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Texto de Encabezado</label>
                  <input
                    type="text"
                    value={headerText}
                    onChange={(e) => setHeaderText(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:outline-none font-medium"
                  />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 font-semibold">Texto Principal *</label>
                  <button
                    type="button"
                    onClick={handleInsertVariable}
                    className="text-[10px] text-purple-700 hover:underline font-mono font-bold"
                  >
                    + Agregar Variable {"{{1}}"}
                  </button>
                </div>
                <textarea
                  rows={4}
                  required
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:border-green-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Texto de Pie</label>
                <input
                  type="text"
                  value={footerText}
                  onChange={(e) => setFooterText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:outline-none font-medium"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBuilder(false)}
                  className="px-3 py-1.5 rounded text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded shadow-sm"
                >
                  Enviar para Aprobación de Meta
                </button>
              </div>
            </form>

            {/* Right: Live Smartphone WhatsApp Mockup */}
            <div className="flex flex-col items-center justify-center border-l border-slate-200 pl-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center">
                <Smartphone className="w-4 h-4 mr-1 text-green-600" />
                Vista Previa de Pantalla de WhatsApp
              </span>

              {/* Phone Frame */}
              <div className="w-64 bg-slate-900 border-4 border-slate-800 rounded-3xl p-3 shadow-2xl space-y-3 font-sans">
                {/* Status Bar */}
                <div className="flex justify-between items-center text-[9px] text-slate-500 px-1 border-b border-slate-800 pb-1">
                  <span>9:41 AM</span>
                  <span className="text-green-400 font-bold">WhatsApp WABA</span>
                </div>

                {/* WhatsApp Chat Bubble Mockup */}
                <div className="bg-green-100 border border-green-200 text-green-900 rounded-xl p-3 text-xs space-y-1 shadow-sm">
                  {headerText && <p className="font-bold text-green-950 border-b border-green-200 pb-1">{headerText}</p>}
                  <p className="whitespace-pre-wrap text-[11px] leading-relaxed">
                    {bodyText.replace('{{1}}', 'Carlos')}
                  </p>
                  {footerText && <p className="text-[9px] text-slate-500 font-light">{footerText}</p>}

                  {/* Buttons Mockup */}
                  {buttons.map((btn, idx) => (
                    <div
                      key={idx}
                      className="mt-1 text-center py-1 bg-white border border-green-300 rounded text-[10px] font-bold text-green-800 shadow-xs"
                    >
                      {btn.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
