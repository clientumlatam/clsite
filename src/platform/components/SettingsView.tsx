import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Building2,
  Key,
  Globe,
  Zap,
  Users,
  CheckCircle2,
  Copy,
  RefreshCw,
  Send,
  Sparkles,
  ShieldAlert,
  Lock,
  Unlock,
  ToggleLeft,
  ToggleRight,
  UserPlus,
  Plus,
  X,
  FileSpreadsheet,
  Megaphone,
  Bot,
  BarChart2,
  Package,
  Server,
  FileText,
  Download,
  Target,
  Award,
  ListTodo,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { Tenant, Agent, AgentPermissions, Role, AuditLogItem, AgentGoal, AgentTask } from '../types';

interface SettingsViewProps {
  tenant: Tenant;
  agents: Agent[];
  auditLogs?: AuditLogItem[];
  onUpdateTenant: (updated: Partial<Tenant>) => void;
  onUpdateAgents?: (updatedAgents: Agent[]) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  tenant,
  agents,
  auditLogs = [],
  onUpdateTenant,
  onUpdateAgents
}) => {
  const [wabaId, setWabaId] = useState(tenant.wabaId);
  const [phoneNumberId, setPhoneNumberId] = useState(tenant.phoneNumberId);
  const [displayPhone, setDisplayPhone] = useState(tenant.displayPhoneNumber);
  const [webhookUrl, setWebhookUrl] = useState(tenant.webhookUrl);
  const [copied, setCopied] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);
  const [loadingTest, setLoadingTest] = useState(false);

  // Local state for Granular Agent Permissions
  const [agentList, setAgentList] = useState<Agent[]>(agents);
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || 'agent_1');
  const [savedToast, setSavedToast] = useState(false);

  // Modal New Agent
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentEmail, setNewAgentEmail] = useState('');
  const [newAgentRole, setNewAgentRole] = useState<Role>('agent');

  // Goal Modal State
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState(10);
  const [newGoalUnit, setNewGoalUnit] = useState('leads');
  const [newGoalDeadline, setNewGoalDeadline] = useState('2026-08-31');

  const selectedAgent = agentList.find((a) => a.id === selectedAgentId) || agentList[0];

  const handleExportAuditLogsCSV = () => {
    const headers = ['ID', 'Timestamp', 'User Email', 'User Name', 'Action', 'Category', 'Resource', 'IP Address', 'Status', 'Details'];
    const rows = auditLogs.map((log) => [
      log.id,
      log.timestamp,
      log.userEmail,
      log.userName,
      log.action,
      log.category,
      `"${log.resource.replace(/"/g, '""')}"`,
      log.ipAddress,
      log.status,
      `"${log.details.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `audit_logs_compliance_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgent || !newGoalTitle.trim()) return;

    const newGoal: AgentGoal = {
      id: `goal_${Date.now()}`,
      title: newGoalTitle,
      target: Number(newGoalTarget),
      current: 0,
      unit: newGoalUnit,
      deadline: newGoalDeadline,
      status: 'In Progress'
    };

    const updatedList = agentList.map((ag) => {
      if (ag.id === selectedAgent.id) {
        return {
          ...ag,
          goals: [...(ag.goals || []), newGoal]
        };
      }
      return ag;
    });

    setAgentList(updatedList);
    if (onUpdateAgents) onUpdateAgents(updatedList);
    setShowGoalModal(false);
    setNewGoalTitle('');
  };

  const defaultPermissionsForRole = (role: Role): AgentPermissions => {
    if (role === 'admin') {
      return {
        canCreateCampaigns: true,
        canUseAiCopilot: true,
        canManageTemplates: true,
        canExportLeads: true,
        canManageErpOrders: true,
        canManageCluster: true,
        canViewAnalytics: true
      };
    }
    if (role === 'manager') {
      return {
        canCreateCampaigns: true,
        canUseAiCopilot: true,
        canManageTemplates: true,
        canExportLeads: true,
        canManageErpOrders: true,
        canManageCluster: false,
        canViewAnalytics: true
      };
    }
    // Standard agent
    return {
      canCreateCampaigns: false,
      canUseAiCopilot: true,
      canManageTemplates: false,
      canExportLeads: false,
      canManageErpOrders: true,
      canManageCluster: false,
      canViewAnalytics: false
    };
  };

  const currentPermissions: AgentPermissions = selectedAgent?.permissions || defaultPermissionsForRole(selectedAgent?.role || 'agent');

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestPing = async () => {
    setLoadingTest(true);
    try {
      const res = await fetch('/api/whatsapp/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'TEST_PING', timestamp: new Date().toISOString() })
      });
      if (res.ok) {
        setTestSuccess(true);
        setTimeout(() => setTestSuccess(false), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTest(false);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTenant({
      wabaId,
      phoneNumberId,
      displayPhoneNumber: displayPhone,
      webhookUrl
    });
    alert('¡Configuración de Meta WABA actualizada con éxito!');
  };

  const handleTogglePermission = (key: keyof AgentPermissions) => {
    if (!selectedAgent) return;

    const updatedPermissions: AgentPermissions = {
      ...currentPermissions,
      [key]: !currentPermissions[key]
    };

    const updatedList = agentList.map((ag) =>
      ag.id === selectedAgent.id ? { ...ag, permissions: updatedPermissions } : ag
    );

    setAgentList(updatedList);
    if (onUpdateAgents) onUpdateAgents(updatedList);
  };

  const handleApplyRolePreset = (role: Role) => {
    if (!selectedAgent) return;
    const newPerms = defaultPermissionsForRole(role);

    const updatedList = agentList.map((ag) =>
      ag.id === selectedAgent.id ? { ...ag, role, permissions: newPerms } : ag
    );

    setAgentList(updatedList);
    if (onUpdateAgents) onUpdateAgents(updatedList);
  };

  const handleSavePermissionsMatrix = () => {
    if (onUpdateAgents) {
      onUpdateAgents(agentList);
    }
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleAddAgentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName || !newAgentEmail) return;

    const newAg: Agent = {
      id: `agent_${Date.now()}`,
      name: newAgentName,
      email: newAgentEmail,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`,
      role: newAgentRole,
      status: 'online',
      assignedLeadsCount: 0,
      permissions: defaultPermissionsForRole(newAgentRole)
    };

    const updated = [...agentList, newAg];
    setAgentList(updated);
    if (onUpdateAgents) onUpdateAgents(updated);

    setSelectedAgentId(newAg.id);
    setShowAddModal(false);
    setNewAgentName('');
    setNewAgentEmail('');
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-61px)] bg-slate-950 text-slate-100 overflow-y-auto p-4 md:p-6 space-y-6">
      {/* Top Banner */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-slate-100 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-emerald-400" />
              Configuración General & Permisos Granulares de Agentes
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Administrá credenciales de Meta Cloud API, límites de cuota SaaS y asigná permisos de seguridad por rol o agente individual.
            </p>
          </div>
          <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono font-bold px-3 py-1 rounded-lg shrink-0">
            Rol Activo: Administrador SaaS
          </span>
        </div>
      </div>

      {/* SECTION 1: GRANULAR PERMISSIONS MANAGEMENT */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-sm font-extrabold text-slate-100 flex items-center">
              <ShieldAlert className="w-5 h-5 mr-2 text-amber-400" />
              Matriz de Permisos Granulares por Agente y Funcionalidad
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Restringí el acceso de los miembros del equipo a la creación de campañas masivas, uso de la IA Gemini o exportación de clientes.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 px-3.5 py-1.5 rounded-lg text-xs font-bold transition"
            >
              <UserPlus className="w-4 h-4 text-emerald-400" />
              <span>Nuevo Agente</span>
            </button>

            <button
              onClick={handleSavePermissionsMatrix}
              className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-4 py-1.5 rounded-lg text-xs transition shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Guardar Matriz de Permisos</span>
            </button>
          </div>
        </div>

        {savedToast && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-700/60 rounded-xl text-xs text-emerald-300 font-semibold flex items-center space-x-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>¡Permisos granulares actualizados correctamente en toda la organización!</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agent Selection Sidebar */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              Seleccionar Agente para Editar ({agentList.length})
            </label>

            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {agentList.map((ag) => (
                <button
                  key={ag.id}
                  onClick={() => setSelectedAgentId(ag.id)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition ${
                    selectedAgentId === ag.id
                      ? 'bg-emerald-950/50 border-emerald-500/80 ring-1 ring-emerald-500/40'
                      : 'bg-slate-950 border-slate-800 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <img src={ag.avatar} alt={ag.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                    <div className="overflow-hidden">
                      <p className="font-bold text-xs text-slate-100 truncate">{ag.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{ag.email}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded capitalize shrink-0 ml-2 ${
                      ag.role === 'admin'
                        ? 'bg-purple-950 text-purple-300 border border-purple-800'
                        : ag.role === 'manager'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {ag.role}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Granular Toggles Configurator */}
          {selectedAgent && (
            <div className="lg:col-span-2 space-y-5 bg-slate-950 border border-slate-800 p-5 rounded-2xl">
              {/* Selected Agent Header & Role Preset */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedAgent.avatar}
                    alt={selectedAgent.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/40"
                  />
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-100">{selectedAgent.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">{selectedAgent.email}</p>
                  </div>
                </div>

                {/* Role Preset Quick Buttons */}
                <div className="flex items-center space-x-1.5 text-xs">
                  <span className="text-[11px] text-slate-400 font-semibold mr-1">Preajustes de Rol:</span>
                  <button
                    onClick={() => handleApplyRolePreset('admin')}
                    className="bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-800 px-2.5 py-1 rounded-lg text-[11px] font-bold transition"
                  >
                    Admin
                  </button>
                  <button
                    onClick={() => handleApplyRolePreset('manager')}
                    className="bg-blue-950 hover:bg-blue-900 text-blue-300 border border-blue-800 px-2.5 py-1 rounded-lg text-[11px] font-bold transition"
                  >
                    Manager
                  </button>
                  <button
                    onClick={() => handleApplyRolePreset('agent')}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-lg text-[11px] font-bold transition"
                  >
                    Agente Estándar
                  </button>
                </div>
              </div>

              {/* Toggles Matrix Grid */}
              <div className="space-y-3 text-xs">
                {/* 1. Campaigns */}
                <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-4 hover:border-slate-700 transition">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-amber-950/60 rounded-lg text-amber-400 shrink-0 mt-0.5">
                      <Megaphone className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-100">Creación & Envío de Campañas Masivas WABA</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Permite enviar mensajes broadcast a listas de contactos y gastar créditos de Meta.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTogglePermission('canCreateCampaigns')}
                    className="text-emerald-400 hover:scale-105 transition shrink-0"
                  >
                    {currentPermissions.canCreateCampaigns ? (
                      <ToggleRight className="w-7 h-7 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-7 h-7 text-slate-600" />
                    )}
                  </button>
                </div>

                {/* 2. AI Copilot */}
                <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-4 hover:border-slate-700 transition">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-purple-950/60 rounded-lg text-purple-400 shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-100">Uso de Copilot Gemini IA & Generación Inteligente</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Permite usar sugerencias automáticas de IA, resúmenes de chats y autocompletado en Inbox.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTogglePermission('canUseAiCopilot')}
                    className="text-emerald-400 hover:scale-105 transition shrink-0"
                  >
                    {currentPermissions.canUseAiCopilot ? (
                      <ToggleRight className="w-7 h-7 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-7 h-7 text-slate-600" />
                    )}
                  </button>
                </div>

                {/* 3. Export Leads */}
                <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-4 hover:border-slate-700 transition">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-rose-950/60 rounded-lg text-rose-400 shrink-0 mt-0.5">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-100">Exportación de Base de Datos de Clientes (CSV / Excel)</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Protección contra fuga de información. Restringe la descarga masiva de teléfonos y correos.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTogglePermission('canExportLeads')}
                    className="text-emerald-400 hover:scale-105 transition shrink-0"
                  >
                    {currentPermissions.canExportLeads ? (
                      <ToggleRight className="w-7 h-7 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-7 h-7 text-slate-600" />
                    )}
                  </button>
                </div>

                {/* 4. WhatsApp Templates */}
                <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-4 hover:border-slate-700 transition">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-950/60 rounded-lg text-blue-400 shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-100">Gestión & Envío a Revisión de Plantillas WABA</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Permite diseñar nuevas plantillas y someterlas a validación ante Meta Business.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTogglePermission('canManageTemplates')}
                    className="text-emerald-400 hover:scale-105 transition shrink-0"
                  >
                    {currentPermissions.canManageTemplates ? (
                      <ToggleRight className="w-7 h-7 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-7 h-7 text-slate-600" />
                    )}
                  </button>
                </div>

                {/* 5. ERP Orders */}
                <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-4 hover:border-slate-700 transition">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-emerald-950/60 rounded-lg text-emerald-400 shrink-0 mt-0.5">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-100">Emisión de Ventas & Documentos ERPNext / POS</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Permite generar facturas, cotizaciones oficiales y comandas en el sistema.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTogglePermission('canManageErpOrders')}
                    className="text-emerald-400 hover:scale-105 transition shrink-0"
                  >
                    {currentPermissions.canManageErpOrders ? (
                      <ToggleRight className="w-7 h-7 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-7 h-7 text-slate-600" />
                    )}
                  </button>
                </div>

                {/* 6. Cluster Management */}
                <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-4 hover:border-slate-700 transition">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-cyan-950/60 rounded-lg text-cyan-400 shrink-0 mt-0.5">
                      <Server className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-100">Aprovisionamiento Cluster SaaS & Subdominios</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Permite crear instancias multi-tenant y aplicar enforcement de cuota en el clúster.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTogglePermission('canManageCluster')}
                    className="text-emerald-400 hover:scale-105 transition shrink-0"
                  >
                    {currentPermissions.canManageCluster ? (
                      <ToggleRight className="w-7 h-7 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-7 h-7 text-slate-600" />
                    )}
                  </button>
                </div>

                {/* 7. Analytics */}
                <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-4 hover:border-slate-700 transition">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-indigo-950/60 rounded-lg text-indigo-400 shrink-0 mt-0.5">
                      <BarChart2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-100">Acceso a Reportes Financieros & Métricas</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Permite visualizar ingresos totales, ROI de WhatsApp y desempeño del equipo.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTogglePermission('canViewAnalytics')}
                    className="text-emerald-400 hover:scale-105 transition shrink-0"
                  >
                    {currentPermissions.canViewAnalytics ? (
                      <ToggleRight className="w-7 h-7 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-7 h-7 text-slate-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: PERFORMANCE OBJECTIVES (GOALS) & DELEGATED TASKS FOR AGENTS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-sm font-extrabold text-slate-100 flex items-center">
              <Target className="w-5 h-5 mr-2 text-emerald-400" />
              Objetivos de Desempeño & Tareas Delegadas ({selectedAgent.name})
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Establecé metas cuantitativas para la instancia del agente AI / humano y revisá su cola de tareas activas.
            </p>
          </div>

          <button
            onClick={() => setShowGoalModal(true)}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs transition shadow-md shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Definir Nuevo Objetivo</span>
          </button>
        </div>

        {/* Goals Grid */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
            <Award className="w-4 h-4 mr-1.5 text-amber-400" />
            Metas y KPI Asignados
          </h3>

          {!selectedAgent.goals || selectedAgent.goals.length === 0 ? (
            <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl text-center text-xs text-slate-400">
              No hay objetivos definidos aún para {selectedAgent.name}. Hacé clic en "Definir Nuevo Objetivo".
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedAgent.goals.map((goal) => {
                const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));
                return (
                  <div
                    key={goal.id}
                    className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-slate-100">{goal.title}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          goal.status === 'Achieved'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : goal.status === 'At Risk'
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {goal.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>
                        Progreso: <b className="text-emerald-400">{goal.current}</b> / {goal.target} {goal.unit}
                      </span>
                      <span>{percent}%</span>
                    </div>

                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full ${
                          percent >= 100
                            ? 'bg-emerald-500'
                            : percent < 50
                            ? 'bg-amber-500'
                            : 'bg-emerald-400'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <p className="text-[10px] text-slate-500 text-right">
                      Fecha límite: {goal.deadline}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Active Tasks list */}
        <div className="pt-3 border-t border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
            <ListTodo className="w-4 h-4 mr-1.5 text-cyan-400" />
            Cola de Tareas Delegadas Activas
          </h3>

          {!selectedAgent.active_tasks || selectedAgent.active_tasks.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No hay tareas pendientes en la cola de este agente.</p>
          ) : (
            <div className="space-y-2">
              {selectedAgent.active_tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-slate-100">{task.title}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          task.priority === 'High'
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : task.priority === 'Medium'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {task.notes} {task.assignedBy && `• Asignado por ${task.assignedBy}`}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0 text-slate-400 font-mono text-[11px]">
                    <span>Vence: {task.dueDate}</span>
                    <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: AUDIT LOGS & COMPLIANCE CSV EXPORT */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-sm font-extrabold text-slate-100 flex items-center">
              <FileSpreadsheet className="w-5 h-5 mr-2 text-emerald-400" />
              Auditoría de Sistema & Logs de Cumplimiento (Compliance Reporting)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Registro inalterable de acciones de agentes, emisiones ERP, inicios de sesión y llamadas de API.
            </p>
          </div>

          <button
            onClick={handleExportAuditLogsCSV}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-4 py-2 rounded-xl text-xs transition shadow-md shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Audit Logs (CSV)</span>
          </button>
        </div>

        {/* Audit Logs Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider font-mono">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Usuario / Agente</th>
                <th className="p-3">Acción</th>
                <th className="p-3">Categoría</th>
                <th className="p-3">Recurso</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Detalles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/50 transition">
                  <td className="p-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="p-3 font-bold text-slate-100 whitespace-nowrap">
                    {log.userName}
                    <span className="block text-[10px] text-slate-500 font-normal">{log.userEmail}</span>
                  </td>
                  <td className="p-3 font-mono font-bold text-emerald-400 text-[11px]">
                    {log.action}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono">
                      {log.category}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-slate-200 whitespace-nowrap">
                    {log.resource}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                      {log.status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400 max-w-xs truncate">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: META WABA & SAAS SUBSCRIPTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meta WABA Connection Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center">
              <ShieldCheck className="w-4 h-4 mr-2 text-emerald-400" />
              Configuración de la API de WhatsApp Business de Meta
            </h3>
            <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
              Conectado
            </span>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                ID de Cuenta de WhatsApp Business (WABA ID)
              </label>
              <input
                type="text"
                value={wabaId}
                onChange={(e) => setWabaId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                ID de Número de Teléfono Meta Cloud
              </label>
              <input
                type="text"
                value={phoneNumberId}
                onChange={(e) => setPhoneNumberId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Número de Teléfono Visible
              </label>
              <input
                type="text"
                value={displayPhone}
                onChange={(e) => setDisplayPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-400 font-semibold">URL de Webhook Entrante</label>
                <button
                  type="button"
                  onClick={handleCopyWebhook}
                  className="text-[10px] text-emerald-400 hover:underline flex items-center font-mono"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  {copied ? '¡Copiado!' : 'Copiar URL'}
                </button>
              </div>
              <input
                type="text"
                readOnly
                value={webhookUrl}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-400 font-mono text-[11px]"
              />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <button
                type="button"
                onClick={handleTestPing}
                disabled={loadingTest}
                className="flex items-center space-x-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 px-3.5 py-2 rounded-lg font-semibold transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{loadingTest ? 'Probando...' : 'Probar Conexión WABA'}</span>
              </button>

              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-lg transition shadow-md"
              >
                Guardar Configuración Meta
              </button>
            </div>

            {testSuccess && (
              <p className="text-xs text-emerald-400 bg-emerald-950/80 p-2.5 rounded-lg border border-emerald-800 font-mono text-center">
                ✅ ¡Prueba de Webhook exitosa! Transmisión de alta velocidad (250 msgs/seg) habilitada.
              </p>
            )}
          </form>
        </div>

        {/* SaaS Subscription & Agent Quota */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center">
                <Zap className="w-4 h-4 mr-2 text-amber-400" />
                Plan de Suscripción Frappe SaaS
              </h3>
              <span className="text-xs font-extrabold text-amber-400 bg-amber-950 border border-amber-800 px-2.5 py-0.5 rounded">
                Plan {tenant.plan}
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Créditos Mensuales de WhatsApp:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {tenant.creditsUsed.toLocaleString()} / {tenant.monthlyCredits.toLocaleString()}
                </span>
              </div>

              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-emerald-500 h-full"
                  style={{ width: `${(tenant.creditsUsed / tenant.monthlyCredits) * 100}%` }}
                ></div>
              </div>

              <p className="text-[11px] text-slate-400 pt-1">
                Próximo ciclo de renovación de créditos el 15 de agosto de 2026. Agentes ilimitados incluidos en el plan Growth.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: ADD AGENT */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center">
                <UserPlus className="w-4 h-4 mr-2 text-emerald-400" />
                Registrar Nuevo Agente
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAgentSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Lucas Ramírez"
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  placeholder="lucas@acme.com"
                  value={newAgentEmail}
                  onChange={(e) => setNewAgentEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Rol Inicial</label>
                <select
                  value={newAgentRole}
                  onChange={(e) => setNewAgentRole(e.target.value as Role)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none"
                >
                  <option value="agent">Agente Estándar (Restringido)</option>
                  <option value="manager">Manager / Supervisor</option>
                  <option value="admin">Administrador General</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:bg-slate-800 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-sm"
                >
                  Registrar Agente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* MODAL: ADD GOAL */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center">
                <Target className="w-4 h-4 mr-2 text-emerald-400" />
                Definir Objetivo de Desempeño ({selectedAgent.name})
              </h3>
              <button onClick={() => setShowGoalModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddGoalSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Título del Objetivo *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Cierre de Ventas ERPNext Q3"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Meta Cuantitativa</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newGoalTarget}
                    onChange={(e) => setNewGoalTarget(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Unidad</label>
                  <input
                    type="text"
                    required
                    placeholder="leads, ventas, chats"
                    value={newGoalUnit}
                    onChange={(e) => setNewGoalUnit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Fecha Límite *</label>
                <input
                  type="date"
                  required
                  value={newGoalDeadline}
                  onChange={(e) => setNewGoalDeadline(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowGoalModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:bg-slate-800 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-sm"
                >
                  Guardar Objetivo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
