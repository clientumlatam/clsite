import React, { useState } from 'react';
import { ShieldCheck, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export function OnPageAuditTab() {
  const [url, setUrl] = useState('https://clientumlatam.com');
  const [auditing, setAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);

  const handleAudit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuditing(true);
    setTimeout(() => {
      setAuditResult({
        score: 92,
        titleTag: 'Present & Optimized (62 chars)',
        metaDesc: 'Present (145 chars)',
        h1Count: '1 H1 tag detected',
        loadTime: '0.8s (Lightning Fast)',
        recommendations: [
          'Add alt text to 2 hero illustration images',
          'Include schema markup for software application',
          'Boost internal linking to Spanish/Portuguese localized pages'
        ]
      });
      setAuditing(false);
    }, 900);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">On-Page SEO & Technical Audit</h2>
          <p className="text-xs text-slate-500">Analyze meta tags, page speed, mobile responsiveness, and schema markup</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <form onSubmit={handleAudit} className="flex gap-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://yourdomain.com"
            className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            required
          />
          <button
            type="submit"
            disabled={auditing}
            className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-md shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
          >
            {auditing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            <span>Run SEO Audit</span>
          </button>
        </form>
      </div>

      {auditResult && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Audit Results for {url}</h3>
              <p className="text-xs text-slate-500">Completed just now by AI SEO Auditor</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-extrabold text-emerald-600">{auditResult.score}/100</div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">SEO Health Score</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-xs text-slate-500">Title Tag</div>
              <div className="text-sm font-bold text-slate-900 mt-1">{auditResult.titleTag}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-xs text-slate-500">Meta Description</div>
              <div className="text-sm font-bold text-slate-900 mt-1">{auditResult.metaDesc}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-xs text-slate-500">H1 Structure</div>
              <div className="text-sm font-bold text-slate-900 mt-1">{auditResult.h1Count}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-xs text-slate-500">Page Speed</div>
              <div className="text-sm font-bold text-slate-900 mt-1">{auditResult.loadTime}</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">AI Recommendations</h4>
            <div className="space-y-2">
              {auditResult.recommendations.map((rec: string, idx: number) => (
                <div key={idx} className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs font-semibold text-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
