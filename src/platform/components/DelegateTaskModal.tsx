import React, { useState } from 'react';
import {
  UserCheck,
  X,
  Send,
  AlertCircle,
  Calendar,
  Clock,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Agent } from '../types';

interface DelegateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  agents: Agent[];
  currentAgent: Agent;
  itemToDelegate?: {
    leadId?: string;
    leadName?: string;
    phone?: string;
    convId?: string;
    type: 'WhatsApp Thread' | 'Follow-up Lead' | 'General Task';
  } | null;
  onConfirmDelegation: (delegationData: {
    agentId: string;
    title: string;
    priority: 'High' | 'Medium' | 'Low';
    dueDate: string;
    notes: string;
    leadId?: string;
    leadName?: string;
    convId?: string;
  }) => void;
}

export const DelegateTaskModal: React.FC<DelegateTaskModalProps> = ({
  isOpen,
  onClose,
  agents,
  currentAgent,
  itemToDelegate,
  onConfirmDelegation
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(
    agents.find((a) => a.id !== currentAgent.id)?.id || agents[0]?.id || ''
  );
  const [taskTitle, setTaskTitle] = useState<string>(
    itemToDelegate?.leadName
      ? `Seguimiento de ${itemToDelegate.type} con ${itemToDelegate.leadName}`
      : 'Atención personalizada de WhatsApp'
  );
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [dueDate, setDueDate] = useState<string>(
    new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16)
  );
  const [notes, setNotes] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const targetAgent = agents.find((a) => a.id === selectedAgentId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgentId || !taskTitle.trim()) return;

    onConfirmDelegation({
      agentId: selectedAgentId,
      title: taskTitle,
      priority,
      dueDate,
      notes: notes || `Tarea delegada por ${currentAgent.name} desde el CRM.`,
      leadId: itemToDelegate?.leadId,
      leadName: itemToDelegate?.leadName,
      convId: itemToDelegate?.convId
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white leading-snug">
                Delegar Tarea a Agente AI / Humano
              </h3>
              <p className="text-[11px] text-slate-400">
                Asignación inteligente de cola de trabajo WhatsApp & CRM
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-green-100 border border-green-300 rounded-full flex items-center justify-center text-green-700 mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-base">
              ¡Tarea Delegada con Éxito!
            </h4>
            <p className="text-xs text-slate-600">
              Se ha asignado a <b className="text-slate-900">{targetAgent?.name}</b> y se ha actualizado la cola global del equipo.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Context Item Banner */}
            {itemToDelegate && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <MessageSquare className="w-4 h-4 text-green-600 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Elemento a Delegar ({itemToDelegate.type})
                    </span>
                    <span className="font-extrabold text-slate-900">
                      {itemToDelegate.leadName || 'Lead Sin Nombre'}
                    </span>
                    {itemToDelegate.phone && (
                      <span className="text-slate-500 font-mono ml-2">
                        ({itemToDelegate.phone})
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full border border-green-200">
                  CRM Direct
                </span>
              </div>
            )}

            {/* Select Target Agent */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Seleccionar Agente Destino *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                {agents.map((ag) => (
                  <button
                    key={ag.id}
                    type="button"
                    onClick={() => setSelectedAgentId(ag.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center space-x-2.5 transition ${
                      selectedAgentId === ag.id
                        ? 'border-green-600 bg-green-50/80 ring-1 ring-green-600'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <img
                      src={ag.avatar}
                      alt={ag.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900 truncate">{ag.name}</p>
                      <p className="text-[10px] text-slate-500 capitalize">
                        {ag.role} • {ag.assignedLeadsCount} leads asignados
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Task Title */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Título / Asunto de la Tarea *
              </label>
              <input
                type="text"
                required
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="ej. Llamar para cerrar propuesta comercial ERPNext"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium focus:outline-none focus:border-green-600"
              />
            </div>

            {/* Priority & Due Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Prioridad</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'High' | 'Medium' | 'Low')}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-800 focus:outline-none focus:border-green-600"
                >
                  <option value="High">🔴 Alta / Urgente</option>
                  <option value="Medium">🟡 Media Standard</option>
                  <option value="Low">🟢 Baja / Seguimiento</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Fecha Límite</label>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-slate-800 focus:outline-none focus:border-green-600"
                />
              </div>
            </div>

            {/* Delegation Notes / Instructions */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Instrucciones / Notas para el Agente
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Detalla qué necesita este cliente, acuerdos previos o contexto especial..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 outline-none focus:border-green-600"
              />
            </div>

            {/* Footer buttons */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-extrabold rounded-xl shadow-md transition flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirmar Delegación</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
