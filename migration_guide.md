# Guia de Migração do Supabase

## 1. Exportar dados do projeto atual

### Opção A: Via SQL (Recomendado)
Execute essas queries no SQL Editor do projeto atual para exportar os dados:

```sql
-- Exportar estrutura das tabelas
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- Exportar dados da tabela profiles
COPY (SELECT * FROM profiles) TO STDOUT WITH CSV HEADER;

-- Exportar dados da tabela subjects
COPY (SELECT * FROM subjects) TO STDOUT WITH CSV HEADER;

-- Exportar dados da tabela study_sessions
COPY (SELECT * FROM study_sessions) TO STDOUT WITH CSV HEADER;

-- Exportar dados da tabela flashcards
COPY (SELECT * FROM flashcards) TO STDOUT WITH CSV HEADER;

-- Exportar dados da tabela user_progress
COPY (SELECT * FROM user_progress) TO STDOUT WITH CSV HEADER;
```

### Opção B: Via código (backup programático)
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://scewhpkvjoktzpxggbgw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjZXdocGt2am9rdHpweGdnYmd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExNjM1MjUsImV4cCI6MjA2NjczOTUyNX0.VsR7KTiKlbw7YImUVW4ylTbzdHxksKvlkJMVS8RR3tI'
)

async function exportData() {
  const tables = ['profiles', 'subjects', 'study_sessions', 'flashcards', 'user_progress']
  
  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
    
    if (!error) {
      console.log(`${table}:`, JSON.stringify(data, null, 2))
      // Salve cada resultado em um arquivo JSON
    }
  }
}

exportData()
```

## 2. Criar novo projeto Supabase

1. Acesse https://supabase.com
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Escolha um nome e senha para o banco
5. Aguarde a criação (2-3 minutos)

## 3. Recriar estrutura no novo projeto

Execute esse SQL no novo projeto para recriar as tabelas:

```sql
-- Criar tabela profiles
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela subjects
CREATE TABLE subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL,
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela study_sessions
CREATE TABLE study_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  subject_id UUID REFERENCES subjects(id),
  topic_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  duration_minutes INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
  priority INTEGER DEFAULT 1,
  type TEXT DEFAULT 'study' CHECK (type IN ('study', 'review', 'exercise', 'exam')),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela flashcards
CREATE TABLE flashcards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  subject_id UUID REFERENCES subjects(id),
  topic_id UUID,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  difficulty INTEGER DEFAULT 1,
  next_review_date DATE DEFAULT CURRENT_DATE,
  review_count INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela user_progress
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  total_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak_days INTEGER DEFAULT 0,
  last_study_date DATE,
  total_study_time_minutes INTEGER DEFAULT 0,
  completed_sessions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar policies de segurança (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Policies para profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies para subjects
CREATE POLICY "Users can view own subjects" ON subjects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subjects" ON subjects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subjects" ON subjects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own subjects" ON subjects FOR DELETE USING (auth.uid() = user_id);

-- Policies para study_sessions
CREATE POLICY "Users can view own sessions" ON study_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON study_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON study_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own sessions" ON study_sessions FOR DELETE USING (auth.uid() = user_id);

-- Policies para flashcards
CREATE POLICY "Users can view own flashcards" ON flashcards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own flashcards" ON flashcards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own flashcards" ON flashcards FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own flashcards" ON flashcards FOR DELETE USING (auth.uid() = user_id);

-- Policies para user_progress
CREATE POLICY "Users can view own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON user_progress FOR UPDATE USING (auth.uid() = user_id);
```

## 4. Importar dados

### Para cada tabela, use o formato:
```sql
INSERT INTO subjects (id, user_id, name, description, color, priority, created_at, updated_at)
VALUES 
  ('uuid1', 'user_uuid', 'Matemática', 'Descrição', '#3B82F6', 1, '2025-01-01', '2025-01-01'),
  ('uuid2', 'user_uuid', 'História', 'Descrição', '#EF4444', 2, '2025-01-01', '2025-01-01');
```

## 5. Atualizar credenciais no projeto

Substitua as variáveis de ambiente no seu projeto:
```env
VITE_SUPABASE_URL=https://SEU_NOVO_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_NOVA_CHAVE_AQUI
```

## 6. Configurar autenticação

No painel do Supabase, vá em:
- Authentication > Settings
- Configure os mesmos providers de login
- Ajuste as URLs de redirect se necessário

## Notas importantes:
- Os UUIDs precisam ser preservados para manter relacionamentos
- Certifique-se de que os user_ids correspondem aos usuários autenticados
- Teste todas as funcionalidades após a migração
- Mantenha um backup dos dados originais