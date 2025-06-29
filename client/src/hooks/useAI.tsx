import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface AIScheduleRequest {
  subjects: Array<{
    id: string;
    name: string;
    priority: number;
    color: string;
  }>;
  availableHoursPerDay: number;
  studyGoals: string;
  currentProgress: any;
  preferences: {
    studyDuration: number;
    breakDuration: number;
    preferredTimes: string[];
  };
}

interface AIScheduleResponse {
  schedule: Array<{
    date: string;
    time: string;
    duration: number;
    subject: string;
    type: 'study' | 'review' | 'exercise';
    priority: number;
    description: string;
  }>;
  recommendations: string[];
  analysis: {
    totalHours: number;
    subjectDistribution: Record<string, number>;
    suggestions: string[];
  };
}

interface AIFeedbackResponse {
  motivationalMessage: string;
  streakInfo: {
    current: number;
    message: string;
  };
  performanceAnalysis: {
    strongSubjects: string[];
    needsAttention: string[];
    recommendations: string[];
  };
  nextSteps: string[];
}

interface AIReportResponse {
  summary: {
    totalStudyTime: number;
    completionRate: number;
    consistencyScore: number;
  };
  subjectAnalysis: Array<{
    subject: string;
    timeSpent: number;
    completionRate: number;
    trend: 'improving' | 'stable' | 'declining';
  }>;
  insights: string[];
  recommendations: string[];
}

export const useAI = () => {
  const { user } = useAuth();

  const generateScheduleMutation = useMutation({
    mutationFn: async (request: AIScheduleRequest): Promise<AIScheduleResponse> => {
      const { data, error } = await supabase.functions.invoke('ai-study-helper', {
        body: {
          action: 'generate_schedule',
          userId: user?.id,
          data: request
        }
      });

      if (error) throw error;
      return data;
    }
  });

  const generateFeedbackMutation = useMutation({
    mutationFn: async (userData: any): Promise<AIFeedbackResponse> => {
      const { data, error } = await supabase.functions.invoke('ai-study-helper', {
        body: {
          action: 'generate_feedback',
          userId: user?.id,
          data: userData
        }
      });

      if (error) throw error;
      return data;
    }
  });

  const generateReportMutation = useMutation({
    mutationFn: async (period: 'week' | 'month'): Promise<AIReportResponse> => {
      const { data, error } = await supabase.functions.invoke('ai-study-helper', {
        body: {
          action: 'generate_report',
          userId: user?.id,
          data: { period }
        }
      });

      if (error) throw error;
      return data;
    }
  });

  const replanScheduleMutation = useMutation({
    mutationFn: async (adjustments: any): Promise<AIScheduleResponse> => {
      const { data, error } = await supabase.functions.invoke('ai-study-helper', {
        body: {
          action: 'replan_schedule',
          userId: user?.id,
          data: adjustments
        }
      });

      if (error) throw error;
      return data;
    }
  });

  const generateFlashcardsMutation = useMutation({
    mutationFn: async (topic: { subject: string; content: string }) => {
      const { data, error } = await supabase.functions.invoke('ai-study-helper', {
        body: {
          action: 'generate_flashcards',
          userId: user?.id,
          data: topic
        }
      });

      if (error) throw error;
      return data;
    }
  });

  const explainConceptMutation = useMutation({
    mutationFn: async (concept: { subject: string; topic: string; level: 'basic' | 'intermediate' | 'advanced' }) => {
      const { data, error } = await supabase.functions.invoke('ai-study-helper', {
        body: {
          action: 'explain_concept',
          userId: user?.id,
          data: concept
        }
      });

      if (error) throw error;
      return data;
    }
  });

  return {
    generateSchedule: generateScheduleMutation.mutateAsync,
    generateFeedback: generateFeedbackMutation.mutateAsync,
    generateReport: generateReportMutation.mutateAsync,
    replanSchedule: replanScheduleMutation.mutateAsync,
    generateFlashcards: generateFlashcardsMutation.mutateAsync,
    explainConcept: explainConceptMutation.mutateAsync,
    
    isGeneratingSchedule: generateScheduleMutation.isPending,
    isGeneratingFeedback: generateFeedbackMutation.isPending,
    isGeneratingReport: generateReportMutation.isPending,
    isReplanning: replanScheduleMutation.isPending,
    isGeneratingFlashcards: generateFlashcardsMutation.isPending,
    isExplaining: explainConceptMutation.isPending,
  };
};