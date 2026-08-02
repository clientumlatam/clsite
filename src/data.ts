import { BrochureData, CRMDeal, AIChatMessage } from "./types";

export const DEFAULT_BROCHURE_DATA: BrochureData = {
  cover: {
    slogan: "Tecnología real para PyMEs reales.",
    sub: "CRM inteligente, Chatbot WhatsApp 24/7, Facturación AFIP y Asistente IA — todo en una plataforma. Sin código, sin dólares, sin excusas."
  },
  chatbot: {
    title: "Tu negocio atiende solo, las 24 horas.",
    features: [
      { title: "Respuesta instantánea", desc: "Responde preguntas frecuentes al instante, en cualquier momento." },
      { title: "Agendamiento automático", desc: "El bot agenda citas según tu disponibilidad y las confirma por WhatsApp." },
      { title: "Cotizaciones automáticas", desc: "Genera y envía presupuestos personalizados sin que vos toques nada." },
      { title: "Calificación de leads", desc: "Clasifica cada consulta según intención de compra y la prioriza en el CRM." }
    ],
    flowSteps: [
      "El cliente escribe al WhatsApp: El bot responde al instante con el tono de tu marca",
      "La IA califica y responde: Cotiza, agenda y recopila datos automáticamente",
      "El lead llega al CRM: Si necesita asesor, deriva con historial completo",
      "Tu equipo cierra la venta: Solo interviene en el momento justo, con todo el contexto"
    ]
  },
  crm: {
    title: "Nunca más pierdas una venta.",
    features: [
      { title: "Pipeline drag & drop", desc: "Mové deals entre etapas. Tu equipo ve el estado de cada venta en tiempo real." },
      { title: "Contactos y empresas", desc: "Base de datos centralizada con historial completo de cada cliente." },
      { title: "Seguimiento automático", desc: "Tareas y recordatorios post-venta que se generan solos según las reglas que definís." },
      { title: "Acceso desde el celular", desc: "Consultás y actualizás tu CRM desde cualquier dispositivo, sin instalar nada." }
    ]
  },
  services: [
    {
      title: "Desarrollo Web & E-Commerce",
      desc: "Estrategias de diseño basadas en el comportamiento del consumidor y últimas tendencias. Creamos tiendas de alto rendimiento con pasarelas de pago (MercadoPago) e integraciones con transportistas nacionales.",
      bullets: ["Tiendas WooCommerce y Shopify", "Diseño UX/UI responsivo premium", "Control unificado de stock omnicanal"]
    },
    {
      title: "Implementación de ERP y CRM",
      desc: "Conectamos tus canales de venta directamente a tu facturación electrónica. Olvídate de liquidaciones complejas de AFIP en pesos; nuestro sistema lo hace en segundos de forma segura.",
      bullets: ["Trazabilidad de cadena logística", "Factura electrónica AFIP automática", "Pipeline de ventas tipo Kanban drag-drop"]
    },
    {
      title: "Consultoría & Ciberseguridad",
      desc: "Auditorías de procesos exhaustivas para detectar pérdidas financieras. Fortalecemos las bases de datos de tus clientes contra filtraciones de información sensible y ciberataques.",
      bullets: ["Auditorías de seguridad y vulnerabilidades", "Respaldo en la nube automatizado", "Consultoría en expansión omnicanal"]
    },
    {
      title: "Consultoría en IA & BI",
      desc: "Estrategias de Inteligencia Artificial (AI) y Business Intelligence (BI) para potenciar operaciones comerciales y decisiones basadas en analítica inteligente de datos.",
      bullets: ["Modelos y Agentes de IA a medida", "Tableros BI y analítica predictiva", "Automatización inteligente de flujos"]
    }
  ],
  testimonial: {
    content: "Implementamos Clientum en 5 días. El bot de WhatsApp nos generó 40% más de consultas en el primer mes sin contratar nadie. Los reportes automáticos cambiaron la forma en que tomamos decisiones.",
    author: "Martín R.",
    company: "Distribuidora del Sur S.A. — Neuquén"
  }
};

export const INDUSTRY_PRESETS: { [key: string]: { label: string; data: BrochureData } } = {
  clientum_oficial: {
    label: "🏢 Clientum — Plataforma IA para PyMEs",
    data: {
      cover: {
        slogan: "Atención al cliente 24/7 sin contratar personal.",
        sub: "Chatbot WhatsApp + CRM inteligente + Facturación AFIP + Asistente IA. Operativo en una semana, sin código, en pesos argentinos."
      },
      chatbot: {
        title: "Tu negocio atiende solo, las 24 horas.",
        features: [
          { title: "Respuesta instantánea", desc: "Responde preguntas frecuentes al instante, a cualquier hora del día o la noche, con el tono de tu marca." },
          { title: "Agendamiento automático", desc: "El bot agenda citas según tu disponibilidad y las confirma por WhatsApp sin intervención humana." },
          { title: "Cotizaciones automáticas", desc: "Genera y envía presupuestos personalizados sin que vos toques nada. El cliente recibe la propuesta al instante." },
          { title: "Calificación de leads", desc: "Clasifica cada consulta según su intención de compra y la prioriza en el CRM automáticamente." },
          { title: "Recopilación de datos", desc: "Obtiene nombre, empresa, email y necesidad del cliente en la conversación, sin formularios externos." },
          { title: "Seguimiento post-consulta", desc: "Si el cliente no responde, el bot retoma el contacto a las 24 y 48 horas. Cero ventas perdidas por olvido." }
        ],
        flowSteps: [
          "El cliente escribe a tu WhatsApp y el bot responde al instante con el tono de tu marca",
          "La IA califica la consulta, cotiza, agenda o recopila datos del cliente automáticamente",
          "Si necesita un asesor, el lead llega al CRM con el historial completo ya cargado",
          "Tu equipo interviene solo en el momento justo, con toda la información lista para cerrar la venta"
        ]
      },
      crm: {
        title: "Nunca más pierdas una venta.",
        features: [
          { title: "Pipeline drag & drop", desc: "Mové deals entre etapas visualmente. Tu equipo ve el estado de cada oportunidad en tiempo real." },
          { title: "Contactos y empresas unificados", desc: "Base de datos centralizada con historial completo de interacciones por WhatsApp, email y llamada." },
          { title: "Facturación AFIP integrada", desc: "Emitís facturas A, B y C con CAE directamente desde el CRM, sin salir del sistema ni cargar datos dos veces." },
          { title: "Asistente IA en castellano", desc: "Preguntale '¿cuáles son mis mejores clientes este mes?' y obtenés la respuesta y el gráfico al instante." }
        ]
      },
      services: [
        {
          title: "Plan Pro — CRM + Chatbot + IA",
          desc: "La solución más popular para PyMEs que quieren escalar sin contratar más personal. Chatbot WhatsApp ilimitado, CRM completo, Asistente IA y Facturación AFIP integrada.",
          bullets: [
            "Chatbot WhatsApp con conversaciones ilimitadas",
            "CRM con contactos ilimitados y pipeline visual",
            "Asistente IA incluido para análisis instantáneo",
            "Facturación AFIP (A, B y C) integrada",
            "Automatización de flujos y seguimientos",
            "Soporte prioritario en menos de 4 horas"
          ],
          price: 0,
          monthly: 179990,
          time: 7
        },
        {
          title: "Integración API Gateway",
          desc: "Conectá Clientum con tus sistemas actuales sin código. ERP, e-commerce, marketplaces, sistemas de stock y cualquier app externa quedan sincronizados en tiempo real.",
          bullets: [
            "Integración con ERP, WooCommerce y MercadoLibre",
            "API REST y webhooks configurables",
            "Mapeo y transformación de datos automática",
            "Monitoreo de flujos en tiempo real"
          ],
          price: 400000,
          monthly: 0,
          time: 2
        },
        {
          title: "Viaweb AI Copilot",
          desc: "IA y automatización a medida para tu negocio. Predicciones de ventas, flujos inteligentes, chatbots especializados y análisis avanzado integrado al CRM.",
          bullets: [
            "Automatización de procesos repetitivos",
            "Predicciones y recomendaciones con IA",
            "IA conversacional entrenada para tu rubro",
            "Integración nativa con el CRM de Clientum"
          ],
          price: 600000,
          monthly: 0,
          time: 3
        },
        {
          title: "Desarrollo Web & E-Commerce",
          desc: "Sitios, landing pages y tiendas online que capturan leads y los mandan directo al CRM. Con MercadoPago, stock sincronizado y diseño UX de alto rendimiento.",
          bullets: [
            "Landing pages integradas al CRM",
            "Tiendas WooCommerce con sincronización de stock",
            "Pasarela MercadoPago nativa",
            "SEO técnico y diseño responsive incluidos"
          ],
          price: 800000,
          monthly: 0,
          time: 15
        },
        {
          title: "Business Intelligence",
          desc: "Convertí los datos de tu CRM y ERP en dashboards e informes que guían las decisiones. Conectamos tus fuentes y construimos el tablero de control de tu empresa.",
          bullets: [
            "Dashboards personalizados en tiempo real",
            "KPIs comerciales y operativos en un panel",
            "Predicciones y tendencias por sector",
            "Reportes automáticos por email o WhatsApp"
          ],
          price: 800000,
          monthly: 0,
          time: 10
        }
      ],
      testimonial: {
        content: "Implementamos Clientum en 5 días. El bot de WhatsApp nos generó 40% más de consultas en el primer mes sin contratar nadie. Los reportes automáticos cambiaron la forma en que tomamos decisiones.",
        author: "Martín R.",
        company: "Distribuidora del Sur S.A. — General Roca, Río Negro"
      }
    }
  },
  clientum_completo: {
    label: "🚀 Clientum — Catálogo Completo de Soluciones",
    data: {
      cover: {
        slogan: "Todo lo que tu empresa necesita, en una sola plataforma.",
        sub: "CRM, Chatbot WhatsApp con IA, E-Commerce, ERP, Business Intelligence, Marketing Digital, Ciberseguridad, Cloud, Apps Móviles y Capacitación — el ecosistema completo de Clientum para hacer crecer tu PyME."
      },
      chatbot: {
        title: "Atención inteligente 24/7, en todos tus canales.",
        features: [
          { title: "Respuesta instantánea por WhatsApp", desc: "Atiende consultas frecuentes al instante, a cualquier hora, con el tono de tu marca." },
          { title: "Agendamiento y cotización automática", desc: "El bot agenda citas, genera presupuestos y los envía sin intervención humana." },
          { title: "Calificación de leads con IA", desc: "Clasifica cada consulta según intención de compra y la prioriza automáticamente en el CRM." },
          { title: "Integración multicanal", desc: "Centraliza WhatsApp, Instagram, Facebook y tu sitio web en una sola bandeja de conversaciones." },
          { title: "Seguimiento post-consulta", desc: "Retoma el contacto a las 24 y 48 horas si el cliente no responde. Cero ventas perdidas." },
          { title: "Asistente IA en castellano", desc: "Preguntale al asistente sobre tus ventas, clientes o stock y obtené la respuesta al instante." }
        ],
        flowSteps: [
          "El cliente escribe por WhatsApp, Instagram o tu web y el bot responde al instante",
          "La IA califica, cotiza, agenda o recopila datos automáticamente",
          "El lead llega al CRM con historial completo si necesita un asesor",
          "Tu equipo cierra la venta con todo el contexto ya cargado"
        ]
      },
      crm: {
        title: "Un ecosistema conectado de punta a punta.",
        features: [
          { title: "Pipeline drag & drop", desc: "Visualizá y gestioná cada oportunidad de venta en tiempo real, desde el lead hasta el cierre." },
          { title: "Facturación AFIP integrada", desc: "Emitís facturas A, B y C con CAE directamente desde el CRM, sin cargar datos dos veces." },
          { title: "Contactos y empresas unificados", desc: "Historial completo de interacciones por WhatsApp, email, redes y llamadas en un solo lugar." },
          { title: "Dashboards de Business Intelligence", desc: "KPIs comerciales y operativos en tiempo real, con reportes automáticos por email o WhatsApp." }
        ]
      },
      services: [
        {
          title: "CRM + Chatbot IA + Facturación (Plan Pro)",
          desc: "La base de la plataforma Clientum: chatbot de WhatsApp ilimitado, CRM con pipeline visual, asistente de IA y facturación AFIP integrada, todo en un solo abono.",
          bullets: [
            "Chatbot WhatsApp con conversaciones ilimitadas",
            "CRM con contactos ilimitados y pipeline visual",
            "Facturación AFIP (A, B y C) integrada",
            "Asistente IA incluido para análisis instantáneo"
          ],
          price: 0,
          monthly: 179990,
          time: 7
        },
        {
          title: "Desarrollo Web & E-Commerce",
          desc: "Tiendas online y sitios de alto rendimiento con pasarela de pago, sincronización de stock y diseño UX/UI premium, integrados directamente al CRM.",
          bullets: [
            "Tiendas WooCommerce y Shopify con stock sincronizado",
            "Landing pages y sitios institucionales integrados al CRM",
            "Pasarela de pago MercadoPago nativa",
            "SEO técnico y diseño responsivo incluido"
          ],
          price: 800000,
          monthly: 0,
          time: 15
        },
        {
          title: "Implementación de ERP y Automatización",
          desc: "Conectamos tu ERP, e-commerce y sistemas de stock en tiempo real, automatizando flujos repetitivos y liquidaciones sin intervención manual.",
          bullets: [
            "Sincronización de stock y precios entre canales",
            "Automatización de flujos y aprobaciones internas",
            "Integración API/webhooks con sistemas existentes",
            "Alertas automáticas ante quiebres de stock"
          ],
          price: 400000,
          monthly: 0,
          time: 10
        },
        {
          title: "Business Intelligence & Analítica",
          desc: "Convertimos los datos de tu CRM y ERP en dashboards e informes que guían decisiones, con predicciones y tendencias por sector.",
          bullets: [
            "Dashboards personalizados en tiempo real",
            "KPIs comerciales y operativos en un panel",
            "Predicciones y análisis con IA",
            "Reportes automáticos por email o WhatsApp"
          ],
          price: 600000,
          monthly: 0,
          time: 8
        },
        {
          title: "Marketing Digital & Redes Sociales",
          desc: "Captación automática de leads desde Instagram y Facebook, campañas segmentadas y broadcast masivo integrados a tu pipeline de ventas.",
          bullets: [
            "Captura automática de leads desde FB e IG",
            "Broadcast segmentado por WhatsApp",
            "Integración de DMs y comentarios al CRM",
            "Métricas de apertura, clics y conversión por campaña"
          ],
          price: 250000,
          monthly: 60000,
          time: 7
        },
        {
          title: "Ciberseguridad & Cloud",
          desc: "Auditorías de seguridad, respaldo automatizado en la nube y protección de tus bases de datos frente a filtraciones y ciberataques.",
          bullets: [
            "Auditorías de seguridad y vulnerabilidades",
            "Respaldo en la nube automatizado",
            "Gestión de accesos y permisos por rol",
            "Monitoreo continuo de infraestructura"
          ],
          price: 350000,
          monthly: 45000,
          time: 5
        },
        {
          title: "Aplicaciones Móviles a Medida",
          desc: "Apps nativas y multiplataforma para vendedores, repartidores o clientes finales, conectadas en tiempo real con tu CRM y ERP.",
          bullets: [
            "Apps nativas iOS/Android y multiplataforma",
            "Sincronización en tiempo real con el CRM",
            "Notificaciones push y geolocalización",
            "Panel de administración incluido"
          ],
          price: 700000,
          monthly: 0,
          time: 20
        },
        {
          title: "Capacitación & Soporte Continuo",
          desc: "Formación de tu equipo en el uso de la plataforma y soporte prioritario para asegurar la adopción y el éxito de la implementación.",
          bullets: [
            "Capacitación inicial para todo el equipo",
            "Material y video-tutoriales personalizados",
            "Soporte prioritario en menos de 4 horas",
            "Revisiones periódicas de uso y mejoras"
          ],
          price: 0,
          monthly: 35000,
          time: 3
        }
      ],
      testimonial: {
        content: "Con Clientum unificamos WhatsApp, ventas, facturación y redes en un solo lugar. El equipo dejó de perder tiempo saltando entre sistemas y las decisiones ahora se toman con datos reales, no con intuición.",
        author: "Martín R.",
        company: "Distribuidora del Sur S.A. — Neuquén"
      }
    }
  },
  gaman: {
    label: "🛠️ GAMAN — E-Commerce & ERP (5 Etapas)",
    data: {
      cover: {
        slogan: "Plan de 5 etapas para transformar la operación comercial.",
        sub: "WhatsApp, CRM, redes sociales, e-commerce y ERP de las 4 sucursales de GAMAN — todo conectado, todo automático."
      },
      chatbot: {
        title: "Atención automática 24/7 por WhatsApp.",
        features: [
          { title: "Respuestas automáticas Business API", desc: "Respuestas al instante por WhatsApp Business API sin demoras" },
          { title: "Menú interactivo completo", desc: "Consultas de horarios, sucursales y productos frecuentes" },
          { title: "Derivación inteligente", desc: "Deriva al vendedor adecuado según el tipo de consulta" },
          { title: "Atención sin demoras", desc: "Disponible las 24 horas, los 7 días de la semana" }
        ],
        flowSteps: [
          "El cliente escribe al WhatsApp de GAMAN buscando herramientas o precios",
          "El bot de WhatsApp responde al instante con sucursales, horarios o catálogo",
          "La IA califica si es un cliente minorista o mayorista y registra en el CRM",
          "Deriva con historial completo al vendedor adecuado si requiere atención humana"
        ]
      },
      crm: {
        title: "Seguimiento & CRM Inteligente.",
        features: [
          { title: "Follow-up automático 24/48h", desc: "Recordatorios de seguimiento automático post-consulta" },
          { title: "Clasificación automática", desc: "Clasificación automática entre cliente mayorista y minorista" },
          { title: "Historial de interacciones", desc: "Registro centralizado de clientes e historial de conversaciones" }
        ]
      },
      services: [
        {
          title: "ETAPA 1: Bot de Atención WhatsApp",
          desc: "Atención automática 24/7 por WhatsApp: consultas de horarios, sucursales, precios básicos y derivación inteligente al vendedor adecuado. Sin demoras, sin operador permanente.",
          bullets: [
            "Respuestas automáticas por WhatsApp Business API",
            "Menú interactivo: horarios, sucursales, productos frecuentes",
            "Derivación al vendedor según tipo de consulta",
            "Disponible las 24 horas, los 7 días de la semana"
          ],
          price: 180000,
          monthly: 65000,
          time: 5
        },
        {
          title: "ETAPA 2: Seguimiento & CRM",
          desc: "Seguimiento automático de clientes que consultaron pero no compraron. Clasificación inteligente entre mayoristas y minoristas para personalizar la atención y aumentar la tasa de cierre.",
          bullets: [
            "Follow-up automático a las 24 y 48 horas post-consulta",
            "Clasificación automática: mayorista / minorista",
            "Registro de clientes e historial de interacciones",
            "Alertas al vendedor ante oportunidades de alta prioridad"
          ],
          price: 150000,
          monthly: 55000,
          time: 7
        },
        {
          title: "ETAPA 3: Broadcast & Captación",
          desc: "Envío masivo de promociones segmentadas por WhatsApp y captación automática de leads desde Facebook e Instagram, integrando toda la actividad al pipeline de ventas.",
          bullets: [
            "Envío de promos y novedades segmentadas a la base de clientes",
            "Captura automática de leads desde FB e IG",
            "Integración de DMs y comentarios al flujo de ventas",
            "Métricas de apertura, clicks y conversión por campaña"
          ],
          price: 120000,
          monthly: 45000,
          time: 5
        },
        {
          title: "ETAPA 4: Tienda Online",
          desc: "Desarrollo e implementación de tienda online con catálogo de productos, opciones de pago en cuotas y generación automática de pedidos derivados por WhatsApp al equipo de ventas.",
          bullets: [
            "Tienda WooCommerce con catálogo de productos de GAMAN",
            "Medios de pago: tarjeta, transferencia, cuotas sin interés",
            "Pedidos derivados automáticamente por WhatsApp",
            "Panel de gestión de productos, stock y órdenes"
          ],
          price: 350000,
          monthly: 90000,
          time: 15
        },
        {
          title: "ETAPA 5: Sincronización ERP",
          desc: "Integración en tiempo real entre el sistema ERP de las 4 sucursales, la tienda online y el bot de WhatsApp, garantizando stock y precios siempre actualizados en todos los canales.",
          bullets: [
            "Sincronización de stock en tiempo real entre las 4 sucursales",
            "Actualización automática de precios desde el ERP",
            "Alertas automáticas ante quiebre de stock",
            "Panel unificado de inventario multi-sucursal"
          ],
          price: 280000,
          monthly: 75000,
          time: 20
        }
      ],
      testimonial: {
        content: "Estamos transformando nuestra operación comercial. Con la sincronización en tiempo real de las 4 sucursales, stock y precios están siempre actualizados online y el bot de WhatsApp deriva consultas al vendedor adecuado de forma totalmente automática.",
        author: "Equipo de Ventas y Logística",
        company: "Ferretería GAMAN — 4 Sucursales"
      }
    }
  },
  agro: {
    label: "🚜 Agro & Logística",
    data: {
      cover: {
        slogan: "Optimización rural con tecnología de campo.",
        sub: "Seguimiento de pedidos de granos, bot de WhatsApp para acopios, ruteo logístico inteligente y CRM agropecuario."
      },
      chatbot: {
        title: "Atención de pedidos y cotizaciones rurales 24/7.",
        features: [
          { title: "Cotización de fletes e insumos", desc: "El bot responde tarifas de fletes, disponibilidad de silos y valores de insumos al instante." },
          { title: "Reportes de pesaje automático", desc: "Envía avisos de carga de balanzas directamente al transportista o productor rural." },
          { title: "Pedidos de gasoil y fertilizantes", desc: "Toma reservas de combustible o agroquímicos desde el WhatsApp y los registra en el stock." },
          { title: "Alertas climáticas y geolocalizadas", desc: "Comparte alertas de siembra y cosecha automáticas a los ingenieros agrónomos." }
        ],
        flowSteps: [
          "El productor escribe al WhatsApp solicitando cotización de raciones de alimento",
          "La IA de Clientum consulta la base de stock rural y cotiza en pesos al instante",
          "El chofer confirma la entrega enviando su ubicación de Google Maps",
          "Se genera la hoja de ruta automática en el CRM agropecuario para el tractorista"
        ]
      },
      crm: {
        title: "Trazabilidad completa de tu cadena de acopio.",
        features: [
          { title: "Control de cartas de porte", desc: "Arrastrá y soltá viajes según el estado de la carta de porte ante AFIP." },
          { title: "Productores y contratistas", desc: "Todo el historial de rinde por hectárea, deudas y contratos en un perfil único." },
          { title: "Geolocalización de lotes", desc: "Mapa integrado de campos asociados con sus respectivos agrónomos asignados." }
        ]
      },
      services: [
        {
          title: "Consultoría de Procesos de Campo",
          desc: "Automatizamos pesaje, recepción en acopios y optimización de flotas. 25% ahorro en gasoil promedio.",
          bullets: ["Auditoría de puntos de carga", "Optimización de despachos", "Retorno de inversión rápida", "Soporte satelital offline"]
        },
        {
          title: "ERP Agropecuario Integrado",
          desc: "Facturación de granos y hacienda con liquidaciones AFIP incorporadas. En pesos y pesos-grano.",
          bullets: ["Pesaje de balanza en tiempo real", "Ventas multimedios", "Trazabilidad de fitosanitarios", "Control de silos y tambos"]
        },
        {
          title: "Logística y Ruteo Inteligente",
          desc: "E-Commerce de insumos agropecuarios y tracking en vivo de camiones vinculados al CRM.",
          bullets: ["App para camioneros integrada", "MercadoPago y cuenta corriente", "SEO para repuestos rurales", "Almacenaje inteligente"]
        }
      ],
      testimonial: {
        content: "Logramos coordinar 45 camiones diarios con solo 2 personas usando el bot de WhatsApp de Clientum. El sistema de alertas AFIP nos evitó multas costosas.",
        author: "Gustavo B.",
        company: "Cereales Don Joaquín S.A. — Pergamino"
      }
    }
  },
  inmobiliaria: {
    label: "🏢 Inmobiliarias & Desarrollos",
    data: {
      cover: {
        slogan: "Agendá visitas y calificá leads en piloto automático.",
        sub: "WhatsApp Chatbot para tasaciones y filtros de propiedades, CRM de inmuebles integrado y contratos digitales en pesos."
      },
      chatbot: {
        title: "Tu guardia inmobiliaria, activa todos los días.",
        features: [
          { title: "Filtro de ambientes y precios", desc: "El bot envía catálogos de departamentos que se ajustan al presupuesto del lead." },
          { title: "Agendamiento de visitas", desc: "Sincroniza agendas de los martilleros para visitas presenciales a los departamentos." },
          { title: "Requisitos de alquiler express", desc: "Informa requisitos (garantías propietarias, recibos de sueldo) sin llamadas previas." },
          { title: "Tasaciones preliminares", desc: "Recopila metros cuadrados, zona y estado para cotizar estimaciones de alquiler." }
        ],
        flowSteps: [
          "El lead ve un cartel en un balcón y escribe al QR de WhatsApp de Clientum",
          "El bot le envía fotos, expensas y mapa de ubicación del departamento",
          "La IA le pregunta sus ingresos mensuales para calificarlo según políticas",
          "Agenda día y hora con el corredor de la firma enviándole el recordatorio"
        ]
      },
      crm: {
        title: "Toda tu cartera de propiedades bajo control.",
        features: [
          { title: "Pipeline Inmobiliario", desc: "Etapas desde 'Interesado', 'Visita agendada', 'Seña entregada' hasta 'Contrato firmado'." },
          { title: "Fichas de Inmuebles", desc: "Unifica fotos, planos, contratos históricos y estados de pagos en una sola pantalla." },
          { title: "Seguimiento de expensas", desc: "Envía recordatorios automáticos de cobros mensuales de alquileres y expensas." }
        ]
      },
      services: [
        {
          title: "Sistemas de Gestión de Alquileres",
          desc: "Automatización de contratos, cobros por transferencia e indexaciones del ICL automatizadas.",
          bullets: ["Cálculo automático de aumentos", "Factura de alquiler AFIP express", "Soporte legal integrado", "Panel de propietarios"]
        },
        {
          title: "E-Commerce Inmobiliario",
          desc: "Plataforma web premium con filtros avanzados, mapas interactivos de barrios cerrados y renders 3D.",
          bullets: ["SEO específico de zonas", "Generador automático de fichas PDF", "Botón de seña MercadoPago", "Integración portales nacionales"]
        },
        {
          title: "Marketing para Desarrolladoras",
          desc: "Embudo de captación de inversores de pozo. Segmentación en redes sociales con CRM trackeado.",
          bullets: ["Leads de pozo precalificados", "Folletería digital dinámica", "Envío masivo de avances de obra", "Medición exacta del ROI"]
        }
      ],
      testimonial: {
        content: "Nuestras guardias de fin de semana ahora están 100% automatizadas. El bot califica al interesado, le muestra fotos del departamento y le agenda la cita. Increíble.",
        author: "Gabriela S.",
        company: "Inmobiliaria Pilar Propiedades — Buenos Aires"
      }
    }
  },
  distribuidora: {
    label: "📦 Distribuidoras & Mayoristas",
    data: {
      cover: {
        slogan: "Automatizá tus pedidos mayoristas por WhatsApp.",
        sub: "Toma de pedidos con catálogo integrado en pesos, pipeline de despachos y facturación AFIP automática. Cero errores."
      },
      chatbot: {
        title: "El chatbot que levanta pedidos mientras dormís.",
        features: [
          { title: "Catálogo interactivo en pesos", desc: "Tus clientes mayoristas navegan por categorías y cargan su carrito desde WhatsApp." },
          { title: "Precios por volumen y escala", desc: "El bot aplica descuentos según el nivel de cliente (Bronce, Plata, Oro)." },
          { title: "Consulta de cuenta corriente", desc: "El cliente consulta su saldo pendiente y descarga facturas sin llamar a administración." },
          { title: "Tracking de despacho", desc: "Informa al cliente cuando el camión de reparto sale del depósito con su mercadería." }
        ],
        flowSteps: [
          "Un autoservicio de barrio escribe solicitando reponer stock de bebidas",
          "El bot le muestra sus últimos 3 pedidos para re-ordenar en un solo click",
          "Calcula el descuento por bulto y el envío bonificado automáticamente",
          "Envía el pedido de empaque al depósito y la factura de AFIP al email"
        ]
      },
      crm: {
        title: "Despachos ágiles sin papeles de por medio.",
        features: [
          { title: "Pipeline de Logística", desc: "Mové pedidos desde 'Recibido', 'Preparación', 'En reparto' hasta 'Entregado y cobrado'." },
          { title: "Historial de compras", desc: "Visualizá los productos más pedidos, frecuencias de compra y saldos adeudados." },
          { title: "Hojas de ruta móviles", desc: "Tus repartidores marcan entregas en el mapa desde el celular, actualizando stock." }
        ]
      },
      services: [
        {
          title: "Sincronización de Stock y Depósitos",
          desc: "Consultoría logística de depósitos para conectar stock físico con el bot y la web. Cero quiebres.",
          bullets: ["Control de lotes y vencimientos", "Código de barras integrado", "Trazabilidad de bultos", "KPIs de productividad"]
        },
        {
          title: "E-Commerce B2B Mayorista",
          desc: "Portal exclusivo con login para comercios con listas de precios personalizadas y pagos con e-cheqs.",
          bullets: ["Precios según zona e impuestos", "Integración con MercadoPago y bancos", "Descarga de remitos firmados", "Dashboard de ventas mayoristas"]
        },
        {
          title: "Automatización de Facturación",
          desc: "Emisión masiva de facturas electrónicas AFIP integradas al CRM en lotes de hasta 500 pedidos.",
          bullets: ["Liquidación mensual automática", "Notas de crédito rápidas", "Integración con sistemas contables", "Gestión de percepciones IIBB"]
        }
      ],
      testimonial: {
        content: "Teníamos 3 personas dedicadas a transcribir audios de WhatsApp con pedidos de almacenes. Con Clientum, el 85% de los pedidos entran estructurados directo al depósito.",
        author: "Ricardo M.",
        company: "Distribuidora El Chañar S.R.L. — General Roca"
      }
    }
  },
  gastronomia: {
    label: "🍳 Gastronomía & Restoranes",
    data: {
      cover: {
        slogan: "Revolucioná tu restorán o catering en piloto automático.",
        sub: "Chatbot para reservas de mesas, toma de pedidos automáticos, encuestas de satisfacción y CRM para fidelizar comensales."
      },
      chatbot: {
        title: "Reservas, pedidos y fidelización gastronómica 24/7.",
        features: [
          { title: "Reservas de mesas 24/7", desc: "Evitá llamadas en hora pico. El bot gestiona la capacidad y confirma la mesa al instante." },
          { title: "Toma de pedidos y Delivery", desc: "Los clientes cargan su plato desde WhatsApp y pagan vía link de MercadoPago." },
          { title: "Fidelización de Comensales", desc: "Envia promociones segmentadas según el historial de consumo del cliente." },
          { title: "Encuestas de satisfacción", desc: "Califica la experiencia del cliente al finalizar su visita para mejorar el servicio." }
        ],
        flowSteps: [
          "Un comensal escribe pidiendo mesa para cenar el viernes a las 21hs",
          "El bot consulta el plano del salón en el CRM y le asigna la mesa libre",
          "Le envía la confirmación con un código QR para agilizar la recepción",
          "Si pide delivery, calcula el envío, toma la dirección y cobra por MercadoPago"
        ]
      },
      crm: {
        title: "La ficha de cada cliente en la palma de tu mano.",
        features: [
          { title: "Perfil de Comensales", desc: "Registrá alergias, platos preferidos, cumpleaños y frecuencia de visitas." },
          { title: "Historial de Consumo", desc: "Controlá qué platos se venden más y cuáles tienen mejor margen de ganancia." },
          { title: "Pipeline de Eventos", desc: "Gestioná cotizaciones de catering corporativos y bodas de forma visual." }
        ]
      },
      services: [
        {
          title: "Consultoría de Experiencia del Cliente",
          desc: "Optimización de tiempos de mesa y diseño de menús digitales interactivos. +20% cubiertos diarios.",
          bullets: ["Diagnóstico de rotación de mesas", "Estrategia de fidelización", "Aumento de ticket promedio", "Integración de carta digital"]
        },
        {
          title: "Integración de Sistemas de Cocina (KDS)",
          desc: "Conectamos el bot de WhatsApp directo con las pantallas de cocina para evitar demoras y confusiones.",
          bullets: ["Envío instantáneo a comanderas", "Control de tiempos de cocina", "Notificación automática al mozo", "Cero comandas perdidas"]
        },
        {
          title: "Marketing Gastronómico Local",
          desc: "Campañas de atracción segmentadas por geolocalización vinculadas directamente a tu CRM de Clientum.",
          bullets: ["Captura de leads en Instagram", "E-marketing para cumpleaños", "Estrategias de hora feliz", "Reportes de ROI en tiempo real"]
        }
      ],
      testimonial: {
        content: "El 60% de nuestras reservas de mesas el fin de semana ahora se hacen solas por el bot de WhatsApp. Redujimos un 80% las llamadas perdidas en recepción.",
        author: "Sofía G.",
        company: "Restó Delicias de la Comarca — Bariloche"
      }
    }
  },
  salud: {
    label: "🩺 Clínicas, Salud & Estética",
    data: {
      cover: {
        slogan: "Gestión de turnos médicos y recordatorios automáticos.",
        sub: "El bot agenda citas según la disponibilidad del profesional, envía recordatorios de ausentismo y centraliza el CRM de pacientes."
      },
      chatbot: {
        title: "Tu guardia de turnos médica, activa todos los días.",
        features: [
          { title: "Agendamiento automático de turnos", desc: "El paciente elige el profesional, la especialidad y el horario desde WhatsApp." },
          { title: "Recordatorios preventivos", desc: "Reduce el ausentismo enviando avisos de confirmación 24 horas antes del turno." },
          { title: "Ficha médica digital", desc: "Visualizá historias clínicas, indicaciones y estudios adjuntos en el CRM." },
          { title: "Gestión de obras sociales", desc: "El bot solicita la credencial fotográfica y valida la cobertura al instante." }
        ],
        flowSteps: [
          "Un paciente escribe al WhatsApp buscando turno con el cardiólogo",
          "El bot valida las obras sociales activas y ofrece horarios disponibles",
          "El paciente confirma y el bot agenda la cita en el calendario del médico",
          "Un día antes del turno, el bot le pide confirmar la asistencia por WhatsApp"
        ]
      },
      crm: {
        title: "Atención médica humanizada y organizada.",
        features: [
          { title: "Pipeline de Turnos", desc: "Mové pacientes desde 'Confirmados', 'En sala de espera', 'Atendido' hasta 'Seguimiento'." },
          { title: "Historial de Pacientes", desc: "Consulta rápida de consultas previas, medicación recetada y notas internas." },
          { title: "Recordatorios de Controles", desc: "Generá alertas automáticas para chequeos anuales o tratamientos recurrentes." }
        ]
      },
      services: [
        {
          title: "Consultoría de Procesos de Salud",
          desc: "Reducción de colas en salas de espera y optimización de agendas médicas complejas.",
          bullets: ["Auditoría de tiempos de espera", "Diseño de flujos de admisión", "Capacitación de secretarias", "Reducción de ausentismo"]
        },
        {
          title: "ERP Clínico y Facturación",
          desc: "Conectamos la facturación de obras sociales y cobros particulares con el CRM para un control absoluto.",
          bullets: ["Liquidación a profesionales", "Homologación con obras sociales", "Cobros por MercadoPago", "Factura electrónica AFIP"]
        },
        {
          title: "Portal de Pacientes Seguro",
          desc: "Espacio para que los pacientes descarguen recetas digitales, órdenes médicas autorizadas e indicaciones.",
          bullets: ["Descarga segura de estudios", "Historial de consultas", "Firma digital médica", "Cumple normas de privacidad"]
        }
      ],
      testimonial: {
        content: "Redujimos el ausentismo a los turnos en un 45% usando los recordatorios automáticos de WhatsApp. Los médicos están felices de tener su agenda siempre optimizada.",
        author: "Dr. Alejandro P.",
        company: "Clínica de Especialidades Médicas — Neuquén"
      }
    }
  },
  construccion: {
    label: "🧱 Construcción & Corralones",
    data: {
      cover: {
        slogan: "Automatizá cotizaciones de materiales y acopios.",
        sub: "Chatbot de consulta de stock de materiales, cotizador exprés en pesos y CRM comercial para obras y corralones."
      },
      chatbot: {
        title: "Toma pedidos de materiales pesados las 24 horas.",
        features: [
          { title: "Cotizador de materiales exprés", desc: "El cliente envía su lista de materiales y el bot calcula el presupuesto al instante." },
          { title: "Consulta de stock de corralón", desc: "Integrado con tu sistema físico para indicar disponibilidad de hierro, cemento o arena." },
          { title: "Gestión de acopios segura", desc: "Controlá qué cantidad de mercadería tiene reservada cada cliente y qué ya retiró." },
          { title: "Cuentas corrientes para obras", desc: "El bot ayuda al constructor a consultar sus saldos pendientes y descargar remitos." }
        ],
        flowSteps: [
          "Un arquitecto escribe solicitando presupuesto de 50 bolsas de cemento",
          "El bot consulta la lista de precios en pesos y cotiza el flete según la zona",
          "El cliente acepta y el bot genera un botón de pago con recargo por cuotas",
          "Se emite el remito de acopio en el CRM para que el camión prepare la entrega"
        ]
      },
      crm: {
        title: "Seguimiento de obras grandes sin planillas infinitas.",
        features: [
          { title: "Pipeline de Obras", desc: "Controlá etapas desde 'Presupuesto enviado', 'Aprobado', 'Entregas parciales' hasta 'Finalizado'." },
          { title: "Ficha de Constructores", desc: "Centralizá remitos de retiro, pagos parciales y límites de crédito aprobados." },
          { title: "Coordinación de Logística", desc: "Planificá las cargas de camiones según las obras activas de la semana." }
        ]
      },
      services: [
        {
          title: "Sincronización de Sistemas de Stock",
          desc: "Conectamos tu ERP de corralón con el chatbot de WhatsApp de Clientum en tiempo real para evitar quiebres.",
          bullets: ["Integración de bases de datos", "Actualización automática de precios", "Alertas de stock crítico", "Control de múltiples depósitos"]
        },
        {
          title: "E-Commerce de Construcción B2B",
          desc: "Tienda online exclusiva para constructores y arquitectos con precios por cuenta corriente e IVA discriminado.",
          bullets: ["Precios según perfil del constructor", "Checkout con MercadoPago o CBU", "Descarga de remitos históricos", "Carrito de cotizaciones complejas"]
        },
        {
          title: "Consultoría de Logística de Reparto",
          desc: "Optimización de rutas de camiones volcadores e hidrogrúas para entregas pesadas eficientes.",
          bullets: ["Planificación de hojas de ruta", "Ahorro de fletes y gasoil", "Seguimiento satelital de cargas", "KPIs de choferes"]
        }
      ],
      testimonial: {
        content: "El sistema de acopio de materiales de Clientum nos ordenó la vida. Ahora los clientes retiran con su código de WhatsApp y no hay más errores de inventario.",
        author: "Santiago F.",
        company: "Corralón El Caldén — Santa Rosa, La Pampa"
      }
    }
  },
  profesionales: {
    label: "💼 Estudios Contables & Jurídicos",
    data: {
      cover: {
        slogan: "Estudios contables y jurídicos ágiles y digitales.",
        sub: "Chatbot para subir documentación de impuestos, consultas frecuentes automáticas y CRM para seguimiento de causas y vencimientos."
      },
      chatbot: {
        title: "Tu gestor contable activo las 24 horas.",
        features: [
          { title: "Recepción de documentación", desc: "Los clientes sacan fotos a sus facturas o tickets y el bot los sube a su carpeta del CRM." },
          { title: "Alertas de vencimientos fiscales", desc: "Notificaciones masivas automáticas de vencimientos de AFIP o Ingresos Brutos." },
          { title: "Resolución de consultas frecuentes", desc: "El bot responde preguntas usuales sobre monotributo o liquidaciones 24/7." },
          { title: "Seguimiento de trámites o causas", desc: "El cliente consulta el estado de su trámite ingresando su CUIT o DNI." }
        ],
        flowSteps: [
          "Un cliente escribe para saber cuándo vence su declaración de IVA",
          "El bot consulta su perfil en el CRM y le indica la fecha límite según su CUIT",
          "Le pide adjuntar los archivos de compras que falten directamente por chat",
          "El sistema archiva los documentos y asigna una tarea de revisión al contador"
        ]
      },
      crm: {
        title: "Organización total para tus expedientes o carpetas contables.",
        features: [
          { title: "Pipeline de Servicios", desc: "Mové trámites desde 'Documentación recibida', 'En proceso', 'Presentado AFIP' hasta 'Notificado'." },
          { title: "Gestión de Tiempos (Time-Tracking)", desc: "Controlá las horas dedicadas a cada cliente para cotizar honorarios justos." },
          { title: "Vencimientos y Alertas", desc: "Panel visual de tareas ordenadas por prioridad de vencimiento legal o impositivo." }
        ]
      },
      services: [
        {
          title: "Consultoría de Digitalización de Estudios",
          desc: "Migración de carpetas físicas a la nube y automatización de flujos de trabajo internos con inteligencia artificial.",
          bullets: ["Estrategia cero papel", "Seguridad de datos cifrados", "Capacitación a profesionales", "Vencimientos automatizados"]
        },
        {
          title: "Integración de Sistemas de Gestión",
          desc: "Ecosistema seguro para firmar contratos, enviar declaraciones juradas e integrarse con plataformas de AFIP.",
          bullets: ["Firma digital homologada", "Almacenamiento de recibos de sueldo", "Notificaciones de deudas fiscales", "Seguimiento de juicios"]
        },
        {
          title: "Portal de Clientes del Estudio",
          desc: "Acceso privado para descargar liquidaciones de sueldos, DDJJ e informes mensuales con marca blanca.",
          bullets: ["Autoservicio de descargas", "Seguimiento de honorarios", "Chat directo con el profesional", "Descarga de formularios AFIP"]
        }
      ],
      testimonial: {
        content: "Nuestros clientes ya no nos mandan facturas desordenadas por mail. Le sacan foto por WhatsApp y el bot de Clientum las organiza solas en su carpeta fiscal.",
        author: "Dra. Laura M.",
        company: "Estudio Contable Asociados — General Roca"
      }
    }
  },
  educacion: {
    label: "🏫 Academias & Colegios",
    data: {
      cover: {
        slogan: "Inscripciones y comunicación escolar simplificada.",
        sub: "Chatbot para admisiones, recordatorios automáticos de cuotas, envío de circulares y CRM de seguimiento de alumnos."
      },
      chatbot: {
        title: "Inscripciones escolares fluidas sin colas.",
        features: [
          { title: "Admisiones y vacantes 24/7", desc: "El bot responde sobre aranceles, requisitos, vacantes y coordina visitas guiadas." },
          { title: "Recordatorio de cuotas mensual", desc: "Envia de forma automática los avisos de vencimientos con el botón de MercadoPago." },
          { title: "Envío masivo de circulares", desc: "Comunica suspensiones, reuniones o eventos de forma directa al WhatsApp de los padres." },
          { title: "Seguimiento de alumnos y legajos", desc: "Centralizá las notas, asistencias e informes de comportamiento en la ficha del CRM." }
        ],
        flowSteps: [
          "Una madre escribe consultando por vacantes para sala de 4 años",
          "El bot le indica la disponibilidad actual, aranceles y requisitos de ingreso",
          "Agenda una entrevista presencial con la dirección del colegio por WhatsApp",
          "Registra la interesada en el CRM con todos los datos de contacto listos para la ficha"
        ]
      },
      crm: {
        title: "Gestión escolar integrada y sin papeles.",
        features: [
          { title: "Pipeline de Admisiones", desc: "Controlá el embudo desde 'Interesado', 'Entrevista agendada', 'Ficha entregada' hasta 'Inscripto'." },
          { title: "Legajo Digital Único", desc: "Unifica datos de salud, autorizaciones, notas y pagos de cada alumno en un solo lugar." },
          { title: "Control de Morosidad", desc: "Panel de control de saldos mensuales para coordinar gestiones de cobro amigables." }
        ]
      },
      services: [
        {
          title: "Consultoría en Comunicación Educativa",
          desc: "Capacitación a secretarios y directivos sobre el uso de plantillas de WhatsApp homologadas para colegios.",
          bullets: ["Diseño de circulares claras", "Reducción de ruidos de comunicación", "Políticas de privacidad escolar", "Configuración de canales de difusión"]
        },
        {
          title: "Pasarela de Pagos Colegiales",
          desc: "Sincronización de cuotas mensuales con débito automático por CBU, tarjetas de crédito y MercadoPago.",
          bullets: ["Débito directo bancario", "Botón de pago MercadoPago por chat", "Facturación masiva automática", "Gestión de becas y descuentos"]
        },
        {
          title: "Portal de Familias y Boletín Digital",
          desc: "Plataforma web para que los padres firmen autorizaciones, justifiquen inasistencias y vean el boletín de calificaciones.",
          bullets: ["Firma digital de circulares", "Visualización de calificaciones", "Control de inasistencias", "Mensajería directa con docentes"]
        }
      ],
      testimonial: {
        content: "La comunicación institucional dio un giro de 180 grados. Ahora las familias leen las circulares al instante en WhatsApp en vez de perder el cuaderno de comunicaciones.",
        author: "Prof. Daniel V.",
        company: "Instituto Educativo Lincoln — Cipolletti"
      }
    }
  }
};

export const INITIAL_DEALS: CRMDeal[] = [];

export const AI_PRESETS_CHATS: { [key: string]: AIChatMessage } = {
  ventas: {
    id: "v1",
    role: "model",
    content: "Aquí tienes el análisis de ventas acumuladas del trimestre actual para las PyMEs activas. Observamos un crecimiento sostenido del 35% en cierres comerciales desde la implementación de flujos automatizados de WhatsApp.",
    timestamp: "2026-08-01T10:00:00Z"
  },
  consultas: {
    id: "c1",
    role: "model",
    content: "Este es el desglose por categorías de las consultas de WhatsApp que el bot resolvió de manera automática durante las últimas 24 horas. Se destaca un 48% de consultas de stock/precios resueltas sin intervención humana.",
    timestamp: "2026-08-01T10:00:00Z"
  },
  eficiencia: {
    id: "e1",
    role: "model",
    content: "Análisis del tiempo de respuesta promedio de los asesores antes vs. después de integrar el bot calificador en WhatsApp. El bot absorbe el contacto inicial reduciendo la espera de los clientes calificados en un 90%.",
    timestamp: "2026-08-01T10:00:00Z"
  }
};
