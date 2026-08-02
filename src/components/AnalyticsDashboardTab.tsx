import React, { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Mail, Globe, Share2, ArrowUpRight, Sparkles } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend } from 'recharts';

const roiTrendData = [
  { month: 'Ene', emailRoi: 320, socialRoi: 210, seoRoi: 450, totalRevenue: 45000 },
  { month: 'Feb', emailRoi: 380, socialRoi: 240, seoRoi: 520, totalRevenue: 52000 },
  { month: 'Mar', emailRoi: 420, socialRoi: 290, seoRoi: 610, totalRevenue: 64000 },
  { month: 'Abr', emailRoi: 490, socialRoi: 350, seoRoi: 740, totalRevenue: 78000 },
  { month: 'May', emailRoi: 540, socialRoi: 410, seoRoi: 850, totalRevenue: 91000 },
  { month: 'Jun', emailRoi: 620, socialRoi: 480, seoRoi: 980, totalRevenue: 108000 },
];

const channelComparison = [
  { channel: 'Email Marketing', conversion: 4.8, roi: 620, costPerLead: 12 },
  { channel: 'Social Ads / LinkedIn', conversion: 2.9, roi: 480, costPerLead: 28 },
  { channel: 'SEO & Organico', conversion: 6.5, roi: 980, costPerLead: 5 },
  { channel: 'Google Maps Prospecting', conversion: 5.2, roi: 740, costPerLead: 15 },
];

export function AnalyticsDashboardTab() {
  const [timeframe, setTimeframe] = useState('6M');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Dashboard de Analítica & ROI Multicanal</h2>
            <p className="text-xs text-slate-500">Agregación en tiempo real de rendimiento y retorno de inversión en Email, Social, SEO y Prospectos</p>
          </div>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl">
          {['1M', '3M', '6M', '1Y'].map(t => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeframe === t ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs font-semibold">
            <span>ROI Global Promedio</span>
            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +28.4%
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">716%</div>
          <p className="text-[10px] text-slate-400">Comparado con el período anterior</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs font-semibold">
            <span>Ingresos Atribuibles</span>
            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +34.2%
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">$438,000 USD</div>
          <p className="text-[10px] text-slate-400">Cierres de CRM y ventas directas</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs font-semibold">
            <span>Leads Capturados</span>
            <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md font-bold">Total</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">1,842</div>
          <p className="text-[10px] text-slate-400">Canales combinados B2B</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs font-semibold">
            <span>Costo Promedio por Lead</span>
            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">-14%</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">$14.50 USD</div>
          <p className="text-[10px] text-slate-400">Optimizado por IA de Gemini</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ROI Trend Over Time */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900">Evolución de ROI por Canal (%)</h3>
            <span className="text-xs text-slate-500">Últimos 6 meses</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={roiTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSeo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEmail" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="seoRoi" name="SEO ROI %" stroke="#4f46e5" fillOpacity={1} fill="url(#colorSeo)" strokeWidth={2} />
                <Area type="monotone" dataKey="emailRoi" name="Email ROI %" stroke="#10b981" fillOpacity={1} fill="url(#colorEmail)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channel Conversion Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900">Tasa de Conversión y Rendimiento por Canal</h3>
            <span className="text-xs text-slate-500">Promedio actual</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelComparison} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="channel" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Bar dataKey="conversion" name="Tasa de Conversión %" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
