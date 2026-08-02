import React, { useState } from 'react';
import { Target, Sparkles, Building2, Users, CheckCircle2, Filter, Globe } from 'lucide-react';
import { loadDeals } from '../store/sharedStore';

export function IcpBuilderTab() {
  const [industryInput, setIndustryInput] = useState('Oil & Gas y Servicios Industriales');
  const [regionInput, setRegionInput] = useState('Neuquén, Vaca Muerta y Comodoro Rivadavia');
  const [companySize, setCompanySize] = useState('50 - 250 empleados');
  const [generating, setGenerating] = useState(false);
  const [icpResult, setIcpResult] = useState<any>(null);
  const [applied, setApplied] = useState(false);

  const handleGenerateIcp = () => {
    setGenerating(true);
    setTimeout(() => {
      setIcpResult({
        profileName: `ICP B2B Patagónico: ${industryInput}`,
        firmographics: {
          targetIndustries: [industryInput, 'Energía y Logística', 'Servicios Industriales'],
          revenueRange: '$500k - $5M USD anuales',
          employeeCount: companySize,
          geographicFocus: regionInput
        },
        demographics: {
          decisionMakers: ['Director de Operaciones', 'Gerente de Planta', 'CFO / Director Financiero'],
          painPoints: [
            'Ineficiencias logísticas en distancias patagónicas',
            'Demora en la calificación de prospectos industriales',
            'Falta de automatización en canales comerciales'
          ],
          buyingTriggers: [
            'Expansión de operaciones en yacimientos o centros turísticos',
            'Necesidad de digitalizar reportes de campo'
          ]
        },
        aiScoreMatch: '94% de afinidad con base regional actual'
      });
      setGenerating(false);
      setApplied(false);
    }, 900);
  };

  const handleApplyToLeads = () => {
    setApplied(true);
  };

  const deals = loadDeals();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Ideal Customer Profile (ICP) Builder</h2>
            <p className="text-xs text-slate-500">Genera perfiles de cliente ideal con Gemini e identifícalos en tus listas de prospección</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generator Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Parámetros del Perfil Ideal (ICP)</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sector o Industria Principal</label>
              <input
                type="text"
                value={industryInput}
                onChange={(e) => setIndustryInput(e.target.value)}
                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Región / Ubicación Geográfica</label>
              <input
                type="text"
                value={regionInput}
                onChange={(e) => setRegionInput(e.target.value)}
                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tamaño de Empresa (Empleados)</label>
              <select
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option>1 - 20 empleados (PyME inicial)</option>
                <option>20 - 50 empleados (PyME en crecimiento)</option>
                <option>50 - 250 empleados</option>
                <option>250+ empleados (Enterprise)</option>
              </select>
            </div>

            <button
              onClick={handleGenerateIcp}
              disabled={generating}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-sm shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {generating ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Sparkles className="w-4 h-4" />}
              <span>{generating ? 'Generando ICP con Gemini AI...' : 'Generar ICP con IA'}</span>
            </button>
          </div>
        </div>

        {/* ICP Result & Filtering */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-900">Resultado del ICP Generado</h3>
              {icpResult && (
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">
                  {icpResult.aiScoreMatch}
                </span>
              )}
            </div>

            {icpResult ? (
              <div className="space-y-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="font-bold text-indigo-900 text-sm">{icpResult.profileName}</div>
                  <div><strong className="text-slate-700">Industrias:</strong> {icpResult.firmographics.targetIndustries.join(', ')}</div>
                  <div><strong className="text-slate-700">Ubicación:</strong> {icpResult.firmographics.geographicFocus}</div>
                  <div><strong className="text-slate-700">Tamaño:</strong> {icpResult.firmographics.employeeCount}</div>
                </div>

                <div className="space-y-2">
                  <div className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">Tomadores de Decisiones Clave</div>
                  <div className="flex flex-wrap gap-1.5">
                    {icpResult.demographics.decisionMakers.map((dm: string, idx: number) => (
                      <span key={idx} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-medium rounded-lg text-[11px]">
                        {dm}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">Dolores Principales (Pain Points)</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    {icpResult.demographics.painPoints.map((pain: string, idx: number) => (
                      <li key={idx}>{pain}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400 text-xs">
                Configura los parámetros a la izquierda y haz clic en "Generar ICP con IA".
              </div>
            )}
          </div>

          {icpResult && (
            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={handleApplyToLeads}
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  applied ? 'bg-emerald-600 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                }`}
              >
                {applied ? <CheckCircle2 className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
                <span>{applied ? `Filtros aplicados a ${deals.length} leads exitosamente` : 'Aplicar Filtros ICP a Base de Leads'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
