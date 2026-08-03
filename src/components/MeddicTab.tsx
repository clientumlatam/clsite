// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { CRMDeal } from '../types';
import { loadDeals, saveDeals } from '../store/sharedStore';
import { ShieldCheck, CheckCircle, AlertTriangle, Sparkles, User, Building2, Award } from 'lucide-react';

export function MeddicTab() {
  const [deals, setDeals] = useState<CRMDeal[]>([]);
  const [selectedDealId, setSelectedDealId] = useState<string>('');
  const [activeMeddic, setActiveMeddic] = useState({
    metrics: '',
    economicBuyer: '',
    decisionCriteria: '',
    decisionProcess: '',
    identifyPain: '',
    champion: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const loaded = loadDeals();
    if (loaded.length === 0) {
      // Seed initial sample deals if none exist
      const initial: CRMDeal[] = [
        {
          id: 'deal_1',
          company: 'Petrolera Austral S.A.',
          contactName: 'Esteban Gomez',
          email: 'egomez@petroleraup.com.ar',
          amount: 28000,
          stage: 'meeting',
          industry: 'Oil & Gas',
          painPoint: 'Tiempos de respuesta lentos en coordinación logística en Neuquén.',
          meddic: {
            metrics: 'Reducción del 30% en costos de despacho.',
            economicBuyer: 'Director de Operaciones (Carlos V.)',
            decisionCriteria: 'Integración API segura, SLA < 99.9%',
            decisionProcess: 'Comité directivo el 15 de cada mes.',
            identifyPain: 'Pérdidas operativas por $45k USD mensuales.',
            champion: 'Gerente de Planta (Esteban Gomez)'
          }
        },
        {
          id: 'deal_2',
          company: 'Turismo Glaciares SRL',
          contactName: 'Mariana Valenzuela',
          email: 'mvalenzuela@glaciares.tur.ar',
          amount: 14500,
          stage: 'proposal',
          industry: 'Turismo Patagónico',
          painPoint: 'Falta de automatización en reservas y campañas de WhatsApp.',
          meddic: {
            metrics: 'Aumento de 40% en reservas directas.',
            economicBuyer: 'Dueña y Socia Gerente',
            decisionCriteria: 'Simplicidad de uso y soporte en español',
            decisionProcess: 'Aprobación directa de gerencia.',
            identifyPain: 'Alta tasa de carritos abandonados.',
            champion: 'Mariana Valenzuela'
          }
        }
      ];
      saveDeals(initial);
      setDeals(initial);
      setSelectedDealId(initial[0].id);
      setActiveMeddic(initial[0].meddic || { metrics: '', economicBuyer: '', decisionCriteria: '', decisionProcess: '', identifyPain: '', champion: '' });
    } else {
      setDeals(loaded);
      setSelectedDealId(loaded[0].id);
      setActiveMeddic(loaded[0].meddic || { metrics: '', economicBuyer: '', decisionCriteria: '', decisionProcess: '', identifyPain: '', champion: '' });
    }
  }, []);

  const handleSelectDeal = (id: string) => {
    setSelectedDealId(id);
    const d = deals.find(item => item.id === id);
    if (d && d.meddic) {
      setActiveMeddic(d.meddic);
    } else {
      setActiveMeddic({ metrics: '', economicBuyer: '', decisionCriteria: '', decisionProcess: '', identifyPain: '', champion: '' });
    }
  };

  const handleSaveMeddic = () => {
    const updated = deals.map(d => {
      if (d.id === selectedDealId) {
        return { ...d, meddic: activeMeddic };
      }
      return d;
    });
    setDeals(updated);
    saveDeals(updated);
    setSuccessMessage('¡Puntuación MEDDIC actualizada correctamente!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const calculateScore = () => {
    let filled = 0;
    if (activeMeddic.metrics) filled++;
    if (activeMeddic.economicBuyer) filled++;
    if (activeMeddic.decisionCriteria) filled++;
    if (activeMeddic.decisionProcess) filled++;
    if (activeMeddic.identifyPain) filled++;
    if (activeMeddic.champion) filled++;
    return Math.round((filled / 6) * 100);
  };

  const currentDeal = deals.find(d => d.id === selectedDealId);
  const score = calculateScore();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Calificador MEDDIC B2B</h2>
            <p className="text-xs text-slate-500">Metodología de calificación de ventas empresariales para PyMEs patagónicas</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Puntaje MEDDIC</div>
            <div className="text-xl font-black text-indigo-600">{score}%</div>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deal Selector Sidebar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Prospectos y Cuentas</h3>
          <div className="space-y-2">
            {deals.map(deal => {
              const isSelected = deal.id === selectedDealId;
              return (
                <button
                  key={deal.id}
                  onClick={() => handleSelectDeal(deal.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected ? 'bg-indigo-50/70 border-indigo-300 shadow-xs' : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                    <span>{deal.company}</span>
                    <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">${deal.amount.toLocaleString()}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" /> {deal.contactName || 'Sin contacto'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* MEDDIC Form */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          {currentDeal ? (
            <>
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{currentDeal.company}</h3>
                  <p className="text-xs text-slate-500">Industria: {currentDeal.industry} • Contacto: {currentDeal.contactName}</p>
                </div>
                <button
                  onClick={handleSaveMeddic}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-indigo-600/30 cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Guardar Evaluación MEDDIC
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Metrics */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px]">M</span>
                    <span>Metrics (Métricas cuantificables)</span>
                  </label>
                  <input
                    type="text"
                    value={activeMeddic.metrics || ''}
                    onChange={(e) => setActiveMeddic({ ...activeMeddic, metrics: e.target.value })}
                    placeholder="Ej. ROI esperado o reducción de costos..."
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Economic Buyer */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px]">E</span>
                    <span>Economic Buyer (Comprador económico)</span>
                  </label>
                  <input
                    type="text"
                    value={activeMeddic.economicBuyer || ''}
                    onChange={(e) => setActiveMeddic({ ...activeMeddic, economicBuyer: e.target.value })}
                    placeholder="Ej. Dueño, CFO o Director con presupuesto..."
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Decision Criteria */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px]">D</span>
                    <span>Decision Criteria (Criterios de decisión)</span>
                  </label>
                  <input
                    type="text"
                    value={activeMeddic.decisionCriteria || ''}
                    onChange={(e) => setActiveMeddic({ ...activeMeddic, decisionCriteria: e.target.value })}
                    placeholder="Ej. Precio, soporte local, integraciones..."
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Decision Process */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px]">D</span>
                    <span>Decision Process (Proceso de decisión)</span>
                  </label>
                  <input
                    type="text"
                    value={activeMeddic.decisionProcess || ''}
                    onChange={(e) => setActiveMeddic({ ...activeMeddic, decisionProcess: e.target.value })}
                    placeholder="Ej. Comité de compras, plazos de aprobación..."
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Identify Pain */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px]">I</span>
                    <span>Identify Pain (Dolor identificado)</span>
                  </label>
                  <input
                    type="text"
                    value={activeMeddic.identifyPain || ''}
                    onChange={(e) => setActiveMeddic({ ...activeMeddic, identifyPain: e.target.value })}
                    placeholder="Ej. Pérdida de tiempo, ineficiencia operativa..."
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Champion */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px]">C</span>
                    <span>Champion (Campeón interno)</span>
                  </label>
                  <input
                    type="text"
                    value={activeMeddic.champion || ''}
                    onChange={(e) => setActiveMeddic({ ...activeMeddic, champion: e.target.value })}
                    placeholder="Ej. Gerente depto que impulsa la solución..."
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Selecciona un prospecto para evaluar su puntaje MEDDIC.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
