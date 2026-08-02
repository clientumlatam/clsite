import React, { useState, useRef, useEffect } from 'react';
import { X, Clock, FileText, UserCheck, CheckCircle2, XCircle, CalendarPlus, CalendarCheck, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Conversation, Seller } from './crmTypes';

const statusColors: Record<string, string> = {
  activa: 'bg-sky-500/10 text-sky-400 border-sky-500/20 shadow-[0_0_10px_rgba(56,189,248,0.1)]',
  derivada: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.1)]',
  resuelta: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]',
  cerrada: 'bg-slate-800 text-slate-400 border-slate-700',
};

const typeLabels: Record<string, string> = {
  precios: '💰 Precios',
  horarios: '🕐 Horarios',
  sucursales: '📍 Sucursales',
  derivacion: '👤 Derivación',
  reclamo: '⚠️ Reclamo',
  otro: '❓ Otro',
};

interface Props {
  conversation: Conversation;
  sellers: Seller[];
  onClose: () => void;
  onUpdated: (id: string, data: Partial<Conversation>) => void;
}

export default function CrmConversationDetail({ conversation, sellers, onClose, onUpdated }: Props) {
  const [selectedSeller, setSelectedSeller] = useState(conversation.assigned_seller || '');
  const [budgetGenerated, setBudgetGenerated] = useState(conversation.budget_generated || false);
  const [budgetApproved, setBudgetApproved] = useState(conversation.budget_approved || false);
  const [visitDate, setVisitDate] = useState(
    conversation.visit_date ? new Date(conversation.visit_date).toISOString().slice(0, 16) : ''
  );
  const [closeSummary, setCloseSummary] = useState(conversation.summary || '');
  const [showCloseForm, setShowCloseForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const doUpdate = (data: Partial<Conversation>) => {
    setSaving(true);
    setTimeout(() => {
      if (!mountedRef.current) return;
      onUpdated(conversation.id, data);
      setSaving(false);
    }, 200);
  };

  const handleAssignSeller = () => {
    const seller = sellers.find(s => s.name === selectedSeller);
    doUpdate({ assigned_seller: selectedSeller, assigned_branch: seller?.branch || '', status: 'derivada' });
  };

  const handleToggleBudget = () => {
    const newVal = !budgetGenerated;
    setBudgetGenerated(newVal);
    doUpdate({ budget_generated: newVal });
  };

  const handleToggleBudgetApproved = () => {
    const newVal = !budgetApproved;
    setBudgetApproved(newVal);
    doUpdate({ budget_approved: newVal });
  };

  const handleScheduleVisit = () => {
    if (!visitDate) return;
    doUpdate({ visit_date: new Date(visitDate).toISOString(), visit_scheduled: true });
  };

  const handleClose = () => {
    doUpdate({ status: 'cerrada', summary: closeSummary });
    setShowCloseForm(false);
    onClose();
  };

  const isClosed = conversation.status === 'cerrada';

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in font-sans">
      <div className="absolute inset-0 bg-[#030712]/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0A101F] border-l border-[#1E293B] shadow-[-10px_0_30px_rgba(0,0,0,0.5)] flex flex-col h-full overflow-y-auto animate-slide-in-right">
        <div className="flex items-center justify-between p-5 border-b border-[#1E293B] sticky top-0 bg-[#0A101F]/90 backdrop-blur-md z-10">
          <div>
            <h2 className="font-bold text-lg text-white font-display tracking-wide uppercase">
              {conversation.customer_name || conversation.customer_phone}
            </h2>
            <p className="text-xs text-slate-500 font-mono tracking-widest">{conversation.customer_phone}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded bg-[#030712] border border-[#1E293B] hover:bg-[#1E293B] hover:text-sky-400 transition-colors text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-6 flex-1">
          <div className="flex flex-wrap gap-2">
            <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider font-mono ${statusColors[conversation.status]}`}>
              {conversation.status}
            </span>
            <span className="px-2 py-0.5 rounded border border-[#334155] bg-[#1E293B] text-slate-300 text-[10px] font-bold uppercase tracking-wider font-mono">
              {typeLabels[conversation.query_type] || conversation.query_type}
            </span>
            {conversation.budget_generated && (
              <span className="px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider font-mono flex items-center gap-1">
                <Zap className="w-3 h-3" /> PRESUPUESTO
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono bg-[#030712] p-2 rounded border border-[#1E293B]">
            <Clock className="w-3.5 h-3.5 text-sky-500/50" />
            <span>TIMESTAMP: {conversation.created_date ? format(new Date(conversation.created_date), "dd/MM/yyyy HH:mm:ss").toUpperCase() : '--/--/-- --:--:--'}</span>
          </div>

          {conversation.summary && (
            <div className="bg-[#030712] border border-[#1E293B] rounded-lg p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-slate-600" />
              <p className="text-[10px] font-bold text-slate-500 mb-2 flex items-center gap-1.5 font-mono uppercase tracking-widest">
                <FileText className="w-3.5 h-3.5" /> TRANSCRIPCIÓN RESUMIDA
              </p>
              <p className="text-sm text-slate-300 font-mono leading-relaxed pl-1">{conversation.summary}</p>
            </div>
          )}

          {!isClosed && (
            <div className="cockpit-panel p-4 border-sky-500/20 bg-[#0f172a]">
              <p className="text-xs font-bold text-sky-400 flex items-center gap-2 mb-3 font-display tracking-widest uppercase">
                <UserCheck className="w-4 h-4" /> ASIGNACIÓN DE RECURSOS
              </p>
              <select
                value={selectedSeller}
                onChange={e => setSelectedSeller(e.target.value)}
                className="cockpit-input w-full font-mono text-xs mb-3 bg-[#030712]"
              >
                <option value="">— SELECCIONAR OPERADOR —</option>
                {sellers.filter(s => s.active).map(s => (
                  <option key={s.id} value={s.name}>
                    {s.name.toUpperCase()} · {s.specialty.toUpperCase()} ({s.branch?.toUpperCase()})
                  </option>
                ))}
              </select>
              <button 
                onClick={handleAssignSeller} 
                disabled={!selectedSeller || saving} 
                className="w-full cockpit-button-primary py-2 text-[10px] font-bold tracking-widest uppercase font-mono"
              >
                {saving ? 'PROCESANDO...' : conversation.assigned_seller ? 'MODIFICAR RUTA' : 'ENRUTAR PAQUETE'}
              </button>
              {conversation.assigned_seller && (
                <p className="text-[10px] text-slate-500 text-center font-mono mt-3 uppercase tracking-widest bg-[#030712] py-1.5 rounded border border-[#1E293B]">
                  RUTA ACTUAL: <span className="font-bold text-sky-400">{conversation.assigned_seller}</span>
                  {conversation.assigned_branch && ` // ${conversation.assigned_branch}`}
                </p>
              )}
            </div>
          )}

          {!isClosed && (
            <div className="flex items-center justify-between p-4 rounded-lg bg-[#0f172a] border border-[#1E293B]">
              <div>
                <p className="text-xs font-bold text-slate-200 font-display tracking-widest uppercase">EMISIÓN DE PRESUPUESTO</p>
                <p className="text-[10px] text-slate-500 font-mono mt-1">¿COTIZACIÓN TRANSMITIDA AL CLIENTE?</p>
              </div>
              <button
                onClick={handleToggleBudget}
                disabled={saving}
                className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${budgetGenerated ? 'bg-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-[#1E293B]'}`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${budgetGenerated ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          )}

          {!isClosed && budgetGenerated && (
            <div className="flex items-center justify-between p-4 rounded-lg bg-[#0f172a] border border-[#1E293B]">
              <div>
                <p className="text-xs font-bold text-slate-200 font-display tracking-widest uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> VALIDACIÓN DE PRESUPUESTO
                </p>
                <p className="text-[10px] text-slate-500 font-mono mt-1">¿COTIZACIÓN APROBADA POR CLIENTE?</p>
              </div>
              <button
                onClick={handleToggleBudgetApproved}
                disabled={saving}
                className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${budgetApproved ? 'bg-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-[#1E293B]'}`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${budgetApproved ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          )}

          {!isClosed && budgetApproved && (
            <div className="p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full filter blur-[20px] pointer-events-none" />
              <p className="text-xs font-bold text-indigo-400 flex items-center gap-2 mb-3 font-display tracking-widest uppercase relative z-10">
                <CalendarPlus className="w-4 h-4" /> PROGRAMAR INTERVENCIÓN FÍSICA
              </p>
              
              <div className="relative z-10">
                {conversation.visit_scheduled && conversation.visit_date ? (
                  <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded py-2.5 font-mono uppercase tracking-widest">
                    <CalendarCheck className="w-4 h-4" />
                    T0: {format(new Date(conversation.visit_date), "dd/MM/yyyy HH:mm").toUpperCase()}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="datetime-local"
                      value={visitDate}
                      onChange={e => setVisitDate(e.target.value)}
                      className="cockpit-input w-full font-mono text-xs text-slate-300"
                    />
                    <button 
                      onClick={handleScheduleVisit} 
                      disabled={!visitDate || saving} 
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded py-2 text-[10px] font-bold tracking-widest uppercase font-mono transition-colors disabled:opacity-50"
                    >
                      {saving ? 'PROCESANDO...' : 'CONFIRMAR VENTANA DE TIEMPO'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {!isClosed && (
            <div className="p-4 rounded-lg border border-red-500/20 bg-[#0f172a]">
              <p className="text-xs font-bold text-red-400 flex items-center gap-2 mb-3 font-display tracking-widest uppercase">
                <XCircle className="w-4 h-4" /> TERMINACIÓN DE CONEXIÓN
              </p>
              {!showCloseForm ? (
                <button
                  className="w-full bg-transparent border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded py-2 text-[10px] font-bold tracking-widest uppercase font-mono transition-colors"
                  onClick={() => setShowCloseForm(true)}
                >
                  ABORTAR Y ARCHIVAR
                </button>
              ) : (
                <div className="space-y-3">
                  <textarea
                    value={closeSummary}
                    onChange={e => setCloseSummary(e.target.value)}
                    placeholder="MOTIVO DE CIERRE / NOTAS FINALES..."
                    rows={3}
                    className="cockpit-input w-full font-mono text-xs resize-none"
                  />
                  <div className="flex gap-2">
                    <button 
                      className="flex-1 cockpit-button-secondary py-2 text-[10px] font-bold tracking-widest uppercase font-mono" 
                      onClick={() => setShowCloseForm(false)}
                    >
                      CANCELAR
                    </button>
                    <button 
                      className="flex-1 bg-red-600 hover:bg-red-500 text-white rounded py-2 text-[10px] font-bold tracking-widest uppercase font-mono transition-colors disabled:opacity-50" 
                      onClick={handleClose} 
                      disabled={saving}
                    >
                      {saving ? 'CERRANDO...' : 'CONFIRMAR'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {isClosed && (
            <div className="bg-[#030712] border border-[#1E293B] rounded-lg p-5 text-center flex flex-col items-center">
              <CheckCircle2 className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest font-mono">CONEXIÓN ARCHIVADA</p>
              <p className="text-xs text-slate-600 font-mono mt-1">NO SE PERMITEN MODIFICACIONES</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
