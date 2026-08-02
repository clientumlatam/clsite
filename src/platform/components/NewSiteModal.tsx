import React, { useState } from 'react';
import { X, Globe, Server, CheckCircle2, Terminal, AlertTriangle, Play, Sparkles } from 'lucide-react';
import { BenchNode, PlanTier, FrappeApp } from '../types';
import { FRAPPE_APPS, SUBSCRIPTION_PLANS } from '../data/mockData';

interface NewSiteModalProps {
  benches: BenchNode[];
  onClose: () => void;
  onSubmitProvision: (siteData: {
    name: string;
    subdomain: string;
    companyName: string;
    ownerEmail: string;
    plan: PlanTier;
    benchId: string;
    apps: string[];
    country: string;
  }) => Promise<void>;
}

export const NewSiteModal: React.FC<NewSiteModalProps> = ({
  benches,
  onClose,
  onSubmitProvision,
}) => {
  const [step, setStep] = useState<'form' | 'terminal'>('form');
  const [name, setName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [country, setCountry] = useState('United States');
  const [plan, setPlan] = useState<PlanTier>('starter');
  const [selectedBenchId, setSelectedBenchId] = useState(benches[0]?.id || '');
  const [selectedApps, setSelectedApps] = useState<string[]>(['hrms', 'payments']);
  const [errorMsg, setErrorMsg] = useState('');

  // Terminal log state
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [provisionProgress, setProvisionProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const handleSubdomainChange = (val: string) => {
    const sanitized = val.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSubdomain(sanitized);
  };

  const handleToggleApp = (appId: string) => {
    if (selectedApps.includes(appId)) {
      setSelectedApps(selectedApps.filter((id) => id !== appId));
    } else {
      setSelectedApps([...selectedApps, appId]);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter a site name.');
      return;
    }
    if (!subdomain.trim()) {
      setErrorMsg('Please specify a subdomain.');
      return;
    }
    if (!ownerEmail.trim()) {
      setErrorMsg('Please enter owner email.');
      return;
    }

    setErrorMsg('');
    setStep('terminal');
    setProvisionProgress(10);

    const logLines: string[] = [
      `[1/6] Allocating PostgreSQL/MariaDB database user and credentials...`,
      `Database name: __${subdomain}_db | User: _usr_${Math.floor(Math.random() * 899 + 100)}`,
    ];
    setTerminalLogs(logLines);

    // Simulate terminal execution steps
    setTimeout(() => {
      setProvisionProgress(30);
      setTerminalLogs((prev) => [
        ...prev,
        `[2/6] Executing 'bench --site ${subdomain}.saas.cloud new-site'...`,
        `Creating site config json on bench node '${benches.find((b) => b.id === selectedBenchId)?.name}'...`,
      ]);
    }, 1500);

    setTimeout(() => {
      setProvisionProgress(55);
      setTerminalLogs((prev) => [
        ...prev,
        `[3/6] Installing core Frappe Framework & ERPNext app...`,
        `Installing requested add-on apps: ${selectedApps.join(', ')}...`,
      ]);
    }, 3500);

    setTimeout(() => {
      setProvisionProgress(75);
      setTerminalLogs((prev) => [
        ...prev,
        `[4/6] Setting Administrator password & initial DocType fixtures...`,
        `[5/6] Updating Nginx/Traefik reverse proxy & issuing Let's Encrypt SSL certificate...`,
      ]);
    }, 5500);

    try {
      await onSubmitProvision({
        name,
        subdomain,
        companyName: companyName || name,
        ownerEmail,
        plan,
        benchId: selectedBenchId,
        apps: selectedApps,
        country,
      });

      setTimeout(() => {
        setProvisionProgress(100);
        setTerminalLogs((prev) => [
          ...prev,
          `[6/6] SUCCESS: ERPNext site '${subdomain}.saas.cloud' is active!`,
          `Administrator login credentials generated and emailed to ${ownerEmail}.`,
        ]);
        setIsDone(true);
      }, 7500);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Provisioning failed');
      setStep('form');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-slate-100 my-8 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Provision New ERPNext Tenant Site</h2>
              <p className="text-xs text-slate-400">Deploy isolated Frappe site to multi-tenant bench cluster</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {step === 'form' ? (
            <form onSubmit={handleSubmitForm} className="space-y-5">
              
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Site Name & Subdomain */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Site Display Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Acme Global ERP"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tenant Subdomain <span className="text-rose-400">*</span>
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      required
                      value={subdomain}
                      onChange={(e) => handleSubdomainChange(e.target.value)}
                      placeholder="acme-corp"
                      className="w-full bg-slate-950 border border-slate-800 rounded-l-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-mono"
                    />
                    <span className="bg-slate-800 border border-l-0 border-slate-700 px-3 py-2 text-xs text-slate-400 rounded-r-xl font-mono">
                      .saas.cloud
                    </span>
                  </div>
                </div>
              </div>

              {/* Owner Email & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Owner Email <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    placeholder="admin@acmeglobal.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Company Legal Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Acme Corporation Ltd"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              {/* Subscription Plan & Bench Node Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Subscription Tier Plan
                  </label>
                  <select
                    value={plan}
                    onChange={(e) => setPlan(e.target.value as PlanTier)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  >
                    {SUBSCRIPTION_PLANS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (${p.priceMonthly}/mo - {p.maxUsers} seats)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Bench Cluster Node
                  </label>
                  <select
                    value={selectedBenchId}
                    onChange={(e) => setSelectedBenchId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  >
                    {benches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.region} - {b.sitesCount}/{b.maxSites} sites)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Additional Frappe Apps Checklist */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Optional Installed Frappe Apps
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {FRAPPE_APPS.filter((a) => !a.isRequired).map((app) => {
                    const isChecked = selectedApps.includes(app.id);
                    return (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => handleToggleApp(app.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all text-xs flex items-center justify-between ${
                          isChecked
                            ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300 font-medium'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div>
                          <p className="font-semibold">{app.title}</p>
                          <p className="text-[10px] text-slate-500">{app.category}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0 pointer-events-none"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950/40 transition-all flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Execute Site Provisioning</span>
                </button>
              </div>

            </form>
          ) : (
            /* Live Terminal Progress View */
            <div className="space-y-5">
              
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-300 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    Provisioning Pipeline Execution
                  </span>
                  <span className="font-mono text-emerald-400">{provisionProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                    style={{ width: `${provisionProgress}%` }}
                  />
                </div>
              </div>

              {/* Terminal Console Box */}
              <div className="p-4 rounded-xl bg-black border border-slate-800 font-mono text-xs text-emerald-400 space-y-1.5 h-64 overflow-y-auto leading-relaxed shadow-inner">
                {terminalLogs.map((logLine, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-slate-600 select-none">&gt;</span>
                    <span className={logLine.includes('SUCCESS') ? 'text-emerald-300 font-bold' : 'text-slate-300'}>
                      {logLine}
                    </span>
                  </div>
                ))}
                {!isDone && (
                  <div className="flex items-center gap-2 text-slate-500 animate-pulse pt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Executing bench worker tasks...</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end pt-2">
                {isDone ? (
                  <button
                    onClick={onClose}
                    className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950/40 transition-all"
                  >
                    Done & Close
                  </button>
                ) : (
                  <span className="text-xs text-slate-500 italic">Please wait while site provisioning completes...</span>
                )}
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
