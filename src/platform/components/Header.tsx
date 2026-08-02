import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Bell,
  Sparkles,
  Zap,
  Building2,
  ShieldCheck,
  ChevronDown,
  Layers,
  User,
  LogIn,
  LogOut,
  UserPlus,
  Shield,
  Activity
} from 'lucide-react';
import { Tenant, SaaSUserSession } from '../types';

interface HeaderProps {
  tenant: Tenant;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenAIModal?: () => void;
  onOpenActivityStream?: () => void;
  activeTab: string;
  currentUser: SaaSUserSession | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  tenant,
  searchQuery,
  setSearchQuery,
  onOpenAIModal,
  onOpenActivityStream,
  activeTab,
  currentUser,
  onOpenAuthModal,
  onLogout
}) => {
  const creditsPercentage = Math.round((tenant.creditsUsed / tenant.monthlyCredits) * 100);
  const [selectedWorkspace, setSelectedWorkspace] = useState('Principal - LATAM');
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const workspaces = [
    'Principal - LATAM',
    'Sucursal México',
    'Sucursal España',
    'Ventas Enterprise'
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 text-slate-800 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shrink-0 shadow-xs">
      {/* Left: Brand logo & tenant indicator */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center bg-[#0A2558] border border-slate-200/20 shadow-sm shrink-0">
            <img src="/favicon.svg" alt="Clientum Logo" className="w-6 h-6" referrerPolicy="no-referrer" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="font-bold text-sm text-slate-900 leading-tight">Clientum</h1>
              <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 font-mono px-1.5 py-0.2 rounded font-semibold">
                SaaS
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">CRM Suite</p>
          </div>
        </div>

        {/* Workspace Switcher Dropdown */}
        <div className="relative hidden lg:block">
          <button
            onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
            className="flex items-center space-x-2 px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition"
          >
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <span>{selectedWorkspace}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showWorkspaceMenu && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 text-xs">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Espacios de Trabajo
              </div>
              {workspaces.map((ws) => (
                <button
                  key={ws}
                  onClick={() => {
                    setSelectedWorkspace(ws);
                    setShowWorkspaceMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between ${
                    selectedWorkspace === ws ? 'font-bold text-green-700 bg-green-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>{ws}</span>
                  {selectedWorkspace === ws && <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-200">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span>Clientum Cloud: Activo</span>
        </div>
      </div>

      {/* Middle: Global Search Input */}
      <div className="flex-1 max-w-md mx-4 hidden sm:block">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar leads, teléfonos, ofertas o etiquetas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
          />
        </div>
      </div>

      {/* Right: SaaS Credits, AI Assistant & Notifications */}
      <div className="flex items-center space-x-3">
        {/* Credits usage pill */}
        <div className="hidden xl:flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg text-xs">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-slate-500 font-medium">Créditos:</span>
          <span className="font-bold text-slate-800">
            {tenant.creditsUsed.toLocaleString()} / {tenant.monthlyCredits.toLocaleString()}
          </span>
          <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden ml-1">
            <div
              className={`h-full ${creditsPercentage > 80 ? 'bg-amber-500' : 'bg-green-500'}`}
              style={{ width: `${creditsPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* AI Assistant Quick Trigger */}
        <button
          onClick={onOpenAIModal}
          className="flex items-center space-x-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-1.5 rounded shadow-sm transition"
          title="Abrir Copiloto de Ventas IA"
        >
          <Sparkles className="w-3.5 h-3.5 text-green-200 animate-pulse" />
          <span className="hidden sm:inline">Copiloto IA</span>
        </button>

        {/* Activity Stream Button */}
        {onOpenActivityStream && (
          <button
            onClick={onOpenActivityStream}
            className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 transition"
            title="Ver Activity Stream ERPNext en Tiempo Real"
          >
            <Activity className="w-3.5 h-3.5 text-green-600 animate-pulse" />
            <span className="hidden md:inline">Activity Stream</span>
          </button>
        )}

        {/* Notifications */}
        <button
          onClick={onOpenActivityStream}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition relative"
          title="Notificaciones & Eventos"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 rounded-full"></span>
        </button>

        {/* Meta Status Badge */}
        <div className="flex items-center space-x-1.5 text-xs bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-full font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
          <span className="hidden md:inline">Verificado Meta</span>
        </div>

        {/* User Session Profile & Auth Button */}
        <div className="relative">
          {currentUser ? (
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-1.5 hover:bg-slate-100 rounded-xl transition border border-slate-200 bg-slate-50"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-green-500/30"
              />
              <div className="hidden lg:block text-left pr-1">
                <span className="text-xs font-bold text-slate-800 block leading-tight">
                  {currentUser.fullName}
                </span>
                <span className="text-[10px] text-green-700 font-mono font-semibold uppercase block">
                  {currentUser.role} • {currentUser.plan}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg transition shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5 text-green-400" />
              <span>Iniciar Sesión / Registro</span>
            </button>
          )}

          {/* User Profile Dropdown Menu */}
          {showUserMenu && currentUser && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-xs">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
                <p className="font-extrabold text-slate-900 text-xs">{currentUser.fullName}</p>
                <p className="text-[11px] text-slate-500 font-mono truncate">{currentUser.email}</p>
                <div className="mt-2 flex items-center justify-between text-[10px] font-bold">
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded border border-green-200">
                    Plan {currentUser.plan}
                  </span>
                  <span className="text-slate-500 font-mono">{currentUser.subdomain}</span>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenAuthModal();
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center space-x-2 text-slate-700 font-medium"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Cambiar de Usuario / Perfil</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenAuthModal();
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center space-x-2 text-slate-700 font-medium"
                >
                  <UserPlus className="w-4 h-4 text-slate-400" />
                  <span>Registrar Nueva Empresa SaaS</span>
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 flex items-center space-x-2 font-bold transition"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
