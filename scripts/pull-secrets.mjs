#!/usr/bin/env node
/**
 * pull-secrets.mjs
 * Trae todos los secrets desde Vercel y los escribe en .env.local.
 * Ideal para después de hacer un Remix del Replit.
 *
 * Uso:
 *   node scripts/pull-secrets.mjs
 *
 * Requiere solo UN secret configurado en Replit:
 *   VERCEL_TOKEN  →  https://vercel.com/account/settings/tokens
 */

import { writeFileSync, readFileSync, existsSync } from "fs";
import { createInterface } from "readline";

const VERCEL_PROJECT_ID = "prj_0uY6sP1BovUpUs0SMT2UEdQaI4AY";
const ENV_FILE = ".env.local";

// Colores
const BOLD   = (s) => `\x1b[1m${s}\x1b[0m`;
const GREEN  = (s) => `\x1b[32m${s}\x1b[0m`;
const RED    = (s) => `\x1b[31m${s}\x1b[0m`;
const YELLOW = (s) => `\x1b[33m${s}\x1b[0m`;
const DIM    = (s) => `\x1b[2m${s}\x1b[0m`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function ask(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => { rl.close(); resolve(answer.trim()); });
  });
}

async function vercelFetch(path, token) {
  const res = await fetch(`https://api.vercel.com${path}`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  const text = await res.text();
  return { ok: res.ok, status: res.status, body: text ? JSON.parse(text) : {} };
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n${BOLD("📥 Clientum — Pull de Secrets desde Vercel")}`);
  console.log("══════════════════════════════════════════\n");

  // 1. Obtener VERCEL_TOKEN
  let token = process.env.VERCEL_TOKEN;
  if (!token) {
    console.log(YELLOW("⚠️  No encontré VERCEL_TOKEN en los secrets de Replit."));
    console.log(DIM("   Conseguí uno en: https://vercel.com/account/settings/tokens\n"));
    token = await ask("   Pegá tu VERCEL_TOKEN: ");
    if (!token) { console.log(RED("✗ Token vacío — abortando.")); process.exit(1); }
  } else {
    console.log(GREEN("✓") + "  VERCEL_TOKEN encontrado en Replit Secrets");
  }

  // 2. Obtener env vars de Vercel con valores decriptados
  console.log(DIM("\n   Conectando con Vercel..."));
  const { ok, body } = await vercelFetch(
    `/v9/projects/${VERCEL_PROJECT_ID}/env?decrypt=true`,
    token
  );

  if (!ok) {
    console.log(RED(`\n✗ Error al conectar con Vercel: ${body?.error?.message ?? JSON.stringify(body)}`));
    if (body?.error?.code === "forbidden") {
      console.log(YELLOW("  ¿El token tiene permisos de 'Read' en el proyecto?"));
    }
    process.exit(1);
  }

  const envs = body.envs ?? [];
  if (!envs.length) {
    console.log(YELLOW("⚠️  El proyecto en Vercel no tiene env vars configuradas."));
    process.exit(1);
  }

  // 3. Filtrar: solo production, solo los que tienen valor, deduplicar (último gana)
  const seen = new Map();
  for (const e of envs) {
    if (!e.value) continue;
    if (e.target && !e.target.includes("production")) continue;
    // Si hay duplicados (puede pasar con vars `sensitive` re-creadas), quedarse con el más reciente
    if (!seen.has(e.key) || (e.createdAt ?? 0) > (seen.get(e.key).createdAt ?? 0)) {
      seen.set(e.key, e);
    }
  }

  // 4. Vars que NO queremos en .env.local (específicas de la infra del dueño original)
  const SKIP = new Set([
    "VERCEL_TOKEN",             // cada cuenta tiene el suyo
    "GITHUB_PERSONAL_ACCESS_TOKEN", // PAT personal — no se comparte
    "REPLIT_DEPLOYMENT",        // lo inyecta Replit automáticamente
  ]);

  const toWrite = [...seen.values()].filter((e) => !SKIP.has(e.key));

  // 5. Advertencia si ya existe .env.local
  if (existsSync(ENV_FILE)) {
    console.log(YELLOW(`\n⚠️  Ya existe ${ENV_FILE} — se va a sobreescribir.`));
    const confirm = await ask("   ¿Continuar? [s/N] ");
    if (!confirm.toLowerCase().startsWith("s")) {
      console.log(DIM("   Cancelado.")); process.exit(0);
    }
  }

  // 6. Escribir .env.local
  const lines = [
    `# .env.local — generado automáticamente por scripts/pull-secrets.mjs`,
    `# NO commitear este archivo (ya está en .gitignore)`,
    `# Generado: ${new Date().toISOString()}`,
    ``,
  ];

  const sensitive = [];
  for (const e of toWrite) {
    if (e.value) {
      // Escapar saltos de línea y comillas dentro del valor
      const safeVal = e.value.includes("\n") ? JSON.stringify(e.value) : e.value;
      lines.push(`${e.key}=${safeVal}`);
    } else {
      // vars 'sensitive' devuelven value=null aunque decrypt=true — las registramos
      sensitive.push(e.key);
    }
  }

  writeFileSync(ENV_FILE, lines.join("\n") + "\n", "utf8");

  // 7. Resumen
  console.log(`\n${GREEN("✅")}  ${BOLD(`${toWrite.filter(e => e.value).length} secrets escritos en ${ENV_FILE}`)}`);

  if (sensitive.length) {
    console.log(`\n${YELLOW("⚠️  Estas vars son de tipo 'sensitive' en Vercel y no se pueden exportar:")}`);
    for (const k of sensitive) console.log(`   ${YELLOW("○")} ${k}`);
    console.log(DIM("   Tenés que setearlas manualmente en Replit → Tools → Secrets."));
  }

  console.log(`\n${DIM("══════════════════════════════════════════")}`);
  console.log(BOLD("🚀 Listo. Ahora corré:"));
  console.log(`   ${GREEN("npm run dev")}`);
  console.log();
  console.log(DIM(`   Cuando agregues el ${ENV_FILE} a Replit Secrets permanentemente, borrá el archivo:`));
  console.log(DIM(`   rm ${ENV_FILE}`));
  console.log();
}

main().catch((e) => { console.error(RED("Error fatal:"), e.message); process.exit(1); });
