import React, { useState } from 'react';
import { CreditCard, X, CheckCircle2, AlertOctagon, RefreshCw, Zap, ShieldAlert, DollarSign } from 'lucide-react';
import { PlanTier, Site } from '../types';

interface BillingWebhookModalProps {
  sites: Site[];
  onClose: () => void;
  onRefreshData: () => void;
}

export const BillingWebhookModal: React.FC<BillingWebhookModalProps> = ({
  sites,
  onClose,
  onRefreshData,
}) => {
  const [eventType, setEventType] = useState<'payment.succeeded' | 'payment.failed' | 'subscription.canceled'>('payment.succeeded');
  const [customerEmail, setCustomerEmail] = useState('ops@acmeglobal.com');
  const [subdomain, setSubdomain] = useState('acme-global');
  const [companyName, setCompanyName] = useState('Acme Global Logistics');
  const [plan, setPlan] = useState<PlanTier>('professional');
  const [amount, setAmount] = useState(149);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseLog, setResponseLog] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponseLog(null);

    try {
      const res = await fetch('/api/webhooks/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: eventType,
          customerEmail,
          subdomain,
          companyName,
          plan,
          amount,
        }),
      });

      const data = await res.json();
      setResponseLog(JSON.stringify(data, null, 2));
      onRefreshData();
    } catch (err: any) {
      setResponseLog(`Error: ${err?.message || String(err)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickSelectSite = (site: Site) => {
    setCustomerEmail(site.ownerEmail);
    setSubdomain(site.subdomain);
    setCompanyName(site.companyName);
    setPlan(site.plan);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100 my-8 overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Billing Webhook Event Simulator</h2>
              <p className="text-[11px] text-slate-400">Stripe / Payment Gateway Lifecycle Trigger</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs">
          
          {/* Preset Tenant Picker */}
          <div>
            <span className="block text-[11px] font-semibold text-slate-400 mb-1.5">Pick Existing Tenant</span>
            <div className="flex flex-wrap gap-1.5">
              {sites.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleQuickSelectSite(s)}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-colors ${
                    subdomain === s.subdomain
                      ? 'bg-purple-600/20 text-purple-300 border-purple-500/50'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {s.subdomain}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Event Radio Selection */}
            <div>
              <label className="block text-slate-300 font-semibold mb-2">Select Webhook Event</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEventType('payment.succeeded');
                    setAmount(149);
                  }}
                  className={`p-3 rounded-xl border text-left space-y-1 transition-all ${
                    eventType === 'payment.succeeded'
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/30'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Payment Succeeded</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Triggers site activation & email</p>
                </button>

                <button
                  type="button"
                  onClick={() => setEventType('payment.failed')}
                  className={`p-3 rounded-xl border text-left space-y-1 transition-all ${
                    eventType === 'payment.failed'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-300 ring-1 ring-amber-500/30'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    <span>Payment Failed</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Blocks tenant site access</p>
                </button>

                <button
                  type="button"
                  onClick={() => setEventType('subscription.canceled')}
                  className={`p-3 rounded-xl border text-left space-y-1 transition-all ${
                    eventType === 'subscription.canceled'
                      ? 'bg-rose-500/10 border-rose-500 text-rose-300 ring-1 ring-rose-500/30'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                    <span>Canceled</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Suspends site & notifies</p>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Customer Email</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Subdomain</label>
                <input
                  type="text"
                  required
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-slate-300 font-medium mb-1">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Charge Amount ($)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-md shadow-purple-950/40"
            >
              <Zap className="w-4 h-4 text-purple-200" />
              <span>{isSubmitting ? 'Firing Webhook...' : 'Post Webhook Event to API'}</span>
            </button>
          </form>

          {responseLog && (
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">API Response Output</span>
              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto">
                {responseLog}
              </pre>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
