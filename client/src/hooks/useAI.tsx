import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAI = () => {
  const [loading, setLoading] = useState(false);

  const askAI = async (prompt: string, type: string = 'general') => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-study-helper', {
        body: { prompt, type }
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error('AI Error:', error);
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const generateStudyPlan = async (subjects: string[], hoursPerWeek: number, goal: string) => {
    const prompt = `Crie um plano de estudos personalizado:
- Matérias: ${subjects.join(', ')}
- Horas disponíveis por semana: ${hoursPerWeek}
- Objetivo: ${goal}

Por favor, forneça um cronograma detalhado com distribuição de tempo e estratégias de estudo.`;
    
    return askAI(prompt, 'schedule');
  };

  return {
    askAI,
    generateStudyPlan,
    loading,
  };
};