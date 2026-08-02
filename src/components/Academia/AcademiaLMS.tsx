import React, { useState, useEffect, useRef } from "react";
import {
  GraduationCap, PlayCircle, Award, CheckCircle2, Lock,
  Clock, Users, ChevronRight, X, ExternalLink, Download,
  BookOpen, Loader2, AlertCircle, Star, Sparkles, MoveRight,
  TrendingUp, Mail, MapPin, Search, FileText, Check, Palette,
  ArrowRight, ShieldCheck, RefreshCw, Send, AlertTriangle
} from "lucide-react";

// ── Tipos ────────────────────────────────────────────────────────────────────

interface Enrollment {
  course_slug: string;
  course_name: string;
  enrolled_at: string;
  progress_pct: number | null;
  completed: boolean | null;
  last_accessed: string | null;
  completed_at: string | null;
  certificate_id: string | null;
}

interface Certificate {
  id: string;
  user_name: string;
  course_slug: string;
  course_name: string;
  issued_at: string;
}

// ── Cursos Disponibles ────────────────────────────────────────────────────────

const COURSES = [
  {
    slug: "crm-moderno-automatizacion",
    name: "CRM Clientum: Ventas, Kanban y Pipeline Inteligente",
    tagline: "4 semanas · Interactivo · Certificado Oficial Clientum + ISSAG",
    desc: "Dominá el ciclo de vida del cliente. Aprendé a configurar tu embudo de ventas Kanban, orquestar contactos con Inteligencia Artificial, y calificar oportunidades automáticamente para multiplicar tus ventas.",
    duration: "4 semanas",
    hours: "12 hs totales",
    students: "Inscripción Libre",
    level: "Básico a Intermedio",
    badge: "Más Popular",
    color: "from-blue-600 to-indigo-700",
    icon: TrendingUp,
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    topics: [
      "Configuración y diseño de columnas en el Embudo Kanban comercial",
      "Orquestación inteligente de contactos y lead scoring automático",
      "Automatización de notas, recordatorios y alertas con IA",
      "Mapeo de rentabilidad y lectura de dashboards de conversión"
    ],
    slides: [
      {
        title: "Estructura del Embudo Kanban",
        concept: "El pilar de un CRM moderno es la visibilidad. Un tablero Kanban mapea el recorrido del cliente desde el primer contacto hasta el cierre. Cada columna representa un hito claro con acciones definidas.",
        bullets: [
          "Mantener las tarjetas actualizadas reduce la fricción del equipo en un 40%.",
          "Mover un lead debe requerir un criterio objetivo de cumplimiento.",
          "Cada tarjeta de cliente centraliza chats, mails, notas y tareas pendientes."
        ]
      },
      {
        title: "Calificación con Inteligencia Artificial",
        concept: "Calificar prospectos te ahorra cientos de horas. Utilizando la metodología MEDDIC o BANT enriquecida con IA, podés identificar inmediatamente cuáles leads tienen presupuesto y urgencia real.",
        bullets: [
          "El Orquestador analiza conversaciones para evaluar la intención de compra.",
          "Un lead bien calificado incrementa la velocidad de cierre de ventas.",
          "Los leads fríos deben nutrirse automáticamente en columnas secundarias."
        ]
      },
      {
        title: "Seguimiento Automático y Notas de Voz",
        concept: "El 80% de las ventas requieren más de 5 seguimientos. Clientum automatiza las alertas internas y genera resúmenes automáticos de cada llamada o nota para que tu equipo se enfoque puramente en cerrar.",
        bullets: [
          "Asignar tareas automáticas al cambiar de columna evita que el lead se enfríe.",
          "La IA transcribe y extrae compromisos clave de las reuniones con clientes.",
          "Acciones automáticas gatillan plantillas optimizadas para acelerar la venta."
        ]
      }
    ],
    quiz: [
      {
        q: "¿Cuál es la principal ventaja de estructurar un CRM con columnas Kanban?",
        options: [
          "Tener un diseño colorido sin funcionalidad real.",
          "Obtener visibilidad completa del recorrido de venta y detectar cuellos de botella instantáneamente.",
          "Reemplazar completamente al equipo de vendedores por robots."
        ],
        correct: 1
      },
      {
        q: "¿Para qué sirve el Scoring de Leads automatizado por IA?",
        options: [
          "Para calificar prospectos según su urgencia, presupuesto e interés real, optimizando el tiempo del equipo comercial.",
          "Para enviar correos masivos de spam a todos los contactos sin distinción.",
          "Para ordenar los clientes alfabéticamente de manera aleatoria."
        ],
        correct: 0
      }
    ]
  },
  {
    slug: "ia-outreach-email-marketing",
    name: "Outbound & Email Marketing Automatizado con IA",
    tagline: "3 semanas · Especializado · 100% Práctico",
    desc: "Aprendé a estructurar secuencias de prospección en frío (Outreach) y campañas de email masivas. Diseñá copys persuasivos usando IA e integrá variables dinámicas del CRM para lograr tasas de apertura superiores al 45%.",
    duration: "3 semanas",
    hours: "10 hs totales",
    students: "Cupos Limitados",
    level: "Intermedio",
    badge: "Nuevo",
    color: "from-violet-600 to-fuchsia-700",
    icon: Mail,
    img: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=800&q=80",
    topics: [
      "Configuración avanzada de SMTP y optimización de entregabilidad",
      "Estructuras persuasivas (AIDA, PAS) de copywriting aplicadas con IA",
      "Campos dinámicos de personalización desde la base de datos",
      "Flujos y secuencias con reglas automáticas según comportamiento"
    ],
    slides: [
      {
        title: "Entregabilidad y Servidores SMTP",
        concept: "Si tu correo llega a spam, tu campaña no existe. La entregabilidad depende de una configuración limpia de tu servidor SMTP, firmas SPF/DKIM válidas y de evitar palabras prohibidas por los filtros de spam.",
        bullets: [
          "El calentamiento gradual del buzón asegura una buena reputación de envío.",
          "Utilizar un remitente corporativo real aumenta la tasa de apertura en un 35%.",
          "Evitar usar mayúsculas y signos de exclamación excesivos en el asunto."
        ]
      },
      {
        title: "Persuasión y Fusión de Variables",
        concept: "Nadie responde a un email genérico. Con la IA de Clientum, podés redactar textos utilizando merge-tags del CRM como nombre, industria o desafío para simular un mensaje redactado 1 a 1 de forma manual.",
        bullets: [
          "Un asunto personalizado tiene un 50% más de probabilidad de ser abierto.",
          "La primera línea del email debe aludir a algo específico del destinatario.",
          "Ofrecer siempre valor inmediato (un reporte, un tip, una propuesta clara)."
        ]
      },
      {
        title: "Secuencias Outbound de Seguimiento",
        concept: "La constancia gana. Una secuencia inteligente envía recordatorios automáticos espaciados (día 1, día 4, día 8) y se detiene inmediatamente cuando el prospecto responde, garantizando un trato sumamente profesional.",
        bullets: [
          "Los seguimientos breves tipo 'bache' suelen tener la mayor tasa de respuesta.",
          "Definir llamadas a la acción (CTA) ultra-simples como '¿te queda cómodo un café virtual?'.",
          "Analizar métricas de clics para iterar continuamente la propuesta."
        ]
      }
    ],
    quiz: [
      {
        q: "¿Qué factor determina que tus campañas de email marketing no caigan en la carpeta de Spam?",
        options: [
          "El color de los botones dentro de la plantilla del correo.",
          "La correcta configuración técnica del servidor SMTP y evitar bases de datos compradas o sucias.",
          "Enviar miles de correos simultáneamente desde una cuenta nueva."
        ],
        correct: 1
      },
      {
        q: "¿Cuál es el principal beneficio de pausar automáticamente una secuencia de Outreach?",
        options: [
          "Evita seguir molestando a un cliente que ya contestó, permitiendo que un humano tome el control de la conversación de forma natural.",
          "Ahorrar espacio en el servidor de correos electrónicos.",
          "Hacer que el cliente piense que la empresa se olvidó de él."
        ],
        correct: 0
      }
    ]
  },
  {
    slug: "seo-local-prospeccion-geolocalizada",
    name: "SEO Local & Prospección Inteligente con Mapas",
    tagline: "3 semanas · Estratégico · Automatizado",
    desc: "Descubrí clientes ideales a tu alrededor. Aprendé a extraer prospectos geolocalizados directo de Google Maps, analizar su salud web con un Auditor SEO On-Page automático y armar propuestas comerciales imposibles de rechazar.",
    duration: "3 semanas",
    hours: "8 hs totales",
    students: "Abierto",
    level: "Todos los niveles",
    badge: "Práctico",
    color: "from-emerald-600 to-teal-700",
    icon: MapPin,
    img: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80",
    topics: [
      "Extracción geolocalizada de comercios y pymes locales",
      "Diagnósticos de velocidad, etiquetas y meta description con un click",
      "Uso de mapas interactivos de calor para identificar zonas calientes",
      "Estructuración de ofertas de optimización de perfiles en Google Maps"
    ],
    slides: [
      {
        title: "Extracción Local en Google Maps",
        concept: "Las pymes locales de tu ciudad suelen tener necesidades críticas de marketing. Scrapear Google Maps por rubro (ej. 'Odontólogos en Cipolletti') te da una lista de prospectos con teléfono, dirección y web listos para calificar.",
        bullets: [
          "Filtrar comercios sin sitio web para ofrecerles su primera página.",
          "La cercanía física genera confianza inmediata y facilita reuniones presenciales.",
          "Descubrir negocios sin ficha de Google Business Profile reclamada."
        ]
      },
      {
        title: "Auditoría SEO On-Page en 5 Segundos",
        concept: "Antes de llamar a un prospecto, debés conocer sus fallas. Un análisis automatizado te revela si su web es lenta, si no tiene SSL seguro o si carece de etiquetas meta-título correctas para posicionarse.",
        bullets: [
          "Señalar problemas técnicos reales incrementa la tasa de conversión de la llamada.",
          "El SEO On-Page básico es fácil de solucionar y tiene un gran impacto inmediato.",
          "Traducir términos complejos (ej. 'etiqueta H1') en beneficios de negocio para el cliente."
        ]
      },
      {
        title: "Propuesta de Valor Irresistible",
        concept: "No ofrezcas 'SEO'. Ofrecé 'Más clientes llamando desde el celular'. Al presentar un mapa interactivo con sus competidores posicionados arriba, el prospecto entiende inmediatamente el costo de oportunidad perdido.",
        bullets: [
          "Mostrar imágenes comparativas claras del antes y después.",
          "Ofrecer una auditoría gratuita rápida en el primer contacto.",
          "Estructurar un abono mensual de optimización fácil de presupuestar."
        ]
      }
    ],
    quiz: [
      {
        q: "¿Cuál es la forma más efectiva de captar la atención de un negocio local para venderle servicios de marketing?",
        options: [
          "Llamar y hablar con términos técnicos complejos para sonar inteligente.",
          "Mostrarle un diagnóstico claro con las fallas SEO de su web actual frente a sus competidores locales directos.",
          "Ofrecerle posicionarlo en el puesto número 1 de Google en 24 horas de manera garantizada."
        ],
        correct: 1
      },
      {
        q: "¿Qué indica que un comercio local no ha reclamado su perfil de Google Business Profile?",
        options: [
          "Que Google cerrará su negocio pronto.",
          "Que el perfil aparece en los mapas pero carece de verificación oficial, dejando al negocio vulnerable a cambios no autorizados y con peor visibilidad.",
          "Que el negocio no tiene habilitación municipal."
        ],
        correct: 1
      }
    ]
  },
  {
    slug: "diseno-brochures-materiales-ia",
    name: "Creación de Brochures y Material de Ventas con IA",
    tagline: "2 semanas · Express · Gran Salida Laboral",
    desc: "Dejá de enviar presupuestos aburridos en texto plano. Aprendé a generar folletos corporativos, brochures de servicios y propuestas PDF interactivas de alto impacto visual adaptadas a la identidad de tu cliente.",
    duration: "2 semanas",
    hours: "6 hs totales",
    students: "Inscripción Libre",
    level: "Básico",
    badge: "Express",
    color: "from-amber-600 to-orange-700",
    icon: FileText,
    img: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&w=800&q=80",
    topics: [
      "Estructura comercial persuasiva de un dossier de servicios",
      "Redacción automática de propuestas a la medida de cada industria",
      "Definición y aplicación ágil de marcas y paletas cromáticas",
      "Exportación limpia a formato PDF profesional desde la nube"
    ],
    slides: [
      {
        title: "La Anatomía de un Brochure Ganador",
        concept: "Un buen brochure no habla de lo increíble que es tu empresa; habla de los problemas que le solucionás al cliente. Debe contar con una portada potente, desglose de soluciones, casos de éxito y un llamado a la acción claro.",
        bullets: [
          "La portada debe incluir un título centrado en el beneficio principal del cliente.",
          "Limitar el texto a párrafos cortos de lectura rápida y ágil.",
          "Incluir siempre testimonios o validaciones reales para bajar el riesgo percibido."
        ]
      },
      {
        title: "Armonía Visual y Psicología del Color",
        concept: "El color comunica antes que las palabras. Las marcas de salud usan tonos verdes o celestes para denotar calma; las de tecnología usan azules profundos para confianza; y las de retail usan naranjas o rojos para urgencia.",
        bullets: [
          "Mantener consistencia tipográfica: máximo 2 familias de fuentes.",
          "El espacio en blanco es tan importante como el texto; dale aire al diseño.",
          "Utilizar iconos modernos e imágenes de alta calidad contextualizadas."
        ]
      },
      {
        title: "Exportación Directa y Ventas Rápidas",
        concept: "La agilidad cierra ventas. Crear un catálogo interactivo que se adapte con un solo click a las variables del CRM te permite enviar una propuesta formal personalizada en 2 minutos luego de colgar una llamada.",
        bullets: [
          "Un cliente que recibe una propuesta veloz siente que la empresa es sumamente eficiente.",
          "Ofrecer alternativas de precios (ej. plan básico, recomendado y premium).",
          "Asegurarse de que el archivo PDF esté optimizado para verse perfectamente en celulares."
        ]
      }
    ],
    quiz: [
      {
        q: "¿Cuál debe ser el enfoque principal del texto en un Brochure comercial de servicios?",
        options: [
          "Contar detalladamente la historia de la fundación de la empresa y todos sus hitos internos.",
          "Destacar las soluciones a los dolores específicos del cliente y los beneficios de contratar el servicio.",
          "Escribir textos largos de más de mil palabras en la primera página."
        ],
        correct: 1
      },
      {
        q: "¿Por qué es importante la velocidad en el envío de un brochure adaptado después de una llamada?",
        options: [
          "Para demostrar un nivel de profesionalismo, agilidad y compromiso que te diferencie instantáneamente de la competencia.",
          "Para que el cliente no tenga tiempo de pensar en otras opciones.",
          "Porque el enlace de descarga del PDF expira en pocas horas."
        ],
        correct: 0
      }
    ]
  }
];

// ── Helpers ──────────────────────────────────────────────────────────────────

async function apiFetch(url: string, opts?: RequestInit) {
  const res = await fetch(url, { credentials: "include", ...opts });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
  return data;
}

// ── Componente Principal ──────────────────────────────────────────────────────

interface Props {
  authUser: string | null;
  onNeedLogin: () => void;
}

export default function AcademiaLMS({ authUser, onNeedLogin }: Props) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [certModal, setCertModal] = useState<Certificate | null>(null);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado del curso seleccionado
  const [selectedCourse, setSelectedCourse] = useState(COURSES[0]);

  // Estados del Player Interactivo
  const [playerSlide, setPlayerSlide] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScoreError, setQuizScoreError] = useState(false);

  // Estados específicos para las Prácticas del Sandbox en el Player
  // Sandbox CRM
  const [kanbanLeads, setKanbanLeads] = useState([
    { id: 1, name: "Gimnasio Roca Fit", stage: "nuevo", details: "Interesado en captar más socios.", scoring: "Pendiente" },
    { id: 2, name: "Estudio Pérez & Asoc", stage: "nuevo", details: "Buscan automatizar avisos a clientes.", scoring: "Pendiente" },
    { id: 3, name: "Frutería Alto Valle", stage: "nuevo", details: "Requiere seguimiento de presupuestos.", scoring: "Pendiente" }
  ]);
  // Sandbox Email
  const [emailIndustry, setEmailIndustry] = useState("Inmobiliaria");
  const [emailTone, setEmailTone] = useState("Persuasivo");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [generatingEmail, setGeneratingEmail] = useState(false);
  // Sandbox SEO Maps
  const [seoKeyword, setSeoKeyword] = useState("Clínicas");
  const [seoCity, setSeoCity] = useState("General Roca");
  const [seoResults, setSeoResults] = useState<any[]>([]);
  const [scanningSeo, setScanningSeo] = useState(false);
  // Sandbox Brochure
  const [brochurePalette, setBrochurePalette] = useState("navy");
  const [brochureContent, setBrochureContent] = useState("Standard");

  const enrollment = enrollments.find(e => e.course_slug === selectedCourse.slug) ?? null;
  const progress = enrollment?.progress_pct ?? 0;
  const completed = enrollment?.completed ?? false;
  const certId = enrollment?.certificate_id ?? null;

  // Cargar inscripciones del usuario al iniciar o cambiar usuario
  useEffect(() => {
    if (!authUser) {
      setEnrollments([]);
      return;
    }
    setLoading(true);
    apiFetch("/api/lms/my")
      .then(d => setEnrollments(d.enrollments ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [authUser]);

  const handleEnroll = async () => {
    if (!authUser) {
      onNeedLogin();
      return;
    }
    setEnrolling(true);
    setError(null);
    try {
      await apiFetch("/api/lms/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_slug: selectedCourse.slug, course_name: selectedCourse.name }),
      });
      const d = await apiFetch("/api/lms/my");
      setEnrollments(d.enrollments ?? []);
    } catch (e: any) {
      setError(e.message ?? "Error al inscribirse");
    } finally {
      setEnrolling(false);
    }
  };

  const updateProgress = async (newProgress: number) => {
    if (!authUser || completed) return;
    try {
      await apiFetch("/api/lms/progress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_slug: selectedCourse.slug, progress_pct: newProgress }),
      });
      setEnrollments(prev => prev.map(e =>
        e.course_slug === selectedCourse.slug ? { ...e, progress_pct: newProgress } : e
      ));
    } catch {}
  };

  const handleComplete = async () => {
    setCompleting(true);
    setError(null);
    try {
      const d = await apiFetch("/api/lms/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_slug: selectedCourse.slug }),
      });
      const fresh = await apiFetch("/api/lms/my");
      setEnrollments(fresh.enrollments ?? []);
      // Cargar y mostrar certificado
      const cert = await apiFetch(`/api/lms/certificate/${d.certificate_id}`);
      setCertModal(cert.certificate);
    } catch (e: any) {
      setError(e.message ?? "Error al completar el curso");
    } finally {
      setCompleting(false);
    }
  };

  const handleShowCert = async () => {
    if (!certId) return;
    try {
      const d = await apiFetch(`/api/lms/certificate/${certId}`);
      setCertModal(d.certificate);
    } catch {}
  };

  const handleSlideNext = () => {
    if (playerSlide < selectedCourse.slides.length - 1) {
      const nextSlide = playerSlide + 1;
      setPlayerSlide(nextSlide);
      // Calcular y guardar progreso incremental
      const totalSteps = selectedCourse.slides.length + 1; // slides + quiz
      const pct = Math.round((nextSlide / totalSteps) * 100);
      updateProgress(pct);
    } else {
      // Ir a la sección del Quiz final
      setPlayerSlide(selectedCourse.slides.length);
      const pct = Math.round((selectedCourse.slides.length / (selectedCourse.slides.length + 1)) * 100);
      updateProgress(pct);
    }
  };

  const handleSlidePrev = () => {
    if (playerSlide > 0) {
      setPlayerSlide(playerSlide - 1);
    }
  };

  const handleOptionSelect = (qIdx: number, optIdx: number) => {
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleQuizSubmit = () => {
    let allCorrect = true;
    selectedCourse.quiz.forEach((qObj, idx) => {
      if (quizAnswers[idx] !== qObj.correct) {
        allCorrect = false;
      }
    });

    if (allCorrect) {
      setQuizSubmitted(true);
      setQuizScoreError(false);
      updateProgress(100);
    } else {
      setQuizScoreError(true);
    }
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScoreError(false);
  };

  const openCoursePlayer = () => {
    setPlayerSlide(0);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScoreError(false);
    setPlayerOpen(true);
    updateProgress(10); // Inicializar en 10% al abrir
  };

  // ── Funciones de los Sandboxes Interactivos en el Player ──────────────────

  const runCrmLeadQualification = (id: number) => {
    setKanbanLeads(prev => prev.map(lead => {
      if (lead.id === id) {
        return {
          ...lead,
          stage: "calificado",
          scoring: "Alta Prioridad (94%)",
          details: lead.details + " [MEDDIC: Presupuesto validado, canal directo con decisor comercial]"
        };
      }
      return lead;
    }));
  };

  const moveCrmLeadToProposal = (id: number) => {
    setKanbanLeads(prev => prev.map(lead => {
      if (lead.id === id) {
        return {
          ...lead,
          stage: "propuesta",
          details: lead.details + " [Propuesta automatizada de Clientum enviada]"
        };
      }
      return lead;
    }));
  };

  const generateSandboxEmail = () => {
    setGeneratingEmail(true);
    setTimeout(() => {
      const isPersuasive = emailTone === "Persuasivo";
      const body = isPersuasive 
        ? `Asunto: Alianza Estratégica & Automatización para {{empresa}} en Cipolletti 🚀\n\nHola {{nombre}},\n\nVi tu negocio de rubro ${emailIndustry} y noté que procesan un volumen alto de consultas diarias.\n\nEn Clientum ayudamos a empresas del Alto Valle a implementar tableros Kanban y orquestadores con IA que clasifican leads calientes en tiempo real.\n\n¿Te queda cómodo un café virtual de 10 minutos este jueves para ver cómo podemos subir tu tasa de conversión en un 30%?\n\nSaludos cordiales,\nEl equipo de Clientum`
        : `Asunto: Diagnóstico Comercial para tu negocio ${emailIndustry} 📊\n\nEstimado/a {{nombre}},\n\nMe pongo en contacto para acercarte un análisis simplificado de tus canales de contacto actuales.\n\nCon Clientum CRM podés unificar todo el historial de interacciones de tus clientes en un tablero central, logrando reducir el tiempo de respuesta promedio a menos de 5 minutos.\n\nQuedo a su disposición para coordinar una breve llamada de demostración.\n\nAtentamente,\nSoporte Clientum`;
      
      setGeneratedEmail(body);
      setGeneratingEmail(false);
    }, 1200);
  };

  const scanSeoMap = () => {
    setScanningSeo(true);
    setSeoResults([]);
    setTimeout(() => {
      setSeoResults([
        { name: `${seoKeyword} San Bernardo`, address: "Tucumán 1420", site: "sanbernardoroca.com", ssl: true, speed: "Lento (4.2s)", score: "62/100", flaws: ["Falta meta título descriptivo", "Imágenes pesadas"] },
        { name: `${seoKeyword} del Sol`, address: "Av. Roca 420", site: "Ninguno", ssl: false, speed: "N/A", score: "0/100", flaws: ["No tiene sitio web", "Ficha de Google sin verificar"] },
        { name: `${seoKeyword} Patagonia`, address: "San Martín 840", site: "clinicapatagonia.com.ar", ssl: true, speed: "Rápido (1.5s)", score: "88/100", flaws: ["Falta etiqueta alt en imágenes"] }
      ]);
      setScanningSeo(false);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-12 select-none" id="lms-root">

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-indigo-600 bg-indigo-50 border border-indigo-100 font-mono text-[10px] uppercase tracking-widest font-black px-3.5 py-1.5 rounded-full shadow-2xs">
          Clientum Academia LMS
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-black text-slate-900 tracking-tight mt-4 leading-tight">
          Formación Interactiva en <span className="text-indigo-600">CRM & AI Marketing</span>
        </h1>
        <p className="text-slate-500 text-sm mt-3 leading-relaxed max-w-2xl mx-auto">
          Cursos prácticos diseñados para pymes y profesionales del Alto Valle. Aprendé a operar herramientas de automatización comercial, marketing outbound y prospección inteligente con simuladores en tiempo real.
        </p>
      </div>

      {/* ── Selector de Cursos (Tabs) ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {COURSES.map((course) => {
          const isSelected = selectedCourse.slug === course.slug;
          const CourseIcon = course.icon;
          const cEnroll = enrollments.find(e => e.course_slug === course.slug);
          return (
            <button
              key={course.slug}
              onClick={() => {
                setSelectedCourse(course);
                setPlayerSlide(0);
                setQuizAnswers({});
                setQuizSubmitted(false);
                setQuizScoreError(false);
              }}
              className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-3 group relative overflow-hidden ${
                isSelected
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/15"
                  : "bg-white border-slate-200 hover:border-slate-300 text-slate-800 hover:bg-slate-50"
              }`}
            >
              <div className="flex justify-between items-start w-full">
                <div className={`p-2.5 rounded-xl ${isSelected ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-600"}`}>
                  <CourseIcon className="w-5 h-5" />
                </div>
                {cEnroll?.completed ? (
                  <span className={`text-[9px] font-bold font-mono uppercase px-2 py-0.5 rounded-full ${isSelected ? "bg-emerald-500 text-white" : "bg-emerald-100 text-emerald-800"}`}>
                    Certificado
                  </span>
                ) : cEnroll ? (
                  <span className={`text-[9px] font-bold font-mono uppercase px-2 py-0.5 rounded-full ${isSelected ? "bg-white/30 text-white" : "bg-amber-100 text-amber-800"}`}>
                    {cEnroll.progress_pct}%
                  </span>
                ) : (
                  <span className={`text-[9px] font-bold font-mono uppercase px-2 py-0.5 rounded-full ${isSelected ? "bg-white/10 text-white/80" : "bg-slate-100 text-slate-500"}`}>
                    {course.badge}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm line-clamp-1 tracking-tight leading-snug">{course.name}</h3>
                <p className={`text-[11px] mt-1 line-clamp-2 ${isSelected ? "text-indigo-100" : "text-slate-400"}`}>
                  {course.tagline}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Ficha del Curso Seleccionado ─────────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-200 shadow-xl bg-white overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Banner Izquierdo / Info */}
        <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col gap-6 justify-between border-b lg:border-b-0 lg:border-r border-slate-100">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] font-bold font-mono uppercase px-3 py-1 rounded-full tracking-wider bg-gradient-to-r ${selectedCourse.color} text-white`}>
                CURSO DE LA ACADEMIA
              </span>
              <span className="text-slate-400 text-xs font-mono">· {selectedCourse.level}</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-snug">
              {selectedCourse.name}
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              {selectedCourse.desc}
            </p>

            {/* Estadísticas */}
            <div className="flex flex-wrap gap-4 pt-2">
              {[
                { icon: Clock, label: selectedCourse.duration, title: "Duración" },
                { icon: BookOpen, label: selectedCourse.hours, title: "Horas" },
                { icon: Users, label: selectedCourse.students, title: "Modalidad" },
                { icon: Star, label: selectedCourse.level, title: "Nivel" },
              ].map(({ icon: Icon, label, title }) => (
                <div key={label} className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl text-xs text-slate-600 font-medium">
                  <Icon className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block leading-none">{title}</span>
                    <span className="text-[11px] font-bold text-slate-800 block mt-0.5">{label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Temario Clave */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 font-mono mb-3">Habilidades que vas a adquirir</h4>
              <div className="grid sm:grid-cols-2 gap-3">
                {selectedCourse.topics.map((t, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <div className="bg-indigo-50 border border-indigo-100 p-0.5 rounded-md mt-0.5 text-indigo-600 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Progreso del curso si está inscripto */}
          {enrollment && (
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-2 mt-4">
              <div className="flex justify-between items-center text-[10px] font-black font-mono text-slate-500 uppercase">
                <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-indigo-600" /> Tu Progreso</span>
                <span>{progress}% Completado</span>
              </div>
              <div className="h-2.5 bg-slate-200/70 rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {completed ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-1 pt-1 border-t border-slate-200/50">
                  <p className="text-[11px] text-emerald-600 font-bold font-mono flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> ¡Curso completado satisfactoriamente!
                  </p>
                  <button
                    onClick={handleShowCert}
                    className="text-[11px] bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 border-0 cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5" /> Ver Diploma Verificable
                  </button>
                </div>
              ) : (
                <p className="text-[10px] text-slate-400 mt-1">
                  Completá las diapositivas de clase y aprobá el cuestionario final para descargar tu certificado oficial.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Panel de Control de Inscripción / CTA Derecho */}
        <div className="lg:col-span-4 p-6 sm:p-8 bg-slate-50 flex flex-col justify-between gap-6">
          <div className="flex flex-col gap-4">
            <div className="relative h-40 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
              <img
                src={selectedCourse.img}
                alt={selectedCourse.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-3xs" />
              <div className="absolute bottom-3 left-3 right-3 z-10">
                <span className="bg-white/90 backdrop-blur text-indigo-900 text-[9px] font-black font-mono uppercase px-2 py-0.5 rounded-md tracking-wider">
                  CLASE DIGITAL ACTIVA
                </span>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              {!enrollment ? (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/10 border-0"
                >
                  {enrolling ? <Loader2 className="w-4 h-4 animate-spin" /> : <GraduationCap className="w-4.5 h-4.5" />}
                  <span>{enrolling ? "Inscribiendo..." : authUser ? "Inscribirme Gratis" : "Iniciar Sesión para Registrarme"}</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={openCoursePlayer}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/10 border-0"
                  >
                    <PlayCircle className="w-4.5 h-4.5" />
                    <span>{progress > 0 ? "Reanudar Masterclass" : "Iniciar Masterclass"}</span>
                  </button>
                  {progress >= 85 && !completed && (
                    <button
                      onClick={handleComplete}
                      disabled={completing}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border-0"
                    >
                      {completing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Award className="w-4.5 h-4.5" />}
                      <span>{completing ? "Emitiendo Certificado..." : "Generar Certificado Digital"}</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Garantías / Sellos de la Academia */}
          <div className="border-t border-slate-200/70 pt-4 flex flex-col gap-2.5">
            {[
              { icon: ShieldCheck, text: "Diploma de Clientum en convenio con ISSAG" },
              { icon: Lock, text: "Acceso libre de por vida a apuntes y sandbox" },
              { icon: Users, text: "Soporte comunitario y foro de pymes locales" }
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                <Icon className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Programa de Estudio Detallado (Syllabus) ─────────────────────────── */}
      <div className="border-t border-slate-200/60 pt-8">
        <div className="max-w-xl mx-auto text-center mb-8">
          <span className="text-indigo-600 font-mono text-[10px] uppercase tracking-widest font-black">Plan Curricular</span>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-2">¿Qué vas a aprender, semana a semana?</h3>
          <p className="text-slate-500 text-xs mt-1">Syllabus detallado del programa activo seleccionado arriba.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {(selectedCourse as any).weeks?.map(({ week, title, lessons }: any) => (
            <div key={week} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col h-full">
              <div className={`p-4 bg-gradient-to-br ${selectedCourse.color} text-white`}>
                <span className="bg-white/20 text-white font-mono text-[9px] font-black uppercase px-2 py-0.5 rounded-md">
                  Semana {week}
                </span>
                <h4 className="text-xs font-bold mt-2 leading-snug line-clamp-2">{title}</h4>
              </div>
              <div className="p-4 flex-1 flex flex-col gap-2.5 bg-slate-50/50">
                {lessons.map((lesson: string, idx: number) => {
                  const isDeliverable = idx === lessons.length - 1;
                  return (
                    <div key={idx} className="flex items-start gap-2 text-[11px] leading-relaxed">
                      <div className="mt-0.5 shrink-0">
                        {isDeliverable ? (
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[9px] font-bold text-indigo-700">
                            {idx + 1}
                          </div>
                        )}
                      </div>
                      <p className={isDeliverable ? "font-bold text-indigo-900" : "text-slate-600"}>
                        {lesson}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Documentación Institucional y Descargables ──────────────────────── */}
      <div className="border-t border-slate-200/60 pt-8">
        <div className="max-w-xl mx-auto text-center mb-6">
          <span className="text-slate-400 font-mono text-[10px] uppercase tracking-widest font-black">Validaciones & Recursos</span>
          <h3 className="text-lg font-black text-slate-800 tracking-tight mt-1">Convenios y Apuntes de Clase</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {[
            {
              title: "Propuesta Académica v2",
              desc: "Programa de estudio oficial ISSAG General Roca",
              href: "/docs/academia/propuesta-curso-v2.md",
              icon: BookOpen,
            },
            {
              title: "Convenio Piloto ISSAG",
              desc: "Acuerdo marco para validación de títulos locales",
              href: "/docs/academia/clientum-academia-propuesta-issag.docx",
              icon: GraduationCap,
            },
            {
              title: "Planilla de Seguimiento",
              desc: "Registro e historial de calificaciones",
              href: "/docs/academia/clientum-academia-resumen-cambios.xlsx",
              icon: ChevronRight,
            },
          ].map(({ title, desc, href, icon: Icon }) => (
            <a
              key={title}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 p-4 rounded-2xl border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all bg-white"
            >
              <div className="p-2 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 text-indigo-600 transition-colors shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-900 transition-colors truncate">{title}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* ── PLAYER DE CLASE INTERACTIVO & SANDBOX (WORKSPACE MODAL) ─────────────── */}
      {playerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col text-slate-100 font-sans">
          
          {/* Header Superior del Workspace */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
                <GraduationCap className="w-5 h-5 animate-pulse" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest block leading-none">MASTERCLASS ACTIVA</span>
                <h3 className="text-white text-xs sm:text-sm font-black truncate max-w-[250px] sm:max-w-md mt-1 leading-none">
                  {selectedCourse.name}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg">
                <span>Progreso:</span>
                <span className="text-indigo-400 font-bold">{progress}%</span>
              </div>
              <button
                onClick={() => setPlayerOpen(false)}
                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-all border-0 cursor-pointer"
                title="Cerrar Aula"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cuerpo Dividido (Slides Teóricos a la Izquierda, Sandbox Práctico a la Derecha) */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* PANEL IZQUIERDO: Diapositiva / Quiz */}
            <div className="w-full md:w-1/2 flex flex-col border-b md:border-b-0 md:border-r border-slate-800 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950 custom-scrollbar">
              
              {playerSlide < selectedCourse.slides.length ? (
                /* MOSTRANDO DIAPOSITIVA TEÓRICA */
                <div className="flex flex-col gap-6 flex-1 justify-between">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-indigo-400 font-mono text-[10px] font-black uppercase tracking-widest bg-indigo-950 px-3 py-1 rounded-full">
                        MÓDULO {playerSlide + 1} DE {selectedCourse.slides.length}
                      </span>
                      <span className="text-slate-500 text-xs font-mono">Clase Teórica</span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {selectedCourse.slides[playerSlide].title}
                    </h2>

                    <p className="text-slate-300 text-sm leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800/60">
                      {selectedCourse.slides[playerSlide].concept}
                    </p>

                    <div className="flex flex-col gap-3 mt-2">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 font-mono">Reglas Clave & Recomendaciones</h4>
                      {selectedCourse.slides[playerSlide].bullets.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2.5 text-xs text-slate-400">
                          <div className="bg-indigo-950 text-indigo-400 p-0.5 rounded-md mt-0.5 shrink-0">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Barra de Navegación de Diapositivas */}
                  <div className="flex justify-between items-center pt-6 border-t border-slate-800/80 mt-6 shrink-0">
                    <button
                      onClick={handleSlidePrev}
                      disabled={playerSlide === 0}
                      className="bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      Anterior
                    </button>
                    <span className="text-xs font-mono text-slate-500">Slide {playerSlide + 1}/{selectedCourse.slides.length}</span>
                    <button
                      onClick={handleSlideNext}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-indigo-600/10 border-0"
                    >
                      <span>Siguiente</span>
                      <MoveRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                /* MOSTRANDO CUESTIONARIO FINAL DE CERTIFICACIÓN */
                <div className="flex flex-col gap-6 flex-1 justify-between">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-400 font-mono text-[10px] font-black uppercase tracking-widest bg-emerald-950/50 border border-emerald-900/30 px-3 py-1 rounded-full">
                        EXAMEN FINAL
                      </span>
                      <span className="text-slate-500 text-xs font-mono">Evaluación</span>
                    </div>

                    <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                      <Award className="w-6 h-6 text-emerald-400 animate-bounce" />
                      Cuestionario de Certificación
                    </h2>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Respondé correctamente todas las preguntas basadas en la clase para graduarte y emitir tu diploma digital oficial avalado por ISSAG y Clientum.
                    </p>

                    <div className="flex flex-col gap-5 mt-3">
                      {selectedCourse.quiz.map((qObj, idx) => (
                        <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
                          <p className="text-xs font-bold text-slate-200">
                            {idx + 1}. {qObj.q}
                          </p>
                          <div className="flex flex-col gap-2">
                            {qObj.options.map((opt, optIdx) => {
                              const isSelected = quizAnswers[idx] === optIdx;
                              return (
                                <button
                                  key={optIdx}
                                  onClick={() => handleOptionSelect(idx, optIdx)}
                                  disabled={quizSubmitted}
                                  className={`text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                                    isSelected
                                      ? "bg-indigo-600/20 border-indigo-500 text-indigo-200"
                                      : "bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400"
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    {quizScoreError && (
                      <div className="bg-red-950/50 border border-red-900 text-red-300 text-xs p-3.5 rounded-xl flex items-start gap-2.5 mt-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                        <div>
                          <p className="font-bold">Respuestas incorrectas</p>
                          <p className="text-[11px] text-red-400 mt-0.5">Por favor revisá el material del sandbox y repasá las diapositivas teóricas para intentar de nuevo.</p>
                        </div>
                      </div>
                    )}

                    {quizSubmitted && (
                      <div className="bg-emerald-950/50 border border-emerald-900 text-emerald-300 text-xs p-4 rounded-xl flex items-start gap-3 mt-2">
                        <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                        <div>
                          <p className="font-bold text-sm">¡Examen Aprobado con Éxito!</p>
                          <p className="text-[11px] text-emerald-400 mt-1">Cumpliste con el 100% de los requisitos del programa. Ya podés cerrar esta pestaña y generar tu diploma verificable.</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-slate-800/80 mt-6 shrink-0">
                    <button
                      onClick={() => setPlayerSlide(selectedCourse.slides.length - 1)}
                      className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer"
                    >
                      Volver a Repasar
                    </button>
                    {quizSubmitted ? (
                      <button
                        onClick={() => { setPlayerOpen(false); handleComplete(); }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/10 border-0"
                      >
                        <Award className="w-4 h-4" />
                        <span>Obtener Mi Certificado</span>
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleResetQuiz}
                          className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold text-xs px-3 py-2.5 rounded-xl cursor-pointer"
                        >
                          Reiniciar
                        </button>
                        <button
                          onClick={handleQuizSubmit}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer border-0"
                        >
                          Calificar Examen
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* PANEL DERECHO: Sandbox de Práctica Interactiva */}
            <div className="w-full md:w-1/2 flex flex-col bg-slate-900 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                  <span className="text-[10px] font-black font-mono text-slate-300 uppercase tracking-widest">SANDBOX DE PRÁCTICA CLIENTUM</span>
                </div>
                <span className="text-slate-500 text-[10px] font-mono">Entorno Simulado</span>
              </div>

              {/* CONTENIDO DEL SANDBOX SEGÚN EL CURSO SELECCIONADO */}

              {selectedCourse.slug === "crm-moderno-automatizacion" && (
                <div className="flex flex-col gap-4 flex-1">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-indigo-400" />
                      Práctica: Orquestador Kanban de Prospectos
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Interactuá con un tablero real en miniatura. Presioná 'Calificar con IA' para activar el análisis inteligente del bot y ver cómo se mueve el lead de etapa.
                    </p>
                  </div>

                  {/* Columnas Kanban */}
                  <div className="grid grid-cols-3 gap-2.5 flex-1">
                    {["nuevo", "calificado", "propuesta"].map((stage) => {
                      const stageLeads = kanbanLeads.filter(l => l.stage === stage);
                      return (
                        <div key={stage} className="bg-slate-950/80 rounded-xl p-2.5 border border-slate-800 flex flex-col gap-2.5 min-h-[300px]">
                          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider text-center block">
                            {stage === "nuevo" ? "Nuevos Leads" : stage === "calificado" ? "Calificados IA" : "Propuesta Enviada"}
                          </span>

                          <div className="flex flex-col gap-2">
                            {stageLeads.length === 0 ? (
                              <div className="border border-dashed border-slate-800 rounded-lg p-4 text-center text-slate-600 text-[10px]">
                                Sin tarjetas
                              </div>
                            ) : (
                              stageLeads.map(lead => (
                                <div key={lead.id} className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 flex flex-col gap-2 relative">
                                  <div>
                                    <h5 className="text-[11px] font-bold text-slate-200">{lead.name}</h5>
                                    <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">{lead.details}</p>
                                  </div>

                                  <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-800/60 text-[9px]">
                                    <span className={`px-1.5 py-0.5 rounded-sm font-mono ${lead.scoring === "Pendiente" ? "bg-slate-800 text-slate-400" : "bg-emerald-950 text-emerald-400 font-bold"}`}>
                                      IA: {lead.scoring}
                                    </span>
                                  </div>

                                  <div className="flex flex-col gap-1 mt-1.5">
                                    {lead.stage === "nuevo" && (
                                      <button
                                        onClick={() => runCrmLeadQualification(lead.id)}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[9px] py-1 px-2 rounded-md transition-all cursor-pointer border-0"
                                      >
                                        Calificar con IA
                                      </button>
                                    )}
                                    {lead.stage === "calificado" && (
                                      <button
                                        onClick={() => moveCrmLeadToProposal(lead.id)}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[9px] py-1 px-2 rounded-md transition-all cursor-pointer border-0"
                                      >
                                        Enviar Propuesta
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setKanbanLeads([
                      { id: 1, name: "Gimnasio Roca Fit", stage: "nuevo", details: "Interesado en captar más socios.", scoring: "Pendiente" },
                      { id: 2, name: "Estudio Pérez & Asoc", stage: "nuevo", details: "Buscan automatizar avisos a clientes.", scoring: "Pendiente" },
                      { id: 3, name: "Frutería Alto Valle", stage: "nuevo", details: "Requiere seguimiento de presupuestos.", scoring: "Pendiente" }
                    ])}
                    className="mt-2 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-400 text-[10px] py-2 px-4 rounded-xl flex items-center justify-center gap-1.5 self-center cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" /> Reiniciar Tablero
                  </button>
                </div>
              )}

              {selectedCourse.slug === "ia-outreach-email-marketing" && (
                <div className="flex flex-col gap-4 flex-1">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-indigo-400" />
                      Práctica: Redactor y Generador de Outreach
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Elegí el nicho y tono. El motor generará dinámicamente un email con ganchos persuasivos y merge-tags automáticos integrando tu base de contactos CRM.
                    </p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block mb-1">Nicho / Industria</label>
                        <select
                          value={emailIndustry}
                          onChange={(e) => setEmailIndustry(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none"
                        >
                          <option value="Inmobiliaria">Inmobiliarias locales</option>
                          <option value="Distribuidoras">Distribuidoras Alto Valle</option>
                          <option value="Servicios Médicos">Servicios Médicos / Clínicas</option>
                          <option value="Gastronomía">Restaurantes & Catering</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block mb-1">Tono Persuasivo</label>
                        <select
                          value={emailTone}
                          onChange={(e) => setEmailTone(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none"
                        >
                          <option value="Persuasivo">Enfoque ROI & Venta Directa</option>
                          <option value="Informativo">Diagnóstico Técnico Amistoso</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={generateSandboxEmail}
                      disabled={generatingEmail}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold text-xs py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer border-0"
                    >
                      {generatingEmail ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      <span>{generatingEmail ? "Redactando con IA..." : "Redactar Outreach Personalizado"}</span>
                    </button>
                  </div>

                  {generatedEmail && (
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex-1 flex flex-col gap-2">
                      <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest">VISTA PREVIA DEL OUTBOX CRM</span>
                      <pre className="text-[11px] text-slate-300 font-mono whitespace-pre-wrap leading-relaxed flex-1 overflow-y-auto bg-slate-900 p-3 rounded-lg border border-slate-850">
                        {generatedEmail}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {selectedCourse.slug === "seo-local-prospeccion-geolocalizada" && (
                <div className="flex flex-col gap-4 flex-1">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-indigo-400" />
                      Práctica: Geolocated Prospector & Audit
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Simulá una prospección en tu zona. Ingresá una palabra clave comercial y un municipio para rastrear perfiles vulnerables de SEO local.
                    </p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block mb-1">Qué buscar (Rubro)</label>
                        <input
                          type="text"
                          value={seoKeyword}
                          onChange={(e) => setSeoKeyword(e.target.value)}
                          placeholder="Ej: Pinturerías, Talleres"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block mb-1">Ciudad / Municipio</label>
                        <input
                          type="text"
                          value={seoCity}
                          onChange={(e) => setSeoCity(e.target.value)}
                          placeholder="Ej: General Roca, Cipolletti"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      onClick={scanSeoMap}
                      disabled={scanningSeo}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold text-xs py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer border-0"
                    >
                      {scanningSeo ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                      <span>{scanningSeo ? "Extrayendo de Maps..." : "Escanear Zonas de Prospectos"}</span>
                    </button>
                  </div>

                  {seoResults.length > 0 && (
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex-1 flex flex-col gap-2">
                      <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest block">PROSPECTOS LOCALES EXTRAÍDOS ({seoResults.length})</span>
                      <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
                        {seoResults.map((item, idx) => (
                          <div key={idx} className="bg-slate-900 border border-slate-850 p-2.5 rounded-lg text-xs">
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-bold text-slate-200">{item.name}</h5>
                                <p className="text-[10px] text-slate-500">{item.address} · Web: {item.site}</p>
                              </div>
                              <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ${item.score === "0/100" ? "bg-red-950 text-red-400" : item.score === "88/100" ? "bg-emerald-950 text-emerald-400" : "bg-amber-950 text-amber-400"}`}>
                                SEO: {item.score}
                              </span>
                            </div>
                            <div className="mt-2 pt-1.5 border-t border-slate-850 flex flex-wrap gap-1.5">
                              {item.flaws.map((flaw: string, fIdx: number) => (
                                <span key={fIdx} className="bg-slate-950 text-red-400 border border-red-900/30 text-[9px] px-1.5 py-0.5 rounded-sm">
                                  ⚠️ {flaw}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedCourse.slug === "diseno-brochures-materiales-ia" && (
                <div className="flex flex-col gap-4 flex-1">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-indigo-400" />
                      Práctica: Generador y Estilizador de Brochure PDF
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Ajustá las paletas visuales de la marca en tiempo real. El sandbox renderiza el pre-diseño comercial del folleto para su exportación limpia.
                    </p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block mb-1">Paleta de Color</label>
                        <div className="flex gap-2">
                          {[
                            { id: "navy", class: "bg-[#0A2558]" },
                            { id: "emerald", class: "bg-emerald-600" },
                            { id: "coral", class: "bg-rose-500" },
                            { id: "dark", class: "bg-slate-800" }
                          ].map((col) => (
                            <button
                              key={col.id}
                              onClick={() => setBrochurePalette(col.id)}
                              className={`w-6 h-6 rounded-full border cursor-pointer transition-all ${col.class} ${brochurePalette === col.id ? "ring-2 ring-indigo-500 border-white scale-110" : "border-slate-700 hover:scale-105"}`}
                              title={col.id}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block mb-1">Contenido / Enfoque</label>
                        <select
                          value={brochureContent}
                          onChange={(e) => setBrochureContent(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none"
                        >
                          <option value="Standard">Corporativo General</option>
                          <option value="Estrategico">Atención de Urgencia & Cierre</option>
                          <option value="Descuento">Oferta Especial / Lanzamiento</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Brochure Preview Panel */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex-1 flex flex-col gap-3 relative overflow-hidden">
                    {/* Color Top Border based on palette selection */}
                    <div className={`h-1.5 w-full absolute top-0 left-0 ${
                      brochurePalette === "navy" ? "bg-[#0A2558]" :
                      brochurePalette === "emerald" ? "bg-emerald-600" :
                      brochurePalette === "coral" ? "bg-rose-500" :
                      "bg-slate-500"
                    }`} />

                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[9px] font-mono text-slate-500 uppercase">PRE-DISEÑO EN ALTA FIDELIDAD</span>
                      <span className="text-[9px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800">4 páginas</span>
                    </div>

                    <div className="flex-1 bg-slate-900 rounded-lg border border-slate-850 p-4 text-xs font-sans flex flex-col gap-2.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded flex items-center justify-center text-white ${
                          brochurePalette === "navy" ? "bg-[#0A2558]" :
                          brochurePalette === "emerald" ? "bg-emerald-600" :
                          brochurePalette === "coral" ? "bg-rose-500" :
                          "bg-slate-500"
                        }`}>
                          <img src="/favicon.svg" alt="" className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-extrabold text-slate-200">CLIENTUM CRM</span>
                      </div>

                      <div className="mt-1">
                        <h4 className={`text-sm font-black tracking-tight leading-snug ${
                          brochurePalette === "navy" ? "text-indigo-200" :
                          brochurePalette === "emerald" ? "text-emerald-200" :
                          brochurePalette === "coral" ? "text-rose-200" :
                          "text-slate-200"
                        }`}>
                          {brochureContent === "Standard" ? "Soluciones de Gestión & Automatización para el Alto Valle" :
                           brochureContent === "Estrategico" ? "Reducción Crítica de Tiempos de Respuesta con IA" :
                           "Plan Especial: Digitalización PyME con 30% Bonificado"}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Diagnóstico claro, estructuración de bases de datos de leads y asistentes automatizados.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800/80">
                        <div className="bg-slate-950/60 p-2 rounded border border-slate-850">
                          <span className="text-[9px] font-bold text-slate-400 block">Soporte Multicanal</span>
                          <span className="text-[8px] text-slate-500 block mt-0.5">Centralizá WhatsApp, Email y CRM.</span>
                        </div>
                        <div className="bg-slate-950/60 p-2 rounded border border-slate-850">
                          <span className="text-[9px] font-bold text-slate-400 block">IA Orquestador</span>
                          <span className="text-[8px] text-slate-500 block mt-0.5">Scoring inteligente de oportunidades.</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => window.print()}
                      className="bg-slate-900 hover:bg-slate-850 text-slate-300 font-bold text-xs py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 self-center cursor-pointer border border-slate-800"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar Muestra PDF</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ── Certificado de Finalización (Modal) ───────────────────────────────── */}
      {certModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 flex flex-col">
            
            {/* Cert header */}
            <div className="bg-[#0A2558] p-8 text-center relative text-white">
              <button
                onClick={() => setCertModal(null)}
                className="absolute top-4 right-4 text-white/70 hover:text-white border-0 bg-transparent cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <Award className="w-12 h-12 text-yellow-300 mx-auto mb-2 animate-pulse" />
              <p className="text-indigo-200 text-[10px] uppercase tracking-widest font-mono font-bold">Certificado de Finalización Oficial</p>
              <h2 className="text-2xl font-black text-white mt-1 tracking-tight">Clientum Academia</h2>
              <p className="text-indigo-200 text-[11px] mt-0.5">en convenio académico con ISSAG · General Roca, RN</p>
            </div>

            {/* Cert body */}
            <div className="p-8 text-center flex flex-col gap-4">
              <p className="text-slate-400 text-[10px] uppercase tracking-widest font-mono font-black">Se certifica formalmente que</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight capitalize">{certModal.user_name}</p>
              <p className="text-slate-500 text-xs">completó satisfactoriamente el programa de entrenamiento profesional</p>
              <p className="text-base font-bold text-indigo-700 bg-indigo-50 border border-indigo-100/50 py-2.5 px-4 rounded-xl leading-snug">
                "{certModal.course_name}"
              </p>
              <p className="text-slate-400 text-[10px] font-mono mt-1">
                Fecha de Emisión: {new Date(certModal.issued_at).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
              </p>

              <div className="border-t border-slate-100 pt-4 flex flex-col gap-1 text-[10px] text-slate-400 font-mono">
                <p>ID Único: {certModal.id}</p>
                <p>Verificación pública: clientum.com.ar/academia/verificar</p>
              </div>

              <button
                onClick={() => window.print()}
                className="mt-4 bg-[#0A2558] hover:bg-[#0d1f3c] text-white text-xs font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer shadow-md border-0 font-sans"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Diploma (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
