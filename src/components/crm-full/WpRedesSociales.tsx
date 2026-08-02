import React, { useState, useCallback } from 'react';
import {
  Share2, CheckCircle2, Loader2, Sparkles, Calendar,
  Copy, Trash2, RefreshCw, AlertCircle, BookOpen, ArrowRight
} from 'lucide-react';

// ── Tipos ─────────────────────────────────────────────────────────────────────

type Red = 'instagram' | 'facebook' | 'linkedin';
type Status = 'programado' | 'publicado' | 'borrador';

interface Post {
  id: string;
  red: Red;
  copy: string;
  hashtags: string[];
  status: Status;
  fecha: string;
  isAI?: boolean;
}

// ── Config visual por red ─────────────────────────────────────────────────────

const RED_CFG: Record<Red, { label: string; color: string; bg: string; border: string; icon: string }> = {
  instagram: { label: 'Globe', color: 'text-pink-400',  bg: 'bg-pink-400/10',  border: 'border-pink-500/30',  icon: '📸' },
  facebook:  { label: 'Facebook',  color: 'text-blue-400',  bg: 'bg-blue-400/10',  border: 'border-blue-500/30',  icon: '👤' },
  linkedin:  { label: 'LinkedIn',  color: 'text-sky-400',   bg: 'bg-sky-400/10',   border: 'border-sky-500/30',   icon: '💼' },
};

const STATUS_CFG: Record<Status, { label: string; color: string; bg: string }> = {
  publicado:  { label: 'Publicado',  color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/30' },
  programado: { label: 'Programado', color: 'text-sky-400',     bg: 'bg-sky-400/10 border-sky-400/30' },
  borrador:   { label: 'Borrador',   color: 'text-slate-400',   bg: 'bg-slate-400/10 border-slate-400/30' },
};

const TONES = ['profesional y cercano', 'emotivo y motivacional', 'humorístico', 'urgente / oferta', 'educativo'];

// ── Posts iniciales ───────────────────────────────────────────────────────────

const INITIAL_POSTS: Post[] = [
  {
    id: '1', red: 'instagram', status: 'publicado', fecha: '15 Jul',
    copy: '🎯 ¿Cuántos leads perdés porque no podés responder a tiempo?\n\nEn Clientum automatizamos tu WhatsApp para que NINGUNA consulta quede sin respuesta — ni los domingos, ni a las 11 de la noche.\n\n✅ Bot que responde en segundos\n✅ Califica leads automáticamente\n✅ Te avisa cuando es hora de llamar vos\n\nEste mes 20% OFF en Plan PyME. 👇',
    hashtags: ['CRM', 'WhatsApp', 'PyME', 'Patagonia', 'Clientum'],
  },
  {
    id: '2', red: 'linkedin', status: 'programado', fecha: '20 Jul 10:00',
    copy: 'Las PyMEs del interior argentino no tienen tiempo para tecnología compleja. Por eso construimos Clientum.\n\nUn sistema que se implementa en 5 días, en español rioplatense, con soporte humano 24/7. Sin contratos mínimos.\n\nDespués de 10 años digitalizando empresas de la Patagonia, entendemos que la tecnología tiene que trabajar para el negocio — no al revés.',
    hashtags: ['Startup', 'PyMEs', 'Tecnología', 'Argentina', 'CRM'],
  },
  {
    id: '3', red: 'facebook', status: 'borrador', fecha: '—',
    copy: '🌟 Caso de éxito: Terbay Propiedades\n\n"El bot califica los interesados, les envía fotos y planos, y agenda visitas solo. Nosotros entramos a cerrar."\n\n¿Querés que tu empresa también trabaje así? Pedí tu demo gratuita 👉',
    hashtags: ['Inmobiliaria', 'Automatización', 'Clientum', 'Patagonia'],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

async function apiFetch(action: string, payload: Record<string, unknown>) {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ action, payload }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
  return data;
}

let nextId = 100;

// ── Componente ────────────────────────────────────────────────────────────────

export default function WpRedesSociales() {
  const [posts, setPosts]           = useState<Post[]>(INITIAL_POSTS);
  const [selectedRed, setSelectedRed] = useState<Red | 'all'>('all');
  const [view, setView]             = useState<'posts' | 'crear' | 'repurpose'>('posts');

  // Generador
  const [genTopic, setGenTopic]     = useState('');
  const [genRed, setGenRed]         = useState<Red>('instagram');
  const [genTone, setGenTone]       = useState(TONES[0]);
  const [generating, setGenerating] = useState(false);
  const [genResult, setGenResult]   = useState<{ copy: string; hashtags: string[]; suggestion_fecha: string } | null>(null);
  const [genError, setGenError]     = useState<string | null>(null);

  // Repurpose
  const [rpContent, setRpContent]   = useState('');
  const [rpLoading, setRpLoading]   = useState(false);
  const [rpResult, setRpResult]     = useState<Record<string, { copy: string; hashtags: string[] }> | null>(null);

  const filteredPosts = selectedRed === 'all' ? posts : posts.filter(p => p.red === selectedRed);

  const generatePost = useCallback(async () => {
    if (!genTopic.trim()) return;
    setGenerating(true);
    setGenResult(null);
    setGenError(null);
    try {
      const data = await apiFetch('generateSocialPost', {
        topic: genTopic.trim(),
        red: genRed,
        tone: genTone,
        include_hashtags: true,
      });
      if (data.result) setGenResult(data.result);
      else throw new Error('Sin resultado');
    } catch (e: any) {
      setGenError(e.message ?? 'Error al generar el post');
    } finally {
      setGenerating(false);
    }
  }, [genTopic, genRed, genTone]);

  const savePost = (status: Status) => {
    if (!genResult) return;
    const now = new Date();
    const fechaStr = status === 'programado' && genResult.suggestion_fecha
      ? genResult.suggestion_fecha
      : status === 'publicado'
      ? now.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
      : '—';
    const newPost: Post = {
      id: String(++nextId),
      red: genRed,
      copy: genResult.copy,
      hashtags: genResult.hashtags,
      status,
      fecha: fechaStr,
      isAI: true,
    };
    setPosts(prev => [newPost, ...prev]);
    setGenResult(null);
    setGenTopic('');
    setView('posts');
  };

  const deletePost = (id: string) => setPosts(prev => prev.filter(p => p.id !== id));

  const markPublished = (id: string) => {
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, status: 'publicado', fecha: new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }) } : p
    ));
  };

  const repurpose = useCallback(async () => {
    if (!rpContent.trim()) return;
    setRpLoading(true);
    setRpResult(null);
    try {
      const data = await apiFetch('repurposeContent', {
        content: rpContent,
        source_type: 'artículo de blog',
        targets: ['instagram', 'linkedin', 'facebook'],
      });
      if (data.result?.adaptaciones) setRpResult(data.result.adaptaciones);
    } catch {}
    finally { setRpLoading(false); }
  }, [rpContent]);

  const addRepurposePost = (red: string, copy: string, hashtags: string[]) => {
    const newPost: Post = {
      id: String(++nextId),
      red: red as Red,
      copy,
      hashtags,
      status: 'borrador',
      fecha: '—',
      isAI: true,
    };
    setPosts(prev => [newPost, ...prev]);
  };

  // Stats
  const pubCount  = posts.filter(p => p.status === 'publicado').length;
  const progCount = posts.filter(p => p.status === 'programado').length;
  const borrCount = posts.filter(p => p.status === 'borrador').length;

  return (
    <div className="space-y-8 text-slate-200">

      {/* Header */}
      <div className="flex items-start gap-4 flex-wrap">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <Share2 className="w-7 h-7 text-pink-400" />
            <h1 className="text-2xl font-bold text-white">Redes Sociales</h1>
            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Activo
            </span>
          </div>
          <p className="text-slate-400 text-sm max-w-2xl">
            Generá y programá posts para Globe, Facebook y LinkedIn con IA. Reutilizá contenido del blog automáticamente para cada red.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Posts publicados', value: pubCount,  color: 'border-emerald-500/30', icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" /> },
          { label: 'Programados',      value: progCount, color: 'border-sky-500/30',     icon: <Calendar    className="w-5 h-5 text-sky-400" /> },
          { label: 'Borradores',       value: borrCount, color: 'border-slate-500/30',   icon: <Share2      className="w-5 h-5 text-slate-400" /> },
        ].map(s => (
          <div key={s.label} className={`bg-[#0A101F]/60 border ${s.color} rounded-xl p-4`}>
            <div className="flex items-center justify-between mb-2">{s.icon}<span className="text-2xl font-bold text-white">{s.value}</span></div>
            <p className="text-xs text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Sub-nav */}
      <div className="flex gap-2 border-b border-[#1E293B]">
        {([
          { v: 'posts',     label: '📋 Posts' },
          { v: 'crear',     label: '✍️ Crear con IA' },
          { v: 'repurpose', label: '♻️ Reutilizar contenido' },
        ] as const).map(({ v, label }) => (
          <button key={v} onClick={() => setView(v)}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-all -mb-px ${
              view === v ? 'border-pink-400 text-pink-300 bg-pink-500/5' : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* ── TAB: Posts ─────────────────────────────────────────────────────────── */}
      {view === 'posts' && (
        <div className="space-y-4">
          {/* Red filter */}
          <div className="flex gap-2 flex-wrap">
            {(['all', 'instagram', 'facebook', 'linkedin'] as const).map(r => (
              <button key={r} onClick={() => setSelectedRed(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  selectedRed === r
                    ? r === 'all' ? 'bg-slate-700 border-slate-500 text-white' : `${RED_CFG[r].bg} ${RED_CFG[r].border} ${RED_CFG[r].color}`
                    : 'bg-transparent border-[#1E293B] text-slate-500 hover:text-slate-300'
                }`}>
                {r === 'all' ? 'Todas las redes' : `${RED_CFG[r].icon} ${RED_CFG[r].label}`}
              </button>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <Share2 className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No hay posts para esta red todavía.</p>
              <button onClick={() => setView('crear')} className="mt-3 text-pink-400 text-xs font-semibold hover:text-pink-300 flex items-center gap-1 mx-auto">
                Crear el primero con IA <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {filteredPosts.map(p => {
            const r = RED_CFG[p.red];
            const s = STATUS_CFG[p.status];
            return (
              <div key={p.id} className={`bg-[#0A101F]/60 border ${r.border} rounded-xl p-5`}>
                {/* Meta row */}
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span className="text-lg">{r.icon}</span>
                  <span className={`text-xs font-bold ${r.color}`}>{r.label}</span>
                  {p.isAI && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-pink-500/10 border border-pink-500/20 text-pink-400 rounded font-mono">IA</span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${s.bg} ${s.color} font-semibold ml-auto`}>{s.label}</span>
                  {p.status === 'programado' && (
                    <span className="text-xs text-slate-500 flex items-center gap-1"><Calendar className="w-3 h-3" />{p.fecha}</span>
                  )}
                </div>

                {/* Copy */}
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap mb-3">{p.copy}</p>

                {/* Hashtags */}
                {p.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {p.hashtags.map(h => (
                      <span key={h} className={`text-xs px-2 py-0.5 rounded-full ${r.bg} ${r.color} border ${r.border}`}>#{h}</span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => navigator.clipboard.writeText(p.copy + (p.hashtags.length ? '\n\n' + p.hashtags.map(h => `#${h}`).join(' ') : ''))}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#1E293B] text-slate-400 hover:text-slate-200 hover:bg-[#1E293B] transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copiar
                  </button>
                  {p.status !== 'publicado' && (
                    <button
                      onClick={() => markPublished(p.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Marcar publicado
                    </button>
                  )}
                  <button
                    onClick={() => deletePost(p.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all ml-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── TAB: Crear post con IA ──────────────────────────────────────────────── */}
      {view === 'crear' && (
        <div className="bg-[#0A101F]/60 border border-[#1E293B] rounded-xl p-6 space-y-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-400" /> Generador de posts con IA
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Red */}
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2 block">Red social</label>
              <div className="flex gap-2">
                {(['instagram', 'facebook', 'linkedin'] as Red[]).map(r => (
                  <button key={r} onClick={() => setGenRed(r)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                      genRed === r ? `${RED_CFG[r].bg} ${RED_CFG[r].border} ${RED_CFG[r].color}` : 'bg-transparent border-[#1E293B] text-slate-500 hover:text-slate-300'
                    }`}>
                    {RED_CFG[r].icon} {RED_CFG[r].label.slice(0, 5)}
                  </button>
                ))}
              </div>
            </div>

            {/* Tono */}
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2 block">Tono</label>
              <select
                value={genTone}
                onChange={e => setGenTone(e.target.value)}
                className="w-full bg-[#030712] border border-[#1E293B] rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-pink-500/40"
              >
                {TONES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Tema */}
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2 block">Tema del post</label>
            <input
              value={genTopic}
              onChange={e => setGenTopic(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generatePost()}
              placeholder="Ej: Demo gratuita de CRM para ferreterías del Alto Valle"
              className="w-full bg-[#030712] border border-[#1E293B] rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-pink-500/40"
            />
          </div>

          {genError && (
            <div className="flex items-center gap-2 text-xs text-red-400">
              <AlertCircle className="w-3.5 h-3.5" />{genError}
            </div>
          )}

          <button
            onClick={generatePost}
            disabled={generating || !genTopic.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-pink-500/10 border border-pink-500/30 text-pink-400 rounded-lg text-sm font-semibold hover:bg-pink-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {generating ? 'Generando con IA…' : 'Generar post'}
          </button>

          {/* Resultado */}
          {genResult && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-pink-400 uppercase tracking-wider font-semibold">Post generado por IA</p>
                <button onClick={generatePost} className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" /> Regenerar
                </button>
              </div>

              <textarea
                value={genResult.copy}
                onChange={e => setGenResult(prev => prev ? { ...prev, copy: e.target.value } : null)}
                rows={10}
                className="w-full bg-[#030712] border border-pink-500/20 rounded-lg px-4 py-3 text-xs text-slate-300 leading-relaxed resize-none focus:outline-none focus:border-pink-500/40"
              />

              {genResult.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {genResult.hashtags.map(h => (
                    <span key={h} className="text-xs px-2 py-0.5 rounded-full bg-pink-400/10 border border-pink-500/20 text-pink-400">#{h}</span>
                  ))}
                </div>
              )}

              {genResult.suggestion_fecha && (
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Hora sugerida: <strong className="text-slate-300">{genResult.suggestion_fecha}</strong>
                </p>
              )}

              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => savePost('programado')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-sky-500/10 border border-sky-500/30 text-sky-400 rounded-lg text-xs font-semibold hover:bg-sky-500/20 transition-all"
                >
                  <Calendar className="w-3.5 h-3.5" /> Programar
                </button>
                <button
                  onClick={() => savePost('borrador')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#0A101F] border border-[#1E293B] text-slate-400 rounded-lg text-xs font-semibold hover:text-slate-200 transition-all"
                >
                  Guardar borrador
                </button>
                <button
                  onClick={() => savePost('publicado')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-semibold hover:bg-emerald-500/20 transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Marcar como publicado
                </button>
              </div>
            </div>
          )}

          <div className="p-3 bg-pink-500/5 border border-pink-500/20 rounded-lg text-xs text-pink-300">
            <strong>CRM:</strong> Los posts sobre servicios se pueden coordinar con las campañas de <strong>Outreach del CRM</strong>.
          </div>
        </div>
      )}

      {/* ── TAB: Reutilizar contenido ──────────────────────────────────────────── */}
      {view === 'repurpose' && (
        <div className="bg-[#0A101F]/60 border border-[#1E293B] rounded-xl p-6 space-y-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-violet-400" /> Reutilizar contenido del blog
          </h2>
          <p className="text-xs text-slate-400">Pegá un artículo de blog o copy de landing y la IA lo adapta automáticamente para Globe, LinkedIn y Facebook.</p>

          <textarea
            value={rpContent}
            onChange={e => setRpContent(e.target.value)}
            rows={8}
            placeholder="Pegá acá el texto del artículo o landing page que querés adaptar para redes sociales..."
            className="w-full bg-[#030712] border border-[#1E293B] rounded-lg px-4 py-3 text-xs text-slate-300 leading-relaxed resize-none focus:outline-none focus:border-violet-500/40 placeholder:text-slate-600"
          />

          <button
            onClick={repurpose}
            disabled={rpLoading || !rpContent.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-violet-500/10 border border-violet-500/30 text-violet-400 rounded-lg text-sm font-semibold hover:bg-violet-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {rpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {rpLoading ? 'Adaptando con IA…' : 'Adaptar para todas las redes'}
          </button>

          {rpResult && (
            <div className="space-y-4">
              <p className="text-xs text-violet-400 uppercase tracking-wider font-semibold">Adaptaciones generadas por IA</p>
              {Object.entries(rpResult).map(([red, val]) => {
                const { copy, hashtags } = val as { copy: string; hashtags: string[] };
                const r = RED_CFG[red as Red];
                if (!r) return null;
                return (
                  <div key={red} className={`border ${r.border} rounded-xl p-4 space-y-3`}>
                    <div className="flex items-center gap-2">
                      <span>{r.icon}</span>
                      <span className={`text-xs font-bold ${r.color}`}>{r.label}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{copy}</p>
                    {hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {hashtags.map(h => (
                          <span key={h} className={`text-xs px-2 py-0.5 rounded-full ${r.bg} ${r.color} border ${r.border}`}>#{h}</span>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => addRepurposePost(red, copy, hashtags)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg ${r.bg} border ${r.border} ${r.color} hover:opacity-80 transition-all`}
                    >
                      <ArrowRight className="w-3.5 h-3.5" /> Guardar como borrador
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
