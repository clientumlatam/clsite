import React, { useState } from 'react';
import { MapPin, Navigation, Star, Sparkles, Building2, Phone, Globe, Mail, MessageSquare, CheckCircle2, ChevronRight } from 'lucide-react';
import { ScrapedProspect } from '../services/prospectingService';

interface InteractiveProspectMapProps {
  prospects: ScrapedProspect[];
  selectedCity: string;
  radiusKm: string;
  onSelectProspect: (prospect: ScrapedProspect) => void;
  onEnrich: (id: string) => void;
  onOpenOutreach: (prospect: ScrapedProspect, channel: 'email' | 'whatsapp' | 'call') => void;
}

export function InteractiveProspectMap({
  prospects,
  selectedCity,
  radiusKm,
  onSelectProspect,
  onEnrich,
  onOpenOutreach
}: InteractiveProspectMapProps) {
  const [hoveredProspect, setHoveredProspect] = useState<ScrapedProspect | null>(null);
  const [activePin, setActivePin] = useState<ScrapedProspect | null>(prospects[0] || null);

  // Compute map bounding coordinates or relative offsets
  const baseLat = prospects.reduce((acc, p) => acc + (p.lat || -41.1335), 0) / (prospects.length || 1);
  const baseLng = prospects.reduce((acc, p) => acc + (p.lng || -71.3103), 0) / (prospects.length || 1);

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden text-white relative flex flex-col md:flex-row h-[520px]">
      {/* Map Canvas Visual Area */}
      <div className="flex-1 relative bg-slate-950 overflow-hidden flex items-center justify-center select-none">
        {/* Decorative Grid SVG background to simulate Google Maps vector view */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-60"></div>
        
        {/* Animated Map Radius Ring */}
        <div className="absolute w-[360px] h-[360px] rounded-full border border-indigo-500/30 bg-indigo-500/5 animate-pulse flex items-center justify-center pointer-events-none">
          <span className="text-[10px] font-bold tracking-widest text-indigo-400/60 uppercase bg-slate-900/80 px-2 py-1 rounded border border-indigo-500/20">
            Radio {radiusKm} KM ({selectedCity})
          </span>
        </div>

        {/* Map Center Marker */}
        <div className="absolute z-10 flex flex-col items-center pointer-events-none">
          <div className="w-4 h-4 bg-indigo-500 rounded-full border-2 border-white shadow-lg shadow-indigo-500/50 animate-ping absolute"></div>
          <div className="w-3 h-3 bg-indigo-600 rounded-full border border-white z-10"></div>
          <span className="text-[10px] font-bold text-slate-300 mt-1 bg-slate-900/90 px-2 py-0.5 rounded shadow-sm border border-slate-700">
            Centro de Búsqueda: {selectedCity}
          </span>
        </div>

        {/* Prospect Pins */}
        <div className="absolute inset-0 p-8 flex items-center justify-center">
          {prospects.map((p, idx) => {
            // Map relative lat/lng to percentage positioning
            const dLat = (p.lat || (baseLat + (idx - 2) * 0.01)) - baseLat;
            const dLng = (p.lng || (baseLng + (idx - 2) * 0.015)) - baseLng;
            
            // Constrain positioning inside 15% to 85% bounds
            const leftPercent = Math.max(15, Math.min(85, 50 + dLng * 2200));
            const topPercent = Math.max(15, Math.min(85, 50 - dLat * 2200));

            const isActive = activePin?.id === p.id;
            const isHovered = hoveredProspect?.id === p.id;

            return (
              <div
                key={p.id}
                style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-all duration-200"
                onClick={() => {
                  setActivePin(p);
                  onSelectProspect(p);
                }}
                onMouseEnter={() => setHoveredProspect(p)}
                onMouseLeave={() => setHoveredProspect(null)}
              >
                {/* Pin Tooltip on hover */}
                {(isHovered || isActive) && (
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-[11px] py-1.5 px-3 rounded-xl shadow-2xl border border-slate-700 whitespace-nowrap z-30 flex items-center gap-2 pointer-events-none">
                    <span className="font-bold text-indigo-300">{p.name}</span>
                    <span className="text-amber-400 font-bold flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400" /> {p.rating}
                    </span>
                  </div>
                )}

                {/* Pin Icon Container */}
                <div className={`p-2 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
                  isActive 
                    ? 'bg-indigo-600 ring-4 ring-indigo-400/40 scale-125 z-30' 
                    : p.enriched 
                    ? 'bg-emerald-600 hover:scale-110' 
                    : 'bg-slate-800 border border-slate-600 hover:bg-slate-700 hover:scale-110'
                }`}>
                  <Building2 className={`w-4 h-4 ${isActive || p.enriched ? 'text-white' : 'text-slate-300'}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Map Header Overlay */}
        <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-xs flex items-center gap-3 z-20">
          <Navigation className="w-4 h-4 text-indigo-400 animate-spin" />
          <div>
            <span className="font-bold text-slate-200 block">Vista Satelital & Mapas de Calor</span>
            <span className="text-[10px] text-slate-400">{prospects.length} marcadores activos en zona</span>
          </div>
        </div>
      </div>

      {/* Selected Pin Side Panel */}
      <div className="w-full md:w-80 bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 p-5 flex flex-col justify-between overflow-y-auto z-20">
        {activePin ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  {activePin.category}
                </span>
                <h3 className="text-sm font-bold text-white mt-1.5 leading-snug">{activePin.name}</h3>
                <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                  <span>{activePin.address}, {activePin.city}</span>
                </p>
              </div>
              <div className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 shrink-0">
                <Star className="w-3 h-3 fill-amber-400" />
                <span>{activePin.rating}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <Phone className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-mono text-[11px]">{activePin.phone}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                <span className="truncate text-[11px] text-indigo-300">{activePin.website}</span>
              </div>
            </div>

            {/* AI Enriched Details in Map Side Panel */}
            {activePin.enriched ? (
              <div className="bg-emerald-950/40 border border-emerald-800/50 p-3 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between text-emerald-400 font-bold text-[11px]">
                  <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> Datos Enriquecidos IA</span>
                  <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px]">ICP {activePin.fitScore}%</span>
                </div>
                <div className="text-slate-200 font-bold">{activePin.contactName}</div>
                <div className="text-[10px] text-slate-400">{activePin.email} • {activePin.whatsapp}</div>
                {activePin.painPoint && (
                  <p className="text-[11px] text-slate-300 italic bg-slate-950/60 p-2 rounded border border-slate-800/80">
                    "{activePin.painPoint}"
                  </p>
                )}
              </div>
            ) : (
              <button
                onClick={() => onEnrich(activePin.id)}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-indigo-600/30"
              >
                <Sparkles className="w-3.5 h-3.5" /> Enriquecer con IA
              </button>
            )}

            {/* Outreach Buttons */}
            {activePin.enriched && (
              <div className="space-y-2 pt-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Acciones Multicanal</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onOpenOutreach(activePin, 'email')}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded-xl text-[11px] flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
                  >
                    <Mail className="w-3 h-3 text-indigo-400" /> Email
                  </button>
                  <button
                    onClick={() => onOpenOutreach(activePin, 'whatsapp')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-[11px] flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <MessageSquare className="w-3 h-3" /> WhatsApp
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 text-xs">
            Haz clic en un marcador del mapa para inspeccionar los datos del establecimiento.
          </div>
        )}
      </div>
    </div>
  );
}
