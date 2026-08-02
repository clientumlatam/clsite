import React, { useState } from 'react';
import { Workflow, CheckCircle2, Zap } from 'lucide-react';

export function SeoAutomationTab() {
  const [automations, setAutomations] = useState([
    { id: '1', name: 'Auto-Generate Meta Descriptions on New Blog Post', status: 'Active', trigger: 'Post Published' },
    { id: '2', name: 'Weekly SERP Rank Tracking Report to Slack / Email', status: 'Active', trigger: 'Every Monday 8:00 AM' },
    { id: '3', name: 'Broken Link Detector & Redirect Fixer', status: 'Active', trigger: 'Daily Crawl' },
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
          <Workflow className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">SEO Automations & AI Workflows</h2>
          <p className="text-xs text-slate-500">Configure automated SEO maintenance, keyword tagging, and rank monitoring</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {automations.map(a => (
          <div key={a.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="w-3 h-3" /> {a.status}
              </span>
              <span className="text-xs text-slate-400">Trigger: {a.trigger}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">{a.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
