import React, { useState } from 'react';
import { FileText, Trash2, Plus, CheckCircle2 } from 'lucide-react';

export function KeywordVaultTab() {
  const [vault, setVault] = useState([
    { id: '1', keyword: 'ai marketing tools latam', volume: '14,200', difficulty: 'Medium (42)', status: 'Tracking', dateAdded: '2026-07-20' },
    { id: '2', keyword: 'growth hacking mexico', volume: '8,900', difficulty: 'Low (28)', status: 'Tracking', dateAdded: '2026-07-22' },
    { id: '3', keyword: 'b2b email marketing software brasil', volume: '12,500', difficulty: 'Medium (45)', status: 'Ranking #3', dateAdded: '2026-07-25' },
    { id: '4', keyword: 'roi ad optimization colombia', volume: '5,400', difficulty: 'Low (31)', status: 'Tracking', dateAdded: '2026-07-28' },
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Saved Keyword Vault</h2>
            <p className="text-xs text-slate-500">Manage and monitor your target keyword portfolio for organic ranking</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-3.5 px-6">Keyword</th>
                <th className="py-3.5 px-6">Search Volume</th>
                <th className="py-3.5 px-6">Difficulty</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Added Date</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {vault.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">{item.keyword}</td>
                  <td className="py-4 px-6 font-semibold text-slate-700">{item.volume}</td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                      {item.difficulty}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                      <CheckCircle2 className="w-3 h-3" /> {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-500">{item.dateAdded}</td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setVault(vault.filter(v => v.id !== item.id))}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
