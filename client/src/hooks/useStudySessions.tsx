import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { queryClient } from '@/lib/queryClient';
import { useAuth } from './useAuth';

interface StudySession {
  id: string;
  user_id: string;
  subject_id: string | null;
  topic_id: string | null;
  title: string;
  description: string | null;
  scheduled_date: string;
  scheduled_time: string | null;
  duration_minutes: number;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  priority: number;
  type: 'study' | 'review' | 'exercise' | 'exam';
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useStudySessions = () => {
  const { user } = useAuth();
  
  const {
    data: sessions = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['study-sessions'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('scheduled_date', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const createSessionMutation = useMutation({
    mutationFn: async (sessionData: Omit<StudySession, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('study_sessions')
        .insert([sessionData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-sessions'] });
    },
  });

  const updateSessionMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<StudySession>) => {
      const { data, error } = await supabase
        .from('study_sessions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-sessions'] });
    },
  });

  const deleteSessionMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('study_sessions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-sessions'] });
    },
  });

  const completeSessionMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('study_sessions')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-sessions'] });
    },
  });

  return {
    sessions,
    loading,
    error,
    createSession: createSessionMutation.mutateAsync,
    updateSession: updateSessionMutation.mutateAsync,
    deleteSession: deleteSessionMutation.mutateAsync,
    completeSession: completeSessionMutation.mutateAsync,
    isCreating: createSessionMutation.isPending,
    isUpdating: updateSessionMutation.isPending,
    isDeleting: deleteSessionMutation.isPending,
    isCompleting: completeSessionMutation.isPending,
  };
};