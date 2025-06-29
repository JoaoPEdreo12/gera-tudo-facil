import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, userId, data } = await req.json()
    
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    let prompt = ''
    let systemPrompt = 'Você é um assistente de IA especializado em otimização de estudos. Responda sempre em português brasileiro de forma clara e motivadora.'

    switch (action) {
      case 'generate_schedule':
        systemPrompt = `Você é um especialista em planejamento de estudos. Crie cronogramas personalizados baseados nos dados do aluno. 
        Responda APENAS com um JSON válido no formato:
        {
          "schedule": [
            {
              "date": "2025-01-01",
              "time": "09:00",
              "duration": 60,
              "subject": "Matemática",
              "type": "study",
              "priority": 2,
              "description": "Revisão de funções quadráticas"
            }
          ],
          "recommendations": ["Recomendação 1", "Recomendação 2"],
          "analysis": {
            "totalHours": 10,
            "subjectDistribution": {"Matemática": 4, "História": 3},
            "suggestions": ["Sugestão 1", "Sugestão 2"]
          }
        }`
        
        prompt = `Com base nos dados do aluno:
        - Matérias: ${JSON.stringify(data.subjects)}
        - Horas disponíveis por dia: ${data.availableHoursPerDay}
        - Objetivos: ${data.studyGoals}
        - Preferências: ${JSON.stringify(data.preferences)}
        
        Crie um cronograma de estudos para os próximos 7 dias, distribuindo equilibradamente as matérias e respeitando as prioridades.`
        break

      case 'generate_feedback':
        systemPrompt = `Você é um mentor de estudos motivacional. Analise o progresso do aluno e forneça feedback personalizado.
        Responda APENAS com um JSON válido no formato:
        {
          "motivationalMessage": "Mensagem motivacional personalizada",
          "streakInfo": {
            "current": 5,
            "message": "Você está numa sequência incrível!"
          },
          "performanceAnalysis": {
            "strongSubjects": ["Matemática", "Física"],
            "needsAttention": ["História"],
            "recommendations": ["Dedique mais tempo à História", "Continue o ótimo trabalho em Matemática"]
          },
          "nextSteps": ["Próximo passo 1", "Próximo passo 2"]
        }`
        
        prompt = `Analise o progresso do aluno:
        - Dados de progresso: ${JSON.stringify(data)}
        
        Forneça feedback motivacional e orientações específicas baseadas no desempenho.`
        break

      case 'generate_report':
        systemPrompt = `Você é um analista de desempenho acadêmico. Gere relatórios detalhados sobre o progresso dos estudos.
        Responda APENAS com um JSON válido no formato:
        {
          "summary": {
            "totalStudyTime": 120,
            "completionRate": 85,
            "consistencyScore": 78
          },
          "subjectAnalysis": [
            {
              "subject": "Matemática",
              "timeSpent": 40,
              "completionRate": 90,
              "trend": "improving"
            }
          ],
          "insights": ["Insight 1", "Insight 2"],
          "recommendations": ["Recomendação 1", "Recomendação 2"]
        }`
        
        prompt = `Gere um relatório de desempenho para o período: ${data.period}
        Analise consistência, distribuição de tempo por matéria e tendências de progresso.`
        break

      case 'replan_schedule':
        systemPrompt = `Você é um especialista em replanejamento de cronogramas de estudo.
        Responda APENAS com um JSON válido no mesmo formato do generate_schedule.`
        
        prompt = `Replaneje o cronograma considerando os ajustes:
        - Ajustes solicitados: ${JSON.stringify(data)}
        
        Mantenha o equilíbrio mas adapte às necessidades específicas.`
        break

      case 'generate_flashcards':
        systemPrompt = `Você é um especialista em criação de flashcards educativos.
        Responda APENAS com um JSON válido no formato:
        {
          "flashcards": [
            {
              "question": "Pergunta do flashcard",
              "answer": "Resposta detalhada",
              "difficulty": 2,
              "tags": ["tag1", "tag2"]
            }
          ]
        }`
        
        prompt = `Crie flashcards para:
        - Matéria: ${data.subject}
        - Conteúdo: ${data.content}
        
        Gere 5-10 flashcards com perguntas progressivas do básico ao avançado.`
        break

      case 'explain_concept':
        systemPrompt = `Você é um professor especialista que explica conceitos de forma didática.
        Responda APENAS com um JSON válido no formato:
        {
          "explanation": "Explicação detalhada do conceito",
          "examples": ["Exemplo 1", "Exemplo 2"],
          "keyPoints": ["Ponto importante 1", "Ponto importante 2"],
          "relatedTopics": ["Tópico relacionado 1", "Tópico relacionado 2"],
          "practiceQuestions": ["Pergunta 1", "Pergunta 2"]
        }`
        
        prompt = `Explique o conceito:
        - Matéria: ${data.subject}
        - Tópico: ${data.topic}
        - Nível: ${data.level}
        
        Adapte a explicação ao nível solicitado e inclua exemplos práticos.`
        break

      default:
        throw new Error('Ação não reconhecida')
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const aiResponse = await response.json()
    const aiContent = aiResponse.choices[0].message.content

    // Parse do JSON retornado pela IA
    let result
    try {
      result = JSON.parse(aiContent)
    } catch (e) {
      // Se não for JSON válido, retorna uma resposta de erro estruturada
      result = { 
        error: 'Resposta inválida da IA',
        raw_response: aiContent 
      }
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in ai-study-helper:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erro interno do servidor',
        details: error.toString()
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})