import React, { useState } from 'react';
import { FileText, CheckCircle2, Sparkles, Copy, Loader2, BookOpen, ShoppingBag, Share2, LayoutTemplate } from 'lucide-react';

type TipoContenido = 'blog' | 'landing' | 'producto' | 'social';

const TIPOS: { id: TipoContenido; label: string; icon: React.ReactNode; desc: string; placeholder: string }[] = [
  { id: 'blog', label: 'Artículo de Blog', icon: <BookOpen className="w-4 h-4" />, desc: 'SEO optimizado para PyMEs', placeholder: 'Ej: "5 razones para digitalizar tu ferretería en 2026"' },
  { id: 'landing', label: 'Copy de Landing', icon: <LayoutTemplate className="w-4 h-4" />, desc: 'Por industria, alto impacto', placeholder: 'Ej: Landing para clínica odontológica en Neuquén' },
  { id: 'producto', label: 'Descripción WooCommerce', icon: <ShoppingBag className="w-4 h-4" />, desc: 'Conversión e-commerce', placeholder: 'Ej: Taladro percutor 750W — ferretería' },
  { id: 'social', label: 'Post Redes Sociales', icon: <Share2 className="w-4 h-4" />, desc: 'Globe · Facebook · LinkedIn', placeholder: 'Ej: Promoción 20% off en servicio CRM este mes' },
];

const SAMPLE_OUTPUTS: Record<TipoContenido, string> = {
  blog: `# 5 Razones para Digitalizar tu Ferretería en 2026

¿Seguís anotando pedidos en un cuaderno? Te entendemos. Pero la competencia ya no.

El comercio minorista en el Alto Valle está cambiando rápido, y las ferreterías que adoptan tecnología hoy van a ser las que sobrevivan (y crezcan) mañana.

**1. Control de stock en tiempo real**
Con un sistema integrado, sabés exactamente qué tenés sin contar físico. Cada venta descuenta automáticamente del inventario.

**2. WhatsApp como canal de ventas**
El 80% de tus clientes ya te escribe por WhatsApp. Un chatbot IA puede responder consultas de stock y precios las 24 horas, sin que vos estés presente.

**3. Facturación AFIP automática**
Cada venta genera su factura electrónica sola. Sin errores, sin demoras, sin multas.

**4. Historial de cada cliente**
Sabé qué compró, cuándo y cuánto gasta. Eso es CRM en su forma más simple y poderosa.

**5. Vendé online sin complicarte**
Una tienda WooCommerce sincronizada con tu stock físico. Pedidos 24/7, pagos con MercadoPago.`,

  landing: `## Más pacientes. Menos tiempo en el teléfono.

**Para clínicas y consultorios del Alto Valle que quieren crecer sin contratar más personal.**

---

Imaginate que cada paciente pueda reservar su turno a las 2 AM, sin llamarte a vos, sin esperar que abras.

Eso es lo que hace el sistema Clientum para tu clínica.

**→ Turnos automáticos por WhatsApp**  
**→ Recordatorios que reducen ausentismo un 40%**  
**→ Historial clínico integrado al CRM**  
**→ Facturación en segundos**

Sin contratos mínimos. Implementación en 5 días hábiles.

[**Pedí tu demo gratuita →**]`,

  producto: `**Taladro Percutor 750W — Profesional**

La herramienta que no te va a fallar cuando más la necesitás.

Motor de 750W con percusión ajustable, ideal para mampostería, madera y metal. Empuñadura antideslizante y maletín de transporte incluido.

**Especificaciones:**
- Potencia: 750W
- Velocidad máxima: 3.000 rpm
- Capacidad en acero: 13 mm
- Capacidad en madera: 30 mm  
- Capacidad en mampostería: 16 mm
- Peso: 1.8 kg

**Incluye:** broca set 5 piezas, maletín rígido, garantía 2 años.

Stock disponible · Envío a toda la Patagonia · MercadoPago cuotas sin interés`,

  social: `🎯 ¿Cuántos leads perdés porque no podés responder a tiempo?

En Clientum automatizamos tu WhatsApp para que NINGUNA consulta quede sin respuesta — ni los domingos, ni a las 11 de la noche.

✅ Bot que responde en segundos
✅ Califica si el lead es caliente o frío
✅ Te avisa solo cuando es hora de llamar vos

Este mes tenemos 20% OFF en el Plan PyME. ⬇️

👉 Escribinos "INFO" y te mandamos los detalles en 2 minutos.

#CRM #WhatsApp #PyME #Patagonia #Clientum #NegociosDigitales`,
};

export default function WpContenido() {
  const [tipo, setTipo] = useState<TipoContenido>('blog');
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setOutput('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'assistantChat',
          payload: {
            message: `Actuá como experto en marketing digital para PyMEs argentinas de la Patagonia. Generá ${TIPOS.find(t => t.id === tipo)?.label ?? 'contenido'} sobre el siguiente tema. Usá español rioplatense, tono directo y conversacional. No uses saludos ni introducciones — devolvé directamente el contenido listo para usar. Tema: ${prompt}`,
            history: [],
            contextNote: `Tipo de contenido: ${TIPOS.find(t => t.id === tipo)?.label ?? tipo}`,
          },
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOutput(data.result || SAMPLE_OUTPUTS[tipo]);
    } catch {
      setOutput(SAMPLE_OUTPUTS[tipo]);
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 text-slate-200">
      {/* Header */}
      <div className="flex items-start gap-4 flex-wrap">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <FileText className="w-7 h-7 text-emerald-400" />
            <h1 className="text-2xl font-bold text-white">Generador de Contenido</h1>
            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Activo
            </span>
          </div>
          <p className="text-slate-400 text-sm max-w-2xl">
            Generá artículos, copies de landing, descripciones de productos y posts para redes sociales con IA. Optimizado para PyMEs de la Patagonia.
          </p>
        </div>
      </div>

      {/* Tipo selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {TIPOS.map(t => (
          <button
            key={t.id}
            onClick={() => { setTipo(t.id); setOutput(''); setPrompt(''); }}
            className={`flex flex-col items-start gap-2 p-4 rounded-xl border text-left transition-all ${
              tipo === t.id
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                : 'bg-[#0A101F]/60 border-[#1E293B] text-slate-400 hover:border-emerald-500/20 hover:text-slate-300'
            }`}
          >
            {t.icon}
            <div>
              <p className="text-xs font-bold leading-tight">{t.label}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{t.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Generator */}
      <div className="bg-[#0A101F]/60 border border-[#1E293B] rounded-xl p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" /> Generador IA
        </h2>
        <div>
          <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2 block">
            Tema o descripción del contenido
          </label>
          <input
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && generate()}
            placeholder={TIPOS.find(t => t.id === tipo)?.placeholder}
            className="w-full bg-[#030712] border border-[#1E293B] rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/40"
          />
        </div>
        <button
          onClick={generate}
          disabled={loading || !prompt.trim()}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-sm font-semibold hover:bg-emerald-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {loading ? 'Generando...' : 'Generar con IA'}
        </button>

        {!output && !loading && (
          <div className="space-y-2">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Vista previa — ejemplo de salida</p>
            <div
              className="bg-[#030712]/80 border border-[#1E293B] rounded-lg p-4 text-xs text-slate-400 leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto cursor-pointer hover:border-emerald-500/20 transition-colors"
              onClick={() => setOutput(SAMPLE_OUTPUTS[tipo])}
            >
              {SAMPLE_OUTPUTS[tipo].slice(0, 300)}…
              <span className="text-emerald-500"> (clic para usar este ejemplo)</span>
            </div>
          </div>
        )}

        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-emerald-400 uppercase tracking-wider font-semibold">Contenido generado</p>
              <button onClick={copy} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors">
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            </div>
            <textarea
              readOnly
              value={output}
              rows={14}
              className="w-full bg-[#030712] border border-emerald-500/20 rounded-lg px-4 py-3 text-xs text-slate-300 font-mono leading-relaxed resize-none focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Features */}
      <div className="bg-[#0A101F]/60 border border-[#1E293B] rounded-xl p-6">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Capacidades del módulo
        </h2>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            'Artículos de blog optimizados para SEO',
            'Copies de landing pages por industria',
            'Descripciones de productos WooCommerce',
            'Adaptación al español rioplatense',
          ].map(f => (
            <div key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />{f}
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-xs text-emerald-300">
          <strong>CRM:</strong> Generá contenido directamente desde Clientum con el módulo <strong>Copiloto IA</strong>.
        </div>
      </div>
    </div>
  );
}
