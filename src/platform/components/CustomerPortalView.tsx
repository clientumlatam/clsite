import React, { useState } from 'react';
import { Globe, Server, HardDrive, ShieldCheck, Zap, ExternalLink, Plus, RefreshCw, Lock, AlertTriangle, CreditCard, Mail, CheckCircle2 } from 'lucide-react';
import { Site, SiteBackup, SubscriptionRecord, EmailNotification } from '../types';

interface CustomerPortalViewProps {
  customerEmail: string;
  sites: Site[];
  backups: SiteBackup[];
  subscriptions: SubscriptionRecord[];
  notifications: EmailNotification[];
  onOpenNewSiteModal: () => void;
  onOpenWebhookSimulator: () => void;
  onTriggerBackup: (siteId: string) => Promise<void>;
  onTriggerMigrate: (siteId: string) => Promise<void>;
  onRefresh: () => void;
}

export const CustomerPortalView: React.FC<CustomerPortalViewProps> = ({
  customerEmail,
  sites,
  backups,
  subscriptions,
  notifications,
  onOpenNewSiteModal,
  onOpenWebhookSimulator,
  onTriggerBackup,
  onTriggerMigrate,
  onRefresh,
}) => {
  // Filter customer's sites
  const customerSites = sites.filter((s) => s.ownerEmail?.toLowerCase() === customerEmail?.toLowerCase());
  const displaySites = customerSites.length > 0 ? customerSites : sites.slice(0, 2); // Fallback to first 2 for demo

  const [activeSiteId, setActiveSiteId] = useState<string>(displaySites[0]?.id || '');
  const activeSite = displaySites.find((s) => s.id === activeSiteId) || displaySites[0];
  const siteBackups = backups.filter((b) => b.siteId === activeSite?.id);
  const siteSub = subscriptions.find((s) => s.siteId === activeSite?.id || s.customerEmail === customerEmail);

  const [isBackingUp, setIsBackingUp] = useState(false);
  const [copiedSSO, setCopiedSSO] = useState(false);

  const handleBackup = async () => {
    if (!activeSite) return;
    setIsBackingUp(true);
    await onTriggerBackup(activeSite.id);
    setTimeout(() => setIsBackingUp(false), 1200);
  };

  const handleCopySSO = () => {
    if (activeSite?.ssoToken) {
      navigator.clipboard.writeText(`https://${activeSite.subdomain}.saas.cloud/login?token=${activeSite.ssoToken}`);
      setCopiedSSO(true);
      setTimeout(() => setCopiedSSO(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Customer Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Customer Self-Service Portal</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30">
              Tenant Management
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Logged in as <strong className="text-slate-200">{customerEmail}</strong>. Manage your ERPNext cloud instance, backups, and subscriptions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenWebhookSimulator}
            className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Test Payment Webhooks</span>
          </button>

          <button
            onClick={onOpenNewSiteModal}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950/40"
          >
            <Plus className="w-4 h-4" />
            <span>Provision New Tenant</span>
          </button>
        </div>
      </div>

      {/* Instance Tabs & Switcher */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: My Instance Cards */}
        <div className="space-y-4 lg:col-span-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            My ERPNext Instances ({displaySites.length})
          </h3>

          <div className="space-y-3">
            {displaySites.map((site) => {
              const isSelected = site.id === activeSite?.id;
              return (
                <div
                  key={site.id}
                  onClick={() => setActiveSiteId(site.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500/50 ring-1 ring-emerald-500/30 shadow-lg'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-white text-sm">{site.name}</h4>
                      <p className="text-xs text-emerald-400 font-mono mt-0.5">
                        {site.subdomain}.saas.cloud
                      </p>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                        site.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : site.status === 'provisioning'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {site.status}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Plan: {site.plan.toUpperCase()}</span>
                    <span>{site.usersCount} / {site.maxUsers} Users</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Site Detail & Snapshot Controls */}
        {activeSite && (
          <div className="lg:col-span-2 space-y-6">
            
            {/* Instance Status Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{activeSite.name}</h3>
                    <span className="text-xs font-mono text-slate-400">({activeSite.benchName})</span>
                  </div>
                  <a
                    href={`https://${activeSite.subdomain}.saas.cloud`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-emerald-400 hover:underline font-mono inline-flex items-center gap-1 mt-1"
                  >
                    <span>https://{activeSite.subdomain}.saas.cloud</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBackup}
                    disabled={isBackingUp}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <HardDrive className="w-3.5 h-3.5" />
                    <span>{isBackingUp ? 'Creating Snapshot...' : 'Take Backup'}</span>
                  </button>

                  <button
                    onClick={handleCopySSO}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{copiedSSO ? 'SSO Copied!' : 'Launch One-Click SSO'}</span>
                  </button>
                </div>
              </div>

              {/* Status Warning Banner if Suspended */}
              {activeSite.status === 'suspended' && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-rose-200">Tenant Access Blocked (Payment / Subscription Issue)</h4>
                    <p className="mt-1 text-[11px] text-rose-300/80">
                      Your instance is currently suspended due to a payment failure or canceled subscription. Use the Billing Webhook Simulator above to process a payment and instantly reactivate your site.
                    </p>
                  </div>
                </div>
              )}

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Framework</span>
                  <span className="font-bold text-white mt-0.5 block">{activeSite.frappeVersion}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">ERPNext</span>
                  <span className="font-bold text-emerald-400 mt-0.5 block">{activeSite.erpnextVersion}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Storage Used</span>
                  <span className="font-bold text-amber-300 mt-0.5 block">
                    {activeSite.diskUsageMB} MB / {(activeSite.diskQuotaMB / 1024).toFixed(0)} GB
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">SSL Cert</span>
                  <span className="font-bold text-indigo-300 mt-0.5 block uppercase">{activeSite.sslStatus}</span>
                </div>
              </div>

              {/* Backup Vault */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center justify-between">
                  <span>Site Snapshot Vault ({siteBackups.length})</span>
                  <span className="text-[10px] text-slate-400 font-normal">Stored in AWS S3 S3 Glacier</span>
                </h4>

                {siteBackups.length > 0 ? (
                  <div className="border border-slate-800 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left font-mono">
                      <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase border-b border-slate-800">
                        <tr>
                          <th className="p-2.5">Filename</th>
                          <th className="p-2.5">Size</th>
                          <th className="p-2.5">Created</th>
                          <th className="p-2.5 text-right font-sans">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        {siteBackups.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-800/40">
                            <td className="p-2.5 text-emerald-400">{b.fileName}</td>
                            <td className="p-2.5">{b.sizeMB} MB</td>
                            <td className="p-2.5 text-slate-400">{new Date(b.createdAt).toLocaleDateString()}</td>
                            <td className="p-2.5 text-right font-sans">
                              <button
                                onClick={() => alert(`Downloading ${b.fileName}`)}
                                className="text-indigo-400 hover:text-indigo-300 text-xs underline"
                              >
                                Download
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No snapshots generated yet.</p>
                )}
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
