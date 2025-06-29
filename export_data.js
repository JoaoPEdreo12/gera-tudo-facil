// Script para exportar dados do Supabase atual
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabase = createClient(
  'https://scewhpkvjoktzpxggbgw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjZXdocGt2am9rdHpweGdnYmd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExNjM1MjUsImV4cCI6MjA2NjczOTUyNX0.VsR7KTiKlbw7YImUVW4ylTbzdHxksKvlkJMVS8RR3tI'
)

async function exportAllData() {
  const tables = ['profiles', 'subjects', 'study_sessions', 'flashcards', 'user_progress']
  const exportData = {}
  
  console.log('🚀 Iniciando exportação dos dados...')
  
  for (const table of tables) {
    console.log(`📊 Exportando tabela: ${table}`)
    
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
      
      if (error) {
        console.error(`❌ Erro ao exportar ${table}:`, error)
        continue
      }
      
      exportData[table] = data
      console.log(`✅ ${table}: ${data.length} registros exportados`)
      
      // Salvar cada tabela em arquivo separado
      fs.writeFileSync(
        `backup_${table}.json`, 
        JSON.stringify(data, null, 2)
      )
      
    } catch (err) {
      console.error(`❌ Erro inesperado ao exportar ${table}:`, err)
    }
  }
  
  // Salvar backup completo
  fs.writeFileSync('backup_completo.json', JSON.stringify(exportData, null, 2))
  
  console.log('🎉 Exportação concluída!')
  console.log('📁 Arquivos criados:')
  console.log('  - backup_completo.json (todos os dados)')
  tables.forEach(table => {
    console.log(`  - backup_${table}.json`)
  })
  
  return exportData
}

// Executar exportação
exportAllData().catch(console.error)