import React from 'react';
import { Globe2, Sparkles, CheckCircle2 } from 'lucide-react';

export function TopicMapTab() {
  const clusters = [
    { title: 'AI Marketing & Automation', articles: 12, completion: '85%', status: 'Advanced' },
    { title: 'LATAM Growth Strategies', articles: 8, completion: '60%', status: 'In Progress' },
    { title: 'B2B Email Marketing', articles: 10, completion: '90%', status: 'Optimized' },
    { title: 'Ad Optimization & CAC', articles: 6, completion: '40%', status: 'Planning' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
          <Globe2 className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Topical Authority Map</h2>
          <p className="text-xs text-slate-500">Semantic clustering and pillar-cluster architecture for domain dominance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clusters.map((c, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-violet-50 text-violet-700">
                {c.status}
              </span>
              <span className="text-xs font-semibold text-slate-500">{c.completion} Complete</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">{c.title}</h3>
            <p className="text-xs text-slate-500">Includes {c.articles} interconnected pillar and cluster articles optimized for semantic search.</p>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-violet-600 h-full rounded-full" style={{ width: c.completion }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
