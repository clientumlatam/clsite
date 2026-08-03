# GitHub repository link

**Created:** 8/2/2026 18:29:55  
**Updated:** 8/2/2026 18:39:53  
**Exported:** 8/2/2026 18:43:28  
**Link:** [https://claude.ai/chat/322f46ec-a05b-4988-a77b-c8e59bbb72c1](https://claude.ai/chat/322f46ec-a05b-4988-a77b-c8e59bbb72c1)  

## User:

> 8/2/2026 18:29:55

https://github.com/clientumlatam/clsite

## Assistant:

> 8/2/2026 18:30:10

> - [GitHub - clientumlatam/clsite: s (github.com)](https://github.com/clientumlatam/clsite)
> - **Done**

This is `clientumlatam/clsite` — another AI Studio–generated repo, deployed at clsite.vercel.app, built off Google's `google-gemini/aistudio-repository-template` (the same pattern as the other AI Studio exports you've been auditing).

Quick read of the structure:

- **Stack**: Vite + TypeScript, `bun.lock` *and* `pnpm-lock.yaml`/`pnpm-workspace.yaml` present together (worth cleaning up — pick one package manager), `vercel.json` for deployment, `server.ts` + `index.ts` at root.
- **Firebase, not your usual stack**: `firebase-applet-config.json`, `firebase-blueprint.json`, `firestore.rules` — this one leans on Firebase/Firestore rather than Neon/Prisma/Postgres like Clientum production.
- **Supabase also present**: `utils/supabase` folder — so it's mixing Firebase and Supabase, which is a signal this is scaffold-generated rather than a deliberate architecture choice.
- **`.agents/skills`**: interesting — has an agent-skills folder plus a `skills-lock.json`, so this repo has some kind of Claude/agent skill wiring already set up.
- **Content**: `public/casos` suggests case studies/portfolio content, `attached_assets` for media.
- Requires `GEMINI_API_KEY` in `.env.local` to run — classic AI Studio export.

Given the pattern from your other AI Studio audits: this looks like another non-portable scaffold (mixed Firebase/Supabase/Vercel, no AFIP/MercadoPago/Evolution API integration, no Prisma/Neon). It's likely a landing page or portfolio site (`clsite` = "cl site"?) rather production infra, but the `.agents/skills` folder is a bit unusual and might be worth a closer look if you want me to dig into what's actually inside.

Want me to clone it and do a proper technical audit like you did with the other prototype exports — check `package.json`, look at what `.agents/skills` contains, and see if there's anything portable (component patterns, Gemini prompts, etc.) for Clientum?

## User:

> 8/2/2026 18:30:22

si

## Assistant:

> 8/2/2026 18:31:23

> - Clone the clsite repo for audit
> - Ver estructura del repo
> - Ver package.json y README
> - **Done**

Interesting — this is actually **more substantial** than a typical throwaway AI Studio scaffold. It's got `pg`, `express-session`, `connect-pg-simple`, `apify-client`, `nodemailer`, `bcryptjs` — real backend plumbing, not just a UI shell. Let me check the server, replit.md (usually the best doc for intent), and scan for secrets since that's a known risk pattern in your projects.

> - Leer replit.md para contexto del proyecto
> - **Done**

This isn't a throwaway prototype — it's the actual **Clientum CRM production repo**, deployed straight to **clientum.com.ar via Vercel**, with real GitHub Actions CI and a Neon branch-per-PR workflow. Let me check for secrets exposure and get a fuller picture.

> Deliberated language preference for audit presentation.
>
> - Revisar .env.example y buscar secretos hardcodeados
> - Diagnosticar por qué .env.example no imprime contenido
> - Verificar gitignore y si hay archivos .env commiteados
> - Buscar docs y explorar .agents/skills
> - Deliberated language preference for audit presentation.
> - **Done**

Che, esto cambia el diagnóstico por completo: **este repo no es un scaffold descartable — es el Clientum CRM real**, deployado directo a clientum.com.ar vía Vercel, con CI de GitHub Actions y branching de Neon por PR. Achicá esta lectura:

**Qué es realmente**
- `replit.md` lo confirma: "Clientum CRM — AI-powered B2B sales CRM... Explorador Patagónico, MEDDIC, Santi/Hermes SDR" — es tu stack productivo, generado/iterado vía Replit + AI Studio (Gemini).
- Stack real: React 19 + Vite 6 + Express 4 + **Neon Postgres** (`pg` + `connect-pg-simple`), Gemini (`@google/genai`), Apify (scraping), Hunter.io, jsPDF para brochures.
- Deploy: GitHub → Actions (`ci.yml` + `neon_workflow.yml` crea branch Neon por PR, expira a los 14 días) → Vercel con `api/index.ts` como función serverless.

**Secretos — buenas noticias**
- `.gitignore` excluye `.env*` correctamente (solo permite `.env.example`).
- No encontré `DATABASE_URL`, tokens de Neon, Gemini, Apify ni Hunter hardcodeados en el código.
- El único "secret" que apareció es un `webhookSecret: 'whsec_...'` en `src/platform/data/mockData.ts` — es mock data de demo (URL de Cloud Run también fake), no una credencial real.
- Ojo: `.env.example` tiene contenido raro — el archivo literalmente contiene el texto `.env.example` en vez de las variables documentadas. Puede ser un bug de exportación de Replit/AI Studio que rompió ese archivo.

**Lo interesante: `.agents/skills/`**
Tiene un sistema de skills para agentes con `skills-lock.json` apuntando a decenas de skills de terceros vía GitHub (ej. `supabase-postgres-best-practices` de Supabase oficial, `agent-md-refactor`, `ai-elements` de Vercel, etc.) — parece un gestor de skills tipo paquete (source + hash) corriendo sobre Replit. Es un patrón que podría ser útil llevar a Hermes Prime si no lo tenés ya.

¿Querés que profundice en `server.ts` (240K, así que va a ser grande) para ver si esta versión tiene lógica que diverge de tu servidor de producción actual en `clientum-latam`, o te interesa más el patrón de `skills-lock.json` para adaptarlo a tu arquitectura de agentes?

## User:

> 8/2/2026 18:32:58

si

## Assistant:

> 8/2/2026 18:33:30

> Identificó divergencias arquitectónicas en la implementación.
>
> - Ver el inicio de server.ts para entender su estructura
> - Examined server architecture and identified database implementation divergence.
> - Listar endpoints y tablas del server.ts
> - Identificó divergencias arquitectónicas en la implementación.
> - **Done**

Che, esto es más revelador de lo que pensaba. Resumen del `server.ts` (5137 líneas, Express monolítico):

**Divergencia importante con lo que veníamos manejando de la arquitectura de Clientum:**
- Este server usa **`pg` crudo** (Pool + queries SQL directas), **no Prisma**. Si tu producción actual en `clientum-latam` corre con Prisma + Neon, este repo es una rama de desarrollo distinta o una versión anterior/paralela — vale la pena confirmar cuál es la fuente de verdad real detrás de clientum.com.ar hoy.
- Auth es **bcrypt + express-session con `connect-pg-simple`** (sesión en tabla Postgres `session`), no Neon Auth/Better Auth como se documentó en sesiones anteriores.
- Tiene rutas `/api/auth/neon-login` y `/api/auth/neon-register` *además* de `/api/auth/login` y `/api/auth/register` — dos sistemas de auth conviviendo, probablemente una migración a medio hacer.

**Superficie funcional (bastante completa, no es un mock):**
- CRM: `companies`, `leads`, `leads-enriched`, `campaigns`, `proposals`, `pipeline/funnel`
- Prospección: `places/search`, `places/bulk-import`, `places/:id/score` (Apify + Google Maps)
- Orquestador de agentes: `agent/tasks`, `agent/logs`, `agent/run/prospect`, `agent/run/enrich`, `orchestrator/status`, `orchestrator/metrics` — este es tu patrón Hermes Prime, pero implementado acá como tablas Postgres (`agent_tasks`, `agent_logs`, `orchestrator_logs`) en vez de GitHub Issues/labels
- WhatsApp: tablas `whatsapp_conversations` / `whatsapp_messages` — sin ver Evolution API todavía en este archivo, capaz está en otro módulo
- LMS: `lms/enroll`, `lms/complete`, `lms/certificate` — un sistema de cursos/certificados que no tenía registrado
- Brochures PDF por lead vía Gemini + jsPDF

**Sobre `SESSION_SECRET`:** tiene un fallback hardcodeado `"clientum-dev-fallback-secret-change-in-prod"` que solo avisa por consola si falta la env var en vez de fallar — riesgo si por accidente se deployea a prod sin `SESSION_SECRET` seteado, las sesiones quedan firmadas con un secreto público y conocido.

¿Querés que te arme un diff conceptual contra lo que sabemos de la arquitectura de `clientum-latam` (Prisma vs pg crudo, Evolution API vs estas tablas WhatsApp) para decidir cuál es la versión que hay que consolidar, o preferís que primero busque si hay más contexto en `src/agents` y `docs/ARCHITECTURE.md` (no lo vi en el listado, raro que replit.md lo mencione pero no exista)?

## User:

> 8/2/2026 18:35:23

si

## Assistant:

> 8/2/2026 18:36:01

> - Buscar ARCHITECTURE.md y explorar src/agents
> - Explorar src/agents y verificar historial de docs/
> - Traer historial completo y buscar docs/ en todos los commits
> - Ver el orchestrator de agentes del frontend
> - **Done**

Ahora tengo el cuadro completo. Esto confirma que hay **dos implementaciones distintas del patrón orquestador** conviviendo bajo el mismo nombre:

**Hallazgo clave — dos "Hermes Prime" distintos:**

| | Versión que veníamos documentando | Versión en `clsite` |
|---|---|---|
| Routing | GitHub Issues + labels | Gemini genera un `OrchestratorPlan` en runtime, dispatcha por pasos con `depends_on` |
| Persistencia | — | Tablas Postgres (`agent_tasks`, `agent_logs`, `orchestrator_logs`) vía `pg` crudo |
| Agentes | Santi SDR, Explorador Patagónico, agentes departamentales | Acá solo aparecen `prospector` y `enricher` como agentes concretos (`src/agents/`) — Santi SDR no está en este módulo, probablemente vive en otro lado (WhatsApp/Evolution API) |
| ORM | Prisma (según sesiones previas) | `pg` Pool directo, sin Prisma |

**Sobre `docs/`:** confirmé con el historial completo de Git (12 commits totales) que `docs/ARCHITECTURE.md` y `docs/SANTI-SDR.md` **nunca existieron** en este repo — `replit.md` los referencia pero nunca se commitearon. Es un gap real de documentación, no un problema mío de lectura.

**Mi lectura de conjunto:** este repo parece ser una reimplementación/refactor del Orchestrator hecha desde AI Studio/Replit — con un patrón más simple y autocontenido (plan-then-dispatch con Gemini, todo en Postgres) que el patrón GitHub-Issues-como-cola que documentamos antes. No sé cuál de las dos está corriendo hoy en `clientum.com.ar` sin que me confirmes vos.

**Antes de seguir cavando en código**, esto es una decisión de arquitectura, no solo de auditoría: ¿este `clsite` es una rama experimental que se está evaluando para reemplazar el orquestador actual, o es directamente el código que ya está en producción y la documentación de "GitHub Issues + labels" quedó vieja?

## User:

> 8/2/2026 18:36:22

si

## Assistant:

> 8/2/2026 18:36:53

> Synthesized repository timeline and deployment status.
>
> - Pivoted to autonomous decision-making based on production deployment.
> - Ver vercel.json y fechas de commits para estimar actualidad
> - Synthesized repository timeline and deployment status.
> - **Done**

Dato que cambia todo el marco: **todos los commits son de hoy, 2 de agosto**, entre las 15:56 y las 20:54 (hora UTC) — este repo se creó y se está empujando activamente ahora mismo, no es un experimento viejo. Y los commits lo confirman:

- `Limpiar .env.example y dejar variables de ejemplo seguras` (19:30) — explica por qué `.env.example` quedó con contenido raro, lo estaban saneando en caliente.
- `Agregar .env a .gitignore y eliminar del índice` (19:30) — en algún momento antes de esto, `.env` real estuvo trackeado. Ya está afuera del índice actual, pero **sigue en el historial de git** de commits anteriores a las 19:30 si alguno lo tuvo.
- Merge de PR #1 (`site`) y PR #2 (`fix/vercel-add-api-index`) — están resolviendo el mismo problema de Vercel serverless que documentamos antes (falta `api/index.ts`).
- Último commit (20:54) es literalmente `"11"` — commit de WIP sin mensaje real.

Dado que esto es trabajo en curso de hoy y no un experimento aislado, lo único que valdría la pena chequear antes de que sigas es si algún `.env` real quedó expuesto en los commits previos a la limpieza:

> - Verificar si .env real quedó expuesto en algún commit anterior
> - Doble chequeo de si .env real apareció en algún commit
> - **Done**

Confirmado: **`.env` real nunca estuvo trackeado en ningún commit** de este repo — el commit "Agregar .env a .gitignore" fue preventivo, no una remoción de algo que ya estaba expuesto. No hay secretos reales filtrados en `clsite`, ni ahora ni en el historial.

**Resumen final del audit:**
- Repo activo de hoy (2 ago), work-in-progress real hacia clientum.com.ar vía Vercel — no un experimento descartable.
- Arquitectura diverge de lo documentado antes: `pg` crudo en vez de Prisma, orquestador plan-then-dispatch con Gemini en vez de GitHub Issues/labels, tablas propias en vez de Evolution API para WhatsApp (al menos en este módulo).
- Sin secretos reales expuestos, `.gitignore` correcto.
- Único riesgo real: el fallback hardcodeado de `SESSION_SECRET` en `server.ts` si se deployea sin la env var seteada.
- `docs/ARCHITECTURE.md` y `docs/SANTI-SDR.md` referenciados en `replit.md` no existen — falta escribirlos o se perdieron en el export.

Quedo con la carpeta clonada en `/home/claude/clsite` por si querés que siga mirando algo puntual (por ejemplo el manejo real de WhatsApp, o el resto de `src/platform` que es la carpeta más grande de todas con 1.1M).

## User:

> 8/2/2026 18:39:29

si

## Assistant:

> 8/2/2026 18:39:53

> Examined mock-data architecture supporting multiple SaaS platforms.
>
> - Explorar src/platform, la carpeta más grande sin auditar
> - Examined mock data architecture across multiple business verticals.
> - Confirmar si src/platform es prototipo con mock data o está conectado al backend real
> - Examined mock-data architecture supporting multiple SaaS platforms.
> - **Done**

Confirmado — `src/platform` es exactamente el patrón que ya conocías: **una capa de prototipo 100% mockeada**, desconectada del backend real (`server.ts`). Ningún componente ahí hace `fetch()`; todo lee de `mockData.ts` (1767 líneas).

Y lo más interesante: los tipos que importa (`SaaSClusterSite`, `FrappeApp`, `BenchNode`, `SiteBackup`, `SubscriptionRecord`, `ControlPlaneMetrics`) son **terminología literal de Frappe/Bench** — esto es un mockup de un *control plane multi-tenant estilo Frappe Cloud*, con verticales de ejemplo (ERP, restaurante, e-commerce) colgando del mismo tenant. Encaja con la investigación de Frappe/ERPNext que ya habías hecho como arquitectura de referencia.

**Conclusión del audit completo de `clsite`:**

| Capa | Estado |
|---|---|
| `server.ts` + `api/` | **Real**, funcional, deployado hoy a Vercel/clientum.com.ar. `pg` crudo, diverge de Prisma documentado antes. |
| `src/agents/` (orchestrator/prospector/enricher) | **Real**, patrón plan-then-dispatch con Gemini, persiste en Postgres. |
| `src/platform/` | **Vibe-coded, mockeado**, no portable tal cual — pero los *type shapes* (`CustomerSegment`, `ChatbotConfig`, `AutomationRule`, todo el bloque Frappe-style) son reutilizables como referencia de modelado, igual que en tus auditorías anteriores de AI Studio. |
| Seguridad | Sin secretos reales filtrados, `.gitignore` correcto. Único riesgo: fallback hardcodeado de `SESSION_SECRET`. |
| Docs | `docs/ARCHITECTURE.md` y `docs/SANTI-SDR.md` referenciados pero inexistentes en el repo. |

Con esto tenés el panorama completo de las tres capas. Si en algún momento querés que compare puntualmente `src/platform/types.ts` contra tu modelo de datos actual de Clientum para ver qué vale la pena portar, avisame.

Powered by Claude Exporter (https://www.ai-chat-exporter.net)
