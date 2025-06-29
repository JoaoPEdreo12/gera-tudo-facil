
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Flashcard {
  id: string;
  user_id: string;
  subject_id: string | null;
  topic_id: string | null;
  question: string;
  answer: string;
  difficulty: number;
  next_review_date: string;
  review_count: number;
  correct_count: number;
  created_at: string;
  updated_at: string;
}

export const useFlashcards = () => {
  const { user } = useAuth();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFlashcards();
    } else {
      setFlashcards([]);
      setLoading(false);
    }
  }, [user]);

  const fetchFlashcards = async () => {
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching flashcards:', error);
      } else {
        setFlashcards(data || []);
      }
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    } finally {
      setLoading(false);
    }
  };

  const createFlashcard = async (flashcard: Omit<Flashcard, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'review_count' | 'correct_count'>) => {
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .insert([{ ...flashcard, user_id: user?.id }])
        .select()
        .single();

      if (error) {
        console.error('Error creating flashcard:', error);
        return { error };
      }

      setFlashcards(prev => [data, ...prev]);
      return { data, error: null };
    } catch (error) {
      console.error('Error creating flashcard:', error);
      return { error };
    }
  };

  const updateFlashcard = async (id: string, updates: Partial<Flashcard>) => {
    try {
      const { error } = await supabase
        .from('flashcards')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating flashcard:', error);
        return { error };
      }

      await fetchFlashcards();
      return { error: null };
    } catch (error) {
      console.error('Error updating flashcard:', error);
      return { error };
    }
  };

  const deleteFlashcard = async (id: string) => {
    try {
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting flashcard:', error);
        return { error };
      }

      setFlashcards(prev => prev.filter(card => card.id !== id));
      return { error: null };
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      return { error };
    }
  };

  return {
    flashcards,
    loading,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    refetch: fetchFlashcards
  };
};
