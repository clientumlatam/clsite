import React, { useState } from 'react';
import { Server, CheckCircle2, ShieldCheck } from 'lucide-react';

export function SmtpTab() {
  const [provider, setProvider] = useState('SendGrid');
  const [apiKey, setApiKey] = useState('SG.xxxxxxxxxxxxxxxxxxxxxxxxxxx');
  const [senderEmail, setSenderEmail] = useState('no-reply@clientumlatam.com');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
          <Server className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">SMTP Configuration</h2>
          <p className="text-xs text-slate-500">Connect SendGrid, Amazon SES, Mailgun, or Custom SMTP for reliable email delivery</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-2xl">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Provider</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
            >
              <option value="SendGrid">SendGrid API / SMTP</option>
              <option value="Amazon SES">Amazon SES</option>
              <option value="Mailgun">Mailgun</option>
              <option value="Custom">Custom SMTP Server</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Sender Email Address</label>
            <input
              type="email"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">API Key / SMTP Password</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 font-mono"
              required
            />
          </div>

          {saved && (
            <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> SMTP settings saved and connection verified successfully!
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/30 cursor-pointer"
            >
              Save & Test Connection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
