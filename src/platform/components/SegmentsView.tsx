import React, { useState } from 'react';
import { Users, Tag, Plus, Filter, Sparkles, Send, ShieldCheck } from 'lucide-react';
import { CustomerSegment, Lead } from '../types';

interface SegmentsViewProps {
  segments: CustomerSegment[];
  leads: Lead[];
  onAddSegment: (newSegment: CustomerSegment) => void;
}

export const SegmentsView: React.FC<SegmentsViewProps> = ({
  segments,
  leads,
  onAddSegment
}) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [filterTag, setFilterTag] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !filterTag) return;

    const newSeg: CustomerSegment = {
      id: `seg-${Date.now()}`,
      name,
      description: description || 'Segmento personalizado de clientes WhatsApp',
      criteria: { tags: [filterTag] },
      contactCount: leads.filter(l => l.tags.includes(filterTag)).length || 5,
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    onAddSegment(newSeg);
    setName('');
    setDescription('');
    setFilterTag('');
    setShowModal(false);
  };

  return (
    <div className="p-8 space-y-8 bg-[#070d1f] min-h-screen text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs bg-emerald-500/10 text-emerald-400 font-semibold px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Segmentación Avanzada CRM
            </span>
            <span className="text-xs text-slate-400">{segments.length} Segmentos Activos</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Clientes y Segmentos WhatsApp</h1>
          <p className="text-sm text-slate-400">Organiza tu base de contactos por etiquetas, comportamiento e intereses para campañas.</p>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Crear Segmento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {segments.map((seg) => (
          <div key={seg.id} className="bg-[#0B132B] border border-[#1C2541] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                  {seg.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{seg.name}</h3>
                  <span className="text-xs text-emerald-400 font-medium">#{seg.filterTag}</span>
                </div>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${seg.color}`}>
                {seg.leadCount} Contactos
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">{seg.description}</p>

            <div className="pt-4 border-t border-[#1C2541] flex items-center justify-between">
              <span className="text-xs text-slate-500">Creado el {seg.createdAt}</span>
              <button className="px-3.5 py-1.5 rounded-xl bg-[#1C2541] hover:bg-[#253258] text-xs font-semibold text-white transition-all border border-slate-700 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-emerald-400" /> Lanzar Campaña
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B132B] border border-[#1C2541] rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C2541]">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" /> Nuevo Segmento de Clientes
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nombre del Segmento</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Inversionistas Real Estate"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-[#1C2541] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Etiqueta de Filtro (#Tag)</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: RealEstate"
                  value={filterTag}
                  onChange={e => setFilterTag(e.target.value)}
                  className="w-full bg-[#1C2541] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Descripción</label>
                <textarea 
                  rows={3}
                  placeholder="Descripción del segmento de clientes..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-[#1C2541] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#1C2541] text-slate-300 hover:text-white text-sm font-medium"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-lg shadow-emerald-600/20"
                >
                  Guardar Segmento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
