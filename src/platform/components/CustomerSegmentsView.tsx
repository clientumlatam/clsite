// @ts-nocheck
import React, { useState } from 'react';
import {
  PieChart,
  Users,
  Plus,
  Search,
  Filter,
  DollarSign,
  Calendar,
  MessageSquare,
  Mail,
  Smartphone,
  PhoneCall,
  Globe,
  Tag,
  Download,
  Megaphone,
  UserCheck,
  Edit2,
  Trash2,
  Layers,
  Sparkles,
  CheckCircle2,
  X,
  ChevronRight,
  TrendingUp,
  BarChart3
} from 'lucide-react';

import {
  CustomerSegment,
  SegmentCriteria,
  Lead,
  CommunicationChannel,
  LeadStage,
  Agent
} from '../types';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart as RePieChart,
  Pie
} from 'recharts';

interface CustomerSegmentsViewProps {
  segments: CustomerSegment[];
  leads: Lead[];
  agents: Agent[];
  onCreateSegment: (segment: CustomerSegment) => void;
  onUpdateSegment: (segment: CustomerSegment) => void;
  onDeleteSegment: (segmentId: string) => void;
  onNavigateToBroadcast: (segmentName: string) => void;
  onOpenDelegateModal?: (item: { type: 'Follow-up Lead'; leadId?: string; leadName?: string }) => void;
}

export const CustomerSegmentsView: React.FC<CustomerSegmentsViewProps> = ({
  segments,
  leads,
  agents,
  onCreateSegment,
  onUpdateSegment,
  onDeleteSegment,
  onNavigateToBroadcast,
  onOpenDelegateModal
}) => {
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>(segments[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBuilderModal, setShowBuilderModal] = useState(false);
  const [editingSegment, setEditingSegment] = useState<CustomerSegment | null>(null);

  // Form state for Segment Builder
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formColor, setFormColor] = useState('emerald');
  const [minSpend, setMinSpend] = useState<number | ''>('');
  const [maxSpend, setMaxSpend] = useState<number | ''>('');
  const [lastPurchaseDays, setLastPurchaseDays] = useState<number>(30);
  const [lastPurchaseRelation, setLastPurchaseRelation] = useState<'within_days' | 'older_than_days' | 'any'>('within_days');
  const [selectedChannels, setSelectedChannels] = useState<CommunicationChannel[]>(['WhatsApp']);
  const [selectedStages, setSelectedStages] = useState<LeadStage[]>([]);
  const [minScore, setMinScore] = useState<number>(0);

  // Helper: evaluate if a lead matches a segment criteria
  const evaluateLeadMatch = (lead: Lead, criteria: SegmentCriteria): boolean => {
    // Total Amount Spent
    const leadSpent = lead.totalAmountSpent !== undefined ? lead.totalAmountSpent : lead.dealValue;
    if (criteria.minAmountSpent !== undefined && leadSpent < criteria.minAmountSpent) return false;
    if (criteria.maxAmountSpent !== undefined && leadSpent > criteria.maxAmountSpent) return false;

    // Communication Channel Preference
    if (criteria.channelPreferences && criteria.channelPreferences.length > 0) {
      const pref = lead.channelPreference || 'WhatsApp';
      if (!criteria.channelPreferences.includes(pref)) return false;
    }

    // Lead Stages
    if (criteria.leadStages && criteria.leadStages.length > 0) {
      if (!criteria.leadStages.includes(lead.stage)) return false;
    }

    // AI Intent Score
    if (criteria.minScore !== undefined && lead.score < criteria.minScore) return false;

    // Purchase Recency
    if (criteria.lastPurchaseDays && criteria.lastPurchaseRelation && criteria.lastPurchaseRelation !== 'any') {
      if (!lead.lastPurchaseDate) {
        if (criteria.lastPurchaseRelation === 'within_days') return false;
      } else {
        const purchaseDate = new Date(lead.lastPurchaseDate).getTime();
        const now = new Date('2026-07-31').getTime();
        const diffDays = Math.floor((now - purchaseDate) / (1000 * 3600 * 24));

        if (criteria.lastPurchaseRelation === 'within_days' && diffDays > criteria.lastPurchaseDays) return false;
        if (criteria.lastPurchaseRelation === 'older_than_days' && diffDays < criteria.lastPurchaseDays) return false;
      }
    }

    return true;
  };

  // Active segment calculation
  const activeSegment = segments.find((s) => s.id === selectedSegmentId) || segments[0];

  const matchingLeads = activeSegment
    ? leads.filter((l) => evaluateLeadMatch(l, activeSegment.criteria))
    : [];

  const totalSegmentValue = matchingLeads.reduce((acc, l) => acc + (l.totalAmountSpent || l.dealValue), 0);
  const avgSegmentValue = matchingLeads.length > 0 ? Math.round(totalSegmentValue / matchingLeads.length) : 0;

  // Filter segments list by search
  const filteredSegments = segments.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Open Modal for Create or Edit
  const handleOpenCreateModal = () => {
    setEditingSegment(null);
    setFormName('');
    setFormDescription('');
    setFormColor('emerald');
    setMinSpend('');
    setMaxSpend('');
    setLastPurchaseDays(30);
    setLastPurchaseRelation('within_days');
    setSelectedChannels(['WhatsApp']);
    setSelectedStages([]);
    setMinScore(0);
    setShowBuilderModal(true);
  };

  const handleOpenEditModal = (seg: CustomerSegment) => {
    setEditingSegment(seg);
    setFormName(seg.name);
    setFormDescription(seg.description);
    setFormColor(seg.color || 'emerald');
    setMinSpend(seg.criteria.minAmountSpent !== undefined ? seg.criteria.minAmountSpent : '');
    setMaxSpend(seg.criteria.maxAmountSpent !== undefined ? seg.criteria.maxAmountSpent : '');
    setLastPurchaseDays(seg.criteria.lastPurchaseDays || 30);
    setLastPurchaseRelation(seg.criteria.lastPurchaseRelation || 'within_days');
    setSelectedChannels(seg.criteria.channelPreferences || ['WhatsApp']);
    setSelectedStages(seg.criteria.leadStages || []);
    setMinScore(seg.criteria.minScore || 0);
    setShowBuilderModal(true);
  };

  const handleSaveSegment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const newCriteria: SegmentCriteria = {
      minAmountSpent: minSpend !== '' ? Number(minSpend) : undefined,
      maxAmountSpent: maxSpend !== '' ? Number(maxSpend) : undefined,
      lastPurchaseDays,
      lastPurchaseRelation,
      channelPreferences: selectedChannels,
      leadStages: selectedStages.length > 0 ? selectedStages : undefined,
      minScore: minScore > 0 ? minScore : undefined
    };

    const count = leads.filter((l) => evaluateLeadMatch(l, newCriteria)).length;

    if (editingSegment) {
      const updated: CustomerSegment = {
        ...editingSegment,
        name: formName,
        description: formDescription,
        color: formColor,
        criteria: newCriteria,
        updatedAt: new Date().toISOString().split('T')[0],
        contactCount: count
      };
      onUpdateSegment(updated);
    } else {
      const created: CustomerSegment = {
        id: `seg_${Date.now()}`,
        name: formName,
        description: formDescription,
        criteria: newCriteria,
        color: formColor,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        contactCount: count
      };
      onCreateSegment(created);
      setSelectedSegmentId(created.id);
    }

    setShowBuilderModal(false);
  };

  const handleToggleChannel = (ch: CommunicationChannel) => {
    if (selectedChannels.includes(ch)) {
      setSelectedChannels(selectedChannels.filter((c) => c !== ch));
    } else {
      setSelectedChannels([...selectedChannels, ch]);
    }
  };

  const handleToggleStage = (stg: LeadStage) => {
    if (selectedStages.includes(stg)) {
      setSelectedStages(selectedStages.filter((s) => s !== stg));
    } else {
      setSelectedStages([...selectedStages, stg]);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (matchingLeads.length === 0) return;
    const headers = ['ID', 'Nombre', 'Teléfono', 'Email', 'Empresa', 'Gasto Total', 'Etapa', 'Canal Preferido'];
    const rows = matchingLeads.map((l) => [
      l.id,
      `"${l.name}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      `"${l.company}"`,
      l.totalAmountSpent || l.dealValue,
      l.stage,
      l.channelPreference || 'WhatsApp'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Segmento_${activeSegment.name.replace(/\s+/g, '_')}_Contactos.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Channel Breakdown Chart Data
  const channelDistributionData = [
    { name: 'WhatsApp', count: matchingLeads.filter((l) => (l.channelPreference || 'WhatsApp') === 'WhatsApp').length, fill: '#16a34a' },
    { name: 'Email', count: matchingLeads.filter((l) => l.channelPreference === 'Email').length, fill: '#2563eb' },
    { name: 'SMS', count: matchingLeads.filter((l) => l.channelPreference === 'SMS').length, fill: '#d97706' },
    { name: 'Teléfono', count: matchingLeads.filter((l) => l.channelPreference === 'Phone').length, fill: '#9333ea' }
  ].filter((d) => d.count > 0);

  const getChannelIcon = (ch: CommunicationChannel) => {
    switch (ch) {
      case 'WhatsApp': return <MessageSquare className="w-3.5 h-3.5 text-green-600" />;
      case 'Email': return <Mail className="w-3.5 h-3.5 text-blue-600" />;
      case 'SMS': return <Smartphone className="w-3.5 h-3.5 text-amber-600" />;
      case 'Phone': return <PhoneCall className="w-3.5 h-3.5 text-purple-600" />;
      case 'Globe': return <Globe className="w-3.5 h-3.5 text-pink-600" />;
      default: return <Globe className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  const getBadgeColorClasses = (color: string) => {
    switch (color) {
      case 'emerald': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'blue': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'purple': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'amber': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'rose': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen p-4 lg:p-6 overflow-y-auto">
      {/* Top Banner Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-green-100 text-green-800 p-2 rounded-lg">
              <Layers className="w-6 h-6 text-green-700" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Segmentación Inteligente de Clientes</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Crea audiencias dinámicas basadas en monto de compra, fecha de última transacción y canal preferido para campañas de WABA.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition flex items-center space-x-2 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Nuevo Segmento</span>
        </button>
      </div>

      {/* Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Segmentos</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{segments.length}</p>
            <span className="text-[10px] text-green-600 font-medium">100% Reglas Activas</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
            <PieChart className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Contactos en Segmento Activo</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{matchingLeads.length}</p>
            <span className="text-[10px] text-blue-600 font-medium">Audienccia Calificada</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Valor Total del Segmento</p>
            <p className="text-2xl font-black text-emerald-700 mt-1">${totalSegmentValue.toLocaleString()}</p>
            <span className="text-[10px] text-slate-500">Monto LTV acumulado</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Promedio de Gasto / Lead</p>
            <p className="text-2xl font-black text-purple-700 mt-1">${avgSegmentValue.toLocaleString()}</p>
            <span className="text-[10px] text-purple-600 font-medium">Ticket Promedio Ticket</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Workspace Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Segment List & Rules Summary */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col h-[620px]">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center">
              <Filter className="w-4 h-4 mr-2 text-green-600" />
              Segmentos Guardados ({segments.length})
            </h2>
          </div>

          {/* Search box */}
          <div className="relative mb-3">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar segmento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-green-500 text-slate-800"
            />
          </div>

          {/* Segments Cards list */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredSegments.map((seg) => {
              const isSelected = seg.id === activeSegment?.id;
              const matchCount = leads.filter((l) => evaluateLeadMatch(l, seg.criteria)).length;

              return (
                <div
                  key={seg.id}
                  onClick={() => setSelectedSegmentId(seg.id)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer relative group ${
                    isSelected
                      ? 'bg-green-50/70 border-green-500 ring-1 ring-green-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${getBadgeColorClasses(seg.color)}`}>
                          {seg.name}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">{seg.description}</p>
                    </div>

                    <span className="bg-slate-900 text-white text-xs font-mono font-bold px-2.5 py-1 rounded-lg shrink-0">
                      {matchCount} leads
                    </span>
                  </div>

                  {/* Rules Pill Tags */}
                  <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap gap-1 text-[10px] text-slate-500">
                    {seg.criteria.minAmountSpent !== undefined && (
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-mono">
                        Min: ${seg.criteria.minAmountSpent.toLocaleString()}
                      </span>
                    )}
                    {seg.criteria.lastPurchaseDays && (
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-mono">
                        {seg.criteria.lastPurchaseRelation === 'within_days' ? 'Últimos' : 'Hace >'} {seg.criteria.lastPurchaseDays}d
                      </span>
                    )}
                    {seg.criteria.channelPreferences && seg.criteria.channelPreferences.length > 0 && (
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-mono">
                        Canal: {seg.criteria.channelPreferences.join(', ')}
                      </span>
                    )}
                  </div>

                  {/* Actions on hover */}
                  <div className="mt-2 flex items-center justify-end space-x-2 opacity-80 group-hover:opacity-100 transition">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditModal(seg);
                      }}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600 transition"
                      title="Editar Reglas"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {segments.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`¿Eliminar el segmento "${seg.name}"?`)) {
                            onDeleteSegment(seg.id);
                          }
                        }}
                        className="p-1 hover:bg-red-100 text-red-600 rounded transition"
                        title="Eliminar Segmento"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Active Segment Detail, Contact Table & Campaign Hub */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Segment Header Card */}
          {activeSegment && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center space-x-3">
                    <h2 className="text-lg font-bold text-slate-900">{activeSegment.name}</h2>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border uppercase ${getBadgeColorClasses(activeSegment.color)}`}>
                      Segmento Activo
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{activeSegment.description}</p>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => onNavigateToBroadcast(activeSegment.name)}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition flex items-center space-x-1.5 shadow-sm"
                  >
                    <Megaphone className="w-3.5 h-3.5" />
                    <span>Lanzar Campaña WABA</span>
                  </button>

                  <button
                    onClick={handleExportCSV}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-lg transition flex items-center space-x-1.5 border border-slate-200"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Exportar CSV</span>
                  </button>
                </div>
              </div>

              {/* Criteria Rules Summary Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-1">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium block uppercase">Gasto Mínimo / Máx</span>
                  <span className="text-xs font-bold text-slate-800 font-mono">
                    {activeSegment.criteria.minAmountSpent !== undefined ? `$${activeSegment.criteria.minAmountSpent}` : '$0'}
                    {' - '}
                    {activeSegment.criteria.maxAmountSpent !== undefined ? `$${activeSegment.criteria.maxAmountSpent}` : 'Sin límite'}
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium block uppercase">Fecha de Compra</span>
                  <span className="text-xs font-bold text-slate-800 font-mono">
                    {activeSegment.criteria.lastPurchaseDays
                      ? `${activeSegment.criteria.lastPurchaseRelation === 'within_days' ? 'Últimos' : 'Hace >'} ${activeSegment.criteria.lastPurchaseDays} días`
                      : 'Cualquier fecha'}
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium block uppercase">Canales Preferidos</span>
                  <div className="flex items-center space-x-1 mt-0.5">
                    {activeSegment.criteria.channelPreferences?.map((ch) => (
                      <span key={ch} className="inline-flex items-center text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded font-bold">
                        {getChannelIcon(ch)}
                        <span className="ml-1">{ch}</span>
                      </span>
                    )) || <span className="text-xs font-bold text-slate-800">Todos los canales</span>}
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium block uppercase">Etapas / Intención</span>
                  <span className="text-xs font-bold text-slate-800">
                    {activeSegment.criteria.leadStages ? activeSegment.criteria.leadStages.join(', ') : 'Todas las etapas'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Matching Contacts List Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
                <Users className="w-4 h-4 mr-2 text-green-600" />
                Contactos Pertenecientes al Segmento ({matchingLeads.length})
              </h3>

              <span className="text-[11px] text-slate-500 font-mono">
                Actualizado en tiempo real
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[10px] text-slate-500 uppercase font-bold tracking-wider border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Contacto / Empresa</th>
                    <th className="py-2.5 px-3">WhatsApp / Correo</th>
                    <th className="py-2.5 px-3">Gasto Acumulado</th>
                    <th className="py-2.5 px-3">Última Compra</th>
                    <th className="py-2.5 px-3">Canal Preferido</th>
                    <th className="py-2.5 px-3">Etapa CRM</th>
                    <th className="py-2.5 px-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {matchingLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50 transition">
                      <td className="py-2.5 px-3">
                        <div>
                          <p className="font-bold text-slate-900">{lead.name}</p>
                          <p className="text-[10px] text-slate-500">{lead.company}</p>
                        </div>
                      </td>

                      <td className="py-2.5 px-3 font-mono text-[11px]">
                        <p className="text-slate-800 font-semibold">{lead.phone}</p>
                        <p className="text-[10px] text-slate-400">{lead.email}</p>
                      </td>

                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">
                        ${(lead.totalAmountSpent || lead.dealValue).toLocaleString()}
                      </td>

                      <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                        {lead.lastPurchaseDate || 'Sin compras'}
                      </td>

                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                          {getChannelIcon(lead.channelPreference || 'WhatsApp')}
                          <span className="ml-1">{lead.channelPreference || 'WhatsApp'}</span>
                        </span>
                      </td>

                      <td className="py-2.5 px-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-50 text-green-700 border border-green-200">
                          {lead.stage}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => {
                            if (onOpenDelegateModal) {
                              onOpenDelegateModal({
                                type: 'Follow-up Lead',
                                leadId: lead.id,
                                leadName: lead.name
                              });
                            }
                          }}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded border border-slate-200 transition"
                        >
                          Delegar
                        </button>
                      </td>
                    </tr>
                  ))}

                  {matchingLeads.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-400 text-xs">
                        No hay contactos en la base que cumplan los criterios exactos de este segmento.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* SEGMENT BUILDER MODAL */}
      {showBuilderModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 border border-slate-200 shadow-xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="bg-green-100 text-green-700 p-2 rounded-lg">
                  <Layers className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingSegment ? 'Editar Segmento de Clientes' : 'Crear Nuevo Segmento de Clientes'}
                  </h3>
                  <p className="text-xs text-slate-500">Define los criterios cuantitativos y preferencias de contacto.</p>
                </div>
              </div>

              <button
                onClick={() => setShowBuilderModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSegment} className="space-y-4 mt-4 text-xs">
              {/* Segment Name & Color */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2 space-y-1">
                  <label className="font-bold text-slate-700">Nombre del Segmento *</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Compradores Frecuentes WhatsApp"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-green-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Etiqueta de Color</label>
                  <select
                    value={formColor}
                    onChange={(e) => setFormColor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-green-500"
                  >
                    <option value="emerald">Esmeralda (VIP)</option>
                    <option value="blue">Azul (Recientes)</option>
                    <option value="purple">Púrpura (Enterprise)</option>
                    <option value="amber">Ámbar (Inactivos)</option>
                    <option value="rose">Rosa (Atención)</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Descripción Breve</label>
                <input
                  type="text"
                  placeholder="Propósito comercial de esta audiencia..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-green-500"
                />
              </div>

              {/* CRITERIA SECTION 1: Total Amount Spent */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <p className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center">
                  <DollarSign className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  Monto Total Gastado (LTV acumulado)
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium">Gasto Mínimo ($ USD)</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={minSpend}
                      onChange={(e) => setMinSpend(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-slate-900"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 font-medium">Gasto Máximo ($ USD)</span>
                    <input
                      type="number"
                      placeholder="Sin límite"
                      value={maxSpend}
                      onChange={(e) => setMaxSpend(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* CRITERIA SECTION 2: Purchase Recency */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <p className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-blue-600" />
                  Antigüedad / Fecha de Última Compra
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium">Condición de Fecha</span>
                    <select
                      value={lastPurchaseRelation}
                      onChange={(e) => setLastPurchaseRelation(e.target.value as any)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-bold text-slate-900"
                    >
                      <option value="within_days">Compró dentro de los últimos X días</option>
                      <option value="older_than_days">Inactivo / Compra mayor a X días</option>
                      <option value="any">Cualquier fecha</option>
                    </select>
                  </div>

                  {lastPurchaseRelation !== 'any' && (
                    <div>
                      <span className="text-[10px] text-slate-500 font-medium">Cantidad de Días</span>
                      <input
                        type="number"
                        value={lastPurchaseDays}
                        onChange={(e) => setLastPurchaseDays(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-slate-900"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* CRITERIA SECTION 3: Communication Channel Preference */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <p className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center">
                  <MessageSquare className="w-3.5 h-3.5 mr-1 text-purple-600" />
                  Preferencia de Canal de Comunicación
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {(['WhatsApp', 'Email', 'SMS', 'Phone', 'Live Chat', 'Globe'] as CommunicationChannel[]).map((ch) => {
                    const isChecked = selectedChannels.includes(ch);
                    return (
                      <button
                        type="button"
                        key={ch}
                        onClick={() => handleToggleChannel(ch)}
                        className={`px-3 py-1.5 rounded-lg border font-bold text-xs flex items-center space-x-1.5 transition ${
                          isChecked
                            ? 'bg-green-600 text-white border-green-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {getChannelIcon(ch)}
                        <span>{ch}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CRITERIA SECTION 4: Lead Stages */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <p className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Etapas del CRM Incluidas
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'] as LeadStage[]).map((stg) => {
                    const isChecked = selectedStages.includes(stg);
                    return (
                      <button
                        type="button"
                        key={stg}
                        onClick={() => handleToggleStage(stg)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold border transition ${
                          isChecked
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {stg}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowBuilderModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 font-bold hover:bg-slate-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2 rounded-lg transition shadow-sm"
                >
                  {editingSegment ? 'Guardar Cambios' : 'Crear Segmento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
