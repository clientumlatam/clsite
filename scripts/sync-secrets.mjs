#!/usr/bin/env node
/**
 * sync-secrets.mjs
 * Sincroniza todos los secrets de Replit → Vercel env vars + GitHub Actions secrets.
 *
 * Uso:
 *   node scripts/sync-secrets.mjs
 *   node scripts/sync-secrets.mjs --dry-run   (solo muestra qué haría, sin escribir)
 *
 * Requiere que estén configurados en Replit:
 *   VERCEL_TOKEN, GITHUB_PERSONAL_ACCESS_TOKEN
 */

const DRY_RUN = process.argv.includes("--dry-run");

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const VERCEL_PROJECT_ID = "prj_0uY6sP1BovUpUs0SMT2UEdQaI4AY"; // clientumlatam
const GITHUB_REPO = "clientumlatam/clientumlatam";
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const GH_TOKEN = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;

// Secrets a sincronizar (nombre en Replit → nombre que tendrán en Vercel/GitHub)
// El nombre de la izquierda es el env var de Replit; el de la derecha es el key destino.
// Si son iguales, ponés el mismo nombre en ambos lados.
const SYNC_MAP = {
  APIFY_API_TOKEN:           "APIFY_API_TOKEN",
  APP_URL:                   "APP_URL",
  CRM_INTERNAL_TOKEN:        "CRM_INTERNAL_TOKEN",
  GEMINI_API_KEY:            "GEMINI_API_KEY",
  GOOGLE_API_KEY:            "GOOGLE_API_KEY",
  GOOGLE_MAPS_PLATFORM_KEY:  "GOOGLE_MAPS_PLATFORM_KEY",
  GROQ_API_KEY:              "GROQ_API_KEY",
  HUNTER_API_KEY:            "HUNTER_API_KEY",
  JWKS_URL:                  "JWKS_URL",
  NEON_API_KEY:              "NEON_API_KEY",
  NEON_DATABASE_URL:         "NEON_DATABASE_URL",
  NEON_PROJECT_ID:           "NEON_PROJECT_ID",
  OPENROUTER_API_KEY:        "OPENROUTER_API_KEY",
  SANTI_API_KEY:             "SANTI_API_KEY",
  SESSION_SECRET:            "SESSION_SECRET",
  SMTP_PASS:                 "SMTP_PASS",
  SMTP_USER:                 "SMTP_USER",
  VITE_NEON_AUTH_URL:        "VITE_NEON_AUTH_URL",
};

// Extras para Vercel: NEON_DATABASE_URL es el DATABASE_URL real en producción.
// (Replit tiene su propio DATABASE_URL interno que no funciona en Vercel.)
const VERCEL_ONLY_EXTRAS = {
  DATABASE_URL: process.env.NEON_DATABASE_URL,
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function log(emoji, msg) { console.log(`${emoji}  ${msg}`); }
function ok(msg)  { log("✅", msg); }
function err(msg) { log("❌", msg); }
function info(msg){ log("ℹ️ ", msg); }
function dry(msg) { log("🔍", `[DRY-RUN] ${msg}`); }

async function vercelFetch(path, opts = {}) {
  const res = await fetch(`https://api.vercel.com${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      "Content-Type": "application/json",
      ...(opts.headers ?? {}),
    },
  });
  const text = await res.text();
  return { ok: res.ok, status: res.status, body: text ? JSON.parse(text) : {} };
}

async function ghFetch(path, opts = {}) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...opts,
    headers: {
      Authorization: `token ${GH_TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      ...(opts.headers ?? {}),
    },
  });
  const text = await res.text();
  return { ok: res.ok, status: res.status, body: text ? JSON.parse(text) : {} };
}

// Sodium encryption for GitHub secrets (uses Node built-in crypto via SubtleCrypto workaround)
// GitHub requires libsodium crypto_box_seal — we use their recommended base64+fetch approach.
async function encryptForGitHub(publicKeyB64, secretValue) {
  // Dynamic import of tweetsodium if available, otherwise use a pure-JS fallback
  try {
    const sodium = await import("tweetsodium").catch(() => null);
    if (sodium) {
      const key = Buffer.from(publicKeyB64, "base64");
      const value = Buffer.from(secretValue);
      const encrypted = sodium.default.seal(value, key);
      return Buffer.from(encrypted).toString("base64");
    }
  } catch {}

  // Fallback: use gh CLI (already installed in Replit)
  return null; // signals to use gh CLI instead
}

// ─── VERCEL SYNC ─────────────────────────────────────────────────────────────

async function syncVercel(secrets) {
  if (!VERCEL_TOKEN) { err("VERCEL_TOKEN no está configurado"); return; }
  info("Sincronizando con Vercel...");

  // Obtener env vars existentes
  const { ok: listOk, body: listBody } = await vercelFetch(
    `/v9/projects/${VERCEL_PROJECT_ID}/env?decrypt=false`
  );
  if (!listOk) { err(`No se pudo listar env vars de Vercel: ${JSON.stringify(listBody)}`); return; }

  const existing = {};
  for (const e of listBody.envs ?? []) existing[e.key] = e.id;

  let created = 0, updated = 0, skipped = 0;

  for (const [key, value] of Object.entries(secrets)) {
    if (!value) { info(`Omitiendo ${key} (vacío en Replit)`); skipped++; continue; }

    if (DRY_RUN) { dry(`Vercel: ${key} = ***`); continue; }

    if (existing[key]) {
      // PATCH without 'type' so we don't conflict with 'sensitive' vars
      const { ok: pOk, body: pBody } = await vercelFetch(
        `/v9/projects/${VERCEL_PROJECT_ID}/env/${existing[key]}`,
        { method: "PATCH", body: JSON.stringify({ value, target: ["production", "preview", "development"] }) }
      );
      if (pOk) {
        updated++;
      } else if (pBody?.error?.code === "BAD_REQUEST") {
        // 'sensitive' vars can't be updated — delete + re-create
        await vercelFetch(`/v9/projects/${VERCEL_PROJECT_ID}/env/${existing[key]}`, { method: "DELETE" });
        const { ok: cOk2, body: cBody2 } = await vercelFetch(
          `/v9/projects/${VERCEL_PROJECT_ID}/env`,
          { method: "POST", body: JSON.stringify({ key, value, type: "encrypted", target: ["production", "preview", "development"] }) }
        );
        cOk2 ? updated++ : err(`Error recreando ${key} en Vercel: ${JSON.stringify(cBody2)}`);
      } else {
        err(`Error actualizando ${key} en Vercel: ${JSON.stringify(pBody)}`);
      }
    } else {
      // Create new
      const { ok: cOk, body: cBody } = await vercelFetch(
        `/v9/projects/${VERCEL_PROJECT_ID}/env`,
        { method: "POST", body: JSON.stringify({ key, value, type: "encrypted", target: ["production", "preview", "development"] }) }
      );
      cOk ? created++ : err(`Error creando ${key} en Vercel: ${JSON.stringify(cBody)}`);
    }
  }

  if (!DRY_RUN) ok(`Vercel: ${created} creadas, ${updated} actualizadas, ${skipped} omitidas`);
}

// ─── GITHUB SYNC ─────────────────────────────────────────────────────────────

async function syncGitHub(secrets) {
  if (!GH_TOKEN) { err("GITHUB_PERSONAL_ACCESS_TOKEN no está configurado"); return; }
  info("Sincronizando con GitHub Actions secrets...");

  // Obtener clave pública del repo para encriptar secrets
  const { ok: keyOk, body: keyBody } = await ghFetch(
    `/repos/${GITHUB_REPO}/actions/secrets/public-key`
  );
  if (!keyOk) { err(`No se pudo obtener public key de GitHub: ${JSON.stringify(keyBody)}`); return; }

  const { key: publicKey, key_id } = keyBody;

  let synced = 0, skipped = 0;

  for (const [key, value] of Object.entries(secrets)) {
    if (!value) { info(`Omitiendo ${key} (vacío en Replit)`); skipped++; continue; }
    if (DRY_RUN) { dry(`GitHub: ${key} = ***`); continue; }

    const encrypted = await encryptForGitHub(publicKey, value);

    if (encrypted) {
      // Use API directly with sodium encryption
      const { ok: sOk } = await ghFetch(
        `/repos/${GITHUB_REPO}/actions/secrets/${key}`,
        { method: "PUT", body: JSON.stringify({ encrypted_value: encrypted, key_id }) }
      );
      sOk ? synced++ : err(`Error seteando ${key} en GitHub`);
    } else {
      // Fallback: gh CLI
      const { execSync } = await import("child_process");
      try {
        execSync(
          `echo "${value.replace(/"/g, '\\"')}" | gh secret set ${key} --repo ${GITHUB_REPO}`,
          { env: { ...process.env, GH_TOKEN }, stdio: "pipe" }
        );
        synced++;
      } catch (e) {
        err(`Error seteando ${key} en GitHub: ${e.message}`);
      }
    }
  }

  if (!DRY_RUN) ok(`GitHub: ${synced} secrets sincronizados, ${skipped} omitidos`);
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n🔄 Clientum Secret Sync");
  console.log("══════════════════════════════════");
  if (DRY_RUN) console.log("⚠️  Modo DRY-RUN — no se escribirá nada\n");

  // Construir el mapa de secrets desde env vars actuales
  const secrets = {};
  for (const [replitKey, destKey] of Object.entries(SYNC_MAP)) {
    const val = process.env[replitKey];
    if (val) secrets[destKey] = val;
  }

  // Secrets exclusivos de Vercel (ej: DATABASE_URL → NEON_DATABASE_URL)
  const vercelSecrets = { ...secrets, ...VERCEL_ONLY_EXTRAS };
  // GitHub usa los mismos secrets base (no necesita DATABASE_URL remapeado)
  const githubSecrets = { ...secrets };

  await syncVercel(vercelSecrets);
  console.log();
  await syncGitHub(githubSecrets);

  console.log("\n══════════════════════════════════");
  console.log("✨ Sincronización completa");
  if (!DRY_RUN) {
    console.log("\n💡 Próximos pasos:");
    console.log("   • En Vercel: redesplegá el proyecto para que tome los nuevos env vars");
    console.log("   • Cada vez que agregues un secret nuevo en Replit, volvé a correr este script");
    console.log("   • Para ver qué haría sin escribir nada: node scripts/sync-secrets.mjs --dry-run");
  }
}

main().catch(err => { console.error("Error fatal:", err); process.exit(1); });
