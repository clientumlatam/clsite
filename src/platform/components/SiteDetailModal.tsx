import React, { useState } from 'react';
import {
  X,
  Globe,
  Server,
  Database,
  ShieldCheck,
  ExternalLink,
  HardDrive,
  Copy,
  Check,
  RefreshCw,
  Lock,
  Unlock,
  AlertTriangle,
  ArrowUpRight,
  Zap,
} from 'lucide-react';
import { Site, SiteBackup, SiteStatus } from '../types';

interface SiteDetailModalProps {
  site: Site;
  backups: SiteBackup[];
  onClose: () => void;
  onUpdateStatus: (siteId: string, status: SiteStatus) => Promise<void>;
  onTriggerMigrate: (siteId: string) => Promise<void>;
  onTriggerBackup: (siteId: string) => Promise<void>;
}

export const SiteDetailModal: React.FC<SiteDetailModalProps> = ({
  site,
  backups,
  onClose,
  onUpdateStatus,
  onTriggerMigrate,
  onTriggerBackup,
}) => {
  const [copied, setCopied] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [customDomainInput, setCustomDomainInput] = useState(site.customDomain || '');
  const [dnsStatus, setDnsStatus] = useState<'verified' | 'unverified' | 'checking'>('verified');

  const siteBackups = backups.filter((b) => b.siteId === site.id);

  const handleCopySSO = () => {
    if (site.ssoToken) {
      navigator.clipboard.writeText(`https://${site.subdomain}.saas.cloud/login?token=${site.ssoToken}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleMigrate = async () => {
    setIsMigrating(true);
    await onTriggerMigrate(site.id);
    setTimeout(() => setIsMigrating(false), 4000);
  };

  const handleBackup = async () => {
    setIsBackingUp(true);
    await onTriggerBackup(site.id);
    setTimeout(() => setIsBackingUp(false), 1500);
  };

  const handleCheckDns = () => {
    setDnsStatus('checking');
    setTimeout(() => {
      setDnsStatus('verified');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100 my-8 overflow-hidden">
        
        {/* Top Title Bar */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 font-bold font-mono text-sm border border-slate-700">
              {site.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">{site.name}</h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                    site.status === 'active'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : site.status === 'maintenance'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {site.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                https://{site.subdomain}.saas.cloud
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Quick Actions Panel */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Quick Actions:</span>
              <button
                onClick={handleMigrate}
                disabled={isMigrating}
                className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isMigrating ? 'animate-spin' : ''}`} />
                <span>{isMigrating ? 'Migrating...' : 'Run Bench Migrate'}</span>
              </button>

              <button
                onClick={handleBackup}
                disabled={isBackingUp}
                className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <HardDrive className="w-3.5 h-3.5" />
                <span>{isBackingUp ? 'Backing Up...' : 'Take Manual Snapshot'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {site.status === 'active' ? (
                <button
                  onClick={() => onUpdateStatus(site.id, 'maintenance')}
                  className="px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Enable Maintenance Mode</span>
                </button>
              ) : (
                <button
                  onClick={() => onUpdateStatus(site.id, 'active')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Set Active</span>
                </button>
              )}
            </div>
          </div>

          {/* Details 2-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column: Instance & DB Config */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                Infrastructure & Database
              </h3>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Bench Cluster Node:</span>
                  <span className="text-slate-200">{site.benchName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Database Name:</span>
                  <span className="text-emerald-400">{site.dbName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Database User:</span>
                  <span className="text-slate-200">{site.dbUser}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Frappe Framework:</span>
                  <span className="text-slate-200">{site.frappeVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ERPNext Version:</span>
                  <span className="text-slate-200">{site.erpnextVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Created Date:</span>
                  <span className="text-slate-400">{new Date(site.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* SSO Jump Link */}
              {site.ssoToken && (
                <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-800/50 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-indigo-400" />
                      Single Sign-On (SSO) One-Click Access
                    </span>
                    <button
                      onClick={handleCopySSO}
                      className="text-[11px] text-indigo-400 hover:text-indigo-200 font-medium flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy SSO URL'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Bypasses password entry as Control Plane Superadmin for debugging.
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Custom Domain & Installed Apps */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-400" />
                Custom Domain & SSL Routing
              </h3>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Custom FQDN Domain</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customDomainInput}
                      onChange={(e) => setCustomDomainInput(e.target.value)}
                      placeholder="erp.company.com"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono"
                    />
                    <button
                      onClick={handleCheckDns}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs"
                    >
                      Verify CNAME
                    </button>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-300">Let's Encrypt SSL Cert:</span>
                  </div>
                  <span className="font-mono text-emerald-400 uppercase">{site.sslStatus}</span>
                </div>
              </div>

              {/* Installed Frappe Apps */}
              <div>
                <span className="block text-xs font-semibold text-slate-300 mb-2">Installed Apps Catalog</span>
                <div className="flex flex-wrap gap-1.5">
                  {site.installedApps.map((appId) => (
                    <span
                      key={appId}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 uppercase"
                    >
                      {appId}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Backup History Table */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-amber-400" />
              Site Snapshot Vault ({siteBackups.length})
            </h3>

            {siteBackups.length > 0 ? (
              <div className="border border-slate-800 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-2.5 font-medium">Backup File</th>
                      <th className="p-2.5 font-medium">Size</th>
                      <th className="p-2.5 font-medium">Type</th>
                      <th className="p-2.5 font-medium">Created</th>
                      <th className="p-2.5 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                    {siteBackups.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-800/40">
                        <td className="p-2.5 text-emerald-400">{b.fileName}</td>
                        <td className="p-2.5">{b.sizeMB} MB</td>
                        <td className="p-2.5 capitalize">{b.type}</td>
                        <td className="p-2.5 text-slate-400">{new Date(b.createdAt).toLocaleDateString()}</td>
                        <td className="p-2.5 text-right">
                          <button
                            onClick={() => alert(`Downloading backup archive ${b.fileName}`)}
                            className="text-indigo-400 hover:text-indigo-300 text-xs underline font-sans"
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
              <p className="text-xs text-slate-500 italic">No backups found for this site yet.</p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
