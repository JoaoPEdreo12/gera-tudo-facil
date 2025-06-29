import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface StudySession {
  id: string;
  userId: string;
  subjectId: string | null;
  topicId: string | null;
  title: string;
  description: string | null;
  scheduledDate: string;
  scheduledTime: string | null;
  durationMinutes: number;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  priority: number;
  type: 'study' | 'review' | 'exercise' | 'exam';
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const useStudySessions = () => {
  const {
    data: sessions = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['/study-sessions'],
    enabled: !!localStorage.getItem('authToken'),
  });

  const createSessionMutation = useMutation({
    mutationFn: (sessionData: Partial<StudySession>) =>
      apiRequest('/study-sessions', {
        method: 'POST',
        body: JSON.stringify(sessionData),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/study-sessions'] });
    },
  });

  const updateSessionMutation = useMutation({
    mutationFn: ({ id, ...updates }: { id: string } & Partial<StudySession>) =>
      apiRequest(`/study-sessions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/study-sessions'] });
    },
  });

  const completeSessionMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/study-sessions/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ 
          status: 'completed',
          completedAt: new Date().toISOString()
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/study-sessions'] });
    },
  });

  const deleteSessionMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/study-sessions/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/study-sessions'] });
    },
  });

  return {
    sessions,
    loading,
    error,
    createSession: createSessionMutation.mutateAsync,
    updateSession: updateSessionMutation.mutateAsync,
    completeSession: completeSessionMutation.mutateAsync,
    deleteSession: deleteSessionMutation.mutateAsync,
    isCreating: createSessionMutation.isPending,
    isUpdating: updateSessionMutation.isPending,
    isDeleting: deleteSessionMutation.isPending,
  };
};