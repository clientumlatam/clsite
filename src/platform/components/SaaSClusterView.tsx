import React, { useState } from 'react';
import {
  Server,
  HardDrive,
  Users,
  MessageSquare,
  Plus,
  Search,
  Activity,
  AlertTriangle,
  Globe,
  MapPin,
  Shield,
  RefreshCw,
  X,
  CheckCircle2,
  Database,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Key
} from 'lucide-react';
import { SaaSClusterSite, GeoStateCity, ClusterSiteStatus } from '../types';

interface SaaSClusterViewProps {
  sites: SaaSClusterSite[];
  geoData: GeoStateCity[];
  onCreateSite: (site: SaaSClusterSite) => void;
  onUpdateSiteStatus: (siteId: string, status: ClusterSiteStatus) => void;
}

export const SaaSClusterView: React.FC<SaaSClusterViewProps> = ({
  sites,
  geoData,
  onCreateSite,
  onUpdateSiteStatus
}) => {
  const [activeTab, setActiveTab] = useState<'cluster' | 'quotas' | 'geo'>('cluster');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewSiteModal, setShowNewSiteModal] = useState(false);

  // New Site Form
  const [siteName, setSiteName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [plan, setPlan] = useState<'Growth' | 'Professional' | 'Enterprise'>('Growth');
  const [region, setRegion] = useState<'us-east1 (N. Virginia)' | 'sa-east1 (São Paulo)' | 'eu-west1 (Frankfurt)'>('sa-east1 (São Paulo)');

  const handleCreateSiteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteName || !subdomain) return;

    const fullSubdomain = subdomain.includes('.') ? subdomain : `${subdomain}.clientum.com.ar`;
    const newSite: SaaSClusterSite = {
      id: `site_${Date.now()}`,
      siteName,
      subdomain: fullSubdomain,
      databaseName: `db_${subdomain.replace(/[^a-z0-0]/gi, '_').toLowerCase()}_${Math.floor(Math.random() * 9000 + 1000)}`,
      plan,
      status: 'Active',
      region,
      storageUsedMb: 120,
      storageMaxMb: plan === 'Growth' ? 5000 : plan === 'Professional' ? 10000 : 25000,
      usersUsed: 1,
      usersMax: plan === 'Growth' ? 10 : plan === 'Professional' ? 25 : 100,
      wabaMessagesUsed: 0,
      wabaMessagesMax: plan === 'Growth' ? 10000 : plan === 'Professional' ? 25000 : 100000,
      createdAt: new Date().toISOString().slice(0, 10)
    };

    onCreateSite(newSite);
    setShowNewSiteModal(false);
    setSiteName('');
    setSubdomain('');
  };

  const getStatusBadge = (status: ClusterSiteStatus) => {
    switch (status) {
      case 'Active':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Activo</span>;
      case 'Provisioning':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">Aprovisionando...</span>;
      case 'Suspended':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">Suspendido</span>;
      case 'Maintenance':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">Mantenimiento</span>;
      case 'Backup in Progress':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">Respaldo Cloud</span>;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200 p-4 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Server className="w-5 h-5 text-sky-600" />
            <h1 className="text-xl font-bold text-slate-900">Clientum SaaS Cluster & Platform Manager</h1>
            <span className="text-xs bg-sky-100 text-sky-800 font-mono font-bold px-2 py-0.5 rounded border border-sky-200">
              Cluster Multi-Tenant
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Aprovisionamiento Automático de Instancias Clientum, Control de Quotas de Almacenamiento/WABA y Base de Estados & Ciudades.
          </p>
        </div>

        <button
          onClick={() => setShowNewSiteModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Aprovisionar Nuevo Sitio Client</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6 flex items-center space-x-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('cluster')}
          className={`py-3 flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'cluster' ? 'border-sky-600 text-sky-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Instancias & Sitios Cloud ({sites.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('quotas')}
          className={`py-3 flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'quotas' ? 'border-sky-600 text-sky-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Control de Quotas ERPNext (erpnext_quota)</span>
        </button>

        <button
          onClick={() => setActiveTab('geo')}
          className={`py-3 flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'geo' ? 'border-sky-600 text-sky-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Estados, Ciudades & Fiscalidad LATAM</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {/* TAB 1: SITES CLUSTER */}
        {activeTab === 'cluster' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por subdominio o base de datos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
                <Database className="w-4 h-4 text-sky-600" />
                <span>Base PostgreSQL / MariaDB Cluster: <b className="text-slate-800 font-mono">cluster-us-prod-01.clientum.com.ar</b></span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {sites
                .filter(s => s.siteName.toLowerCase().includes(searchQuery.toLowerCase()) || s.subdomain.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((site) => (
                  <div key={site.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 hover:border-sky-300 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-sm text-slate-900">{site.siteName}</h3>
                          <span className="bg-slate-100 text-slate-700 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200">
                            {site.plan}
                          </span>
                        </div>
                        <a
                          href={`https://${site.subdomain}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-mono font-bold text-sky-600 hover:underline flex items-center space-x-1 mt-0.5"
                        >
                          <span>https://{site.subdomain}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div>{getStatusBadge(site.status)}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Base de Datos</span>
                        <span className="font-mono text-slate-800 font-semibold">{site.databaseName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Región Cloud</span>
                        <span className="text-slate-800 font-semibold">{site.region}</span>
                      </div>
                    </div>

                    {/* Progress meters for storage and WABA */}
                    <div className="space-y-2 text-xs">
                      <div>
                        <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                          <span>Almacenamiento Usado:</span>
                          <span className="font-bold text-slate-800">{site.storageUsedMb} MB / {site.storageMaxMb} MB</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              site.storageUsedMb / site.storageMaxMb > 0.9 ? 'bg-red-500' : 'bg-sky-500'
                            }`}
                            style={{ width: `${Math.min(100, (site.storageUsedMb / site.storageMaxMb) * 100)}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                          <span>Envíos WABA WhatsApp:</span>
                          <span className="font-bold text-slate-800">{site.wabaMessagesUsed} / {site.wabaMessagesMax}</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              site.wabaMessagesUsed / site.wabaMessagesMax > 0.9 ? 'bg-red-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, (site.wabaMessagesUsed / site.wabaMessagesMax) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[10px]">Creado: {site.createdAt}</span>
                      <div className="flex items-center space-x-1.5">
                        {site.status === 'Active' ? (
                          <button
                            onClick={() => onUpdateSiteStatus(site.id, 'Suspended')}
                            className="px-2.5 py-1 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded font-bold text-[11px]"
                          >
                            Suspender
                          </button>
                        ) : (
                          <button
                            onClick={() => onUpdateSiteStatus(site.id, 'Active')}
                            className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded font-bold text-[11px]"
                          >
                            Activar
                          </button>
                        )}
                        <button
                          onClick={() => onUpdateSiteStatus(site.id, 'Maintenance')}
                          className="px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 rounded font-bold text-[11px]"
                        >
                          Mantenimiento
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 2: QUOTAS (erpnext_quota) */}
        {activeTab === 'quotas' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
            <div className="flex items-start space-x-3">
              <Activity className="w-6 h-6 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-slate-900">Módulo ERPNext Quotas & Rate Limits</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Límites de almacenamiento, licencias de usuarios concurrentes y mensajería WhatsApp WABA sincronizados con el app <code className="font-mono text-sky-700">erpnext_quota</code>.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">Storage Total Cluster</span>
                  <HardDrive className="w-4 h-4 text-sky-600" />
                </div>
                <p className="text-xl font-extrabold text-slate-900">10.42 GB / 50.00 GB</p>
                <p className="text-[10px] text-slate-500">20.8% del límite de la infraestructura Cloud</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">Licencias de Usuario Activas</span>
                  <Users className="w-4 h-4 text-sky-600" />
                </div>
                <p className="text-xl font-extrabold text-slate-900">33 / 85 Seats</p>
                <p className="text-[10px] text-slate-500">Suscripciones pagas multi-tenant</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">Consumo WABA WhatsApp</span>
                  <MessageSquare className="w-4 h-4 text-sky-600" />
                </div>
                <p className="text-xl font-extrabold text-slate-900">22,670 Msg / Mes</p>
                <p className="text-[10px] text-slate-500">Créditos de conversaciones Business</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: GEO STATES & CITIES */}
        {activeTab === 'geo' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-slate-800">Base de Datos de Estados, Ciudades & Tasas Fiscales (frappe_states_and_cities)</h3>
                <p className="text-xs text-slate-500">Utilizado para autocompletar direcciones de entrega en la Tienda E-Commerce y calcular impuestos en Facturación ERP.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {geoData.map((item, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-sky-600" />
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{item.stateName}</h4>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">{item.country} ({item.countryCode})</span>
                      </div>
                    </div>
                    <span className="bg-sky-50 text-sky-800 font-bold text-xs px-2 py-0.5 rounded border border-sky-200">
                      IVA: {item.fiscalTaxRate}%
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Ciudades Habilitadas:</span>
                    <div className="flex flex-wrap gap-1">
                      {item.cities.map((city, cIdx) => (
                        <span key={cIdx} className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded">
                          {city}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* NEW SITE MODAL */}
      {showNewSiteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center">
                <Server className="w-4 h-4 mr-2 text-sky-600" />
                Aprovisionar Sitio Clientum SaaS
              </h3>
              <button onClick={() => setShowNewSiteModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSiteSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nombre de la Empresa / Instancia</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Distribuidora del Norte"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Subdominio (.clientum.com.ar)</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    required
                    placeholder="distribuidoranorte"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-l p-2 text-slate-800"
                  />
                  <span className="bg-slate-100 border border-l-0 border-slate-200 px-2 py-2 text-slate-500 font-mono text-[11px] rounded-r">.clientum.com.ar</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Plan SaaS</label>
                  <select
                    value={plan}
                    onChange={(e: any) => setPlan(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800"
                  >
                    <option value="Growth">Growth ($49/mo)</option>
                    <option value="Professional">Professional ($129/mo)</option>
                    <option value="Enterprise">Enterprise ($299/mo)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Región Cloud</label>
                  <select
                    value={region}
                    onChange={(e: any) => setRegion(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800"
                  >
                    <option value="sa-east1 (São Paulo)">sa-east1 (São Paulo)</option>
                    <option value="us-east1 (N. Virginia)">us-east1 (N. Virginia)</option>
                    <option value="eu-west1 (Frankfurt)">eu-west1 (Frankfurt)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg text-[11px] text-sky-900">
                ⚡ El aprovisionamiento ejecuta un script automátizado de Bench para crear la base de datos isolated y configurar las llaves WABA WhatsApp.
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewSiteModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded shadow-xs"
                >
                  Desplegar Sitio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
