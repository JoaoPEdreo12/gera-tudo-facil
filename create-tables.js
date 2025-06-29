import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Por favor, configure SUPABASE_URL e SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  console.log('Criando tabelas no banco de dados...');
  
  const tables = [
    {
      name: 'profiles',
      sql: `
        CREATE TABLE IF NOT EXISTS profiles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL,
          full_name TEXT,
          email TEXT,
          avatar_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'subjects',
      sql: `
        CREATE TABLE IF NOT EXISTS subjects (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          color TEXT NOT NULL,
          priority INTEGER NOT NULL DEFAULT 1,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'study_sessions',
      sql: `
        CREATE TABLE IF NOT EXISTS study_sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL,
          subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
          topic_id UUID,
          title TEXT NOT NULL,
          description TEXT,
          scheduled_date DATE NOT NULL,
          scheduled_time TIME,
          duration_minutes INTEGER NOT NULL,
          status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')) DEFAULT 'pending',
          priority INTEGER NOT NULL DEFAULT 1,
          type TEXT CHECK (type IN ('study', 'review', 'exercise', 'exam')) NOT NULL,
          completed_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'flashcards',
      sql: `
        CREATE TABLE IF NOT EXISTS flashcards (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL,
          subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
          topic_id UUID,
          question TEXT NOT NULL,
          answer TEXT NOT NULL,
          difficulty INTEGER NOT NULL DEFAULT 1,
          next_review_date TIMESTAMP WITH TIME ZONE NOT NULL,
          review_count INTEGER DEFAULT 0,
          correct_count INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'user_progress',
      sql: `
        CREATE TABLE IF NOT EXISTS user_progress (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL UNIQUE,
          total_points INTEGER DEFAULT 0,
          level INTEGER DEFAULT 1,
          streak_days INTEGER DEFAULT 0,
          last_study_date DATE,
          total_study_time_minutes INTEGER DEFAULT 0,
          completed_sessions INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    }
  ];

  // Execute SQL using RPC function (if available) or direct API
  for (const table of tables) {
    try {
      console.log(`Criando tabela ${table.name}...`);
      
      // Try using RPC first
      const { error: rpcError } = await supabase.rpc('exec', { sql: table.sql });
      
      if (rpcError) {
        console.log(`RPC não disponível para ${table.name}, tentando verificar existência...`);
        
        // Test if table exists by querying it
        const { data, error: queryError } = await supabase
          .from(table.name)
          .select('*')
          .limit(1);
          
        if (queryError && queryError.code === 'PGRST116') {
          console.log(`❌ Tabela ${table.name} não existe. Execute o SQL manualmente no Supabase.`);
        } else if (queryError) {
          console.log(`❌ Erro ao verificar tabela ${table.name}:`, queryError.message);
        } else {
          console.log(`✅ Tabela ${table.name} já existe e está acessível`);
        }
      } else {
        console.log(`✅ Tabela ${table.name} criada com sucesso`);
      }
      
    } catch (error) {
      console.log(`❌ Erro ao criar tabela ${table.name}:`, error.message);
    }
  }
  
  console.log('\n📋 Processo de criação de tabelas concluído.');
  console.log('Se algumas tabelas não foram criadas, execute o SQL do arquivo setup-database.sql manualmente no Supabase SQL Editor.');
}

createTables();