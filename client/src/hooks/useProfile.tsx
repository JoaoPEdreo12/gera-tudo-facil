import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { queryClient } from '@/lib/queryClient';
import { useAuth } from './useAuth';

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface UserProgress {
  id: string;
  user_id: string;
  total_points: number;
  level: number;
  streak_days: number;
  last_study_date: string | null;
  total_study_time_minutes: number;
  completed_sessions: number;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  
  const {
    data: profileData,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      if (!user) return null;
      
      const [profileResponse, progressResponse] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).single(),
        supabase.from('user_progress').select('*').eq('user_id', user.id).single()
      ]);
      
      if (profileResponse.error && profileResponse.error.code !== 'PGRST116') {
        throw profileResponse.error;
      }
      
      if (progressResponse.error && progressResponse.error.code !== 'PGRST116') {
        throw progressResponse.error;
      }
      
      return {
        profile: profileResponse.data,
        progress: progressResponse.data
      };
    },
    enabled: !!user,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('profiles')
        .upsert({ user_id: user.id, ...updates })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const updateProgressMutation = useMutation({
    mutationFn: async (updates: Partial<UserProgress>) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('user_progress')
        .upsert({ user_id: user.id, ...updates })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  return {
    profile: profileData?.profile,
    progress: profileData?.progress,
    loading,
    error,
    updateProfile: updateProfileMutation.mutateAsync,
    updateProgress: updateProgressMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    isUpdatingProgress: updateProgressMutation.isPending,
  };
};