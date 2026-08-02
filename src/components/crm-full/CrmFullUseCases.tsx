import React, { useMemo, useState } from 'react';
import { Blocks, Puzzle, CheckCircle2, ChevronDown, ChevronRight, Package } from 'lucide-react';
import { Product } from './crmTypes';
import { wordpressStack, minimumViableStack } from './crmWordpressStack';

interface Props {
  products: Product[];
}

export default function CrmFullUseCases({ products }: Props) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const countByCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of products) {
      if (p.active === false) continue;
      const cat = p.category || 'Sin categoría';
      map.set(cat, (map.get(cat) || 0) + 1);
    }
    return map;
  }, [products]);

  const toggle = (id: string) => setCollapsed((c) => ({ ...c, [id]: !c[id] }));

  const totalPlugins = wordpressStack.reduce((acc, area) => acc + area.plugins.length, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-1 flex items-center gap-2">
          <Blocks className="w-6 h-6 text-primary" />
          Caso de Uso: Stack WordPress para PyMEs
        </h1>
        <p className="text-muted-foreground">
          {wordpressStack.length} áreas · {totalPlugins} plugins recomendados, mapeados a las categorías del catálogo de
          servicios de Clientum
        </p>
      </div>

      {/* Stack mínimo viable */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
        <h2 className="text-sm font-bold text-emerald-900 flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-4 h-4" /> Stack mínimo viable para una PyME en Clientum
        </h2>
        <div className="flex flex-wrap gap-2">
          {minimumViableStack.map((item) => (
            <span
              key={item}
              className="text-xs font-semibold bg-white border border-emerald-300 text-emerald-800 px-2.5 py-1 rounded-full"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {wordpressStack.map((area) => {
          const matching = countByCategory.get(area.catalogCategory) || 0;
          const isCollapsed = collapsed[area.id];
          return (
            <div key={area.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => toggle(area.id)}
                className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-slate-800 text-white hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2 font-bold text-sm text-left">
                  {isCollapsed ? <ChevronRight className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                  <span className="text-base">{area.emoji}</span>
                  {area.title}
                </span>
                <span
                  className="shrink-0 flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-slate-300 bg-slate-900/50 px-2 py-0.5 rounded-full"
                  title={`Productos en catálogo bajo "${area.catalogCategory}"`}
                >
                  <Package className="w-3 h-3" />
                  {matching} en catálogo
                </span>
              </button>

              {!isCollapsed && (
                <div className="divide-y divide-slate-100">
                  {area.plugins.map((plugin) => (
                    <div key={plugin.name} className="px-4 py-2.5 flex items-start gap-2.5">
                      <Puzzle className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-slate-800 leading-snug">{plugin.name}</p>
                        <p className="text-xs text-muted-foreground leading-snug">{plugin.purpose}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
