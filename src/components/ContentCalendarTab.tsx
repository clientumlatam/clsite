import React from 'react';
import { ListOrdered, Plus, Calendar } from 'lucide-react';

export function ContentCalendarTab() {
  const schedule = [
    { date: 'Aug 03, 2026', title: 'Top 10 AI Marketing Tools for LATAM Startups', status: 'Scheduled', author: 'AI Content Bot' },
    { date: 'Aug 06, 2026', title: 'How to Reduce CAC in Mexico & Brazil', status: 'Draft', author: 'Jonathan L.' },
    { date: 'Aug 10, 2026', title: 'B2B Email Drip Sequences That Convert', status: 'Planning', author: 'AI Content Bot' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">SEO Content Calendar</h2>
            <p className="text-xs text-slate-500">Plan, schedule, and publish AI-optimized articles and blog posts</p>
          </div>
        </div>
        <button
          onClick={() => alert('New scheduled article modal opened')}
          className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Article</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-3.5 px-6">Scheduled Date</th>
                <th className="py-3.5 px-6">Article Title</th>
                <th className="py-3.5 px-6">Author / Generator</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {schedule.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">{item.date}</td>
                  <td className="py-4 px-6 text-slate-700 font-semibold">{item.title}</td>
                  <td className="py-4 px-6 text-slate-600">{item.author}</td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
