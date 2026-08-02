import React, { useState } from 'react';
import { Bot, Cpu, Database, Zap, Sparkles, Brain, CheckCircle2, Play, RefreshCw, FileText, Layers, Share2, Terminal } from 'lucide-react';
import { AIAgent, MCPTool, RAGDocument, N8nWorkflow } from '../types';
import { N8nFlowEditor } from './N8nFlowEditor';

interface AiAgentsViewProps {
  agents: AIAgent[];
  mcpTools: MCPTool[];
  ragDocs: RAGDocument[];
  n8nWorkflows: N8nWorkflow[];
  onExecuteAgent: (agentId: string, taskGoal: string) => Promise<void>;
  onRefresh: () => void;
}

export const AiAgentsView: React.FC<AiAgentsViewProps> = ({
  agents,
  mcpTools,
  ragDocs,
  n8nWorkflows,
  onExecuteAgent,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'agents' | 'mcp' | 'rag' | 'n8n'>('agents');
  const [selectedAgent, setSelectedAgent] = useState<AIAgent>(agents[0] || {} as AIAgent);
  const [customGoal, setCustomGoal] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  const handleRunAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgent) return;
    setIsExecuting(true);
    try {
      await onExecuteAgent(selectedAgent.id, customGoal || selectedAgent.goals[0] || 'Execute ERPNext process');
      setCustomGoal('');
    } catch (err) {
      console.error('Failed to run agent:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  const getAgentRoleBadge = (role: AIAgent['role']) => {
    switch (role) {
      case 'CEO':
      case 'COO':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'CFO':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      case 'Sales':
      case 'Marketing':
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
      case 'HR':
        return 'bg-pink-500/10 text-pink-300 border-pink-500/30';
      default:
        return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-400" />
              AI Business OS — Autonomous Agent Framework
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold border border-purple-500/30">
              MCP Protocol Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise multi-agent orchestration operating on Frappe/ERPNext System of Record via Model Context Protocol (MCP) and RAG vector memory.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="self-start md:self-center px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-700"
        >
          <RefreshCw className="w-4 h-4 text-emerald-400" />
          <span>Sync MCP & Agents</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('agents')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'agents'
              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 bg-slate-950/50'
          }`}
        >
          <Bot className="w-4 h-4 text-purple-400" />
          <span>Executive Agents ({agents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('mcp')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'mcp'
              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 bg-slate-950/50'
          }`}
        >
          <Cpu className="w-4 h-4 text-indigo-400" />
          <span>MCP Tools ({mcpTools.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rag')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'rag'
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 bg-slate-950/50'
          }`}
        >
          <Database className="w-4 h-4 text-emerald-400" />
          <span>RAG Vector Memory ({ragDocs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('n8n')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'n8n'
              ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 bg-slate-950/50'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>n8n Automations ({n8nWorkflows.length})</span>
        </button>
      </div>

      {/* AGENTS TAB */}
      {activeTab === 'agents' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Agent Selection List */}
          <div className="space-y-3 lg:col-span-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Deployed Domain Agents
            </h3>

            <div className="space-y-3">
              {agents.map((agent) => {
                const isSelected = agent.id === selectedAgent?.id;
                return (
                  <div
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all space-y-3 ${
                      isSelected
                        ? 'bg-slate-900 border-purple-500/50 ring-1 ring-purple-500/30 shadow-lg'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={agent.avatar}
                          alt={agent.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <h4 className="font-bold text-white text-sm">{agent.name}</h4>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase border ${getAgentRoleBadge(agent.role)}`}>
                            {agent.role}
                          </span>
                        </div>
                      </div>

                      <span className={`w-2.5 h-2.5 rounded-full ${agent.status === 'executing' ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                      <span>Tasks: {agent.tasksCompleted}</span>
                      <span className="text-right text-emerald-400">Accuracy: {agent.accuracyPct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Agent Execution & Reasoning Chain */}
          {selectedAgent && (
            <div className="lg:col-span-2 space-y-6">
              
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedAgent.avatar}
                      alt={selectedAgent.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/40"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-white">{selectedAgent.name}</h3>
                      <p className="text-xs text-purple-300 font-mono">Assigned Site: {selectedAgent.assignedSubdomain}.saas.cloud</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">Memory:</span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs font-bold text-emerald-400">
                      {selectedAgent.memorySizeKB} KB Context
                    </span>
                  </div>
                </div>

                {/* System Prompt & Objectives */}
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-300 uppercase font-mono text-[10px] block mb-1">System Prompt Directive</span>
                    <p className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 italic font-sans leading-relaxed">
                      "{selectedAgent.systemPrompt}"
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-300 uppercase font-mono text-[10px] block mb-1">Autonomous Objectives</span>
                    <ul className="space-y-1">
                      {selectedAgent.goals.map((goal, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-bold text-slate-300 uppercase font-mono text-[10px] block mb-1">MCP Connected Tools</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedAgent.mcpToolsConnected.map((tool) => (
                        <span key={tool} className="px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 font-mono text-[11px]">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Task Execution Form */}
                <form onSubmit={handleRunAgent} className="space-y-3 pt-4 border-t border-slate-800">
                  <label className="block text-xs font-bold text-white flex items-center justify-between">
                    <span>Dispatch Task to Agent</span>
                    <span className="text-[10px] text-slate-400 font-normal">Triggers MCP RPC Execution</span>
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customGoal}
                      onChange={(e) => setCustomGoal(e.target.value)}
                      placeholder={`e.g. Generate Sales Quotation for Acme or Reconcile Stripe Ledger...`}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                    <button
                      type="submit"
                      disabled={isExecuting}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50 shadow-md shadow-purple-950/40"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>{isExecuting ? 'Thinking...' : 'Run Agent'}</span>
                    </button>
                  </div>
                </form>

                {/* Reasoning Chain Trace Log */}
                {selectedAgent.activeReasoningChain && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                      Active Agent Reasoning Chain & MCP Trace
                    </span>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] space-y-2">
                      {selectedAgent.activeReasoningChain.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-slate-300">
                          <span className="text-purple-400 font-bold shrink-0">[{idx + 1}]</span>
                          <span className="leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}
        </div>
      )}

      {/* MCP TOOLS TAB */}
      {activeTab === 'mcp' && (
        <div className="space-y-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              Model Context Protocol (MCP) Tool Register
            </h3>
            <span className="text-xs text-slate-400 font-mono">Server: frappe-mcp-bridge:3000</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mcpTools.map((tool) => (
              <div key={tool.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-300 font-mono text-sm">{tool.name}</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                    {tool.category}
                  </span>
                </div>

                <p className="text-slate-300">{tool.description}</p>

                <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px]">
                  <span className="text-slate-500 block font-mono uppercase text-[10px]">Parameters</span>
                  <pre className="p-2 rounded-lg bg-slate-900 text-slate-300 font-mono text-[10px]">
                    {JSON.stringify(tool.parameters, null, 2)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RAG VECTOR MEMORY TAB */}
      {activeTab === 'rag' && (
        <div className="space-y-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              Enterprise RAG Vector Memory Index
            </h3>
            <span className="text-xs text-slate-400 font-mono">Vector Database: Qdrant / PgVector</span>
          </div>

          <div className="border border-slate-800 rounded-xl overflow-hidden text-xs font-mono">
            <table className="w-full text-left">
              <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3">Document Title</th>
                  <th className="p-3">Source Type</th>
                  <th className="p-3">Tenant Subdomain</th>
                  <th className="p-3">Embeddings Count</th>
                  <th className="p-3">Size</th>
                  <th className="p-3 text-right font-sans">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {ragDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-white font-sans">{doc.title}</td>
                    <td className="p-3 text-emerald-400">{doc.sourceType}</td>
                    <td className="p-3 text-indigo-300">{doc.subdomain}.saas.cloud</td>
                    <td className="p-3 text-slate-200">{doc.totalEmbeddings.toLocaleString()} vectors</td>
                    <td className="p-3">{doc.fileSizeMB} MB</td>
                    <td className="p-3 text-right font-sans">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                        {doc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* N8N AUTOMATION TAB */}
      {activeTab === 'n8n' && (
        <N8nFlowEditor workflows={n8nWorkflows} />
      )}

    </div>
  );
};
