
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubjects();
    } else {
      setSubjects([]);
      setLoading(false);
    }
  }, [user]);

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching subjects:', error);
      } else {
        setSubjects(data || []);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSubject = async (subject: Omit<Subject, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .insert([{ ...subject, user_id: user?.id }])
        .select()
        .single();

      if (error) {
        console.error('Error creating subject:', error);
        return { error };
      }

      setSubjects(prev => [data, ...prev]);
      return { data, error: null };
    } catch (error) {
      console.error('Error creating subject:', error);
      return { error };
    }
  };

  const updateSubject = async (id: string, updates: Partial<Subject>) => {
    try {
      const { error } = await supabase
        .from('subjects')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating subject:', error);
        return { error };
      }

      await fetchSubjects();
      return { error: null };
    } catch (error) {
      console.error('Error updating subject:', error);
      return { error };
    }
  };

  const deleteSubject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting subject:', error);
        return { error };
      }

      setSubjects(prev => prev.filter(subject => subject.id !== id));
      return { error: null };
    } catch (error) {
      console.error('Error deleting subject:', error);
      return { error };
    }
  };

  return {
    subjects,
    loading,
    createSubject,
    updateSubject,
    deleteSubject,
    refetch: fetchSubjects
  };
};
