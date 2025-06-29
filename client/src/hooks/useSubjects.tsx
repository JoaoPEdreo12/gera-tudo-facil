import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { queryClient } from '@/lib/queryClient';
import { useAuth } from './useAuth';

interface Subject {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  color: string;
  priority: number;
  created_at: string;
  updated_at: string;
}

export const useSubjects = () => {
  const { user } = useAuth();
  
  const {
    data: subjects = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const createSubjectMutation = useMutation({
    mutationFn: async (subjectData: Omit<Subject, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('subjects')
        .insert([subjectData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });

  const updateSubjectMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Subject>) => {
      const { data, error } = await supabase
        .from('subjects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });

  const deleteSubjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });

  return {
    subjects,
    loading,
    error,
    createSubject: createSubjectMutation.mutateAsync,
    updateSubject: updateSubjectMutation.mutateAsync,
    deleteSubject: deleteSubjectMutation.mutateAsync,
    isCreating: createSubjectMutation.isPending,
    isUpdating: updateSubjectMutation.isPending,
    isDeleting: deleteSubjectMutation.isPending,
  };
};