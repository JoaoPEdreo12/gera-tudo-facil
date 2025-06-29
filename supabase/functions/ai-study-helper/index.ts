import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, type = 'general' } = await req.json();

    let systemPrompt = '';
    
    switch (type) {
      case 'schedule':
        systemPrompt = 'Você é um assistente especializado em criar cronogramas de estudo otimizados. Ajude o usuário a organizar sua rotina de estudos de forma eficiente.';
        break;
      case 'flashcard':
        systemPrompt = 'Você é um especialista em criar flashcards educativos. Crie perguntas e respostas claras e objetivas para facilitar a memorização.';
        break;
      case 'explanation':
        systemPrompt = 'Você é um professor experiente. Explique conceitos de forma clara, didática e com exemplos práticos.';
        break;
      default:
        systemPrompt = 'Você é um assistente de estudos especializado em ajudar estudantes brasileiros que se preparam para o ENEM e vestibulares. Seja didático, motivador e forneça dicas práticas.';
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Erro na API do OpenAI');
    }

    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-study-helper function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});