import React, { useState, useEffect } from 'react';
import { 
  MapPin, Compass, Search, Sparkles, Mail, MessageSquare, Phone, Building2, Globe, 
  CheckCircle2, UserPlus, Filter, ExternalLink, Star, Map as MapIcon, Table, Grid, 
  Download, RefreshCw, Layers, ShieldCheck, ArrowRight, Copy, Check, Terminal, Share2
} from 'lucide-react';
import { addDeal } from '../store/sharedStore';
import { 
  searchGeolocatedProspects, 
  enrichProspectWithAI, 
  generateCustomOutreach,
  syncProspectToCloudDB,
  loadProspectsFromCloudDB,
  ScrapedProspect 
} from '../services/prospectingService';
import { InteractiveProspectMap } from './InteractiveProspectMap';

const PRESET_ZONES = [
  'General Roca, Río Negro',
  'San Carlos de Bariloche, Patagonia',
  'Neuquén Capital & Añelo (Oil & Gas)',
  'Cipolletti, Río Negro',
  'San Martín de los Andes, Neuquén',
  'Mendoza Capital & Valle de Uco',
  'Córdoba & Villa Carlos Paz',
  'Buenos Aires (CABA)',
  'Puerto Madryn, Chubut',
  'Salta Capital'
];

const PRESET_CATEGORIES = [
  'Comercios y Retail',
  'Salud',
  'Agroindustria',
  'Inmobiliaria',
  'Logística y Distribución',
  'Industrial y Manufactura',
  'Automotriz',
  'Medios',
  'Institucional',
  'Hoteles y Alojamientos',
  'Restaurantes y Gastronomía',
  'Bodegas y Viñedos',
  'Servicios de Oil & Gas'
];

export function GeolocatedProspectingTab() {
  const [searchCategory, setSearchCategory] = useState('Hoteles y Alojamientos');
  const [searchCity, setSearchCity] = useState('San Carlos de Bariloche, Patagonia');
  const [radiusKm, setRadiusKm] = useState('25');
  const [minRatingFilter, setMinRatingFilter] = useState('0');
  const [viewMode, setViewMode] = useState<'table' | 'map' | 'cards'>('table');
  
  const [scraping, setScraping] = useState(false);
  const [enrichingBatch, setEnrichingBatch] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  
  const [prospects, setProspects] = useState<ScrapedProspect[]>([]);
  const [cloudSynced, setCloudSynced] = useState(false);
  
  // Modal state
  const [selectedProspect, setSelectedProspect] = useState<ScrapedProspect | null>(null);
  const [outreachModal, setOutreachModal] = useState(false);
  const [outreachChannel, setOutreachChannel] = useState<'email' | 'whatsapp' | 'call'>('email');
  const [emailSubject, setEmailSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [generatingOutreach, setGeneratingOutreach] = useState(false);
  
  const [copiedText, setCopiedText] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Initial load from Database Cloud Sync or default dataset
  useEffect(() => {
    async function initData() {
      try {
        const saved = await loadProspectsFromCloudDB();
        if (saved && saved.length > 0) {
          setProspects(saved);
          setCloudSynced(true);
        } else {
          // Default initial set
          const initialData: ScrapedProspect[] = [
            {
              id: 'p_1',
              name: 'Llao Llao Resort, Golf & Spa',
              category: 'Hotel 5 Estrellas',
              address: 'Av. Ezequiel Bustillo Km 25',
              city: 'Bariloche',
              rating: 4.8,
              reviewsCount: 1420,
              phone: '+54 294 444-8500',
              website: 'www.llaollao.com',
              lat: -41.0558,
              lng: -71.5350,
              enriched: true,
              contactName: 'Gerardo Sotomayor',
              contactRole: 'Gerente Comercial',
              email: 'gsotomayor@llaollao.com.ar',
              whatsapp: '+54 9 294 455-1234',
              fitScore: 96,
              painPoint: 'Tardanza en respuesta de reservas fuera de horario comercial. Automatizar WhatsApp elevaría reservas directas un 35%.',
              outreachSent: false
            },
            {
              id: 'p_2',
              name: 'Hostería Patagónica Del Sur',
              category: 'Hotel Boutique',
              address: 'San Martín 420',
              city: 'Bariloche',
              rating: 4.6,
              reviewsCount: 380,
              phone: '+54 294 442-1920',
              website: 'www.patagoniasur.tur.ar',
              lat: -41.1340,
              lng: -71.3090,
              enriched: true,
              contactName: 'Carla Mendez',
              contactRole: 'Propietaria & Directora',
              email: 'reservas@patagoniasur.tur.ar',
              whatsapp: '+54 9 294 488-9900',
              fitScore: 89,
              painPoint: 'Gestión manual de reservas y cancelaciones por correo.',
              outreachSent: true
            },
            {
              id: 'p_3',
              name: 'Cabañas & SPA Bosque Andino',
              category: 'Alojamiento Turístico',
              address: 'Ruta 77 Km 3',
              city: 'Bariloche',
              rating: 4.5,
              reviewsCount: 210,
              phone: '+54 294 446-3311',
              website: 'www.bosqueandino.com',
              lat: -41.1200,
              lng: -71.3200,
              enriched: false
            }
          ];
          setProspects(initialData);
        }
      } catch (e) {
        console.warn("Cloud DB initial load catch:", e);
      }
    }
    initData();
  }, []);

  const handleStartScraping = async () => {
    setScraping(true);
    setTerminalLogs([]);
    const addLog = (msg: string) => setTerminalLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);

    addLog(`Iniciando motor de extracción geolocalizado en Google Maps...`);
    try {
      const results = await searchGeolocatedProspects(searchCity, searchCategory, radiusKm, addLog);
      
      // Merge with existing avoiding duplicate IDs
      const updatedList = [...results, ...prospects.filter(p => !results.some(r => r.name === p.name))];
      setProspects(updatedList);

      // Sync new results to Cloud DB
      for (const p of results) {
        await syncProspectToCloudDB(p);
      }
      setCloudSynced(true);

      setSuccessMsg(`¡Prospección geolocalizada completada! Se encontraron y guardaron ${results.length} establecimientos en la Base de Datos.`);
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      addLog(`Error durante el scraping: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setScraping(false);
    }
  };

  const handleEnrichProspect = async (id: string) => {
    const target = prospects.find(p => p.id === id);
    if (!target) return;

    const enriched = await enrichProspectWithAI(target);
    const updated = prospects.map(p => p.id === id ? enriched : p);
    setProspects(updated);
    await syncProspectToCloudDB(enriched);

    setSuccessMsg(`¡Prospecto "${target.name}" enriquecido con IA y sincronizado!`);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleEnrichAllBatch = async () => {
    const unenriched = prospects.filter(p => !p.enriched);
    if (unenriched.length === 0) {
      setSuccessMsg("Todos los prospectos actuales ya están enriquecidos con IA.");
      setTimeout(() => setSuccessMsg(''), 3000);
      return;
    }

    setEnrichingBatch(true);
    let count = 0;
    let currentList = [...prospects];

    for (const p of unenriched) {
      const enriched = await enrichProspectWithAI(p);
      currentList = currentList.map(item => item.id === p.id ? enriched : item);
      setProspects(currentList);
      await syncProspectToCloudDB(enriched);
      count++;
    }

    setEnrichingBatch(false);
    setSuccessMsg(`¡Sincronización completada! ${count} prospectos enriquecidos con datos de contacto e IA.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleOpenOutreach = async (p: ScrapedProspect, channel: 'email' | 'whatsapp' | 'call') => {
    setSelectedProspect(p);
    setOutreachChannel(channel);
    setGeneratingOutreach(true);
    setOutreachModal(true);

    try {
      const copy = await generateCustomOutreach(p, channel);
      setEmailSubject(copy.subject || `Propuesta Comercial para ${p.name}`);
      setMessageBody(copy.body);
    } catch (e) {
      console.warn("Outreach generation error:", e);
    } finally {
      setGeneratingOutreach(false);
    }
  };

  const handleSendOutreach = async () => {
    if (!selectedProspect) return;

    // Update prospect outreach state
    const updatedProspect: ScrapedProspect = { ...selectedProspect, outreachSent: true };
    const newList = prospects.map(p => p.id === selectedProspect.id ? updatedProspect : p);
    setProspects(newList);
    await syncProspectToCloudDB(updatedProspect);

    // Auto-register in CRM Deals pipeline
    addDeal({
      company: selectedProspect.name,
      contactName: selectedProspect.contactName || 'Contacto Comercial',
      email: selectedProspect.email || 'contacto@empresa.com',
      phone: selectedProspect.whatsapp || selectedProspect.phone,
      amount: 180000,
      stage: 'leads',
      industry: selectedProspect.category,
      painPoint: `[Maps Prospect] ${selectedProspect.painPoint || 'Contacto multicanal realizado'}`
    });

    if (outreachChannel === 'whatsapp' && selectedProspect.whatsapp) {
      const cleanPhone = selectedProspect.whatsapp.replace(/[^0-9]/g, '');
      const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageBody)}`;
      window.open(waUrl, '_blank');
    }

    setOutreachModal(false);
    setSuccessMsg(`¡Acción registrada! Lead enviado a CRM Pipeline y canal ${outreachChannel.toUpperCase()}.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(messageBody);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleExportCSV = () => {
    const headers = ["Nombre", "Categoria", "Ciudad", "Direccion", "Telefono", "Website", "Rating", "Contacto", "Email", "WhatsApp", "FitScore", "DolorIA"];
    const rows = prospects.map(p => [
      `"${p.name}"`, `"${p.category}"`, `"${p.city}"`, `"${p.address}"`, `"${p.phone}"`, `"${p.website}"`, p.rating,
      `"${p.contactName || ''}"`, `"${p.email || ''}"`, `"${p.whatsapp || ''}"`, p.fitScore || 0, `"${(p.painPoint || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Prospectos_Geolocalizados_${searchCity.replace(/[^a-z]/gi, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredProspects = prospects.filter(p => {
    if (minRatingFilter === '4.5') return p.rating >= 4.5;
    if (minRatingFilter === '4.8') return p.rating >= 4.8;
    return true;
  });

  const enrichedCount = prospects.filter(p => p.enriched).length;
  const contactedCount = prospects.filter(p => p.outreachSent).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/30">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Prospección Geolocalizada (Google Maps & Scraping)</h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Database Cloud Sync
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Busca negocios por zona en Google Maps, extrae teléfonos y páginas web, enriquece perfiles con IA y ejecuta outreach multicanal
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleEnrichAllBatch}
            disabled={enrichingBatch || prospects.length === 0}
            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {enrichingBatch ? <div className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Enriquecer Lote con IA ({prospects.length - enrichedCount})</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Exportar CSV
          </button>
        </div>
      </div>

      {/* Stats Quick Counter */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Total Negocios Extraídos</span>
            <div className="text-xl font-extrabold text-slate-900 mt-0.5">{prospects.length}</div>
          </div>
          <Building2 className="w-8 h-8 text-indigo-500/30" />
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Enriquecidos con IA</span>
            <div className="text-xl font-extrabold text-indigo-600 mt-0.5">{enrichedCount}</div>
          </div>
          <Sparkles className="w-8 h-8 text-indigo-500/30" />
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Outreach Registrado</span>
            <div className="text-xl font-extrabold text-emerald-600 mt-0.5">{contactedCount}</div>
          </div>
          <MessageSquare className="w-8 h-8 text-emerald-500/30" />
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Calificación Promedio</span>
            <div className="text-xl font-extrabold text-amber-600 mt-0.5 flex items-center gap-1">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span>
                {prospects.length ? (prospects.reduce((acc, p) => acc + p.rating, 0) / prospects.length).toFixed(1) : '4.7'}
              </span>
            </div>
          </div>
          <Star className="w-8 h-8 text-amber-500/20" />
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Search Controls & Presets */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Categoría o Nicho Comercial</label>
            <input
              type="text"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              placeholder="Ej. Hoteles, Bodegas, Oil & Gas..."
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Ciudad o Zona objetivo</label>
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Ej. Bariloche, Neuquén, Mendoza..."
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Radio de Búsqueda</label>
            <select
              value={radiusKm}
              onChange={(e) => setRadiusKm(e.target.value)}
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
            >
              <option value="10">10 km a la redonda</option>
              <option value="25">25 km a la redonda</option>
              <option value="50">50 km a la redonda</option>
              <option value="100">100 km (Regional)</option>
            </select>
          </div>

          <button
            onClick={handleStartScraping}
            disabled={scraping}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 px-6 rounded-xl transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {scraping ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Search className="w-4 h-4" />}
            <span>{scraping ? 'Scrapeando Maps...' : 'Buscar y Extraer de Maps'}</span>
          </button>
        </div>

        {/* Quick Presets */}
        <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Zonas sugeridas:</span>
            {PRESET_ZONES.map((zone, idx) => (
              <button
                key={idx}
                onClick={() => setSearchCity(zone)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                  searchCity === zone 
                    ? 'bg-indigo-600 text-white font-bold' 
                    : 'bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600'
                }`}
              >
                {zone.split(',')[0]}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100/80">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Rubros / Industrias:</span>
            {PRESET_CATEGORIES.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setSearchCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                  searchCategory === cat 
                    ? 'bg-indigo-600 text-white font-bold' 
                    : 'bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Scraping Terminal Logs */}
      {terminalLogs.length > 0 && (
        <div className="bg-slate-950 text-emerald-400 p-4 rounded-2xl border border-slate-800 font-mono text-[11px] space-y-1 shadow-inner">
          <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-800 pb-1 mb-2">
            <Terminal className="w-3.5 h-3.5 text-emerald-500" /> Live Scraping Engine Terminal Status
          </div>
          {terminalLogs.slice(-4).map((log, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-slate-600">&gt;</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      )}

      {/* View Toolbar & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-700">Filtros:</span>
          <select
            value={minRatingFilter}
            onChange={(e) => setMinRatingFilter(e.target.value)}
            className="text-xs p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
          >
            <option value="0">Todas las calificaciones</option>
            <option value="4.5">★ 4.5 o superior</option>
            <option value="4.8">★ 4.8 o superior (Top)</option>
          </select>
        </div>

        {/* View Switcher Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'table' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table className="w-3.5 h-3.5" /> Tabla
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'cards' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5" /> Tarjetas
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'map' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" /> Mapa Interactivo
          </button>
        </div>
      </div>

      {/* Main Results Container */}
      {viewMode === 'map' ? (
        <InteractiveProspectMap
          prospects={filteredProspects}
          selectedCity={searchCity}
          radiusKm={radiusKm}
          onSelectProspect={(p) => setSelectedProspect(p)}
          onEnrich={handleEnrichProspect}
          onOpenOutreach={handleOpenOutreach}
        />
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProspects.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-indigo-300 transition-all">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {p.category}
                  </span>
                  <div className="flex items-center gap-1 font-bold text-amber-600 text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{p.rating}</span>
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mt-2">{p.name}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{p.address}, {p.city}</span>
                </p>

                <div className="mt-3 space-y-1 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {p.phone}</div>
                  <div className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-slate-400" /> {p.website}</div>
                </div>

                {p.enriched && (
                  <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-xs">
                    <div className="font-bold text-slate-800">{p.contactName} ({p.contactRole || 'Contacto'})</div>
                    <div className="text-[10px] text-indigo-600">{p.email}</div>
                    <div className="text-[10px] text-emerald-600">{p.whatsapp}</div>
                    {p.painPoint && (
                      <p className="text-[10px] text-slate-500 italic mt-1 border-t border-slate-200/60 pt-1">
                        "{p.painPoint}"
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                {p.enriched ? (
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={() => handleOpenOutreach(p, 'email')}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Mail className="w-3 h-3" /> Email
                    </button>
                    <button
                      onClick={() => handleOpenOutreach(p, 'whatsapp')}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <MessageSquare className="w-3 h-3" /> WhatsApp
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEnrichProspect(p.id)}
                    className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Enriquecer Perfil con IA
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900">Negocios Extraídos de Google Maps ({filteredProspects.length})</h3>
            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100">
              Extracción Directa Activa
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold">
                  <th className="p-4">Establecimiento</th>
                  <th className="p-4">Ubicación Físico-Digital</th>
                  <th className="p-4">Calificación</th>
                  <th className="p-4">Enriquecimiento IA (Contactos)</th>
                  <th className="p-4 text-right">Outreach Multicanal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProspects.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span>{p.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{p.category} • {p.phone}</div>
                    </td>

                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{p.address}, {p.city}</span>
                      </div>
                      <a 
                        href={`https://${p.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] text-indigo-600 hover:underline flex items-center gap-0.5 mt-0.5"
                      >
                        <Globe className="w-3 h-3" /> {p.website}
                      </a>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1 font-bold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{p.rating}</span>
                        <span className="text-slate-400 font-normal text-[10px]">({p.reviewsCount})</span>
                      </div>
                    </td>

                    <td className="p-4">
                      {p.enriched ? (
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-800">{p.contactName} ({p.contactRole || 'Contacto'})</div>
                          <div className="text-[10px] text-indigo-600">{p.email} • {p.whatsapp}</div>
                          <div className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Afinidad ICP: {p.fitScore}%
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEnrichProspect(p.id)}
                          className="inline-flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-3 py-1.5 rounded-lg text-[11px] transition-all cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3" /> Enriquecer con IA
                        </button>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      {p.enriched ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenOutreach(p, 'email')}
                            className="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-xs"
                            title="Enviar Email de Outreach"
                          >
                            <Mail className="w-3 h-3" /> Email
                          </button>
                          <button
                            onClick={() => handleOpenOutreach(p, 'whatsapp')}
                            className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-xs"
                            title="Abrir y enviar WhatsApp"
                          >
                            <MessageSquare className="w-3 h-3" /> WhatsApp
                          </button>
                          {p.outreachSent && (
                            <span className="text-emerald-600 font-bold text-[10px] ml-1">✓ Enviado</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[10px] italic">Enriquece primero</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Multichannel Outreach Modal */}
      {outreachModal && selectedProspect && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {outreachChannel === 'email' ? 'Enviar Email de Outreach (IA)' : outreachChannel === 'whatsapp' ? 'Enviar WhatsApp de Outreach (IA)' : 'Script de Llamada Fría (SDR)'}
                </h3>
                <p className="text-xs text-slate-500">Destinatario: {selectedProspect.contactName} ({selectedProspect.name} - {selectedProspect.city})</p>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${outreachChannel === 'email' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'}`}>
                {outreachChannel === 'email' ? selectedProspect.email : selectedProspect.whatsapp}
              </span>
            </div>

            {/* Channel Switcher Inside Modal */}
            <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold gap-1">
              <button
                type="button"
                onClick={() => handleOpenOutreach(selectedProspect, 'email')}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${outreachChannel === 'email' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'}`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => handleOpenOutreach(selectedProspect, 'whatsapp')}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${outreachChannel === 'whatsapp' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600'}`}
              >
                WhatsApp Directo
              </button>
              <button
                type="button"
                onClick={() => handleOpenOutreach(selectedProspect, 'call')}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${outreachChannel === 'call' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
              >
                Script Llamada (30s)
              </button>
            </div>

            {generatingOutreach ? (
              <div className="py-12 flex flex-col items-center justify-center text-xs text-slate-500 space-y-2">
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Redactando propuesta comercial personalizada con Gemini IA...</span>
              </div>
            ) : (
              <div className="space-y-3">
                {outreachChannel === 'email' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Asunto del Email</label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-slate-700">Mensaje Personalizado (Generado por Gemini IA)</label>
                    <button
                      type="button"
                      onClick={handleCopyText}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedText ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedText ? 'Copiado' : 'Copiar Texto'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={7}
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono resize-none bg-slate-50/50"
                  />
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400">
                    Al confirmar, se registrará la interacción y se creará el trato en el CRM.
                  </span>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setOutreachModal(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleSendOutreach}
                      className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md cursor-pointer flex items-center gap-1.5 ${
                        outreachChannel === 'email' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-emerald-600 hover:bg-emerald-700'
                      }`}
                    >
                      <span>{outreachChannel === 'whatsapp' ? 'Abrir WhatsApp Web & Registrar' : 'Registrar Outreach & CRM'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
