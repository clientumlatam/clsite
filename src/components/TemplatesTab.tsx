import React, { useState } from 'react';
import { FileCode, Sparkles, Copy, Check, Eye } from 'lucide-react';

export function TemplatesTab() {
  const [templates, setTemplates] = useState([
    { id: '1', name: 'High-Converting SaaS Welcome', category: 'Onboarding', subject: 'Welcome to ClientumLatam Growth 🚀', previewText: 'Your journey to scaling across LATAM starts now.' },
    { id: '2', name: 'Weekly Newsletter Digest', category: 'Newsletter', subject: 'The top growth strategies in Mexico & Brazil', previewText: 'Discover how top startups reduced CAC by 35%.' },
    { id: '3', name: 'Abandoned Cart / Demo Followup', category: 'Sales', subject: 'Did you have questions about your demo?', previewText: 'Our LATAM growth experts are here to help.' },
  ]);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const sampleHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>ClientumLatam</title></head>
<body style="font-family:sans-serif; background:#f8fafc; padding:20px;">
  <div style="max-width:600px; margin:0 auto; background:white; padding:30px; border-radius:12px;">
    <h2 style="color:#4f46e5;">Welcome to ClientumLatam!</h2>
    <p>Scale your ad campaigns, reduce CAC, and dominate the Latin American market.</p>
    <a href="https://clientumlatam.com" style="background:#4f46e5; color:white; padding:12px 24px; text-decoration:none; border-radius:8px; display:inline-block; margin-top:16px;">Access Dashboard</a>
  </div>
</body>
</html>`;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Email Templates & HTML Builder</h2>
            <p className="text-xs text-slate-500">Professional responsive email templates optimized for mobile & desktop</p>
          </div>
        </div>

        <button
          onClick={() => {
            navigator.clipboard.writeText(sampleHtml);
            setCopiedId('sample');
            setTimeout(() => setCopiedId(null), 2000);
          }}
          className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
        >
          {copiedId === 'sample' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copiedId === 'sample' ? 'Copied HTML' : 'Copy Sample HTML'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map(t => (
          <div key={t.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                  {t.category}
                </span>
                <span className="text-xs text-slate-400">Responsive</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{t.name}</h3>
              <p className="text-xs font-semibold text-slate-700 mt-2">Subject: {t.subject}</p>
              <p className="text-xs text-slate-500 mt-1">{t.previewText}</p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(sampleHtml);
                  setCopiedId(t.id);
                  setTimeout(() => setCopiedId(null), 2000);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
              >
                {copiedId === t.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedId === t.id ? 'Copied Code' : 'Get Template Code'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
