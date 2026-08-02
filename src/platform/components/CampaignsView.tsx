import React, { useState } from 'react';
import { Send, Plus, Calendar, CheckCircle2, Users, Sparkles, Clock } from 'lucide-react';
import { Campaign, CustomerSegment } from '../types';

interface CampaignsViewProps {
  campaigns: Campaign[];
  segments: CustomerSegment[];
  onAddCampaign: (campaign: Campaign) => void;
}

export const CampaignsView: React.FC<CampaignsViewProps> = ({
  campaigns,
  segments,
  onAddCampaign
}) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [segmentId, setSegmentId] = useState(segments[0]?.id || '');
  const [messageTemplate, setMessageTemplate] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !messageTemplate) return;

    const selectedSeg = segments.find(s => s.id === segmentId);

    const newCamp: Campaign = {
      id: `cmp-${Date.now()}`,
      name,
      segmentId,
      segmentName: selectedSeg?.name || 'Segmento General',
      messageTemplate,
      status: 'programada',
      recipientsCount: selectedSeg?.leadCount || 20,
      deliveredCount: 0,
      responseRate: 0,
      scheduledDate: new Date().toISOString().split('T')[0]
    };

    onAddCampaign(newCamp);
    setName('');
    setMessageTemplate('');
    setShowModal(false);
  };

  return (
    <div className="p-8 space-y-8 bg-[#070d1f] min-h-screen text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs bg-emerald-500/10 text-emerald-400 font-semibold px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" /> Difusión Masiva WhatsApp API
            </span>
            <span className="text-xs text-slate-400">{campaigns.length} Campañas</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Campañas de WhatsApp</h1>
          <p className="text-sm text-slate-400">Envía mensajes personalizados y masivos a tus segmentos de clientes con alta tasa de apertura.</p>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Nueva Campaña Masiva
        </button>
      </div>

      <div className="space-y-4">
        {campaigns.map((camp) => (
          <div key={camp.id} className="bg-[#0B132B] border border-[#1C2541] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <Send className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <h3 className="text-base font-bold text-white">{camp.name}</h3>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                      camp.status === 'enviada' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {camp.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Segmento: <span className="text-emerald-400 font-medium">{camp.segmentName}</span> • Programada: {camp.scheduledDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Destinatarios</span>
                  <span className="text-sm font-bold text-white">{camp.recipientsCount} contactos</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Tasa de Respuesta</span>
                  <span className="text-sm font-bold text-emerald-400">{camp.responseRate}%</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#1C2541]/60 border border-slate-700/60 text-xs text-slate-200">
              <p className="font-semibold text-slate-400 mb-1">Plantilla de Mensaje:</p>
              <p className="italic font-mono text-emerald-300">"{camp.messageTemplate}"</p>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B132B] border border-[#1C2541] rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C2541]">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-400" /> Nueva Campaña de WhatsApp
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nombre de la Campaña</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Oferta Especial Invierno"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-[#1C2541] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Segmento Destinatario</label>
                <select 
                  value={segmentId}
                  onChange={e => setSegmentId(e.target.value)}
                  className="w-full bg-[#1C2541] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  {segments.map(seg => (
                    <option key={seg.id} value={seg.id}>{seg.name} ({seg.leadCount} contactos)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Plantilla de Mensaje (Usa {"{nombre}"} para personalizar)</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Hola {nombre}, tenemos una propuesta exclusiva para tu empresa..."
                  value={messageTemplate}
                  onChange={e => setMessageTemplate(e.target.value)}
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
                  Programar Campaña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
