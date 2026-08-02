import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const ENV_EXAMPLE_PATH = path.join(ROOT_DIR, '.env.example');
const ENV_PATH = path.join(ROOT_DIR, '.env');

// Guides and documentation for each key
const KEY_GUIDES = {
  GEMINI_API_KEY: {
    description: 'Google AI Studio API Key (for content generation and chatbot integrations)',
    guide: 'https://aistudio.google.com/app/apikey',
    defaultValue: 'MY_GEMINI_API_KEY'
  },
  APP_URL: {
    description: 'The public or local URL where this application is hosted',
    guide: 'Local development: http://localhost:3000',
    defaultValue: 'http://localhost:3000'
  },
  SESSION_SECRET: {
    description: 'Secret session key to sign user cookies',
    guide: 'Any long random alphanumeric string',
    defaultValue: 'clientum-dev-fallback-secret-change-in-prod'
  },
  CRM_INTERNAL_TOKEN: {
    description: 'Internal security token for webhook and external integrations',
    guide: 'Secure random token',
    defaultValue: 'dev-crm-internal-token-secret'
  },
  SANTI_API_KEY: {
    description: 'API key for SDR AI agent service requests',
    guide: 'Secure random token for sales bots',
    defaultValue: 'santi-dev-api-key-secret'
  },
  DATABASE_URL: {
    description: 'PostgreSQL connection string',
    guide: 'postgresql://user:password@host:port/dbname',
    defaultValue: ''
  },
  NEON_DATABASE_URL: {
    description: 'Neon Serverless Postgres connection string',
    guide: 'Get it from your Neon Console (https://neon.tech)',
    defaultValue: ''
  },
  NEON_API_KEY: {
    description: 'Neon API key for serverless branch management',
    guide: 'https://console.neon.tech/app/settings/profile',
    defaultValue: ''
  },
  NEON_PROJECT_ID: {
    description: 'Neon Project ID identifier',
    guide: 'Found in your Neon project dashboard settings',
    defaultValue: ''
  },
  APIFY_API_TOKEN: {
    description: 'Apify API Token (required for Google Maps Scraping integration)',
    guide: 'https://console.apify.com/account/integrations',
    defaultValue: ''
  },
  GOOGLE_MAPS_PLATFORM_KEY: {
    description: 'Google Maps / Places Platform API Key',
    guide: 'https://console.cloud.google.com/google/maps-apis/credentials',
    defaultValue: ''
  },
  HUNTER_API_KEY: {
    description: 'Hunter.io API Key for email search and lead verification',
    guide: 'https://hunter.io/api_keys',
    defaultValue: ''
  },
  SMTP_USER: {
    description: 'SMTP or Gmail address to send transactional/marketing emails',
    guide: 'e.g. marketing@yourdomain.com or gmail user',
    defaultValue: ''
  },
  SMTP_PASS: {
    description: 'SMTP password or Google App Password',
    guide: 'https://myaccount.google.com/apppasswords',
    defaultValue: ''
  }
};

// Helper to check if a value is a placeholder or empty
function isPlaceholderOrEmpty(val, key) {
  if (!val) return true;
  const trimmed = val.trim();
  if (trimmed === '') return true;
  
  const lower = trimmed.toLowerCase();
  if (lower === `my_${key.toLowerCase()}`) return true;
  if (lower.includes('placeholder')) return true;
  if (lower.includes('your_api_key')) return true;
  
  return false;
}

// Simple env file parser
function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const env = {};
    const lines = content.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        // Remove surrounding quotes if any
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        env[key] = value;
      }
    }
    return env;
  } catch (error) {
    console.warn(`[setup-env] Warning: Could not parse ${filePath}:`, error.message);
    return {};
  }
}

async function main() {
  console.log('\n==================================================');
  console.log('   Clientum CRM - Smart Environment Setup');
  console.log('==================================================\n');

  if (!fs.existsSync(ENV_EXAMPLE_PATH)) {
    console.error(`❌ Error: .env.example file not found at: ${ENV_EXAMPLE_PATH}`);
    process.exit(1);
  }

  const exampleEnv = parseEnvFile(ENV_EXAMPLE_PATH);
  const existingEnv = parseEnvFile(ENV_PATH);

  const isInteractive = Boolean(process.stdin.isTTY) && !process.env.CI;
  const rl = isInteractive
    ? readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })
    : null;

  const askQuestion = (query) => {
    return new Promise((resolve) => {
      if (!rl) return resolve('');
      rl.question(query, (answer) => resolve(answer.trim()));
    });
  };

  const finalEnv = {};
  const missingKeys = [];

  for (const key of Object.keys(exampleEnv)) {
    // 1. Try to find existing valid key in:
    //    - Existing .env file
    //    - System environment (process.env)
    //    - Example file (.env.example)
    const envVal = existingEnv[key];
    const sysVal = process.env[key];
    const exampleVal = exampleEnv[key];

    let chosenValue = '';
    let isFromSystem = false;

    if (envVal && !isPlaceholderOrEmpty(envVal, key)) {
      chosenValue = envVal;
    } else if (sysVal && !isPlaceholderOrEmpty(sysVal, key)) {
      chosenValue = sysVal;
      isFromSystem = true;
    } else if (exampleVal && !isPlaceholderOrEmpty(exampleVal, key)) {
      chosenValue = exampleVal;
    }

    const guideInfo = KEY_GUIDES[key] || { description: 'Custom configuration variable', guide: '', defaultValue: '' };

    if (chosenValue) {
      finalEnv[key] = chosenValue;
      if (isFromSystem) {
        console.log(`✨ ${key}: Loaded active credential from system environment.`);
      } else {
        console.log(`✓ ${key}: Loaded value.`);
      }
    } else {
      // Missing or holds a placeholder
      const fallbackDefault = guideInfo.defaultValue || exampleVal || '';
      
      if (isInteractive) {
        console.log(`\n🔑 Key Needed: ${key}`);
        console.log(`   Description: ${guideInfo.description}`);
        if (guideInfo.guide) {
          console.log(`   Acquisition Guide: ${guideInfo.guide}`);
        }
        
        const userInput = await askQuestion(`   Enter value (Press enter for default "${fallbackDefault}"): `);
        finalEnv[key] = userInput || fallbackDefault;
      } else {
        // Non-interactive fallback
        finalEnv[key] = fallbackDefault;
        if (fallbackDefault) {
          console.log(`⚠️  ${key}: No active key found. Using default placeholder: "${fallbackDefault}"`);
        } else {
          console.log(`⚠️  ${key}: Missing. Initialized as empty.`);
        }
        missingKeys.push(key);
      }
    }
  }

  if (rl) rl.close();

  // Write out the .env file with nice headers and comments
  let envContent = `# Clientum CRM Environment Variables\n# Generated automatically by scripts/setup-env.js on ${new Date().toISOString()}\n\n`;

  for (const [key, value] of Object.entries(finalEnv)) {
    const info = KEY_GUIDES[key];
    if (info) {
      envContent += `# ${info.description}\n`;
      if (info.guide) {
        envContent += `# Guide: ${info.guide}\n`;
      }
    }
    envContent += `${key}="${value}"\n\n`;
  }

  try {
    fs.writeFileSync(ENV_PATH, envContent, 'utf-8');
    console.log('\n==================================================');
    console.log('✅ .env file successfully created and updated!');
    console.log('==================================================\n');
  } catch (err) {
    console.error('❌ Failed to write .env file:', err.message);
    process.exit(1);
  }

  if (missingKeys.length > 0) {
    console.log('📋 Helpful Tips for Acquiring Missing Credentials:');
    console.log('--------------------------------------------------');
    for (const key of missingKeys) {
      const info = KEY_GUIDES[key];
      if (info && info.guide) {
        console.log(` • ${key.padEnd(25)} -> Get at: ${info.guide}`);
      }
    }
    console.log('\nYou can easily fill these in anytime by editing the ".env" file directly.\n');
  }
}

main().catch((err) => {
  console.error('❌ An error occurred during environment setup:', err);
  process.exit(1);
});
