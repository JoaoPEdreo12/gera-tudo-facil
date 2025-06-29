
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSessions();
    } else {
      setSessions([]);
      setLoading(false);
    }
  }, [user]);

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user?.id)
        .order('scheduled_date', { ascending: true });

      if (error) {
        console.error('Error fetching sessions:', error);
      } else {
        setSessions(data || []);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSession = async (session: Omit<StudySession, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .insert([{ ...session, user_id: user?.id }])
        .select()
        .single();

      if (error) {
        console.error('Error creating session:', error);
        return { error };
      }

      setSessions(prev => [...prev, data]);
      return { data, error: null };
    } catch (error) {
      console.error('Error creating session:', error);
      return { error };
    }
  };

  const updateSession = async (id: string, updates: Partial<StudySession>) => {
    try {
      const { error } = await supabase
        .from('study_sessions')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating session:', error);
        return { error };
      }

      await fetchSessions();
      return { error: null };
    } catch (error) {
      console.error('Error updating session:', error);
      return { error };
    }
  };

  const completeSession = async (id: string) => {
    try {
      const { error } = await supabase
        .from('study_sessions')
        .update({ 
          status: 'completed', 
          completed_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) {
        console.error('Error completing session:', error);
        return { error };
      }

      await fetchSessions();
      return { error: null };
    } catch (error) {
      console.error('Error completing session:', error);
      return { error };
    }
  };

  return {
    sessions,
    loading,
    createSession,
    updateSession,
    completeSession,
    refetch: fetchSessions
  };
};
