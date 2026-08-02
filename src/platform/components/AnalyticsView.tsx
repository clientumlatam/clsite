import React from 'react';
import {
  BarChart3,
  TrendingUp,
  MessageSquare,
  Users,
  Clock,
  Zap,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { AnalyticsSummary } from '../types';

interface AnalyticsViewProps {
  analytics: AnalyticsSummary;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ analytics }) => {
  const stageData = Object.entries(analytics.leadStagesCount).map(([stage, count]) => ({
    stage,
    count
  }));

  const pieData = [
    { name: 'WhatsApp Entrante', value: 45, color: '#10b981' },
    { name: 'Anuncios Meta', value: 30, color: '#3b82f6' },
    { name: 'Formulario Web', value: 15, color: '#f59e0b' },
    { name: 'Recomendaciones', value: 10, color: '#8b5cf6' }
  ];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-101px)] bg-slate-50 text-slate-900 overflow-y-auto p-4 space-y-4">
      {/* Top Banner Header */}
      <div className="p-4 bg-white border border-slate-200 rounded space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
              Métricas y Estadísticas de Clientum WhatsApp CRM
            </h1>
            <p className="text-xs text-slate-500">
              Volumen de mensajes en tiempo real, velocidad de respuesta, métricas de conversión de leads y ROI de difusiones.
            </p>
          </div>
          <span className="text-xs bg-green-50 text-green-800 border border-green-200 px-3 py-1 rounded-full font-mono font-bold">
            ● Sincronización en Tiempo Real
          </span>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-1">
          <div className="bg-slate-50 border border-slate-200 p-3 rounded">
            <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">Total de Leads en Embudo</span>
            <p className="text-xl font-extrabold text-slate-900 font-mono mt-1">
              {analytics.totalLeads}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded">
            <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">Velocidad Promedio de Respuesta</span>
            <p className="text-xl font-extrabold text-green-700 font-mono mt-1">
              {analytics.avgResponseTimeMinutes} min
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded">
            <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">Tasa de Conversión</span>
            <p className="text-xl font-extrabold text-teal-700 font-mono mt-1">
              {analytics.conversionRate}%
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded">
            <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">Volumen de Difusiones Enviadas</span>
            <p className="text-xl font-extrabold text-indigo-700 font-mono mt-1">
              {analytics.broadcastMessagesSent.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Row 1: Messaging Trend Area Chart & Lead Stage Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Messages Volume Area Chart */}
        <div className="bg-white border border-slate-200 rounded p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center">
              <MessageSquare className="w-4 h-4 mr-1.5 text-green-600" />
              Tráfico Diario de Mensajes de WhatsApp
            </h3>
            <span className="text-[10px] text-slate-400 font-mono font-bold">Entrantes vs Salientes</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.messagesTrend}>
                <defs>
                  <linearGradient id="colorIncoming" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOutgoing" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '6px', color: '#0f172a' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="incoming" stroke="#16a34a" fillOpacity={1} fill="url(#colorIncoming)" name="Mensajes Entrantes" />
                <Area type="monotone" dataKey="outgoing" stroke="#2563eb" fillOpacity={1} fill="url(#colorOutgoing)" name="Mensajes Salientes" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline Stage Bar Chart */}
        <div className="bg-white border border-slate-200 rounded p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1.5 text-purple-600" />
              Distribución de Leads por Etapa
            </h3>
            <span className="text-[10px] text-slate-400 font-mono font-bold">Leads por Etapa</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="stage" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '6px', color: '#0f172a' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Cantidad de Leads" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Lead Sources Pie Chart */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-sm">
          <h3 className="text-sm font-bold text-slate-900 flex items-center">
            <Users className="w-4 h-4 mr-2 text-green-600" />
            Canales de Captación de Leads
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Los mensajes entrantes por WhatsApp representan más del 45% de las conversiones totales de leads con alta intención.
          </p>
        </div>

        <div className="h-48 w-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '6px', color: '#0f172a' }}
                itemStyle={{ fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
