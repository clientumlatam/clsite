import React, { useState } from 'react';
import { AdCopyResult } from '../types';
import { FileText, Sparkles, Loader2, Copy, Check, Image as ImageIcon } from 'lucide-react';

export function CopywriterTab() {
  const [product, setProduct] = useState('FinTech B2B Payment Gateway for LATAM SMEs');
  const [platform, setPlatform] = useState('Meta Ads (Facebook & Globe)');
  const [tone, setTone] = useState('Persuasive & Urgent');
  const [objective, setObjective] = useState('Lead Generation & Instant Demo Booking');
  const [language, setLanguage] = useState('Spanish (LATAM)');

  const [loading, setLoading] = useState(false);
  const [copyResult, setCopyResult] = useState<AdCopyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/copywriter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, platform, tone, objective, language }),
      });
      const data = await res.json();
      if (data.success) {
        setCopyResult(data.copy);
      } else {
        setError(data.error || 'Failed to generate ad copy');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">AI Ad Copy & Creative Studio</h2>
            <p className="text-xs text-slate-500">Generate high-converting headlines, ad texts, and AI image prompts for Meta & Google Ads</p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Product / Service Description</label>
            <input
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Advertising Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600 bg-white"
            >
              <option value="Meta Ads (Facebook & Globe)">Meta Ads (Facebook & Globe)</option>
              <option value="Google Search & Display">Google Search & Display</option>
              <option value="TikTok Ads LATAM">TikTok Ads LATAM</option>
              <option value="LinkedIn B2B Sponsored">LinkedIn B2B Sponsored</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tone of Voice</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600 bg-white"
            >
              <option value="Persuasive & Urgent">Persuasive & Urgent</option>
              <option value="Professional & Authoritative">Professional & Authoritative</option>
              <option value="Friendly & Conversational">Friendly & Conversational</option>
              <option value="High-Energy Startup">High-Energy Startup</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Campaign Objective</label>
            <input
              type="text"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Language & Region</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600 bg-white"
            >
              <option value="Spanish (LATAM)">Spanish (LATAM)</option>
              <option value="Portuguese (Brazil)">Portuguese (Brazil)</option>
              <option value="English (Global)">English (Global)</option>
            </select>
          </div>

          <div className="md:col-span-2 lg:col-span-3 flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center space-x-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md shadow-violet-600/30 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating High-Converting Ad Copy...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate AI Ad Copy</span>
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

      {copyResult && (
        <div className="space-y-6">
          {/* Headlines */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-600" /> High-Converting Headlines (Choose best fit)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {copyResult.headlines?.map((h, i) => {
                const id = `headline-${i}`;
                return (
                  <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-slate-800">{h}</span>
                    <button
                      onClick={() => copyToClipboard(h, id)}
                      className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
                      title="Copy to clipboard"
                    >
                      {copiedIndex === id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Primary Texts */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" /> Primary Ad Texts (With Emojis & Hooks)
            </h3>
            <div className="space-y-3">
              {copyResult.primaryTexts?.map((text, i) => {
                const id = `text-${i}`;
                return (
                  <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">{text}</p>
                    <button
                      onClick={() => copyToClipboard(text, id)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shrink-0 self-end sm:self-center"
                    >
                      {copiedIndex === id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedIndex === id ? 'Copied' : 'Copy Text'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA & AI Image Prompt */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-slate-900">Recommended CTA Buttons</h3>
              <div className="flex flex-wrap gap-2 pt-2">
                {copyResult.callToAction?.map((cta, i) => (
                  <span key={i} className="px-4 py-2 rounded-xl bg-violet-50 text-violet-700 font-bold text-sm border border-violet-100">
                    {cta}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-600" /> AI Image Generation Prompt
              </h3>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 font-mono leading-relaxed">
                {copyResult.imagePrompt}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
