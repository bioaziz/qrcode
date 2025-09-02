#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const {Translate} = require('@google-cloud/translate').v2;

// Load environment variables from .env.local if present
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (match) {
      const [, key, value] = match;
      if (!process.env[key]) {
        process.env[key] = value.trim();
      }
    }
  }
}

const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
if (!apiKey) {
  console.error('Missing GOOGLE_TRANSLATE_API_KEY in environment or .env.local');
  process.exit(1);
}

const translateClient = new Translate({key: apiKey});

const localesDir = path.join(process.cwd(), 'public', 'locales');
const enDir = path.join(localesDir, 'en');
const frDir = path.join(localesDir, 'fr');

async function translateNode(enVal, frVal) {
  if (typeof enVal === 'string') {
    if (frVal === undefined) {
      const [translated] = await translateClient.translate(enVal, 'fr');
      return translated;
    }
    return frVal;
  }

  if (Array.isArray(enVal)) {
    const arr = frVal || [];
    for (let i = 0; i < enVal.length; i++) {
      arr[i] = await translateNode(enVal[i], arr[i]);
    }
    return arr;
  }

  if (enVal && typeof enVal === 'object') {
    const obj = frVal || {};
    for (const key of Object.keys(enVal)) {
      obj[key] = await translateNode(enVal[key], obj[key]);
    }
    return obj;
  }

  return enVal;
}

async function processFile(file) {
  const enPath = path.join(enDir, file);
  const frPath = path.join(frDir, file);

  const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  const frJson = fs.existsSync(frPath)
    ? JSON.parse(fs.readFileSync(frPath, 'utf8'))
    : {};

  const merged = await translateNode(enJson, frJson);

  fs.mkdirSync(frDir, {recursive: true});
  fs.writeFileSync(frPath, JSON.stringify(merged, null, 2) + '\n');
  console.log(`Updated ${frPath}`);
}

async function main() {
  if (!fs.existsSync(enDir)) {
    console.error(`English locale directory not found: ${enDir}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(enDir)
    .filter((f) => f.endsWith('.json'));

  for (const file of files) {
    await processFile(file);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
