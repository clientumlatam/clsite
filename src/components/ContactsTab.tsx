import React, { useState } from 'react';
import { EmailContact } from '../types';
import { Users, Plus, Search, Mail, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';

const initialContacts: EmailContact[] = [
  { id: '1', email: 'carlos.mendoza@fintechmx.com', name: 'Carlos Mendoza', status: 'Subscribed', list: 'VIP LATAM Leads', tags: ['Mexico', 'FinTech', 'High-Value'], addedDate: '2026-07-15' },
  { id: '2', email: 'valentina.silva@ecommerce.co', name: 'Valentina Silva', status: 'Subscribed', list: 'Colombia E-commerce', tags: ['Colombia', 'Shopify'], addedDate: '2026-07-18' },
  { id: '3', email: 'lucas.santos@saasbr.com.br', name: 'Lucas Santos', status: 'Subscribed', list: 'Brazil SaaS Founders', tags: ['Brazil', 'SaaS', 'B2B'], addedDate: '2026-07-20' },
  { id: '4', email: 'matias.rojas@retailcl.cl', name: 'Matías Rojas', status: 'Unsubscribed', list: 'Chile Retail', tags: ['Chile', 'Retail'], addedDate: '2026-07-10' },
  { id: '5', email: 'sofia.fernandez@edtech.ar', name: 'Sofia Fernandez', status: 'Subscribed', list: 'Argentina Founders', tags: ['Argentina', 'EdTech'], addedDate: '2026-07-25' },
];

export function ContactsTab() {
  const [contacts, setContacts] = useState<EmailContact[]>(initialContacts);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [list, setList] = useState('VIP LATAM Leads');
  const [tagInput, setTagInput] = useState('Mexico, SaaS');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newContact: EmailContact = {
      id: Date.now().toString(),
      email,
      name,
      status: 'Subscribed',
      list,
      tags: tagInput.split(',').map(t => t.trim()).filter(Boolean),
      addedDate: new Date().toISOString().split('T')[0],
    };
    setContacts([newContact, ...contacts]);
    setEmail('');
    setName('');
    setModalOpen(false);
  };

  const filtered = contacts.filter(c => {
    const matchesSearch = c.email.toLowerCase().includes(search.toLowerCase()) || 
                          c.name.toLowerCase().includes(search.toLowerCase()) ||
                          c.list.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Email Contacts & Subscribers</h2>
            <p className="text-xs text-slate-500">Manage audience lists, subscriber health, and targeted tags across LATAM</p>
          </div>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Contact</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search email, name, list..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['All', 'Subscribed', 'Unsubscribed'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === st ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-3.5 px-6">Subscriber</th>
                <th className="py-3.5 px-6">List</th>
                <th className="py-3.5 px-6">Tags</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900">{c.name}</div>
                    <div className="text-xs text-slate-500">{c.email}</div>
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-700">{c.list}</td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1">
                      {c.tags.map((t, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] rounded-md font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      c.status === 'Subscribed' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {c.status === 'Subscribed' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      {c.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-500">{c.addedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add New Email Contact</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alejandro Gomez"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alejandro@company.mx"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subscriber List</label>
                <select
                  value={list}
                  onChange={(e) => setList(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                >
                  <option value="VIP LATAM Leads">VIP LATAM Leads</option>
                  <option value="Colombia E-commerce">Colombia E-commerce</option>
                  <option value="Brazil SaaS Founders">Brazil SaaS Founders</option>
                  <option value="Mexico B2B Executives">Mexico B2B Executives</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Mexico, FinTech, VIP"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/30"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
