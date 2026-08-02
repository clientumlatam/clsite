import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  Phone,
  Mail,
  Building2,
  DollarSign,
  Tag,
  MessageSquare,
  Edit2,
  Trash2,
  Eye,
  Check,
  X,
  Send,
  Sparkles,
  Paperclip,
  FileText,
  MapPin,
  ChevronDown,
  UserCheck,
  LayoutGrid,
  List,
  ArrowUpDown,
  Download,
  AlertTriangle
} from 'lucide-react';

import {
  Lead,
  Agent,
  LeadStage,
  Conversation,
  WhatsAppMessage,
  WhatsAppTemplate
} from '../types';

interface ContactsViewProps {
  leads: Lead[];
  agents: Agent[];
  conversations: Conversation[];
  messages: Record<string, WhatsAppMessage[]>;
  templates: WhatsAppTemplate[];
  currentAgent: Agent;
  onUpdateLeadStage: (leadId: string, stage: LeadStage) => void;
  onAssignAgent: (leadId: string, agentId: string) => void;
  onSelectLeadForChat: (leadId: string) => void;
  onCreateContact: (contactData: Partial<Lead>) => void;
  onEditContact: (leadId: string, updatedData: Partial<Lead>) => void;
  onDeleteContact: (leadId: string) => void;
  onSendMessage: (convId: string, text: string, isNote?: boolean, templateName?: string) => void;
}

const LeadScoreBar: React.FC<{ score: number; showLabel?: boolean }> = ({ score, showLabel = true }) => {
  const getScoreConfig = (s: number) => {
    if (s >= 80) {
      return {
        label: 'Alta Prioridad',
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        barColor: 'bg-emerald-500',
        icon: '⚡'
      };
    }
    if (s >= 50) {
      return {
        label: 'Media Prioridad',
        badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
        barColor: 'bg-amber-500',
        icon: '🔥'
      };
    }
    return {
      label: 'Baja Prioridad',
      badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
      barColor: 'bg-slate-400',
      icon: '❄️'
    };
  };

  const config = getScoreConfig(score);

  return (
    <div className="space-y-1">
      {showLabel && (
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <span>Lead Score</span>
          </span>
          <span className={`font-bold px-1.5 py-0.2 rounded border text-[9px] ${config.badgeBg}`}>
            {config.icon} {score}/100 ({config.label})
          </span>
        </div>
      )}
      <div className="w-full bg-slate-100 border border-slate-200/80 h-2 rounded-full overflow-hidden p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-500 ${config.barColor}`}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        ></div>
      </div>
    </div>
  );
};

export const ContactsView: React.FC<ContactsViewProps> = ({
  leads,
  agents,
  conversations,
  messages,
  templates,
  currentAgent,
  onUpdateLeadStage,
  onAssignAgent,
  onSelectLeadForChat,
  onCreateContact,
  onEditContact,
  onDeleteContact,
  onSendMessage
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const [viewStyle, setViewStyle] = useState<'grid' | 'table'>('grid');

  // Drawer / Modals State
  const [selectedContact, setSelectedContact] = useState<Lead | null>(null);
  const [activeDrawerTab, setActiveDrawerTab] = useState<'chat' | 'details' | 'notes' | 'enrichment'>('chat');
  const [drawerChatInput, setDrawerChatInput] = useState('');
  const [drawerIsNote, setDrawerIsNote] = useState(false);
  const [drawerShowTemplates, setDrawerShowTemplates] = useState(false);

  // Create / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    dealValue: 5000,
    stage: 'New' as LeadStage,
    source: 'WhatsApp' as Lead['source'],
    assignedAgentId: currentAgent.id,
    city: 'Buenos Aires',
    tagsStr: 'Cliente, WABA',
    notes: ''
  });

  // Delete Confirmation Modal
  const [contactToDelete, setContactToDelete] = useState<Lead | null>(null);

  // Enrichment Loading State
  const [isEnriching, setIsEnriching] = useState(false);

  const handleEnrichLead = () => {
    if (!selectedContact) return;
    setIsEnriching(true);
    
    // Simulate AI Enrichment API Call
    setTimeout(() => {
      const newLog = {
        timestamp: new Date().toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' }),
        sector: selectedContact.company?.toLowerCase().includes('tech') ? 'Tecnología & Software' : 'Retail & Servicios B2B',
        employeeCount: Math.random() > 0.5 ? '10-50' : '50-200',
        annualRevenue: Math.random() > 0.5 ? 'USD $50K - $250K' : 'USD $1M - $5M',
        technologies: ['WhatsApp Business API', 'Meta Ads', 'React', 'Google Cloud'].sort(() => 0.5 - Math.random()).slice(0, 3)
      };
      
      const updatedHistory = [newLog, ...(selectedContact.enrichmentHistory || [])];
      
      setSelectedContact({
        ...selectedContact,
        enrichmentHistory: updatedHistory
      });
      
      onEditContact(selectedContact.id, {
        enrichmentHistory: updatedHistory
      });
      
      setIsEnriching(false);
    }, 1200);
  };

  // Bulk selection state
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);

  const handleToggleSelectLead = (leadId: string, e?: React.MouseEvent | React.ChangeEvent<HTMLInputElement>) => {
    if (e) e.stopPropagation();
    setSelectedLeadIds((prev) =>
      prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]
    );
  };

  const handleSelectAllLeads = () => {
    if (selectedLeadIds.length === filteredContacts.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(filteredContacts.map((c) => c.id));
    }
  };

  const handleBulkChangeStage = (stage: LeadStage) => {
    selectedLeadIds.forEach((id) => {
      onUpdateLeadStage(id, stage);
    });
  };

  const handleBulkAssignAgent = (agentId: string) => {
    selectedLeadIds.forEach((id) => {
      onAssignAgent(id, agentId);
    });
  };

  const handleBulkDelete = () => {
    if (window.confirm(`¿Estás seguro de eliminar los ${selectedLeadIds.length} contactos seleccionados?`)) {
      selectedLeadIds.forEach((id) => {
        onDeleteContact(id);
      });
      setSelectedLeadIds([]);
    }
  };

  // Filter Contacts Logic
  const filteredContacts = leads.filter((contact) => {
    if (selectedStage !== 'all' && contact.stage !== selectedStage) return false;
    if (selectedSource !== 'all' && contact.source !== selectedSource) return false;
    if (selectedAgent !== 'all' && contact.assignedAgentId !== selectedAgent) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = contact.name.toLowerCase().includes(q);
      const matchPhone = contact.phone.toLowerCase().includes(q);
      const matchEmail = contact.email.toLowerCase().includes(q);
      const matchCompany = contact.company.toLowerCase().includes(q);
      const matchTags = contact.tags.some((t) => t.toLowerCase().includes(q));
      return matchName || matchPhone || matchEmail || matchCompany || matchTags;
    }

    return true;
  });

  // Calculate stats
  const totalContacts = leads.length;
  const totalPipelineValue = leads.reduce((sum, l) => sum + l.dealValue, 0);
  const qualifiedCount = leads.filter((l) => l.stage === 'Qualified' || l.stage === 'Proposal' || l.stage === 'Won').length;
  const totalMessagesCount = Object.values(messages).reduce((sum: number, msgs) => sum + ((msgs as WhatsAppMessage[])?.length || 0), 0);

  // Modal handlers
  const handleOpenCreateModal = () => {
    setEditingContactId(null);
    setFormData({
      name: '',
      phone: '+54 9 11 ' + Math.floor(10000000 + Math.random() * 90000000),
      email: '',
      company: '',
      dealValue: 7500,
      stage: 'New',
      source: 'WhatsApp',
      assignedAgentId: currentAgent.id,
      city: 'Buenos Aires',
      tagsStr: 'Inbound, WABA',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (contact: Lead, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingContactId(contact.id);
    setFormData({
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      company: contact.company,
      dealValue: contact.dealValue,
      stage: contact.stage,
      source: contact.source,
      assignedAgentId: contact.assignedAgentId || currentAgent.id,
      city: contact.city || 'Buenos Aires',
      tagsStr: contact.tags.join(', '),
      notes: contact.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) return;

    const tagsArr = formData.tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const agentObj = agents.find((a) => a.id === formData.assignedAgentId);

    if (editingContactId) {
      // Edit mode
      onEditContact(editingContactId, {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        company: formData.company || 'Empresa Independiente',
        dealValue: Number(formData.dealValue) || 0,
        stage: formData.stage,
        source: formData.source,
        assignedAgentId: formData.assignedAgentId,
        assignedAgentName: agentObj?.name || currentAgent.name,
        city: formData.city,
        tags: tagsArr.length > 0 ? tagsArr : ['Cliente'],
        notes: formData.notes
      });

      if (selectedContact && selectedContact.id === editingContactId) {
        setSelectedContact((prev) =>
          prev
            ? {
                ...prev,
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                company: formData.company,
                dealValue: Number(formData.dealValue),
                stage: formData.stage,
                source: formData.source,
                assignedAgentId: formData.assignedAgentId,
                assignedAgentName: agentObj?.name,
                city: formData.city,
                tags: tagsArr,
                notes: formData.notes
              }
            : null
        );
      }
    } else {
      // Create mode
      onCreateContact({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        company: formData.company || 'Empresa Particular',
        dealValue: Number(formData.dealValue) || 5000,
        stage: formData.stage,
        source: formData.source,
        assignedAgentId: formData.assignedAgentId,
        assignedAgentName: agentObj?.name || currentAgent.name,
        city: formData.city,
        tags: tagsArr.length > 0 ? tagsArr : ['Nuevo'],
        notes: formData.notes
      });
    }

    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!contactToDelete) return;
    onDeleteContact(contactToDelete.id);
    if (selectedContact?.id === contactToDelete.id) {
      setSelectedContact(null);
    }
    setContactToDelete(null);
  };

  // Find active contact's conversation & messages
  const activeConv = selectedContact
    ? conversations.find((c) => c.leadId === selectedContact.id)
    : null;
  const activeMessages = activeConv ? messages[activeConv.id] || [] : [];

  const handleSendDrawerMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!drawerChatInput.trim() || !activeConv) return;
    onSendMessage(activeConv.id, drawerChatInput, drawerIsNote);
    setDrawerChatInput('');
  };

  const handleSendDrawerTemplate = (tmpl: WhatsAppTemplate) => {
    if (!activeConv || !selectedContact) return;
    const body = tmpl.bodyText.replace('{{1}}', selectedContact.name);
    onSendMessage(activeConv.id, body, false, tmpl.name);
    setDrawerShowTemplates(false);
  };

  const exportContactsCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['ID,Nombre,Telefono,Email,Empresa,Valor,Etapa,Fuente,Agente']
        .concat(
          filteredContacts.map(
            (l) =>
              `"${l.id}","${l.name}","${l.phone}","${l.email}","${l.company}",${l.dealValue},"${l.stage}","${l.source}","${l.assignedAgentName || ''}"`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `contactos_clientum_crm_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-101px)] bg-slate-50 text-slate-900 overflow-hidden">
      {/* Top Header Controls */}
      <div className="bg-white border-b border-slate-200 p-4 space-y-4 shrink-0 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 border border-green-200 rounded-lg flex items-center justify-center text-green-700">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-extrabold text-base text-slate-900 leading-tight">
                  Directorio de Contactos & Leads
                </h2>
                <p className="text-xs text-slate-500">
                  Gestión integral de clientes, números WhatsApp WABA e historial de mensajería CRM
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={exportContactsCsv}
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition"
              title="Exportar a CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Exportar CSV</span>
            </button>

            <button
              onClick={handleOpenCreateModal}
              className="flex items-center space-x-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs rounded-xl shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Contacto</span>
            </button>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Contactos</span>
              <span className="font-extrabold text-slate-900 text-base">{totalContacts}</span>
            </div>
            <Users className="w-5 h-5 text-green-600" />
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Valor en Pipeline</span>
              <span className="font-extrabold text-green-700 text-base">
                ${totalPipelineValue.toLocaleString()}
              </span>
            </div>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Contactos Calificados</span>
              <span className="font-extrabold text-blue-700 text-base">{qualifiedCount}</span>
            </div>
            <UserCheck className="w-5 h-5 text-blue-600" />
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Mensajes Registrados</span>
              <span className="font-extrabold text-purple-700 text-base">{totalMessagesCount}</span>
            </div>
            <MessageSquare className="w-5 h-5 text-purple-600" />
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-1">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, teléfono, email, empresa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-green-600 focus:ring-1 focus:ring-green-600 font-medium"
            />
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto text-xs">
            {/* Stage Filter */}
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-bold focus:outline-none focus:border-green-600"
            >
              <option value="all">Todas las Etapas</option>
              <option value="New">Etapa: Nuevo</option>
              <option value="Contacted">Etapa: Contactado</option>
              <option value="Qualified">Etapa: Calificado</option>
              <option value="Proposal">Etapa: Propuesta</option>
              <option value="Won">Etapa: Ganado</option>
              <option value="Lost">Etapa: Perdido</option>
            </select>

            {/* Source Filter */}
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-bold focus:outline-none focus:border-green-600"
            >
              <option value="all">Todas las Fuentes</option>
              <option value="WhatsApp">Fuente: WhatsApp</option>
              <option value="Meta Ads">Fuente: Meta Ads</option>
              <option value="Website">Fuente: Sitio Web</option>
              <option value="Manual">Fuente: Carga Manual</option>
              <option value="Referral">Fuente: Referido</option>
            </select>

            {/* Agent Filter */}
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-bold focus:outline-none focus:border-green-600"
            >
              <option value="all">Todos los Agentes</option>
              {agents.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  Agente: {ag.name}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-0.5">
              <button
                onClick={() => setViewStyle('grid')}
                className={`p-1.5 rounded-lg transition ${
                  viewStyle === 'grid' ? 'bg-white text-green-700 shadow-2xs font-bold' : 'text-slate-500'
                }`}
                title="Vista en Tarjetas"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewStyle('table')}
                className={`p-1.5 rounded-lg transition ${
                  viewStyle === 'table' ? 'bg-white text-green-700 shadow-2xs font-bold' : 'text-slate-500'
                }`}
                title="Vista en Tabla"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Action Bar Toolbar */}
        {selectedLeadIds.length > 0 && (
          <div className="bg-slate-900 text-white p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg border border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200 mt-2">
            <div className="flex items-center space-x-3">
              <span className="bg-green-500 text-slate-950 font-extrabold text-xs px-2.5 py-1 rounded-lg">
                {selectedLeadIds.length} seleccionados
              </span>
              <button
                onClick={handleSelectAllLeads}
                className="text-xs text-slate-300 hover:text-white underline font-medium"
              >
                {selectedLeadIds.length === filteredContacts.length ? 'Deseleccionar todos' : 'Seleccionar todos los filtrados'}
              </button>
            </div>

            <div className="flex items-center space-x-2 text-xs flex-wrap gap-2">
              {/* Change Stage */}
              <div className="flex items-center space-x-1">
                <span className="text-slate-400 font-medium">Etapa:</span>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleBulkChangeStage(e.target.value as LeadStage);
                      e.target.value = '';
                    }
                  }}
                  defaultValue=""
                  className="bg-slate-800 border border-slate-700 text-white rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-none"
                >
                  <option value="" disabled>Cambiar etapa...</option>
                  <option value="New">Nuevo</option>
                  <option value="Contacted">Contactado</option>
                  <option value="Qualified">Calificado</option>
                  <option value="Proposal">Propuesta</option>
                  <option value="Won">Ganado</option>
                  <option value="Lost">Perdido</option>
                </select>
              </div>

              {/* Assign Agent */}
              <div className="flex items-center space-x-1">
                <span className="text-slate-400 font-medium">Agente:</span>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleBulkAssignAgent(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  defaultValue=""
                  className="bg-slate-800 border border-slate-700 text-white rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-none"
                >
                  <option value="" disabled>Asignar agente...</option>
                  {agents.map((ag) => (
                    <option key={ag.id} value={ag.id}>{ag.name}</option>
                  ))}
                </select>
              </div>

              {/* Bulk Delete */}
              <button
                onClick={handleBulkDelete}
                className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-xl transition shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eliminar Masivo</span>
              </button>

              <button
                onClick={() => setSelectedLeadIds([])}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                title="Cerrar barra"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-100/70">
        {filteredContacts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto my-8 space-y-3">
            <Users className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">No se encontraron contactos</h3>
            <p className="text-xs text-slate-500">
              No hay coincidencias con los filtros seleccionados o tu criterio de búsqueda.
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="mt-2 px-4 py-2 bg-green-600 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              + Agregar Primer Contacto
            </button>
          </div>
        ) : viewStyle === 'grid' ? (
          /* GRID CARDS VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredContacts.map((contact) => {
              const conv = conversations.find((c) => c.leadId === contact.id);
              const msgsCount = conv ? (messages[conv.id] || []).length : 0;

              return (
                <div
                  key={contact.id}
                  onClick={() => {
                    setSelectedContact(contact);
                    setActiveDrawerTab('chat');
                  }}
                  className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs hover:shadow-md hover:border-green-300 transition cursor-pointer flex flex-col justify-between group relative"
                >
                  <div>
                    {/* Top row avatar + stage badge */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <input
                          type="checkbox"
                          checked={selectedLeadIds.includes(contact.id)}
                          onChange={(e) => handleToggleSelectLead(contact.id, e)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 rounded border-slate-300 text-green-600 focus:ring-green-500 cursor-pointer shrink-0 mt-0.5"
                        />
                        <div className="relative shrink-0">
                          <img
                            src={
                              conv?.avatar ||
                              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'
                            }
                            alt={contact.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200"
                          />
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-900 text-sm truncate group-hover:text-green-700 transition">
                            {contact.name}
                          </h3>
                          <p className="text-xs text-slate-500 truncate flex items-center">
                            <Building2 className="w-3 h-3 mr-1 text-slate-400 shrink-0" />
                            {contact.company}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 border ${
                          contact.stage === 'Won'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : contact.stage === 'Qualified'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : contact.stage === 'Proposal'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : contact.stage === 'Lost'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {contact.stage}
                      </span>
                    </div>

                    {/* Phone & Email details */}
                    <div className="space-y-1.5 text-xs text-slate-600 mb-3 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center font-mono font-medium text-slate-800">
                          <Phone className="w-3.5 h-3.5 mr-1.5 text-green-600" />
                          {contact.phone}
                        </span>
                        <span className="text-[10px] bg-green-100 text-green-800 font-bold px-1.5 py-0.2 rounded font-mono">
                          WABA
                        </span>
                      </div>
                      <div className="flex items-center text-slate-500 truncate">
                        <Mail className="w-3.5 h-3.5 mr-1.5 text-blue-500 shrink-0" />
                        <span className="truncate">{contact.email}</span>
                      </div>
                    </div>

                    {/* Deal Value & Agent */}
                    <div className="flex items-center justify-between text-xs mb-2.5">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Valor Estimado</span>
                        <span className="font-extrabold text-green-700 text-sm">
                          ${contact.dealValue.toLocaleString()}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-semibold">Agente Asignado</span>
                        <span className="font-bold text-slate-700 text-xs">
                          {contact.assignedAgentName?.split(' ')[0] || 'Sin asignar'}
                        </span>
                      </div>
                    </div>

                    {/* Lead Score Progress Bar */}
                    <div className="mb-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <LeadScoreBar score={contact.score ?? 70} />
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {contact.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium border border-slate-200/80"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (conv) {
                          onSelectLeadForChat(contact.id);
                        } else {
                          setSelectedContact(contact);
                          setActiveDrawerTab('chat');
                        }
                      }}
                      className="flex-1 py-1.5 bg-green-50 hover:bg-green-100 text-green-800 font-bold text-xs rounded-xl border border-green-200 transition flex items-center justify-center space-x-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-green-600" />
                      <span>WhatsApp ({msgsCount})</span>
                    </button>

                    <button
                      onClick={(e) => handleOpenEditModal(contact, e)}
                      className="p-2 hover:bg-slate-100 text-slate-600 rounded-xl transition"
                      title="Editar contacto"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setContactToDelete(contact);
                      }}
                      className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl transition"
                      title="Eliminar contacto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* TABLE LIST VIEW */
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3 pl-4 w-10">
                      <input
                        type="checkbox"
                        checked={selectedLeadIds.length > 0 && selectedLeadIds.length === filteredContacts.length}
                        onChange={handleSelectAllLeads}
                        className="w-4 h-4 rounded border-slate-300 text-green-600 focus:ring-green-500 cursor-pointer"
                      />
                    </th>
                    <th className="p-3">Contacto & Empresa</th>
                    <th className="p-3">Teléfono WhatsApp</th>
                    <th className="p-3">Lead Score (IA)</th>
                    <th className="p-3">Etapa del Lead</th>
                    <th className="p-3">Valor Estimado</th>
                    <th className="p-3">Agente</th>
                    <th className="p-3 pr-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredContacts.map((contact) => {
                    const conv = conversations.find((c) => c.leadId === contact.id);

                    return (
                      <tr
                        key={contact.id}
                        onClick={() => {
                          setSelectedContact(contact);
                          setActiveDrawerTab('chat');
                        }}
                        className="hover:bg-slate-50/80 cursor-pointer transition"
                      >
                        <td className="p-3 pl-4" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedLeadIds.includes(contact.id)}
                            onChange={(e) => handleToggleSelectLead(contact.id, e)}
                            className="w-4 h-4 rounded border-slate-300 text-green-600 focus:ring-green-500 cursor-pointer"
                          />
                        </td>
                        <td className="p-3">
                          <div className="flex items-center space-x-2.5">
                            <img
                              src={
                                conv?.avatar ||
                                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
                              }
                              alt={contact.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <p className="font-bold text-slate-900">{contact.name}</p>
                              <p className="text-[10px] text-slate-500">{contact.company}</p>
                            </div>
                          </div>
                        </td>

                        <td className="p-3 font-mono text-slate-800 font-medium">
                          <div className="flex items-center space-x-1">
                            <Phone className="w-3 h-3 text-green-600" />
                            <span>{contact.phone}</span>
                          </div>
                        </td>

                        <td className="p-3 w-44">
                          <LeadScoreBar score={contact.score ?? 70} showLabel={true} />
                        </td>

                        <td className="p-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                            {contact.stage}
                          </span>
                        </td>

                        <td className="p-3 font-extrabold text-green-700">
                          ${contact.dealValue.toLocaleString()}
                        </td>

                        <td className="p-3 text-slate-700 font-medium">
                          {contact.assignedAgentName || 'Sin asignar'}
                        </td>

                        <td className="p-3 pr-4 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (conv) onSelectLeadForChat(contact.id);
                              }}
                              className="p-1.5 bg-green-50 hover:bg-green-100 text-green-800 rounded-lg border border-green-200 font-bold transition flex items-center space-x-1 text-[11px]"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-green-600" />
                              <span>WhatsApp</span>
                            </button>

                            <button
                              onClick={(e) => handleOpenEditModal(contact, e)}
                              className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setContactToDelete(contact);
                              }}
                              className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* CONTACT DETAIL & LIVE WHATSAPP CHAT DRAWER */}
      {selectedContact && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex justify-end">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center space-x-3 min-w-0">
                <img
                  src={
                    activeConv?.avatar ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'
                  }
                  alt={selectedContact.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="font-extrabold text-sm truncate text-white">
                    {selectedContact.name}
                  </h3>
                  <p className="text-xs text-slate-400 truncate">
                    {selectedContact.company} • {selectedContact.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => {
                    if (activeConv) {
                      onSelectLeadForChat(selectedContact.id);
                    }
                  }}
                  className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Abrir en Inbox</span>
                </button>

                <button
                  onClick={() => setSelectedContact(null)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer Tabs Bar */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 flex items-center space-x-4 text-xs font-bold shrink-0">
              <button
                onClick={() => setActiveDrawerTab('chat')}
                className={`py-3 border-b-2 transition flex items-center space-x-1.5 ${
                  activeDrawerTab === 'chat'
                    ? 'border-green-600 text-green-800 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat de WhatsApp en Vivo ({activeMessages.length})</span>
              </button>

              <button
                onClick={() => setActiveDrawerTab('details')}
                className={`py-3 border-b-2 transition flex items-center space-x-1.5 ${
                  activeDrawerTab === 'details'
                    ? 'border-green-600 text-green-800 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Detalles y Perfil</span>
              </button>

              <button
                onClick={() => setActiveDrawerTab('notes')}
                className={`py-3 border-b-2 transition flex items-center space-x-1.5 ${
                  activeDrawerTab === 'notes'
                    ? 'border-green-600 text-green-800 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Notas e Historial</span>
              </button>

              <button
                onClick={() => setActiveDrawerTab('enrichment')}
                className={`py-3 border-b-2 transition flex items-center space-x-1.5 ${
                  activeDrawerTab === 'enrichment'
                    ? 'border-green-600 text-green-800 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Historial de Enriquecimiento (IA)</span>
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 text-xs">
              {/* TAB 1: LIVE WHATSAPP CHAT */}
              {activeDrawerTab === 'chat' && (
                <div className="flex flex-col h-full justify-between space-y-4">
                  {/* Messages Feed */}
                  <div className="flex-1 overflow-y-auto space-y-3 p-2 bg-white rounded-2xl border border-slate-200">
                    {activeMessages.map((msg) => {
                      const isLead = msg.sender === 'lead';
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isLead ? 'justify-start' : 'justify-end'}`}
                        >
                          <div
                            className={`p-3 rounded-xl max-w-[85%] text-xs shadow-2xs ${
                              isLead
                                ? 'bg-slate-100 border border-slate-200 text-slate-800 rounded-tl-none'
                                : msg.isNote
                                ? 'bg-amber-50 border border-amber-200 text-amber-900'
                                : 'bg-slate-900 text-white rounded-tr-none'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[9px] text-slate-400 mb-1">
                              <span>{msg.senderName || (isLead ? selectedContact.name : 'Agente')}</span>
                              <span className="font-mono">{msg.timestamp}</span>
                            </div>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                          </div>
                        </div>
                      );
                    })}

                    {activeMessages.length === 0 && (
                      <div className="p-8 text-center text-slate-400">
                        No hay mensajes registrados aún con este contacto.
                      </div>
                    )}
                  </div>

                  {/* Inline Message Input */}
                  <form onSubmit={handleSendDrawerMessage} className="bg-white p-3 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setDrawerIsNote(false)}
                          className={`px-2.5 py-1 rounded-lg font-bold transition ${
                            !drawerIsNote ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          Mensaje WhatsApp
                        </button>
                        <button
                          type="button"
                          onClick={() => setDrawerIsNote(true)}
                          className={`px-2.5 py-1 rounded-lg font-bold transition ${
                            drawerIsNote ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          Nota Interna
                        </button>
                      </div>

                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setDrawerShowTemplates(!drawerShowTemplates)}
                          className="text-purple-700 font-bold hover:underline flex items-center space-x-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Plantillas Meta</span>
                        </button>

                        {drawerShowTemplates && (
                          <div className="absolute right-0 bottom-full mb-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-20 space-y-1 max-h-48 overflow-y-auto">
                            {templates.map((tmpl) => (
                              <button
                                key={tmpl.id}
                                type="button"
                                onClick={() => handleSendDrawerTemplate(tmpl)}
                                className="w-full text-left p-2 hover:bg-slate-50 rounded text-slate-800"
                              >
                                <p className="font-bold text-purple-700">{tmpl.name}</p>
                                <p className="text-[10px] text-slate-500 truncate">{tmpl.bodyText}</p>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-end space-x-2">
                      <textarea
                        rows={2}
                        value={drawerChatInput}
                        onChange={(e) => setDrawerChatInput(e.target.value)}
                        placeholder={
                          drawerIsNote
                            ? 'Escribí una nota interna...'
                            : `Enviar mensaje de WhatsApp a ${selectedContact.name}...`
                        }
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none focus:border-green-600"
                      />
                      <button
                        type="submit"
                        disabled={!drawerChatInput.trim()}
                        className={`p-3 rounded-xl text-white font-bold transition shrink-0 ${
                          drawerIsNote ? 'bg-amber-600 hover:bg-amber-700' : 'bg-green-600 hover:bg-green-700'
                        } disabled:opacity-50`}
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 2: CONTACT DETAILS & EDIT */}
              {activeDrawerTab === 'details' && (
                <div className="space-y-4">
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                      Ficha Oficial del Cliente
                    </h4>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block font-semibold">Nombre</span>
                        <span className="font-extrabold text-slate-800">{selectedContact.name}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-semibold">Empresa</span>
                        <span className="font-bold text-slate-800">{selectedContact.company}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-semibold">Teléfono</span>
                        <span className="font-mono text-slate-800 font-bold">{selectedContact.phone}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-semibold">Email</span>
                        <span className="text-slate-800 font-medium">{selectedContact.email}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-semibold">Etapa en CRM</span>
                        <span className="font-bold text-green-700">{selectedContact.stage}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-semibold">Valor de Negocio</span>
                        <span className="font-extrabold text-green-700">
                          ${selectedContact.dealValue.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={(e) => handleOpenEditModal(selectedContact, e)}
                        className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition flex items-center justify-center space-x-2"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Editar Información del Contacto</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: NOTES */}
              {activeDrawerTab === 'notes' && (
                <div className="space-y-4">
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-2">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      Notas Internas del Equipo
                    </h4>
                    <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs leading-relaxed">
                      {selectedContact.notes || 'Aún no se ingresaron notas para este contacto.'}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 4: ENRICHMENT HISTORY */}
              {activeDrawerTab === 'enrichment' && (
                <div className="space-y-4">
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-3 relative">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        Historial de Enriquecimiento (IA)
                      </h4>
                      <button
                        onClick={handleEnrichLead}
                        disabled={isEnriching}
                        className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 disabled:bg-purple-400 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                      >
                        {isEnriching ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Enriqueciendo...
                          </>
                        ) : (
                          <>
                            <Search className="w-3 h-3" />
                            Buscar Datos Ahora
                          </>
                        )}
                      </button>
                    </div>
                    
                    {(!selectedContact.enrichmentHistory || selectedContact.enrichmentHistory.length === 0) ? (
                      <p className="text-slate-500 text-xs py-4 text-center">
                        No hay historial de enriquecimiento para este lead.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {selectedContact.enrichmentHistory.map((log, idx) => (
                          <div key={idx} className="p-3 bg-purple-50/30 border border-purple-100 rounded-xl space-y-2">
                            <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                              <span>Enriquecimiento detectado</span>
                              <span>{log.timestamp}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                              {log.sector && (
                                <div>
                                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">Sector</span>
                                  <span className="font-bold text-slate-800">{log.sector}</span>
                                </div>
                              )}
                              {log.employeeCount && (
                                <div>
                                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">Empleados</span>
                                  <span className="font-bold text-slate-800">{log.employeeCount}</span>
                                </div>
                              )}
                              {log.annualRevenue && (
                                <div>
                                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">Ingresos Anuales</span>
                                  <span className="font-bold text-slate-800">{log.annualRevenue}</span>
                                </div>
                              )}
                              {log.technologies && log.technologies.length > 0 && (
                                <div className="col-span-2 mt-1">
                                  <span className="text-slate-400 block font-semibold text-[10px] uppercase mb-1">Tecnologías Detectadas</span>
                                  <div className="flex flex-wrap gap-1">
                                    {log.technologies.map((tech, i) => (
                                      <span key={i} className="px-2 py-0.5 bg-white border border-purple-200 text-purple-700 rounded-md text-[9px] font-bold">
                                        {tech}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT CONTACT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden my-auto">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-green-400" />
                <h3 className="font-extrabold text-base text-white">
                  {editingContactId ? 'Editar Contacto CRM' : 'Nuevo Contacto & WhatsApp WABA'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Carlos Mendoza"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium focus:outline-none focus:border-green-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Teléfono WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="+54 9 11 5555 1234"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono font-medium focus:outline-none focus:border-green-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    placeholder="carlos@empresa.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium focus:outline-none focus:border-green-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Empresa / Compañía</label>
                  <input
                    type="text"
                    placeholder="ej. Logística Central S.A."
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium focus:outline-none focus:border-green-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Valor Estimado ($)</label>
                  <input
                    type="number"
                    value={formData.dealValue}
                    onChange={(e) => setFormData({ ...formData, dealValue: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-extrabold focus:outline-none focus:border-green-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Etapa inicial</label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value as LeadStage })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-bold focus:outline-none focus:border-green-600"
                  >
                    <option value="New">Nuevo</option>
                    <option value="Contacted">Contactado</option>
                    <option value="Qualified">Calificado</option>
                    <option value="Proposal">Propuesta</option>
                    <option value="Won">Ganado</option>
                    <option value="Lost">Perdido</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fuente</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value as Lead['source'] })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-bold focus:outline-none focus:border-green-600"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Meta Ads">Meta Ads</option>
                    <option value="Website">Sitio Web</option>
                    <option value="Manual">Manual</option>
                    <option value="Referral">Referido</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Agente Asignado</label>
                  <select
                    value={formData.assignedAgentId}
                    onChange={(e) => setFormData({ ...formData, assignedAgentId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-bold focus:outline-none focus:border-green-600"
                  >
                    {agents.map((ag) => (
                      <option key={ag.id} value={ag.id}>
                        {ag.name} ({ag.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Etiquetas (separadas por coma)</label>
                  <input
                    type="text"
                    placeholder="VIP, Enterprise, WABA"
                    value={formData.tagsStr}
                    onChange={(e) => setFormData({ ...formData, tagsStr: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium focus:outline-none focus:border-green-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notas del Contacto</label>
                <textarea
                  rows={2}
                  placeholder="Detalles clave sobre las necesidades del cliente..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium focus:outline-none focus:border-green-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-extrabold rounded-xl shadow-md transition flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingContactId ? 'Guardar Cambios' : 'Crear Contacto'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {contactToDelete && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 text-xs">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-slate-900 text-base">¿Eliminar contacto del CRM?</h3>
              <p className="text-slate-600">
                Estás a punto de eliminar a <b className="text-slate-900">{contactToDelete.name}</b> ({contactToDelete.company}).
                Esta acción es irreversible y removerá el registro del directorio.
              </p>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={() => setContactToDelete(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
              >
                Cancelar
              </button>

              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-md transition"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
