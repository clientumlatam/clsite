#!/usr/bin/env node
/**
 * scripts/doctor.mjs — Clientum Health Check
 * Verifica el estado de cada servicio/integración y reporta latencia.
 *
 * Uso:
 *   node scripts/doctor.mjs
 *   npm run doctor
 */

import { existsSync, readFileSync } from "fs";

// Colores
const G = (s) => `\x1b[32m${s}\x1b[0m`;   // verde
const R = (s) => `\x1b[31m${s}\x1b[0m`;   // rojo
const Y = (s) => `\x1b[33m${s}\x1b[0m`;   // amarillo
const B = (s) => `\x1b[1m${s}\x1b[0m`;    // bold
const D = (s) => `\x1b[2m${s}\x1b[0m`;    // dim

// Cargar .env.local si existe
try {
  if (existsSync(".env.local")) {
    const lines = readFileSync(".env.local", "utf8").split("\n");
    for (const line of lines) {
      const m = line.match(/^([^#=]+)=(.+)$/);
      if (m && !process.env[m[1].trim()]) {
        process.env[m[1].trim()] = m[2].trim();
      }
    }
  }
} catch {}

function pad(s, n) { return String(s).padEnd(n); }

async function checkDb() {
  const { Pool } = await import("pg");
  const url = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || "";
  if (!url || url.startsWith("eyJ")) return { status: "fail", message: "No configurado" };
  const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });
  const t0 = Date.now();
  try {
    await pool.query("SELECT 1");
    const ms = Date.now() - t0;
    await pool.end();
    return { status: "ok", message: `Neon — ${ms}ms`, latency: ms };
  } catch (e) {
    await pool.end().catch(() => {});
    return { status: "fail", message: e.message?.slice(0, 60) };
  }
}

async function checkGemini() {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!key || key.startsWith("eyJ")) return { status: "fail", message: "No configurado" };
  const t0 = Date.now();
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`,
      { signal: AbortSignal.timeout(8000) }
    );
    const ms = Date.now() - t0;
    if (!res.ok) return { status: "fail", message: `HTTP ${res.status}` };
    return { status: "ok", message: `gemini-1.5-flash — ${ms}ms`, latency: ms };
  } catch (e) {
    return { status: "fail", message: e.message?.slice(0, 60) };
  }
}

async function checkGroq() {
  const key = process.env.GROQ_API_KEY;
  if (!key || key.startsWith("eyJ")) return { status: "warn", message: "No configurado (fallback disponible)" };
  const t0 = Date.now();
  try {
    const res = await fetch("https://api.groq.com/openai/v1/models", {
      headers: { Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(8000),
    });
    const ms = Date.now() - t0;
    if (!res.ok) return { status: "fail", message: `HTTP ${res.status}` };
    return { status: "ok", message: `Groq API — ${ms}ms`, latency: ms };
  } catch (e) {
    return { status: "fail", message: e.message?.slice(0, 60) };
  }
}

async function checkOpenRouter() {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key || key.startsWith("eyJ")) return { status: "warn", message: "No configurado (fallback disponible)" };
  const t0 = Date.now();
  try {
    const res = await fetch("https://openrouter.ai/api/v1/models", {
      headers: { Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(8000),
    });
    const ms = Date.now() - t0;
    if (!res.ok) return { status: "fail", message: `HTTP ${res.status}` };
    return { status: "ok", message: `OpenRouter API — ${ms}ms`, latency: ms };
  } catch (e) {
    return { status: "fail", message: e.message?.slice(0, 60) };
  }
}

async function checkApify() {
  const token = process.env.APIFY_API_TOKEN;
  if (!token || token.startsWith("eyJ")) return { status: "warn", message: "No configurado" };
  const t0 = Date.now();
  try {
    const res = await fetch("https://api.apify.com/v2/users/me", {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(8000),
    });
    const ms = Date.now() - t0;
    if (!res.ok) return { status: "fail", message: `HTTP ${res.status}` };
    const data = await res.json();
    return { status: "ok", message: `${data.data?.username || "usuario"} — ${ms}ms`, latency: ms };
  } catch (e) {
    return { status: "fail", message: e.message?.slice(0, 60) };
  }
}

async function checkGoogleMaps() {
  const key = process.env.GOOGLE_MAPS_PLATFORM_KEY;
  if (!key || key.startsWith("eyJ")) return { status: "warn", message: "No configurado" };
  const t0 = Date.now();
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=Roca,Argentina&key=${key}`,
      { signal: AbortSignal.timeout(8000) }
    );
    const ms = Date.now() - t0;
    const data = await res.json();
    if (data.status === "REQUEST_DENIED") return { status: "fail", message: "Key inválida o sin permisos" };
    return { status: "ok", message: `Maps Geocoding OK — ${ms}ms`, latency: ms };
  } catch (e) {
    return { status: "fail", message: e.message?.slice(0, 60) };
  }
}

async function checkHunter() {
  const key = process.env.HUNTER_API_KEY;
  if (!key || key.startsWith("eyJ")) return { status: "warn", message: "No configurado" };
  const t0 = Date.now();
  try {
    const res = await fetch(`https://api.hunter.io/v2/account?api_key=${key}`, {
      signal: AbortSignal.timeout(8000),
    });
    const ms = Date.now() - t0;
    if (!res.ok) return { status: "fail", message: `HTTP ${res.status}` };
    const data = await res.json();
    const plan = data.data?.plan_name || "?";
    const searches = data.data?.requests?.searches?.used ?? "?";
    return { status: "ok", message: `${plan} — ${searches} búsquedas usadas — ${ms}ms`, latency: ms };
  } catch (e) {
    return { status: "fail", message: e.message?.slice(0, 60) };
  }
}

async function checkSmtp() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass || user.startsWith("eyJ")) return { status: "warn", message: "No configurado" };
  return { status: "ok", message: `${user} — sin verificar conexión SMTP (credenciales presentes)` };
}

async function checkSanti() {
  const key = process.env.SANTI_API_KEY;
  if (!key || key.startsWith("eyJ")) return { status: "warn", message: "No configurado" };
  const appUrl = process.env.APP_URL || process.env.REPLIT_DEV_DOMAIN || "http://localhost:5000";
  const baseUrl = appUrl.startsWith("http") ? appUrl : `https://${appUrl}`;
  const t0 = Date.now();
  try {
    const res = await fetch(`${baseUrl}/api/leads?limit=1`, {
      headers: { Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(8000),
    });
    const ms = Date.now() - t0;
    if (res.ok) return { status: "ok", message: `API Santi accesible — ${ms}ms`, latency: ms };
    return { status: "warn", message: `HTTP ${res.status} (servidor puede no estar corriendo)` };
  } catch {
    return { status: "warn", message: "No se pudo alcanzar el servidor local" };
  }
}

async function checkVercel() {
  const token = process.env.VERCEL_TOKEN;
  if (!token) return { status: "warn", message: "No configurado" };
  const t0 = Date.now();
  try {
    const res = await fetch("https://api.vercel.com/v2/user", {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(8000),
    });
    const ms = Date.now() - t0;
    if (!res.ok) return { status: "fail", message: `HTTP ${res.status}` };
    const data = await res.json();
    return { status: "ok", message: `${data.user?.name || data.user?.email || "usuario"} — ${ms}ms`, latency: ms };
  } catch (e) {
    return { status: "fail", message: e.message?.slice(0, 60) };
  }
}

async function checkGitHub() {
  const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
  if (!token) return { status: "warn", message: "No configurado (solo para scripts/sync)" };
  const t0 = Date.now();
  try {
    const res = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${token}`, "User-Agent": "clientum-doctor" },
      signal: AbortSignal.timeout(8000),
    });
    const ms = Date.now() - t0;
    if (!res.ok) return { status: "fail", message: `HTTP ${res.status}` };
    const data = await res.json();
    return { status: "ok", message: `${data.login} — ${ms}ms`, latency: ms };
  } catch (e) {
    return { status: "fail", message: e.message?.slice(0, 60) };
  }
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n${B("🩺 Clientum — Health Check")}`);
  console.log("══════════════════════════════════════════\n");

  const checks = [
    { key: "DATABASE",    label: "PostgreSQL (Neon)",        fn: checkDb },
    { key: "GEMINI",      label: "Google Gemini",            fn: checkGemini },
    { key: "GROQ",        label: "Groq LLM",                 fn: checkGroq },
    { key: "OPENROUTER",  label: "OpenRouter",               fn: checkOpenRouter },
    { key: "APIFY",       label: "Apify Scraping",           fn: checkApify },
    { key: "GOOGLE_MAPS", label: "Google Maps Platform",     fn: checkGoogleMaps },
    { key: "HUNTER",      label: "Hunter.io Enrichment",     fn: checkHunter },
    { key: "SMTP",        label: "Email SMTP",               fn: checkSmtp },
    { key: "SANTI_API",   label: "API Santi SDR",            fn: checkSanti },
    { key: "VERCEL",      label: "Vercel Deploy",            fn: checkVercel },
    { key: "GITHUB",      label: "GitHub PAT",               fn: checkGitHub },
  ];

  const results = [];
  for (const check of checks) {
    process.stdout.write(`  ${D("verificando")} ${check.label}...`);
    const result = await check.fn();
    results.push({ ...check, ...result });
    const icon = result.status === "ok" ? G("✅") : result.status === "warn" ? Y("⚠️ ") : R("❌");
    const label = check.key.padEnd(14);
    const msg = result.message || "";
    process.stdout.write(`\r  ${icon} ${B(label)}  ${msg}\n`);
  }

  console.log("\n══════════════════════════════════════════");
  const ok   = results.filter(r => r.status === "ok").length;
  const warn = results.filter(r => r.status === "warn").length;
  const fail = results.filter(r => r.status === "fail").length;

  if (fail === 0 && warn === 0) {
    console.log(G(`✅ Todo OK — ${ok}/${results.length} servicios operativos\n`));
  } else {
    console.log(`${G(`✅ OK: ${ok}`)}  ${Y(`⚠️  WARN: ${warn}`)}  ${R(`❌ FAIL: ${fail}`)}`);
    if (fail > 0) {
      console.log(R(`\nServicios con error:`));
      results.filter(r => r.status === "fail").forEach(r => {
        console.log(R(`  ✗ ${r.label}: ${r.message}`));
      });
    }
    console.log();
  }
}

main().catch(e => { console.error(R("Error fatal:"), e.message); process.exit(1); });
