export type LeadStage = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Won' | 'Lost';

export type Role = 'admin' | 'manager' | 'agent';

// Channel Preferences for Customer Segmentation
export type CommunicationChannel = 'WhatsApp' | 'Email' | 'SMS' | 'Phone' | 'Live Chat' | 'Instagram' | 'Globe';

export interface SegmentCriteria {
  minAmountSpent?: number;
  maxAmountSpent?: number;
  lastPurchaseDays?: number; // e.g. 30, 60, 90, 180
  lastPurchaseRelation?: 'within_days' | 'older_than_days' | 'no_purchases' | 'any';
  channelPreferences?: CommunicationChannel[];
  leadStages?: LeadStage[];
  tags?: string[];
  city?: string;
  minScore?: number;
}

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  criteria: SegmentCriteria;
  color: string; // Tailwind color or hex
  icon?: string;
  createdAt: string;
  updatedAt: string;
  contactCount?: number;
  avgLifetimeValue?: number;
}

// AI Chatbot & Handover Types
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'CRM Features' | 'WABA & WhatsApp' | 'Precios & Facturación' | 'Integraciones ERP' | 'Soporte General';
  keywords: string[];
  isLeadCollectTrigger?: boolean;
}

export interface LeadCollectedData {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  interest?: string;
  capturedAt?: string;
}

export interface ChatbotHandoverRule {
  id: string;
  name: string;
  condition: 'explicit_agent_request' | 'high_value_lead' | 'unanswered_faq_count' | 'negative_sentiment' | 'custom_keyword';
  threshold?: number | string;
  action: 'assign_human_agent' | 'flag_urgent' | 'notify_slack';
  defaultAgentId?: string;
  isEnabled: boolean;
  description: string;
}

export interface ChatbotConfig {
  botName: string;
  welcomeMessage: string;
  isEnabled: boolean;
  fallbackToHuman: boolean;
  collectLeadInfo: boolean;
  leadFields: ('name' | 'email' | 'company' | 'phone' | 'interest')[];
  handoverRules: ChatbotHandoverRule[];
  faqs: FaqItem[];
  handoverCountTotal?: number;
  infoCollectedTotal?: number;
}

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  wabaId: string;
  phoneNumberId: string;
  displayPhoneNumber: string;
  isConnected: boolean;
  plan: 'Starter' | 'Growth' | 'Enterprise';
  monthlyCredits: number;
  creditsUsed: number;
  webhookUrl: string;
  webhookSecret: string;
}

export interface AgentPermissions {
  canCreateCampaigns: boolean;
  canUseAiCopilot: boolean;
  canManageTemplates: boolean;
  canExportLeads: boolean;
  canManageErpOrders: boolean;
  canManageCluster: boolean;
  canViewAnalytics: boolean;
}

export interface AgentGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  status: 'In Progress' | 'Achieved' | 'At Risk';
}

export interface AgentTask {
  id: string;
  title: string;
  leadId?: string;
  leadName?: string;
  convId?: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
  assignedAt: string;
  dueDate: string;
  notes?: string;
  assignedBy?: string;
}

export interface DiscussionMessage {
  id: string;
  sender?: string;
  avatar?: string;
  role?: string;
  agentRole?: string;
  agentName?: string;
  text?: string;
  content?: string;
  timestamp: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  status: 'online' | 'busy' | 'offline' | 'working' | 'waiting' | string;
  assignedLeadsCount: number;
  permissions?: AgentPermissions;
  goals?: AgentGoal[];
  active_tasks?: AgentTask[];
  department?: string;
  identity?: string;
  process?: string[];
  skill?: string[];
  memory?: string[];
  currentAction?: string;
}

export interface EnrichmentLog {
  timestamp: string;
  sector?: string;
  employeeCount?: string;
  annualRevenue?: string;
  technologies?: string[];
  [key: string]: any;
}

export interface Lead {
  id: string;
  name?: string;
  phone?: string;
  email?: string;
  company?: string;
  dealValue?: number;
  stage?: LeadStage;
  source?: 'WhatsApp' | 'Meta Ads' | 'Website' | 'Manual' | 'Referral' | string;
  assignedAgentId?: string;
  assignedAgentName?: string;
  tags?: string[];
  lastContacted?: string;
  notes?: string | string[];
  score?: number; // 0-100 AI Intent Score
  summary?: string;
  city?: string;
  address?: string;
  hook?: string;
  createdAt?: string;
  unreadCount?: number;
  companyName?: string;
  contactName?: string;
  contactPhone?: string;
  contactRole?: string;
  industry?: string;
  painPoint?: string;
  fitScore?: number;
  meddicScore?: number;
  brochureText?: string;
  status?: string;
  amountArs?: number;
  enrichmentHistory?: EnrichmentLog[];
  
  // Segmentation fields
  totalAmountSpent?: number;
  lastPurchaseDate?: string;
  channelPreference?: CommunicationChannel;
}

export type MessageType = 'text' | 'image' | 'document' | 'audio' | 'template' | 'interactive';
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed';

export interface WhatsAppMessage {
  id: string;
  conversationId: string;
  sender: 'lead' | 'agent' | 'system' | 'bot';
  senderName?: string;
  text: string;
  type: MessageType;
  mediaUrl?: string;
  mediaFileName?: string;
  timestamp: string;
  status: MessageStatus;
  templateName?: string;
  interactiveButtons?: string[];
  isNote?: boolean; // Internal team note
  scheduledAt?: string; // Scheduled delivery time
}

export interface Conversation {
  id: string;
  leadId: string;
  leadName: string;
  phone: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  assignedAgentId?: string;
  assignedAgentName?: string;
  tags: string[];
  stage: LeadStage;
  pinned?: boolean;
  
  // Chatbot & Handover state
  managedBy?: 'bot' | 'human';
  handoverReason?: string;
  collectedLeadInfo?: LeadCollectedData;

  // Sentiment Analysis
  sentiment?: 'Happy' | 'Neutral' | 'Frustrated' | 'Inquisitive';
  sentimentScore?: number; // 0 to 100 positive score
  sentimentReason?: string;
  
  // Priority
  priority?: 'Urgent' | 'High' | 'Low';
}

export type TemplateCategory = 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
export type TemplateStatus = 'APPROVED' | 'PENDING' | 'REJECTED' | 'DRAFT';

export interface TemplateButton {
  type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER';
  text: string;
  value?: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  language: string;
  category: TemplateCategory;
  status: TemplateStatus;
  headerType?: 'NONE' | 'TEXT' | 'IMAGE' | 'DOCUMENT';
  headerText?: string;
  bodyText: string;
  footerText?: string;
  buttons?: TemplateButton[];
  createdAt: string;
}

export type CampaignStatus = 'DRAFT' | 'SCHEDULED' | 'RUNNING' | 'COMPLETED' | 'PAUSED' | 'borrador' | 'programada' | 'en_progreso' | 'completada' | string;

export interface Campaign {
  id: string;
  name: string;
  templateId?: string;
  templateName?: string;
  messageTemplate?: string;
  targetSegment?: string;
  segmentId?: string;
  segmentName?: string;
  totalRecipients?: number;
  recipientsCount?: number;
  sentCount?: number;
  deliveredCount?: number;
  readCount?: number;
  repliedCount?: number;
  responseRate?: number;
  status: CampaignStatus;
  scheduledAt?: string;
  scheduledDate?: string;
  createdAt?: string;
}

export interface ABTestVariant {
  id: string;
  variantLetter: 'A' | 'B';
  name: string;
  templateId: string;
  templateName: string;
  samplePercentage: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  repliedCount: number;
  openRate: number;
  replyRate: number;
}

export interface ABTestCampaign {
  id: string;
  name: string;
  targetSegment: string;
  status: CampaignStatus;
  createdAt: string;
  variantA: ABTestVariant;
  variantB: ABTestVariant;
  winningMetric: 'open_rate' | 'reply_rate';
  winnerVariantId?: 'A' | 'B';
  notes?: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  triggerKeyword: string;
  matchType: 'exact' | 'contains' | 'any';
  actionType: 'send_template' | 'assign_agent' | 'update_stage' | 'ai_reply' | 'direct_text';
  actionValue: string;
  actionValueName?: string;
  replyText?: string;
  isEnabled: boolean;
}

export interface AnalyticsSummary {
  totalLeads: number;
  activeChats: number;
  broadcastMessagesSent: number;
  avgResponseTimeMinutes: number;
  conversionRate: number;
  messagesTrend: { date: string; incoming: number; outgoing: number }[];
  leadStagesCount: Record<LeadStage, number>;
}

export interface ErpItem {
  id: string;
  itemCode: string;
  itemName: string;
  category: string;
  stockQty: number;
  unitPrice: number;
  uom: string;
  currency: string;
  imageUrl?: string;
}

export interface ErpDocumentItem {
  itemCode: string;
  itemName: string;
  qty: number;
  rate: number;
  amount: number;
}

export type ErpDocStatus = 'Draft' | 'Submitted' | 'Paid' | 'Invoiced' | 'Cancelled' | 'Overdue';

export interface ErpSalesOrder {
  id: string; // e.g. SAL-ORD-2026-0012
  customerName: string;
  customerPhone: string;
  postingDate: string;
  deliveryDate: string;
  grandTotal: number;
  status: ErpDocStatus;
  items: ErpDocumentItem[];
  currency: string;
  paymentUrl?: string;
}

export interface ErpInvoice {
  id: string; // e.g. ACC-SINV-2026-0089
  customerName: string;
  postingDate: string;
  dueDate: string;
  amount: number;
  outstandingAmount: number;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  itemsCount: number;
}

export type TableStatus = 'Available' | 'Occupied' | 'Reserved' | 'Bill Requested';

export interface RestaurantTable {
  id: string;
  tableNumber: string;
  capacity: number;
  zone: 'Comedor Principal' | 'Terraza' | 'Bar & VIP' | 'Privado';
  status: TableStatus;
  currentOrderId?: string;
  assignedWaiter?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'Platos Principales' | 'Bebidas & Cócteles' | 'Entradas' | 'Postres' | 'Menú Ejecutivo';
  price: number;
  description: string;
  isAvailable: boolean;
  preparationTimeMinutes: number;
  imageUrl?: string;
}

export type RestaurantOrderStatus = 'Pending' | 'Kitchen Preparing' | 'Ready to Serve' | 'Completed' | 'Cancelled';

export interface RestaurantOrder {
  id: string;
  orderType: 'Dine-in' | 'Takeaway' | 'Delivery' | 'WhatsApp QR';
  tableNumber?: string;
  customerName: string;
  customerPhone: string;
  items: { menuItemName: string; qty: number; price: number; notes?: string }[];
  status: RestaurantOrderStatus;
  totalAmount: number;
  timestamp: string;
  notes?: string;
}

export interface EcommerceProduct {
  id: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  rating: number;
  imageUrl: string;
  badge?: string;
  description: string;
}

export interface StoreCartItem {
  product: EcommerceProduct;
  quantity: number;
}

export type StoreOrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Awaiting Payment';

export interface StoreOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  items: { productTitle: string; quantity: number; unitPrice: number }[];
  totalAmount: number;
  status: StoreOrderStatus;
  createdAt: string;
  paymentMethod: 'WhatsApp Direct' | 'Mercado Pago' | 'Credit Card' | 'Clientum Pay';
  frappeSalesOrderRef?: string;
}

export type ClusterSiteStatus = 'Active' | 'Provisioning' | 'Suspended' | 'Backup in Progress' | 'Maintenance' | 'Migrating' | 'active' | 'provisioning' | 'suspended' | 'maintenance' | 'migrating';

export interface SaaSClusterSite {
  id: string;
  name?: string;
  domain?: string;
  siteName?: string;
  companyName?: string;
  ownerEmail?: string;
  subdomain: string;
  databaseName?: string;
  dbName?: string;
  dbUser?: string;
  benchId?: string;
  benchName?: string;
  plan: 'Growth' | 'Professional' | 'Enterprise' | 'Starter' | 'starter' | 'growth' | 'professional' | 'enterprise' | string;
  saasPlan?: string;
  status: ClusterSiteStatus;
  sslStatus?: string;
  sslActive?: boolean;
  customDomain?: string;
  frappeVersion?: string;
  erpnextVersion?: string;
  installedApps?: string[];
  ssoToken?: string;
  region?: string;
  awsRegion?: string;
  country?: string;
  storageUsedMb?: number;
  storageMaxMb?: number;
  diskUsageMB?: number;
  diskQuotaMB?: number;
  dbSizeMB?: number;
  diskUsageGB?: number;
  diskQuotaGB?: number;
  usersUsed?: number;
  usersMax?: number;
  usersCount?: number;
  maxUsers?: number;
  activeUsers?: number;
  cpuUsagePct?: number;
  ramUsageMB?: number;
  uptimePct?: number;
  nodeIp?: string;
  wabaMessagesUsed?: number;
  wabaMessagesMax?: number;
  createdAt: string;
  lastBackupAt?: string;
}

export interface GeoStateCity {
  country: string;
  countryCode: string;
  stateName: string;
  cities: string[];
  fiscalTaxRate: number;
}

export interface SaaSUserSession {
  id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'manager' | 'agent';
  companyName: string;
  subdomain: string;
  plan: 'Growth' | 'Professional' | 'Enterprise';
  avatarUrl: string;
  isTwoFactorEnabled: boolean;
  lastLoginAt: string;
}

export interface SaaSThemeConfig {
  presetName: string;
  primaryColor: string;
  accentColor: string;
  sidebarStyle: 'Dark Glass' | 'Minimal Light' | 'Compact Icons';
  fontFamily: 'Plus Jakarta Sans' | 'Inter' | 'Geist' | 'Outfit';
  brandLogoUrl: string;
  customCss: string;
  enableCustomNavbar: boolean;
  customFooterText: string;
  loginTheme: 'Centered Card' | 'Split Modern' | 'Minimal Slate';
  activeThemeId: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userEmail: string;
  userName: string;
  action: string;
  category: 'AUTH' | 'CRM' | 'WHATSAPP' | 'ERP' | 'AGENT' | 'SYSTEM' | 'SECURITY';
  resource: string;
  ipAddress: string;
  status: 'Success' | 'Warning' | 'Failed';
  details: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: 'Politicas' | 'Precios y Planes' | 'Soporte Técnico' | 'FAQS' | 'Procedimientos ERP';
  content: string;
  fileType?: string;
  tags: string[];
  embeddingVectorCount?: number;
  updatedAt: string;
  author: string;
  status: 'Indexed' | 'Processing' | 'Draft';
}

export interface ActivityStreamItem {
  id: string;
  timestamp: string;
  agentName: string;
  agentAvatar?: string;
  actionType: 'ERP_INVOICE' | 'ERP_SALES_ORDER' | 'LEAD_STAGE' | 'WHATSAPP_BROADCAST' | 'DELEGATION' | 'STORE_ORDER' | 'KNOWLEDGE_INDEX';
  description: string;
  resourceId?: string;
  status: 'Completed' | 'In Progress' | 'Alert' | 'Pending';
  timeAgo: string;
}

export type Site = SaaSClusterSite;
export type SiteStatus = ClusterSiteStatus;

export interface SiteBackup {
  id: string;
  siteId: string;
  siteName?: string;
  createdAt: string;
  expiresAt?: string;
  size?: string;
  sizeMB?: number;
  fileName?: string;
  status?: string;
  type: 'full' | 'incremental' | 'manual' | 'scheduled' | 'pre_migration';
  downloadUrl?: string;
}

export interface BenchNode {
  id: string;
  name: string;
  hostname?: string;
  ip?: string;
  ipAddress?: string;
  provider?: string;
  frappeBranch?: string;
  region?: string;
  cpuUsagePct?: number;
  memoryUsageGB?: number;
  memoryTotalGB?: number;
  sitesCount?: number;
  maxSites?: number;
  diskUsageGB?: number;
  diskTotalGB?: number;
  installedApps?: string[];
  redisStatus?: string;
  workerStatus?: string;
  lastHealthCheck?: string;
  status: 'online' | 'offline' | 'maintenance';
}

export type PlanTier = 'Starter' | 'Growth' | 'Professional' | 'Enterprise' | 'starter' | 'growth' | 'professional' | 'enterprise' | string;

export interface SubscriptionRecord {
  id: string;
  tenantId?: string;
  siteId?: string;
  companyName: string;
  customerEmail?: string;
  siteName: string;
  plan?: PlanTier;
  planId: PlanTier;
  amount: number;
  billingInterval: string;
  status: 'active' | 'trialing' | 'cancelled' | 'past_due';
  paymentMethod: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  nextBillingDate?: string;
  nextInvoiceAt?: string;
}

export interface Invoice {
  id: string;
  subscriptionId: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'unpaid' | 'overdue';
}

export interface AIAgent {
  id: string;
  role: string;
  name: string;
  avatar: string;
  status: 'executing' | 'idle' | 'paused' | 'error' | 'online' | 'busy' | 'offline';
  goals: string[];
  systemPrompt: string;
  memorySizeKB: number;
  assignedSubdomain: string;
  mcpToolsConnected: string[];
  currentTask: string;
  activeReasoningChain: string[];
  tasksCompleted: number;
  accuracyPct: number;
  lastActionAt: string;
  email?: string;
  assignedLeadsCount?: number;
}

export interface MCPTool {
  id: string;
  name: string;
  server: string;
  description: string;
  parameters: Record<string, any>;
  permissionsRequired: string[];
  category: string;
  isAvailable: boolean;
}

export interface RAGDocument {
  id: string;
  title: string;
  sourceType: string;
  subdomain: string;
  fileSizeMB: number;
  status: 'indexed' | 'processing' | 'failed' | 'Indexed' | 'Processing' | 'Draft';
  totalEmbeddings: number;
  chunkCount: number;
  lastIndexedAt: string;
}

export interface N8nWorkflow {
  id: string;
  name: string;
  trigger: string;
  status: 'active' | 'inactive' | 'draft';
  executionCount: number;
  lastRunAt: string;
  targetApp: string;
  nodes?: any[];
  edges?: any[];
}

export interface ArchitecturePhase {
  phase: number;
  title: string;
  status: 'completed' | 'in_progress' | 'planned';
  subtitle: string;
  summary: string;
  diagramMermaid: string;
  directoryTree: string;
  keyTechnicalDecisions: string[];
  advantages: string[];
  risksAndMitigations: string[];
}

export interface EmailNotification {
  id: string;
  toEmail: string;
  eventType: 'provisioning_success' | 'backup_completed' | 'invoice_overdue' | 'usage_limit_warning' | 'security_alert' | string;
  subject: string;
  bodyText: string;
  status: 'sent' | 'pending' | 'failed' | 'Sent' | 'Failed' | 'Pending';
  sentAt?: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface ControlPlaneMetrics {
  totalSites: number;
  activeSites: number;
  provisioningSites: number;
  maintenanceSites: number;
  totalBenches: number;
  onlineBenches: number;
  mrrAmount: number;
  activeSubscriptions: number;
  totalDiskUsedGB: number;
  totalDiskCapacityGB: number;
  averageCpuUsagePct: number;
  backupsCountToday: number;
  backupSuccessRatePct: number;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug' | 'critical';
  siteId?: string;
  siteName?: string;
  benchId?: string;
  source: string;
  message: string;
  details: string;
}

export interface FrappeApp {
  id: string;
  name: string;
  title: string;
  version: string;
  category: string;
  description: string;
  isRequired?: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  maxUsers: number;
  maxDiskMB: number;
  includedApps: string[];
  backgroundWorkers: number;
  customDomainAllowed: boolean;
  backupFrequency: string;
  supportLevel: string;
}

export interface LogEntry {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface EcosystemItem {
  id: string;
  name: string;
  repoUrl?: string;
  description: string;
  category: string;
  subcategory: string;
  stars: number;
  language: string;
  docsUrl?: string;
  owner: string;
  status: string;
  relevanceToClientum: string;
  keyFeatures: string[];
  argentinaPotential: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  tenantId?: string;
  companyName?: string;
  createdAt?: string;
}

export interface AsyncJob {
  id: string;
  type: string;
  status: 'pending' | 'processing' | 'running' | 'completed' | 'failed';
  progressPct?: number;
  message?: string;
  error?: string;
  siteId?: string;
  siteName?: string;
  subdomain?: string;
  currentStep?: string;
  completedAt?: string;
  logs?: string[];
  createdAt: string;
  updatedAt?: string;
  result?: any;
}

export interface BillingWebhookEvent {
  id: string;
  type: string;
  event?: string;
  customerEmail?: string;
  subdomain?: string;
  companyName?: string;
  plan?: string;
  tenantId?: string;
  amount?: number;
  currency?: string;
  payload?: any;
  timestamp: string;
}



