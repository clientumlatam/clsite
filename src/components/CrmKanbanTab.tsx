import React, { useState, useEffect } from 'react';
import { CRMDeal } from '../types';
import { loadDeals, saveDeals, addDeal } from '../store/sharedStore';
import { Kanban, Plus, DollarSign, User, Building2, ChevronRight, ChevronLeft, Sparkles, CheckCircle2 } from 'lucide-react';

const STAGES: Array<{ id: CRMDeal['stage']; label: string; color: string; bg: string }> = [
  { id: 'leads', label: 'Nuevos Leads', color: 'border-blue-400', bg: 'bg-blue-50/50' },
  { id: 'contacted', label: 'Contactados', color: 'border-amber-400', bg: 'bg-amber-50/50' },
  { id: 'meeting', label: 'Reunión / Demo', color: 'border-purple-400', bg: 'bg-purple-50/50' },
  { id: 'proposal', label: 'Propuesta / Cotización', color: 'border-indigo-400', bg: 'bg-indigo-50/50' },
  { id: 'closed', label: 'Cerrado Ganado', color: 'border-emerald-400', bg: 'bg-emerald-50/50' },
];

export function CrmKanbanTab() {
  const [deals, setDeals] = useState<CRMDeal[]>([]);
  const [newDealModal, setNewDealModal] = useState(false);
  const [company, setCompany] = useState('');
  const [contactName, setContactName] = useState('');
  const [amount, setAmount] = useState('10000');
  const [industry, setIndustry] = useState('Oil & Gas / B2B');
  const [painPoint, setPainPoint] = useState('');

  useEffect(() => {
    const loaded = loadDeals();
    if (loaded.length === 0) {
      const defaultDeals: CRMDeal[] = [
        {
          id: 'deal_k1',
          company: 'Neuquén Tech Solutions',
          contactName: 'Marcos Pérez',
          amount: 15000,
          stage: 'leads',
          industry: 'Tecnología',
          painPoint: 'Requiere automatización de WhatsApp y CRM para Vaca Muerta.',
        },
        {
          id: 'deal_k2',
          company: 'Patagonia Logistics',
          contactName: 'Lucía Benítez',
          amount: 24000,
          stage: 'contacted',
          industry: 'Logística',
          painPoint: 'Tiempos de entrega y seguimiento de envíos en la Patagonia.',
        },
        {
          id: 'deal_k3',
          company: 'Hoteles Andinos S.A.',
          contactName: 'Federico Rivas',
          amount: 18500,
          stage: 'meeting',
          industry: 'Turismo & Hospitalidad',
          painPoint: 'Centralización de reservas directas y campañas de pauta digital.',
        },
        {
          id: 'deal_k4',
          company: 'Constructora Austral',
          contactName: 'Valeria Gomez',
          amount: 32000,
          stage: 'proposal',
          industry: 'Construcción',
          painPoint: 'Control de cotizaciones y ciclo de ventas corporativas.',
        },
        {
          id: 'deal_k5',
          company: 'Energía del Sur SRL',
          contactName: 'Esteban Ortiz',
          amount: 45000,
          stage: 'closed',
          industry: 'Energía',
          painPoint: 'Integración completa con sistemas ERP y analítica de datos.',
        },
      ];
      saveDeals(defaultDeals);
      setDeals(defaultDeals);
    } else {
      setDeals(loaded);
    }
  }, []);

  const handleMoveStage = (dealId: string, direction: 'next' | 'prev') => {
    const stageOrder: CRMDeal['stage'][] = ['leads', 'contacted', 'meeting', 'proposal', 'closed'];
    const updated = deals.map(deal => {
      if (deal.id === dealId) {
        const currentIndex = stageOrder.indexOf(deal.stage);
        let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
        if (newIndex >= stageOrder.length) newIndex = stageOrder.length - 1;
        if (newIndex < 0) newIndex = 0;
        return { ...deal, stage: stageOrder[newIndex] };
      }
      return deal;
    });
    setDeals(updated);
    saveDeals(updated);
  };

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;
    const newDeal = addDeal({
      company,
      contactName,
      amount: parseFloat(amount) || 0,
      industry,
      stage: 'leads',
      painPoint,
    });
    setDeals([newDeal, ...deals]);
    setCompany('');
    setContactName('');
    setAmount('10000');
    setPainPoint('');
    setNewDealModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Kanban className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Pipeline de Ventas (Kanban)</h2>
            <p className="text-xs text-slate-500">Gestión visual de prospectos y oportunidades B2B con etapas sincronizadas</p>
          </div>
        </div>

        <button
          onClick={() => setNewDealModal(true)}
          className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Deal</span>
        </button>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {STAGES.map(stage => {
          const stageDeals = deals.filter(d => d.stage === stage.id);
          const stageTotal = stageDeals.reduce((sum, d) => sum + (d.amount || 0), 0);

          return (
            <div key={stage.id} className={`rounded-2xl border border-slate-200 bg-slate-50/60 p-4 flex flex-col gap-3 min-w-[260px]`}>
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full border-2 ${stage.color}`}></div>
                  <span className="font-bold text-xs text-slate-800">{stage.label}</span>
                </div>
                <span className="text-[10px] font-bold bg-white text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                  {stageDeals.length}
                </span>
              </div>

              <div className="text-[11px] text-slate-500 font-semibold flex justify-between">
                <span>Total Etapa:</span>
                <span className="text-slate-900 font-bold">${stageTotal.toLocaleString()} USD</span>
              </div>

              <div className="space-y-3 flex-1">
                {stageDeals.map(deal => (
                  <div key={deal.id} className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-2.5 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                      <div className="font-bold text-xs text-slate-900">{deal.company}</div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        ${deal.amount.toLocaleString()}
                      </span>
                    </div>

                    {deal.contactName && (
                      <div className="text-[11px] text-slate-600 flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" /> {deal.contactName}
                      </div>
                    )}

                    {deal.painPoint && (
                      <div className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
                        "{deal.painPoint}"
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      <button
                        onClick={() => handleMoveStage(deal.id, 'prev')}
                        className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer disabled:opacity-30"
                        title="Mover a etapa anterior"
                        disabled={stage.id === 'leads'}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-[10px] font-medium text-slate-400">{deal.industry}</span>
                      <button
                        onClick={() => handleMoveStage(deal.id, 'next')}
                        className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer disabled:opacity-30"
                        title="Avanzar etapa"
                        disabled={stage.id === 'closed'}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {stageDeals.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl bg-white/50">
                    Sin prospectos
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Deal Modal */}
      {newDealModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Crear Nuevo Deal B2B</h3>
            <form onSubmit={handleCreateDeal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Empresa</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Ej. Petrolera del Sur"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre de Contacto</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Ej. Juan Carlos Gomez"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Monto Estimado (USD)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Industria</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Dolor o Necesidad Principal</label>
                <textarea
                  rows={2}
                  value={painPoint}
                  onChange={(e) => setPainPoint(e.target.value)}
                  placeholder="Ej. Demora en atención de clientes y cierre de ventas..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setNewDealModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  Crear Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
