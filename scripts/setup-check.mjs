#!/usr/bin/env node
/**
 * setup-check.mjs
 * Verifica que todos los secrets necesarios estén configurados en Replit.
 * Ejecutar después de hacer un Remix del proyecto.
 *
 * Uso:
 *   node scripts/setup-check.mjs
 */

const SECRETS = [
  // ── REQUERIDAS ──────────────────────────────────────────────────────────────
  {
    key: "SESSION_SECRET",
    required: true,
    desc: "Firma cookies de sesión Express. Generá uno con: openssl rand -hex 32",
    group: "Core",
  },
  {
    key: "GEMINI_API_KEY",
    required: true,
    desc: "Google Gemini — IA generativa (brochures, calificación MEDDIC, prospección). https://aistudio.google.com/app/apikey",
    group: "Core",
  },
  {
    key: "CRM_INTERNAL_TOKEN",
    required: true,
    desc: "Token interno server-to-server (webhook WordPress → CRM). Generá uno con: openssl rand -hex 32",
    group: "Core",
  },
  {
    key: "NEON_API_KEY",
    required: true,
    desc: "Neon Control Plane API key → https://console.neon.tech/app/settings/api-keys",
    group: "Base de datos",
  },
  {
    key: "NEON_PROJECT_ID",
    required: true,
    desc: "ID del proyecto Neon (ej: shiny-violet-123456). Encontralo en https://console.neon.tech",
    group: "Base de datos",
  },
  {
    key: "NEON_DATABASE_URL",
    required: true,
    desc: "Connection string Neon pooled (postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require). Encontralo en tu proyecto Neon → Connection Details → Pooled.",
    group: "Base de datos",
  },
  {
    key: "DATABASE_URL",
    required: true,
    desc: "Igual que NEON_DATABASE_URL para uso local en Replit (pegá el mismo valor).",
    group: "Base de datos",
  },

  // ── OPCIONALES PERO RECOMENDADAS ────────────────────────────────────────────
  {
    key: "APIFY_API_TOKEN",
    required: false,
    desc: "Scraping Google Maps con Apify. https://console.apify.com/account/integrations",
    group: "Prospección",
  },
  {
    key: "GOOGLE_MAPS_PLATFORM_KEY",
    required: false,
    desc: "Google Places API (New) para prospección directa. https://console.cloud.google.com",
    group: "Prospección",
  },
  {
    key: "GOOGLE_API_KEY",
    required: false,
    desc: "Google AI Studio key adicional. https://aistudio.google.com/app/apikey",
    group: "IA",
  },
  {
    key: "GROQ_API_KEY",
    required: false,
    desc: "Groq — modelo alternativo de IA (fallback). https://console.groq.com/keys",
    group: "IA",
  },
  {
    key: "OPENROUTER_API_KEY",
    required: false,
    desc: "OpenRouter — router de modelos IA. https://openrouter.ai/keys",
    group: "IA",
  },
  {
    key: "HUNTER_API_KEY",
    required: false,
    desc: "Hunter.io — enriquecimiento de contactos (emails por dominio). https://hunter.io/api-keys",
    group: "Prospección",
  },
  {
    key: "SMTP_USER",
    required: false,
    desc: "Usuario SMTP para envío de emails (ej: hola@clientum.com.ar)",
    group: "Email",
  },
  {
    key: "SMTP_PASS",
    required: false,
    desc: "Contraseña SMTP",
    group: "Email",
  },
  {
    key: "SANTI_API_KEY",
    required: false,
    desc: "Token autenticación server-to-server SDR Santi/Hermes. Generá con: openssl rand -hex 32",
    group: "SDR Santi",
  },
  {
    key: "APP_URL",
    required: false,
    desc: "URL pública del deploy (ej: https://clientum.com.ar). Usada para links en emails y callbacks.",
    group: "Core",
  },
  {
    key: "JWKS_URL",
    required: false,
    desc: "URL del endpoint JWKS para validación JWT (Neon Auth). Se setea solo si usás Neon Auth.",
    group: "Autenticación",
  },
  {
    key: "VITE_NEON_AUTH_URL",
    required: false,
    desc: "URL proxy para Neon Auth (frontend). Se setea solo si usás Neon Auth.",
    group: "Autenticación",
  },
  {
    key: "NEON_API_KEY",
    required: false,
    desc: "Neon API key para gestión de branches (CI/CD). https://console.neon.tech/app/settings/api-keys",
    group: "Base de datos",
  },
  {
    key: "NEON_PROJECT_ID",
    required: false,
    desc: "ID del proyecto Neon para gestión de branches.",
    group: "Base de datos",
  },

  // ── PARA SINCRONIZAR SECRETS (sólo si vas a usar sync-secrets.mjs) ──────────
  {
    key: "VERCEL_TOKEN",
    required: false,
    desc: "Token Vercel para sync de secrets. https://vercel.com/account/settings/tokens — solo si usás scripts/sync-secrets.mjs",
    group: "Infraestructura",
  },
  {
    key: "GITHUB_PERSONAL_ACCESS_TOKEN",
    required: false,
    desc: "PAT GitHub con permisos repo + secrets. Solo si usás scripts/sync-secrets.mjs o git push.",
    group: "Infraestructura",
  },
];

// ─── CARGAR .env.local si existe (Remix recién configurado) ──────────────────
import { existsSync, readFileSync } from "fs";
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim();
    if (key && !process.env[key]) process.env[key] = val;
  }
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const BOLD  = (s) => `\x1b[1m${s}\x1b[0m`;
const GREEN = (s) => `\x1b[32m${s}\x1b[0m`;
const RED   = (s) => `\x1b[31m${s}\x1b[0m`;
const YELLOW= (s) => `\x1b[33m${s}\x1b[0m`;
const DIM   = (s) => `\x1b[2m${s}\x1b[0m`;

// Dedup: si una key aparece múltiples veces, quedarse con required=true
const dedupedMap = new Map();
for (const s of SECRETS) {
  const existing = dedupedMap.get(s.key);
  if (!existing || s.required) dedupedMap.set(s.key, s);
}
const secrets = [...dedupedMap.values()];

function main() {
  console.log(`\n${BOLD("🔍 Clientum — Verificación de Setup")}`);
  console.log("══════════════════════════════════════════\n");

  const missing_required = [];
  const missing_optional = [];
  const present = [];

  for (const s of secrets) {
    const val = process.env[s.key];
    if (val) {
      present.push(s);
    } else if (s.required) {
      missing_required.push(s);
    } else {
      missing_optional.push(s);
    }
  }

  // ── Configurados ────────────────────────────────────────────────────────────
  if (present.length) {
    console.log(BOLD("✅ Configurados:"));
    for (const s of present) {
      console.log(`   ${GREEN("✓")} ${s.key} ${DIM(`(${s.group})`)}`);
    }
    console.log();
  }

  // ── Faltantes requeridos ────────────────────────────────────────────────────
  if (missing_required.length) {
    console.log(BOLD(RED(`❌ Faltantes REQUERIDOS (${missing_required.length}):`)));
    console.log(RED("   El app NO va a funcionar sin estos.\n"));
    for (const s of missing_required) {
      console.log(`   ${RED("✗")} ${BOLD(s.key)}`);
      console.log(`     ${DIM(s.desc)}\n`);
    }
  }

  // ── Faltantes opcionales ────────────────────────────────────────────────────
  if (missing_optional.length) {
    console.log(BOLD(YELLOW(`⚠️  Opcionales no configurados (${missing_optional.length}):`)));
    console.log(YELLOW("   Algunas funcionalidades van a estar deshabilitadas.\n"));

    // Agrupar por group
    const byGroup = {};
    for (const s of missing_optional) {
      (byGroup[s.group] ??= []).push(s);
    }
    for (const [group, items] of Object.entries(byGroup)) {
      console.log(`   ${DIM("──")} ${BOLD(group)}`);
      for (const s of items) {
        console.log(`   ${YELLOW("○")} ${s.key}`);
        console.log(`     ${DIM(s.desc)}`);
      }
      console.log();
    }
  }

  // ── Resumen ─────────────────────────────────────────────────────────────────
  console.log("══════════════════════════════════════════");
  if (missing_required.length === 0) {
    console.log(GREEN(BOLD("🚀 Setup completo — podés correr: npm run dev")));
  } else {
    console.log(RED(BOLD(`🛑 Faltan ${missing_required.length} secrets requeridos.`)));
    console.log(DIM("   Agregálos en Replit → Tools → Secrets → + New Secret"));
  }

  if (missing_required.length > 0) {
    console.log(`\n${DIM("📖 Documentación completa: docs/ARCHITECTURE.md")}`);
    console.log(DIM("📋 Referencia de vars: .env.example"));
    process.exit(1);
  }

  console.log();
}

main();
