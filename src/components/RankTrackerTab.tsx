import React from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

export function RankTrackerTab() {
  const rankings = [
    { keyword: 'ai marketing tools latam', position: '#3', change: '+2', volume: '14,200' },
    { keyword: 'growth hacking mexico', position: '#1', change: '+1', volume: '8,900' },
    { keyword: 'b2b email marketing software brasil', position: '#4', change: '+3', volume: '12,500' },
    { keyword: 'roi ad optimization colombia', position: '#2', change: '0', volume: '5,400' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Rank Tracker</h2>
          <p className="text-xs text-slate-500">Track daily SERP rankings across Google Mexico, Brazil, Colombia, and Chile</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-3.5 px-6">Keyword</th>
                <th className="py-3.5 px-6">Current Position</th>
                <th className="py-3.5 px-6">Weekly Change</th>
                <th className="py-3.5 px-6">Search Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {rankings.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">{r.keyword}</td>
                  <td className="py-4 px-6 font-extrabold text-indigo-600 text-base">{r.position}</td>
                  <td className="py-4 px-6 font-bold text-emerald-600 flex items-center gap-1">
                    <ArrowUpRight className="w-4 h-4" /> {r.change}
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-semibold">{r.volume}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
