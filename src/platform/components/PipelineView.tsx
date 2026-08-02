import React, { useState } from 'react';
import {
  Columns3,
  Plus,
  MessageSquare,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  UserCheck,
  Tag,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Phone,
  Mail,
  Building2,
  X
} from 'lucide-react';
import { Lead, LeadStage, Agent } from '../types';

interface PipelineViewProps {
  leads: Lead[];
  agents: Agent[];
  onUpdateLeadStage: (leadId: string, newStage: LeadStage) => void;
  onSelectLeadForChat: (leadId: string) => void;
  onCreateLead: (lead: Partial<Lead>) => void;
  onOpenDelegateModal?: (item: { leadId?: string; leadName?: string; phone?: string; type: 'Follow-up Lead' }) => void;
}

export const PipelineView: React.FC<PipelineViewProps> = ({
  leads,
  agents,
  onUpdateLeadStage,
  onSelectLeadForChat,
  onCreateLead,
  onOpenDelegateModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgentFilter, setSelectedAgentFilter] = useState('all');
  const [selectedSourceFilter, setSelectedSourceFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Lead Form State
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadCompany, setNewLeadCompany] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadDealValue, setNewLeadDealValue] = useState('5000');
  const [newLeadSource, setNewLeadSource] = useState<'WhatsApp' | 'Meta Ads' | 'Website' | 'Manual'>('WhatsApp');

  const stages: LeadStage[] = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];

  const stageDisplayNames: Record<LeadStage, string> = {
    New: 'Nuevo',
    Contacted: 'Contactado',
    Qualified: 'Calificado',
    Proposal: 'Propuesta',
    Won: 'Ganado',
    Lost: 'Perdido'
  };

  const stageColors: Record<LeadStage, { bg: string; text: string; border: string }> = {
    New: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    Contacted: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    Qualified: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    Proposal: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    Won: { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200' },
    Lost: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' }
  };

  const filteredLeads = leads.filter((lead) => {
    if (selectedAgentFilter !== 'all' && lead.assignedAgentId !== selectedAgentFilter) return false;
    if (selectedSourceFilter !== 'all' && lead.source !== selectedSourceFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        lead.name.toLowerCase().includes(q) ||
        lead.company.toLowerCase().includes(q) ||
        lead.phone.includes(q) ||
        lead.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate Pipeline Financial Statistics
  const totalPipelineValue = filteredLeads.reduce((acc, l) => acc + l.dealValue, 0);
  const wonValue = filteredLeads.filter((l) => l.stage === 'Won').reduce((acc, l) => acc + l.dealValue, 0);
  const winRate = filteredLeads.length > 0 ? Math.round((filteredLeads.filter((l) => l.stage === 'Won').length / filteredLeads.length) * 100) : 0;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName || !newLeadPhone) return;

    onCreateLead({
      name: newLeadName,
      company: newLeadCompany || 'Particular',
      phone: newLeadPhone,
      email: newLeadEmail || `${newLeadName.toLowerCase().replace(/\s+/g, '')}@ejemplo.com`,
      dealValue: parseFloat(newLeadDealValue) || 5000,
      stage: 'New',
      source: newLeadSource,
      tags: ['Carga Manual', 'Entrante'],
      lastContacted: 'Recién',
      notes: 'Agregado desde el panel de embudo Clientum CRM.',
      score: 75
    });

    setNewLeadName('');
    setNewLeadCompany('');
    setNewLeadPhone('');
    setNewLeadEmail('');
    setShowAddModal(false);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-101px)] bg-slate-50 text-slate-900 overflow-hidden">
      {/* Top Header & Pipeline Analytics Banner */}
      <div className="p-4 bg-white border-b border-slate-200 space-y-3 shrink-0 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-slate-900 flex items-center">
              <Columns3 className="w-5 h-5 mr-2 text-green-600" />
              Embudo de Leads - Clientum CRM
            </h1>
            <p className="text-xs text-slate-500">
              Gestioná etapas del embudo de ventas de WhatsApp, asignación de agentes y flujo de oportunidades.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-3.5 py-2 rounded transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Lead</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-50 border border-slate-200 p-2.5 rounded">
            <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">Valor Total del Embudo</span>
            <p className="text-base font-extrabold text-green-700 font-mono mt-0.5">
              ${totalPipelineValue.toLocaleString()}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-2.5 rounded">
            <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">Oportunidades Ganadas</span>
            <p className="text-base font-extrabold text-teal-700 font-mono mt-0.5">
              ${wonValue.toLocaleString()}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-2.5 rounded">
            <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">Tasa de Conversión</span>
            <p className="text-base font-extrabold text-blue-700 font-mono mt-0.5">
              {winRate}%
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-2.5 rounded">
            <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">Total Leads Activos</span>
            <p className="text-base font-extrabold text-purple-700 font-mono mt-0.5">
              {filteredLeads.length} leads
            </p>
          </div>
        </div>

        {/* Filters bar */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar leads por nombre, empresa o teléfono..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-green-500 font-medium"
            />
          </div>

          {/* Agent Filter */}
          <select
            value={selectedAgentFilter}
            onChange={(e) => setSelectedAgentFilter(e.target.value)}
            className="bg-slate-50 text-slate-800 text-xs border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-green-500 font-bold"
          >
            <option value="all">Todos los agentes</option>
            {agents.map((ag) => (
              <option key={ag.id} value={ag.id}>
                Agente: {ag.name}
              </option>
            ))}
          </select>

          {/* Source Filter */}
          <select
            value={selectedSourceFilter}
            onChange={(e) => setSelectedSourceFilter(e.target.value)}
            className="bg-slate-50 text-slate-800 text-xs border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-green-500 font-bold"
          >
            <option value="all">Todas las fuentes</option>
            <option value="WhatsApp">WhatsApp Entrante</option>
            <option value="Meta Ads">Meta Ads</option>
            <option value="Website">Sitio Web</option>
            <option value="Manual">Manual</option>
          </select>
        </div>
      </div>

      {/* Kanban Board Columns Container */}
      <div className="flex-1 overflow-x-auto p-4 flex space-x-4">
        {stages.map((stage) => {
          const stageLeads = filteredLeads.filter((l) => l.stage === stage);
          const stageValue = stageLeads.reduce((sum, l) => sum + l.dealValue, 0);
          const colStyle = stageColors[stage];

          return (
            <div
              key={stage}
              className="w-72 shrink-0 bg-slate-100 border border-slate-200 rounded-lg flex flex-col h-full max-h-full overflow-hidden shadow-sm"
            >
              {/* Column Header */}
              <div className={`p-3 border-b ${colStyle.border} ${colStyle.bg} flex items-center justify-between`}>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-bold uppercase tracking-wider ${colStyle.text}`}>{stageDisplayNames[stage]}</span>
                    <span className="bg-white text-slate-700 font-mono text-[10px] px-2 py-0.5 rounded font-bold border border-slate-200 shadow-xs">
                      {stageLeads.length}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5 font-bold">
                    ${stageValue.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Cards Container */}
              <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
                {stageLeads.map((lead) => {
                  const currentIdx = stages.indexOf(lead.stage);

                  return (
                    <div
                      key={lead.id}
                      className="bg-white border border-slate-200 hover:border-green-500/80 rounded p-3 shadow-xs transition space-y-2 group"
                    >
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-green-700 transition">
                            {lead.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 flex items-center mt-0.5">
                            <Building2 className="w-3 h-3 mr-1 text-slate-400" />
                            {lead.company}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span
                            className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border inline-flex items-center gap-0.5 ${
                              lead.score >= 80
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : lead.score >= 50
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                            title={`Puntaje de Intención IA: ${lead.score}/100`}
                          >
                            <span>{lead.score >= 80 ? '⚡' : lead.score >= 50 ? '🔥' : '❄️'}</span>
                            <span>{lead.score}/100</span>
                          </span>
                        </div>
                      </div>

                      {/* Lead Score Progress Bar */}
                      <div className="space-y-0.5">
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              lead.score >= 80
                                ? 'bg-emerald-500'
                                : lead.score >= 50
                                ? 'bg-amber-500'
                                : 'bg-slate-400'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(0, lead.score))}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Phone & Source */}
                      <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-b border-slate-100 py-1 font-mono">
                        <span className="flex items-center">
                          <Phone className="w-2.5 h-2.5 mr-1 text-slate-400" />
                          {lead.phone}
                        </span>
                        <span className="bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                          {lead.source}
                        </span>
                      </div>

                      {/* Deal Value & Agent */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-extrabold text-green-700 font-mono">
                          ${lead.dealValue.toLocaleString()}
                        </span>
                        {lead.assignedAgentName && (
                          <span className="text-[10px] text-slate-500 font-medium">
                            👤 {lead.assignedAgentName.split(' ')[0]}
                          </span>
                        )}
                      </div>

                      {/* Actions bar: Open WhatsApp Chat & Move Stage buttons */}
                      <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-100">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => onSelectLeadForChat(lead.id)}
                            className="flex items-center space-x-1 text-[10px] bg-green-50 hover:bg-green-100 text-green-800 border border-green-200 px-2 py-1 rounded font-bold transition"
                            title="Abrir Chat WhatsApp"
                          >
                            <MessageSquare className="w-3 h-3 text-green-600" />
                            <span>Chat</span>
                          </button>

                          {onOpenDelegateModal && (
                            <button
                              onClick={() =>
                                onOpenDelegateModal({
                                  leadId: lead.id,
                                  leadName: lead.name,
                                  phone: lead.phone,
                                  type: 'Follow-up Lead'
                                })
                              }
                              className="flex items-center space-x-1 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 px-2 py-1 rounded font-bold transition"
                              title="Delegar seguimiento de este lead"
                            >
                              <UserCheck className="w-3 h-3 text-slate-600" />
                              <span>Delegar</span>
                            </button>
                          )}
                        </div>

                        {/* Stage navigation controls */}
                        <div className="flex items-center space-x-1">
                          <button
                            disabled={currentIdx === 0}
                            onClick={() => onUpdateLeadStage(lead.id, stages[currentIdx - 1])}
                            className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30"
                            title="Mover a la etapa anterior"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            disabled={currentIdx === stages.length - 1}
                            onClick={() => onUpdateLeadStage(lead.id, stages[currentIdx + 1])}
                            className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30"
                            title="Mover a la siguiente etapa"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {stageLeads.length === 0 && (
                  <div className="p-6 text-center text-slate-400 text-xs italic border border-dashed border-slate-300 rounded">
                    Sin leads en esta etapa
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create New Lead */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center">
                <Plus className="w-4 h-4 mr-2 text-green-600" />
                Agregar Nuevo Lead de Clientum CRM
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. María Delgado"
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:border-green-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Empresa</label>
                  <input
                    type="text"
                    placeholder="Nombre de la empresa"
                    value={newLeadCompany}
                    onChange={(e) => setNewLeadCompany(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:border-green-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Teléfono de WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="+54 9 11 1234-5678"
                    value={newLeadPhone}
                    onChange={(e) => setNewLeadPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:border-green-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    placeholder="lead@empresa.com"
                    value={newLeadEmail}
                    onChange={(e) => setNewLeadEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:border-green-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Valor Est. del Negocio ($)</label>
                  <input
                    type="number"
                    placeholder="5000"
                    value={newLeadDealValue}
                    onChange={(e) => setNewLeadDealValue(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:border-green-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Origen</label>
                <select
                  value={newLeadSource}
                  onChange={(e) => setNewLeadSource(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:border-green-500 font-medium"
                >
                  <option value="WhatsApp">WhatsApp Entrante</option>
                  <option value="Meta Ads">Meta Ads</option>
                  <option value="Website">Sitio Web</option>
                  <option value="Manual">Carga Manual</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded shadow-sm"
                >
                  Guardar Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
