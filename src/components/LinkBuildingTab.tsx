import React from 'react';
import { ArrowLeftRight, ExternalLink, ShieldCheck } from 'lucide-react';

export function LinkBuildingTab() {
  const backlinks = [
    { site: 'techcrunch.com/latam-startups', da: 92, status: 'Active', type: 'Guest Post' },
    { site: 'forbes.com.mx/marketing-ai', da: 89, status: 'Active', type: 'PR Feature' },
    { site: 'braziljournal.com/saas-growth', da: 74, status: 'Pending Outreach', type: 'Directory' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
          <ArrowLeftRight className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">AI Link Building & Outreach</h2>
          <p className="text-xs text-slate-500">Monitor high-authority backlinks and automate contextual outreach emails</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-3.5 px-6">Referring Domain</th>
                <th className="py-3.5 px-6">Domain Authority (DA)</th>
                <th className="py-3.5 px-6">Placement Type</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {backlinks.map((b, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-2">
                    {b.site} <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </td>
                  <td className="py-4 px-6 font-semibold text-indigo-600">DA {b.da}</td>
                  <td className="py-4 px-6 text-slate-600">{b.type}</td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                      {b.status}
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
