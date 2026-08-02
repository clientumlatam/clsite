import React, { useState } from 'react';
import { EmailCampaignItem } from '../types';
import { Send, Plus, Sparkles, CheckCircle2, Clock, FileText, Loader2 } from 'lucide-react';

const initialCampaigns: EmailCampaignItem[] = [
  { id: '1', title: 'Q3 LATAM Growth Blueprint', subject: '🚀 Scale your CAC across Mexico & Brazil', status: 'Sent', recipients: 3372, openRate: '72.7%', clickRate: '54.5%', sentDate: '2026-07-28' },
  { id: '2', title: 'FinTech Automation Masterclass', subject: 'How top Colombian startups close deals in 48h', status: 'Sent', recipients: 2150, openRate: '69.1%', clickRate: '48.2%', sentDate: '2026-07-22' },
  { id: '3', title: 'August AI Marketing Update', subject: 'New Gemini Pro ad copy generator is live!', status: 'Scheduled', recipients: 3420, openRate: '-', clickRate: '-', sentDate: '2026-08-05' },
];

export function EmailCampaignsTab() {
  const [campaigns, setCampaigns] = useState<EmailCampaignItem[]>(initialCampaigns);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [generating, setGenerating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newCamp: EmailCampaignItem = {
      id: Date.now().toString(),
      title,
      subject,
      status: 'Scheduled',
      recipients: 3400,
      openRate: '0%',
      clickRate: '0%',
      sentDate: '2026-08-10',
    };
    setCampaigns([newCamp, ...campaigns]);
    setTitle('');
    setSubject('');
    setModalOpen(false);
  };

  const handleAiGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/ai/copywriter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: 'LATAM B2B Growth Newsletter', platform: 'Email Marketing', tone: 'Persuasive', objective: 'Engagement' }),
      });
      const data = await res.json();
      if (data.success && data.copy?.headlines?.[0]) {
        setTitle('AI Generated LATAM Growth Digest');
        setSubject(data.copy.headlines[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Email Campaigns & Broadcasts</h2>
            <p className="text-xs text-slate-500">Design, schedule, and analyze broadcast newsletters sent to your LATAM audience</p>
          </div>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Campaign</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-3.5 px-6">Campaign Title</th>
                <th className="py-3.5 px-6">Subject Line</th>
                <th className="py-3.5 px-6">Recipients</th>
                <th className="py-3.5 px-6">Open Rate</th>
                <th className="py-3.5 px-6">Click Rate</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {campaigns.map(camp => (
                <tr key={camp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">{camp.title}</td>
                  <td className="py-4 px-6 text-slate-600 font-medium">{camp.subject}</td>
                  <td className="py-4 px-6 text-slate-600">{camp.recipients.toLocaleString()}</td>
                  <td className="py-4 px-6 font-semibold text-emerald-600">{camp.openRate}</td>
                  <td className="py-4 px-6 font-semibold text-indigo-600">{camp.clickRate}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                      camp.status === 'Sent' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {camp.status === 'Sent' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {camp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Create New Email Campaign</h3>
              <button
                onClick={handleAiGenerate}
                disabled={generating}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-50 text-violet-700 hover:bg-violet-100 text-xs font-bold border border-violet-200 transition-all cursor-pointer"
              >
                {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>AI Subject Generator</span>
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Campaign Internal Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. August Growth Special"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Subject Line</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="🚀 Scale your revenue in Mexico & Brazil"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target List</label>
                <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white">
                  <option value="all">All Subscribers (3,372)</option>
                  <option value="vip">VIP LATAM Leads (1,420)</option>
                  <option value="brazil">Brazil SaaS Founders (980)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/30"
                >
                  Schedule Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
