import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { queryClient } from '@/lib/queryClient';
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
  
  const {
    data: flashcards = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['flashcards'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const createFlashcardMutation = useMutation({
    mutationFn: async (flashcardData: Omit<Flashcard, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('flashcards')
        .insert([flashcardData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards'] });
    },
  });

  const updateFlashcardMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Flashcard>) => {
      const { data, error } = await supabase
        .from('flashcards')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards'] });
    },
  });

  const deleteFlashcardMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards'] });
    },
  });

  const reviewFlashcardMutation = useMutation({
    mutationFn: async ({ id, correct }: { id: string; correct: boolean }) => {
      const flashcard = flashcards.find(f => f.id === id);
      if (!flashcard) throw new Error('Flashcard not found');

      const reviewCount = flashcard.review_count + 1;
      const correctCount = correct ? flashcard.correct_count + 1 : flashcard.correct_count;
      
      // Calculate next review date based on difficulty and performance
      const currentDate = new Date();
      let daysToAdd = flashcard.difficulty;
      
      if (correct) {
        daysToAdd = Math.min(daysToAdd * 2, 30); // Max 30 days
      } else {
        daysToAdd = Math.max(1, Math.floor(daysToAdd / 2)); // Min 1 day
      }
      
      const nextReviewDate = new Date(currentDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

      const { data, error } = await supabase
        .from('flashcards')
        .update({
          review_count: reviewCount,
          correct_count: correctCount,
          next_review_date: nextReviewDate.toISOString().split('T')[0],
          difficulty: correct ? Math.min(flashcard.difficulty + 1, 5) : Math.max(flashcard.difficulty - 1, 1)
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards'] });
    },
  });

  return {
    flashcards,
    loading,
    error,
    createFlashcard: createFlashcardMutation.mutateAsync,
    updateFlashcard: updateFlashcardMutation.mutateAsync,
    deleteFlashcard: deleteFlashcardMutation.mutateAsync,
    reviewFlashcard: reviewFlashcardMutation.mutateAsync,
    isCreating: createFlashcardMutation.isPending,
    isUpdating: updateFlashcardMutation.isPending,
    isDeleting: deleteFlashcardMutation.isPending,
    isReviewing: reviewFlashcardMutation.isPending,
  };
};