import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Send,
  Users,
  CheckCircle2,
  Eye,
  MessageCircle,
  Sparkles,
  FileText,
  Clock,
  Play,
  Pause,
  AlertCircle,
  BarChart2,
  X,
  Split,
  Trophy,
  TrendingUp,
  Award,
  ArrowRight,
  Zap,
  HelpCircle
} from 'lucide-react';
import { Campaign, WhatsAppTemplate, Lead, ABTestCampaign, ABTestVariant } from '../types';


interface BroadcastsViewProps {
  campaigns: Campaign[];
  templates: WhatsAppTemplate[];
  leads: Lead[];
  onLaunchCampaign: (campaign: Partial<Campaign>) => void;
}

export const BroadcastsView: React.FC<BroadcastsViewProps> = ({
  campaigns,
  templates,
  leads,
  onLaunchCampaign
}) => {
  const [activeTab, setActiveTab] = useState<'broadcasts' | 'ab_tests'>('broadcasts');
  const [abTestCampaigns, setAbTestCampaigns] = useState<ABTestCampaign[]>([] as any);

  // Broadcast Wizard state
  const [showWizard, setShowWizard] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [targetSegment, setTargetSegment] = useState('All Qualified Leads');
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0]?.id || '');
  const [aiGoalPrompt, setAiGoalPrompt] = useState('Q3 Promotional Discount for CRM upgrades');
  const [loadingAiCopy, setLoadingAiCopy] = useState(false);
  const [generatedCopy, setGeneratedCopy] = useState<any>(null);
  const [isSimulatingDispatch, setIsSimulatingDispatch] = useState(false);
  const [dispatchProgress, setDispatchProgress] = useState(0);

  // A/B Test Wizard state
  const [showABWizard, setShowABWizard] = useState(false);
  const [abName, setAbName] = useState('');
  const [abSegment, setAbSegment] = useState('Leads Calificados de Meta Ads');
  const [abWinningMetric, setAbWinningMetric] = useState<'open_rate' | 'reply_rate'>('reply_rate');
  const [variantAName, setVariantAName] = useState('Variante A: Pregunta Directa con Emoji');
  const [variantATemplateId, setVariantATemplateId] = useState(templates[0]?.id || '');
  const [variantBName, setVariantBName] = useState('Variante B: Oferta con Botones CTA');
  const [variantBTemplateId, setVariantBTemplateId] = useState(templates[1]?.id || templates[0]?.id || '');
  const [isSimulatingAB, setIsSimulatingAB] = useState(false);
  const [abProgress, setAbProgress] = useState(0);

  // Stats calculation
  const totalSent = campaigns.reduce((acc, c) => acc + c.sentCount, 0);
  const totalDelivered = campaigns.reduce((acc, c) => acc + c.deliveredCount, 0);
  const totalRead = campaigns.reduce((acc, c) => acc + c.readCount, 0);
  const totalReplied = campaigns.reduce((acc, c) => acc + c.repliedCount, 0);

  const deliveryRate = totalSent > 0 ? Math.round((totalDelivered / totalSent) * 100) : 0;
  const readRate = totalDelivered > 0 ? Math.round((totalRead / totalDelivered) * 100) : 0;
  const replyRate = totalRead > 0 ? Math.round((totalReplied / totalRead) * 100) : 0;

  const handleGenerateAiCopy = async () => {
    setLoadingAiCopy(true);
    try {
      const response = await fetch('/api/ai/generate-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignGoal: aiGoalPrompt,
          targetAudience: targetSegment,
          tone: 'Persuasive & Engaging'
        })
      });
      const data = await response.json();
      setGeneratedCopy(data);
    } catch (e) {
      console.error('Failed to generate AI broadcast copy', e);
    } finally {
      setLoadingAiCopy(false);
    }
  };

  const handleStartCampaign = () => {
    if (!campaignName) return;
    const selectedTmpl = templates.find((t) => t.id === selectedTemplateId) || templates[0];

    setIsSimulatingDispatch(true);
    setDispatchProgress(10);

    const interval = setInterval(() => {
      setDispatchProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSimulatingDispatch(false);
          setShowWizard(false);

          onLaunchCampaign({
            name: campaignName,
            templateId: selectedTmpl.id,
            templateName: selectedTmpl.name,
            targetSegment,
            totalRecipients: 850,
            sentCount: 850,
            deliveredCount: 830,
            readCount: 640,
            repliedCount: 120,
            status: 'COMPLETED',
            createdAt: new Date().toISOString().split('T')[0]
          });

          setCampaignName('');
          return 100;
        }
        return prev + 25;
      });
    }, 600);
  };

  const handleStartABTest = () => {
    if (!abName) return;
    const tmplA = templates.find((t) => t.id === variantATemplateId) || templates[0];
    const tmplB = templates.find((t) => t.id === variantBTemplateId) || templates[1] || templates[0];

    setIsSimulatingAB(true);
    setAbProgress(15);

    const interval = setInterval(() => {
      setAbProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSimulatingAB(false);
          setShowABWizard(false);

          const newABTest: ABTestCampaign = {
            id: `ab_${Date.now()}`,
            name: abName,
            targetSegment: abSegment,
            status: 'RUNNING',
            createdAt: new Date().toISOString().split('T')[0],
            winningMetric: abWinningMetric,
            notes: 'Experimento A/B iniciado. Recopilando métricas de lecturas y respuestas en muestra 50/50.',
            variantA: {
              id: `var_a_${Date.now()}`,
              variantLetter: 'A',
              name: variantAName,
              templateId: tmplA.id,
              templateName: tmplA.name,
              samplePercentage: 50,
              sentCount: 300,
              deliveredCount: 295,
              readCount: 220,
              repliedCount: 48,
              openRate: 74.5,
              replyRate: 16.2
            },
            variantB: {
              id: `var_b_${Date.now()}`,
              variantLetter: 'B',
              name: variantBName,
              templateId: tmplB.id,
              templateName: tmplB.name,
              samplePercentage: 50,
              sentCount: 300,
              deliveredCount: 298,
              readCount: 258,
              repliedCount: 79,
              openRate: 86.5,
              replyRate: 26.5
            }
          };

          setAbTestCampaigns((prev) => [newABTest, ...prev]);
          setAbName('');
          return 100;
        }
        return prev + 25;
      });
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-101px)] bg-slate-50 text-slate-900 overflow-y-auto">
      {/* Top Banner Header */}
      <div className="p-4 bg-white border-b border-slate-200 space-y-3 shrink-0 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-slate-900 flex items-center">
              <Megaphone className="w-5 h-5 mr-2 text-green-600" />
              Campañas & Experimentos A/B de WhatsApp
            </h1>
            <p className="text-xs text-slate-500">
              Gestión de difusiones masivas y experimentos A/B para optimizar tasas de apertura y respuesta en plantillas WABA.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowABWizard(true)}
              className="flex items-center space-x-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs px-3.5 py-2 rounded-xl border border-purple-200 transition shadow-xs"
            >
              <Split className="w-4 h-4 text-purple-600" />
              <span>Nuevo Test A/B</span>
            </button>

            <button
              onClick={() => setShowWizard(true)}
              className="flex items-center space-x-1.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Difusión</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 space-x-6 text-xs font-bold pt-1">
          <button
            onClick={() => setActiveTab('broadcasts')}
            className={`pb-2 transition flex items-center space-x-2 border-b-2 ${
              activeTab === 'broadcasts'
                ? 'border-green-600 text-green-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Campañas de Difusión ({campaigns.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ab_tests')}
            className={`pb-2 transition flex items-center space-x-2 border-b-2 ${
              activeTab === 'ab_tests'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Split className="w-4 h-4 text-purple-600" />
            <span>Experimentos & Tests A/B</span>
            <span className="bg-purple-100 text-purple-800 text-[10px] px-2 py-0.2 rounded-full font-extrabold">
              {abTestCampaigns.length}
            </span>
          </button>
        </div>

        {/* Global Performance Cards */}
        {activeTab === 'broadcasts' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-1">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded">
              <div className="flex items-center justify-between text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <span>Total Enviados</span>
                <Send className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-lg font-extrabold text-slate-900 font-mono mt-1">
                {totalSent.toLocaleString()}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded">
              <div className="flex items-center justify-between text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <span>Tasa de Entrega</span>
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
              </div>
              <p className="text-lg font-extrabold text-teal-700 font-mono mt-1">
                {deliveryRate}%
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded">
              <div className="flex items-center justify-between text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <span>Tasa de Lectura</span>
                <Eye className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-lg font-extrabold text-blue-700 font-mono mt-1">
                {readRate}%
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded">
              <div className="flex items-center justify-between text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <span>Respuestas y Engagement</span>
                <MessageCircle className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-lg font-extrabold text-purple-700 font-mono mt-1">
                {replyRate}%
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-1">
            <div className="bg-purple-50/50 border border-purple-200 p-3 rounded">
              <div className="flex items-center justify-between text-purple-800 font-semibold uppercase text-[10px] tracking-wider">
                <span>Tests A/B Activos</span>
                <Split className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-lg font-extrabold text-purple-900 font-mono mt-1">
                {abTestCampaigns.length} Experimentos
              </p>
            </div>

            <div className="bg-purple-50/50 border border-purple-200 p-3 rounded">
              <div className="flex items-center justify-between text-purple-800 font-semibold uppercase text-[10px] tracking-wider">
                <span>Mejora Tasa Respuesta</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-lg font-extrabold text-emerald-700 font-mono mt-1">
                +34.5% Lift
              </p>
            </div>

            <div className="bg-purple-50/50 border border-purple-200 p-3 rounded">
              <div className="flex items-center justify-between text-purple-800 font-semibold uppercase text-[10px] tracking-wider">
                <span>Variante Ganadora Típica</span>
                <Trophy className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-xs font-extrabold text-slate-900 mt-1">
                Prueba Gratis + Botón CTA
              </p>
            </div>

            <div className="bg-purple-50/50 border border-purple-200 p-3 rounded">
              <div className="flex items-center justify-between text-purple-800 font-semibold uppercase text-[10px] tracking-wider">
                <span>Muestra por variante</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-lg font-extrabold text-blue-900 font-mono mt-1">
                50% / 50%
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Content View */}
      <div className="p-4 space-y-4">
        {activeTab === 'broadcasts' ? (
          /* STANDARD BROADCASTS TABLE */
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center">
              <BarChart2 className="w-4 h-4 mr-1.5 text-green-600" />
              Campañas de Difusión Activas e Históricas
            </h2>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs text-slate-800">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3">Nombre de Campaña</th>
                    <th className="p-3">Plantilla Usada</th>
                    <th className="p-3">Segmento Destino</th>
                    <th className="p-3">Enviados / Recip.</th>
                    <th className="p-3">Entregados</th>
                    <th className="p-3">Leídos</th>
                    <th className="p-3">Respondidos</th>
                    <th className="p-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {campaigns.map((cmp) => {
                    const statusColor =
                      cmp.status === 'COMPLETED'
                        ? 'bg-green-50 text-green-800 border-green-200'
                        : cmp.status === 'RUNNING'
                        ? 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
                        : 'bg-slate-100 text-slate-600 border-slate-200';

                    const statusText =
                      cmp.status === 'COMPLETED'
                        ? 'COMPLETADA'
                        : cmp.status === 'RUNNING'
                        ? 'EN CURSO'
                        : cmp.status;

                    return (
                      <tr key={cmp.id} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-bold text-slate-900">{cmp.name}</td>
                        <td className="p-3 font-mono text-purple-700 font-bold">{cmp.templateName}</td>
                        <td className="p-3 font-medium text-slate-700">{cmp.targetSegment}</td>
                        <td className="p-3 font-mono text-slate-800">
                          {cmp.sentCount} / {cmp.totalRecipients}
                        </td>
                        <td className="p-3 font-mono text-teal-700 font-bold">{cmp.deliveredCount}</td>
                        <td className="p-3 font-mono text-blue-700 font-bold">{cmp.readCount}</td>
                        <td className="p-3 font-mono text-purple-700 font-bold">{cmp.repliedCount}</td>
                        <td className="p-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${statusColor}`}>
                            {statusText}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* A/B EXPERIMENTS VIEW */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                  <Split className="w-4 h-4 text-purple-600" />
                  Experimentos A/B de Plantillas y Mensajes
                </h2>
                <p className="text-xs text-slate-500">
                  Comparativa directa de variantes A vs. B en muestras del 50% para elegir las plantillas WABA de mayor conversión.
                </p>
              </div>

              <button
                onClick={() => setShowABWizard(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-xs flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Crear Experimento A/B</span>
              </button>
            </div>

            {/* List of A/B Test Campaigns */}
            <div className="space-y-4">
              {abTestCampaigns.map((exp) => {
                const varA = exp.variantA;
                const varB = exp.variantB;

                // Determine winner
                const isAWin =
                  exp.status === 'COMPLETED' &&
                  (exp.winnerVariantId === 'A' ||
                    (exp.winningMetric === 'reply_rate'
                      ? varA.replyRate > varB.replyRate
                      : varA.openRate > varB.openRate));

                const isBWin =
                  exp.status === 'COMPLETED' &&
                  (exp.winnerVariantId === 'B' ||
                    (exp.winningMetric === 'reply_rate'
                      ? varB.replyRate > varA.replyRate
                      : varB.openRate > varA.openRate));

                return (
                  <div
                    key={exp.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-bold text-slate-900">{exp.name}</h3>
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                              exp.status === 'COMPLETED'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-purple-50 text-purple-800 border-purple-200 animate-pulse'
                            }`}
                          >
                            {exp.status === 'COMPLETED' ? '✓ COMPLETADO' : '⚡ EN CURSO'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Segmento: <strong className="text-slate-700">{exp.targetSegment}</strong> • Creado: {exp.createdAt} • Métrica Ganadora: <strong className="text-purple-700">{exp.winningMetric === 'reply_rate' ? 'Tasa de Respuesta' : 'Tasa de Apertura'}</strong>
                        </p>
                      </div>

                      {exp.status === 'COMPLETED' && (
                        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 self-start md:self-auto">
                          <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Ganador: {isBWin ? varB.name : varA.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Side by Side Variant Comparison */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* VAR A CARD */}
                      <div
                        className={`p-4 rounded-xl border relative transition ${
                          isAWin
                            ? 'bg-emerald-50/40 border-emerald-300 ring-2 ring-emerald-500/20'
                            : 'bg-slate-50/60 border-slate-200'
                        }`}
                      >
                        {isAWin && (
                          <span className="absolute -top-3 right-4 bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                            <Trophy className="w-3 h-3 text-amber-300" /> GANADOR A
                          </span>
                        )}

                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-extrabold text-[10px] flex items-center justify-center border border-blue-200">
                              A
                            </span>
                            <span>{varA.name}</span>
                          </span>
                          <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 font-bold">
                            {varA.templateName}
                          </span>
                        </div>

                        {/* Metric Bars */}
                        <div className="space-y-3 mt-3 text-xs">
                          {/* Open Rate */}
                          <div>
                            <div className="flex justify-between font-semibold text-slate-700 mb-1">
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3 text-blue-600" /> Tasa de Apertura (Lectura)
                              </span>
                              <span className="font-mono font-bold text-blue-800">{varA.openRate}%</span>
                            </div>
                            <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                                style={{ width: `${varA.openRate}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Reply Rate */}
                          <div>
                            <div className="flex justify-between font-semibold text-slate-700 mb-1">
                              <span className="flex items-center gap-1">
                                <MessageCircle className="w-3 h-3 text-purple-600" /> Tasa de Respuesta
                              </span>
                              <span className="font-mono font-extrabold text-purple-800">{varA.replyRate}%</span>
                            </div>
                            <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-purple-600 h-full rounded-full transition-all duration-500"
                                style={{ width: `${varA.replyRate}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Sample & Stats */}
                          <div className="pt-2 border-t border-slate-200/60 grid grid-cols-3 text-[11px] text-slate-600 text-center font-mono font-bold">
                            <div>
                              <span className="block text-[9px] text-slate-400 font-sans">Enviados</span>
                              {varA.sentCount}
                            </div>
                            <div>
                              <span className="block text-[9px] text-slate-400 font-sans">Leídos</span>
                              {varA.readCount}
                            </div>
                            <div>
                              <span className="block text-[9px] text-slate-400 font-sans">Respuestas</span>
                              {varA.repliedCount}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* VAR B CARD */}
                      <div
                        className={`p-4 rounded-xl border relative transition ${
                          isBWin
                            ? 'bg-emerald-50/40 border-emerald-300 ring-2 ring-emerald-500/20'
                            : 'bg-slate-50/60 border-slate-200'
                        }`}
                      >
                        {isBWin && (
                          <span className="absolute -top-3 right-4 bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                            <Trophy className="w-3 h-3 text-amber-300" /> GANADOR B
                          </span>
                        )}

                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 font-extrabold text-[10px] flex items-center justify-center border border-purple-200">
                              B
                            </span>
                            <span>{varB.name}</span>
                          </span>
                          <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 font-bold">
                            {varB.templateName}
                          </span>
                        </div>

                        {/* Metric Bars */}
                        <div className="space-y-3 mt-3 text-xs">
                          {/* Open Rate */}
                          <div>
                            <div className="flex justify-between font-semibold text-slate-700 mb-1">
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3 text-blue-600" /> Tasa de Apertura (Lectura)
                              </span>
                              <span className="font-mono font-bold text-blue-800">{varB.openRate}%</span>
                            </div>
                            <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                                style={{ width: `${varB.openRate}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Reply Rate */}
                          <div>
                            <div className="flex justify-between font-semibold text-slate-700 mb-1">
                              <span className="flex items-center gap-1">
                                <MessageCircle className="w-3 h-3 text-purple-600" /> Tasa de Respuesta
                              </span>
                              <span className="font-mono font-extrabold text-purple-800">{varB.replyRate}%</span>
                            </div>
                            <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-purple-600 h-full rounded-full transition-all duration-500"
                                style={{ width: `${varB.replyRate}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Sample & Stats */}
                          <div className="pt-2 border-t border-slate-200/60 grid grid-cols-3 text-[11px] text-slate-600 text-center font-mono font-bold">
                            <div>
                              <span className="block text-[9px] text-slate-400 font-sans">Enviados</span>
                              {varB.sentCount}
                            </div>
                            <div>
                              <span className="block text-[9px] text-slate-400 font-sans">Leídos</span>
                              {varB.readCount}
                            </div>
                            <div>
                              <span className="block text-[9px] text-slate-400 font-sans">Respuestas</span>
                              {varB.repliedCount}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI Insights & Conclusion */}
                    {exp.notes && (
                      <div className="bg-purple-50/50 border border-purple-200 rounded-xl p-3 text-xs text-purple-950 flex items-start space-x-2">
                        <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-purple-900">Conclusión del Experimento A/B:</p>
                          <p className="mt-0.5 text-purple-950/90 leading-relaxed font-medium">{exp.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal: Create A/B Test Wizard */}
      {showABWizard && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center">
                <Split className="w-4 h-4 mr-2 text-purple-600" />
                Configurar Nuevo Experimento A/B de Plantillas WhatsApp
              </h3>
              <button onClick={() => setShowABWizard(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {isSimulatingAB ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-purple-100 text-purple-700 border-2 border-purple-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <Split className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  Distribuyendo muestra A/B 50/50 en la API de Meta Cloud...
                </h4>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200 max-w-md mx-auto">
                  <div
                    className="bg-purple-600 h-full transition-all duration-300"
                    style={{ width: `${abProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 font-mono font-bold">
                  {abProgress}% de las variantes enviadas correctamente
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* Experiment Name & Segment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-slate-700 font-semibold">Título del Experimento *</label>
                    <input
                      type="text"
                      required
                      placeholder="ej. Test A/B: Descuento Directo vs. Asesor VIP"
                      value={abName}
                      onChange={(e) => setAbName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-purple-500 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-700 font-semibold">Segmento de Audiencia</label>
                    <select
                      value={abSegment}
                      onChange={(e) => setAbSegment(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-purple-500 font-medium"
                    >
                      <option value="Leads Calificados de Meta Ads">Leads Calificados Meta Ads (600 Contactos)</option>
                      <option value="Clientes Inactivos (+60 Días)">Clientes Inactivos +60 días (1.200 Contactos)</option>
                      <option value="All Qualified Leads">Todos los Leads Calificados (850 Contactos)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-700 font-semibold">Métrica Criterio para Declarar Ganador</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAbWinningMetric('reply_rate')}
                      className={`p-3 rounded-xl border text-left font-bold transition flex items-center space-x-2 ${
                        abWinningMetric === 'reply_rate'
                          ? 'bg-purple-50 border-purple-500 text-purple-900 ring-2 ring-purple-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <MessageCircle className="w-4 h-4 text-purple-600 shrink-0" />
                      <div>
                        <p className="text-xs">Tasa de Respuesta (%)</p>
                        <p className="text-[10px] text-slate-500 font-normal">Recomendado para cierres de ventas</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAbWinningMetric('open_rate')}
                      className={`p-3 rounded-xl border text-left font-bold transition flex items-center space-x-2 ${
                        abWinningMetric === 'open_rate'
                          ? 'bg-purple-50 border-purple-500 text-purple-900 ring-2 ring-purple-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Eye className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <p className="text-xs">Tasa de Apertura (%)</p>
                        <p className="text-[10px] text-slate-500 font-normal">Recomendado para notoriedad de marca</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Variants Setup Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Variant A */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
                        A
                      </span>
                      <h4 className="font-bold text-slate-900">Variante A (50% Muestra)</h4>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">Nombre Variante A</label>
                      <input
                        type="text"
                        value={variantAName}
                        onChange={(e) => setVariantAName(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded p-2 font-medium focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">Plantilla Meta WABA A</label>
                      <select
                        value={variantATemplateId}
                        onChange={(e) => setVariantATemplateId(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded p-2 font-mono font-bold text-purple-700 focus:outline-none"
                      >
                        {templates.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Variant B */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center">
                        B
                      </span>
                      <h4 className="font-bold text-slate-900">Variante B (50% Muestra)</h4>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">Nombre Variante B</label>
                      <input
                        type="text"
                        value={variantBName}
                        onChange={(e) => setVariantBName(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded p-2 font-medium focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">Plantilla Meta WABA B</label>
                      <select
                        value={variantBTemplateId}
                        onChange={(e) => setVariantBTemplateId(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded p-2 font-mono font-bold text-purple-700 focus:outline-none"
                      >
                        {templates.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowABWizard(false)}
                    className="px-3.5 py-2 rounded text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleStartABTest}
                    disabled={!abName}
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs disabled:opacity-50"
                  >
                    🚀 Iniciar Experimento A/B
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Create Broadcast Campaign Wizard */}
      {showWizard && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center">
                <Megaphone className="w-4 h-4 mr-2 text-green-600" />
                Asistente para Iniciar Difusión de WhatsApp
              </h3>
              <button onClick={() => setShowWizard(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {isSimulatingDispatch ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-700 border-2 border-green-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <Send className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Enviando difusión mediante la API de Meta Cloud...</h4>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200 max-w-md mx-auto">
                  <div
                    className="bg-green-600 h-full transition-all duration-300"
                    style={{ width: `${dispatchProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 font-mono font-bold">{dispatchProgress}% de los envíos completados</p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* Step 1: Campaign details */}
                <div className="space-y-2">
                  <label className="block text-slate-700 font-semibold">1. Título de la Campaña *</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Difusión Lanzamiento Nueva Colección"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2.5 text-slate-800 focus:outline-none focus:border-green-500 font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-slate-700 font-semibold">2. Segmento de Audiencia Destino</label>
                  <select
                    value={targetSegment}
                    onChange={(e) => setTargetSegment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2.5 text-slate-800 focus:outline-none focus:border-green-500 font-medium"
                  >
                    <option value="All Qualified Leads">Todos los leads calificados (850 Contactos)</option>
                    <option value="LATAM Leads (Tag: Enterprise)">Segmento Empresas LATAM (420 Contactos)</option>
                    <option value="Inbound WhatsApp Leads">Leads entrantes de WhatsApp (1.250 Contactos)</option>
                  </select>
                </div>

                {/* Step 2: Select Meta Template */}
                <div className="space-y-2">
                  <label className="block text-slate-700 font-semibold">3. Seleccionar Plantilla Aprobada por Meta</label>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2.5 text-purple-700 font-mono font-bold focus:outline-none focus:border-purple-500"
                  >
                    {templates.map((tmpl) => (
                      <option key={tmpl.id} value={tmpl.id}>
                        {tmpl.name} ({tmpl.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Step 3: AI Copywriter generator */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center">
                      <Sparkles className="w-3.5 h-3.5 mr-1 text-green-600" />
                      Redactor IA Gemini para Difusiones
                    </span>
                    <button
                      type="button"
                      onClick={handleGenerateAiCopy}
                      disabled={loadingAiCopy}
                      className="text-[10px] bg-green-600 hover:bg-green-700 text-white font-bold px-2.5 py-1 rounded transition"
                    >
                      {loadingAiCopy ? 'Generando...' : 'Generar Texto'}
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Ingresá el objetivo u oferta de la difusión ej. 20% de descuento en suscripción anual"
                    value={aiGoalPrompt}
                    onChange={(e) => setAiGoalPrompt(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded p-2 text-slate-800 focus:outline-none font-medium"
                  />

                  {generatedCopy && (
                    <div className="p-2.5 bg-white rounded border border-green-200 text-slate-800 space-y-1 shadow-xs">
                      <p className="font-bold text-green-800">{generatedCopy.headerText}</p>
                      <p className="text-[11px] text-slate-700">{generatedCopy.bodyText}</p>
                      <p className="text-[10px] text-slate-400">{generatedCopy.footerText}</p>
                    </div>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowWizard(false)}
                    className="px-3 py-1.5 rounded text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleStartCampaign}
                    disabled={!campaignName}
                    className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded shadow-sm disabled:opacity-50"
                  >
                    🚀 Enviar Difusión Ahora
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
