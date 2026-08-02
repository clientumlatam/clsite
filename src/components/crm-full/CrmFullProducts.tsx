import React, { useMemo, useState } from 'react';
import { Search, Package, Plus, Pencil, Check, X, ChevronDown, ChevronRight, LayoutGrid, Database, Box } from 'lucide-react';
import { Product } from './crmTypes';

interface Props {
  products: Product[];
  onSave: (product: Omit<Product, 'id'> | Product) => void;
}

const UNCATEGORIZED = 'Sin categoría';

export default function CrmFullProducts({ products, onSave }: Props) {
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Product>>({});
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (p.name?.toLowerCase().includes(search.toLowerCase()) ||
            p.code?.toLowerCase().includes(search.toLowerCase()) ||
            p.category?.toLowerCase().includes(search.toLowerCase()) ||
            p.subcategory?.toLowerCase().includes(search.toLowerCase())) &&
          p.active !== false
      ),
    [products, search]
  );

  // Group by Category > Subcategory, sorted alphabetically
  const grouped = useMemo(() => {
    const byCategory = new Map<string, Map<string, Product[]>>();
    for (const p of filtered) {
      const cat = p.category || UNCATEGORIZED;
      const sub = p.subcategory || 'General';
      if (!byCategory.has(cat)) byCategory.set(cat, new Map());
      const catMap = byCategory.get(cat)!;
      if (!catMap.has(sub)) catMap.set(sub, []);
      catMap.get(sub)!.push(p);
    }
    return Array.from(byCategory.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([category, subMap]) => ({
        category,
        subcategories: Array.from(subMap.entries())
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([subcategory, items]) => ({
            subcategory,
            items: items.sort((a, b) => a.code.localeCompare(b.code)),
          })),
        total: Array.from(subMap.values()).reduce((acc, arr) => acc + arr.length, 0),
      }));
  }, [filtered]);

  const toggleCategory = (cat: string) => setCollapsed((c) => ({ ...c, [cat]: !c[cat] }));

  const handleEdit = (p: Product) => {
    setEditing(p);
    setForm(p);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditing(null);
    setForm({ code: '', name: '', price: undefined, active: true, category: '', subcategory: '', unit: '' });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.code || !form.name) return;
    if (editing) {
      onSave({ ...editing, ...form } as Product);
    } else {
      onSave({
        id: Date.now().toString(),
        code: form.code!,
        name: form.name!,
        price: form.price,
        active: true,
        category: form.category || undefined,
        subcategory: form.subcategory || undefined,
        unit: form.unit || undefined,
      });
    }
    setShowForm(false);
    setEditing(null);
    setForm({});
  };

  const set = (k: keyof Product, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const totalCount = filtered.length;
  const categoryCount = grouped.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 font-display tracking-wide flex items-center gap-3">
            <Database className="w-6 h-6 text-sky-400" />
            CATÁLOGO MAESTRO
          </h1>
          <p className="text-xs text-slate-500 font-mono tracking-wider uppercase">
            {totalCount} ÍTEMS · {categoryCount} CATEGORÍAS · SISTEMA DE INVENTARIO
          </p>
        </div>
        <button onClick={handleNew} className="cockpit-button-primary px-4 py-2 flex items-center text-sm uppercase tracking-wider font-mono">
          <Plus className="w-4 h-4 mr-2" /> NUEVO ÍTEM
        </button>
      </div>

      {showForm && (
        <div className="cockpit-panel p-5 animate-slide-up border-sky-500/30 shadow-[0_0_20px_rgba(14,165,233,0.1)]">
          <div className="flex items-center gap-2 mb-4">
            <Box className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white font-display tracking-wide uppercase">
              {editing ? 'MODIFICAR ÍTEM DE CATÁLOGO' : 'NUEVO REGISTRO DE CATÁLOGO'}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <div>
              <label className="text-[10px] font-bold text-slate-400 mb-1.5 block font-mono uppercase tracking-widest">Código</label>
              <input 
                className="cockpit-input w-full font-mono text-sky-300 placeholder:text-slate-600" 
                value={form.code || ''} 
                onChange={(e) => set('code', e.target.value)} 
                placeholder="SKU-001" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-slate-400 mb-1.5 block font-mono uppercase tracking-widest">Nombre del Producto/Servicio</label>
              <input 
                className="cockpit-input w-full font-display" 
                value={form.name || ''} 
                onChange={(e) => set('name', e.target.value)} 
                placeholder="Descripción completa..." 
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 mb-1.5 block font-mono uppercase tracking-widest">Categoría Mayor</label>
              <input 
                className="cockpit-input w-full font-display" 
                value={form.category || ''} 
                onChange={(e) => set('category', e.target.value)} 
                placeholder="Ej: Hardware" 
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 mb-1.5 block font-mono uppercase tracking-widest">Subcategoría</label>
              <input 
                className="cockpit-input w-full font-display" 
                value={form.subcategory || ''} 
                onChange={(e) => set('subcategory', e.target.value)} 
                placeholder="Ej: Servidores" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 mb-1.5 block font-mono uppercase tracking-widest">Unidad</label>
                <input 
                  className="cockpit-input w-full font-mono text-center" 
                  value={form.unit || ''} 
                  onChange={(e) => set('unit', e.target.value)} 
                  placeholder="UN / HS" 
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 mb-1.5 block font-mono uppercase tracking-widest">Valor ($)</label>
                <input
                  type="number"
                  className="cockpit-input w-full font-mono text-right text-emerald-400"
                  value={form.price ?? ''}
                  onChange={(e) => set('price', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-3 border-t border-[#1E293B] pt-4">
            <button onClick={handleSave} className="cockpit-button-primary px-6 py-2 flex items-center text-sm font-mono uppercase tracking-wider">
              <Check className="w-4 h-4 mr-2" /> GUARDAR REGISTRO
            </button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="cockpit-button-secondary px-6 py-2 flex items-center text-sm font-mono uppercase tracking-wider">
              <X className="w-4 h-4 mr-2" /> ABORTAR
            </button>
          </div>
        </div>
      )}

      <div className="relative stagger-1 animate-slide-up">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-500/50" />
        <input
          placeholder="BUSCAR POR CÓDIGO, NOMBRE O CATEGORÍA..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="cockpit-input w-full pl-10 py-3 text-sm font-mono tracking-wide placeholder:text-slate-600 border-sky-500/20 focus:border-sky-500 bg-[#030712]/80 backdrop-blur"
        />
      </div>

      <div className="cockpit-panel overflow-hidden stagger-2 animate-slide-up">
        {grouped.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-[#1E293B] mx-auto mb-4" />
            <p className="text-slate-400 font-display tracking-wide uppercase">
              {search ? 'BÚSQUEDA SIN RESULTADOS' : 'BASE DE DATOS VACÍA'}
            </p>
            <p className="text-xs text-slate-500 font-mono mt-2">VERIFICA LOS PARÁMETROS DE BÚSQUEDA.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {grouped.map((group) => (
              <div key={group.category} className="border-b border-[#1E293B] last:border-0">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(group.category)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-[#0D1529] text-white hover:bg-[#15203A] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded bg-[#1E293B] flex items-center justify-center border border-[#334155] group-hover:border-sky-500/50 transition-colors">
                      {collapsed[group.category] ? (
                        <ChevronRight className="w-3 h-3 text-sky-400" />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-sky-400" />
                      )}
                    </div>
                    <LayoutGrid className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-sm font-display tracking-wider uppercase">
                      {group.category}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 bg-[#030712] border border-[#1E293B] px-2 py-0.5 rounded">
                    VOL: {group.total}
                  </span>
                </button>

                {!collapsed[group.category] && (
                  <div className="bg-[#030712]">
                    {group.subcategories.map((sub) => (
                      <div key={sub.subcategory} className="border-t border-[#1E293B]/50 first:border-0">
                        {/* Subcategory Header */}
                        <div className="px-4 py-2 bg-[#0A101F] flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-px h-3 bg-slate-600" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono">
                              {sub.subcategory}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-600 font-mono">[{sub.items.length}]</span>
                        </div>

                        {/* Data Rows */}
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm border-collapse">
                            <tbody>
                              {sub.items.map((item, idx) => (
                                <tr
                                  key={item.id}
                                  className="group border-t border-[#1E293B]/30 hover:bg-sky-500/5 transition-colors"
                                >
                                  <td className="px-4 py-2.5 w-32 whitespace-nowrap">
                                    <span className="inline-block bg-[#0A101F] border border-[#1E293B] text-sky-400 text-[10px] font-mono px-2 py-0.5 rounded shadow-[0_0_10px_rgba(14,165,233,0.05)] group-hover:border-sky-500/30 transition-colors">
                                      {item.code}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2.5 text-slate-300 font-medium font-display group-hover:text-white transition-colors">
                                    {item.name}
                                  </td>
                                  <td className="px-3 py-2.5 w-20 text-[10px] text-slate-500 font-mono uppercase text-center border-l border-[#1E293B]/30">
                                    {item.unit || '--'}
                                  </td>
                                  <td className="px-4 py-2.5 w-32 text-right font-mono text-emerald-400 whitespace-nowrap border-l border-[#1E293B]/30">
                                    {item.price != null ? (item.price === 0 ? <span className="text-slate-500 text-[10px]">TBD</span> : `$${item.price.toLocaleString('es-AR')}`) : '--'}
                                  </td>
                                  <td className="px-3 py-2.5 w-12 text-center border-l border-[#1E293B]/30">
                                    <button
                                      onClick={() => handleEdit(item)}
                                      className="text-slate-500 hover:text-sky-400 transition-colors p-1.5 rounded hover:bg-sky-500/10 opacity-0 group-hover:opacity-100"
                                    >
                                      <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
