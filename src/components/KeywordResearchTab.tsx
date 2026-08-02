import React, { useState } from 'react';
import { Search, Sparkles, Loader2, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export function KeywordResearchTab() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Array<{ keyword: string; volume: string; difficulty: string; cpc: string; intent: string }>>([
    { keyword: 'ai marketing tools latam', volume: '14,200', difficulty: 'Medium (42)', cpc: '$4.50', intent: 'Commercial' },
    { keyword: 'growth hacking mexico', volume: '8,900', difficulty: 'Low (28)', cpc: '$3.80', intent: 'Informational' },
    { keyword: 'b2b email marketing software brasil', volume: '12,500', difficulty: 'Medium (45)', cpc: '$6.20', intent: 'Transactional' },
    { keyword: 'roi ad optimization colombia', volume: '5,400', difficulty: 'Low (31)', cpc: '$5.10', intent: 'Commercial' },
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setResults([
        { keyword: `${query} strategy latam`, volume: '18,400', difficulty: 'Medium (46)', cpc: '$5.20', intent: 'Commercial' },
        { keyword: `best ${query} 2026`, volume: '9,200', difficulty: 'Low (29)', cpc: '$4.10', intent: 'Transactional' },
        { keyword: `how to scale ${query}`, volume: '6,800', difficulty: 'Low (25)', cpc: '$3.50', intent: 'Informational' },
        ...results
      ]);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">AI Keyword Research</h2>
            <p className="text-xs text-slate-500">Discover high-intent search volumes and ranking opportunities across LATAM markets</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter seed keyword (e.g. digital marketing, SaaS growth)..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-md shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Analyze Keywords</span>
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-3.5 px-6">Keyword Opportunity</th>
                <th className="py-3.5 px-6">Search Volume / Mo</th>
                <th className="py-3.5 px-6">SEO Difficulty</th>
                <th className="py-3.5 px-6">Est. CPC</th>
                <th className="py-3.5 px-6">Intent</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {results.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">{item.keyword}</td>
                  <td className="py-4 px-6 text-slate-700 font-semibold">{item.volume}</td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                      {item.difficulty}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-medium">{item.cpc}</td>
                  <td className="py-4 px-6">
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                      {item.intent}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => alert(`Added "${item.keyword}" to Keyword Vault!`)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      Save to Vault
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
