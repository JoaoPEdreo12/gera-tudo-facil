import { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';

export const useAI = () => {
  const [loading, setLoading] = useState(false);

  const askAI = async (prompt: string, type: string = 'general') => {
    setLoading(true);
    try {
      const response = await apiRequest('/ai-helper', {
        method: 'POST',
        body: JSON.stringify({ prompt, type }),
      });
      return response;
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