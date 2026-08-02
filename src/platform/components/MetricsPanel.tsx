import React from 'react';
import { Lead, LogEntry } from '../types';
import { Terminal, Database, DollarSign, Cpu, Trash2, PlayCircle, RefreshCw } from 'lucide-react';

interface MetricsPanelProps {
  leads: Lead[];
  logs: LogEntry[];
  onClearLogs: () => void;
  onSimulateCron: () => void;
}

export default function MetricsPanel({ leads, logs, onClearLogs, onSimulateCron }: MetricsPanelProps) {
  // Compute CRM pipeline value
  const activeLeads = leads.filter(l => l.status !== 'frio');
  const totalPipelineValue = activeLeads.reduce((acc, curr) => acc + (curr.amountArs || 180000), 0);
  
  // Counts by status
  const getCountByStatus = (status: Lead['status']) => leads.filter(l => l.status === status).length;

  // Compute simulated AI usage costs
  const geminiCalls = logs.filter(l => l.sender.toLowerCase().includes('boardroom') || l.sender.toLowerCase().includes('ia &') || l.sender.toLowerCase().includes('asesor') || l.sender.toLowerCase().includes('santi')).length;
  const mapsCalls = logs.filter(l => l.sender.toLowerCase().includes('explorador')).length;
  
  // Static pricing rules (arbitrary but highly realistic for tracking)
  const estTokens = geminiCalls * 1845;
  const estCostUsd = (geminiCalls * 0.00015) + (mapsCalls * 0.015);

  return (
    <div id="metrics-panel-root" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* 1. KPIs & Financial Data */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5 font-mono uppercase text-slate-400">
            <DollarSign className="h-4 w-4 text-emerald-400" />
            Métricas del Embudo
          </h3>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">Cálculo en vivo de revenue y conversión</p>
        </div>

        {/* Big numbers */}
        <div className="space-y-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono">Valor Total del Pipeline</span>
            <div className="text-2xl font-black text-white tracking-tight mt-1 flex items-baseline gap-1.5">
              ${totalPipelineValue.toLocaleString('es-AR')}
              <span className="text-xs text-emerald-400 font-mono font-normal">ARS</span>
            </div>
          </div>

          {/* Counts matrix */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/40">
              <span className="text-[9px] text-slate-500 font-mono block">Pendientes</span>
              <span className="text-sm font-bold text-slate-200 mt-0.5 block">{getCountByStatus('pendiente')}</span>
            </div>
            <div className="bg-blue-950/20 p-2 rounded-xl border border-blue-900/20">
              <span className="text-[9px] text-blue-400 font-mono block">Contactados</span>
              <span className="text-sm font-bold text-blue-300 mt-0.5 block">{getCountByStatus('contactado')}</span>
            </div>
            <div className="bg-rose-950/20 p-2 rounded-xl border border-rose-900/20">
              <span className="text-[9px] text-rose-400 font-mono block">Calientes</span>
              <span className="text-sm font-bold text-rose-300 mt-0.5 block">{getCountByStatus('caliente')}</span>
            </div>
            <div className="bg-amber-950/20 p-2 rounded-xl border border-amber-900/20">
              <span className="text-[9px] text-amber-400 font-mono block">Tibios</span>
              <span className="text-sm font-bold text-amber-300 mt-0.5 block">{getCountByStatus('tibio')}</span>
            </div>
            <div className="bg-purple-950/20 p-2 rounded-xl border border-purple-900/20">
              <span className="text-[9px] text-purple-400 font-mono block">Agendados</span>
              <span className="text-sm font-bold text-purple-300 mt-0.5 block">{getCountByStatus('agendado')}</span>
            </div>
            <div className="bg-slate-900/20 p-2 rounded-xl border border-slate-950">
              <span className="text-[9px] text-slate-600 font-mono block">Fríos</span>
              <span className="text-sm font-bold text-slate-500 mt-0.5 block">{getCountByStatus('frio')}</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[10px] text-slate-500 font-mono border-t border-slate-900 pt-3 flex items-center justify-between">
          <span>Conversión General:</span>
          <span className="text-emerald-400 font-bold">
            {leads.length > 0 ? Math.round(((getCountByStatus('agendado') + getCountByStatus('caliente')) / leads.length) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* 2. Token & API Costs */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5 font-mono uppercase text-slate-400">
            <Cpu className="h-4 w-4 text-purple-400" />
            Consumo de APIs & IA
          </h3>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">Cálculo estimado de tokens y llamadas</p>
        </div>

        {/* Big numbers */}
        <div className="space-y-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono">Tokens Gemini Estimados</span>
            <div className="text-2xl font-black text-white tracking-tight mt-1 flex items-baseline gap-1.5">
              {estTokens.toLocaleString('es-AR')}
              <span className="text-xs text-purple-400 font-mono font-normal">tkn</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-slate-400">
            <div className="flex justify-between border-b border-slate-900 pb-1">
              <span>Llamadas Gemini:</span>
              <span className="font-mono text-slate-200">{geminiCalls}</span>
            </div>
            <div className="flex justify-between border-b border-slate-900 pb-1">
              <span>Llamadas Maps (Places):</span>
              <span className="font-mono text-slate-200">{mapsCalls}</span>
            </div>
            <div className="flex justify-between pb-1">
              <span>Costo Proyectado USD:</span>
              <span className="font-mono text-amber-500 font-bold">${estCostUsd.toFixed(4)} USD</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[10px] text-slate-500 font-mono border-t border-slate-900 pt-3 flex items-center justify-between">
          <span>Proveedor Central:</span>
          <span className="text-purple-400 font-bold">Google AI Studio</span>
        </div>
      </div>

      {/* 3. Operational Log console */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col justify-between gap-4 relative overflow-hidden">
        
        {/* Title */}
        <div className="flex items-center justify-between border-b border-slate-900 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5 font-mono uppercase text-slate-400">
              <Terminal className="h-4 w-4 text-amber-500" />
              Consola Operativa (Logs)
            </h3>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">Monitoreo de tareas en vivo</p>
          </div>

          {/* Quick buttons */}
          <div className="flex items-center gap-1">
            {/* Run manual Cron */}
            <button
              onClick={onSimulateCron}
              className="p-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
              title="Simular Cron Acciones (15 min)"
            >
              <PlayCircle className="h-4 w-4" />
            </button>
            {/* Clear logs */}
            <button
              onClick={onClearLogs}
              className="p-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
              title="Limpiar Logs"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Live logs stream terminal box */}
        <div className="bg-slate-950 border border-slate-900 rounded-xl p-3 h-28 overflow-y-auto space-y-2 text-[10px] font-mono scrollbar-thin scrollbar-thumb-slate-900">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-1 leading-normal">
              <span className="text-slate-600">[{log.timestamp}]</span>
              <span className={`font-bold ${
                log.type === 'success' ? 'text-emerald-400' :
                log.type === 'warning' ? 'text-amber-400' :
                log.type === 'error' ? 'text-red-400' :
                'text-blue-400'
              }`}>{log.sender}:</span>
              <span className="text-slate-300">{log.message}</span>
            </div>
          ))}
          {logs.length === 0 && (
            <span className="text-slate-600 block text-center pt-8 italic">Consola limpia. Esperando acciones...</span>
          )}
        </div>

        {/* Help footer */}
        <div className="text-[9px] text-slate-600 font-mono border-t border-slate-950 pt-2 text-center">
          Hacé clic en el icono de Play para forzar la corrida del orquestador.
        </div>

      </div>

    </div>
  );
}
