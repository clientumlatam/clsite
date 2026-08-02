// Stack de plugins de WordPress recomendado por área, alineado a las categorías
// reales del catálogo de servicios de Clientum (ver crmInitialData.ts).

export interface WpPlugin {
  name: string;
  purpose: string;
}

export interface WpStackArea {
  id: string;
  emoji: string;
  title: string;
  /** Categoría del catálogo de productos con la que se cruza esta área */
  catalogCategory: string;
  plugins: WpPlugin[];
}

export const wordpressStack: WpStackArea[] = [
  {
    id: 'ecommerce',
    emoji: '🛒',
    title: 'E-Commerce (WooCommerce core)',
    catalogCategory: 'E-Commerce',
    plugins: [
      { name: 'WooCommerce', purpose: 'Base obligatoria' },
      { name: 'WooCommerce Mercado Pago (oficial)', purpose: 'Pagos con MP, Pix, tarjetas AR' },
      { name: 'Stripe for WooCommerce (WooPayments)', purpose: 'Pagos internacionales' },
      { name: 'YITH WooCommerce Subscriptions', purpose: 'Planes mensuales (Plan Inicial, PyME, etc.)' },
      { name: 'YITH WooCommerce Multi-step Checkout', purpose: 'Checkout optimizado' },
    ],
  },
  {
    id: 'facturacion',
    emoji: '🧾',
    title: 'Facturación AFIP / ARCA',
    catalogCategory: 'ERP',
    plugins: [
      { name: 'WooCommerce AFIP (WP Online Support)', purpose: 'Emite facturas A/B/C desde el checkout' },
      { name: 'TusFacturas.ar para WooCommerce', purpose: 'Alternativa con API WSFE propia' },
    ],
  },
  {
    id: 'crm-erp',
    emoji: '🤖',
    title: 'CRM + ERP (Dolibarr)',
    catalogCategory: 'CRM',
    plugins: [
      { name: 'FluentCRM', purpose: 'CRM nativo WordPress; captura leads, segmenta, automatiza emails — complementa Dolibarr' },
      { name: 'WP Fusion', purpose: 'Sincroniza usuarios/tags de WordPress con Dolibarr vía API' },
      { name: 'Dolibarr WooCommerce Connector (módulo oficial Dolibarr)', purpose: 'Sincroniza pedidos WooCommerce ↔ Dolibarr' },
    ],
  },
  {
    id: 'automatizacion',
    emoji: '⚡',
    title: 'Automatización (n8n)',
    catalogCategory: 'Automatización',
    plugins: [
      { name: 'WP Webhooks', purpose: 'Dispara webhooks desde cualquier evento WP hacia n8n' },
      { name: 'AutomatorWP', purpose: 'Automatizaciones internas (si no todo pasa por n8n)' },
      { name: 'WPCode', purpose: 'Snippets para llamadas API personalizadas' },
    ],
  },
  {
    id: 'capacitacion',
    emoji: '📚',
    title: 'Capacitación (Moodle / Tutor LMS / LearnPress)',
    catalogCategory: 'Capacitación',
    plugins: [
      { name: 'Tutor LMS', purpose: 'LMS completo, se integra con WooCommerce para ventas de cursos' },
      { name: 'LearnPress', purpose: 'Alternativa más liviana' },
      { name: 'Moodle', purpose: 'Standalone separado; se puede linkear con SSO vía plugin externo' },
    ],
  },
  {
    id: 'bi',
    emoji: '📊',
    title: 'Business Intelligence (Metabase)',
    catalogCategory: 'Business Intelligence',
    plugins: [
      { name: 'MonsterInsights / Analytify', purpose: 'Google Analytics 4 en WP' },
      { name: 'Metabase Embed (iframe custom)', purpose: 'No hay plugin oficial; se embebe vía shortcode/widget HTML' },
      { name: 'WooCommerce Analytics (incluido en WC)', purpose: 'Reportes de ventas nativos' },
    ],
  },
  {
    id: 'soporte',
    emoji: '💬',
    title: 'WhatsApp / Chatbot / Soporte',
    catalogCategory: 'Soporte',
    plugins: [
      { name: 'WhatsApp Chat WP (quadlayers)', purpose: 'Botón flotante WhatsApp' },
      { name: 'Tidio', purpose: 'Chatbot con IA + live chat' },
      { name: 'FreeScout WP Integration (vía API)', purpose: 'FreeScout es standalone; se conecta con webhooks' },
      { name: 'SupportCandy', purpose: 'Tickets de soporte dentro de WP si no usás FreeScout' },
    ],
  },
  {
    id: 'marketing',
    emoji: '📣',
    title: 'Marketing Digital (Mautic / WP Social)',
    catalogCategory: 'Marketing Digital',
    plugins: [
      { name: 'WP Mautic (oficial)', purpose: 'Trackea usuarios de WordPress en Mautic' },
      { name: 'MailPoet', purpose: 'Email marketing nativo (alternativa a Mautic para campañas simples)' },
      { name: 'Rank Math SEO', purpose: 'SEO técnico + schema + sitemap' },
      { name: 'WP Social', purpose: 'Sharing + feed de redes sociales' },
      { name: 'Pixel Manager for WooCommerce', purpose: 'FB Ads, Google Ads, TikTok Ads tracking' },
    ],
  },
  {
    id: 'hosting',
    emoji: '☁️',
    title: 'Hosting / Infraestructura (Cloudflare + Docker)',
    catalogCategory: 'Hosting e Infraestructura',
    plugins: [
      { name: 'Cloudflare (plugin oficial)', purpose: 'Cache rules, purge automático, modo bajo ataque' },
      { name: 'WP Rocket', purpose: 'Cache + minificación (complementa Cloudflare)' },
      { name: 'WP Offload Media', purpose: 'Archivos en Cloudflare R2 / S3' },
      { name: 'UpdraftPlus', purpose: 'Backups automáticos' },
    ],
  },
  {
    id: 'seguridad',
    emoji: '🔒',
    title: 'Seguridad / Auth',
    catalogCategory: 'Ciberseguridad',
    plugins: [
      { name: 'Wordfence', purpose: 'Firewall + escaneo' },
      { name: 'JWT Authentication for WP REST API', purpose: 'Si exponés la API REST a n8n / Dolibarr' },
      { name: 'Limit Login Attempts Reloaded', purpose: 'Previene fuerza bruta' },
    ],
  },
  {
    id: 'builder',
    emoji: '🎨',
    title: 'Builder / Diseño',
    catalogCategory: 'Desarrollo Web',
    plugins: [
      { name: 'Elementor Pro', purpose: 'Page builder principal' },
      { name: 'Flatsome (tema)', purpose: 'UX Builder integrado, ideal para WooCommerce' },
      { name: 'Advanced Custom Fields (ACF)', purpose: 'Campos personalizados para tipos de contenido' },
    ],
  },
];

/** Stack mínimo viable recomendado para una PyME que arranca con Clientum */
export const minimumViableStack = [
  'WooCommerce',
  'Mercado Pago',
  'AFIP',
  'FluentCRM',
  'WP Mautic',
  'Tutor LMS',
  'Elementor',
  'Cloudflare',
  'WP Rocket',
  'Rank Math',
];
