
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAI = () => {
  const [loading, setLoading] = useState(false);

  const askAI = async (prompt: string, type: 'general' | 'schedule' | 'flashcard' | 'explanation' = 'general') => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-study-helper', {
        body: { prompt, type }
      });

      if (error) throw error;
      return { response: data.response, error: null };
    } catch (error) {
      console.error('AI Error:', error);
      return { response: null, error };
    } finally {
      setLoading(false);
    }
  };

  const generateStudyPlan = async (subjects: string[], availableTime: number, goals: string) => {
    const prompt = `Crie um plano de estudos personalizado com as seguintes informações:
    - Matérias: ${subjects.join(', ')}
    - Tempo disponível por dia: ${availableTime} horas
    - Objetivos: ${goals}
    
    Por favor, forneça um cronograma detalhado com distribuição de tempo e dicas de estudo.`;
    
    return askAI(prompt, 'schedule');
  };

  const explainConcept = async (concept: string, subject: string) => {
    const prompt = `Explique o conceito "${concept}" da matéria ${subject} de forma didática para um estudante de ensino médio. Use exemplos práticos e linguagem clara.`;
    
    return askAI(prompt, 'explanation');
  };

  const generateFlashcard = async (topic: string, subject: string) => {
    const prompt = `Crie uma pergunta e resposta para flashcard sobre o tópico "${topic}" da matéria ${subject}. Formate como:
    PERGUNTA: [sua pergunta]
    RESPOSTA: [sua resposta]`;
    
    return askAI(prompt, 'flashcard');
  };

  return {
    loading,
    askAI,
    generateStudyPlan,
    explainConcept,
    generateFlashcard
  };
};
