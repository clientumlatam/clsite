import {
  Tenant,
  Agent,
  Lead,
  Conversation,
  WhatsAppMessage,
  WhatsAppTemplate,
  Campaign,
  ABTestCampaign,
  AutomationRule,
  AnalyticsSummary,
  ErpItem,
  ErpSalesOrder,
  ErpInvoice,
  RestaurantTable,
  MenuItem,
  RestaurantOrder,
  EcommerceProduct,
  StoreOrder,
  SaaSClusterSite,
  GeoStateCity,
  SaaSThemeConfig,
  SaaSUserSession,
  AuditLogItem,
  KnowledgeDocument,
  ActivityStreamItem,
  CustomerSegment,
  ChatbotConfig,
  PlanTier,
  FrappeApp,
  SubscriptionPlan,
  BenchNode,
  SubscriptionRecord,
  SiteBackup,
  SystemLog,
  ControlPlaneMetrics
} from '../types';

export const initialTenant: Tenant = {
  id: 'tenant_001',
  name: 'Acme Global SaaS Solutions',
  domain: 'acme.clientum.com.ar',
  wabaId: '109384758201948',
  phoneNumberId: '102938475610293',
  displayPhoneNumber: '+54 11 3829-9021',
  isConnected: true,
  plan: 'Growth',
  monthlyCredits: 10000,
  creditsUsed: 3420,
  webhookUrl: 'https://ais-dev-4td6lz3cpb4eqwuxno6w3v-254551232284.us-east1.run.app/api/whatsapp/webhook',
  webhookSecret: 'whsec_98410293847120398412'
};

export const initialAgents: Agent[] = [
  {
    id: 'agent_1',
    name: 'Sofia Rossi',
    email: 'sofia@acme.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    role: 'admin',
    status: 'online',
    assignedLeadsCount: 12,
    permissions: {
      canCreateCampaigns: true,
      canUseAiCopilot: true,
      canManageTemplates: true,
      canExportLeads: true,
      canManageErpOrders: true,
      canManageCluster: true,
      canViewAnalytics: true
    },
    goals: [
      { id: 'goal_1_1', title: 'Cierre de Contratos Enterprise', target: 15, current: 12, unit: 'leads', deadline: '2026-08-31', status: 'In Progress' },
      { id: 'goal_1_2', title: 'Tiempo de Respuesta Promedio', target: 3, current: 2.1, unit: 'minutos', deadline: '2026-08-15', status: 'Achieved' }
    ],
    active_tasks: [
      { id: 'task_1_1', title: 'Demo personalizada ERPNext para Carlos Ruiz', leadId: 'lead_101', leadName: 'Carlos Ruiz', priority: 'High', status: 'Pending', assignedAt: '2026-07-31 10:15', dueDate: '2026-08-01 15:00', notes: 'Demostrar integración WABA y módulo de facturación ZATCA', assignedBy: 'Carlos Méndez' },
      { id: 'task_1_2', title: 'Enviar propuesta comercial Enterprise a Mariela Gómez', leadId: 'lead_102', leadName: 'Mariela Gómez', priority: 'Medium', status: 'In Progress', assignedAt: '2026-07-31 09:30', dueDate: '2026-08-01 18:00', notes: 'Incluir descuento del 15% por pago anual', assignedBy: 'Sofia Rossi' }
    ]
  },
  {
    id: 'agent_2',
    name: 'David Miller',
    email: 'david@acme.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'manager',
    status: 'online',
    assignedLeadsCount: 8,
    permissions: {
      canCreateCampaigns: true,
      canUseAiCopilot: true,
      canManageTemplates: true,
      canExportLeads: true,
      canManageErpOrders: true,
      canManageCluster: false,
      canViewAnalytics: true
    },
    goals: [
      { id: 'goal_2_1', title: 'Calificación de Leads Entrantes', target: 30, current: 24, unit: 'contactos', deadline: '2026-08-20', status: 'In Progress' },
      { id: 'goal_2_2', title: 'Emisión de Facturas ERPNext', target: 50, current: 48, unit: 'facturas', deadline: '2026-08-10', status: 'Achieved' }
    ],
    active_tasks: [
      { id: 'task_2_1', title: 'Seguimiento telefónico con Fernando Paez', leadId: 'lead_103', leadName: 'Fernando Paez', priority: 'High', status: 'Pending', assignedAt: '2026-07-31 11:00', dueDate: '2026-08-02 11:00', notes: 'Revisar requerimientos de nómina ERPNext', assignedBy: 'Sofia Rossi' }
    ]
  },
  {
    id: 'agent_3',
    name: 'Elena Rostova',
    email: 'elena@acme.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'agent',
    status: 'online',
    assignedLeadsCount: 15,
    permissions: {
      canCreateCampaigns: false,
      canUseAiCopilot: true,
      canManageTemplates: false,
      canExportLeads: false,
      canManageErpOrders: true,
      canManageCluster: false,
      canViewAnalytics: false
    },
    goals: [
      { id: 'goal_3_1', title: 'Soporte e Inbox Atendidos', target: 100, current: 89, unit: 'chats', deadline: '2026-08-31', status: 'Achieved' }
    ],
    active_tasks: [
      { id: 'task_3_1', title: 'Sincronizar catálogo e-Commerce para Lucia Benítez', leadId: 'lead_104', leadName: 'Lucia Benítez', priority: 'Medium', status: 'In Progress', assignedAt: '2026-07-31 14:00', dueDate: '2026-08-01 12:00', notes: 'Validar códigos SKU en la tienda online', assignedBy: 'David Miller' }
    ]
  },
  {
    id: 'agent_4',
    name: 'Marcos Vance',
    email: 'marcos@acme.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    role: 'agent',
    status: 'busy',
    assignedLeadsCount: 6,
    permissions: {
      canCreateCampaigns: false,
      canUseAiCopilot: false,
      canManageTemplates: false,
      canExportLeads: false,
      canManageErpOrders: true,
      canManageCluster: false,
      canViewAnalytics: false
    },
    goals: [
      { id: 'goal_4_1', title: 'Re-enganche de Leads Inactivos', target: 20, current: 11, unit: 'leads', deadline: '2026-08-25', status: 'At Risk' }
    ],
    active_tasks: []
  }
];

export const initialLeads: Lead[] = [
  {
    id: 'lead_101',
    name: 'Carlos Ruiz',
    phone: '+54 11 2348-8901',
    email: 'carlos.ruiz@innovatech.ar',
    company: 'InnovaTech Argentina',
    dealValue: 12500,
    stage: 'Qualified',
    source: 'WhatsApp',
    assignedAgentId: 'agent_1',
    assignedAgentName: 'Sofia Rossi',
    tags: ['VIP', 'Empresa', 'Lead de WhatsApp'],
    lastContacted: 'Hace 10 min',
    notes: 'Interesado en licencia anual multiusuario para 45 vendedores. Solicita demo personalizada.',
    score: 88,
    summary: 'Prospecto de alta intención evaluando integración enterprise de WhatsApp CRM para equipo comercial.',
    city: 'Buenos Aires',
    unreadCount: 1,
    totalAmountSpent: 12500,
    lastPurchaseDate: '2026-07-15',
    channelPreference: 'WhatsApp',
    enrichmentHistory: [
      {
        timestamp: '2026-08-01 14:30',
        sector: 'Tecnología y Software',
        employeeCount: '50-200',
        annualRevenue: 'USD $1M - $5M',
        technologies: ['React', 'Node.js', 'AWS', 'Salesforce']
      }
    ]
  },
  {
    id: 'lead_102',
    name: 'Sofia Chen',
    phone: '+54 351 987-1234',
    email: 'sophia@nexusgroup.com.ar',
    company: 'Nexus Digital Group',
    dealValue: 8400,
    stage: 'Proposal',
    source: 'Meta Ads',
    assignedAgentId: 'agent_2',
    assignedAgentName: 'David Miller',
    tags: ['E-commerce', 'Campañas'],
    lastContacted: 'Hace 1 hora',
    notes: 'Se envió propuesta en PDF para automatizar notificaciones de pedidos de WhatsApp por API Frappe.',
    score: 92,
    summary: 'Tomadora de decisión evaluando presupuesto para campaña trimestral de difusiones automatizadas.',
    city: 'Córdoba',
    unreadCount: 0,
    totalAmountSpent: 8400,
    lastPurchaseDate: '2026-07-28',
    channelPreference: 'WhatsApp',
    enrichmentHistory: [
      {
        timestamp: '2026-08-02 09:15',
        sector: 'Agencia Digital y Publicidad',
        employeeCount: '10-50',
        technologies: ['HubSpot', 'Shopify', 'Meta Pixel']
      }
    ]
  },
  {
    id: 'lead_103',
    name: 'Mateo Fernández',
    phone: '+54 341 678-3456',
    email: 'm.fernandez@solarenergy.ar',
    company: 'Iberia Soluciones S.A.',
    dealValue: 24000,
    stage: 'Won',
    source: 'Website',
    assignedAgentId: 'agent_3',
    assignedAgentName: 'Elena Rostova',
    tags: ['Contrato Firmado', 'Cliente Top'],
    lastContacted: 'Hace 3 horas',
    notes: 'Pago confirmed. Capacitación inicial agendada para el lunes que viene.',
    score: 98,
    summary: 'Cierre de contrato anual con 100.000 créditos de mensajes masivos por WhatsApp.',
    city: 'Rosario',
    unreadCount: 0,
    totalAmountSpent: 28100,
    lastPurchaseDate: '2026-07-20',
    channelPreference: 'Email'
  },
  {
    id: 'lead_104',
    name: 'Amina Al-Mansoor',
    phone: '+54 11 4329-9876',
    email: 'amina@dubaitrading.com',
    company: 'Al-Mansoor Trading',
    dealValue: 15000,
    stage: 'New',
    source: 'WhatsApp',
    assignedAgentId: 'agent_1',
    assignedAgentName: 'Sofia Rossi',
    tags: ['Ingresante', 'Lead Caliente'],
    lastContacted: 'Recién',
    notes: 'Consultó por catálogo de WhatsApp sobre tarifas API para atenciones multiagente en vivo.',
    score: 79,
    summary: 'Nuevo lead entrante pidiendo asistencia rápida para conectar la API Oficial Meta WABA.',
    city: 'Mendoza',
    unreadCount: 2,
    totalAmountSpent: 0,
    lastPurchaseDate: '',
    channelPreference: 'WhatsApp'
  },
  {
    id: 'lead_105',
    name: 'Benjamín Wright',
    phone: '+54 261 789-0123',
    email: 'ben@apexfintech.io',
    company: 'Apex FinTech AR',
    dealValue: 5000,
    stage: 'Contacted',
    source: 'Referral',
    assignedAgentId: 'agent_4',
    assignedAgentName: 'Marcos Vance',
    tags: ['Fintech', 'Seguimiento Pendiente'],
    lastContacted: 'Ayer',
    notes: 'Preguntó sobre cumplimiento de seguridad y encriptación de chats de atención al cliente.',
    score: 65,
    summary: 'Evaluando protocolos de seguridad antes de comenzar prueba piloto.',
    city: 'La Plata',
    unreadCount: 0,
    totalAmountSpent: 5000,
    lastPurchaseDate: '2026-05-10',
    channelPreference: 'SMS'
  }
];

export const initialConversations: Conversation[] = [
  {
    id: 'conv_104',
    leadId: 'lead_104',
    leadName: 'Amina Al-Mansoor',
    phone: '+54 11 4329-9876',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    lastMessage: '¡Hola! ¿Me podrás pasar información sobre el plan Growth con 10.000 créditos de difusiones?',
    lastMessageTimestamp: '10:42 AM',
    unreadCount: 2,
    assignedAgentId: 'agent_1',
    assignedAgentName: 'Sofia Rossi',
    tags: ['Ingresante', 'Lead Caliente'],
    stage: 'New',
    pinned: true,
    managedBy: 'bot',
    sentiment: 'Happy',
    sentimentScore: 92,
    sentimentReason: 'Entusiasmo alto solicitando información directa sobre plan Growth.'
  },
  {
    id: 'conv_101',
    leadId: 'lead_101',
    leadName: 'Carlos Ruiz',
    phone: '+54 11 2348-8901',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    lastMessage: '¡Bárbaro! ¿Podemos agendar una videollamada para configurar el webhook de WABA?',
    lastMessageTimestamp: '09:15 AM',
    unreadCount: 1,
    assignedAgentId: 'agent_1',
    assignedAgentName: 'Sofia Rossi',
    tags: ['VIP', 'Empresa'],
    stage: 'Qualified',
    pinned: true,
    managedBy: 'human',
    sentiment: 'Inquisitive',
    sentimentScore: 88,
    sentimentReason: 'Intención técnica sólida y deseo de agendar videollamada.'
  },
  {
    id: 'conv_102',
    leadId: 'lead_102',
    leadName: 'Sofia Chen',
    phone: '+54 351 987-1234',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    lastMessage: 'Gracias David, ya recibí la propuesta. La estoy revisando con nuestro director de operaciones.',
    lastMessageTimestamp: 'Ayer',
    unreadCount: 0,
    assignedAgentId: 'agent_2',
    assignedAgentName: 'David Miller',
    tags: ['E-commerce'],
    stage: 'Proposal',
    managedBy: 'human',
    sentiment: 'Neutral',
    sentimentScore: 65,
    sentimentReason: 'Revisión formal de propuesta sin objeciones explícitas.'
  },
  {
    id: 'conv_103',
    leadId: 'lead_103',
    leadName: 'Mateo Fernández',
    phone: '+54 341 678-3456',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    lastMessage: '¡Ya firmamos el contrato! Con ganas de empezar a armar las secuencias automáticas de WhatsApp.',
    lastMessageTimestamp: 'Ayer',
    unreadCount: 0,
    assignedAgentId: 'agent_3',
    assignedAgentName: 'Elena Rostova',
    tags: ['Cliente Top'],
    stage: 'Won',
    sentiment: 'Happy',
    sentimentScore: 98,
    sentimentReason: 'Celebración por firma de contrato e inicio exitoso.'
  },
  {
    id: 'conv_105',
    leadId: 'lead_105',
    leadName: 'Benjamín Wright',
    phone: '+54 261 789-0123',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    lastMessage: 'Buenísimo el documento de seguridad. Te respondo para el miércoles.',
    lastMessageTimestamp: 'Hace 2 días',
    unreadCount: 0,
    assignedAgentId: 'agent_4',
    assignedAgentName: 'Marcos Vance',
    tags: ['Fintech'],
    stage: 'Contacted',
    sentiment: 'Frustrated',
    sentimentScore: 42,
    sentimentReason: 'Demora en respuesta por requerimientos estrictos de seguridad.'
  }
];

export const initialMessages: Record<string, WhatsAppMessage[]> = {
  conv_104: [
    {
      id: 'msg_401',
      conversationId: 'conv_104',
      sender: 'lead',
      text: 'Hola, vi su anuncio de integración de Frappe CRM con WhatsApp en Meta.',
      type: 'text',
      timestamp: '10:38 AM',
      status: 'read'
    },
    {
      id: 'msg_402',
      conversationId: 'conv_104',
      sender: 'bot',
      senderName: 'Bot Frappe CRM',
      text: '¡Hola Amina! Te damos la bienvenida a Acme Global. 👋 Te puedo ayudar con planes, precios o integraciones de WABA a medida.',
      type: 'text',
      timestamp: '10:38 AM',
      status: 'delivered'
    },
    {
      id: 'msg_403',
      conversationId: 'conv_104',
      sender: 'lead',
      text: '¡Hola! ¿Me podrás pasar información sobre el plan Growth con 10.000 créditos de difusiones?',
      type: 'text',
      timestamp: '10:42 AM',
      status: 'delivered'
    }
  ],
  conv_101: [
    {
      id: 'msg_101',
      conversationId: 'conv_101',
      sender: 'lead',
      text: 'Hola Sofia, estamos agrandando el equipo de ventas y necesitamos una casilla centralizada de WhatsApp para 45 vendedores.',
      type: 'text',
      timestamp: 'Ayer 16:30',
      status: 'read'
    },
    {
      id: 'msg_102',
      conversationId: 'conv_101',
      sender: 'agent',
      senderName: 'Sofia Rossi',
      text: '¡Hola Carlos! Va perfecto para nuestra plataforma de WhatsApp CRM. Tenés agentes ilimitados, asignación automática de leads e integración con Meta Cloud API.',
      type: 'text',
      timestamp: 'Ayer 16:32',
      status: 'read'
    },
    {
      id: 'msg_103',
      conversationId: 'conv_101',
      sender: 'agent',
      senderName: 'Sofia Rossi',
      text: 'Acá te adjunto el folleto con las funcionalidades Enterprise:',
      type: 'document',
      mediaUrl: '#',
      mediaFileName: 'Frappe_WhatsApp_CRM_Enterprise.pdf',
      timestamp: 'Ayer 16:35',
      status: 'read'
    },
    {
      id: 'msg_104',
      conversationId: 'conv_101',
      sender: 'lead',
      text: '¡Bárbaro! ¿Podemos agendar una videollamada para configurar el webhook de WABA?',
      type: 'text',
      timestamp: '09:15 AM',
      status: 'read'
    }
  ]
};

export const initialTemplates: WhatsAppTemplate[] = [
  {
    id: 'tmpl_101',
    name: 'bienvenida_leads_onboarding',
    language: 'es_AR',
    category: 'MARKETING',
    status: 'APPROVED',
    headerType: 'TEXT',
    headerText: '¡Te damos la bienvenida a {{1}}! 👋',
    bodyText: 'Hola {{1}}, gracias por contactarte por WhatsApp. El equipo de CRM está listo para asesorarte. ¿Qué línea de productos te interesa conocer?',
    footerText: 'Responde PARAR para cancelar suscripción',
    buttons: [
      { type: 'QUICK_REPLY', text: 'Precios del CRM' },
      { type: 'QUICK_REPLY', text: 'Pedir Demo en Vivo' },
      { type: 'URL', text: 'Ver Sitio Web', value: 'https://frappecrm.io' }
    ],
    createdAt: '2026-07-10'
  },
  {
    id: 'tmpl_102',
    name: 'seguimiento_propuesta_comercial',
    language: 'es_AR',
    category: 'UTILITY',
    status: 'APPROVED',
    headerType: 'DOCUMENT',
    headerText: 'Tu propuesta comercial',
    bodyText: 'Hola {{1}}, te enviamos la propuesta personalizada de Frappe WhatsApp CRM #{{2}} por un valor total de {{3}}. Decinos si tenés alguna duda.',
    footerText: 'Equipo Comercial Acme SaaS',
    buttons: [
      { type: 'QUICK_REPLY', text: 'Aprobar Propuesta' },
      { type: 'QUICK_REPLY', text: 'Agendar Llamada' }
    ],
    createdAt: '2026-07-15'
  },
  {
    id: 'tmpl_103',
    name: 'invitacion_webinar_trimestral',
    language: 'es_AR',
    category: 'MARKETING',
    status: 'APPROVED',
    headerType: 'IMAGE',
    headerText: 'Masterclass Exclusiva',
    bodyText: '¡Hola {{1}}! Sumate al vivo "Cómo escalar ventas por WhatsApp con Frappe CRM" este jueves a las 11 hs (ART).',
    footerText: 'Cupos limitados',
    buttons: [
      { type: 'URL', text: 'Reservar Lugar', value: 'https://acme.com/webinar' }
    ],
    createdAt: '2026-07-20'
  },
  {
    id: 'tmpl_104',
    name: 'recordatorio_pago_factura',
    language: 'es_AR',
    category: 'UTILITY',
    status: 'PENDING',
    headerType: 'TEXT',
    headerText: 'Aviso de Pago Pendiente',
    bodyText: 'Estimado/a {{1}}, tu factura #{{2}} por el monto de {{3}} vence hoy. Hacé clic abajo para abonar de forma segura.',
    footerText: 'Finanzas Acme',
    buttons: [
      { type: 'URL', text: 'Pagar Online', value: 'https://pay.acme.com' }
    ],
    createdAt: '2026-07-28'
  }
];

export const initialCampaigns: Campaign[] = [
  {
    id: 'cmp_201',
    name: 'Campaña Empresas LATAM WhatsApp',
    templateId: 'tmpl_101',
    templateName: 'bienvenida_leads_onboarding',
    targetSegment: 'Leads LATAM (Etiqueta: Empresa)',
    totalRecipients: 1250,
    sentCount: 1250,
    deliveredCount: 1210,
    readCount: 980,
    repliedCount: 342,
    status: 'COMPLETED',
    createdAt: '2026-07-25'
  },
  {
    id: 'cmp_202',
    name: 'Difusión Promocional Agosto E-Commerce',
    templateId: 'tmpl_103',
    templateName: 'invitacion_webinar_trimestral',
    targetSegment: 'Nuevos Leads (Últimos 30 Días)',
    totalRecipients: 3400,
    sentCount: 2150,
    deliveredCount: 2080,
    readCount: 1420,
    repliedCount: 210,
    status: 'RUNNING',
    createdAt: '2026-07-30'
  }
];

export const initialAutomationRules: AutomationRule[] = [
  {
    id: 'rule_1',
    name: 'Autorespuesta a consulta de Precios',
    triggerKeyword: 'precio',
    matchType: 'contains',
    actionType: 'direct_text',
    actionValue: 'Nuestros planes comienzan en $49/mes (Growth) e incluyen CRM, ERPNext y WABA WhatsApp.',
    actionValueName: 'Mensaje de Lista de Precios',
    replyText: '¡Hola! 🏷️ Nuestros planes SaaS van desde $49 USD/mes. Podés ver nuestro catálogo completo o solicitar una demostración personalizada.',
    isEnabled: true
  },
  {
    id: 'rule_2',
    name: 'Solicitud de Agendamiento de Demo',
    triggerKeyword: 'demo',
    matchType: 'contains',
    actionType: 'direct_text',
    actionValue: 'Link de agendamiento Calendly / Demo en vivo',
    actionValueName: 'Autoenvío de Agendamiento',
    replyText: '¡Excelente! 🚀 Podés agendar una Demostración interactiva en vivo con nuestro equipo aquí: https://cal.frappecrm.io/demo-latam',
    isEnabled: true
  },
  {
    id: 'rule_3',
    name: 'Contacto y Canales Directos',
    triggerKeyword: 'contacto',
    matchType: 'contains',
    actionType: 'assign_agent',
    actionValue: 'agent_1',
    actionValueName: 'Asignado a Sofia Rossi',
    replyText: '📞 Te estamos derivando inmediatamente con un especialista de ventas. Nuestro teléfono directo es +54 11 5555-0199.',
    isEnabled: true
  },
  {
    id: 'rule_4',
    name: 'Mover a Calificado al pedir propuesta',
    triggerKeyword: 'propuesta',
    matchType: 'contains',
    actionType: 'update_stage',
    actionValue: 'Qualified',
    actionValueName: 'Etapa Calificado',
    isEnabled: true
  }
];

export const initialAnalytics: AnalyticsSummary = {
  totalLeads: 128,
  activeChats: 42,
  broadcastMessagesSent: 15420,
  avgResponseTimeMinutes: 3.4,
  conversionRate: 24.8,
  messagesTrend: [
    { date: 'Lun', incoming: 240, outgoing: 380 },
    { date: 'Mar', incoming: 310, outgoing: 490 },
    { date: 'Mié', incoming: 420, outgoing: 680 },
    { date: 'Jue', incoming: 390, outgoing: 610 },
    { date: 'Vie', incoming: 510, outgoing: 820 },
    { date: 'Sáb', incoming: 180, outgoing: 290 },
    { date: 'Dom', incoming: 210, outgoing: 310 }
  ],
  leadStagesCount: {
    New: 28,
    Contacted: 34,
    Qualified: 26,
    Proposal: 18,
    Won: 16,
    Lost: 6
  }
};

export const initialErpItems: ErpItem[] = [
  {
    id: 'item_1',
    itemCode: 'ERP-SaaS-STD',
    itemName: 'Licencia Frappe Cloud CRM - Estándar',
    category: 'Software SaaS',
    stockQty: 999,
    unitPrice: 120,
    uom: 'Licencia/Mes',
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'item_2',
    itemCode: 'ERP-WABA-ADDON',
    itemName: 'Módulo WhatsApp Meta Cloud API',
    category: 'Integraciones',
    stockQty: 500,
    unitPrice: 250,
    uom: 'Módulo',
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'item_3',
    itemCode: 'ERP-ONB-PRO',
    itemName: 'Servicio de Onboarding y Configuración ERPNext',
    category: 'Servicios Profesionales',
    stockQty: 25,
    unitPrice: 1200,
    uom: 'Proyecto',
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'item_4',
    itemCode: 'ERP-BOT-AI',
    itemName: 'Agente Bot Gemini IA Copilot para Frappe',
    category: 'Inteligencia Artificial',
    stockQty: 100,
    unitPrice: 450,
    uom: 'Anual',
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80'
  }
];

export const initialErpSalesOrders: ErpSalesOrder[] = [
  {
    id: 'SAL-ORD-2026-0041',
    customerName: 'Santiago Rossi (Gourmet AR)',
    customerPhone: '+54 11 5432-1098',
    postingDate: '2026-07-28',
    deliveryDate: '2026-08-05',
    grandTotal: 1570,
    status: 'Submitted',
    currency: 'USD',
    items: [
      { itemCode: 'ERP-SaaS-STD', itemName: 'Licencia Frappe Cloud CRM - Estándar', qty: 1, rate: 120, amount: 120 },
      { itemCode: 'ERP-WABA-ADDON', itemName: 'Módulo WhatsApp Meta Cloud API', qty: 1, rate: 250, amount: 250 },
      { itemCode: 'ERP-ONB-PRO', itemName: 'Servicio de Onboarding y Configuración ERPNext', qty: 1, rate: 1200, amount: 1200 }
    ],
    paymentUrl: 'https://pay.frappe.cloud/pay_so_2026_0041'
  },
  {
    id: 'SAL-ORD-2026-0038',
    customerName: 'Valentina Gomez (TechCorp SA)',
    customerPhone: '+54 351 987-6543',
    postingDate: '2026-07-25',
    deliveryDate: '2026-07-30',
    grandTotal: 1650,
    status: 'Invoiced',
    currency: 'USD',
    items: [
      { itemCode: 'ERP-SaaS-STD', itemName: 'Licencia Frappe Cloud CRM - Estándar', qty: 10, rate: 120, amount: 1200 },
      { itemCode: 'ERP-BOT-AI', itemName: 'Agente Bot Gemini IA Copilot para Frappe', qty: 1, rate: 450, amount: 450 }
    ],
    paymentUrl: 'https://pay.frappe.cloud/pay_so_2026_0038'
  },
  {
    id: 'SAL-ORD-2026-0045',
    customerName: 'Mateo Fernández (Iberia Soluciones)',
    customerPhone: '+54 341 678-3456',
    postingDate: '2026-07-31',
    deliveryDate: '2026-08-10',
    grandTotal: 24000,
    status: 'Paid',
    currency: 'USD',
    items: [
      { itemCode: 'ERP-SaaS-STD', itemName: 'Licencia Frappe Cloud CRM - Estándar', qty: 50, rate: 120, amount: 6000 },
      { itemCode: 'ERP-ONB-PRO', itemName: 'Servicio de Onboarding y Configuración ERPNext', qty: 15, rate: 1200, amount: 18000 }
    ],
    paymentUrl: 'https://pay.frappe.cloud/pay_so_2026_0045'
  }
];

export const initialErpInvoices: ErpInvoice[] = [
  {
    id: 'ACC-SINV-2026-0102',
    customerName: 'Santiago Rossi',
    postingDate: '2026-07-28',
    dueDate: '2026-08-15',
    amount: 1570,
    outstandingAmount: 1570,
    status: 'Unpaid',
    itemsCount: 3
  },
  {
    id: 'ACC-SINV-2026-0098',
    customerName: 'Mateo Fernández',
    postingDate: '2026-07-31',
    dueDate: '2026-07-31',
    amount: 24000,
    outstandingAmount: 0,
    status: 'Paid',
    itemsCount: 2
  }
];

export const initialRestaurantTables: RestaurantTable[] = [
  { id: 't1', tableNumber: 'Mesa 01', capacity: 4, zone: 'Comedor Principal', status: 'Occupied', currentOrderId: 'RST-ORD-101', assignedWaiter: 'Lucas M.' },
  { id: 't2', tableNumber: 'Mesa 02', capacity: 2, zone: 'Comedor Principal', status: 'Available' },
  { id: 't3', tableNumber: 'Mesa 03', capacity: 6, zone: 'Comedor Principal', status: 'Bill Requested', currentOrderId: 'RST-ORD-102', assignedWaiter: 'Sofia G.' },
  { id: 't4', tableNumber: 'Mesa 04', capacity: 4, zone: 'Terraza', status: 'Occupied', currentOrderId: 'RST-ORD-103', assignedWaiter: 'Lucas M.' },
  { id: 't5', tableNumber: 'Mesa 05', capacity: 2, zone: 'Terraza', status: 'Reserved' },
  { id: 't6', tableNumber: 'VIP 01', capacity: 8, zone: 'Bar & VIP', status: 'Available' },
];

export const initialMenuItems: MenuItem[] = [
  {
    id: 'm1',
    name: 'Ojo de Bife Premium (400g) con Papas Rústicas',
    category: 'Platos Principales',
    price: 18.50,
    description: 'Corte de novillo seleccionado a las brasas con chimichurri casero.',
    isAvailable: true,
    preparationTimeMinutes: 20,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'm2',
    name: 'Hamburguesa Smash Trufada con Queso Cheddar',
    category: 'Platos Principales',
    price: 12.00,
    description: 'Doble medallón Smash, mayonesa de trufa negra, cebolla caramelizada y pan brioche.',
    isAvailable: true,
    preparationTimeMinutes: 12,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'm3',
    name: 'Pizza Artesanal Margarita San Marzano',
    category: 'Platos Principales',
    price: 10.50,
    description: 'Masa madre de 48hs, salsa de tomate italiano, mozzarella fior di latte y albahaca.',
    isAvailable: true,
    preparationTimeMinutes: 15,
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'm4',
    name: 'Cóctel Aperol Spritz / Gin Tonic Artesanal',
    category: 'Bebidas & Cócteles',
    price: 6.50,
    description: 'Elaborado con gin de autor y tónica premium.',
    isAvailable: true,
    preparationTimeMinutes: 5,
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'm5',
    name: 'Empanadas de Carne Cortada a Cuchillo (x3)',
    category: 'Entradas',
    price: 5.00,
    description: 'Receta tradicional frita o al horno de barro.',
    isAvailable: true,
    preparationTimeMinutes: 8,
    imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'm6',
    name: 'Volcán de Chocolate con Helado de Crema Americana',
    category: 'Postres',
    price: 7.00,
    description: 'Corazón caliente de chocolate semiamargo al 70%.',
    isAvailable: true,
    preparationTimeMinutes: 10,
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&auto=format&fit=crop&q=80'
  }
];

export const initialRestaurantOrders: RestaurantOrder[] = [
  {
    id: 'RST-ORD-101',
    orderType: 'Dine-in',
    tableNumber: 'Mesa 01',
    customerName: 'Santiago Rossi',
    customerPhone: '+54 11 5432-1098',
    items: [
      { menuItemName: 'Ojo de Bife Premium (400g) con Papas Rústicas', qty: 2, price: 18.50, notes: 'Punto a punto' },
      { menuItemName: 'Cóctel Aperol Spritz / Gin Tonic Artesanal', qty: 2, price: 6.50 }
    ],
    status: 'Kitchen Preparing',
    totalAmount: 50.00,
    timestamp: 'Hace 14 min'
  },
  {
    id: 'RST-ORD-102',
    orderType: 'Dine-in',
    tableNumber: 'Mesa 03',
    customerName: 'Sofia Gomez',
    customerPhone: '+54 11 9876-1234',
    items: [
      { menuItemName: 'Pizza Artesanal Margarita San Marzano', qty: 1, price: 10.50 },
      { menuItemName: 'Empanadas de Carne Cortada a Cuchillo (x3)', qty: 1, price: 5.00 }
    ],
    status: 'Ready to Serve',
    totalAmount: 15.50,
    timestamp: 'Hace 28 min'
  },
  {
    id: 'RST-ORD-103',
    orderType: 'WhatsApp QR',
    tableNumber: 'Mesa 04',
    customerName: 'Mateo Fernández',
    customerPhone: '+54 341 678-3456',
    items: [
      { menuItemName: 'Hamburguesa Smash Trufada con Queso Cheddar', qty: 2, price: 12.00 },
      { menuItemName: 'Volcán de Chocolate con Helado de Crema Americana', qty: 1, price: 7.00 }
    ],
    status: 'Pending',
    totalAmount: 31.00,
    timestamp: 'Hace 3 min',
    notes: 'Pedido enviado escaneando QR de mesa con auto-confirmación WhatsApp'
  }
];

export const initialEcommerceProducts: EcommerceProduct[] = [
  {
    id: 'p1',
    title: 'Smartwatch Pro Ultra - Salud & WhatsApp',
    slug: 'smartwatch-pro-ultra',
    category: 'Electrónica',
    price: 149.00,
    compareAtPrice: 199.00,
    stock: 42,
    rating: 4.8,
    badge: 'Más Vendido',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80',
    description: 'Reloj inteligente con pantalla AMOLED, monitoreo de ritmo cardíaco y recepción de notificaciones de WhatsApp en tiempo real.'
  },
  {
    id: 'p2',
    title: 'Auriculares Inalámbricos Noise Cancelling Pro',
    slug: 'auriculares-noise-cancelling',
    category: 'Audio',
    price: 89.50,
    compareAtPrice: 120.00,
    stock: 18,
    rating: 4.9,
    badge: 'Oferta Top',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80',
    description: 'Cancelación activa de ruido con batería de 30 horas y audio de alta fidelidad sin latencia.'
  },
  {
    id: 'p3',
    title: 'Teclado Mecánico RGB Headless Wireless',
    slug: 'teclado-mecanico-rgb',
    category: 'Computación',
    price: 110.00,
    stock: 25,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&auto=format&fit=crop&q=80',
    description: 'Switches táctiles silenciosos, estructura de aluminio y batería recargable USB-C para desarrolladores.'
  },
  {
    id: 'p4',
    title: 'Mochila Urbana Impermeable con Conector USB',
    slug: 'mochila-urbana-impermeable',
    category: 'Accesorios',
    price: 45.00,
    compareAtPrice: 65.00,
    stock: 80,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&auto=format&fit=crop&q=80',
    description: 'Diseño ergonómico anti-robo con puerto externo de carga para power bank y tela repelente al agua.'
  }
];

export const initialStoreOrders: StoreOrder[] = [
  {
    id: 'ORD-EC-9821',
    customerName: 'Lucía Benítez',
    customerPhone: '+54 11 4567-8901',
    shippingAddress: 'Av. Corrientes 1234, CABA',
    items: [
      { productTitle: 'Smartwatch Pro Ultra - Salud & WhatsApp', quantity: 1, unitPrice: 149.00 }
    ],
    totalAmount: 149.00,
    status: 'Processing',
    createdAt: '2026-07-31 10:15',
    paymentMethod: 'WhatsApp Direct',
    frappeSalesOrderRef: 'SAL-ORD-2026-0041'
  },
  {
    id: 'ORD-EC-9818',
    customerName: 'Carlos Mendonça',
    customerPhone: '+54 351 888-2211',
    shippingAddress: 'Calle San Martín 450, Córdoba',
    items: [
      { productTitle: 'Auriculares Inalámbricos Noise Cancelling Pro', quantity: 2, unitPrice: 89.50 }
    ],
    totalAmount: 179.00,
    status: 'Shipped',
    createdAt: '2026-07-30 16:40',
    paymentMethod: 'Clientum Pay',
    frappeSalesOrderRef: 'SAL-ORD-2026-0038'
  }
];

export const initialSaaSClusterSites: SaaSClusterSite[] = [
  {
    id: 'site_101',
    siteName: 'Acme Corp Main Site',
    subdomain: 'acme.clientum.com.ar',
    databaseName: 'db_acme_prod_9921',
    plan: 'Enterprise',
    status: 'Active',
    region: 'us-east1 (N. Virginia)',
    storageUsedMb: 3420,
    storageMaxMb: 10000,
    usersUsed: 14,
    usersMax: 50,
    wabaMessagesUsed: 8420,
    wabaMessagesMax: 25000,
    createdAt: '2026-01-15'
  },
  {
    id: 'site_102',
    siteName: 'Gourmet Bistro Restaurant POS',
    subdomain: 'gourmet.clientum.com.ar',
    databaseName: 'db_gourmet_pos_1102',
    plan: 'Growth',
    status: 'Active',
    region: 'sa-east1 (São Paulo)',
    storageUsedMb: 1250,
    storageMaxMb: 5000,
    usersUsed: 6,
    usersMax: 10,
    wabaMessagesUsed: 3100,
    wabaMessagesMax: 10000,
    createdAt: '2026-03-22'
  },
  {
    id: 'site_103',
    siteName: 'Zaviago Storefront Demo',
    subdomain: 'demo-store.clientum.com.ar',
    databaseName: 'db_zaviago_demo_7701',
    plan: 'Professional',
    status: 'Active',
    region: 'us-east1 (N. Virginia)',
    storageUsedMb: 850,
    storageMaxMb: 5000,
    usersUsed: 4,
    usersMax: 15,
    wabaMessagesUsed: 1200,
    wabaMessagesMax: 10000,
    createdAt: '2026-05-10'
  },
  {
    id: 'site_104',
    siteName: 'Logística Sur Staging',
    subdomain: 'staging-logistica.clientum.com.ar',
    databaseName: 'db_logistica_stg_0042',
    plan: 'Growth',
    status: 'Maintenance',
    region: 'sa-east1 (São Paulo)',
    storageUsedMb: 4900,
    storageMaxMb: 5000,
    usersUsed: 9,
    usersMax: 10,
    wabaMessagesUsed: 9950,
    wabaMessagesMax: 10000,
    createdAt: '2026-02-01'
  }
];

export const initialGeoStatesAndCities: GeoStateCity[] = [
  {
    country: 'Argentina',
    countryCode: 'AR',
    stateName: 'Buenos Aires (CABA)',
    cities: ['Palermo', 'Recoleta', 'San Telmo', 'Belgrano', 'Puerto Madero', 'Vicente López'],
    fiscalTaxRate: 21.0
  },
  {
    country: 'Argentina',
    countryCode: 'AR',
    stateName: 'Córdoba',
    cities: ['Córdoba Capital', 'Villa Carlos Paz', 'Río Cuarto', 'Villa María'],
    fiscalTaxRate: 21.0
  },
  {
    country: 'México',
    countryCode: 'MX',
    stateName: 'Ciudad de México',
    cities: ['Polanco', 'Roma Norte', 'Condesa', 'Santa Fe', 'Coyoacán'],
    fiscalTaxRate: 16.0
  },
  {
    country: 'Colombia',
    countryCode: 'CO',
    stateName: 'Bogotá D.C.',
    cities: ['Chapinero', 'Usaquén', 'Zona Rosa', 'Teusaquillo'],
    fiscalTaxRate: 19.0
  },
  {
    country: 'España',
    countryCode: 'ES',
    stateName: 'Madrid',
    cities: ['Madrid Centro', 'Salamanca', 'Chamberí', 'Alcobendas'],
    fiscalTaxRate: 21.0
  }
];

export const initialSaaSThemeConfig: SaaSThemeConfig = {
  presetName: 'Clientum Obsidian Dark',
  primaryColor: '#0284c7',
  accentColor: '#10b981',
  sidebarStyle: 'Dark Glass',
  fontFamily: 'Plus Jakarta Sans',
  brandLogoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
  customCss: '/* Custom SaaS Theme Overrides */\n.clientum-card {\n  border-radius: 12px;\n  box-shadow: 0 4px 20px rgba(0,0,0,0.05);\n}',
  enableCustomNavbar: true,
  customFooterText: 'Powered by Clientum SaaS Cluster & saas_theme',
  loginTheme: 'Split Modern',
  activeThemeId: 'theme_obsidian'
};

export const demoSaaSUsers: SaaSUserSession[] = [
  {
    id: 'usr_admin',
    fullName: 'Sofia Rossi (Admin General)',
    email: 'sofia.rossi@clientum.com.ar',
    role: 'admin',
    companyName: 'Acme SaaS Corp',
    subdomain: 'acme.clientum.com.ar',
    plan: 'Enterprise',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    isTwoFactorEnabled: true,
    lastLoginAt: '2026-07-31 14:30'
  },
  {
    id: 'usr_manager',
    fullName: 'Carlos Méndez (Gerente Comercial)',
    email: 'carlos.mendez@clientum.com.ar',
    role: 'manager',
    companyName: 'Gourmet Bistro Group',
    subdomain: 'gourmet.clientum.com.ar',
    plan: 'Professional',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    isTwoFactorEnabled: false,
    lastLoginAt: '2026-07-30 09:15'
  },
  {
    id: 'usr_agent',
    fullName: 'Ana Gómez (Agente de Ventas)',
    email: 'ana.gomez@clientum.com.ar',
    role: 'agent',
    companyName: 'Zaviago Storefronts',
    subdomain: 'zaviago.clientum.com.ar',
    plan: 'Growth',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    isTwoFactorEnabled: true,
    lastLoginAt: '2026-07-31 11:00'
  }
];

export const initialCurrentSaaSUser: SaaSUserSession = demoSaaSUsers[0];

export const SUBSCRIPTION_PLANS: { 
  id: PlanTier; 
  name: string; 
  price: number; 
  priceMonthly: number;
  maxUsers: number;
  maxDiskMB: number;
  backgroundWorkers: number;
  backupFrequency: string;
  includedApps: string[];
  features: string[]; 
}[] = [
  { id: 'Starter', name: 'Starter', price: 49, priceMonthly: 49, maxUsers: 2, maxDiskMB: 5000, backgroundWorkers: 2, backupFrequency: 'daily', includedApps: ['CRM', 'WABA'], features: ['1,000 WABA', '2 agentes', 'CRM básico'] },
  { id: 'Growth', name: 'Growth', price: 149, priceMonthly: 149, maxUsers: 10, maxDiskMB: 10000, backgroundWorkers: 4, backupFrequency: 'hourly', includedApps: ['CRM', 'WABA', 'ERPNext', 'Ecommerce'], features: ['5,000 WABA', '5 agentes', 'Automatización', 'ERPNext'] },
  { id: 'Enterprise', name: 'Enterprise', price: 399, priceMonthly: 399, maxUsers: 50, maxDiskMB: 50000, backgroundWorkers: 16, backupFrequency: 'real-time', includedApps: ['CRM', 'WABA', 'ERPNext', 'Restaurant', 'Cluster'], features: ['WABA ilimitado', 'Soporte 24/7', 'ERPNext dedicado'] }
];

export const initialAuditLogs: AuditLogItem[] = [
  {
    id: 'log_101',
    timestamp: '2026-07-31 16:45:12',
    userEmail: 'sofia.rossi@clientum.com.ar',
    userName: 'Sofia Rossi',
    action: 'LOGIN_SUCCESS',
    category: 'AUTH',
    resource: 'SaaS Control Panel',
    ipAddress: '190.210.45.112',
    status: 'Success',
    details: 'Sesión iniciada con éxito usando 2FA Google Authenticator'
  },
  {
    id: 'log_102',
    timestamp: '2026-07-31 16:20:05',
    userEmail: 'sofia.rossi@clientum.com.ar',
    userName: 'Sofia Rossi',
    action: 'CREATE_ERP_INVOICE',
    category: 'ERP',
    resource: 'Invoice ACC-SINV-2026-0091',
    ipAddress: '190.210.45.112',
    status: 'Success',
    details: 'Factura emitida automáticamente para lead Carlos Ruiz por $12,500'
  },
  {
    id: 'log_103',
    timestamp: '2026-07-31 15:58:30',
    userEmail: 'david.miller@clientum.com.ar',
    userName: 'David Miller',
    action: 'DELEGATE_TASK',
    category: 'AGENT',
    resource: 'Thread +54 11 2348-8901',
    ipAddress: '181.44.120.89',
    status: 'Success',
    details: 'Tarea delegada a Elena Rostova: "Sintonizar catálogo e-Commerce"'
  },
  {
    id: 'log_104',
    timestamp: '2026-07-31 14:12:44',
    userEmail: 'sistema.waba@clientum.com.ar',
    userName: 'AI Copilot Engine',
    action: 'VECTOR_KNOWLEDGE_INDEX',
    category: 'WHATSAPP',
    resource: 'KB-Doc "Politica_Garantia_2026.pdf"',
    ipAddress: '10.0.4.15',
    status: 'Success',
    details: 'Indexación vectorial RAG completada (128 embeddings generados)'
  },
  {
    id: 'log_105',
    timestamp: '2026-07-31 12:05:18',
    userEmail: 'marcos.vance@clientum.com.ar',
    userName: 'Marcos Vance',
    action: 'EXPORT_LEADS_CSV',
    category: 'CRM',
    resource: 'Leads Pipeline Export',
    ipAddress: '190.18.23.99',
    status: 'Success',
    details: 'Descarga de 48 registros de leads en formato CSV'
  },
  {
    id: 'log_106',
    timestamp: '2026-07-31 09:30:10',
    userEmail: 'carlos.mendez@clientum.com.ar',
    userName: 'Carlos Méndez',
    action: 'UPDATE_WEBHOOK_SETTINGS',
    category: 'SECURITY',
    resource: 'Tenant WABA Credentials',
    ipAddress: '200.55.12.4',
    status: 'Success',
    details: 'Renovación de token HMAC de webhook Meta WhatsApp Business API'
  }
];

export const initialKnowledgeDocs: KnowledgeDocument[] = [
  {
    id: 'kb_001',
    title: 'Política de Precios y Planes SaaS Clientum 2026',
    category: 'Precios y Planes',
    content: `Clientum ofrece 3 planes SaaS principales:
1. Starter ($49/mes): Incluye 1,000 conversaciones de WhatsApp WABA, 2 agentes, CRM básico y facturación simple.
2. Growth ($149/mes): Incluye 5,000 conversaciones, 5 agentes, automatización de flujos de trabajo, copiloto AI y conector ERPNext.
3. Enterprise ($399/mes): Conversaciones ilimitadas, soporte 24/7, cluster dedicado de ERPNext, base de datos MariaDB aislada y SLA del 99.9%.

Política de descuento: 15% de bonificación en contrataciones con pago anual por adelantado.`,
    fileType: 'PDF / Text',
    tags: ['Precios', 'SaaS', 'Planes', 'Descuentos'],
    embeddingVectorCount: 64,
    updatedAt: '2026-07-28',
    author: 'Sofia Rossi',
    status: 'Indexed'
  },
  {
    id: 'kb_002',
    title: 'Guía de Emisión de Facturas y ZATCA con ERPNext',
    category: 'Procedimientos ERP',
    content: `Procedimiento estándar para la emisión de facturas electrónicas desde Clientum CRM a ERPNext:
- Seleccionar el lead calificado en el pipeline de ventas o inbox de WhatsApp.
- Presionar el botón "Crear Orden de Venta ERP" o "Generar Factura ERPNext".
- El sistema valida el número de identificación fiscal (CUIT/VAT) y la dirección del cliente.
- Se genera la factura con timbre ZATCA / AFIP de forma automática y se envía la confirmación con enlace de pago por WhatsApp en menos de 3 segundos.`,
    fileType: 'Markdown Document',
    tags: ['ERPNext', 'Facturación', 'ZATCA', 'Ventas'],
    embeddingVectorCount: 92,
    updatedAt: '2026-07-30',
    author: 'David Miller',
    status: 'Indexed'
  },
  {
    id: 'kb_003',
    title: 'Preguntas Frecuentes y Garantía de Servicio WABA',
    category: 'FAQS',
    content: `Preguntas frecuentes sobre la API oficial de WhatsApp (WABA):
Q: ¿Se pueden perder los números de WhatsApp o sufrir bloqueos?
A: No. Al utilizar la API oficial WABA a través de Meta Business Manager con Clientum, el número está 100% resguardado de baneos.

Q: ¿Cuánto demoran las plantillas de mensajes en ser aprobadas por Meta?
A: El tiempo promedio de aprobación de plantillas por IA de Meta es de 2 a 15 minutos.

Q: ¿Cómo funciona el chatbot con Inteligencia Artificial?
A: El bot analiza la intención del cliente usando la API de Gemini y consulta la Base de Conocimiento RAG para responder dudas técnicas con máxima precisión.`,
    fileType: 'Text File',
    tags: ['WhatsApp', 'WABA', 'Meta', 'FAQ', 'Garantía'],
    embeddingVectorCount: 110,
    updatedAt: '2026-07-25',
    author: 'Elena Rostova',
    status: 'Indexed'
  }
];

export const initialActivityStream: ActivityStreamItem[] = [
  {
    id: 'act_101',
    timestamp: '16:42:10',
    agentName: 'Sofia Rossi',
    agentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    actionType: 'ERP_INVOICE',
    description: 'Factura ACC-SINV-2026-0091 por $12,500 emitida a Carlos Ruiz en ERPNext',
    resourceId: 'ACC-SINV-2026-0091',
    status: 'Completed',
    timeAgo: 'hace 3 min'
  },
  {
    id: 'act_102',
    timestamp: '16:30:15',
    agentName: 'David Miller',
    agentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    actionType: 'DELEGATION',
    description: 'Delegó tarea de seguimiento técnico a Elena Rostova (Prioridad Alta)',
    resourceId: 'task_1_1',
    status: 'Completed',
    timeAgo: 'hace 15 min'
  },
  {
    id: 'act_103',
    timestamp: '16:15:00',
    agentName: 'AI Copilot Assistant',
    agentAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
    actionType: 'KNOWLEDGE_INDEX',
    description: 'Búsqueda RAG vectorial completada: 96.4% precisión para consulta de precios',
    resourceId: 'kb_001',
    status: 'Completed',
    timeAgo: 'hace 30 min'
  },
  {
    id: 'act_104',
    timestamp: '15:50:22',
    agentName: 'Elena Rostova',
    agentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    actionType: 'LEAD_STAGE',
    description: 'Actualizó estado de Mariela Gómez a "Propuesta Comercial"',
    resourceId: 'lead_102',
    status: 'Completed',
    timeAgo: 'hace 55 min'
  },
  {
    id: 'act_105',
    timestamp: '15:10:00',
    agentName: 'Marcos Vance',
    agentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    actionType: 'STORE_ORDER',
    description: 'Confirmó pedido e-Commerce #ORD-9021 con enlace de pago Clientum',
    resourceId: 'ORD-9021',
    status: 'Completed',
    timeAgo: 'hace 1 hora'
  }
];

export const initialCustomerSegments: CustomerSegment[] = [
  {
    id: 'seg_1',
    name: 'Clientes VIP ($5k+)',
    description: 'Clientes corporativos con gasto acumulado superior a $5,000 USD y preferencia por comunicación en WhatsApp.',
    criteria: {
      minAmountSpent: 5000,
      channelPreferences: ['WhatsApp', 'Email'],
      lastPurchaseRelation: 'within_days',
      lastPurchaseDays: 90,
      minScore: 80
    },
    color: 'emerald',
    createdAt: '2026-06-01',
    updatedAt: '2026-07-31',
    contactCount: 3,
    avgLifetimeValue: 17166
  },
  {
    id: 'seg_2',
    name: 'Compradores Recientes (30d)',
    description: 'Contactos con transacciones aprobadas o cierre de oportunidad en los últimos 30 días.',
    criteria: {
      lastPurchaseDays: 30,
      lastPurchaseRelation: 'within_days',
      channelPreferences: ['WhatsApp']
    },
    color: 'blue',
    createdAt: '2026-06-15',
    updatedAt: '2026-07-30',
    contactCount: 2,
    avgLifetimeValue: 18250
  },
  {
    id: 'seg_3',
    name: 'Canal Preferido WhatsApp',
    description: 'Prospectos e integrantes del directorio que priorizan la mensajería instantánea para compras.',
    criteria: {
      channelPreferences: ['WhatsApp'],
      minScore: 70
    },
    color: 'green',
    createdAt: '2026-07-01',
    updatedAt: '2026-07-31',
    contactCount: 4,
    avgLifetimeValue: 12475
  },
  {
    id: 'seg_4',
    name: 'Re-enganche Inactivos (>60d)',
    description: 'Bases de contactos sin actividad comercial reciente para campaña automatizada de retención.',
    criteria: {
      lastPurchaseDays: 60,
      lastPurchaseRelation: 'older_than_days',
      channelPreferences: ['WhatsApp', 'Email', 'SMS']
    },
    color: 'amber',
    createdAt: '2026-07-10',
    updatedAt: '2026-07-28',
    contactCount: 1,
    avgLifetimeValue: 5000
  },
  {
    id: 'seg_5',
    name: 'Prospectos B2B Calificados',
    description: 'Oportunidades en etapa de Calificado, Propuesta o Cierre con presupuesto asignado.',
    criteria: {
      leadStages: ['Qualified', 'Proposal', 'Won'],
      minAmountSpent: 1000
    },
    color: 'purple',
    createdAt: '2026-07-20',
    updatedAt: '2026-07-31',
    contactCount: 3,
    avgLifetimeValue: 14966
  }
];

export const initialChatbotConfig: ChatbotConfig = {
  botName: 'Asistente Virtual Clientum CRM',
  welcomeMessage: '¡Hola! 👋 Soy el Asistente Virtual Inteligente de Clientum CRM. ¿En qué te puedo asesorar hoy?',
  isEnabled: true,
  fallbackToHuman: true,
  collectLeadInfo: true,
  leadFields: ['name', 'email', 'company', 'phone', 'interest'],
  handoverCountTotal: 18,
  infoCollectedTotal: 42,
  handoverRules: [
    {
      id: 'hr_1',
      name: 'Solicitud Explícita de Humano',
      condition: 'explicit_agent_request',
      action: 'assign_human_agent',
      defaultAgentId: 'agent_1',
      isEnabled: true,
      description: 'Derivar de inmediato a un representante cuando el cliente responda "humano", "agente", "hablar con persona" o "asesor".'
    },
    {
      id: 'hr_2',
      name: 'Lead Enterprise de Alto Valor (> $5,000)',
      condition: 'high_value_lead',
      threshold: 5000,
      action: 'assign_human_agent',
      defaultAgentId: 'agent_1',
      isEnabled: true,
      description: 'Transferir automáticamente a la Directora de Ventas (Sofia Rossi) si el valor del contrato supera los $5,000 USD.'
    },
    {
      id: 'hr_3',
      name: 'Insatisfacción / Consultas Complejas Repetidas',
      condition: 'unanswered_faq_count',
      threshold: 2,
      action: 'flag_urgent',
      defaultAgentId: 'agent_2',
      isEnabled: true,
      description: 'Derivar la conversación tras 2 preguntas complejas no encontradas en la Base de Conocimiento FAQ.'
    }
  ],
  faqs: [
    {
      id: 'faq_1',
      question: '¿Qué es Clientum Frappe WhatsApp SaaS CRM?',
      answer: 'Clientum es una plataforma SaaS multiinquilino que integra la API Oficial de WhatsApp (WABA), gestión de prospectos CRM, emisión de facturas electrónicas con ERPNext, campañas masivas automatizadas y bots con IA.',
      category: 'CRM Features',
      keywords: ['que es', 'clientum', 'crm', 'frappe', 'plataforma', 'caracteristicas']
    },
    {
      id: 'faq_2',
      question: '¿Cómo conecto mi número de WhatsApp Business API (WABA)?',
      answer: 'Para conectar tu número WABA, ve a "Configuración y Meta", selecciona "Verificación WABA Meta" e ingresa el Phone Number ID y WABA Account ID de tu Meta Business Manager.',
      category: 'WABA & WhatsApp',
      keywords: ['conectar', 'waba', 'whatsapp', 'numero', 'qr', 'meta', 'api']
    },
    {
      id: 'faq_3',
      question: '¿Cuáles son los precios de los planes y la bolsa de créditos?',
      answer: 'Disponemos de 3 planes: Starter ($29/mes con 2,500 créditos), Growth ($79/mes con 10,000 créditos) y Enterprise ($199/mes con créditos ilimitados y cluster dedicado). Cada mensaje saliente descuenta 1 crédito de tu plan.',
      category: 'Precios & Facturación',
      keywords: ['precios', 'planes', 'costo', 'creditos', 'tarifas', 'cuanto cuesta', 'pagos']
    },
    {
      id: 'faq_4',
      question: '¿Puedo emitir facturas y pedidos sincronizados con ERPNext?',
      answer: '¡Totalmente! Clientum sincroniza en tiempo real Sales Orders, Facturas Invoices, lista de ítems e inventario con ERPNext, enviando enlaces de pago instantáneos vía WhatsApp.',
      category: 'Integraciones ERP',
      keywords: ['erp', 'erpnext', 'factura', 'pedido', 'ventas', 'sincronizacion', 'invoice']
    },
    {
      id: 'faq_5',
      question: '¿Cómo creo campañas y difusiones masivas segmentadas?',
      answer: 'En la sección "Difusiones", puedes elegir una plantilla aprobada por Meta, segmentar tus clientes según su monto de gasto o fecha de compra, y programar el envío masivo en un clic.',
      category: 'WABA & WhatsApp',
      keywords: ['campaña', 'difusion', 'mensajes masivos', 'broadcast', 'segmentos', 'plantillas']
    },
    {
      id: 'faq_6',
      question: '¿Cómo puedo hablar con un asesor o representante humano?',
      answer: '¡Con mucho gusto! Puedes responder "Quiero hablar con un asesor humano" o hacer clic en el botón "Transferir a Humano". Un representante de nuestro equipo se contactará al instante.',
      category: 'Soporte General',
      keywords: ['agente', 'humano', 'asesor', 'persona', 'soporte', 'atencion', 'transferir'],
      isLeadCollectTrigger: true
    }
  ]
};

export const initialABTestCampaigns: ABTestCampaign[] = [
  {
    id: 'ab_301',
    name: 'Experimento A/B: Re-engagement Q3 (Descuento Directo vs. Prueba Gratis)',
    targetSegment: 'Clientes Inactivos (+60 Días)',
    status: 'COMPLETED',
    createdAt: '2026-07-28',
    winningMetric: 'reply_rate',
    winnerVariantId: 'B',
    notes: 'La Variante B (Prueba Gratis 14 Días con llamada explicativa) generó +34.5% más respuestas y conversiones que el descuento directo.',
    variantA: {
      id: 'var_a1',
      variantLetter: 'A',
      name: 'Variante A: Descuento 20% Directo',
      templateId: 'tmpl_101',
      templateName: 'bienvenida_leads_onboarding',
      samplePercentage: 50,
      sentCount: 600,
      deliveredCount: 588,
      readCount: 420,
      repliedCount: 65,
      openRate: 71.4,
      replyRate: 15.5
    },
    variantB: {
      id: 'var_b1',
      variantLetter: 'B',
      name: 'Variante B: Prueba Gratis 14 Días + Asesor',
      templateId: 'tmpl_103',
      templateName: 'invitacion_webinar_trimestral',
      samplePercentage: 50,
      sentCount: 600,
      deliveredCount: 592,
      readCount: 485,
      repliedCount: 142,
      openRate: 81.9,
      replyRate: 29.2
    }
  },
  {
    id: 'ab_302',
    name: 'Experimento A/B: Lanzamiento WABA Multi-agente (Pregunta Corta vs. Botones Interactivos)',
    targetSegment: 'Leads Calificados de Meta Ads',
    status: 'RUNNING',
    createdAt: '2026-07-30',
    winningMetric: 'open_rate',
    winnerVariantId: 'A',
    notes: 'Variante A liderando levemente en apertura inicial gracias al encabezado directo con emoji.',
    variantA: {
      id: 'var_a2',
      variantLetter: 'A',
      name: 'Variante A: Encabezado Emoji + Pregunta Corta',
      templateId: 'tmpl_101',
      templateName: 'bienvenida_leads_onboarding',
      samplePercentage: 50,
      sentCount: 450,
      deliveredCount: 440,
      readCount: 380,
      repliedCount: 92,
      openRate: 86.3,
      replyRate: 24.2
    },
    variantB: {
      id: 'var_b2',
      variantLetter: 'B',
      name: 'Variante B: Texto Largo + Botones CTA Rápidos',
      templateId: 'tmpl_102',
      templateName: 'seguimiento_propuesta_comercial',
      samplePercentage: 50,
      sentCount: 450,
      deliveredCount: 438,
      readCount: 330,
      repliedCount: 78,
      openRate: 75.3,
      replyRate: 23.6
    }
  }
];

export const FRAPPE_APPS: FrappeApp[] = [
  {
    id: 'frappe',
    name: 'frappe',
    title: 'Frappe Framework',
    version: '15.24.0',
    category: 'Core',
    description: 'Core web framework providing DocTypes, Auth, REST APIs, and Role Permissions.',
    isRequired: true,
  },
  {
    id: 'erpnext',
    name: 'erpnext',
    title: 'ERPNext',
    version: '15.22.1',
    category: 'ERP',
    description: 'Full-featured enterprise resource planning with Accounts, Inventory, Buying, Selling, and HR.',
    isRequired: true,
  },
  {
    id: 'hrms',
    name: 'hrms',
    title: 'Frappe HRMS',
    version: '15.11.0',
    category: 'Human Resources',
    description: 'Payroll processing, leave management, employee onboarding, performance appraisals, and expense claims.',
  },
  {
    id: 'payments',
    name: 'payments',
    title: 'Frappe Payments',
    version: '1.2.0',
    category: 'Finance',
    description: 'Stripe, PayPal, Razorpay, and Bank gateway integrations for invoicing and payment collection.',
  },
  {
    id: 'insights',
    name: 'insights',
    title: 'Frappe Insights',
    version: '2.4.1',
    category: 'Analytics',
    description: 'Business intelligence dashboard, SQL query builder, and auto-scheduled chart visualizers.',
  },
  {
    id: 'crm',
    name: 'crm',
    title: 'Frappe CRM',
    version: '1.8.0',
    category: 'Sales',
    description: 'Modern lead pipelines, deal boards, email sync, call logging, and omnichannel communication.',
  },
  {
    id: 'healthcare',
    name: 'healthcare',
    title: 'ERPNext Healthcare',
    version: '15.2.0',
    category: 'Industry',
    description: 'Patient records, appointments, lab tests, prescriptions, and medical billing compliance.',
  },
  {
    id: 'lms',
    name: 'lms',
    title: 'Frappe LMS',
    version: '1.5.0',
    category: 'Education',
    description: 'Online course builder, student portal, quizzes, certificates, and video learning tracks.',
  },
];

export const INITIAL_BENCHES: BenchNode[] = [
  {
    id: 'bench-us-east-01',
    name: 'US-East Bench Alpha',
    hostname: 'useast1-bench.frappe-cloud.internal',
    ipAddress: '198.51.100.24',
    region: 'us-east (N. Virginia)',
    provider: 'AWS',
    frappeBranch: 'v15.24.0',
    sitesCount: 18,
    maxSites: 25,
    cpuUsagePct: 42,
    memoryUsageGB: 18.4,
    memoryTotalGB: 32.0,
    diskUsageGB: 210,
    diskTotalGB: 500,
    status: 'online',
    installedApps: ['frappe', 'erpnext', 'hrms', 'payments', 'crm', 'insights'],
    redisStatus: 'healthy',
    workerStatus: 'idle',
    lastHealthCheck: '2026-07-31T15:50:00Z',
  },
  {
    id: 'bench-eu-west-01',
    name: 'EU-Frankfurt Cluster',
    hostname: 'fra-bench01.hetzner.cloud.internal',
    ipAddress: '203.0.113.88',
    region: 'eu-central (Frankfurt)',
    provider: 'Hetzner',
    frappeBranch: 'v15.24.0',
    sitesCount: 22,
    maxSites: 30,
    cpuUsagePct: 68,
    memoryUsageGB: 28.1,
    memoryTotalGB: 64.0,
    diskUsageGB: 380,
    diskTotalGB: 1000,
    status: 'online',
    installedApps: ['frappe', 'erpnext', 'hrms', 'payments', 'healthcare', 'lms'],
    redisStatus: 'healthy',
    workerStatus: 'busy',
    lastHealthCheck: '2026-07-31T15:52:10Z',
  },
  {
    id: 'bench-ap-south-01',
    name: 'APAC-Mumbai SpeedBench',
    hostname: 'bom-bench02.gcp.internal',
    ipAddress: '192.0.2.142',
    region: 'ap-south (Mumbai)',
    provider: 'GCP',
    frappeBranch: 'v15.22.0',
    sitesCount: 12,
    maxSites: 20,
    cpuUsagePct: 29,
    memoryUsageGB: 11.2,
    memoryTotalGB: 32.0,
    diskUsageGB: 145,
    diskTotalGB: 500,
    status: 'online',
    installedApps: ['frappe', 'erpnext', 'hrms', 'payments', 'crm'],
    redisStatus: 'healthy',
    workerStatus: 'idle',
    lastHealthCheck: '2026-07-31T15:54:00Z',
  },
  {
    id: 'bench-staging-01',
    name: 'Dev/Staging Bench v16',
    hostname: 'staging-bench.internal',
    ipAddress: '10.0.4.12',
    region: 'us-central (Iowa)',
    provider: 'DigitalOcean',
    frappeBranch: 'v16.0.0-beta.2',
    sitesCount: 5,
    maxSites: 10,
    cpuUsagePct: 15,
    memoryUsageGB: 5.6,
    memoryTotalGB: 16.0,
    diskUsageGB: 45,
    diskTotalGB: 250,
    status: 'maintenance',
    installedApps: ['frappe', 'erpnext', 'insights'],
    redisStatus: 'warning',
    workerStatus: 'idle',
    lastHealthCheck: '2026-07-31T15:45:00Z',
  },
];

export const INITIAL_SITES = initialSaaSClusterSites;

export const INITIAL_SUBSCRIPTIONS: SubscriptionRecord[] = [
  {
    id: 'sub-001',
    siteId: 'site_101',
    siteName: 'Acme Global Logistics',
    companyName: 'Acme Global Logistics',
    planId: 'professional',
    amount: 149,
    billingInterval: 'monthly',
    status: 'active',
    paymentMethod: 'Credit Card',
    nextBillingDate: '2026-08-15T00:00:00Z',
    customerEmail: 'sarah.connor@acmeglobal.com'
  }
];

export const INITIAL_BACKUPS: SiteBackup[] = [
  {
    id: 'bkp-101',
    siteId: 'site_101',
    siteName: 'Acme Global Logistics',
    type: 'manual',
    sizeMB: 245.8,
    status: 'completed',
    createdAt: '2026-07-31T03:00:00Z',
    downloadUrl: '#',
  }
];

export const INITIAL_LOGS: SystemLog[] = [
  {
    id: 'log-001',
    timestamp: '2026-07-31T15:45:00Z',
    level: 'info',
    source: 'system',
    message: 'System cluster health check passed cleanly.',
    details: 'All nodes online and responding.'
  }
];

export const MOCK_METRICS: ControlPlaneMetrics = {
  totalSites: 12,
  activeSites: 10,
  provisioningSites: 1,
  maintenanceSites: 1,
  totalBenches: 3,
  onlineBenches: 3,
  mrrAmount: 3480,
  activeSubscriptions: 10,
  totalDiskUsedGB: 735,
  totalDiskCapacityGB: 2250,
  averageCpuUsagePct: 38.5,
  backupsCountToday: 12,
  backupSuccessRatePct: 100,
};





