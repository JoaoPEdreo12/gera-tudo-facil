# Guia de Configuração do Banco de Dados

## Configuração do Supabase

Para configurar o banco de dados corretamente, você precisa de 3 informações do seu projeto Supabase:

### 1. SUPABASE_URL
- Vá ao seu painel do Supabase
- Na página do projeto, copie a "Project URL"
- Formato: `https://[projeto-id].supabase.co`

### 2. SUPABASE_ANON_KEY  
- No mesmo painel, copie a "anon public" key
- Esta é uma chave longa que começa com "eyJ..."

### 3. DATABASE_URL (opcional)
- Vá em Settings → Database
- Copie a "Connection string" no formato URI
- Substitua `[YOUR-PASSWORD]` pela sua senha real
- Formato: `postgresql://postgres.[projeto-id]:sua-senha@aws-0-us-east-1.pooler.supabase.com:6543/postgres`

## Criação das Tabelas

Depois de configurar as variáveis de ambiente, execute o SQL do arquivo `setup-database.sql` no SQL Editor do Supabase:

1. Abra o Supabase Dashboard
2. Vá em "SQL Editor"
3. Cole o conteúdo de `setup-database.sql`
4. Execute o SQL

## Verificação

Execute `node export_data.js` para verificar se as tabelas foram criadas corretamente.