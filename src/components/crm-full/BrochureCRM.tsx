import React from 'react';
import { FileText, ExternalLink, Download, Eye } from 'lucide-react';

const BROCHURES = [
  { id: '1', name: 'Brochure Corporativo 2026', desc: 'Presentación general de Clientum CRM para distribuidoras y PyMEs patagónicas.', badge: 'Principal', color: 'text-[#10B981]', bg: 'bg-[#10B981]/10 border-[#10B981]/30', url: '/brochure' },
  { id: '2', name: 'Brochure Distribuidoras', desc: 'Propuesta específica para el sector de distribución mayorista de la Patagonia.', badge: 'Vertical', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30', url: '#' },
  { id: '3', name: 'Brochure Salud & Clínicas', desc: 'Adaptación del brochure para clínicas de salud, estética y consultorios.', badge: 'Vertical', color: 'text-violet-400', bg: 'bg-violet-400/10 border-violet-400/30', url: '#' },
  { id: '4', name: 'One-Pager Ejecutivo', desc: 'Resumen de una página con propuesta de valor y precios para el decisor.', badge: 'Ventas', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/30', url: '#' },
];

export default function BrochureCRM() {
  return (
    <div className="space-y-6 text-slate-200">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-amber-400/15 border border-amber-400/30 rounded-xl flex items-center justify-center">
          <FileText className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h1 className="text-xl font-black text-white tracking-tight">Brochure</h1>
          <p className="text-slate-400 text-sm">Materiales de venta y presentación para clientes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BROCHURES.map(b => (
          <div key={b.id} className="bg-[#0D1424] border border-[#1E293B] rounded-xl p-5 hover:border-slate-600 transition-all group">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${b.bg} ${b.color} mb-2`}>{b.badge}</span>
                <h3 className="font-bold text-white text-sm">{b.name}</h3>
              </div>
              <FileText className="w-5 h-5 text-slate-600 group-hover:text-slate-400 transition-all flex-shrink-0" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">{b.desc}</p>
            <div className="flex gap-2">
              <a href={b.url} target={b.url !== '#' ? '_blank' : undefined} rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white border border-[#1E293B] hover:border-slate-600 px-3 py-2 rounded-lg transition-all">
                <Eye className="w-3.5 h-3.5" /> Ver
              </a>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white border border-[#1E293B] hover:border-slate-600 px-3 py-2 rounded-lg transition-all">
                <Download className="w-3.5 h-3.5" /> PDF
              </button>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white border border-[#1E293B] hover:border-slate-600 px-3 py-2 rounded-lg transition-all">
                <ExternalLink className="w-3.5 h-3.5" /> Compartir
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#10B981]/5 border border-[#10B981]/20 rounded-xl p-4">
        <p className="text-xs text-slate-400 leading-relaxed">
          <strong className="text-[#10B981]">Copiloto IA</strong> puede generar versiones personalizadas de estos brochures para cada cliente. Usá la sección <em>Copiloto IA</em> con el tipo "Landing Page" o escribí directamente qué querés generar.
        </p>
      </div>
    </div>
  );
}
