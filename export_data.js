import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function exportAllData() {
  try {
    console.log('Checking current database tables...');
    
    // Check if tables exist by trying to query them
    const tables = ['profiles', 'subjects', 'study_sessions', 'flashcards', 'user_progress'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ Table '${table}' not found or not accessible:`, error.message);
        } else {
          console.log(`✅ Table '${table}' exists and is accessible`);
          console.log(`   Records found: ${data?.length || 0}`);
        }
      } catch (err) {
        console.log(`❌ Error checking table '${table}':`, err.message);
      }
    }
    
    console.log('\n📋 Database status check complete.');
    console.log('\nIf tables are missing, please run the SQL from setup-database.sql in your Supabase SQL Editor.');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\nPlease check your SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
  }
}

exportAllData();