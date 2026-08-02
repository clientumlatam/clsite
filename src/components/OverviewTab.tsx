import React from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  ArrowUpRight, 
  ArrowDownRight, 
  Globe2, 
  Sparkles,
  Zap,
  BarChart3,
  Mail,
  PieChart as PieChartIcon
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

interface OverviewTabProps {
  currency: string;
  region: string;
}

const subscriberGrowthData = [
  { date: '2026-06-11', subscribers: 3372 },
  { date: '2026-06-15', subscribers: 3385 },
  { date: '2026-06-18', subscribers: 3392 },
  { date: '2026-06-22', subscribers: 3372 },
];

const emailActivityData = [
  { date: '2026-06-11', sent: 5, opened: 3 },
  { date: '2026-06-22', sent: 6, opened: 5 },
];

const performanceData = [
  { month: 'Jan', revenue: 45000, spend: 12000, rois: 3.7 },
  { month: 'Feb', revenue: 52000, spend: 14000, rois: 3.8 },
  { month: 'Mar', revenue: 61000, spend: 15500, rois: 3.9 },
  { month: 'Apr', revenue: 58000, spend: 15000, rois: 3.8 },
  { month: 'May', revenue: 74000, spend: 18000, rois: 4.1 },
  { month: 'Jun', revenue: 89000, spend: 21000, rois: 4.2 },
  { month: 'Jul', revenue: 105000, spend: 24000, rois: 4.3 },
];

const channelData = [
  { name: 'Meta Ads (FB/IG)', value: 45, color: '#6366f1' },
  { name: 'Google Search & PMax', value: 30, color: '#10b981' },
  { name: 'TikTok Ads LATAM', value: 15, color: '#f59e0b' },
  { name: 'LinkedIn & B2B', value: 10, color: '#ec4899' },
];

const regionalStats = [
  { country: 'Mexico (MX)', spend: '$42,500', revenue: '$189,000', roi: '4.4x', growth: '+28%' },
  { country: 'Colombia (CO)', spend: '$28,100', revenue: '$112,400', roi: '4.0x', growth: '+22%' },
  { country: 'Brazil (BR)', spend: '$65,000', revenue: '$273,000', roi: '4.2x', growth: '+35%' },
  { country: 'Chile (CL)', spend: '$18,400', revenue: '$77,200', roi: '4.1x', growth: '+19%' },
];

export function OverviewTab({ currency, region }: OverviewTabProps) {
  const currencySymbol = currency === 'USD' ? '$' : currency === 'MXN' ? '$' : currency === 'BRL' ? 'R$' : '$';
  const multiplier = currency === 'MXN' ? 20 : currency === 'BRL' ? 5.2 : currency === 'COP' ? 4000 : 1;

  return (
    <div className="space-y-6">
      {/* Top Email Marketing Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">Email Analytics</h2>
              <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider">PRO v1.0.3.12</span>
            </div>
            <p className="text-xs text-slate-500">Real-time performance across subscriber lists, campaigns, and AI triggers</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 border border-slate-200">
          <span>Date Range:</span>
          <select className="bg-transparent border-none focus:outline-none cursor-pointer font-bold">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>Year to Date</option>
          </select>
        </div>
      </div>

      {/* 5 Email Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Subscribers</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">3,372</div>
          <div className="text-xs text-slate-500 font-semibold mt-1">Total Subscribers</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Emails Sent</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">11</div>
          <div className="text-xs text-slate-500 font-semibold mt-1">Emails Sent</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Open Rate</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">72.7%</div>
          <div className="text-xs text-slate-500 font-semibold mt-1">Open Rate</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Click Rate</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">54.5%</div>
          <div className="text-xs text-slate-500 font-semibold mt-1">Click Rate</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Unsubscribes</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">0</div>
          <div className="text-xs text-slate-500 font-semibold mt-1">Unsubscribes</div>
        </div>
      </div>

      {/* Email Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscriber Growth Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Subscriber Growth</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={subscriberGrowthData}>
                <defs>
                  <linearGradient id="subGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="subscribers" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#subGrowth)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Email Activity Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Email Activity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emailActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Bar dataKey="sent" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Sent" />
                <Bar dataKey="opened" fill="#10b981" radius={[4, 4, 0, 0]} name="Opened" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ClientumLatam Growth Intelligence Section */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">ClientumLatam Regional Growth & Revenue</h3>
            <p className="text-xs text-indigo-200">Combined ad performance across Mexico, Brazil, Colombia, and Chile</p>
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">
            {currencySymbol}{(651600 * multiplier).toLocaleString()}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <div className="text-xs text-indigo-200">Mexico (MX)</div>
            <div className="text-lg font-bold mt-1">{currencySymbol}{(189000 * multiplier).toLocaleString()}</div>
            <div className="text-xs text-emerald-400 font-medium mt-0.5">ROI: 4.4x (+28%)</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <div className="text-xs text-indigo-200">Brazil (BR)</div>
            <div className="text-lg font-bold mt-1">{currencySymbol}{(273000 * multiplier).toLocaleString()}</div>
            <div className="text-xs text-emerald-400 font-medium mt-0.5">ROI: 4.2x (+35%)</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <div className="text-xs text-indigo-200">Colombia (CO)</div>
            <div className="text-lg font-bold mt-1">{currencySymbol}{(112400 * multiplier).toLocaleString()}</div>
            <div className="text-xs text-emerald-400 font-medium mt-0.5">ROI: 4.0x (+22%)</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <div className="text-xs text-indigo-200">Chile (CL)</div>
            <div className="text-lg font-bold mt-1">{currencySymbol}{(77200 * multiplier).toLocaleString()}</div>
            <div className="text-xs text-emerald-400 font-medium mt-0.5">ROI: 4.1x (+19%)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
