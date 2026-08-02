import React, { useState } from 'react';
import { ListOrdered, Plus, Users, Tag, ArrowRight } from 'lucide-react';

export function ListsTab() {
  const [lists, setLists] = useState([
    { id: '1', name: 'VIP LATAM Leads', count: 1420, openRate: '74.2%', description: 'High-intent decision makers across Mexico and Colombia' },
    { id: '2', name: 'Brazil SaaS Founders', count: 980, openRate: '68.5%', description: 'Founders and CTOs in Sao Paulo and Rio' },
    { id: '3', name: 'Colombia E-commerce', count: 650, openRate: '71.0%', description: 'Shopify and Magento store owners in Bogota and Medellin' },
    { id: '4', name: 'Newsletter Weekly Digest', count: 3372, openRate: '72.7%', description: 'Main subscriber list receiving weekly growth tips' },
  ]);

  const [tags, setTags] = useState([
    { name: 'Mexico', count: 1450, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { name: 'Brazil', count: 980, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { name: 'Colombia', count: 650, color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { name: 'FinTech', count: 1120, color: 'bg-violet-50 text-violet-700 border-violet-200' },
    { name: 'SaaS', count: 840, color: 'bg-pink-50 text-pink-700 border-pink-200' },
    { name: 'High-Value', count: 420, color: 'bg-sky-50 text-sky-700 border-sky-200' },
  ]);

  const [newListName, setNewListName] = useState('');
  const [newListDesc, setNewListDesc] = useState('');

  const handleAddList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    setLists([...lists, {
      id: Date.now().toString(),
      name: newListName,
      count: 0,
      openRate: '0%',
      description: newListDesc || 'Custom segmented list',
    }]);
    setNewListName('');
    setNewListDesc('');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lists Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <ListOrdered className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Subscriber Lists</h3>
                <p className="text-xs text-slate-500">Segmented audience groups for precise targeting</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {lists.map(l => (
              <div key={l.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{l.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{l.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs font-semibold text-slate-600">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-indigo-600" /> {l.count} subscribers</span>
                    <span className="text-emerald-600">Open rate: {l.openRate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add List Form */}
          <form onSubmit={handleAddList} className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Create New List</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="List Name (e.g. Chile Leads)"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <input
                type="text"
                placeholder="Short Description"
                value={newListDesc}
                onChange={(e) => setNewListDesc(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              Add New List
            </button>
          </form>
        </div>

        {/* Tags Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Audience Tags</h3>
              <p className="text-xs text-slate-500">Categorize subscribers with dynamic behavioral tags</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {tags.map((tag, idx) => (
              <div key={idx} className={`p-4 rounded-xl border flex items-center justify-between ${tag.color}`}>
                <span className="font-bold text-sm">{tag.name}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/80 shadow-xs">
                  {tag.count} contacts
                </span>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 mt-6 space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">AI Auto-Tagging Engine</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Gemini AI automatically analyzes subscriber interaction data and assigns regional & intent tags (e.g. #High-Value, #FinTech) upon email open or link click.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
