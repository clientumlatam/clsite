import React, { useState } from 'react';
import { Lead } from '../types';
import { 
  FileText, MessageSquare, Check, Trash2, MapPin, 
  User, Phone, Sparkles, Plus, Compass, Search, 
  BadgePercent, AlertCircle, Copy, ArrowRight, ShieldCheck, X 
} from 'lucide-react';

interface CrmPipelineProps {
  leads: Lead[];
  onUpdateLead: (lead: Lead) => void;
  onAddLead: (lead: Lead) => void;
  onLog: (sender: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  onAgentWorking: (agentId: string, action: string, isWorking: boolean) => void;
}

const COLUMNS = [
  { id: 'pendiente' as const, label: 'Pendiente', color: 'border-slate-700 bg-slate-900/10 text-slate-400' },
  { id: 'contactado' as const, label: 'Contactado', color: 'border-blue-500/30 bg-blue-500/5 text-blue-400' },
  { id: 'caliente' as const, label: 'Caliente 🔥', color: 'border-rose-500/40 bg-rose-500/5 text-rose-400 animate-pulse-subtle' },
  { id: 'tibio' as const, label: 'Tibio ☕', color: 'border-amber-500/30 bg-amber-500/5 text-amber-400' },
  { id: 'frio' as const, label: 'Frío ❄️', color: 'border-slate-800 bg-slate-950 text-slate-500' },
  { id: 'agendado' as const, label: 'Agendado 📅', color: 'border-purple-500/40 bg-purple-500/5 text-purple-400' }
];

export default function CrmPipeline({ leads, onUpdateLead, onAddLead, onLog, onAgentWorking }: CrmPipelineProps) {
  // Modal states
  const [selectedLeadForBrochure, setSelectedLeadForBrochure] = useState<Lead | null>(null);
  const [brochureLoading, setBrochureLoading] = useState(false);
  const [activeBrochureText, setActiveBrochureText] = useState('');
  const [activeHookText, setActiveHookText] = useState('');

  const [selectedLeadForSanti, setSelectedLeadForSanti] = useState<Lead | null>(null);
  const [santiLoading, setSantiLoading] = useState(false);
  const [santiChatTranscript, setSantiChatTranscript] = useState('');

  const [selectedLeadForEnrich, setSelectedLeadForEnrich] = useState<Lead | null>(null);
  const [enriching, setEnriching] = useState(false);
  const [enrichedData, setEnrichedData] = useState<any>(null);

  // Scraper & Add form states
  const [showScraperControls, setShowScraperControls] = useState(false);
  const [scrapingCity, setScrapingCity] = useState('Neuquén');
  const [scrapingRubro, setScrapingRubro] = useState('Distribuidoras');
  const [scrapingProgress, setScrapingProgress] = useState<number | null>(null);

  const [showAddLeadForm, setShowAddLeadForm] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    companyName: '',
    industry: '',
    city: 'General Roca',
    contactName: '',
    contactPhone: '',
    painPoint: ''
  });

  // Handle Drag & Drop simulation directly via simple click selection / column movers
  const moveLead = (lead: Lead, newStatus: Lead['status']) => {
    const updated = { ...lead, status: newStatus, updatedAt: new Date().toISOString() };
    onUpdateLead(updated);
    onLog('CRM Pipeline', `Lead "${lead.companyName}" movido a columna: ${newStatus.toUpperCase()}`, 'info');
  };

  // 🏛️ Trigger Real Scraper simulation (Explorador Patagónico)
  const handleRunScraper = () => {
    if (!scrapingCity || !scrapingRubro) return;
    setScrapingProgress(10);
    onLog('Explorador Patagónico', `Iniciando rastreo de Google Maps en ${scrapingCity} para rubro: ${scrapingRubro}...`, 'info');
    onAgentWorking('explorador', `Scrapeando Google Places en ${scrapingCity}...`, true);

    const interval = setInterval(() => {
      setScrapingProgress(prev => {
        if (prev === null) return null;
        if (prev >= 100) {
          clearInterval(interval);
          onAgentWorking('explorador', 'Standby (escuchando)', false);
          
          // Generate 2 new leads based on input
          const id1 = `l-scraped-${Date.now()}-1`;
          const id2 = `l-scraped-${Date.now()}-2`;

          const lead1: Lead = {
            id: id1,
            companyName: `${scrapingRubro} Belgrano S.H.`,
            industry: `${scrapingRubro} / Comercio`,
            city: scrapingCity,
            address: `Calle Belgrano 250, ${scrapingCity}`,
            contactName: 'Facundo Belgrano',
            contactPhone: `+54 29${scrapingCity.toLowerCase().includes('roca') ? '8' : '9'} 489-0021`,
            contactRole: 'Socio',
            painPoint: `Atención demorada los fines de semana. Pierden tracción digital por no tener chatbot.`,
            fitScore: 8,
            amountArs: 180000,
            meddicScore: 35,
            status: 'pendiente',
            source: 'patagonia_explorer',
            notes: ['Prospecto ingresado automáticamente por el rastreador Explorador Patagónico. Fit Score calculado en 8/10.'],
            createdAt: new Date().toISOString()
          };

          const lead2: Lead = {
            id: id2,
            companyName: `Portal ${scrapingCity} Mayorista`,
            industry: `${scrapingRubro} / Distribución`,
            city: scrapingCity,
            address: `Ruta Principal Km 5, ${scrapingCity}`,
            contactName: 'Estela Portal',
            contactPhone: `+54 29${scrapingCity.toLowerCase().includes('roca') ? '8' : '9'} 477-8899`,
            contactRole: 'Gerente General',
            painPoint: `Necesita procesar pedidos de WhatsApp de más de 30 proveedores en tiempo récord sin retrasar los camiones de reparto.`,
            fitScore: 10,
            amountArs: 350000,
            meddicScore: 60,
            status: 'pendiente',
            source: 'patagonia_explorer',
            notes: ['Prospecto ingresado por el Explorador Patagónico. Fit Score crítico de 10/10 debido a alto dolor logístico.'],
            createdAt: new Date().toISOString()
          };

          onAddLead(lead1);
          onAddLead(lead2);

          onLog('Explorador Patagónico', `Rastreo completado. Encontrados y scored 2 prospectos calificados en ${scrapingCity}.`, 'success');
          setScrapingProgress(null);
          setShowScraperControls(false);
          return null;
        }
        return prev + 30;
      });
    }, 800);
  };

  // 🏛️ Trigger Brochure generation API
  const handleGenerateBrochure = async (lead: Lead) => {
    setSelectedLeadForBrochure(lead);
    setBrochureLoading(true);
    setActiveBrochureText('');
    setActiveHookText('');
    onLog('IA & Automatización', `Generando brochure personalizado para "${lead.companyName}" usando Gemini...`, 'info');
    onAgentWorking('ia_automatizacion', `Generando brochure para ${lead.companyName}...`, true);

    try {
      const res = await fetch('/api/leads/brochure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: lead.companyName,
          industry: lead.industry,
          city: lead.city,
          painPoint: lead.painPoint
        })
      });

      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      
      setActiveBrochureText(data.brochureText);
      setActiveHookText(data.hook);

      // Save to active lead
      const updated: Lead = {
        ...lead,
        brochureText: data.brochureText,
        hook: data.hook,
        notes: [...lead.notes, `Brochure comercial y MEDDIC Scoring generado de forma personalizada el ${new Date().toLocaleDateString('es-AR')}.`]
      };
      onUpdateLead(updated);

      onLog('IA & Automatización', `Brochure y gancho para "${lead.companyName}" creados con éxito.`, 'success');
    } catch (e) {
      onLog('IA & Automatización', 'Error de conexión con la API de brochures.', 'error');
    } finally {
      setBrochureLoading(false);
      onAgentWorking('ia_automatizacion', 'Standby (escuchando)', false);
    }
  };

  // 🏛️ Trigger WhatsApp Simulation
  const handleSimulateSantiChat = async (lead: Lead) => {
    setSelectedLeadForSanti(lead);
    setSantiLoading(true);
    setSantiChatTranscript('');
    onLog('Santi SDR', `Iniciando simulación de conversación de WhatsApp con ${lead.contactName}...`, 'info');
    onAgentWorking('santi_sdr', `Chateando con ${lead.contactName} (${lead.companyName})...`, true);

    try {
      const res = await fetch('/api/leads/santi-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: lead.companyName,
          contactName: lead.contactName || 'Propietario',
          industry: lead.industry,
          painPoint: lead.painPoint,
          status: lead.status === 'pendiente' ? 'caliente' : lead.status
        })
      });

      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      setSantiChatTranscript(data.transcript);
      onLog('Santi SDR', `Conversación clasificada exitosamente.`, 'success');
    } catch (e) {
      onLog('Santi SDR', 'Error de conexión con el simulador de chat.', 'error');
    } finally {
      setSantiLoading(false);
      onAgentWorking('santi_sdr', 'Standby (escuchando)', false);
    }
  };

  // 🏛️ Hunter.io Contact Enrichment simulation
  const handleRunEnrichment = (lead: Lead) => {
    setSelectedLeadForEnrich(lead);
    setEnriching(true);
    setEnrichedData(null);
    onLog('IA & Automatización', `Enriqueciendo datos corporativos de "${lead.companyName}" vía Hunter.io...`, 'info');
    onAgentWorking('ia_automatizacion', `Invocando Hunter.io API para ${lead.companyName}...`, true);

    setTimeout(() => {
      const emailDomain = lead.companyName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com.ar';
      const result = {
        domain: emailDomain,
        email: `${lead.contactName ? lead.contactName.toLowerCase().split(' ')[0] : 'contacto'}@${emailDomain}`,
        verification: 'deliverable',
        confidence: 96,
        sources: ['Google Places', 'Hunter Domain Search', 'LinkedIn Company Profiles'],
        alternativeContacts: [
          { name: 'Lic. Laura Gines', role: 'Gerente de Administración', email: `administracion@${emailDomain}` }
        ]
      };

      setEnrichedData(result);
      setEnriching(false);
      onAgentWorking('ia_automatizacion', 'Standby (escuchando)', false);

      const updated: Lead = {
        ...lead,
        notes: [
          ...lead.notes, 
          `Enriquecido por Hunter.io: Email corporativo validado (${result.email}) con 96% confianza.`
        ]
      };
      onUpdateLead(updated);

      onLog('IA & Automatización', `Enriquecimiento exitoso para "${lead.companyName}". Email validado: ${result.email}`, 'success');
    }, 1200);
  };

  // Create lead manually
  const handleCreateLeadManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.companyName || !newLeadForm.industry) return;

    const lead: Lead = {
      id: `l-manual-${Date.now()}`,
      companyName: newLeadForm.companyName,
      industry: newLeadForm.industry,
      city: newLeadForm.city,
      address: `Dirección Comercial, ${newLeadForm.city}`,
      contactName: newLeadForm.contactName || 'Dueño / Encargado',
      contactPhone: newLeadForm.contactPhone || '+54 298 451-0883',
      contactRole: 'Propietario',
      painPoint: newLeadForm.painPoint || 'Sin chatbot de WhatsApp activo. Pierden consultas los fines de semana.',
      fitScore: 7,
      amountArs: 180000,
      meddicScore: 30,
      status: 'pendiente',
      source: 'manual',
      notes: [`Lead ingresado de forma manual el ${new Date().toLocaleDateString('es-AR')}.`],
      createdAt: new Date().toISOString()
    };

    onAddLead(lead);
    setShowAddLeadForm(false);
    setNewLeadForm({
      companyName: '',
      industry: '',
      city: 'General Roca',
      contactName: '',
      contactPhone: '',
      painPoint: ''
    });
    onLog('CRM Pipeline', `Lead manual "${lead.companyName}" creado con éxito.`, 'success');
  };

  return (
    <div id="crm-pipeline-root" className="flex flex-col h-full bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden relative">
      
      {/* Controls Bar at top */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800/80 gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            CRM Kanban & Pipeline Comercial
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gestión comercial inteligente. Arrastrá leads, generá propuestas con IA y simulá el WhatsApp SDR.
          </p>
        </div>

        {/* Global Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Scraper button */}
          <button
            onClick={() => setShowScraperControls(prev => !prev)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-400 text-xs font-bold transition-all cursor-pointer"
          >
            <Compass className="h-3.5 w-3.5" />
            Rastrear Patagonia (Maps)
          </button>

          {/* Add lead button */}
          <button
            onClick={() => setShowAddLeadForm(prev => !prev)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Nuevo Lead
          </button>
        </div>
      </div>

      {/* Scraper controls collapse panel */}
      {showScraperControls && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in slide-in-from-top-3 duration-200">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-1">Ciudad Destino</label>
              <select 
                value={scrapingCity} 
                onChange={(e) => setScrapingCity(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-3 py-1.5 outline-none focus:border-emerald-500/40"
              >
                <option value="Neuquén">Neuquén Capital</option>
                <option value="General Roca">General Roca (Río Negro)</option>
                <option value="San Carlos de Bariloche">Bariloche</option>
                <option value="Cipolletti">Cipolletti</option>
                <option value="Viedma">Viedma (Costa Atlántica)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-1">Rubro Comercial</label>
              <select 
                value={scrapingRubro} 
                onChange={(e) => setScrapingRubro(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-3 py-1.5 outline-none focus:border-emerald-500/40"
              >
                <option value="Distribuidoras">Distribuidoras Mayoristas</option>
                <option value="Ferreterías">Ferreterías Industriales</option>
                <option value="Inmobiliarias">Inmobiliarias & Alquileres</option>
                <option value="Talleres">Talleres Mecánicos / Repuestos</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {scrapingProgress !== null ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-emerald-400 animate-pulse">Buscando... {scrapingProgress}%</span>
                <div className="h-2 w-24 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${scrapingProgress}%` }} />
                </div>
              </div>
            ) : (
              <button
                onClick={handleRunScraper}
                className="bg-emerald-500 text-slate-950 text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-400 transition-colors cursor-pointer"
              >
                Iniciar Scraper Patagónico
              </button>
            )}
          </div>
        </div>
      )}

      {/* Add lead manually form panel */}
      {showAddLeadForm && (
        <form onSubmit={handleCreateLeadManual} className="bg-slate-900 border border-slate-800 rounded-xl p-5 mt-4 space-y-4 animate-in slide-in-from-top-3 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-1">Nombre de la Empresa *</label>
              <input 
                type="text" 
                required
                placeholder="Ferretería El Tornillo" 
                value={newLeadForm.companyName}
                onChange={(e) => setNewLeadForm(prev => ({ ...prev, companyName: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-3 py-2 outline-none focus:border-emerald-500/40"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-1">Rubro / Industria *</label>
              <input 
                type="text" 
                required
                placeholder="Comercio Minorista / Metalúrgica" 
                value={newLeadForm.industry}
                onChange={(e) => setNewLeadForm(prev => ({ ...prev, industry: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-3 py-2 outline-none focus:border-emerald-500/40"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-1">Ciudad</label>
              <select 
                value={newLeadForm.city}
                onChange={(e) => setNewLeadForm(prev => ({ ...prev, city: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-3 py-2 outline-none focus:border-emerald-500/40"
              >
                <option value="General Roca">General Roca (Río Negro)</option>
                <option value="Neuquén">Neuquén Capital</option>
                <option value="San Carlos de Bariloche">Bariloche</option>
                <option value="Cipolletti">Cipolletti</option>
                <option value="Viedma">Viedma</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-1">Nombre del Contacto</label>
              <input 
                type="text" 
                placeholder="Juan Pérez" 
                value={newLeadForm.contactName}
                onChange={(e) => setNewLeadForm(prev => ({ ...prev, contactName: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-3 py-2 outline-none focus:border-emerald-500/40"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-1">Teléfono corporativo (WhatsApp)</label>
              <input 
                type="text" 
                placeholder="+54 298 456-7890" 
                value={newLeadForm.contactPhone}
                onChange={(e) => setNewLeadForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-3 py-2 outline-none focus:border-emerald-500/40"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-1">Dolor Detectado / Necesidad</label>
            <input 
              type="text" 
              placeholder="Ej. Satura el teléfono los lunes para recibir pedidos de preventistas." 
              value={newLeadForm.painPoint}
              onChange={(e) => setNewLeadForm(prev => ({ ...prev, painPoint: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-3 py-2 outline-none focus:border-emerald-500/40"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={() => setShowAddLeadForm(false)}
              className="text-xs text-slate-400 hover:text-white px-3 py-2 rounded-lg"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="bg-emerald-500 text-slate-950 text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-400 transition-colors"
            >
              Guardar en Kanban
            </button>
          </div>
        </form>
      )}

      {/* Kanban lanes list */}
      <div className="flex-1 overflow-x-auto mt-6 flex flex-row gap-4 pb-4 items-stretch scrollbar-thin scrollbar-thumb-slate-800 min-h-[500px]">
        {COLUMNS.map((col) => {
          const colLeads = leads.filter(l => l.status === col.id);

          return (
            <div 
              key={col.id} 
              className="flex flex-col w-72 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-4 shrink-0 flex-1 min-w-[280px]"
            >
              {/* Lane Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/50 mb-4">
                <span className="font-bold text-xs text-slate-200 tracking-tight">
                  {col.label}
                </span>
                <span className="text-[10px] font-mono bg-slate-950 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-md">
                  {colLeads.length}
                </span>
              </div>

              {/* Lane Cards Scrollable */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-950 max-h-[60vh]">
                {colLeads.map((lead) => (
                  <div 
                    key={lead.id}
                    id={`lead-card-${lead.id}`}
                    className="group bg-slate-900/90 border border-slate-800/60 rounded-xl p-4 hover:border-slate-700 hover:shadow-lg transition-all relative overflow-hidden"
                  >
                    {/* Badge and action row */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[9px] font-mono uppercase bg-slate-950 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                        {lead.city}
                      </span>
                      {/* Fit score badge */}
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        lead.fitScore >= 9 ? 'bg-emerald-500/15 text-emerald-400' :
                        lead.fitScore >= 7 ? 'bg-amber-500/15 text-amber-400' :
                        'bg-slate-800 text-slate-500'
                      }`}>
                        Fit: {lead.fitScore}/10
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-white tracking-tight mt-2 line-clamp-1 group-hover:text-amber-400 transition-colors">
                      {lead.companyName}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-sans mt-0.5 line-clamp-1">{lead.industry}</p>

                    {/* MEDDIC progress bar */}
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center justify-between text-[9px] font-mono text-slate-500">
                        <span>MEDDIC Score</span>
                        <span className="text-amber-500/90 font-bold">{lead.meddicScore}%</span>
                      </div>
                      <div className="h-1 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                        <div className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full" style={{ width: `${lead.meddicScore}%` }} />
                      </div>
                    </div>

                    {/* Quick Specs contact metadata */}
                    <div className="mt-3 pt-2.5 border-t border-slate-950 space-y-1 text-[10px] text-slate-400">
                      {lead.contactName && (
                        <div className="flex items-center gap-1.5">
                          <User className="h-3 w-3 text-slate-500 shrink-0" />
                          <span className="truncate">{lead.contactName} ({lead.contactRole || 'Propietario'})</span>
                        </div>
                      )}
                      {lead.contactPhone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3 w-3 text-slate-500 shrink-0" />
                          <span className="font-mono">{lead.contactPhone}</span>
                        </div>
                      )}
                    </div>

                    {/* Brochure & WhatsApp quick interaction icons */}
                    <div className="mt-4 pt-3 border-t border-slate-950 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        {/* Brochure Generator tool */}
                        <button
                          title="Ficha & Brochure Comercial"
                          onClick={() => handleGenerateBrochure(lead)}
                          className={`p-1.5 rounded-lg border text-xs cursor-pointer flex items-center justify-center transition-all ${
                            lead.brochureText 
                              ? 'bg-slate-950 border-emerald-500/30 text-emerald-400 hover:bg-slate-900' 
                              : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                          }`}
                        >
                          <FileText className="h-3.5 w-3.5" />
                        </button>

                        {/* WhatsApp Outbound Sim tool */}
                        <button
                          title="Simular Conversación SDR"
                          onClick={() => handleSimulateSantiChat(lead)}
                          className={`p-1.5 rounded-lg border text-xs cursor-pointer flex items-center justify-center transition-all bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300`}
                        >
                          <MessageSquare className="h-3.5 w-3.5 text-blue-400" />
                        </button>

                        {/* Hunter.io Enrichment tool */}
                        <button
                          title="Enriquecer con Hunter.io"
                          onClick={() => handleRunEnrichment(lead)}
                          className="p-1.5 rounded-lg border bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300 text-xs cursor-pointer flex items-center justify-center transition-all"
                        >
                          <Search className="h-3.5 w-3.5 text-purple-400" />
                        </button>
                      </div>

                      {/* Column quick move dropdown */}
                      <select
                        value={lead.status}
                        onChange={(e) => moveLead(lead, e.target.value as Lead['status'])}
                        className="bg-slate-950 border border-slate-900 text-[10px] text-slate-400 font-semibold rounded-lg px-2 py-1 outline-none cursor-pointer focus:border-slate-700"
                      >
                        <option value="pendiente">Mover a Pendiente</option>
                        <option value="contactado">Mover a Contactado</option>
                        <option value="caliente">Mover a Caliente</option>
                        <option value="tibio">Mover a Tibio</option>
                        <option value="frio">Mover a Frío</option>
                        <option value="agendado">Mover a Agendado</option>
                      </select>
                    </div>

                  </div>
                ))}

                {colLeads.length === 0 && (
                  <div className="h-24 bg-slate-900/10 border border-dashed border-slate-800/40 rounded-xl flex items-center justify-center text-center p-4">
                    <span className="text-[10px] text-slate-600 font-mono">Sin prospectos</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 🏛️ 1. Brochure Modal View */}
      {selectedLeadForBrochure && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-amber-500" />
                <div>
                  <h3 className="text-md font-bold text-white tracking-tight">Brochure Inteligente de Ventas</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedLeadForBrochure.companyName}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedLeadForBrochure(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[50vh] overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed font-sans scrollbar-thin scrollbar-thumb-slate-800">
              {brochureLoading ? (
                <div className="h-48 flex flex-col items-center justify-center text-center">
                  <span className="relative flex h-6 w-6 mb-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-6 w-6 bg-amber-500"></span>
                  </span>
                  <p className="text-slate-400 animate-pulse font-mono">Redactando brochure comercial altamente personalizado usando Gemini...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  
                  {/* Hook highlight */}
                  {activeHookText && (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 space-y-1">
                      <span className="text-[10px] text-amber-500 uppercase tracking-wider font-mono font-bold flex items-center gap-1.5">
                        <Sparkles className="h-3 w-3" />
                        Gancho Recomendado para Santi SDR (WhatsApp Opener):
                      </span>
                      <p className="text-xs text-slate-200 leading-normal italic font-sans">
                        "{activeHookText}"
                      </p>
                    </div>
                  )}

                  {/* Brochure text rendered Markdown-style */}
                  <div className="bg-slate-950/40 border border-slate-800/40 rounded-xl p-5 whitespace-pre-wrap font-sans text-xs">
                    {activeBrochureText}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-850 flex items-center justify-between text-xs text-slate-500 font-mono px-6">
              <span>Módulo: IA & Automatización</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(activeHookText);
                  onLog('CRM Pipeline', 'Gancho comercial copiado al portapapeles.', 'success');
                }}
                disabled={brochureLoading || !activeHookText}
                className="bg-slate-900 border border-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 disabled:opacity-40"
              >
                <Copy className="h-3.5 w-3.5" />
                Copiar Gancho
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 🏛️ 2. Santi SDR WhatsApp Conversation Modal View */}
      {selectedLeadForSanti && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center text-lg text-emerald-400">
                  🔥
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">Santi SDR Chat Log</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">WhatsApp con {selectedLeadForSanti.contactName}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedLeadForSanti(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Content - Chat Interface */}
            <div className="p-4 bg-slate-950 max-h-[50vh] overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-850">
              {santiLoading ? (
                <div className="h-48 flex flex-col items-center justify-center text-center">
                  <span className="relative flex h-5 w-5 mb-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-blue-500"></span>
                  </span>
                  <p className="text-xs text-slate-400 animate-pulse font-mono">Generando diálogo conversacional rioplatense...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {santiChatTranscript.split('\n\n').map((block, idx) => {
                    const isSanti = block.trim().startsWith('[Santi');
                    const textContent = block.replace(/^\[.*?\]:\s*/, '');
                    const speakerName = isSanti ? 'Santi SDR' : selectedLeadForSanti.contactName || 'Prospecto';

                    return (
                      <div 
                        key={idx} 
                        className={`flex flex-col max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                          isSanti 
                            ? 'bg-slate-900 border border-slate-850 text-slate-200 mr-auto rounded-tl-none' 
                            : 'bg-emerald-950/40 border border-emerald-900/40 text-emerald-100 ml-auto rounded-tr-none'
                        }`}
                      >
                        <span className={`text-[9px] uppercase font-bold tracking-wider font-mono mb-1 ${
                          isSanti ? 'text-amber-500' : 'text-emerald-400'
                        }`}>
                          {speakerName}
                        </span>
                        <p className="font-sans whitespace-pre-wrap">{textContent}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Actions for Conversation Approval */}
            <div className="p-4 bg-slate-900 border-t border-slate-850 flex flex-col gap-3">
              <span className="text-[10px] text-slate-400 font-mono tracking-wide text-center block">¿Qué acción querés que Santi realice en el CRM?</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    const updated: Lead = {
                      ...selectedLeadForSanti,
                      status: 'agendado',
                      notes: [...selectedLeadForSanti.notes, `Calificado y agendado para reunión presencial con Jonathan a raíz de conversación caliente en WhatsApp.`]
                    };
                    onUpdateLead(updated);
                    onLog('CRM Pipeline', `Reunión agendada para ${selectedLeadForSanti.companyName}. Movido a AGENDADO.`, 'success');
                    setSelectedLeadForSanti(null);
                  }}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Agendar / Cerrar
                </button>
                <button
                  onClick={() => {
                    const updated: Lead = {
                      ...selectedLeadForSanti,
                      status: 'frio',
                      notes: [...selectedLeadForSanti.notes, `Santi cerró conversación. Se marcó como FRÍO por falta de interés o presupuesto.`]
                    };
                    onUpdateLead(updated);
                    onLog('CRM Pipeline', `Lead ${selectedLeadForSanti.companyName} marcado como FRÍO.`, 'warning');
                    setSelectedLeadForSanti(null);
                  }}
                  className="bg-slate-950 border border-slate-800 text-slate-400 hover:text-white font-semibold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5 animate-pulse-subtle" />
                  Descartar (Frío)
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 🏛️ 3. Hunter.io Contact Enrichment Modal View */}
      {selectedLeadForEnrich && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 bg-slate-950 border-b border-slate-850 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-purple-400" />
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">Hunter.io Domain Enricher</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">{selectedLeadForEnrich.companyName}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedLeadForEnrich(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4">
              {enriching ? (
                <div className="h-36 flex flex-col items-center justify-center text-center">
                  <span className="relative flex h-5 w-5 mb-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-purple-500"></span>
                  </span>
                  <p className="text-xs text-slate-400 animate-pulse font-mono">Buscando patrones en directorios de Argentina...</p>
                </div>
              ) : enrichedData ? (
                <div className="space-y-4 text-xs">
                  {/* Verified Email Banner */}
                  <div className="bg-purple-950/30 border border-purple-500/20 rounded-xl p-4 flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-purple-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[9px] text-purple-400 uppercase font-mono font-bold tracking-wider">Email Corporativo Resuelto</span>
                      <p className="text-sm font-bold text-white font-mono mt-0.5">{enrichedData.email}</p>
                      <span className="text-[10px] text-emerald-400 font-semibold block mt-1">✓ Entregable (Confianza {enrichedData.confidence}%)</span>
                    </div>
                  </div>

                  {/* Domain lookup info */}
                  <div className="space-y-2">
                    <div className="flex justify-between border-b border-slate-850 pb-1.5">
                      <span className="text-slate-500 font-mono text-[10px]">Dominio Corporativo</span>
                      <span className="text-slate-300 font-mono">{enrichedData.domain}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-850 pb-1.5">
                      <span className="text-slate-500 font-mono text-[10px]">Contacto Alternativo</span>
                      <span className="text-slate-300">{enrichedData.alternativeContacts[0].name} ({enrichedData.alternativeContacts[0].role})</span>
                    </div>
                    <div className="flex justify-between pb-1.5">
                      <span className="text-slate-500 font-mono text-[10px]">Fuentes de Validación</span>
                      <span className="text-slate-300 text-right">{enrichedData.sources.join(', ')}</span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-850 flex items-center justify-end">
              <button
                onClick={() => setSelectedLeadForEnrich(null)}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cerrar Ficha
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
