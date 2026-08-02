import { AIAgent, MCPTool, RAGDocument, N8nWorkflow, ArchitecturePhase } from '../types';

export const INITIAL_AI_AGENTS: AIAgent[] = [
  {
    id: 'agent-ceo-01',
    role: 'CEO',
    name: 'Atlas (Executive Agent)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'executing',
    goals: ['Monitor cross-departmental KPIs', 'Approve strategic purchases > $10,000', 'Delegate operational tasks to COO & CFO'],
    systemPrompt: 'You are Atlas, the Chief Executive Agent. You analyze high-level company metrics, coordinate executive workflows, and delegate tasks to domain agents.',
    memorySizeKB: 4096,
    assignedSubdomain: 'acme-global',
    mcpToolsConnected: ['erpnext_kpi_query', 'n8n_trigger_workflow', 'slack_notify_channel'],
    currentTask: 'Evaluating Q3 Revenue vs ERPNext Budget Forecast',
    activeReasoningChain: [
      'Querying MariaDB ERPNext Sales Invoices for current month...',
      'Comparing actual revenue ($148,500) against projected target ($140,000)...',
      'Revenue target exceeded by +6.07%. Generating executive summary for Board.'
    ],
    tasksCompleted: 1420,
    accuracyPct: 99.4,
    lastActionAt: new Date(Date.now() - 120000).toISOString(),
  },
  {
    id: 'agent-sales-02',
    role: 'Sales',
    name: 'Aria (Sales Agent)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'idle',
    goals: ['Qualify inbound leads in CRM', 'Generate ERPNext Quotations automatically', 'Follow up on pending proposals via WhatsApp/Email'],
    systemPrompt: 'You are Aria, the Senior Autonomous Sales Agent. You monitor CRM leads in ERPNext, create quotations, and communicate with prospective clients.',
    memorySizeKB: 2048,
    assignedSubdomain: 'acme-global',
    mcpToolsConnected: ['erpnext_create_lead', 'erpnext_create_quotation', 'n8n_send_whatsapp'],
    currentTask: 'Idle - Monitoring incoming lead webhook queue',
    activeReasoningChain: [
      'Lead #LD-2026-088 received via Contact Form.',
      'Auto-qualifying lead based on company size ($5M+) and industry (Logistics).',
      'Generated Quotation QT-2026-0041 for $12,500 USD.'
    ],
    tasksCompleted: 3890,
    accuracyPct: 98.7,
    lastActionAt: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: 'agent-cfo-03',
    role: 'CFO',
    name: 'Cipher (Financial Agent)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'executing',
    goals: ['Reconcile bank entries with ERPNext General Ledger', 'Detect anomalous expenses', 'Enforce budget thresholds'],
    systemPrompt: 'You are Cipher, Chief Financial Agent. You analyze General Ledger entries, flag unusual purchases, and prepare P&L statements.',
    memorySizeKB: 3072,
    assignedSubdomain: 'acme-global',
    mcpToolsConnected: ['erpnext_gl_entries', 'erpnext_post_journal', 'stripe_reconcile'],
    currentTask: 'Automated Stripe vs ERPNext Sales Ledger Reconciliation',
    activeReasoningChain: [
      'Fetched 42 Stripe payout transactions for batch #PAY-8819.',
      'Matching transaction hashes with ERPNext Payment Entries...',
      '100% match verified. Posting Journal Entry JE-2026-9041.'
    ],
    tasksCompleted: 5120,
    accuracyPct: 99.9,
    lastActionAt: new Date(Date.now() - 45000).toISOString(),
  },
  {
    id: 'agent-hr-04',
    role: 'HR',
    name: 'Maya (People Agent)',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    status: 'idle',
    goals: ['Manage employee onboarding workflows', 'Track attendance & leave applications in ERPNext HRMS', 'Run monthly payroll calculations'],
    systemPrompt: 'You are Maya, HR & Payroll Specialist Agent. You manage employee lifecycles, process leave requests, and orchestrate HRMS.',
    memorySizeKB: 1024,
    assignedSubdomain: 'acme-global',
    mcpToolsConnected: ['erpnext_hrms_leave', 'erpnext_payroll_entry', 'send_welcome_email'],
    currentTask: 'Idle - Awaiting monthly payroll trigger',
    activeReasoningChain: ['Payroll for July 2026 prepared for 48 employees.'],
    tasksCompleted: 890,
    accuracyPct: 99.1,
    lastActionAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'agent-support-05',
    role: 'Support',
    name: 'Echo (Helpdesk Agent)',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    status: 'executing',
    goals: ['Resolve Level-1 customer support tickets using RAG Knowledge', 'Escalate complex bugs to Developer Agent', 'Update ERPNext HD Tickets'],
    systemPrompt: 'You are Echo, Autonomous Support Specialist. You leverage the RAG Knowledge base to answer customer inquiries and update ERPNext Helpdesk.',
    memorySizeKB: 2048,
    assignedSubdomain: 'acme-global',
    mcpToolsConnected: ['rag_search_knowledge', 'erpnext_hd_ticket_update', 'email_reply'],
    currentTask: 'Answering Ticket #HD-4401: REST API Authentication Header Issue',
    activeReasoningChain: [
      'Retrieved RAG embedding for "API Token Auth Bearer vs Secret Header".',
      'Synthesizing step-by-step resolution code snippet...',
      'Replying to customer and updating Ticket status to Resolved.'
    ],
    tasksCompleted: 7420,
    accuracyPct: 97.9,
    lastActionAt: new Date(Date.now() - 30000).toISOString(),
  },
];

export const INITIAL_MCP_TOOLS: MCPTool[] = [
  {
    id: 'mcp-tool-01',
    name: 'erpnext_create_quotation',
    server: 'frappe-mcp-bridge',
    description: 'Creates a formal Sales Quotation DocType in ERPNext with item pricing and taxes.',
    parameters: { customer: 'string', items: 'array', discount: 'number' },
    permissionsRequired: ['Sales User', 'Quotation Write'],
    category: 'ERPNext',
    isAvailable: true,
  },
  {
    id: 'mcp-tool-02',
    name: 'erpnext_gl_entries',
    server: 'frappe-mcp-bridge',
    description: 'Queries General Ledger entries filtered by posting date, account, or cost center.',
    parameters: { from_date: 'string', to_date: 'string', account: 'string' },
    permissionsRequired: ['Accounts Manager'],
    category: 'Financial',
    isAvailable: true,
  },
  {
    id: 'mcp-tool-03',
    name: 'rag_search_knowledge',
    server: 'vector-rag-mcp',
    description: 'Performs semantic vector search across indexed PDFs, manuals, and internal wikis.',
    parameters: { query: 'string', top_k: 'number', filter_subdomain: 'string' },
    permissionsRequired: ['RAG Knowledge Read'],
    category: 'Document',
    isAvailable: true,
  },
  {
    id: 'mcp-tool-04',
    name: 'n8n_trigger_workflow',
    server: 'n8n-automation-mcp',
    description: 'Triggers multi-step automation workflow (e.g. WhatsApp notifications, Stripe charge).',
    parameters: { workflow_id: 'string', payload: 'object' },
    permissionsRequired: ['Workflow Admin'],
    category: 'Communication',
    isAvailable: true,
  },
];

export const INITIAL_RAG_DOCUMENTS: RAGDocument[] = [
  {
    id: 'rag-doc-01',
    title: 'ERPNext_Standard_Operating_Procedures_2026.pdf',
    sourceType: 'PDF',
    subdomain: 'acme-global',
    fileSizeMB: 14.2,
    status: 'indexed',
    totalEmbeddings: 4820,
    chunkCount: 241,
    lastIndexedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'rag-doc-02',
    title: 'Q3_Financial_Forecast_&_Cost_Centers.xlsx',
    sourceType: 'Excel',
    subdomain: 'acme-global',
    fileSizeMB: 6.8,
    status: 'indexed',
    totalEmbeddings: 1940,
    chunkCount: 97,
    lastIndexedAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: 'rag-doc-03',
    title: 'Company_Internal_Wiki_&_Employee_Handbook.wiki',
    sourceType: 'Wiki',
    subdomain: 'acme-global',
    fileSizeMB: 3.5,
    status: 'indexed',
    totalEmbeddings: 3100,
    chunkCount: 155,
    lastIndexedAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export const INITIAL_N8N_WORKFLOWS: N8nWorkflow[] = [
  {
    id: 'n8n-wf-01',
    name: 'Lead Qualification -> ERPNext CRM & WhatsApp Alert',
    trigger: 'Webhook (Form Submit)',
    status: 'active',
    executionCount: 1420,
    lastRunAt: new Date(Date.now() - 300000).toISOString(),
    targetApp: 'ERPNext CRM + WhatsApp Business',
  },
  {
    id: 'n8n-wf-02',
    name: 'Stripe Webhook -> ERPNext Invoice Payment Entry',
    trigger: 'Stripe Event payment_intent.succeeded',
    status: 'active',
    executionCount: 890,
    lastRunAt: new Date(Date.now() - 120000).toISOString(),
    targetApp: 'ERPNext Accounts',
  },
  {
    id: 'n8n-wf-03',
    name: 'New Tenant Signup -> Bench Provisioning & SSL Issuance',
    trigger: 'Control Plane Webhook',
    status: 'active',
    executionCount: 42,
    lastRunAt: new Date(Date.now() - 3500000).toISOString(),
    targetApp: 'Frappe Docker Provisioner',
  },
];

export const SYSTEM_ARCHITECTURE_PHASES: ArchitecturePhase[] = [
  {
    phase: 1,
    title: 'System Architecture & Modular Monolith Blueprint',
    status: 'completed',
    subtitle: 'High-Level Architecture, Frappe/ERPNext Core Integration & AI Micro-Services',
    summary: 'Establishes the foundational modular monolith architecture combining ERPNext/Frappe (System of Record), FastAPI AI Services, Model Context Protocol (MCP) bridge, Redis Event Bus, and Multi-Tenant SaaS Isolation.',
    diagramMermaid: `
graph TD
    Client[React + TypeScript + Tailwind Frontend] -->|REST / WebSocket| Gateway[Nginx Reverse Proxy & Traefik API Ingress]
    Gateway -->|Tenant Auth & SSO| ControlPlane[Control Plane FastAPI / Express Orchestrator]
    Gateway -->|SaaS Site Traffic| FrappeCluster[Frappe Bench Cluster Docker Containers]
    
    subgraph AI Engine & MCP Bridge
        FastAPI_AI[FastAPI AI Agent Engine] -->|MCP Protocol| MCP_Bridge[Model Context Protocol Server]
        MCP_Bridge -->|RPC / REST| ERPNext_DocTypes[ERPNext DocTypes & REST API]
        FastAPI_AI -->|Embeddings & Vector Search| Qdrant[Vector DB / RAG Memory]
        FastAPI_AI -->|LLM Provider| Gemini[Google Gemini 2.5 / Claude / OpenAI]
    end

    subgraph System of Record
        FrappeCluster --> MariaDB[(MariaDB Multi-Tenant Databases)]
        FrappeCluster --> Redis[(Redis Cache & Task Queue)]
    end

    subgraph Automation
        N8n[n8n Workflow Automation] -->|Webhooks| Gateway
    end
`,
    directoryTree: `
ai-business-os/
├── apps/
│   ├── control-plane/             # SaaS Multi-Tenant Orchestrator (Node/TS)
│   ├── ai-agent-engine/           # FastAPI Agent Framework & MCP Host (Python)
│   ├── frappe-bench/              # Custom Frappe / ERPNext Docker Bench Cluster
│   └── web-frontend/              # Unified React Single-Page Application
├── packages/
│   ├── mcp-sdk/                   # Model Context Protocol Frappe Connector
│   ├── rag-vector-store/          # Enterprise Document Embeddings Framework
│   └── db-migrations/             # PostgreSQL & MariaDB DDL Schemas
├── docker-compose.yml             # Local Multi-Container Setup
└── k8s/                           # Helm Charts for Kubernetes Deployment
`,
    keyTechnicalDecisions: [
      'Modular Monolith Architecture over early microservice fragmentation for zero-latency in-memory state transfers.',
      'ERPNext as immutable System of Record (SoR) ensuring 100% financial compliance and audit trail integrity.',
      'Model Context Protocol (MCP) as standardized abstraction barrier between LLM Agents and ERPNext DocTypes.',
      'Strict Tenant Data Isolation using separate MariaDB databases per Frappe site.'
    ],
    advantages: [
      'Zero hallucinations on financial transactions because LLMs execute strictly via validated MCP tools.',
      'Scale-to-zero Docker container capabilities for enterprise multi-tenancy.',
      'Seamless RAG semantic search across enterprise PDFs, wikis, and ERP DocTypes.'
    ],
    risksAndMitigations: [
      'Risk: High memory footprint per Frappe Bench. Mitigation: Shared bench process pools with Redis caching.',
      'Risk: LLM API latency on complex multi-step reasoning. Mitigation: Asynchronous Celery / BullMQ job queue with WebSocket real-time updates.'
    ]
  },
  {
    phase: 2,
    title: 'Domain Model & ERPNext DocType Mapping',
    status: 'completed',
    subtitle: 'Bounded Contexts, Aggregate Roots & Event Schema',
    summary: 'Defines the domain boundaries across CRM, Sales, Accounts, HRMS, and Manufacturing, matching each entity with corresponding Frappe DocTypes and Agent roles.',
    diagramMermaid: `
classDiagram
    class CustomerTenant {
        +String tenant_id
        +String subdomain
        +PlanTier plan
        +provision()
        +suspend()
    }
    class AIAgentDomain {
        +String agent_id
        +AIAgentRole role
        +MemoryVectorContext memory
        +executeTool(MCPTool tool)
    }
    class ERPNextDocType {
        +String doctype_name
        +JSON document_data
        +validate()
        +submit()
    }
    CustomerTenant "1" -- "*" AIAgentDomain : deploys
    AIAgentDomain "1" -- "*" ERPNextDocType : orchestrates via MCP
`,
    directoryTree: `
src/domain/
├── crm/             # Leads, Customers, Quotations
├── accounts/        # Invoices, Journal Entries, GL
├── hrms/            # Employees, Leave Applications, Payroll
└── ai_agents/       # Agent States, Reasoning Chains, MCP Tools
`,
    keyTechnicalDecisions: [
      'Domain Events published via Redis Pub/Sub whenever an ERPNext document status changes (e.g. Sales Order Submitted).',
      'Agents execute within bounded contexts to prevent security permission leakage.'
    ],
    advantages: ['Strict domain boundaries prevent unauthorized access across modules.'],
    risksAndMitigations: ['Eventual consistency delays handled via optimistic UI updates.']
  },
  {
    phase: 3,
    title: 'Database & Multi-Tenant Migration Schemas',
    status: 'completed',
    subtitle: 'Control Plane PostgreSQL + Tenant MariaDB Dual-Database Architecture',
    summary: 'Defines database schemas for control-plane tenant management (PostgreSQL) and individual tenant ERPNext databases (MariaDB), including full DDL migration scripts.',
    diagramMermaid: `
erDiagram
    TENANTS ||--o{ SITES : owns
    SITES ||--o{ BACKUPS : creates
    SITES ||--o{ AI_AGENTS : provisions
    TENANTS ||--o{ SUBSCRIPTIONS : billed_by
`,
    directoryTree: `
db/
├── schema.sql              # Control Plane PostgreSQL DDL
├── mariadb_tenant.sql      # ERPNext Frappe Tenant DDL Base
└── migrations/             # Incremental Migration Scripts
`,
    keyTechnicalDecisions: [
      'Dual Database Engine Strategy: PostgreSQL for global Control Plane, MariaDB for Frappe Bench backend.',
      'Automated pre-deletion snapshot archives stored in S3 Glacier with 90-day retention policies.'
    ],
    advantages: ['Complete compliance with enterprise data privacy standards (GDPR / HIPAA).'],
    risksAndMitigations: ['Automated DB backups executed asynchronously outside peak business hours.']
  },
  {
    phase: 4,
    title: 'Autonomous AI Agent Framework & MCP Server',
    status: 'in_progress',
    subtitle: 'Model Context Protocol (MCP) Bridge, Multi-Agent Collaboration & Reasoning Chains',
    summary: 'Specifies the multi-agent engine containing CEO, CFO, Sales, Marketing, HR, Support, and Developer agents. Implements MCP tool definitions and inter-agent communication protocols.',
    diagramMermaid: `
sequenceDiagram
    autonumber
    actor Customer
    participant ReactUI as React Dashboard
    participant AgentEngine as FastAPI Agent Orchestrator
    participant MCP as MCP Server Bridge
    participant ERPNext as ERPNext Rest API
    
    Customer->>ReactUI: Ask: "Create quotation for Acme Logistics"
    ReactUI->>AgentEngine: Dispatch Goal to Sales Agent (Aria)
    AgentEngine->>AgentEngine: Formulate Reasoning Chain
    AgentEngine->>MCP: Call tool: erpnext_create_quotation
    MCP->>ERPNext: POST /api/resource/Quotation
    ERPNext-->>MCP: Quotation Doc #QT-2026-0041 created
    MCP-->>AgentEngine: Tool Execution Result Success
    AgentEngine-->>ReactUI: Return Response with Doc Link & PDF
`,
    directoryTree: `
src/agents/
├── framework/        # Base Agent Class, Memory & Reasoner
├── roles/            # CEO, CFO, Sales, HR, Support Agents
├── mcp/              # MCP Protocol Server & Client Connectors
└── tools/            # Frappe DocType Tool Definitions
`,
    keyTechnicalDecisions: [
      'MCP (Model Context Protocol) provides standard JSON-RPC interfaces for model function calling.',
      'Short-term & Long-term Vector Memory allows agents to recall past decisions and customer preferences.'
    ],
    advantages: ['Allows plug-and-play addition of new LLM models (Gemini 2.5, Claude 3.5, GPT-4o, Ollama).'],
    risksAndMitigations: ['Rate-limiting and fallback model rotation implemented in key manager.']
  }
];
