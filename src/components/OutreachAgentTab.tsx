import React, { useState } from 'react';
import { Send, Users, Calendar, CheckCircle2, Play, Pause, Sparkles, Mail, MessageSquare, Clock, ArrowRight } from 'lucide-react';

interface SequenceItem {
  id: string;
  name: string;
  targetList: string;
  stepsCount: number;
  activeLeads: number;
  status: 'Running' | 'Paused';
  openRate: string;
  replyRate: string;
}

export function OutreachAgentTab() {
  const [sequences, setSequences] = useState<SequenceItem[]>([
    {
      id: 'seq_1',
      name: 'Secuencia Outreach B2B - Sector Oil & Gas',
      targetList: 'Leads Vaca Muerta (Patagonia)',
      stepsCount: 4,
      activeLeads: 86,
      status: 'Running',
      openRate: '68.4%',
      replyRate: '24.1%'
    },
    {
      id: 'seq_2',
      name: 'Secuencia de Bienvenida & Demo Hoteles',
      targetList: 'Alojamientos Turísticos Bariloche',
      stepsCount: 3,
      activeLeads: 42,
      status: 'Running',
      openRate: '72.0%',
      replyRate: '31.5%'
    }
  ]);

  const [newSeqModal, setNewSeqModal] = useState(false);
  const [seqName, setSeqName] = useState('');
  const [targetList, setTargetList] = useState('Directorio General CRM');
  const [successMsg, setSuccessMsg] = useState('');

  const handleCreateSequence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seqName) return;
    const newSeq: SequenceItem = {
      id: `seq_${Date.now()}`,
      name: seqName,
      targetList,
      stepsCount: 3,
      activeLeads: 15,
      status: 'Running',
      openRate: '0.0%',
      replyRate: '0.0%'
    };
    setSequences([newSeq, ...sequences]);
    setSeqName('');
    setNewSeqModal(false);
    setSuccessMsg('¡Secuencia de Outreach creada e iniciada con éxito!');
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleToggleStatus = (id: string) => {
    setSequences(sequences.map(s => {
      if (s.id === id) {
        return { ...s, status: s.status === 'Running' ? 'Paused' : 'Running' };
      }
      return s;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Agente de Outreach & Secuencias Automatizadas</h2>
            <p className="text-xs text-slate-500">Automatiza correos de seguimiento personalizados, programación inteligente y análisis de respuestas</p>
          </div>
        </div>

        <button
          onClick={() => setNewSeqModal(true)}
          className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-600/30 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Nueva Secuencia Outreach</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Sequences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sequences.map(seq => (
          <div key={seq.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                  seq.status === 'Running' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  ● {seq.status}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">{seq.name}</h3>
                <p className="text-xs text-slate-500">Lista objetivo: <strong className="text-slate-700">{seq.targetList}</strong></p>
              </div>

              <button
                onClick={() => handleToggleStatus(seq.id)}
                className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  seq.status === 'Running' ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-emerald-600 text-white shadow-sm'
                }`}
              >
                {seq.status === 'Running' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100">
              <div className="bg-slate-50 p-3 rounded-xl text-center">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Leads Activos</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">{seq.activeLeads}</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl text-center">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Tasa Apertura</div>
                <div className="text-base font-bold text-emerald-600 mt-0.5">{seq.openRate}</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl text-center">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Tasa Respuesta</div>
                <div className="text-base font-bold text-indigo-600 mt-0.5">{seq.replyRate}</div>
              </div>
            </div>

            {/* Sequence Steps Flow */}
            <div className="space-y-2 pt-2">
              <div className="text-[11px] font-bold text-slate-700 uppercase">Pasos Configurados ({seq.stepsCount})</div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-indigo-50/50 border border-indigo-100 text-indigo-900">
                  <Mail className="w-4 h-4 text-indigo-600" />
                  <span><strong>Paso 1:</strong> Email inicial personalizado con caso de éxito sectorial</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span><strong>Paso 2:</strong> Esperar 3 días si no hay respuesta</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100 text-emerald-900">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span><strong>Paso 3:</strong> Seguimiento automático por WhatsApp o segundo Email</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Sequence Modal */}
      {newSeqModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Crear Nueva Secuencia de Outreach</h3>
            <form onSubmit={handleCreateSequence} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre de la Secuencia</label>
                <input
                  type="text"
                  value={seqName}
                  onChange={(e) => setSeqName(e.target.value)}
                  placeholder="Ej. Campaña Q3 Cierres Corporativos"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lista de Destinatarios</label>
                <select
                  value={targetList}
                  onChange={(e) => setTargetList(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
                >
                  <option value="Directorio General CRM">Directorio General CRM (Todos)</option>
                  <option value="Leads Vaca Muerta">Leads Vaca Muerta</option>
                  <option value="Alojamientos Turísticos Bariloche">Alojamientos Turísticos Bariloche</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setNewSeqModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/30 cursor-pointer"
                >
                  Crear e Iniciar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
