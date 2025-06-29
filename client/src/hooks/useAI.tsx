import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
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
      return await apiRequest('/api/ai-study-helper', {
        method: 'POST',
        body: JSON.stringify({
          action: 'generate_schedule',
          data: request
        }),
      });
    }
  });

  const generateFeedbackMutation = useMutation({
    mutationFn: async (userData: any): Promise<AIFeedbackResponse> => {
      return await apiRequest('/api/ai-study-helper', {
        method: 'POST',
        body: JSON.stringify({
          action: 'generate_feedback',
          data: userData
        }),
      });
    }
  });

  const generateReportMutation = useMutation({
    mutationFn: async (period: 'week' | 'month'): Promise<AIReportResponse> => {
      return await apiRequest('/api/ai-study-helper', {
        method: 'POST',
        body: JSON.stringify({
          action: 'generate_report',
          data: { period }
        }),
      });
    }
  });

  const replanScheduleMutation = useMutation({
    mutationFn: async (adjustments: any): Promise<AIScheduleResponse> => {
      return await apiRequest('/api/ai-study-helper', {
        method: 'POST',
        body: JSON.stringify({
          action: 'replan_schedule',
          data: adjustments
        }),
      });
    }
  });

  const generateFlashcardsMutation = useMutation({
    mutationFn: async (topic: { subject: string; content: string }) => {
      return await apiRequest('/api/ai-study-helper', {
        method: 'POST',
        body: JSON.stringify({
          action: 'generate_flashcards',
          data: topic
        }),
      });
    }
  });

  const explainConceptMutation = useMutation({
    mutationFn: async (concept: { subject: string; topic: string; level: 'basic' | 'intermediate' | 'advanced' }) => {
      return await apiRequest('/api/ai-study-helper', {
        method: 'POST',
        body: JSON.stringify({
          action: 'explain_concept',
          data: concept
        }),
      });
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