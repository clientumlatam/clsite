import React, { useState } from 'react';
import { ClientItem } from '../types';
import { Users, Plus, Search, Globe, DollarSign, CheckCircle2, AlertCircle, PauseCircle } from 'lucide-react';

const initialClients: ClientItem[] = [
  { id: '1', name: 'Carlos Mendoza', company: 'FinTech Monterrey', country: 'Mexico', budget: '$12,000 / mo', status: 'Active', campaign: 'Meta Lead Gen Q3', roi: '4.6x' },
  { id: '2', name: 'Valentina Silva', company: 'E-Commerce Bogota', country: 'Colombia', budget: '$8,500 / mo', status: 'Active', campaign: 'Google Search Max', roi: '3.9x' },
  { id: '3', name: 'Lucas Santos', company: 'SaaS Sao Paulo', country: 'Brazil', budget: '$25,000 / mo', status: 'Active', campaign: 'TikTok Growth BR', roi: '4.8x' },
  { id: '4', name: 'Matías Rojas', company: 'Retail Santiago', country: 'Chile', budget: '$6,200 / mo', status: 'Paused', campaign: 'Holiday Promo', roi: '3.1x' },
  { id: '5', name: 'Sofia Fernandez', company: 'EdTech Buenos Aires', country: 'Argentina', budget: '$9,000 / mo', status: 'Pending', campaign: 'App Installs AR', roi: '3.5x' },
];

export function ClientsTab() {
  const [clients, setClients] = useState<ClientItem[]>(initialClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [newModalOpen, setNewModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [country, setCountry] = useState('Mexico');
  const [budget, setBudget] = useState('$5,000 / mo');
  const [campaign, setCampaign] = useState('Meta Ads');

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    const newClient: ClientItem = {
      id: Date.now().toString(),
      name,
      company,
      country,
      budget,
      status: 'Active',
      campaign,
      roi: '4.0x',
    };
    setClients([newClient, ...clients]);
    setName('');
    setCompany('');
    setNewModalOpen(false);
  };

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">LATAM Clients CRM</h2>
            <p className="text-xs text-slate-500">Manage regional client accounts, active campaigns, and budgets</p>
          </div>
        </div>

        <button
          onClick={() => setNewModalOpen(true)}
          className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search clients, company, country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['All', 'Active', 'Pending', 'Paused'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === status
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-3.5 px-6">Client & Company</th>
                <th className="py-3.5 px-6">Country</th>
                <th className="py-3.5 px-6">Monthly Budget</th>
                <th className="py-3.5 px-6">Active Campaign</th>
                <th className="py-3.5 px-6">Blended ROI</th>
                <th className="py-3.5 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900">{client.name}</div>
                    <div className="text-xs text-slate-500">{client.company}</div>
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-700 flex items-center gap-1.5 pt-5">
                    <Globe className="w-4 h-4 text-indigo-600" />
                    {client.country}
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-900">{client.budget}</td>
                  <td className="py-4 px-6 text-slate-600">{client.campaign}</td>
                  <td className="py-4 px-6 font-bold text-emerald-600">{client.roi}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      client.status === 'Active' ? 'bg-emerald-50 text-emerald-700' :
                      client.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {client.status === 'Active' && <CheckCircle2 className="w-3 h-3" />}
                      {client.status === 'Pending' && <AlertCircle className="w-3 h-3" />}
                      {client.status === 'Paused' && <PauseCircle className="w-3 h-3" />}
                      {client.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Client Modal */}
      {newModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add New LATAM Client</h3>
            <form onSubmit={handleAddClient} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maria Rodriguez"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Latam Retail SA"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                >
                  <option value="Mexico">Mexico</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Brazil">Brazil</option>
                  <option value="Chile">Chile</option>
                  <option value="Argentina">Argentina</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Monthly Ad Budget</label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. $10,000 / mo"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Campaign</label>
                <input
                  type="text"
                  value={campaign}
                  onChange={(e) => setCampaign(e.target.value)}
                  placeholder="e.g. Meta Lead Gen"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setNewModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/30"
                >
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
