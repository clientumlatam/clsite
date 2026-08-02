import React, { useState } from 'react';
import {
  HardDrive,
  Download,
  Plus,
  RefreshCw,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
  RotateCcw,
} from 'lucide-react';
import { SiteBackup, Site } from '../types';

interface BackupsViewProps {
  backups: SiteBackup[];
  sites: Site[];
  onTriggerBackup: (siteId: string) => Promise<void>;
}

export const BackupsView: React.FC<BackupsViewProps> = ({ backups, sites, onTriggerBackup }) => {
  const [search, setSearch] = useState('');
  const [selectedSiteId, setSelectedSiteId] = useState(sites[0]?.id || '');
  const [isBackingUp, setIsBackingUp] = useState(false);

  const filteredBackups = backups.filter(
    (b) =>
      b.siteName.toLowerCase().includes(search.toLowerCase()) ||
      b.fileName.toLowerCase().includes(search.toLowerCase())
  );

  const handleManualBackup = async () => {
    if (!selectedSiteId) return;
    setIsBackingUp(true);
    await onTriggerBackup(selectedSiteId);
    setTimeout(() => setIsBackingUp(false), 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-amber-400" />
            Snapshots Vault & Disaster Recovery
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Automated MariaDB SQL dumps, public & private file archives synced to cloud storage
          </p>
        </div>

        {/* Quick Manual Snapshot Trigger */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
          <select
            value={selectedSiteId}
            onChange={(e) => setSelectedSiteId(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            {sites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.subdomain})
              </option>
            ))}
          </select>

          <button
            onClick={handleManualBackup}
            disabled={isBackingUp}
            className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>{isBackingUp ? 'Creating...' : 'Trigger Backup'}</span>
          </button>
        </div>
      </div>

      {/* Backup Filter & Search */}
      <div className="flex items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search backup archives by site name or filename..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Showing <span className="text-white font-bold">{filteredBackups.length}</span> backup archives
        </div>
      </div>

      {/* Backup Archives Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4 font-semibold">Tenant Site</th>
                <th className="p-4 font-semibold">Archive Filename</th>
                <th className="p-4 font-semibold">Size (MB)</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">Created Date</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs font-mono">
              {filteredBackups.map((bak) => (
                <tr key={bak.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-sans font-bold text-slate-100">
                    {bak.siteName}
                  </td>

                  <td className="p-4 text-emerald-400">
                    {bak.fileName}
                  </td>

                  <td className="p-4 text-slate-200">
                    {bak.sizeMB} MB
                  </td>

                  <td className="p-4 font-sans capitalize text-slate-300">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        bak.type === 'manual'
                          ? 'bg-purple-500/10 text-purple-300 border border-purple-500/30'
                          : bak.type === 'pre_migration'
                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                          : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {bak.type}
                    </span>
                  </td>

                  <td className="p-4 text-slate-400">
                    {new Date(bak.createdAt).toLocaleString()}
                  </td>

                  <td className="p-4 text-right font-sans">
                    <button
                      onClick={() => alert(`Initiating secure download of backup archive ${bak.fileName}`)}
                      className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))}

              {filteredBackups.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 text-xs italic">
                    No backup archives found matching query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
