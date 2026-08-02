import React, { useState } from 'react';
import {
  Zap,
  Play,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Settings,
  Database,
  Globe,
  Mail,
  MessageSquare,
  Bot,
  Sliders,
  Sparkles,
  Code2,
  Layers,
  ChevronRight,
  RefreshCw,
  Clock,
  Check,
  X
} from 'lucide-react';
import { N8nWorkflow } from '../types';

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'ai_agent';
  title: string;
  service: 'ERPNext' | 'Webhook' | 'Stripe' | 'WhatsApp' | 'Gemini AI' | 'Slack' | 'Cron';
  icon: string;
  config: Record<string, string>;
  outputKey?: string;
  status?: 'idle' | 'running' | 'success' | 'error';
  executionTimeMs?: number;
}

interface N8nFlowEditorProps {
  workflows: N8nWorkflow[];
  onSaveWorkflow?: (updatedWorkflow: N8nWorkflow) => void;
}

const DEFAULT_FLOW_NODES: Record<string, WorkflowNode[]> = {
  'n8n-wf-01': [
    {
      id: 'node-1',
      type: 'trigger',
      title: 'Inbound Webhook (Lead Form)',
      service: 'Webhook',
      icon: 'globe',
      config: { path: '/webhooks/lead-capture', method: 'POST', auth: 'Bearer Token' },
      outputKey: 'lead_payload',
    },
    {
      id: 'node-2',
      type: 'condition',
      title: 'Filter: Revenue > $100k',
      service: 'ERPNext',
      icon: 'sliders',
      config: { field: 'payload.annual_revenue', operator: '>=', value: '100000' },
      outputKey: 'qualified_lead',
    },
    {
      id: 'node-3',
      type: 'ai_agent',
      title: 'Sales Agent (Aria) Evaluation',
      service: 'Gemini AI',
      icon: 'bot',
      config: { prompt: 'Analyze lead budget and auto-qualify for Enterprise Tier', model: 'gemini-3.6-flash' },
      outputKey: 'ai_score',
    },
    {
      id: 'node-4',
      type: 'action',
      title: 'Create ERPNext Customer & Quote',
      service: 'ERPNext',
      icon: 'database',
      config: { docType: 'Quotation', status: 'Draft', auto_submit: 'true' },
      outputKey: 'quotation_doc',
    },
    {
      id: 'node-5',
      type: 'action',
      title: 'Send WhatsApp Lead Proposal',
      service: 'WhatsApp',
      icon: 'message',
      config: { template: 'proposal_notification_v2', phone_field: 'lead_phone' },
      outputKey: 'whatsapp_sent',
    },
  ],
  'n8n-wf-02': [
    {
      id: 'node-1',
      type: 'trigger',
      title: 'Stripe payment_intent.succeeded',
      service: 'Stripe',
      icon: 'zap',
      config: { event: 'payment_intent.succeeded', webhook_sec: 'whsec_881923' },
      outputKey: 'stripe_event',
    },
    {
      id: 'node-2',
      type: 'ai_agent',
      title: 'CFO Agent Ledger Reconciliation',
      service: 'Gemini AI',
      icon: 'bot',
      config: { rule: 'Match Stripe payment_id with ERPNext Invoices', agent_id: 'agent-cfo-03' },
      outputKey: 'reconciliation_result',
    },
    {
      id: 'node-3',
      type: 'action',
      title: 'Post ERPNext Payment Entry Doc',
      service: 'ERPNext',
      icon: 'database',
      config: { docType: 'Payment Entry', mode_of_payment: 'Stripe Direct' },
      outputKey: 'pe_doc',
    },
  ],
  'n8n-wf-03': [
    {
      id: 'node-1',
      type: 'trigger',
      title: 'New Tenant Registration Webhook',
      service: 'Webhook',
      icon: 'globe',
      config: { path: '/api/v1/saas/signup', method: 'POST' },
      outputKey: 'signup_data',
    },
    {
      id: 'node-2',
      type: 'action',
      title: 'Frappe Docker Provisioner (Bench)',
      service: 'ERPNext',
      icon: 'database',
      config: { bench_cluster: 'bench-cluster-01', db_name: 'mariadb_tenant' },
      outputKey: 'site_provisioned',
    },
  ],
};

const SERVICE_OPTIONS: WorkflowNode['service'][] = ['ERPNext', 'Webhook', 'Stripe', 'WhatsApp', 'Gemini AI', 'Slack', 'Cron'];

export const N8nFlowEditor: React.FC<N8nFlowEditorProps> = ({ workflows }) => {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>(workflows[0]?.id || 'n8n-wf-01');
  const [nodes, setNodes] = useState<WorkflowNode[]>(
    DEFAULT_FLOW_NODES[workflows[0]?.id] || DEFAULT_FLOW_NODES['n8n-wf-01']
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(nodes[0]?.id || null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [newNodeType, setNewNodeType] = useState<WorkflowNode['type']>('action');
  const [newNodeTitle, setNewNodeTitle] = useState('');
  const [newNodeService, setNewNodeService] = useState<WorkflowNode['service']>('ERPNext');

  const selectedWorkflow = workflows.find((w) => w.id === selectedWorkflowId) || workflows[0];
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const handleSelectWorkflow = (wfId: string) => {
    setSelectedWorkflowId(wfId);
    const existing = DEFAULT_FLOW_NODES[wfId];
    if (existing) {
      setNodes([...existing]);
      setSelectedNodeId(existing[0]?.id || null);
    } else {
      setNodes([
        {
          id: 'node-1',
          type: 'trigger',
          title: 'Custom Trigger',
          service: 'Webhook',
          icon: 'globe',
          config: { path: '/webhook/custom' },
        },
      ]);
      setSelectedNodeId('node-1');
    }
    setSimulationLogs([]);
  };

  const handleUpdateNodeConfig = (key: string, value: string) => {
    if (!selectedNodeId) return;
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === selectedNodeId) {
          return {
            ...n,
            config: { ...n.config, [key]: value },
          };
        }
        return n;
      })
    );
  };

  const handleAddNode = () => {
    if (!newNodeTitle) return;
    const newId = `node-${Date.now()}`;
    const newObj: WorkflowNode = {
      id: newId,
      type: newNodeType,
      title: newNodeTitle,
      service: newNodeService,
      icon: newNodeType === 'ai_agent' ? 'bot' : newNodeType === 'condition' ? 'sliders' : 'database',
      config: newNodeType === 'ai_agent'
        ? { prompt: 'Autonomous step action', model: 'gemini-3.6-flash' }
        : newNodeType === 'condition'
        ? { field: 'status', operator: '==', value: 'approved' }
        : { docType: 'Sales Order', action: 'Submit' },
    };
    setNodes((prev) => [...prev, newObj]);
    setSelectedNodeId(newId);
    setShowAddNodeModal(false);
    setNewNodeTitle('');
  };

  const handleDeleteNode = (id: string) => {
    if (nodes.length <= 1) return;
    setNodes((prev) => prev.filter((n) => n.id !== id));
    if (selectedNodeId === id) {
      setSelectedNodeId(nodes[0].id);
    }
  };

  const runWorkflowSimulation = () => {
    setIsSimulating(true);
    setSimulationLogs(['Initializing n8n Visual Flow Test Runner...', `Target Workflow: ${selectedWorkflow?.name}`]);

    // Reset status
    setNodes((prev) => prev.map((n) => ({ ...n, status: 'idle', executionTimeMs: undefined })));

    nodes.forEach((node, index) => {
      setTimeout(() => {
        setNodes((prev) =>
          prev.map((n) => {
            if (n.id === node.id) {
              return { ...n, status: 'running' };
            }
            return n;
          })
        );

        setTimeout(() => {
          const latency = Math.floor(Math.random() * 80) + 40;
          setNodes((prev) =>
            prev.map((n) => {
              if (n.id === node.id) {
                return { ...n, status: 'success', executionTimeMs: latency };
              }
              return n;
            })
          );

          setSimulationLogs((prevLogs) => [
            ...prevLogs,
            `[Node ${index + 1}: ${node.title}] SUCCESS (${latency}ms) - Service: ${node.service}`,
          ]);

          if (index === nodes.length - 1) {
            setIsSimulating(false);
            setSimulationLogs((prevLogs) => [...prevLogs, '✔ Workflow Execution Completed Successfully (100% Pipeline Verified)']);
          }
        }, 600);
      }, (index + 1) * 800);
    });
  };

  const getNodeIcon = (service: WorkflowNode['service'], type: WorkflowNode['type']) => {
    if (type === 'ai_agent') return <Bot className="w-4 h-4 text-purple-400" />;
    if (type === 'condition') return <Sliders className="w-4 h-4 text-amber-400" />;
    switch (service) {
      case 'ERPNext':
        return <Database className="w-4 h-4 text-emerald-400" />;
      case 'Webhook':
        return <Globe className="w-4 h-4 text-blue-400" />;
      case 'Stripe':
        return <Zap className="w-4 h-4 text-indigo-400" />;
      case 'WhatsApp':
        return <MessageSquare className="w-4 h-4 text-emerald-300" />;
      case 'Gemini AI':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'Slack':
        return <MessageSquare className="w-4 h-4 text-pink-400" />;
      default:
        return <Code2 className="w-4 h-4 text-slate-400" />;
    }
  };

  const getNodeColorClass = (type: WorkflowNode['type'], isSelected: boolean) => {
    if (isSelected) return 'border-amber-500 ring-2 ring-amber-500/30 bg-slate-900 shadow-xl';
    switch (type) {
      case 'trigger':
        return 'border-blue-500/40 bg-slate-950/80 hover:border-blue-400';
      case 'condition':
        return 'border-amber-500/40 bg-slate-950/80 hover:border-amber-400';
      case 'ai_agent':
        return 'border-purple-500/40 bg-slate-950/80 hover:border-purple-400';
      case 'action':
        return 'border-emerald-500/40 bg-slate-950/80 hover:border-emerald-400';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Visual Editor Header Controls */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              n8n Visual Workflow & Automation Flow Editor
            </h3>
            <p className="text-xs text-slate-400">
              Drag, map, and orchestrate trigger webhooks, ERPNext DocType actions, and AI Agent reasoning steps in real-time.
            </p>
          </div>
        </div>

        {/* Workflow Selector & Execute Simulation Button */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedWorkflowId}
            onChange={(e) => handleSelectWorkflow(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            {workflows.map((wf) => (
              <option key={wf.id} value={wf.id}>
                {wf.name} ({wf.trigger})
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowAddNodeModal(true)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Add Step</span>
          </button>

          <button
            onClick={runWorkflowSimulation}
            disabled={isSimulating}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-950/50 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            <span>{isSimulating ? 'Executing Pipeline...' : 'Test Run Flow'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Flow Canvas + Node Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Visual Flow Canvas (Left / Middle 2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-xl relative min-h-[420px] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                Active Node Pipeline ({nodes.length} Connected Steps)
              </span>
              <span className="text-[11px] font-mono text-emerald-400">
                Status: {selectedWorkflow?.status.toUpperCase()}
              </span>
            </div>

            {/* Nodes Visual Pipe Sequence */}
            <div className="py-8 space-y-4">
              {nodes.map((node, index) => {
                const isSelected = node.id === selectedNodeId;
                return (
                  <React.Fragment key={node.id}>
                    
                    {/* Visual Node Box */}
                    <div
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${getNodeColorClass(
                        node.type,
                        isSelected
                      )}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                          {getNodeIcon(node.service, node.type)}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                              Step {index + 1} • {node.type}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-amber-300">
                              [{node.service}]
                            </span>
                          </div>
                          <h4 className="font-bold text-white text-sm mt-1">{node.title}</h4>
                        </div>
                      </div>

                      {/* Status / Latency Badge */}
                      <div className="flex items-center gap-3">
                        {node.status === 'running' && (
                          <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5 animate-pulse">
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            Executing...
                          </span>
                        )}
                        {node.status === 'success' && (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1 border border-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {node.executionTimeMs}ms
                          </span>
                        )}
                        {(!node.status || node.status === 'idle') && (
                          <span className="text-xs text-slate-500 font-mono">Idle</span>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNode(node.id);
                          }}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Remove Step"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Flow Connector Wire Arrow */}
                    {index < nodes.length - 1 && (
                      <div className="flex justify-center py-1">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400">
                          <ArrowRight className="w-3 h-3 text-amber-400 rotate-90" />
                          <span>Passes Payload Context & Output</span>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Pipeline Test Log Display */}
            {simulationLogs.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs space-y-1.5 mt-4">
                <span className="text-[10px] uppercase text-amber-400 font-bold block mb-1">
                  Live Execution Logs & Webhook Payload Trace
                </span>
                {simulationLogs.map((log, i) => (
                  <p key={i} className="text-slate-300">
                    {log}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Node Inspector Panel (Right 1 Col) */}
        <div className="space-y-4 lg:col-span-1">
          {selectedNode ? (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Settings className="w-4 h-4 text-amber-400" />
                  Node Inspector & Parameters
                </h4>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-950 text-indigo-300 border border-slate-800">
                  {selectedNode.type}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Step Title</label>
                  <input
                    type="text"
                    value={selectedNode.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNodes((prev) =>
                        prev.map((n) => (n.id === selectedNode.id ? { ...n, title: val } : n))
                      );
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Service Platform</label>
                  <select
                    value={selectedNode.service}
                    onChange={(e) => {
                      const val = e.target.value as WorkflowNode['service'];
                      setNodes((prev) =>
                        prev.map((n) => (n.id === selectedNode.id ? { ...n, service: val } : n))
                      );
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-300 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    {SERVICE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <span className="block text-slate-300 font-bold mb-2">Node Configuration Mapping</span>
                  <div className="space-y-2">
                    {Object.entries(selectedNode.config).map(([cfgKey, cfgVal]) => (
                      <div key={cfgKey}>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase">{cfgKey}</label>
                        <input
                          type="text"
                          value={cfgVal}
                          onChange={(e) => handleUpdateNodeConfig(cfgKey, e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {selectedNode.type === 'ai_agent' && (
                  <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-[11px] text-purple-200 space-y-1">
                    <span className="font-bold block flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      Gemini Agent Orchestration Active
                    </span>
                    <p>This node passes intermediate payloads to the AI Agent framework for reasoning and tool invocation.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 text-xs text-center">
              Select a node to inspect and configure parameters.
            </div>
          )}
        </div>

      </div>

      {/* Add Node Modal */}
      {showAddNodeModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                Add Workflow Step Node
              </h3>
              <button onClick={() => setShowAddNodeModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Step Type</label>
                <select
                  value={newNodeType}
                  onChange={(e) => setNewNodeType(e.target.value as WorkflowNode['type'])}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="action">Action (ERPNext / Webhook / API)</option>
                  <option value="ai_agent">AI Agent Reasoning Node</option>
                  <option value="condition">Condition (Filter / Rule)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Step Name / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Create Quotation in ERPNext"
                  value={newNodeTitle}
                  onChange={(e) => setNewNodeTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Service Platform</label>
                <select
                  value={newNodeService}
                  onChange={(e) => setNewNodeService(e.target.value as WorkflowNode['service'])}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {SERVICE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowAddNodeModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNode}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
              >
                Add Step Node
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
