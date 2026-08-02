import React, { useState } from 'react';
import { Mail, Plus, Trash2, ArrowUp, ArrowDown, Eye, Code, Copy, CheckCircle2, Sparkles, Layout } from 'lucide-react';

interface EmailBlock {
  id: string;
  type: 'header' | 'hero' | 'text' | 'button' | 'footer' | 'divider';
  content: {
    title?: string;
    text?: string;
    buttonText?: string;
    buttonUrl?: string;
    imageUrl?: string;
    alignment?: 'left' | 'center' | 'right';
  };
}

export function EmailTemplateBuilderTab() {
  const [templateName, setTemplateName] = useState('Propuesta Comercial B2B - Patagónica');
  const [subjectLine, setSubjectLine] = useState('Propuesta de Automatización para {{company}}');
  const [blocks, setBlocks] = useState<EmailBlock[]>([
    {
      id: 'b_1',
      type: 'header',
      content: { title: 'CRM & AI Solutions Patagonia', alignment: 'center' }
    },
    {
      id: 'b_2',
      type: 'hero',
      content: { imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=60', text: 'Optimización de Procesos Comerciales' }
    },
    {
      id: 'b_3',
      type: 'text',
      content: { text: 'Estimado/a {{contactName}},\n\nHemos analizado las operaciones de {{company}} en el sector {{industry}} y detectamos oportunidades para reducir costos logísticos y acelerar cierres con nuestro calificador MEDDIC.' }
    },
    {
      id: 'b_4',
      type: 'button',
      content: { buttonText: 'Agendar Demo de 15 Minutos', buttonUrl: 'https://calendly.com', alignment: 'center' }
    },
    {
      id: 'b_5',
      type: 'footer',
      content: { text: 'Enviado por Equipo Comercial • Neuquén, Argentina\nPara darte de baja haz clic aquí.' }
    }
  ]);

  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'code'>('editor');
  const [copied, setCopied] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleAddBlock = (type: EmailBlock['type']) => {
    const newBlock: EmailBlock = {
      id: `block_${Date.now()}`,
      type,
      content: {
        title: type === 'header' ? 'Nuevo Encabezado' : undefined,
        text: type === 'text' ? 'Escribe aquí tu texto personalizado con variables como {{contactName}}...' : type === 'footer' ? 'Información legal y pie de página...' : undefined,
        buttonText: type === 'button' ? 'Hacer Clic Aquí' : undefined,
        buttonUrl: type === 'button' ? 'https://' : undefined,
        imageUrl: type === 'hero' ? 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60' : undefined,
        alignment: 'center'
      }
    };
    setBlocks([...blocks, newBlock]);
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    const updated = [...blocks];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setBlocks(updated);
  };

  const handleDeleteBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const handleUpdateBlockContent = (id: string, key: string, val: string) => {
    setBlocks(blocks.map(b => {
      if (b.id === id) {
        return {
          ...b,
          content: { ...b.content, [key]: val }
        };
      }
      return b;
    }));
  };

  const generateHtml = () => {
    let html = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">\n`;
    html += `  <div style="background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">\n`;

    blocks.forEach(b => {
      if (b.type === 'header') {
        html += `    <div style="background: #4f46e5; color: #ffffff; padding: 24px; text-align: ${b.content.alignment || 'center'}; font-size: 20px; font-weight: bold;">${b.content.title}</div>\n`;
      } else if (b.type === 'hero') {
        html += `    <div style="padding: 0;"><img src="${b.content.imageUrl}" style="width: 100%; height: auto; display: block;" alt="Hero" /></div>\n`;
      } else if (b.type === 'text') {
        html += `    <div style="padding: 24px; color: #334155; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${b.content.text}</div>\n`;
      } else if (b.type === 'button') {
        html += `    <div style="padding: 20px; text-align: ${b.content.alignment || 'center'};">\n`;
        html += `      <a href="${b.content.buttonUrl}" style="background: #4f46e5; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">${b.content.buttonText}</a>\n`;
        html += `    </div>\n`;
      } else if (b.type === 'divider') {
        html += `    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />\n`;
      } else if (b.type === 'footer') {
        html += `    <div style="background: #f1f5f9; color: #64748b; padding: 16px; text-align: center; font-size: 12px; white-space: pre-wrap;">${b.content.text}</div>\n`;
      }
    });

    html += `  </div>\n`;
    html += `</div>`;
    return html;
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(generateHtml());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveTemplate = () => {
    setSuccessMsg('¡Plantilla guardada exitosamente en la biblioteca de email marketing!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Constructor de Plantillas de Email (Drag & Drop)</h2>
            <p className="text-xs text-slate-500">Diseña correos HTML reutilizables con bloques modulares y marcadores dinámicos</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveTemplate}
            className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Guardar Plantilla</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Meta Info Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre de la Plantilla</label>
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Asunto del Correo (con variables)</label>
          <input
            type="text"
            value={subjectLine}
            onChange={(e) => setSubjectLine(e.target.value)}
            className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* View Tabs & Toolbox */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Toolbox */}
        <div className="w-full lg:w-80 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Añadir Bloques</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleAddBlock('header')}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 text-xs font-semibold text-slate-700 transition-all cursor-pointer text-left"
            >
              + Encabezado
            </button>
            <button
              onClick={() => handleAddBlock('hero')}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 text-xs font-semibold text-slate-700 transition-all cursor-pointer text-left"
            >
              + Imagen Hero
            </button>
            <button
              onClick={() => handleAddBlock('text')}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 text-xs font-semibold text-slate-700 transition-all cursor-pointer text-left"
            >
              + Bloque de Texto
            </button>
            <button
              onClick={() => handleAddBlock('button')}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 text-xs font-semibold text-slate-700 transition-all cursor-pointer text-left"
            >
              + Botón CTA
            </button>
            <button
              onClick={() => handleAddBlock('divider')}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 text-xs font-semibold text-slate-700 transition-all cursor-pointer text-left"
            >
              + Separador
            </button>
            <button
              onClick={() => handleAddBlock('footer')}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 text-xs font-semibold text-slate-700 transition-all cursor-pointer text-left"
            >
              + Pie de Página
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <div className="text-[11px] font-bold text-slate-700 uppercase">Variables Disponibles</div>
            <div className="text-[10px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
              <div><code className="text-indigo-600 font-bold">{'{{contactName}}'}</code> - Nombre del contacto</div>
              <div><code className="text-indigo-600 font-bold">{'{{company}}'}</code> - Empresa del lead</div>
              <div><code className="text-indigo-600 font-bold">{'{{industry}}'}</code> - Industria / Sector</div>
              <div><code className="text-indigo-600 font-bold">{'{{amount}}'}</code> - Monto del deal</div>
            </div>
          </div>
        </div>

        {/* Main Editor / Preview Area */}
        <div className="flex-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'editor' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Layout className="w-3.5 h-3.5" /> Editor Modular
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'preview' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Vista Previa
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'code' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Code className="w-3.5 h-3.5" /> Código HTML
              </button>
            </div>

            {activeTab === 'code' && (
              <button
                onClick={handleCopyHtml}
                className="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '¡Copiado!' : 'Copiar HTML'}</span>
              </button>
            )}
          </div>

          {activeTab === 'editor' && (
            <div className="space-y-4">
              {blocks.map((block, idx) => (
                <div key={block.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3 relative group">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white px-2.5 py-1 rounded-md border border-slate-200 text-indigo-600">
                      Bloque: {block.type.toUpperCase()}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveBlock(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        title="Subir bloque"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveBlock(idx, 'down')}
                        disabled={idx === blocks.length - 1}
                        className="p-1.5 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        title="Bajar bloque"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteBlock(block.id)}
                        className="p-1.5 rounded bg-white border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                        title="Eliminar bloque"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {block.type === 'header' && (
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Título del Encabezado</label>
                      <input
                        type="text"
                        value={block.content.title || ''}
                        onChange={(e) => handleUpdateBlockContent(block.id, 'title', e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  )}

                  {block.type === 'hero' && (
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">URL de la Imagen Banner</label>
                      <input
                        type="text"
                        value={block.content.imageUrl || ''}
                        onChange={(e) => handleUpdateBlockContent(block.id, 'imageUrl', e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  )}

                  {block.type === 'text' && (
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Contenido del Mensaje</label>
                      <textarea
                        rows={3}
                        value={block.content.text || ''}
                        onChange={(e) => handleUpdateBlockContent(block.id, 'text', e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      />
                    </div>
                  )}

                  {block.type === 'button' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Texto del Botón</label>
                        <input
                          type="text"
                          value={block.content.buttonText || ''}
                          onChange={(e) => handleUpdateBlockContent(block.id, 'buttonText', e.target.value)}
                          className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Enlace URL del Botón</label>
                        <input
                          type="text"
                          value={block.content.buttonUrl || ''}
                          onChange={(e) => handleUpdateBlockContent(block.id, 'buttonUrl', e.target.value)}
                          className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  )}

                  {block.type === 'footer' && (
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Texto del Pie de Página</label>
                      <textarea
                        rows={2}
                        value={block.content.text || ''}
                        onChange={(e) => handleUpdateBlockContent(block.id, 'text', e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200 flex justify-center">
              <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
                {blocks.map(b => {
                  if (b.type === 'header') {
                    return <div key={b.id} className="bg-indigo-600 text-white p-6 text-center font-bold text-base">{b.content.title}</div>;
                  }
                  if (b.type === 'hero') {
                    return <div key={b.id}><img src={b.content.imageUrl} alt="Hero" className="w-full h-40 object-cover" /></div>;
                  }
                  if (b.type === 'text') {
                    return <div key={b.id} className="p-6 text-slate-700 text-xs leading-relaxed whitespace-pre-wrap">{b.content.text}</div>;
                  }
                  if (b.type === 'button') {
                    return (
                      <div key={b.id} className="p-6 text-center">
                        <span className="bg-indigo-600 text-white font-bold text-xs px-5 py-3 rounded-xl inline-block shadow-sm">
                          {b.content.buttonText}
                        </span>
                      </div>
                    );
                  }
                  if (b.type === 'divider') {
                    return <hr key={b.id} className="border-slate-200 my-2" />;
                  }
                  if (b.type === 'footer') {
                    return <div key={b.id} className="bg-slate-50 p-4 text-center text-[10px] text-slate-400 whitespace-pre-wrap">{b.content.text}</div>;
                  }
                  return null;
                })}
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-[11px] overflow-x-auto max-h-96">
              <pre>{generateHtml()}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
