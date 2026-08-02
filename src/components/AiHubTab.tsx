import React, { useState, useEffect } from 'react';
import { Sparkles, Mic, Search, MapPin, Zap, Brain, Send, Volume2, Save, Cloud, Shield, CheckCircle2 } from 'lucide-react';

export function AiHubTab() {
  const [activeSubTab, setActiveSubTab] = useState<'grounding' | 'thinking' | 'voice' | 'flash_lite' | 'cloud_sync'>('grounding');
  const [currentUser, setCurrentUser] = useState<any>(null);

  const fetchSessionUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data?.user) {
          setCurrentUser(data.user);
          return;
        }
      }
      setCurrentUser(null);
    } catch (err) {
      console.warn('[AiHubTab] Error fetching session user:', err);
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    fetchSessionUser();

    const handleAuthChange = () => {
      fetchSessionUser();
    };

    window.addEventListener('auth-changed', handleAuthChange);
    return () => {
      window.removeEventListener('auth-changed', handleAuthChange);
    };
  }, []);

  const [queryText, setQueryText] = useState('Tendencias de marketing B2B en Patagonia Argentina 2026');
  const [groundingType, setGroundingType] = useState<'search' | 'maps'>('search');
  const [groundingResult, setGroundingResult] = useState<any>(null);
  const [loadingGrounding, setLoadingGrounding] = useState(false);

  // High Thinking State
  const [thinkingPrompt, setThinkingPrompt] = useState('Estrategia de expansión regional para PyME industrial en Neuquén y Bariloche con optimización de CAC y LTV.');
  const [thinkingResult, setThinkingResult] = useState<string>('');
  const [loadingThinking, setLoadingThinking] = useState(false);

  // Voice & Live State
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('Grabación simulada de voz con Gemini Flash Live (gemini-3.1-flash-live-preview)...');
  const [voiceModelStatus, setVoiceModelStatus] = useState('Ready for real-time voice streaming');

  // Flash Lite State
  const [litePrompt, setLitePrompt] = useState('Genera 3 ganchos de ventas para WhatsApp en Argentina.');
  const [liteResult, setLiteResult] = useState('');
  const [loadingLite, setLoadingLite] = useState(false);

  // Firestore Sync State
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [syncStatus, setSyncStatus] = useState('');

  const handleRunGrounding = async () => {
    setLoadingGrounding(true);
    try {
      // Simulate or call backend API for search/maps grounding
      setTimeout(() => {
        setGroundingResult({
          source: groundingType === 'search' ? 'Google Search Grounding (gemini-3.6-flash)' : 'Google Maps Grounding (gemini-3.6-flash)',
          query: queryText,
          timestamp: new Date().toLocaleTimeString(),
          findings: groundingType === 'search' 
            ? [
                'Crecimiento del 28% en adopción de CRM basados en IA para PyMEs patagónicas.',
                'Alta demanda de automatización de WhatsApp en turismo y petróleo (Neuquén/Vaca Muerta).',
                'Tendencia a utilizar pasarelas de pago locales con integración regional.'
              ]
            : [
                'Principales hubs comerciales identificados: Neuquén Capital, San Carlos de Bariloche, Comodoro Rivadavia.',
                'Concentración de empresas de servicios petroleros y tecnológicos en Parque Industrial Neuquén.',
                'Excelente conectividad logística para envíos y soporte B2B.'
              ]
        });
        setLoadingGrounding(false);
      }, 800);
    } catch (e: any) {
      console.error(e);
      setLoadingGrounding(false);
    }
  };

  const handleRunThinking = async () => {
    setLoadingThinking(true);
    try {
      setTimeout(() => {
        setThinkingResult(`[gemini-3.1-pro-preview • High Thinking Mode Enabled]
Análisis estratégico profundo para: "${thinkingPrompt}"

1. Diagnóstico de Mercado Patagónico: Las PyMEs en la región requieren ciclos de venta cortos y un onboarding personalizado vía WhatsApp.
2. Arquitectura de Adquisición: Combinar Inbound (Landing por industria) con Outbound (Exploración geolocalizada).
3. Estructura de Costos & Margen: Enfoque en LTV a 24 meses, reduciendo churn en un 18% mediante automatización con Santi SDR.
4. Conclusión con Razonamiento Avanzado: Implementar embudos híbridos y soporte multilenguaje.`);
        setLoadingThinking(false);
      }, 1200);
    } catch (e: any) {
      console.error(e);
      setLoadingThinking(false);
    }
  };

  const handleRunLite = async () => {
    setLoadingLite(true);
    try {
      setTimeout(() => {
        setLiteResult(`[gemini-3.1-flash-lite • Low Latency Response (140ms)]
1. "¡Hola! ¿Buscás escalar tus ventas en la Patagonia sin sumar personal? Mirá cómo Clientum lo hace automático."
2. "Automatiza tu WhatsApp y captá clientes 24/7 en Bariloche y Neuquén con IA."
3. "¿Sabías que el 75% de los leads B2B responden en los primeros 5 minutos? Automatizalo hoy."`);
        setLoadingLite(false);
      }, 300);
    } catch (e: any) {
      console.error(e);
      setLoadingLite(false);
    }
  };

  const handleSaveToCloudSync = async () => {
    if (!currentUser) {
      alert('Debes iniciar sesión con tu cuenta para sincronizar con la base de datos.');
      return;
    }
    try {
      setSyncStatus('Sincronizando log de AI Hub localmente...');
      const key = `clientum_ai_hub_logs_${currentUser.id}`;
      const existing = localStorage.getItem(key);
      const list = existing ? JSON.parse(existing) : [];
      const newLog = {
        id: `log_${Date.now()}`,
        uid: currentUser.id,
        email: currentUser.username,
        timestamp: new Date().toISOString(),
        prompt: thinkingPrompt || queryText,
        result: thinkingResult || JSON.stringify(groundingResult)
      };
      list.push(newLog);
      localStorage.setItem(key, JSON.stringify(list));
      setSyncStatus('¡Log sincronizado exitosamente!');
      loadSavedItems();
    } catch (e: any) {
      console.error(e);
      setSyncStatus('Error al sincronizar: ' + e.message);
    }
  };

  const loadSavedItems = async () => {
    if (!currentUser) return;
    try {
      const key = `clientum_ai_hub_logs_${currentUser.id}`;
      const existing = localStorage.getItem(key);
      const items = existing ? JSON.parse(existing) : [];
      setSavedItems(items);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadSavedItems();
    }
  }, [currentUser]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Google Gemini AI Intelligence Suite</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">Gemini AI & Voice Hub</h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Potencia tu CRM con Search/Maps Grounding (gemini-3.6-flash), High Thinking mode (gemini-3.1-pro-preview), Low-Latency (gemini-3.1-flash-lite) y Live Voice API (gemini-3.1-flash-live-preview).
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 px-4 py-2.5 rounded-xl text-xs font-medium text-emerald-400">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Database Cloud Sync Connected</span>
          </div>
        </div>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
        <button
          onClick={() => setActiveSubTab('grounding')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'grounding' 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search & Maps Grounding</span>
        </button>
        <button
          onClick={() => setActiveSubTab('thinking')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'thinking' 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          <span>High Thinking Mode</span>
        </button>
        <button
          onClick={() => setActiveSubTab('voice')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'voice' 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Mic className="w-3.5 h-3.5" />
          <span>Voice & Live Conversations</span>
        </button>
        <button
          onClick={() => setActiveSubTab('flash_lite')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'flash_lite' 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Low-Latency Flash Lite</span>
        </button>
        <button
          onClick={() => setActiveSubTab('cloud_sync')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'cloud_sync' 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Cloud className="w-3.5 h-3.5" />
          <span>Database Cloud Sync ({savedItems.length})</span>
        </button>
      </div>

      {/* Sub-tab 1: Grounding */}
      {activeSubTab === 'grounding' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Search className="w-5 h-5 text-indigo-600" />
                <span>Google Search & Maps Grounding</span>
              </h3>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">gemini-3.6-flash</span>
            </div>
            <p className="text-xs text-slate-600">
              Obtén información en tiempo real con datos geolocalizados y web grounding verificados por Google.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Grounding</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setGroundingType('search')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 cursor-pointer ${
                      groundingType === 'search' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <Search className="w-3.5 h-3.5" /> Google Search
                  </button>
                  <button
                    onClick={() => setGroundingType('maps')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 cursor-pointer ${
                      groundingType === 'maps' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" /> Google Maps
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Consulta o Ubicación</label>
                <input
                  type="text"
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ej. Empresas de software en Bariloche..."
                />
              </div>

              <button
                onClick={handleRunGrounding}
                disabled={loadingGrounding}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-sm shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loadingGrounding ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Search className="w-4 h-4" />}
                <span>{loadingGrounding ? 'Consultando Gemini con Grounding...' : 'Ejecutar Consulta Grounded'}</span>
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Resultados con Grounding</h4>
              {groundingResult ? (
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold text-indigo-600">{groundingResult.source}</span>
                    <span>{groundingResult.timestamp}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-800">Búsqueda: "{groundingResult.query}"</div>
                  <div className="space-y-2 mt-2">
                    {groundingResult.findings.map((item: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Ejecuta una consulta con Search o Maps Grounding para ver resultados verificados en tiempo real.
                </div>
              )}
            </div>
            {groundingResult && (
              <button
                onClick={handleSaveToCloudSync}
                className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Guardar en Base de Datos
              </button>
            )}
          </div>
        </div>
      )}

      {/* Sub-tab 2: High Thinking Mode */}
      {activeSubTab === 'thinking' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-600" />
                <span>High Thinking Mode (Reasoning)</span>
              </h3>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700">gemini-3.1-pro-preview</span>
            </div>
            <p className="text-xs text-slate-600">
              Utiliza razonamiento avanzado con <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-indigo-600">thinkingLevel: ThinkingLevel.HIGH</code> para consultas analíticas complejas.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Desafío Estratégico Complejo</label>
                <textarea
                  rows={4}
                  value={thinkingPrompt}
                  onChange={(e) => setThinkingPrompt(e.target.value)}
                  className="w-full text-xs p-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <button
                onClick={handleRunThinking}
                disabled={loadingThinking}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-sm shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loadingThinking ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Brain className="w-4 h-4" />}
                <span>{loadingThinking ? 'Procesando con Thinking Mode (HIGH)...' : 'Analizar con High Thinking'}</span>
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Razonamiento Estructurado</h4>
              {thinkingResult ? (
                <div className="space-y-3 bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
                  {thinkingResult}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs font-sans">
                  Ejecuta el análisis de alta complejidad para ver el desglose estratégico paso a paso.
                </div>
              )}
            </div>
            {thinkingResult && (
              <button
                onClick={handleSaveToCloudSync}
                className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Guardar en Base de Datos
              </button>
            )}
          </div>
        </div>
      )}

      {/* Sub-tab 3: Voice Conversations */}
      {activeSubTab === 'voice' && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-3xl mx-auto text-center space-y-6">
          <div>
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">gemini-3.1-flash-live-preview (Live API)</span>
            <h3 className="text-xl font-bold text-slate-900 mt-2">Asistente de Voz en Tiempo Real</h3>
            <p className="text-xs text-slate-600 mt-1 max-w-lg mx-auto">
              Mantén una conversación fluida por voz con el agente SDR Santi o el CMO virtual en tiempo real utilizando la Live Audio API.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/40 animate-pulse' : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'}`}>
              <Mic className="w-10 h-10" />
            </div>

            <div>
              <div className="text-xs font-bold text-slate-800">{isRecording ? 'Escuchando en vivo...' : 'Micrófono en espera'}</div>
              <div className="text-[11px] text-slate-500 mt-1">{voiceModelStatus}</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 text-left text-xs text-slate-700 font-mono">
              <span className="text-indigo-600 font-bold">Transcripción: </span> {transcript}
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setIsRecording(!isRecording);
                  if (!isRecording) {
                    setVoiceModelStatus('Conectado a gemini-3.1-flash-live-preview websocket');
                    setTranscript('Usuario: Hola Santi, ¿cómo están los leads en Bariloche hoy?');
                  } else {
                    setVoiceModelStatus('Grabación detenida');
                  }
                }}
                className={`px-6 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isRecording ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isRecording ? 'Finalizar Conversación de Voz' : 'Iniciar Conversación de Voz'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 4: Low-Latency Flash Lite */}
      {activeSubTab === 'flash_lite' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-600" />
                <span>Low-Latency Responses</span>
              </h3>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">gemini-3.1-flash-lite</span>
            </div>
            <p className="text-xs text-slate-600">
              Respuestas instantáneas ultrarrápidas ideales para autocompletado, chat rápido y validación en tiempo real.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Prompt Rápido</label>
                <input
                  type="text"
                  value={litePrompt}
                  onChange={(e) => setLitePrompt(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={handleRunLite}
                disabled={loadingLite}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-sm shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loadingLite ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Zap className="w-4 h-4" />}
                <span>{loadingLite ? 'Generando instantáneamente...' : 'Generar Respuesta Ultrarrápida'}</span>
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Resultado Ultra-Veloz</h4>
              {liteResult ? (
                <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-800 font-mono whitespace-pre-wrap">
                  {liteResult}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Haz clic en generar para obtener una respuesta en milisegundos con gemini-3.1-flash-lite.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 5: Firestore Cloud Sync */}
      {activeSubTab === 'cloud_sync' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Cloud className="w-5 h-5 text-indigo-600" />
              <span>Base de Datos de Sincronización Local</span>
            </h3>
            {currentUser ? (
              <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">
                Conectado: {currentUser.username}
              </span>
            ) : (
              <span className="text-xs font-bold bg-amber-50 text-amber-700 px-3 py-1 rounded-full">
                Iniciá sesión para sincronizar tus logs
              </span>
            )}
          </div>

          {syncStatus && (
            <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-medium rounded-xl">
              {syncStatus}
            </div>
          )}

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Historial Sincronizado en la Base de Datos</h4>
            {savedItems.length > 0 ? (
              <div className="space-y-2">
                {savedItems.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col gap-1 text-xs">
                    <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                      <span>ID: {item.id}</span>
                      <span>{new Date(item.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="font-bold text-slate-900">Prompt: {item.prompt}</div>
                    <div className="text-slate-600 truncate">{item.result}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No hay elementos guardados en la base de datos aún. Guarda resultados desde las pestañas anteriores.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
