import React, { useState } from 'react';
import {
  Globe,
  Search,
  Plus,
  Server,
  Filter,
  MoreVertical,
  ExternalLink,
  Lock,
  Unlock,
  RefreshCw,
  HardDrive,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { Site, BenchNode, PlanTier, SiteStatus } from '../types';
import { Trash2 } from 'lucide-react';

interface SitesViewProps {
  sites: Site[];
  benches: BenchNode[];
  searchQuery: string;
  onOpenNewSiteModal: () => void;
  onSelectSite: (site: Site) => void;
  onUpdateStatus: (siteId: string, status: SiteStatus) => Promise<void>;
  onTriggerMigrate: (siteId: string) => Promise<void>;
  onDeleteSite: (siteId: string) => Promise<void>;
}

export const SitesView: React.FC<SitesViewProps> = ({
  sites,
  benches,
  searchQuery,
  onOpenNewSiteModal,
  onSelectSite,
  onUpdateStatus,
  onTriggerMigrate,
  onDeleteSite,
}) => {
  const [siteToDelete, setSiteToDelete] = useState<Site | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedBench, setSelectedBench] = useState<string>('all');

  const confirmDelete = async () => {
    if (!siteToDelete) return;
    setIsDeleting(true);
    try {
      await onDeleteSite(siteToDelete.id);
      setSiteToDelete(null);
    } catch (err) {
      console.error('Failed to delete site:', err);
    } finally {
      setIsDeleting(false);
    }
  };


  const filteredSites = sites.filter((site) => {
    const matchesSearch =
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.subdomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (site.customDomain && site.customDomain.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPlan = selectedPlan === 'all' || site.plan === selectedPlan;
    const matchesStatus = selectedStatus === 'all' || site.status === selectedStatus;
    const matchesBench = selectedBench === 'all' || site.benchId === selectedBench;

    return matchesSearch && matchesPlan && matchesStatus && matchesBench;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Actions & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-400" />
            Managed Tenant Sites ({filteredSites.length})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Isolated Frappe databases and ERPNext application instances
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Plan Filter */}
          <select
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <option value="all">All Plans</option>
            <option value="starter">Starter</option>
            <option value="professional">Professional</option>
            <option value="enterprise">Enterprise</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="provisioning">Provisioning</option>
            <option value="maintenance">Maintenance</option>
            <option value="suspended">Suspended</option>
          </select>

          {/* Bench Node Filter */}
          <select
            value={selectedBench}
            onChange={(e) => setSelectedBench(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <option value="all">All Bench Nodes</option>
            {benches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          <button
            onClick={onOpenNewSiteModal}
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition-all border border-emerald-400/30 ml-auto md:ml-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Site</span>
          </button>
        </div>
      </div>

      {/* Sites Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4 font-semibold">Tenant Site & Subdomain</th>
                <th className="p-4 font-semibold">Bench Node</th>
                <th className="p-4 font-semibold">Status & SSL</th>
                <th className="p-4 font-semibold">Plan & Usage</th>
                <th className="p-4 font-semibold">Owner Email</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs">
              {filteredSites.map((site) => (
                <tr
                  key={site.id}
                  className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  onClick={() => onSelectSite(site)}
                >
                  {/* Site Name & Subdomain */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold font-mono text-emerald-400 text-xs shrink-0">
                        {site.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                          {site.name}
                        </div>
                        <div className="font-mono text-[11px] text-emerald-400/90 flex items-center gap-1">
                          <span>{site.subdomain}.saas.cloud</span>
                        </div>
                        {site.customDomain && (
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            Custom: {site.customDomain}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Bench Cluster Node */}
                  <td className="p-4">
                    <div className="font-semibold text-slate-300">{site.benchName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Frappe {site.frappeVersion}
                    </div>
                  </td>

                  {/* Status & SSL Badges */}
                  <td className="p-4">
                    <div className="flex flex-col gap-1 items-start">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          site.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : site.status === 'provisioning'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse'
                            : site.status === 'maintenance'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {site.status}
                      </span>

                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>SSL {site.sslStatus}</span>
                      </div>
                    </div>
                  </td>

                  {/* Plan & Disk Quota */}
                  <td className="p-4">
                    <div className="font-semibold text-slate-200 capitalize">{site.plan}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {(site.diskUsageMB / 1024).toFixed(1)} GB / {(site.diskQuotaMB / 1024).toFixed(0)} GB
                    </div>
                    <div className="w-24 h-1 rounded-full bg-slate-800 mt-1 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500"
                        style={{ width: `${Math.min(100, (site.diskUsageMB / site.diskQuotaMB) * 100)}%` }}
                      />
                    </div>
                  </td>

                  {/* Owner Email */}
                  <td className="p-4 text-slate-300 font-mono text-[11px]">
                    {site.ownerEmail}
                    <div className="text-[10px] text-slate-500 font-sans">{site.companyName}</div>
                  </td>

                  {/* Quick Action Buttons */}
                  <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      {site.ssoToken && (
                        <button
                          onClick={() =>
                            alert(
                              `Auto-login generated for ${site.name}.\nRedirecting to https://${site.subdomain}.saas.cloud/login?token=${site.ssoToken}`
                            )
                          }
                          title="Launch SSO Auto-login"
                          className="p-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 transition-colors"
                        >
                          <Zap className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => onSelectSite(site)}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors"
                      >
                        Manage
                      </button>

                      <button
                        onClick={() => setSiteToDelete(site)}
                        title="Safe Site Deletion (Generates Vault Snapshot)"
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors border border-rose-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredSites.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 text-xs italic">
                    No matching tenant sites found. Try adjusting search or filter parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Safe Site Deletion Modal */}
      {siteToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Safely Delete Tenant Site?</h3>
                <p className="text-xs text-slate-400 font-mono">{siteToDelete.subdomain}.saas.cloud</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 leading-relaxed">
              Are you sure you want to delete <strong className="text-white">{siteToDelete.name}</strong>? A pre-deletion snapshot archive will be automatically created and preserved in the Snapshot Vault for 90 days. An email notification will be sent to <strong>{siteToDelete.ownerEmail}</strong>.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSiteToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-rose-950/40"
              >
                <span>{isDeleting ? 'Archiving & Deleting...' : 'Confirm Safe Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

