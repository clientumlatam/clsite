import React, { useState } from 'react';
import {
  Server,
  Plus,
  Activity,
  Cpu,
  HardDrive,
  RefreshCw,
  Zap,
  CheckCircle2,
  AlertTriangle,
  X,
  Layers,
  Globe,
} from 'lucide-react';
import { BenchNode } from '../types';

interface BenchesViewProps {
  benches: BenchNode[];
  onAddBenchNode: (benchData: {
    name: string;
    hostname: string;
    region: string;
    provider: BenchNode['provider'];
    frappeBranch: string;
  }) => Promise<void>;
}

export const BenchesView: React.FC<BenchesViewProps> = ({ benches, onAddBenchNode }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [hostname, setHostname] = useState('');
  const [region, setRegion] = useState('us-east (N. Virginia)');
  const [provider, setProvider] = useState<BenchNode['provider']>('GCP');
  const [frappeBranch, setFrappeBranch] = useState('v15.24.0');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddBench = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !hostname) return;

    setIsSubmitting(true);
    await onAddBenchNode({
      name,
      hostname,
      region,
      provider,
      frappeBranch,
    });
    setIsSubmitting(false);
    setShowAddModal(false);
    setName('');
    setHostname('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-400" />
            Frappe Bench Cluster Nodes ({benches.length})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Distributed virtual machine nodes running Frappe multi-tenant bench environments
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-950/40 transition-all border border-indigo-400/30 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add Bench Node</span>
        </button>
      </div>

      {/* Bench Cluster Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {benches.map((bench) => {
          const cpuGaugeColor =
            bench.cpuUsagePct > 80
              ? 'bg-rose-500 text-rose-300'
              : bench.cpuUsagePct > 60
              ? 'bg-amber-500 text-amber-300'
              : 'bg-emerald-500 text-emerald-300';

          const memPct = Math.round((bench.memoryUsageGB / bench.memoryTotalGB) * 100);

          return (
            <div
              key={bench.id}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-xl space-y-5"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{bench.name}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {bench.provider}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">{bench.hostname}</p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                    bench.status === 'online'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : bench.status === 'maintenance'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {bench.status}
                </span>
              </div>

              {/* Resource Usage Bar Dials */}
              <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                
                {/* CPU */}
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>CPU Load</span>
                    <span className="font-mono font-bold text-slate-200">{bench.cpuUsagePct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${cpuGaugeColor.split(' ')[0]}`} style={{ width: `${bench.cpuUsagePct}%` }} />
                  </div>
                </div>

                {/* Memory */}
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>RAM</span>
                    <span className="font-mono font-bold text-slate-200">{memPct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${memPct}%` }} />
                  </div>
                </div>

                {/* Disk */}
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Disk</span>
                    <span className="font-mono font-bold text-slate-200">
                      {Math.round((bench.diskUsageGB / bench.diskTotalGB) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: `${(bench.diskUsageGB / bench.diskTotalGB) * 100}%` }} />
                  </div>
                </div>

              </div>

              {/* Bench Metadata */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-400 border-t border-slate-800/80 pt-3">
                <div>
                  <span className="text-slate-500">Region:</span> {bench.region}
                </div>
                <div>
                  <span className="text-slate-500">Frappe Branch:</span> {bench.frappeBranch}
                </div>
                <div>
                  <span className="text-slate-500">Site Allocation:</span>{' '}
                  <span className="text-emerald-400 font-bold">
                    {bench.sitesCount} / {bench.maxSites}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Redis Cache:</span>{' '}
                  <span className={bench.redisStatus === 'healthy' ? 'text-emerald-400' : 'text-amber-400'}>
                    {bench.redisStatus}
                  </span>
                </div>
              </div>

              {/* Installed App Packages */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-slate-400">Available Apps on Bench</span>
                <div className="flex flex-wrap gap-1.5">
                  {bench.installedApps.map((app) => (
                    <span
                      key={app}
                      className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300 uppercase border border-slate-700"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Bench Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-indigo-400" />
                Add New Bench Node
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBench} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Bench Display Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. EU-West-Bench-02"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Server Hostname / FQDN</label>
                <input
                  type="text"
                  required
                  value={hostname}
                  onChange={(e) => setHostname(e.target.value)}
                  placeholder="bench02.frappe-cloud.internal"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Cloud Provider</label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    <option value="AWS">AWS</option>
                    <option value="GCP">GCP</option>
                    <option value="Hetzner">Hetzner</option>
                    <option value="DigitalOcean">DigitalOcean</option>
                    <option value="BareMetal">BareMetal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Frappe Branch</label>
                  <input
                    type="text"
                    value={frappeBranch}
                    onChange={(e) => setFrappeBranch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                >
                  {isSubmitting ? 'Adding...' : 'Save Bench Node'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
