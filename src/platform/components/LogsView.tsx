import React, { useState } from 'react';
import { FileText, Search, Filter, AlertTriangle, CheckCircle2, Clock, Terminal } from 'lucide-react';
import { SystemLog } from '../types';

interface LogsViewProps {
  logs: SystemLog[];
}

export const LogsView: React.FC<LogsViewProps> = ({ logs }) => {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(search.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(search.toLowerCase())) ||
      (log.siteName && log.siteName.toLowerCase().includes(search.toLowerCase()));

    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    const matchesSource = sourceFilter === 'all' || log.source === sourceFilter;

    return matchesSearch && matchesLevel && matchesSource;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            System Events & Log Stream ({filteredLogs.length})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit log stream for site provisioning, bench workers, nginx access, and database migrations
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="all">All Levels</option>
            <option value="info">INFO</option>
            <option value="warn">WARN</option>
            <option value="error">ERROR</option>
            <option value="critical">CRITICAL</option>
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="all">All Sources</option>
            <option value="provisioner">Provisioner</option>
            <option value="bench_worker">Bench Worker</option>
            <option value="nginx">Nginx</option>
            <option value="database">Database</option>
            <option value="backup_runner">Backup Runner</option>
            <option value="api">Control API</option>
          </select>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter log output by keyword, site name, command or error string..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        />
      </div>

      {/* Terminal Log Console View */}
      <div className="p-4 rounded-2xl bg-black border border-slate-800 font-mono text-xs leading-relaxed space-y-2.5 shadow-2xl overflow-hidden">
        {filteredLogs.map((log) => {
          const levelBadge =
            log.level === 'error' || log.level === 'critical'
              ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
              : log.level === 'warn'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';

          return (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-slate-950/80 border border-slate-900 hover:border-slate-800 transition-colors space-y-1"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-[10px]">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded border uppercase font-bold ${levelBadge}`}>
                    {log.level}
                  </span>
                  <span className="text-slate-500 uppercase tracking-wider font-semibold">
                    [{log.source}]
                  </span>
                  {log.siteName && (
                    <span className="text-emerald-400 font-sans font-bold">
                      {log.siteName}
                    </span>
                  )}
                </div>
                <span className="text-slate-500">{new Date(log.timestamp).toLocaleString()}</span>
              </div>

              <p className="text-slate-200 font-medium text-xs pt-0.5">{log.message}</p>

              {log.details && (
                <div className="mt-1.5 p-2 rounded bg-black/60 text-slate-400 text-[11px] border border-slate-900 whitespace-pre-wrap">
                  {log.details}
                </div>
              )}
            </div>
          );
        })}

        {filteredLogs.length === 0 && (
          <div className="p-8 text-center text-slate-600 italic">No logs match the selected filter query.</div>
        )}
      </div>

    </div>
  );
};
