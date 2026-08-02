#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const ENV_EXAMPLE_PATH = path.resolve(process.cwd(), '.env.example');
const ENV_PATH = path.resolve(process.cwd(), '.env');

// Environment variable definitions and sensible defaults/dummy values
const DEFAULT_VARS = {
  GEMINI_API_KEY: 'MY_GEMINI_API_KEY',
  APP_URL: process.env.APP_URL || 'http://localhost:3000',
  SESSION_SECRET: () => `dev_session_${crypto.randomBytes(16).toString('hex')}`,
  CRM_INTERNAL_TOKEN: () => `dev_crm_${crypto.randomBytes(16).toString('hex')}`,
  SANTI_API_KEY: () => `dev_santi_${crypto.randomBytes(16).toString('hex')}`,
  DATABASE_URL: '',
  NEON_DATABASE_URL: '',
  NEON_API_KEY: '',
  NEON_PROJECT_ID: '',
  APIFY_API_TOKEN: '',
  GOOGLE_MAPS_PLATFORM_KEY: '',
  HUNTER_API_KEY: '',
  SMTP_USER: '',
  SMTP_PASS: '',
};

function parseEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
  }
  return env;
}

function generateEnv() {
  console.log('🛠️  Generating / verifying .env configuration...');

  const existingEnv = parseEnv(ENV_PATH);
  const updatedEnv = { ...existingEnv };
  let newVarsCount = 0;

  for (const [key, defaultValueOrFn] of Object.entries(DEFAULT_VARS)) {
    if (updatedEnv[key] === undefined || updatedEnv[key] === null) {
      const val = typeof defaultValueOrFn === 'function' ? defaultValueOrFn() : defaultValueOrFn;
      updatedEnv[key] = val;
      newVarsCount++;
      console.log(`  + Auto-populated ${key}="${val}"`);
    }
  }

  // Format content for .env
  let envContent = `# Auto-generated .env file\n# Updated: ${new Date().toISOString()}\n\n`;
  for (const [key, val] of Object.entries(updatedEnv)) {
    envContent += `${key}="${val}"\n`;
  }

  fs.writeFileSync(ENV_PATH, envContent, 'utf8');
  console.log(`✅ .env is ready (${newVarsCount} missing variables populated).`);
}

generateEnv();
