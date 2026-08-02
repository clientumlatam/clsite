# Clientum CRM

AI-powered B2B sales CRM orientado a pymes de la Patagonia argentina. Permite descubrir prospectos vía Google Maps / Apify, calificarlos con MEDDIC, generar brochures personalizados en PDF por industria, y automatizar el outreach WhatsApp a través del agente SDR "Santi" (Hermes).

Para la documentación técnica completa → `docs/ARCHITECTURE.md`.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 + TypeScript + Vite 6 + Tailwind CSS v4 |
| Backend | Express 4 (Node.js 22) |
| Base de datos | Neon PostgreSQL (serverless, pooled) via `pg` |
| IA | Google Gemini (`@google/genai`) con fallback local |
| PDF | jsPDF + html2canvas-pro |
| Scraping | Apify (3 actores con fallback automático) |
| Enriquecimiento | Hunter.io domain-search |
| Gestión paquetes | pnpm |

---

## Cómo correr

```bash
npm run dev        # Inicia Express + Vite dev en :5000
npm run build      # Vite build + esbuild bundle del servidor
npm run start      # Producción (necesita npm run build primero)
npm run lint       # TypeScript typecheck (tsc --noEmit)
```

---

## Estructura del proyecto

```
/
├── server.ts              # Entrypoint Express (dev + Cloud Run)
├── api/
│   ├── index.ts           # Entrypoint Vercel serverless
│   └── tsconfig.json      # moduleResolution: node16 (requerido por Vercel)
├── src/                   # React frontend
│   ├── App.tsx            # Root: routing condicional SPA
│   ├── components/        # Componentes UI (CRM, Kanban, Brochure, etc.)
│   │   └── crm-full/      # CRM completo (Pipeline, Leads, Dashboard…)
│   ├── data/              # JSON catálogos (servicios, cursos, categorías)
│   ├── services/          # scraperService.ts (cliente HTTP → /api/scrape-places)
│   ├── store/             # sharedStore.ts (estado localStorage-backed)
│   └── utils/             # pdfGenerator.ts
├── public/                # Assets estáticos (logos, imágenes)
├── docs/
│   ├── ARCHITECTURE.md    # Arquitectura técnica completa
│   └── SANTI-SDR.md       # Integración agente SDR Santi/Hermes
├── scripts/
│   └── generate_catalog.py
├── .github/workflows/
│   ├── ci.yml             # TypeScript lint + Vite build en cada PR/push
│   └── neon_workflow.yml  # Branch Neon por PR
├── vercel.json            # Deployment Vercel
├── .env.example           # Referencia completa de variables de entorno
└── replit.md              # ← este archivo
```

---

## Variables de entorno

Ver `.env.example` para descripción completa y cómo obtener cada valor.

### Requeridas
| Variable | Descripción |
|----------|-------------|
| `SESSION_SECRET` | Firma cookies de sesión Express |
| `GEMINI_API_KEY` | Google Gemini — todas las funciones de IA |
| `CRM_INTERNAL_TOKEN` | Token webhook WordPress plugin → CRM |
| `NEON_API_KEY` + `NEON_PROJECT_ID` | Resolución dinámica de DB URL (preferido) |
| `DATABASE_URL` | Cadena de conexión PostgreSQL (fallback si no hay NEON_*) |

### Opcionales
| Variable | Descripción |
|----------|-------------|
| `APIFY_API_TOKEN` | Scraping real de Google Maps |
| `GOOGLE_MAPS_PLATFORM_KEY` | Places API (New) para prospección |
| `HUNTER_API_KEY` | Hunter.io — enriquecimiento de contactos |
| `SANTI_API_KEY` | Autenticación server-to-server SDR Santi |
| `APP_URL` | URL pública del app deployado |

### Auto-inyectadas (no setear manualmente)
`VERCEL`, `PORT`, `NODE_ENV`, `DISABLE_HMR`

---

## Tablas en base de datos

| Tabla | Descripción |
|-------|-------------|
| `users` | Usuarios del CRM (primer registro = admin automático) |
| `session` | Sesiones Express (connect-pg-simple) |
| `chatbot_leads` | Leads capturados por el Asesor Comercial IA |
| `santi_leads` | Prospectos generados por el Explorador Patagónico / SDR |
| `santi_brochures` | Brochures generados por industria para cada lead |
| `santi_notes` | Notas del agente Santi sobre cada lead |

Las tablas se crean automáticamente al iniciar el servidor (`CREATE TABLE IF NOT EXISTS`).

---

## Flujo de desarrollo y despliegue

```
Desarrollo (Replit)
  npm run dev → Express :5000 + Vite HMR
  Neon DB via NEON_API_KEY + NEON_PROJECT_ID
       │
       │ git push / Pull Request
       ▼
GitHub Actions
  ci.yml:           tsc --noEmit + vite build (bloquea PRs rotos)
  neon_workflow.yml: crea branch Neon "preview/pr-N" (expira 14 días)
       │
       │ PR mergeado a main
       ▼
Vercel (clientum.com.ar) — auto-deploy via GitHub integration
  Build:   pnpm install --frozen-lockfile + vite build
  Runtime: api/index.ts como Vercel Function (Node 22)
  SPA:     dist/ servido como estático desde CDN
```

---

## Features

- **CRM Kanban** — pipeline drag & drop con stages y scoring MEDDIC
- **ICP Builder** — perfil de cliente ideal generado por IA
- **Explorador Patagónico** — prospección vía Google Maps / Apify / Gemini Search
- **Calificador MEDDIC** — scoring asistido por IA
- **Campañas de outreach** — WhatsApp / email automation
- **Generador de Brochures** — PDFs personalizados por prospecto e industria con IA
- **Santi SDR** — agente WhatsApp automatizado (ver `docs/SANTI-SDR.md`)
- **Asesor Comercial IA** — chatbot demo para captura de leads
- **Sitio web público** — landing page por industria integrada en el mismo app

---

## User preferences

- Keep the existing project structure and stack
- Hablar siempre en español (Argentina) en el chat con el agente
- No cambiar lógica de negocio ni funcionalidades existentes sin confirmación
- Priorizar documentación, automatización e infraestructura