import React, { useState } from 'react';
import { CampaignStrategy } from '../types';
import { Sparkles, Loader2, Target, DollarSign, Calendar, CheckCircle2, Award, ArrowRight } from 'lucide-react';

export function StrategyTab() {
  const [businessName, setBusinessName] = useState('LatamSaaS Growth');
  const [industry, setIndustry] = useState('B2B Software & FinTech');
  const [targetAudience, setTargetAudience] = useState('SME owners & CFOs in Mexico and Colombia');
  const [budget, setBudget] = useState('$10,000 USD / month');
  const [country, setCountry] = useState('Mexico, Colombia, Chile');
  const [goal, setGoal] = useState('High-intent lead generation & demo bookings');

  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<CampaignStrategy | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName, industry, targetAudience, budget, country, goal }),
      });
      const data = await res.json();
      if (data.success) {
        setStrategy(data.strategy);
      } else {
        setError(data.error || 'Failed to generate strategy');
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
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">AI Marketing Strategy Generator</h2>
            <p className="text-xs text-slate-500">Powered by Gemini AI to build tailored multi-channel LATAM campaign plans</p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Business Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Industry & Niche</label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Audience</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Monthly Budget</label>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Markets (LATAM)</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Campaign Goal</label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
          </div>

          <div className="md:col-span-2 lg:col-span-3 flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md shadow-indigo-600/30 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating AI Strategy with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate AI Marketing Strategy</span>
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

      {strategy && (
        <div className="space-y-6">
          {/* Executive Summary */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-2xl shadow-lg border border-slate-800">
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Award className="w-4 h-4" /> CMO Executive Summary
            </div>
            <p className="text-slate-200 text-base leading-relaxed">
              {strategy.executiveSummary}
            </p>
          </div>

          {/* Channels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" /> Recommended Ad Channels
              </h3>
              <div className="space-y-3">
                {strategy.channels?.map((ch, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900 text-sm">{ch.name}</span>
                      <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">
                        {ch.budgetAllocation}
                      </span>
                    </div>
                    <div className="text-xs text-emerald-600 font-medium">Expected ROI: {ch.expectedROI}</div>
                    <ul className="text-xs text-slate-600 space-y-1 pt-1">
                      {ch.tactics?.map((t, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {/* Audience Personas */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" /> Buyer Personas
                </h3>
                <div className="space-y-3">
                  {strategy.audiencePersonas?.map((p, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900 text-sm">{p.name}</span>
                        <span className="text-xs text-slate-500">Age: {p.age}</span>
                      </div>
                      <div className="text-xs text-slate-600">
                        <strong className="text-slate-700">Pain Points:</strong> {p.painPoints?.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* KPIs */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-600" /> Key Performance Indicators (KPIs)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {strategy.kpis?.map((kpi, idx) => (
                    <div key={idx} className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                      <div className="text-xs text-slate-600">{kpi.metric}</div>
                      <div className="text-base font-bold text-indigo-900 mt-1">{kpi.target}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" /> 4-Week Execution Timeline
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {strategy.campaignTimeline?.map((week, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{week.week}</div>
                  <div className="font-bold text-slate-900 text-sm">{week.focus}</div>
                  <ul className="text-xs text-slate-600 space-y-1">
                    {week.actions?.map((act, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <ArrowRight className="w-3 h-3 text-indigo-500 shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
