import React from 'react';
import {
  Globe,
  Server,
  CreditCard,
  HardDrive,
  Cpu,
  Activity,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  AlertTriangle,
  Play,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';
import { ControlPlaneMetrics, Site, BenchNode, SystemLog } from '../types';

interface DashboardViewProps {
  metrics: ControlPlaneMetrics;
  sites: Site[];
  benches: BenchNode[];
  recentLogs: SystemLog[];
  onOpenNewSiteModal: () => void;
  onOpenAiAssistant: () => void;
  onNavigateToTab: (tab: 'sites' | 'benches' | 'subscriptions' | 'backups' | 'logs') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  sites,
  benches,
  recentLogs,
  onOpenNewSiteModal,
  onOpenAiAssistant,
  onNavigateToTab,
}) => {
  const activeCount = sites.filter((s) => s.status === 'active').length;
  const provisioningCount = sites.filter((s) => s.status === 'provisioning').length;
  const maintenanceCount = sites.filter((s) => s.status === 'maintenance').length;
  const suspendedCount = sites.filter((s) => s.status === 'suspended').length;

  return (
    <div className="space-y-6">
      
      {/* Top Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-500/30">
                Control Plane Live
              </span>
              <span className="text-slate-400 text-xs">Connected to 4 Bench Clusters</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              ERPNext Multi-Tenant Orchestrator
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Monitor, provision, and auto-scale Frappe/ERPNext tenant sites, bench nodes, backups, and SSL routing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAiAssistant}
              className="px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <Zap className="w-4 h-4 text-purple-400" />
              <span>DevOps AI Copilot</span>
            </button>
            <button
              onClick={onOpenNewSiteModal}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all border border-emerald-400/30"
            >
              <Plus className="w-4 h-4" />
              <span>Provision New Site</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Sites */}
        <div
          onClick={() => onNavigateToTab('sites')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Managed Sites</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{sites.length}</span>
            <span className="text-xs text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +4 this week
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {activeCount} active, {provisioningCount} provisioning
          </p>
        </div>

        {/* Bench Clusters */}
        <div
          onClick={() => onNavigateToTab('benches')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Bench Nodes</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Server className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{benches.length}</span>
            <span className="text-xs text-indigo-400 font-mono">
              {metrics.onlineBenches}/{benches.length} Online
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Avg CPU Load: {metrics.averageCpuUsagePct}%
          </p>
        </div>

        {/* MRR Billing */}
        <div
          onClick={() => onNavigateToTab('subscriptions')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Monthly Revenue (MRR)</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">
              ${metrics.mrrAmount.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-400">+12% vs last mo</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {metrics.activeSubscriptions} active tenant subscriptions
          </p>
        </div>

        {/* Vault Storage */}
        <div
          onClick={() => onNavigateToTab('backups')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Disk Storage Allocated</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <HardDrive className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">
              {metrics.totalDiskUsedGB} GB
            </span>
            <span className="text-xs text-slate-400">/ {metrics.totalDiskCapacityGB} GB</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {metrics.backupsCountToday} backups completed today ({metrics.backupSuccessRatePct}%)
          </p>
        </div>

      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Managed Sites Quick Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  Recent Tenant Sites
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Latest ERPNext instances provisioned across bench clusters
                </p>
              </div>
              <button
                onClick={() => onNavigateToTab('sites')}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
              >
                <span>View All Sites</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {sites.slice(0, 5).map((site) => (
                <div
                  key={site.id}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 font-bold font-mono text-xs">
                      {site.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-200">{site.name}</span>
                        <span className="font-mono text-[11px] text-emerald-400">
                          {site.subdomain}.saas.cloud
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-3 mt-0.5">
                        <span>{site.benchName}</span>
                        <span>•</span>
                        <span>{site.frappeVersion}</span>
                        <span>•</span>
                        <span className="capitalize text-slate-400">{site.plan} Plan</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider ${
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

                    {site.ssoToken && (
                      <a
                        href={`#sso-login-${site.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          alert(`Auto-login generated for ${site.name}.\nRedirecting to https://${site.subdomain}.saas.cloud/login?token=${site.ssoToken}`);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium flex items-center gap-1 transition-colors"
                      >
                        <span>Launch SSO</span>
                        <ArrowUpRight className="w-3 h-3 text-slate-400" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Bench Cluster Load & Live Activity Stream */}
        <div className="space-y-6">
          
          {/* Bench Cluster Loads */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-indigo-400" />
                Bench Cluster Node Loads
              </h3>
              <button
                onClick={() => onNavigateToTab('benches')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Manage Nodes
              </button>
            </div>

            <div className="space-y-3">
              {benches.map((bench) => {
                const cpuColor =
                  bench.cpuUsagePct > 80
                    ? 'bg-rose-500'
                    : bench.cpuUsagePct > 60
                    ? 'bg-amber-500'
                    : 'bg-emerald-500';

                return (
                  <div key={bench.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">{bench.name}</span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {bench.sitesCount}/{bench.maxSites} sites
                      </span>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>CPU Load</span>
                        <span className="font-mono text-slate-200">{bench.cpuUsagePct}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div className={`h-full ${cpuColor} transition-all duration-500`} style={{ width: `${bench.cpuUsagePct}%` }} />
                      </div>
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
                      <span>RAM: {bench.memoryUsageGB} / {bench.memoryTotalGB} GB</span>
                      <span className="capitalize text-emerald-400">{bench.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Live System Events */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                Live Control Events
              </h3>
              <button
                onClick={() => onNavigateToTab('logs')}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium"
              >
                Log Stream
              </button>
            </div>

            <div className="space-y-2.5">
              {recentLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span className="uppercase text-slate-400">{log.source}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-slate-300 font-medium line-clamp-2">{log.message}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
