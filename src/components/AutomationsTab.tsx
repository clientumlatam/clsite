import React, { useState } from 'react';
import { Workflow, Plus, Zap, CheckCircle2, PauseCircle, ArrowRight, Play, Trash2, Sparkles, Settings2, Mail, MessageSquare, ShieldCheck, UserCheck } from 'lucide-react';

interface BlockItem {
  id: string;
  type: 'trigger' | 'action' | 'condition';
  title: string;
  description: string;
  iconName: string;
}

export function AutomationsTab() {
  const [workflows, setWorkflows] = useState<Array<{
    id: string;
    name: string;
    status: 'Active';
    blocks: BlockItem[];
    executions: number;
    successRate: string;
  }>>([
    {
      id: 'w1',
      name: 'Captura Lead de IA Chat & Disparo WhatsApp',
      status: 'Active' as const,
      blocks: [
        { id: 'b1', type: 'trigger' as const, title: 'Nuevo Lead Capturado en Chat IA', description: 'El visitante completa nombre y WhatsApp en el chat del sitio.', iconName: 'MessageSquare' },
        { id: 'b2', type: 'action' as const, title: 'Calificación con Gemini ICP', description: 'Evalúa fit demográfico y sectorial automáticamente.', iconName: 'Sparkles' },
        { id: 'b3', type: 'action' as const, title: 'Enviar WhatsApp de Bienvenida', description: 'Mensaje personalizado con propuesta de valor y link a demo.', iconName: 'Mail' },
        { id: 'b4', type: 'action' as const, title: 'Crear Oportunidad en Pipeline CRM', description: 'Mueve el lead a la etapa de Prospectos con puntaje MEDDIC inicial.', iconName: 'ShieldCheck' }
      ],
      executions: 342,
      successRate: '98.4%'
    },
    {
      id: 'w2',
      name: 'Repurposing de Contenido Blog a Social',
      status: 'Active' as const,
      blocks: [
        { id: 'b20', type: 'trigger' as const, title: 'Nuevo Artículo Publicado en Blog', description: 'Detecta nuevo post de SEO y análisis patagónico.', iconName: 'Zap' },
        { id: 'b21', type: 'action' as const, title: 'Generar Hilos para LinkedIn y X', description: 'Gemini resume los puntos clave en tono profesional.', iconName: 'Sparkles' },
        { id: 'b22', type: 'action' as const, title: 'Programar Publicación Automática', description: 'Publica en redes en horario de mayor engagement.', iconName: 'CheckCircle2' }
      ],
      executions: 128,
      successRate: '95.0%'
    }
  ]);

  const [selectedWorkflowId, setSelectedWorkflowId] = useState('w1');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBlockType, setNewBlockType] = useState<'trigger' | 'action' | 'condition'>('action');
  const [newBlockTitle, setNewBlockTitle] = useState('');
  const [newBlockDesc, setNewBlockDesc] = useState('');

  const currentWorkflow = workflows.find(w => w.id === selectedWorkflowId) || workflows[0];

  const handleTestWorkflow = () => {
    setTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setTesting(false);
      setTestResult('¡Simulación de flujo ejecutada con éxito! Todos los bloques respondieron correctamente.');
    }, 1000);
  };

  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockTitle) return;
    const newBlock: BlockItem = {
      id: `block_${Date.now()}`,
      type: newBlockType,
      title: newBlockTitle,
      description: newBlockDesc || 'Configuración estándar del bloque automatizado',
      iconName: newBlockType === 'trigger' ? 'Zap' : 'Sparkles'
    };

    const updated = workflows.map(w => {
      if (w.id === selectedWorkflowId) {
        return { ...w, blocks: [...w.blocks, newBlock] };
      }
      return w;
    });
    setWorkflows(updated);
    setNewBlockTitle('');
    setNewBlockDesc('');
    setShowAddModal(false);
  };

  const handleRemoveBlock = (blockId: string) => {
    const updated = workflows.map(w => {
      if (w.id === selectedWorkflowId) {
        return { ...w, blocks: w.blocks.filter(b => b.id !== blockId) };
      }
      return w;
    });
    setWorkflows(updated);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Workflow className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Constructor Visual de Workflows Automatizados</h2>
            <p className="text-xs text-slate-500">Arrastra y configura bloques de disparadores y acciones para automatización de marketing y CRM</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTestWorkflow}
            disabled={testing}
            className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            {testing ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Play className="w-3.5 h-3.5" />}
            <span>{testing ? 'Simulando...' : 'Probar Workflow'}</span>
          </button>
        </div>
      </div>

      {testResult && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{testResult}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Workflow Switcher */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Workflows Activos</h3>
          <div className="space-y-2">
            {workflows.map(w => {
              const isSelected = w.id === selectedWorkflowId;
              return (
                <button
                  key={w.id}
                  onClick={() => { setSelectedWorkflowId(w.id); setTestResult(null); }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected ? 'bg-amber-50/70 border-amber-300 shadow-xs' : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900">{w.name}</div>
                  <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                    <span className="text-emerald-600 font-semibold">{w.status}</span>
                    <span>{w.executions} ejecuciones</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Visual Builder Canvas */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">{currentWorkflow.name}</h3>
              <p className="text-xs text-slate-500">Tasa de éxito: {currentWorkflow.successRate} • Secuencia automatizada secuencial</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Agregar Bloque
            </button>
          </div>

          <div className="space-y-4 py-4">
            {currentWorkflow.blocks.map((block, idx) => (
              <div key={block.id} className="relative flex flex-col items-center">
                <div className={`w-full max-w-xl p-4 rounded-2xl border shadow-xs flex items-start justify-between gap-4 ${
                  block.type === 'trigger' ? 'bg-amber-50/60 border-amber-200' : 'bg-indigo-50/40 border-indigo-200'
                }`}>
                  <div className="flex items-start space-x-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      block.type === 'trigger' ? 'bg-amber-500 text-white' : 'bg-indigo-600 text-white'
                    }`}>
                      {block.type === 'trigger' ? <Zap className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                          {block.type === 'trigger' ? 'Disparador' : 'Acción IA / CRM'}
                        </span>
                        <h4 className="font-bold text-xs text-slate-900">{block.title}</h4>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{block.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveBlock(block.id)}
                    className="text-slate-400 hover:text-red-600 p-1 rounded-lg hover:bg-white cursor-pointer"
                    title="Eliminar bloque"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {idx < currentWorkflow.blocks.length - 1 && (
                  <div className="h-6 w-0.5 bg-slate-300 my-1 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Block Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Agregar Bloque al Workflow</h3>
            <form onSubmit={handleAddBlock} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Bloque</label>
                <select
                  value={newBlockType}
                  onChange={(e) => setNewBlockType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                >
                  <option value="trigger">Disparador (Trigger)</option>
                  <option value="action">Acción (Action / IA)</option>
                  <option value="condition">Condición (Condition)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Título del Bloque</label>
                <input
                  type="text"
                  value={newBlockTitle}
                  onChange={(e) => setNewBlockTitle(e.target.value)}
                  placeholder="Ej. Enviar secuencia de email automático..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción corta</label>
                <textarea
                  rows={2}
                  value={newBlockDesc}
                  onChange={(e) => setNewBlockDesc(e.target.value)}
                  placeholder="Ej. Esperar 2 días y enviar recordatorio..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  Añadir Bloque
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
