import { createClient, SupabaseClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

let cachedClient: SupabaseClient | null = null;

export function getSupabaseCredentials() {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const envKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

  if (envUrl && envKey) {
    return { url: envUrl, key: envKey };
  }

  // Check if credentials were saved via Admin UI in data/backend-config.json
  const configPath = path.join(process.cwd(), 'data', 'backend-config.json');
  try {
    if (fs.existsSync(configPath)) {
      const saved = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      if (saved.supabaseUrl && saved.supabaseKey) {
        return { url: saved.supabaseUrl, key: saved.supabaseKey };
      }
    }
  } catch (err) {
    // Ignore error
  }

  return null;
}

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;

  const creds = getSupabaseCredentials();
  if (creds && creds.url && creds.key) {
    try {
      cachedClient = createClient(creds.url, creds.key, {
        auth: { persistSession: false },
      });
      return cachedClient;
    } catch (e) {
      console.error('Error initializing Supabase client:', e);
    }
  }

  return null;
}

export function resetSupabaseCache() {
  cachedClient = null;
}

