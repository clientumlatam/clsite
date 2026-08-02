import React, { useState, useEffect } from 'react';
import { CreditCard, Check, Zap, Users, HardDrive, ShieldCheck, ArrowUpRight, FileText, CheckCircle2, DollarSign } from 'lucide-react';
import { SubscriptionRecord, Invoice } from '../types';


interface SubscriptionsViewProps {
  subscriptions?: SubscriptionRecord[];
  onRefreshData?: () => void;
}

const defaultSubscriptions: SubscriptionRecord[] = [
  {
    id: 'sub_1',
    tenantId: 'tenant_001',
    companyName: 'Acme Global SaaS',
    siteName: 'acme.clientum.com.ar',
    plan: 'Growth',
    planId: 'Growth',
    amount: 149,
    billingInterval: 'month',
    status: 'active',
    paymentMethod: 'Stripe •••• 4242',
    nextBillingDate: '2026-09-01',
    nextInvoiceAt: '2026-09-01'
  },
  {
    id: 'sub_2',
    tenantId: 'tenant_002',
    companyName: 'Gourmet Bistro Group',
    siteName: 'gourmet.clientum.com.ar',
    plan: 'Enterprise',
    planId: 'Enterprise',
    amount: 399,
    billingInterval: 'month',
    status: 'trialing',
    paymentMethod: 'Visa •••• 8899',
    nextBillingDate: '2026-09-15',
    nextInvoiceAt: '2026-09-15'
  }
];

export const SubscriptionsView: React.FC<SubscriptionsViewProps> = ({ subscriptions = defaultSubscriptions, onRefreshData }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadingInvoiceId, setLoadingInvoiceId] = useState<string | null>(null);

  const loadInvoices = async () => {
    try {
      const res = await fetch('/api/invoices');
      if (res.ok) {
        setInvoices(await res.json());
      }
    } catch (err) {
      console.error('Failed to load invoices:', err);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const handlePayInvoice = async (invoiceId: string) => {
    setLoadingInvoiceId(invoiceId);
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/pay`, { method: 'POST' });
      if (res.ok) {
        await loadInvoices();
        if (onRefreshData) onRefreshData();
      }
    } catch (err) {
      console.error('Failed to pay invoice:', err);
    } finally {
      setLoadingInvoiceId(null);
    }
  };

  const totalRevenue = subscriptions.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-8">
      
      {/* Header Summary Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-purple-400" />
            SaaS Subscription Plans & Billing Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage multi-tenant pricing tiers, user seat quotas, automated renewal billing, invoices, and payment statuses
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono flex items-center gap-4">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Active Subscriptions</span>
            <span className="text-emerald-400 font-bold text-base">{subscriptions.length} Tenants</span>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">ARR Value</span>
            <span className="text-purple-300 font-bold text-base">
              ${(totalRevenue * 12).toLocaleString()} / yr
            </span>
          </div>
        </div>
      </div>

      {/* Subscription Tier Matrix */}
      <div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400 mb-4">
          Tiered Pricing Plans
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {([] as any).map((plan) => (
            <div
              key={plan.id}
              className={`p-6 rounded-2xl bg-slate-900 border flex flex-col justify-between space-y-6 relative overflow-hidden transition-all shadow-xl ${
                plan.id === 'Growth'
                  ? 'border-purple-500/50 ring-1 ring-purple-500/30'
                  : 'border-slate-800'
              }`}
            >
              {plan.id === 'Growth' && (
                <div className="absolute top-0 right-0 bg-purple-600 text-white text-[9px] uppercase font-bold tracking-wider px-3 py-1 rounded-bl-xl shadow-md">
                  Most Popular
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-white">{plan.name}</h4>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold font-mono text-white">
                      ${plan.priceMonthly}
                    </span>
                    <span className="text-xs text-slate-400">/ month</span>
                  </div>
                </div>

                {/* Quotas */}
                <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Up to <strong>{plan.maxUsers}</strong> User Seats</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>{(plan.maxDiskMB / 1024).toFixed(0)} GB</strong> Storage Quota</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-400 shrink-0" />
                    <span><strong>{plan.backgroundWorkers}</strong> Celery Background Workers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="capitalize"><strong>{plan.backupFrequency}</strong> Snapshot Vault</span>
                  </div>
                </div>

                {/* Included Apps */}
                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">Included Apps</span>
                  <div className="flex flex-wrap gap-1">
                    {plan.includedApps.map((app) => (
                      <span
                        key={app}
                        className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300 uppercase"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => alert(`Plan configuration: ${plan.name} is active on cluster node policies.`)}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
              >
                Configure Plan Quotas
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Active Customer Subscriptions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-4 p-5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-emerald-400" />
          Active Customer Subscriptions
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5 font-semibold">Tenant & Site</th>
                <th className="p-3.5 font-semibold">Plan Tier</th>
                <th className="p-3.5 font-semibold">Amount / Interval</th>
                <th className="p-3.5 font-semibold">Status</th>
                <th className="p-3.5 font-semibold">Payment Method</th>
                <th className="p-3.5 font-semibold text-right">Next Renewal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs">
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-800/40 font-mono text-slate-300">
                  <td className="p-3.5 font-sans">
                    <div className="font-bold text-white">{sub.companyName}</div>
                    <div className="text-[11px] text-emerald-400 font-mono">{sub.siteName}</div>
                  </td>

                  <td className="p-3.5 font-sans uppercase font-bold text-slate-300">
                    {sub.planId}
                  </td>

                  <td className="p-3.5 text-white font-bold">
                    ${sub.amount} / {sub.billingInterval}
                  </td>

                  <td className="p-3.5 font-sans">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                        sub.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : sub.status === 'trialing'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>

                  <td className="p-3.5 text-slate-400 font-sans text-[11px]">
                    {sub.paymentMethod}
                  </td>

                  <td className="p-3.5 text-right text-slate-400">
                    {new Date(sub.nextInvoiceAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tenant Invoices & Payment Gateway Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-4 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" />
            Tenant Invoices & Billing History
          </h3>
          <span className="text-xs text-slate-400">Stripe / Billing Integration Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5 font-semibold">Invoice ID</th>
                <th className="p-3.5 font-semibold">Company / Tenant</th>
                <th className="p-3.5 font-semibold">Description</th>
                <th className="p-3.5 font-semibold">Amount</th>
                <th className="p-3.5 font-semibold">Status</th>
                <th className="p-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs font-mono">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/40 text-slate-300">
                  <td className="p-3.5 font-bold text-white">{inv.id}</td>
                  <td className="p-3.5 font-sans">
                    <div className="font-semibold text-slate-200">{inv.companyName}</div>
                    <div className="text-[10px] text-slate-500">Due: {inv.dueDate}</div>
                  </td>
                  <td className="p-3.5 font-sans text-slate-400 text-[11px] max-w-xs truncate">
                    {inv.itemsDescription}
                  </td>
                  <td className="p-3.5 text-white font-bold">${inv.amount}</td>
                  <td className="p-3.5 font-sans">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                        inv.status === 'paid'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-sans">
                    {inv.status === 'open' ? (
                      <button
                        onClick={() => handlePayInvoice(inv.id)}
                        disabled={loadingInvoiceId === inv.id}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] shadow transition-all flex items-center gap-1 ml-auto disabled:opacity-50"
                      >
                        <DollarSign className="w-3 h-3" />
                        <span>{loadingInvoiceId === inv.id ? 'Processing...' : 'Pay Now'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => alert(`Viewing PDF Receipt for Invoice ${inv.id}`)}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors ml-auto"
                      >
                        Download PDF
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
