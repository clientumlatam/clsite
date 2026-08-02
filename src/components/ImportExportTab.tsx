import React, { useState } from 'react';
import { ArrowLeftRight, Upload, Download, CheckCircle2 } from 'lucide-react';

export function ImportExportTab() {
  const [successMsg, setSuccessMsg] = useState(false);

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
          <ArrowLeftRight className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Import & Export Subscribers</h2>
          <p className="text-xs text-slate-500">Easily upload CSV subscriber lists or export your audience database</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Import CSV */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-600" /> Import Subscribers (CSV)
          </h3>
          <form onSubmit={handleImport} className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center space-y-2 hover:border-indigo-500 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-indigo-600 mx-auto" />
              <div className="text-sm font-semibold text-slate-800">Drag & drop your CSV file here</div>
              <div className="text-xs text-slate-400">Supports columns: email, name, list, tags</div>
            </div>

            {successMsg && (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Subscribers successfully imported and tagged!
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/30 cursor-pointer"
            >
              Upload & Import CSV
            </button>
          </form>
        </div>

        {/* Export CSV */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Download className="w-5 h-5 text-emerald-600" /> Export Audience Database
            </h3>
            <p className="text-xs text-slate-500">
              Download your complete list of subscribers, engagement metrics, open rates, and tags in CSV format.
            </p>
          </div>
          <button
            onClick={() => alert('Exporting CSV download...') }
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/30 cursor-pointer flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download All Contacts (CSV)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
