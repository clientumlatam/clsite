/**
 * GooglePlacesKeyConfig — Banner + Modal reutilizable para configurar la API key de Google Places.
 * Guarda la clave en localStorage bajo `custom_google_maps_key`.
 * El banner muestra el estado activo/simulado; el modal guía la configuración en 3 pasos.
 */
import React, { useState } from "react";
import {
  Globe, Settings, Key, Info, Lock, AlertTriangle, CheckCircle,
  RefreshCw, ExternalLink, X, Check,
} from "lucide-react";

const LS_KEY = "custom_google_maps_key";

export function useGooglePlacesKey() {
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem(LS_KEY) || "");

  const save = (k: string) => {
    localStorage.setItem(LS_KEY, k);
    setApiKey(k);
  };

  const remove = () => {
    localStorage.removeItem(LS_KEY);
    setApiKey("");
  };

  return { apiKey, save, remove, isActive: Boolean(apiKey && apiKey.trim()) };
}

interface GooglePlacesKeyBannerProps {
  /** key state from useGooglePlacesKey() */
  apiKey: string;
  onOpenModal: () => void;
  /** optional class wrapper */
  className?: string;
}

/** Compact banner that shows real/simulated status + settings gear */
export function GooglePlacesKeyBanner({ apiKey, onOpenModal, className = "" }: GooglePlacesKeyBannerProps) {
  const isActive = Boolean(apiKey && apiKey.trim());

  if (isActive) {
    return (
      <div className={`flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 text-sm text-emerald-300 ${className}`}>
        <Globe className="w-4 h-4 flex-shrink-0 text-emerald-400" />
        <span className="flex-1 text-xs">
          Conexión establecida con Google Places API — datos 100% reales en tiempo real.{" "}
          <span className="opacity-60 font-mono">{apiKey.substring(0, 6)}…{apiKey.slice(-4)}</span>
        </span>
        <button
          onClick={onOpenModal}
          title="Configurar clave"
          className="ml-auto text-emerald-400/60 hover:text-emerald-300 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-[#0A101F]/60 border border-[#1E293B] rounded-xl p-4 flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
          <Globe className="w-4 h-4 text-slate-400" />
          Prospección Local Simulada
        </div>
        <button
          onClick={onOpenModal}
          title="Configurar clave"
          className="text-slate-500 hover:text-emerald-400 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">
        Para obtener empresas 100% reales de Google Maps en tiempo real, introducí tu clave de Google Places.
      </p>
      <button
        onClick={onOpenModal}
        className="mt-1 w-full text-center py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs tracking-wider uppercase transition-colors"
      >
        Configurar Clave Real
      </button>
    </div>
  );
}

interface GooglePlacesKeyModalProps {
  open: boolean;
  onClose: () => void;
  currentKey: string;
  onSave: (key: string) => void;
  onRemove: () => void;
}

/** Full modal with 3-step guide + validation */
export function GooglePlacesKeyModal({ open, onClose, currentKey, onSave, onRemove }: GooglePlacesKeyModalProps) {
  const [input, setInput] = useState(currentKey);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleValidateAndSave = async () => {
    if (!input.trim()) {
      setError("Por favor, ingresá una clave antes de validar.");
      return;
    }
    setValidating(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "validateGooglePlacesKey",
          payload: { apiKey: input.trim() },
        }),
      });
      const data = await res.json();
      if (data.success) {
        onSave(input.trim());
        setSuccess(true);
      } else {
        setError(data.error || "La clave de API no es válida.");
      }
    } catch (err: any) {
      setError("Error de conexión al validar la clave: " + (err.message || err));
    } finally {
      setValidating(false);
    }
  };

  const handleRemove = () => {
    onRemove();
    setInput("");
    setSuccess(false);
    setError(null);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full mx-4 overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-sm">Configuración de API Key: Google Places (New)</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex flex-col gap-4 text-xs text-slate-700 leading-relaxed">

          {/* Quick guide */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm">
              <Info className="w-4 h-4 text-emerald-600" />
              Guía Rápida de Configuración (3 pasos)
            </h4>
            <ol className="list-decimal pl-4 space-y-2 text-slate-600">
              <li>
                Ingresá a la consola de Google Cloud en{" "}
                <a
                  href="https://console.cloud.google.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-600 hover:underline font-semibold inline-flex items-center gap-0.5"
                >
                  console.cloud.google.com <ExternalLink className="w-3 h-3" />
                </a>.
              </li>
              <li>
                Habilitá la API <strong>Places API (New)</strong> en la Biblioteca de APIs.
              </li>
              <li>
                Creá una API Key en <strong>APIs y Servicios → Credenciales</strong>, activá
                la facturación (Google regala crédito mensual gratuito) y pegala abajo.
              </li>
            </ol>
            <div className="flex items-center gap-1.5 text-slate-400 italic bg-white border border-slate-100 rounded-lg px-3 py-2">
              <Lock className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Tu clave se guarda localmente en este navegador de forma 100% segura.</span>
            </div>
          </div>

          {/* Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Ingresar API Key de Google
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="AIzaSy..."
                value={input}
                onChange={e => { setInput(e.target.value); setError(null); setSuccess(false); }}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Validation error */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 rounded-lg p-3 flex flex-col gap-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Clave no válida
              </div>
              <span>{error}</span>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg p-3 flex flex-col gap-1">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                ¡Validación Exitosa!
              </div>
              <span>
                La clave se validó en el servidor y se guardó localmente. Ahora podés buscar negocios en tiempo real.
              </span>
            </div>
          )}

          {/* Active key info */}
          {currentKey && !success && !error && (
            <div className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2.5 flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5 font-medium text-xs">
                <Check className="w-4 h-4 text-emerald-500" />
                Clave activa: {currentKey.substring(0, 6)}…{currentKey.slice(-4)}
              </span>
              <button
                onClick={handleRemove}
                className="text-red-500 hover:text-red-700 font-bold text-[10px] hover:underline transition-colors"
              >
                Remover Clave
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3.5 flex items-center justify-end gap-2.5 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={handleValidateAndSave}
            disabled={validating || !input.trim()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
          >
            {validating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Validando…
              </>
            ) : (
              "Validar y Guardar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Convenience wrapper that manages its own state.
 * Renders: <banner> + <modal> in one drop-in component.
 */
export default function GooglePlacesKeyConfig({ className }: { className?: string }) {
  const { apiKey, save, remove } = useGooglePlacesKey();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <GooglePlacesKeyBanner
        apiKey={apiKey}
        onOpenModal={() => setShowModal(true)}
        className={className}
      />
      <GooglePlacesKeyModal
        open={showModal}
        onClose={() => setShowModal(false)}
        currentKey={apiKey}
        onSave={k => { save(k); }}
        onRemove={remove}
      />
    </>
  );
}
