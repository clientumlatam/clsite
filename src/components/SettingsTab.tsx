import React, { useState } from 'react';
import { Settings, CheckCircle2, Key, Globe, Users, Plus, Trash2, Mail, Lock, Zap } from 'lucide-react';

export function SettingsTab() {
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'apikeys' | 'domains' | 'team'>('apikeys');
  const [appName, setAppName] = useState('ClientumLatam - AI Marketing Expert');
  const [saved, setSaved] = useState(false);

  // API Keys state matching user-requested keys
  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: 'Gemini AI Production', key: 'Alzaby90', service: 'gemini', created: '2024-03-01' },
    { id: 2, name: 'OpenAI Fallback', key: '4784', service: 'openai', created: '2024-02-16' },
    { id: 3, name: 'SendGrid Marketing', key: '85...819', service: 'sendgrid', created: '2023-11-20' },
  ]);

  // New API Key input states
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');
  const [newKeyService, setNewKeyService] = useState('gemini');
  const [showAddKeyForm, setShowAddKeyForm] = useState(false);

  // Sender Domains state
  const [domains, setDomains] = useState([
    { id: 1, domain: 'clientumlatam.com', status: 'verified', dkim: true, spf: true },
    { id: 2, domain: 'mail.clientumlatam.com', status: 'pending', dkim: false, spf: true },
  ]);

  const [newDomain, setNewDomain] = useState('');
  const [showAddDomainForm, setShowAddDomainForm] = useState(false);

  // Team Access state
  const [team, setTeam] = useState([
    { id: 1, name: 'Admin User', email: 'admin@clientumlatam.com', role: 'Owner' },
    { id: 2, name: 'Sales Agent', email: 'sales@clientumlatam.com', role: 'Editor' },
    { id: 3, name: 'Marketing Pro', email: 'marketing@clientumlatam.com', role: 'Viewer' },
  ]);

  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Editor');
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAddKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName || !newKeyValue) return;
    const newId = apiKeys.length > 0 ? Math.max(...apiKeys.map(k => k.id)) + 1 : 1;
    setApiKeys([
      ...apiKeys,
      {
        id: newId,
        name: newKeyName,
        key: newKeyValue,
        service: newKeyService,
        created: new Date().toISOString().split('T')[0],
      }
    ]);
    setNewKeyName('');
    setNewKeyValue('');
    setShowAddKeyForm(false);
  };

  const handleDeleteKey = (id: number) => {
    setApiKeys(apiKeys.filter(k => k.id !== id));
  };

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain) return;
    const newId = domains.length > 0 ? Math.max(...domains.map(d => d.id)) + 1 : 1;
    setDomains([
      ...domains,
      {
        id: newId,
        domain: newDomain,
        status: 'pending',
        dkim: false,
        spf: true,
      }
    ]);
    setNewDomain('');
    setShowAddDomainForm(false);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName || !newMemberEmail) return;
    const newId = team.length > 0 ? Math.max(...team.map(t => t.id)) + 1 : 1;
    setTeam([
      ...team,
      {
        id: newId,
        name: newMemberName,
        email: newMemberEmail,
        role: newMemberRole,
      }
    ]);
    setNewMemberName('');
    setNewMemberEmail('');
    setShowAddMemberForm(false);
  };

  return (
    <div id="settings-container-root" className="space-y-6">
      {/* Header card */}
      <div id="settings-header-card" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex items-center space-x-3">
        <div id="settings-icon-wrapper" className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 text-white flex items-center justify-center font-bold shadow-lg">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h2 id="settings-header-title" className="text-xl font-bold text-slate-900">Platform Settings / Ajustes de Plataforma</h2>
          <p id="settings-header-subtitle" className="text-sm text-slate-500">Manage API keys, sender domains, and team access across all modules.</p>
        </div>
      </div>

      <div id="settings-main-layout" className="flex flex-col lg:flex-row gap-6">
        {/* Settings Sidebar */}
        <div id="settings-sidebar-nav" className="w-full lg:w-64 flex-shrink-0">
          <nav className="flex flex-col space-y-1">
            <button
              id="subtab-btn-general"
              onClick={() => setActiveSubTab('general')}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-colors text-left ${
                activeSubTab === 'general' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Settings className="w-4 h-4" /> General Settings
            </button>
            <button
              id="subtab-btn-apikeys"
              onClick={() => setActiveSubTab('apikeys')}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-colors text-left ${
                activeSubTab === 'apikeys' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Key className="w-4 h-4" /> API Keys & Integrations
            </button>
            <button
              id="subtab-btn-domains"
              onClick={() => setActiveSubTab('domains')}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-colors text-left ${
                activeSubTab === 'domains' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Globe className="w-4 h-4" /> Sender Domains
            </button>
            <button
              id="subtab-btn-team"
              onClick={() => setActiveSubTab('team')}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-colors text-left ${
                activeSubTab === 'team' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" /> Team Access
            </button>
          </nav>
        </div>

        {/* Settings Content */}
        <div id="settings-content-wrapper" className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-xs min-h-[500px]">
          {activeSubTab === 'general' && (
            <div id="settings-pane-general" className="p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">General Preferences / Preferencias Generales</h3>
              <form id="settings-general-form" onSubmit={handleSave} className="space-y-5 max-w-lg">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Workspace Name / Nombre del Espacio de Trabajo</label>
                  <input
                    id="settings-input-appname"
                    type="text"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    required
                  />
                </div>
                {saved && (
                  <div id="settings-general-saved-alert" className="p-3 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Preferences saved / Cambios guardados!
                  </div>
                )}
                <div className="pt-2">
                  <button
                    id="settings-general-save-btn"
                    type="submit"
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                  >
                    Save Changes / Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeSubTab === 'apikeys' && (
            <div id="settings-pane-apikeys" className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">API Keys & Integrations / Claves de API e Integraciones</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Manage credentials for core platform automation tools.</p>
                </div>
                <button
                  id="settings-addkey-toggle-btn"
                  onClick={() => setShowAddKeyForm(!showAddKeyForm)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Key
                </button>
              </div>

              {showAddKeyForm && (
                <form id="settings-addkey-form" onSubmit={handleAddKey} className="mb-6 p-4 border border-indigo-100 bg-indigo-50/30 rounded-xl space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Key Name / Nombre de Clave</label>
                      <input
                        id="new-key-name-input"
                        type="text"
                        placeholder="e.g. Claude Opus Production"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">API Key / Clave</label>
                      <input
                        id="new-key-value-input"
                        type="text"
                        placeholder="e.g. AIzaSy..."
                        value={newKeyValue}
                        onChange={(e) => setNewKeyValue(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Service / Servicio</label>
                      <select
                        id="new-key-service-select"
                        value={newKeyService}
                        onChange={(e) => setNewKeyService(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500 focus:outline-none bg-white"
                      >
                        <option value="gemini">Gemini AI</option>
                        <option value="openai">OpenAI</option>
                        <option value="sendgrid">SendGrid</option>
                        <option value="other">Other / Otro</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      id="settings-addkey-cancel-btn"
                      type="button"
                      onClick={() => setShowAddKeyForm(false)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700"
                    >
                      Cancel / Cancelar
                    </button>
                    <button
                      id="settings-addkey-submit-btn"
                      type="submit"
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors"
                    >
                      Save Key / Guardar Clave
                    </button>
                  </div>
                </form>
              )}
              
              <div id="settings-keys-list" className="space-y-4">
                {apiKeys.map(apiKey => (
                  <div id={`key-item-${apiKey.id}`} key={apiKey.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-indigo-200 hover:shadow-2xs transition-all bg-slate-50/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                        {apiKey.service === 'gemini' ? <Zap className="w-5 h-5 text-purple-500" /> : <Lock className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{apiKey.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <code className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono">{apiKey.key}</code>
                          <span className="text-[11px] text-slate-500">Added / Agregada {apiKey.created}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      id={`delete-key-btn-${apiKey.id}`}
                      onClick={() => handleDeleteKey(apiKey.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Eliminar clave"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubTab === 'domains' && (
            <div id="settings-pane-domains" className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Sender Domains / Dominios de Remitente</h3>
                  <p className="text-xs text-slate-500 mt-1">Configure authenticated domains to improve email deliverability / Configura dominios autorizados para mejorar entregabilidad.</p>
                </div>
                <button
                  id="settings-adddomain-toggle-btn"
                  onClick={() => setShowAddDomainForm(!showAddDomainForm)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Domain
                </button>
              </div>

              {showAddDomainForm && (
                <form id="settings-adddomain-form" onSubmit={handleAddDomain} className="mb-6 p-4 border border-indigo-100 bg-indigo-50/30 rounded-xl space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Domain Name / Dominio</label>
                      <input
                        id="new-domain-input"
                        type="text"
                        placeholder="e.g. miservicio.com"
                        value={newDomain}
                        onChange={(e) => setNewDomain(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      id="settings-adddomain-cancel-btn"
                      type="button"
                      onClick={() => setShowAddDomainForm(false)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700"
                    >
                      Cancel / Cancelar
                    </button>
                    <button
                      id="settings-adddomain-submit-btn"
                      type="submit"
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors"
                    >
                      Add Domain / Agregar Dominio
                    </button>
                  </div>
                </form>
              )}

              <div id="settings-domains-list" className="space-y-4">
                {domains.map(dom => (
                  <div id={`domain-item-${dom.id}`} key={dom.id} className="p-4 border border-slate-200 rounded-xl flex items-center justify-between bg-slate-50/50">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="font-bold text-sm text-slate-800">{dom.domain}</span>
                        {dom.status === 'verified' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wider">Verified</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-wider">Pending</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-[11px]">
                          <div className={`w-1.5 h-1.5 rounded-full ${dom.dkim ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          <span className={dom.dkim ? 'text-slate-700 font-medium' : 'text-slate-400'}>DKIM</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px]">
                          <div className={`w-1.5 h-1.5 rounded-full ${dom.spf ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          <span className={dom.spf ? 'text-slate-700 font-medium' : 'text-slate-400'}>SPF</span>
                        </div>
                      </div>
                    </div>
                    <button
                      id={`manage-dns-btn-${dom.id}`}
                      className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      Manage DNS / Gestionar DNS
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubTab === 'team' && (
            <div id="settings-pane-team" className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Team Access / Acceso de Equipo</h3>
                  <p className="text-xs text-slate-500 mt-1">Configure users who can manage campaigns and integrations.</p>
                </div>
                <button
                  id="settings-addmember-toggle-btn"
                  onClick={() => setShowAddMemberForm(!showAddMemberForm)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs rounded-lg text-sm font-semibold transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Invite Member
                </button>
              </div>

              {showAddMemberForm && (
                <form id="settings-addmember-form" onSubmit={handleAddMember} className="mb-6 p-4 border border-indigo-100 bg-indigo-50/30 rounded-xl space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Member Name / Nombre</label>
                      <input
                        id="new-member-name-input"
                        type="text"
                        placeholder="e.g. Martín Gómez"
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Email / Correo Electrónico</label>
                      <input
                        id="new-member-email-input"
                        type="email"
                        placeholder="e.g. martin@clientumlatam.com"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Role / Rol</label>
                      <select
                        id="new-member-role-select"
                        value={newMemberRole}
                        onChange={(e) => setNewMemberRole(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500 focus:outline-none bg-white"
                      >
                        <option value="Owner">Owner (Propietario)</option>
                        <option value="Editor">Editor</option>
                        <option value="Viewer">Viewer (Lector)</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      id="settings-addmember-cancel-btn"
                      type="button"
                      onClick={() => setShowAddMemberForm(false)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700"
                    >
                      Cancel / Cancelar
                    </button>
                    <button
                      id="settings-addmember-submit-btn"
                      type="submit"
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors"
                    >
                      Invite / Invitar
                    </button>
                  </div>
                </form>
              )}

              <div id="settings-team-table-wrapper" className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <table id="settings-team-table" className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <th className="px-4 py-3">User / Usuario</th>
                      <th className="px-4 py-3">Role / Rol</th>
                      <th className="px-4 py-3 text-right">Actions / Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm">
                    {team.map(member => (
                      <tr id={`team-row-${member.id}`} key={member.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-800">{member.name}</div>
                          <div className="text-[11px] text-slate-500">{member.email}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-600">
                            {member.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button id={`edit-member-btn-${member.id}`} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
