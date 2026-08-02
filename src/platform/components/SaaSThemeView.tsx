import React, { useState } from 'react';
import {
  Palette,
  Layout,
  Type,
  Code,
  Eye,
  Check,
  RotateCcw,
  Sparkles,
  Sliders,
  Image,
  Monitor,
  Smartphone,
  Globe,
  Sun,
  Moon,
  Layers,
  Save,
  Wand2
} from 'lucide-react';
import { SaaSThemeConfig } from '../types';

interface SaaSThemeViewProps {
  themeConfig: SaaSThemeConfig;
  onUpdateThemeConfig: (config: SaaSThemeConfig) => void;
}

export const SaaSThemeView: React.FC<SaaSThemeViewProps> = ({
  themeConfig,
  onUpdateThemeConfig
}) => {
  const [config, setConfig] = useState<SaaSThemeConfig>(themeConfig);
  const [activeTab, setActiveTab] = useState<'presets' | 'colors' | 'layout' | 'css' | 'preview'>('presets');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const presets = [
    {
      id: 'theme_obsidian',
      name: 'Clientum Obsidian Dark',
      description: 'Estilo moderno oscuro con acentos azul neón y glassmorphism',
      primaryColor: '#0284c7',
      accentColor: '#10b981',
      sidebarStyle: 'Dark Glass' as const,
      loginTheme: 'Split Modern' as const,
      previewBg: 'bg-slate-900'
    },
    {
      id: 'theme_clean_light',
      name: 'Corporate Emerald Light',
      description: 'Interfaz limpia y minimalista ideal para empresas y Clientum Sales Hub',
      primaryColor: '#059669',
      accentColor: '#0284c7',
      sidebarStyle: 'Minimal Light' as const,
      loginTheme: 'Centered Card' as const,
      previewBg: 'bg-slate-100'
    },
    {
      id: 'theme_cyber',
      name: 'Zaviago Cyber Violet',
      description: 'Paleta vibrante para e-commerce y startups SaaS de alto impacto',
      primaryColor: '#7c3aed',
      accentColor: '#ec4899',
      sidebarStyle: 'Dark Glass' as const,
      loginTheme: 'Split Modern' as const,
      previewBg: 'bg-slate-950'
    },
    {
      id: 'theme_minimal',
      name: 'Minimal Slate Mono',
      description: 'Enfoque ejecutivo sobrio sin distracciones visuales',
      primaryColor: '#334155',
      accentColor: '#475569',
      sidebarStyle: 'Compact Icons' as const,
      loginTheme: 'Minimal Slate' as const,
      previewBg: 'bg-slate-50'
    }
  ];

  const handleApplyPreset = (preset: typeof presets[0]) => {
    const updated: SaaSThemeConfig = {
      ...config,
      presetName: preset.name,
      primaryColor: preset.primaryColor,
      accentColor: preset.accentColor,
      sidebarStyle: preset.sidebarStyle,
      loginTheme: preset.loginTheme,
      activeThemeId: preset.id
    };
    setConfig(updated);
    onUpdateThemeConfig(updated);
    showSaveNotification();
  };

  const handleSaveConfig = () => {
    onUpdateThemeConfig(config);
    showSaveNotification();
  };

  const showSaveNotification = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200 p-4 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Palette className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900">Clientum SaaS Theme Engine (saas_theme)</h1>
            <span className="text-xs bg-indigo-100 text-indigo-800 font-mono font-bold px-2 py-0.5 rounded border border-indigo-200">
              Personalización de Branding & UI
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Personaliza la interfaz de Clientum Desk, Sales Hub, Portales de Clientes y Login con temas SaaS de alto rendimiento.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {savedSuccess && (
            <span className="flex items-center space-x-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg font-bold">
              <Check className="w-3.5 h-3.5" />
              <span>Tema Guardado</span>
            </span>
          )}
          <button
            onClick={handleSaveConfig}
            className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Cambios de Tema</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="bg-white border-b border-slate-200 px-6 flex items-center justify-between text-xs font-semibold">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => setActiveTab('presets')}
            className={`py-3 flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'presets' ? 'border-indigo-600 text-indigo-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Presets de Estilos</span>
          </button>

          <button
            onClick={() => setActiveTab('colors')}
            className={`py-3 flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'colors' ? 'border-indigo-600 text-indigo-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Colores & Tipografía</span>
          </button>

          <button
            onClick={() => setActiveTab('layout')}
            className={`py-3 flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'layout' ? 'border-indigo-600 text-indigo-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layout className="w-4 h-4" />
            <span>Estructura & Logo</span>
          </button>

          <button
            onClick={() => setActiveTab('css')}
            className={`py-3 flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'css' ? 'border-indigo-600 text-indigo-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Inyección CSS Custom</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`py-3 flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'preview' ? 'border-indigo-600 text-indigo-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Vista Previa Clientum Desk</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {/* TAB 1: PRESETS */}
        {activeTab === 'presets' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Selecciona un Tema Predefinido (saas_theme Presets)</h2>
              <p className="text-xs text-slate-500 mt-0.5">Aplica transformaciones de color, bordes y estilos de navegación instantáneamente en todas las instancias del cluster.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {presets.map((preset) => {
                const isSelected = config.activeThemeId === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset)}
                    className={`cursor-pointer bg-white border-2 rounded-2xl p-5 space-y-4 transition ${
                      isSelected ? 'border-indigo-600 ring-2 ring-indigo-100 shadow-md' : 'border-slate-200 hover:border-indigo-300 shadow-xs'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                          <span>{preset.name}</span>
                          {isSelected && (
                            <span className="bg-indigo-100 text-indigo-800 text-[10px] font-extrabold px-2 py-0.5 rounded border border-indigo-200">
                              Activo
                            </span>
                          )}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">{preset.description}</p>
                      </div>
                    </div>

                    {/* Color swatches preview */}
                    <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-4 h-4 rounded-full border border-slate-300" style={{ backgroundColor: preset.primaryColor }} />
                        <span className="font-mono text-[11px] text-slate-700">{preset.primaryColor}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-4 h-4 rounded-full border border-slate-300" style={{ backgroundColor: preset.accentColor }} />
                        <span className="font-mono text-[11px] text-slate-700">{preset.accentColor}</span>
                      </div>
                      <div className="ml-auto text-[10px] font-bold text-slate-500">
                        Sidebar: {preset.sidebarStyle}
                      </div>
                    </div>

                    {/* Mini UI Layout preview mockup */}
                    <div className={`p-3 rounded-xl border border-slate-200 ${preset.previewBg} space-y-2`}>
                      <div className="flex items-center justify-between">
                        <div className="w-16 h-2 bg-slate-400/40 rounded" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: preset.primaryColor }} />
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: preset.accentColor }} />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        <div className="h-10 bg-slate-700/30 rounded border border-slate-600/20 p-1">
                          <div className="w-8 h-1.5 bg-slate-400/50 rounded mb-1" />
                          <div className="w-5 h-1.5 bg-slate-400/30 rounded" />
                        </div>
                        <div className="h-10 bg-slate-700/30 rounded border border-slate-600/20 p-1">
                          <div className="w-8 h-1.5 bg-slate-400/50 rounded mb-1" />
                          <div className="w-5 h-1.5 bg-slate-400/30 rounded" />
                        </div>
                        <div className="h-10 bg-slate-700/30 rounded border border-slate-600/20 p-1">
                          <div className="w-8 h-1.5 bg-slate-400/50 rounded mb-1" />
                          <div className="w-5 h-1.5 bg-slate-400/30 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: COLORS & TYPOGRAPHY */}
        {activeTab === 'colors' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 max-w-2xl">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Ajustes Finos de Colores & Tipografía</h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Color Primario de Botones y Header</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                    className="w-10 h-10 rounded border border-slate-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.primaryColor}
                    onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 font-mono w-32"
                  />
                  <span className="text-slate-400 text-[11px]">Utilizado en botones de acción y estado activo</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Color Secundario / Acento</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={config.accentColor}
                    onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                    className="w-10 h-10 rounded border border-slate-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.accentColor}
                    onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                    className="bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 font-mono w-32"
                  />
                  <span className="text-slate-400 text-[11px]">Utilizado para highlights de badges y ventas</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tipografía Principal del Sistema</label>
                <select
                  value={config.fontFamily}
                  onChange={(e: any) => setConfig({ ...config, fontFamily: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2.5 text-slate-800"
                >
                  <option value="Plus Jakarta Sans">Plus Jakarta Sans (Recomendado SaaS)</option>
                  <option value="Inter">Inter (Limpio & Estándar)</option>
                  <option value="Geist">Geist (Modern Tech)</option>
                  <option value="Outfit">Outfit (Moderna & Redondeada)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LAYOUT & LOGO */}
        {activeTab === 'layout' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 max-w-2xl">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Estructura, Logo & Portal de Login</h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Estilo de Menú / Sidebar</label>
                <select
                  value={config.sidebarStyle}
                  onChange={(e: any) => setConfig({ ...config, sidebarStyle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2.5 text-slate-800"
                >
                  <option value="Dark Glass">Dark Glass (Fondo Oscuro con Efecto Cristal)</option>
                  <option value="Minimal Light">Minimal Light (Fondo Blanco Limpio)</option>
                  <option value="Compact Icons">Compact Icons (Iconos Compactos)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Estilo del Portal de Login Clientum</label>
                <select
                  value={config.loginTheme}
                  onChange={(e: any) => setConfig({ ...config, loginTheme: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2.5 text-slate-800"
                >
                  <option value="Split Modern">Split Modern (Imagen Lateral + Formulario)</option>
                  <option value="Centered Card">Centered Card (Tarjeta Flotante Centrada)</option>
                  <option value="Minimal Slate">Minimal Slate (Estilo Sobrio Fondo Oscuro)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">URL de Logo Personalizado</label>
                <input
                  type="text"
                  value={config.brandLogoUrl}
                  onChange={(e) => setConfig({ ...config, brandLogoUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 font-mono"
                  placeholder="https://tu-dominio.com/logo.png"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Texto de Pie de Página (Footer)</label>
                <input
                  type="text"
                  value={config.customFooterText}
                  onChange={(e) => setConfig({ ...config, customFooterText: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CUSTOM CSS */}
        {activeTab === 'css' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Inyección de Estilos CSS Personalizados</h2>
                <p className="text-xs text-slate-500">Agrega reglas CSS globales que sobreescriben la apariencia de Clientum Desk y Sales Hub.</p>
              </div>
              <Code className="w-5 h-5 text-indigo-600" />
            </div>

            <textarea
              value={config.customCss}
              onChange={(e) => setConfig({ ...config, customCss: e.target.value })}
              rows={12}
              className="w-full bg-slate-900 text-slate-100 font-mono text-xs rounded-xl p-4 focus:outline-none border border-slate-800"
            />
          </div>
        )}

        {/* TAB 5: PREVIEW */}
        {activeTab === 'preview' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-800">Simulador de Clientum Desk con saas_theme Aplicado</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded text-xs flex items-center space-x-1 ${previewDevice === 'desktop' ? 'bg-indigo-100 text-indigo-800 font-bold' : 'text-slate-500'}`}
                >
                  <Monitor className="w-4 h-4" />
                  <span>Desktop</span>
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded text-xs flex items-center space-x-1 ${previewDevice === 'mobile' ? 'bg-indigo-100 text-indigo-800 font-bold' : 'text-slate-500'}`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Móvil</span>
                </button>
              </div>
            </div>

            {/* Simulated Frame */}
            <div className={`mx-auto bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all ${
              previewDevice === 'desktop' ? 'w-full max-w-5xl h-[520px]' : 'w-[360px] h-[550px]'
            }`}>
              {/* Fake Browser Header */}
              <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center space-x-2">
                <div className="flex space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 bg-slate-950 text-slate-400 font-mono text-[10px] text-center rounded py-0.5 border border-slate-800">
                  https://app.clientum.com.ar/app/sales-order
                </div>
              </div>

              {/* Fake Frappe Desk UI */}
              <div className="flex h-full text-slate-100" style={{ fontFamily: config.fontFamily }}>
                {/* Fake Sidebar */}
                <div className="w-48 bg-slate-900 border-r border-slate-800 p-3 space-y-4 shrink-0">
                  <div className="flex items-center space-x-2 pb-2 border-b border-slate-800">
                    <img src={config.brandLogoUrl} alt="Logo" className="w-6 h-6 rounded object-cover" />
                    <span className="text-xs font-bold text-white truncate">Acme ERP</span>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="px-2 py-1.5 rounded text-white font-bold flex items-center justify-between" style={{ backgroundColor: config.primaryColor }}>
                      <span>Ventas ERP</span>
                    </div>
                    <div className="px-2 py-1.5 rounded text-slate-400 hover:text-white">CRM Inbox</div>
                    <div className="px-2 py-1.5 rounded text-slate-400 hover:text-white">Inventario</div>
                    <div className="px-2 py-1.5 rounded text-slate-400 hover:text-white">Facturación</div>
                  </div>
                </div>

                {/* Fake Desk Body */}
                <div className="flex-1 bg-slate-950 p-6 space-y-4 overflow-y-auto">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <h3 className="text-base font-bold text-white">Orden de Venta SAL-ORD-2026-0042</h3>
                    <button className="px-3 py-1 rounded text-xs font-bold text-white shadow-xs" style={{ backgroundColor: config.primaryColor }}>
                      Enviar WhatsApp
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-1">
                      <span className="text-slate-400 text-[10px]">Monto Total</span>
                      <p className="text-sm font-bold text-white">$1,450.00 USD</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-1">
                      <span className="text-slate-400 text-[10px]">Estado Factura</span>
                      <p className="text-xs font-bold text-emerald-400">Pagado</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-1">
                      <span className="text-slate-400 text-[10px]">WABA Notificado</span>
                      <p className="text-xs font-bold text-sky-400">Entregado</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
