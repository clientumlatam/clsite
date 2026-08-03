import React, { useState } from 'react';
import { SeoAuditResult } from '../types';
import { Search, Sparkles, Loader2, CheckCircle2, TrendingUp, Globe, Award } from 'lucide-react';

export function SeoTab() {
  const [urlOrTopic, setUrlOrTopic] = useState('clientum.com.ar/growth-crm');
  const [keywords, setKeywords] = useState('crm latam, software ventas mexico, automatizacion marketing');
  const [competitor, setCompetitor] = useState('HubSpot LATAM / RD Station');

  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<SeoAuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/seo-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urlOrTopic, keywords, competitor }),
      });
      const data = await res.json();
      if (data.success) {
        setAuditResult(data.audit);
      } else {
        setError(data.error || 'Failed to complete SEO audit');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">AI SEO & Content Audit</h2>
            <p className="text-xs text-slate-500">Analyze organic rankings, discover high-intent keywords across LATAM, and get on-page recommendations</p>
          </div>
        </div>

        <form onSubmit={handleAudit} className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Domain or Topic</label>
            <input
              type="text"
              value={urlOrTopic}
              onChange={(e) => setUrlOrTopic(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Focus Keywords</label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Main Competitor</label>
            <input
              type="text"
              value={competitor}
              onChange={(e) => setCompetitor(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              required
            />
          </div>

          <div className="md:col-span-3 flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md shadow-emerald-600/30 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Running AI SEO Audit...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Run AI SEO Audit</span>
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}
      </div>

      {auditResult && (
        <div className="space-y-6">
          {/* SEO Score Banner */}
          <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
            <div>
              <div className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Award className="w-4 h-4" /> Comprehensive SEO Health
              </div>
              <h3 className="text-2xl font-bold">Organic Search Optimization Score</h3>
              <p className="text-xs text-slate-300 mt-1">Based on technical factors, keyword density, and LATAM regional search intent.</p>
            </div>
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-emerald-400">{auditResult.seoScore}</span>
              <span className="text-[10px] uppercase font-semibold text-slate-300">/ 100</span>
            </div>
          </div>

          {/* Keyword Opportunities Table */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" /> High-Value LATAM Keyword Opportunities
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Keyword</th>
                    <th className="py-3 px-4">Search Volume (Mo)</th>
                    <th className="py-3 px-4">Difficulty</th>
                    <th className="py-3 px-4">Search Intent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {auditResult.keywordOpportunities?.map((kw, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{kw.keyword}</td>
                      <td className="py-3.5 px-4 text-slate-600">{kw.searchVolume}</td>
                      <td className="py-3.5 px-4 font-semibold text-indigo-600">{kw.difficulty}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                          {kw.intent}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* On-Page Recommendations */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-indigo-600" /> On-Page Recommendations
              </h3>
              <ul className="space-y-3">
                {auditResult.onPageRecommendations?.map((rec, i) => (
                  <li key={i} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Content Ideas */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-600" /> Organic Blog & Article Ideas
              </h3>
              <div className="space-y-3">
                {auditResult.contentIdeas?.map((idea, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm font-semibold text-slate-800 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                    <span>{idea}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
