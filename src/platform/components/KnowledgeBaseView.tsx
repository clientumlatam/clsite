import React, { useState } from 'react';
import {
  Brain,
  Search,
  Plus,
  Sparkles,
  FileText,
  Database,
  CheckCircle2,
  Tag,
  Cpu,
  Layers,
  ArrowRight,
  Bot,
  Copy,
  Check,
  Zap,
  BookOpen,
  Filter,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { KnowledgeDocument, Agent } from '../types';

interface KnowledgeBaseViewProps {
  knowledgeDocs: KnowledgeDocument[];
  onAddKnowledgeDoc: (doc: KnowledgeDocument) => void;
  onDeleteKnowledgeDoc?: (docId: string) => void;
  currentAgent: Agent;
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({
  knowledgeDocs,
  onAddKnowledgeDoc,
  onDeleteKnowledgeDoc,
  currentAgent
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Vector Search Test state
  const [vectorQuery, setVectorQuery] = useState<string>('');
  const [isSearchingVector, setIsSearchingVector] = useState<boolean>(false);
  const [vectorSearchResults, setVectorSearchResults] = useState<
    { doc: KnowledgeDocument; score: number; matchChunk: string }[] | null
  >(null);
  const [aiGeneratedReply, setAiGeneratedReply] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Add Document Modal state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<
    'Politicas' | 'Precios y Planes' | 'Soporte Técnico' | 'FAQS' | 'Procedimientos ERP'
  >('Precios y Planes');
  const [newContent, setNewContent] = useState<string>('');
  const [newTags, setNewTags] = useState<string>('SaaS, RAG, Precios');

  // Filter docs
  const filteredDocs = knowledgeDocs.filter((doc) => {
    const matchesCategory =
      selectedCategory === 'Todas' || doc.category === selectedCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Calculate Vector Search
  const handleVectorSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!vectorQuery.trim()) return;

    setIsSearchingVector(true);
    setVectorSearchResults(null);
    setAiGeneratedReply('');

    setTimeout(() => {
      const q = vectorQuery.toLowerCase();
      const results = knowledgeDocs.map((doc) => {
        let score = 0.55;
        if (q.includes('precio') || q.includes('plan') || q.includes('costo') || q.includes('enterprise')) {
          if (doc.category === 'Precios y Planes') score = 0.964;
        } else if (q.includes('factura') || q.includes('zatca') || q.includes('erpnext') || q.includes('afip')) {
          if (doc.category === 'Procedimientos ERP') score = 0.941;
        } else if (q.includes('whatsapp') || q.includes('waba') || q.includes('bot') || q.includes('meta')) {
          if (doc.category === 'FAQS') score = 0.928;
        } else {
          score = Math.min(0.98, 0.65 + Math.random() * 0.28);
        }

        const lines = doc.content.split('\n');
        const matchChunk = lines[0] || doc.content.slice(0, 150);

        return { doc, score, matchChunk };
      });

      results.sort((a, b) => b.score - a.score);
      const topResults = results.slice(0, 2);
      setVectorSearchResults(topResults);

      // Generate mock RAG reply grounded in context
      const topDoc = topResults[0]?.doc;
      if (topDoc) {
        setAiGeneratedReply(
          `🤖 [Respuesta Generada por AI Copilot RAG]:\n\nBasado en la documentación corporativa "${topDoc.title}":\n\n${topDoc.content.slice(
            0,
            240
          )}...\n\n¿Te gustaría que envíe esta respuesta formateada directamente por WhatsApp al cliente?`
        );
      }
      setIsSearchingVector(false);
    }, 700);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const tagsArray = newTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newDoc: KnowledgeDocument = {
      id: `kb_${Date.now()}`,
      title: newTitle,
      category: newCategory,
      content: newContent,
      fileType: 'Manual Upload / Text Chunk',
      tags: tagsArray.length > 0 ? tagsArray : ['General'],
      embeddingVectorCount: Math.floor(60 + Math.random() * 80),
      updatedAt: new Date().toISOString().slice(0, 10),
      author: currentAgent.name,
      status: 'Indexed'
    };

    onAddKnowledgeDoc(newDoc);
    setShowAddModal(false);
    setNewTitle('');
    setNewContent('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-green-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Brain className="w-64 h-64 text-green-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-green-500/20 text-green-300 font-mono text-xs font-bold px-3 py-1 rounded-full border border-green-500/30">
              <Cpu className="w-3.5 h-3.5" />
              <span>Vector RAG Engine • Gemini 2.5 Flash Embeddings</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Base de Conocimiento Empresarial (RAG)
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Indexá documentos, manuales de ventas, políticas y procedimientos ERP. El copiloto AI procesa búsquedas semánticas vectoriales para responder chats de WhatsApp con precisión corporativa.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 bg-green-500 hover:bg-green-600 text-slate-950 font-extrabold rounded-2xl shadow-lg transition flex items-center justify-center space-x-2 shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>Indexar Documento</span>
          </button>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-700/50 text-xs">
          <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-2xl border border-slate-700/60">
            <span className="text-slate-400 text-[10px] font-bold uppercase">Documentos Indexados</span>
            <p className="text-xl font-extrabold text-white mt-1">{knowledgeDocs.length}</p>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-2xl border border-slate-700/60">
            <span className="text-slate-400 text-[10px] font-bold uppercase">Vectores Activos</span>
            <p className="text-xl font-extrabold text-green-400 mt-1">
              {knowledgeDocs.reduce((sum, d) => sum + (d.embeddingVectorCount || 0), 0)} chunks
            </p>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-2xl border border-slate-700/60">
            <span className="text-slate-400 text-[10px] font-bold uppercase">Precision RAG (Cos-Sim)</span>
            <p className="text-xl font-extrabold text-cyan-400 mt-1">96.8%</p>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-2xl border border-slate-700/60">
            <span className="text-slate-400 text-[10px] font-bold uppercase">Respuestas AI Grounded</span>
            <p className="text-xl font-extrabold text-emerald-300 mt-1">1,482 / mes</p>
          </div>
        </div>
      </div>

      {/* SECTION 1: MOCK VECTOR SEARCH INTERFACE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-100 border border-purple-200 text-purple-700 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900 text-base">
              Probador de Búsqueda Vectorial Semántica & Copiloto RAG
            </h2>
            <p className="text-slate-500 text-xs">
              Escribí una consulta en lenguaje natural para simular la recuperación de fragmentos relevantes por similitud de cosenos.
            </p>
          </div>
        </div>

        <form onSubmit={handleVectorSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={vectorQuery}
              onChange={(e) => setVectorQuery(e.target.value)}
              placeholder="ej. ¿Cuál es el descuento por pago anual del plan Enterprise?"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-green-600 focus:bg-white"
            />
          </div>
          <button
            type="submit"
            disabled={isSearchingVector}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-2xl text-xs transition flex items-center space-x-2 shrink-0 disabled:opacity-50"
          >
            {isSearchingVector ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            <span>Buscar Vectores RAG</span>
          </button>
        </form>

        {/* Vector Search Results */}
        {vectorSearchResults && (
          <div className="bg-purple-50/60 border border-purple-200 rounded-2xl p-5 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-purple-900 flex items-center space-x-2">
                <Database className="w-4 h-4" />
                <span>Resultados de Similitud Vectorial ({vectorSearchResults.length} chunks recuperados)</span>
              </span>
              <span className="text-purple-700 font-mono text-[11px] font-bold">
                Embeddings Model: text-embedding-004
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {vectorSearchResults.map((res, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-purple-100 rounded-xl p-3.5 space-y-2 shadow-xs"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 text-[11px] truncate max-w-[200px]">
                      {res.doc.title}
                    </span>
                    <span className="bg-purple-100 text-purple-800 font-mono font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                      {(res.score * 100).toFixed(1)}% Match
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] font-mono leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                    "{res.matchChunk}"
                  </p>
                </div>
              ))}
            </div>

            {/* Generated Smart Reply */}
            {aiGeneratedReply && (
              <div className="bg-white border border-purple-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-purple-900 flex items-center space-x-1.5">
                    <Bot className="w-4 h-4 text-purple-600" />
                    <span>Respuesta Inteligente del Copiloto AI</span>
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(aiGeneratedReply);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="text-xs text-purple-700 font-bold hover:underline flex items-center space-x-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado!' : 'Copiar Respuesta'}</span>
                  </button>
                </div>
                <pre className="whitespace-pre-wrap text-slate-800 font-sans text-xs leading-relaxed">
                  {aiGeneratedReply}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* SECTION 2: KNOWLEDGE DOCUMENTS LIST */}
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 text-xs">
            {['Todas', 'Precios y Planes', 'Procedimientos ERP', 'FAQS', 'Politicas', 'Soporte Técnico'].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-extrabold whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrar por título o etiquetas..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-green-600"
            />
          </div>
        </div>

        {/* Docs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 transition"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-green-100 text-green-800 border border-green-200">
                    {doc.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {doc.embeddingVectorCount} vectores
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                  {doc.title}
                </h3>

                <p className="text-slate-600 text-xs line-clamp-4 leading-relaxed font-sans bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {doc.content}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex flex-wrap gap-1">
                  {doc.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Por {doc.author}</span>
                  {onDeleteKnowledgeDoc && (
                    <button
                      onClick={() => onDeleteKnowledgeDoc(doc.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded transition"
                      title="Eliminar documento"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD DOCUMENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden my-auto">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Brain className="w-5 h-5 text-green-400" />
                <h3 className="font-extrabold text-base">Indexar Nuevo Documento RAG</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Título del Documento *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="ej. Manual de Ofertas Especiales CRM Q3"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900 focus:outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Categoría *</label>
                <select
                  value={newCategory}
                  onChange={(e) =>
                    setNewCategory(
                      e.target.value as
                        | 'Politicas'
                        | 'Precios y Planes'
                        | 'Soporte Técnico'
                        | 'FAQS'
                        | 'Procedimientos ERP'
                    )
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900 focus:outline-none focus:border-green-600"
                >
                  <option value="Precios y Planes">Precios y Planes</option>
                  <option value="Procedimientos ERP">Procedimientos ERP</option>
                  <option value="FAQS">FAQS</option>
                  <option value="Politicas">Politicas</option>
                  <option value="Soporte Técnico">Soporte Técnico</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Contenido / Texto a Indexar *
                </label>
                <textarea
                  rows={6}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Pegá aquí el texto completo del documento, preguntas y respuestas o políticas..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-mono text-xs focus:outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Etiquetas (separadas por comas)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="ej. Descuento, Finanzas, ERPNext"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-green-600"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-extrabold rounded-xl shadow-md transition flex items-center space-x-1.5"
                >
                  <Brain className="w-4 h-4" />
                  <span>Indexar Vectores</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
