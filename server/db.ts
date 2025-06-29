import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@shared/schema';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error(
    "SUPABASE_URL and SUPABASE_ANON_KEY must be set. Check your environment variables.",
  );
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// For direct SQL operations with Drizzle (if DATABASE_URL is available)
let db: any = null;

if (process.env.DATABASE_URL) {
  try {
    const client = postgres(process.env.DATABASE_URL, {
      ssl: 'require',
      max: 1,
    });
    db = drizzle(client, { schema });
  } catch (error) {
    console.warn('Direct database connection failed, using Supabase client only');
  }
}

export { db };
